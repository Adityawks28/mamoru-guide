import { createSprite, updateSprite, type Pose } from './sprite';
import { QUAKE_TIPS } from './tips';
import { motionAllowed, onMotionChange, playQuake, quakeMs } from './motion';

const STATE_LOCK_MS = 4000;
const TIP_INTERVAL_MS = 4500;
const STEP_MS = 90;
const STEP_UNITS = 6;
const SETTLE_MS = 1200;
const SVG_NS = 'http://www.w3.org/2000/svg';

interface IntensityTarget { pose: Pose; x: number; y: number; flip: boolean; }

// Indexed by row on the 10-step scale: 0 1 2 3 4 5- 5+ 6- 6+ 7.
const STAND: IntensityTarget = { pose: 'stand', x: 140, y: 92, flip: false };
// 'cower' (scale 0.5 + crouchY 42) tucks her under the table cavity (room
// y 126-160); y=77 crowns her head at ~126 with her feet at ~163.
const UNDER_TABLE: IntensityTarget = { pose: 'cower', x: 210, y: 77, flip: true };
const COVER: IntensityTarget = { pose: 'cover', x: 175, y: 100, flip: false };
const TARGETS: IntensityTarget[] = [
  STAND, STAND, { ...STAND, x: 138 },
  { pose: 'stand', x: 165, y: 92, flip: true },
  { pose: 'brace', x: 158, y: 92, flip: true },
  COVER, COVER,
  UNDER_TABLE, UNDER_TABLE, UNDER_TABLE,
];

interface Hazards {
  lampSwing: number;
  bookFall: boolean;
  vaseFall: boolean;
  windowCrack: boolean;
  shelfFall: boolean;
  doorGlow: boolean;
  warning: boolean;
}

// What falls at each level follows JMA's shindo descriptions: 4 topples
// unstable ornaments, 5- drops dishes and books, 5+ can topple unsecured
// furniture, 6- breaks window glass.
function hazardsForIntensity(i: number): Hazards {
  return {
    lampSwing: Math.min(5, Math.ceil(i / 2)),
    bookFall: i >= 4,
    vaseFall: i >= 5,
    shelfFall: i >= 6,
    windowCrack: i >= 7,
    doorGlow: i >= 4,
    warning: i >= 5,
  };
}

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K, attrs: Record<string, string | number> = {}, parent?: SVGElement,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  if (parent) parent.appendChild(e);
  return e;
}

function svgRect(parent: SVGElement, x: number, y: number, w: number, h: number, fill: string, opts: { opacity?: number; stroke?: string; strokeWidth?: number } = {}): SVGRectElement {
  const attrs: Record<string, string | number> = { x, y, width: w, height: h, fill };
  if (opts.opacity !== undefined) attrs.opacity = opts.opacity;
  if (opts.stroke) attrs.stroke = opts.stroke;
  if (opts.strokeWidth) attrs['stroke-width'] = opts.strokeWidth;
  return svgEl('rect', attrs, parent);
}

interface RoomParts {
  shelfGroup: SVGGElement;
  vaseStill: SVGGElement;
  vaseFalling: SVGGElement;
  bookStill: SVGGElement;
  bookFalling: SVGGElement;
  windowCrack: SVGGElement;
  doorGlow: SVGGElement;
  warningGroup: SVGGElement;
  pictureFrame: SVGGElement;
  lamp: SVGGElement;
  tableGroup: SVGGElement;
}

function buildStaticRoom(shakeGroup: SVGGElement): RoomParts {
  // Back wall + tatami.
  svgRect(shakeGroup, 0, 0, 320, 160, '#2a4070');
  svgRect(shakeGroup, 0, 158, 320, 2, '#1a2545');
  svgRect(shakeGroup, 0, 160, 320, 60, '#7a5a30');
  for (let i = 0; i < 6; i++) svgRect(shakeGroup, i * 54, 160, 2, 60, '#5a3a18');
  svgRect(shakeGroup, 0, 160, 320, 2, '#9a7a48');

  // Window with optional crack.
  svgRect(shakeGroup, 40, 20, 60, 50, '#0a1a3a');
  svgRect(shakeGroup, 40, 20, 60, 50, 'none', { stroke: '#f5d5a8', strokeWidth: 3 });
  svgRect(shakeGroup, 68, 20, 2, 50, '#f5d5a8');
  svgRect(shakeGroup, 40, 42, 60, 2, '#f5d5a8');
  svgRect(shakeGroup, 78, 28, 8, 8, '#f0e8c0', { opacity: 0.7 });
  const windowCrack = svgEl('g', { stroke: '#f6f4ef', 'stroke-width': 0.8, fill: 'none' }, shakeGroup);
  for (const d of [
    'M 50 25 L 60 40 L 55 55 L 70 50 L 90 60',
    'M 60 40 L 80 35',
    'M 55 55 L 45 65',
  ]) svgEl('path', { d }, windowCrack);
  windowCrack.style.display = 'none';

  // Picture frame.
  const pictureFrame = svgEl('g', { transform: 'translate(220 30)' }, shakeGroup);
  svgRect(pictureFrame, 0, 0, 50, 36, '#5a3818');
  svgRect(pictureFrame, 3, 3, 44, 30, '#8aaa6a');
  svgRect(pictureFrame, 6, 20, 38, 13, '#3a5a2a');
  svgEl('circle', { cx: 40, cy: 10, r: 3, fill: '#f5d5a8' }, pictureFrame);

  // Hanging lamp.
  const lamp = svgEl('g', { class: 'mr-lamp' }, shakeGroup);
  svgRect(lamp, 158, 0, 4, 40, '#3a2818');
  svgRect(lamp, 148, 38, 24, 14, '#f5a623');
  svgRect(lamp, 150, 40, 20, 10, '#ffd070');
  svgRect(lamp, 148, 50, 24, 2, '#8a5a18');

  // Shelf + items.
  const shelfGroup = svgEl('g', { class: 'mr-shelf' }, shakeGroup);
  svgRect(shelfGroup, 6, 80, 40, 80, '#5a3818');
  svgRect(shelfGroup, 6, 80, 40, 3, '#3a1808');
  svgRect(shelfGroup, 8, 86, 36, 2, '#3a1808');
  svgRect(shelfGroup, 8, 110, 36, 2, '#3a1808');
  svgRect(shelfGroup, 8, 134, 36, 2, '#3a1808');
  svgRect(shelfGroup, 10, 90, 4, 20, '#c43818');
  svgRect(shelfGroup, 15, 90, 4, 20, '#3a6aaa');
  svgRect(shelfGroup, 20, 92, 4, 18, '#5a8a4a');
  svgRect(shelfGroup, 25, 90, 4, 20, '#aa6a18');
  const vaseStill = svgEl('g', {}, shelfGroup);
  svgRect(vaseStill, 32, 68, 10, 12, '#4a8aba');
  svgRect(vaseStill, 34, 64, 6, 6, '#4a8aba');
  svgRect(vaseStill, 32, 68, 2, 12, '#2a5a8a');

  const vaseFalling = svgEl('g', { class: 'mr-vase-fall' }, shakeGroup);
  svgRect(vaseFalling, 50, 155, 3, 3, '#4a8aba');
  svgRect(vaseFalling, 56, 156, 2, 2, '#4a8aba');
  svgRect(vaseFalling, 60, 158, 3, 2, '#2a5a8a');
  svgRect(vaseFalling, 66, 155, 2, 3, '#4a8aba');
  vaseFalling.style.display = 'none';

  // Table.
  const tableGroup = svgEl('g', { class: 'mr-table' }, shakeGroup);
  svgRect(tableGroup, 180, 120, 80, 6, '#7a4818');
  svgRect(tableGroup, 180, 120, 80, 2, '#9a6828');
  svgRect(tableGroup, 184, 126, 6, 34, '#5a3008');
  svgRect(tableGroup, 250, 126, 6, 34, '#5a3008');
  const bookStill = svgEl('g', {}, tableGroup);
  svgRect(bookStill, 200, 112, 14, 8, '#c43818');
  svgRect(bookStill, 200, 112, 14, 2, '#f5a623');

  const bookFalling = svgEl('g', { class: 'mr-book-fall' }, shakeGroup);
  svgRect(bookFalling, 195, 156, 14, 4, '#c43818');
  bookFalling.style.display = 'none';

  // Door.
  svgRect(shakeGroup, 280, 60, 34, 100, '#5a3818');
  svgRect(shakeGroup, 280, 60, 34, 3, '#3a1808');
  svgRect(shakeGroup, 282, 62, 30, 96, '#7a4818');
  svgRect(shakeGroup, 306, 108, 3, 6, '#ffd070');

  const doorGlow = svgEl('g', { class: 'mr-door-glow' }, shakeGroup);
  svgRect(doorGlow, 278, 58, 38, 104, 'none', { stroke: '#f5a623', strokeWidth: 1, opacity: 0.6 });
  doorGlow.style.display = 'none';

  // Warning near window.
  const warningGroup = svgEl('g', { class: 'mr-warning' }, shakeGroup);
  svgEl('path', { d: 'M 28 70 Q 30 78 26 84', stroke: '#e84040', 'stroke-width': 1.5, fill: 'none', 'stroke-dasharray': '2 2' }, warningGroup);
  const warningText = svgEl('text', { x: 6, y: 76, fill: '#e84040', 'font-size': 6, 'font-family': "'Press Start 2P', monospace" }, warningGroup);
  warningText.textContent = 'AVOID';
  warningGroup.style.display = 'none';

  return { shelfGroup, vaseStill, vaseFalling, bookStill, bookFalling, windowCrack, doorGlow, warningGroup, pictureFrame, lamp, tableGroup };
}

const CALM = { en: '→ stay calm, observe', ja: '→ 落ち着いて様子を見る', id: '→ tenang, amati situasi' };
const DROP = { en: '→ drop, cover, hold on', ja: '→ 落ちて・隠れて・待機', id: '→ tiarap, lindungi, tahan' };
const HIDE = { en: '→ hide under sturdy table', ja: '→ 頑丈な机の下に隠れる', id: '→ sembunyi di bawah meja kokoh' };
const PROCEDURE_TEXT: { en: string; ja: string; id: string }[] = [
  CALM, CALM, CALM,
  { en: '→ move from windows', ja: '→ 窓から離れる', id: '→ menjauh dari jendela' },
  { en: '→ brace · open the door', ja: '→ 構え・ドアを開ける', id: '→ siaga · buka pintu' },
  DROP, DROP, HIDE, HIDE,
  { en: '→ hide · protect head · stay until still', ja: '→ 隠れて・頭を守って・揺れがおさまるまで', id: '→ sembunyi · lindungi kepala · tunggu hingga reda' },
];

export function initEarthquakeScene(): void {
  const host = document.getElementById('earthquake-scene');
  if (!host) return;

  let allowed = motionAllowed();
  let intensity = 0;
  let timers: number[] = [];
  let lockTimer: number | null = null;
  let tipIdx = 0;
  let tipTimer: number | null = null;
  let stateLocked = false;
  let actorX = STAND.x;

  host.classList.add('mamoru-room');
  host.innerHTML = '';

  const stage = document.createElement('div');
  stage.className = 'mr-stage';
  host.appendChild(stage);

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'mr-svg');
  svg.setAttribute('viewBox', '0 0 320 220');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('shape-rendering', 'crispEdges');
  stage.appendChild(svg);

  svgRect(svg as unknown as SVGElement, 0, 0, 320, 220, '#1a2f55');

  const shakeGroup = svgEl('g', {}, svg as unknown as SVGElement);
  const parts = buildStaticRoom(shakeGroup);

  // Actor — nested character SVG anchored top-left at the actor group's translate
  // (matches prototype: target.y is the SPRITE TOP, not its center).
  const actorGroup = svgEl('g', { class: 'mr-actor', transform: `translate(${STAND.x},${STAND.y})` }, shakeGroup);
  const actorSvg = createSprite({ pose: 'stand', gender: 'female' });
  actorSvg.setAttribute('width', '64');
  actorSvg.setAttribute('height', '96');
  actorGroup.appendChild(actorSvg);

  // Tip bubble (CSS pins it top-right inside .mamoru-room).
  const bubble = document.createElement('div');
  bubble.className = 'tip-bubble';
  const en = document.createElement('span'); en.dataset.lang = 'en';
  const ja = document.createElement('span'); ja.dataset.lang = 'ja';
  const id = document.createElement('span'); id.dataset.lang = 'id';
  bubble.append(en, ja, id);
  host.appendChild(bubble);

  // Procedure text strip.
  const procedure = document.createElement('div');
  procedure.className = 'mr-procedure';
  const procEn = document.createElement('span'); procEn.dataset.lang = 'en';
  const procJa = document.createElement('span'); procJa.dataset.lang = 'ja';
  const procId = document.createElement('span'); procId.dataset.lang = 'id';
  procedure.append(procEn, procJa, procId);
  host.appendChild(procedure);

  function showTip(i: number): void {
    const t = QUAKE_TIPS[i % QUAKE_TIPS.length];
    en.textContent = t.en;
    ja.textContent = t.ja;
    id.textContent = t.id;
  }
  function showProcedure(i: number): void {
    const p = PROCEDURE_TEXT[i] ?? PROCEDURE_TEXT[0];
    procEn.textContent = p.en;
    procJa.textContent = p.ja;
    procId.textContent = p.id;
  }
  showTip(0);
  showProcedure(0);

  function later(ms: number, fn: () => void): void {
    timers.push(window.setTimeout(fn, ms));
  }
  function clearTimers(): void {
    timers.forEach(t => window.clearTimeout(t));
    timers = [];
  }

  // Hiding under the table: the table draws on top of her. Otherwise she
  // stands in front of the furniture.
  function applyDepth(hiding: boolean): void {
    const parent = parts.tableGroup.parentNode;
    if (!parent) return;
    const actorIsBeforeTable = !!(actorGroup.compareDocumentPosition(parts.tableGroup) & Node.DOCUMENT_POSITION_FOLLOWING);
    if (hiding && !actorIsBeforeTable) {
      parent.insertBefore(actorGroup, parts.tableGroup);
    } else if (!hiding && actorIsBeforeTable) {
      parent.insertBefore(actorGroup, parts.tableGroup.nextSibling);
    }
  }

  function applyHazards(i: number): void {
    const h = hazardsForIntensity(i);
    parts.windowCrack.style.display = h.windowCrack ? '' : 'none';
    parts.doorGlow.style.display    = h.doorGlow    ? '' : 'none';
    parts.warningGroup.style.display = h.warning    ? '' : 'none';
    parts.vaseStill.style.display   = h.vaseFall    ? 'none' : '';
    parts.vaseFalling.style.display = h.vaseFall    ? '' : 'none';
    parts.bookStill.style.display   = h.bookFall    ? 'none' : '';
    parts.bookFalling.style.display = h.bookFall    ? '' : 'none';
    parts.shelfGroup.classList.toggle('fallen', h.shelfFall);
    parts.pictureFrame.setAttribute('transform', `translate(220 30) rotate(${i >= 4 ? -8 : 0})`);
  }

  function place(t: IntensityTarget): void {
    actorX = t.x;
    actorGroup.setAttribute('transform', `translate(${t.x},${t.y})`);
    updateSprite(actorSvg, { pose: t.pose, flip: t.flip });
    applyDepth(t.pose === 'cower');
  }

  // Two-frame walk cycle: a few room pixels per step, bobbing one pixel.
  function walkTo(t: IntensityTarget): void {
    const dir = Math.sign(t.x - actorX);
    if (!allowed || dir === 0) { place(t); return; }
    applyDepth(false);
    let frame = 0;
    const step = (): void => {
      actorX = dir > 0 ? Math.min(t.x, actorX + STEP_UNITS) : Math.max(t.x, actorX - STEP_UNITS);
      frame++;
      if (actorX === t.x) { place(t); return; }
      actorGroup.setAttribute('transform', `translate(${actorX},${STAND.y - frame % 2})`);
      updateSprite(actorSvg, { pose: frame % 2 ? 'walk' : 'run', flip: dir > 0 });
      later(STEP_MS, step);
    };
    step();
  }

  // Each tap replays that level's quake from a calm room.
  function quake(i: number): void {
    intensity = i;
    clearTimers();
    showProcedure(i);
    showTip(Math.min(i, QUAKE_TIPS.length - 1));
    if (lockTimer !== null) window.clearTimeout(lockTimer);
    stateLocked = true;
    lockTimer = window.setTimeout(() => { stateLocked = false; }, STATE_LOCK_MS);
    walkTo(TARGETS[i]);
    if (!allowed) { applyHazards(i); return; }
    applyHazards(0);
    host!.classList.toggle('quaking', i > 0);
    if (i === 0) return;
    const ms = quakeMs(i);
    playQuake(shakeGroup, i);
    parts.lamp.style.setProperty('--swing', String(hazardsForIntensity(i).lampSwing));
    later(ms * 0.3, () => applyHazards(i)); // things fall at the S-wave's peak
    later(ms, () => parts.lamp.style.setProperty('--swing', '1'));
    later(ms + SETTLE_MS, () => host!.classList.remove('quaking'));
  }

  function onShindo(e: Event): void {
    const n = (e as CustomEvent<{ shindo: number }>).detail.shindo;
    quake(Math.max(0, Math.min(TARGETS.length - 1, n)));
  }

  function rotateTip(): void {
    if (stateLocked) return;
    tipIdx = (tipIdx + 1) % QUAKE_TIPS.length;
    showTip(tipIdx);
  }

  function applyMotion(now: boolean): void {
    allowed = now;
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    if (allowed) {
      tipTimer = window.setInterval(rotateTip, TIP_INTERVAL_MS);
      return;
    }
    clearTimers();
    shakeGroup.getAnimations?.().forEach(a => a.cancel());
    host!.classList.remove('quaking');
    applyHazards(intensity);
    place(TARGETS[intensity]);
  }

  applyHazards(0);
  place(STAND);
  document.addEventListener('mamoru:shindo', onShindo);
  applyMotion(allowed);
  onMotionChange(applyMotion);
}
