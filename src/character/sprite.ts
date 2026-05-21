export type Pose =
  | 'stand' | 'brace' | 'cover' | 'hide' | 'headcover'
  | 'crouch' | 'kneel' | 'run' | 'walk' | 'tired'
  | 'phone' | 'reach' | 'thrust' | 'choke';
export type Gender = 'male' | 'female';
export type Emote =
  | 'idle' | 'wave' | 'jump' | 'spin' | 'peace' | 'burst' | 'bow';

export const POSES: Pose[] = [
  'stand', 'brace', 'cover', 'hide', 'headcover',
  'crouch', 'kneel', 'run', 'walk', 'tired',
  'phone', 'reach', 'thrust', 'choke',
];

export interface SpriteOptions {
  pose: Pose;
  gender: Gender;
  emote?: Emote;
  flip?: boolean;
  tilt?: number;
  blink?: boolean;
  pupil?: { x: number; y: number };
}

const PALETTE = {
  skin: '#f5d5a8',
  skinShadow: '#e0b888',
  hands: '#f0c8a0',
  hair: '#2a1a08',
  hairTip: '#3a2a18',
  earring: '#ffd070',
  ink: '#1a1a1a',
  tee: '#4a8aba',
  teeShadow: '#2a5a8a',
  pants: '#1a1a3a',
  pantsShadow: '#0a0a1a',
  persimmon: '#f5a623',
  eyeWhite: '#ffffff',
} as const;

const SVG_NS = 'http://www.w3.org/2000/svg';

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    e.setAttribute(k, String(v));
  }
  return e;
}

function rect(x: number, y: number, w: number, h: number, fill: string, opacity?: number): SVGRectElement {
  const r = el('rect', { x, y, width: w, height: h, fill });
  if (opacity !== undefined) r.setAttribute('opacity', String(opacity));
  return r;
}

function armRotations(pose: Pose): [number, number] {
  const L =
    pose === 'headcover' ? -150 :
    pose === 'brace' ? -90 :
    pose === 'cover' ? -130 :
    pose === 'hide'  ? -150 :
    pose === 'crouch' ? -40 :
    pose === 'choke'  ? -140 :
    pose === 'phone'  ? -150 :
    pose === 'reach'  ? -60 :
    pose === 'kneel'  ? -30 :
    pose === 'thrust' ? -100 :
    pose === 'run'    ? -25 :
    pose === 'tired'  ? 10 : 0;
  const R =
    pose === 'headcover' ?  150 :
    pose === 'brace' ?  90 :
    pose === 'cover' ?  130 :
    pose === 'hide'  ?  150 :
    pose === 'crouch' ?  40 :
    pose === 'choke'  ?  140 :
    pose === 'phone'  ?  20 :
    pose === 'reach'  ?  60 :
    pose === 'kneel'  ?  30 :
    pose === 'thrust' ?  100 :
    pose === 'run'    ?  25 :
    pose === 'tired'  ? -10 : 0;
  return [L, R];
}

function crouchTransform(pose: Pose): { y: number; scale: number } {
  const y =
    pose === 'crouch' ? 14 :
    pose === 'hide'   ? 22 :
    pose === 'cover'  ? 18 :
    pose === 'headcover' ? 8 :
    pose === 'kneel'  ? 16 : 0;
  const scale = (pose === 'hide' || pose === 'crouch' || pose === 'kneel') ? 0.85 : 1;
  return { y, scale };
}

function buildBody(parent: SVGGElement, opts: SpriteOptions): void {
  const { pose, gender } = opts;
  const isTired = pose === 'tired';
  const [armL, armR] = armRotations(pose);

  if (pose === 'hide' || pose === 'crouch') {
    parent.append(
      rect(20, 74, 10, 10, PALETTE.pants),
      rect(34, 74, 10, 10, PALETTE.pants),
      rect(18, 82, 14, 4, PALETTE.ink),
      rect(32, 82, 14, 4, PALETTE.ink),
    );
  } else if (pose === 'kneel') {
    parent.append(
      rect(18, 76, 14, 6, PALETTE.pants),
      rect(34, 68, 10, 14, PALETTE.pants),
      rect(16, 80, 18, 4, PALETTE.ink),
      rect(32, 80, 14, 4, PALETTE.ink),
    );
  } else if (pose === 'cover') {
    parent.append(
      rect(18, 68, 12, 14, PALETTE.pants),
      rect(34, 68, 12, 14, PALETTE.pants),
      rect(16, 80, 16, 4, PALETTE.ink),
      rect(32, 80, 16, 4, PALETTE.ink),
    );
  } else {
    parent.append(
      rect(22, 68, 8, 18, PALETTE.pants),
      rect(34, 68, 8, 18, PALETTE.pants),
      rect(22, 68, 2, 18, PALETTE.pantsShadow),
      rect(34, 68, 2, 18, PALETTE.pantsShadow),
      rect(20, 84, 12, 4, PALETTE.ink),
      rect(32, 84, 12, 4, PALETTE.ink),
    );
  }

  parent.append(
    rect(18, 44, 28, 26, PALETTE.tee),
    rect(18, 44, 3, 26, PALETTE.teeShadow),
    rect(43, 44, 3, 26, PALETTE.teeShadow),
    rect(28, 52, 8, 3, PALETTE.persimmon),
    rect(30, 56, 4, 2, PALETTE.persimmon),
  );

  const lArm = el('g', { transform: `rotate(${armL} 20 48)` });
  lArm.append(
    rect(14, 46, 6, 16, PALETTE.tee),
    rect(14, 46, 2, 16, PALETTE.teeShadow),
    rect(13, 60, 8, 6, PALETTE.hands),
  );
  parent.appendChild(lArm);

  const rArm = el('g', { transform: `rotate(${armR} 44 48)` });
  rArm.append(
    rect(44, 46, 6, 16, PALETTE.tee),
    rect(48, 46, 2, 16, PALETTE.teeShadow),
    rect(43, 60, 8, 6, PALETTE.hands),
  );
  parent.appendChild(rArm);

  parent.append(
    rect(22, 22, 20, 22, PALETTE.skin),
    rect(22, 22, 3, 22, PALETTE.skinShadow),
    rect(22, 42, 20, 2, PALETTE.skinShadow),
  );

  if (gender === 'female') {
    parent.append(
      rect(18, 18, 28, 6, PALETTE.hair),
      rect(20, 14, 24, 6, PALETTE.hair),
      rect(24, 12, 16, 4, PALETTE.hair),
      rect(22, 22, 10, 4, PALETTE.hair),
      rect(34, 22, 6, 3, PALETTE.hair),
      rect(18, 24, 5, 22, PALETTE.hair),
      rect(41, 24, 5, 22, PALETTE.hair),
      rect(18, 46, 3, 3, PALETTE.hairTip),
      rect(43, 46, 3, 3, PALETTE.hairTip),
      rect(38, 14, 8, 4, PALETTE.persimmon),
      rect(40, 12, 4, 2, PALETTE.persimmon),
      rect(42, 14, 2, 4, PALETTE.eyeWhite, 0.4),
      rect(20, 34, 2, 2, PALETTE.earring),
      rect(42, 34, 2, 2, PALETTE.earring),
    );
  } else {
    parent.append(
      rect(20, 18, 24, 8, PALETTE.hair),
      rect(22, 16, 20, 4, PALETTE.hair),
      rect(26, 14, 12, 4, PALETTE.hair),
    );
  }

  if (pose === 'hide' || isTired) {
    parent.append(
      rect(26, 32, 4, 1, PALETTE.ink),
      rect(34, 32, 4, 1, PALETTE.ink),
    );
  } else if (pose === 'brace' || pose === 'cover') {
    parent.append(
      rect(26, 30, 4, 4, PALETTE.eyeWhite),
      rect(34, 30, 4, 4, PALETTE.eyeWhite),
      rect(27, 31, 2, 2, PALETTE.ink),
      rect(35, 31, 2, 2, PALETTE.ink),
    );
  } else {
    parent.append(
      rect(27, 31, 2, 2, PALETTE.ink),
      rect(35, 31, 2, 2, PALETTE.ink),
    );
  }

  if (pose === 'brace' || pose === 'cover' || pose === 'hide') {
    parent.appendChild(rect(29, 38, 6, 2, PALETTE.ink));
  } else if (isTired) {
    parent.appendChild(rect(28, 38, 8, 1, PALETTE.ink));
  } else {
    parent.appendChild(rect(30, 38, 4, 1, PALETTE.ink));
  }
}

function fillSvg(svg: SVGSVGElement, opts: SpriteOptions): void {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.dataset.pose = opts.pose;
  svg.dataset.gender = opts.gender;
  if (opts.emote && opts.emote !== 'idle') svg.dataset.emote = opts.emote;
  else delete svg.dataset.emote;
  if (opts.blink) svg.dataset.blink = 'true';
  else delete svg.dataset.blink;

  const { y: crouchY, scale } = crouchTransform(opts.pose);
  const flipScaleX = opts.flip ? -1 : 1;
  const flipTx = opts.flip ? 64 : 0;
  const tilt = opts.tilt ? ` rotate(${opts.tilt} 32 64)` : '';

  const outer = el('g', {
    transform: `translate(${flipTx},${crouchY}) scale(${flipScaleX} ${scale})${tilt}`,
  });
  buildBody(outer, opts);
  svg.appendChild(outer);
}

export function createSprite(opts: SpriteOptions): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
  svg.setAttribute('viewBox', '0 0 64 96');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('width', '64');
  svg.setAttribute('height', '96');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('mamoru-sprite');
  fillSvg(svg, opts);
  return svg;
}

export function updateSprite(svg: SVGSVGElement, partial: Partial<SpriteOptions>): void {
  const next: SpriteOptions = {
    pose: (svg.dataset.pose as Pose) ?? 'stand',
    gender: (svg.dataset.gender as Gender) ?? 'male',
    ...partial,
  };
  fillSvg(svg, next);
}
