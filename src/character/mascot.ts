import { createSprite, updateSprite, type Emote, type SpriteOptions } from './sprite';
import { DISASTER_FACTS } from './tips';
import { motionAllowed, onMotionChange } from './motion';

// Faithful port of prototype mascot.jsx — structure:
//   <#mascot.mascot-wrap>
//     <div class="pixel-bubble fact-bubble">
//       <div class="pb-tag">DID YOU KNOW?</div>
//       <div class="pb-t"><span data-lang="en">…</span></div>
//       <div class="pb-sub"><span data-lang="ja">…</span><span data-lang="id">…</span></div>
//       <div class="pb-cta">→ TAP FOR NEXT</div>
//     </div>
//     <div class="mascot" role="button"> <!-- the clickable sprite -->
//       <svg class="mascot-svg"...> Moru SVG </svg>
//     </div>
//     <div class="mascot-hint">▼ TAP FOR NEXT FACT ▼</div>
//   </#mascot.mascot-wrap>

type Particle = 'star' | 'note' | 'bang' | 'heart' | 'sparkle';
interface Frame extends Partial<SpriteOptions> { ms: number }
interface Reaction { emote: Emote; particle: Particle; frames: Frame[] }

// Each tap plays the next reaction: pose/face frames here, body motion from
// the matching data-emote keyframes in hero-arcade.css.
const UP: [number, number] = [150, -150];
const OUT: [number, number] = [20, -20];
const REACTIONS: Reaction[] = [
  { emote: 'jump', particle: 'star', frames: [
    { arms: OUT, face: 'happy', ms: 100 }, { arms: UP, face: 'happy', ms: 380 }, { arms: OUT, face: 'happy', ms: 140 }] },
  { emote: 'wave', particle: 'note', frames: [
    { arms: [0, -150], face: 'wink', ms: 140 }, { arms: [0, -110], face: 'wink', ms: 140 },
    { arms: [0, -150], face: 'wink', ms: 140 }, { arms: [0, -110], face: 'wink', ms: 140 }, { arms: [0, -150], face: 'wink', ms: 160 }] },
  { emote: 'burst', particle: 'bang', frames: [{ arms: [90, -90], face: 'wow', ms: 620 }] },
  { emote: 'peace', particle: 'heart', frames: [{ arms: [-40, 40], face: 'happy', ms: 680 }] },
  { emote: 'bow', particle: 'sparkle', frames: [
    { arms: [-20, 20], face: undefined, blink: true, ms: 320 }, { arms: UP, face: 'happy', blink: false, ms: 360 }] },
];

// 1 = lit pixel. Drawn 4px per pixel.
const PARTICLES: Record<Particle, { color: string; rows: string[] }> = {
  star:    { color: '#ffe040', rows: ['00100', '01110', '11111', '01010', '10001'] },
  note:    { color: '#4cc9f0', rows: ['00111', '00101', '00100', '01100', '11100', '01000'] },
  bang:    { color: '#e84040', rows: ['11', '11', '11', '11', '00', '11'] },
  heart:   { color: '#f0a0b8', rows: ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'] },
  sparkle: { color: '#fff6c0', rows: ['00100', '00100', '11011', '00100', '00100'] },
};
const PARTICLE_X = [-46, -16, 14, 44];

function particleSvg(kind: Particle): string {
  const { color, rows } = PARTICLES[kind];
  const cells = rows.flatMap((row, y) => [...row].map((c, x) => c === '1' ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : ''));
  return `<svg viewBox="0 0 ${rows[0].length} ${rows.length}" width="${rows[0].length * 4}" height="${rows.length * 4}" shape-rendering="crispEdges" fill="${color}">${cells.join('')}</svg>`;
}
const FACT_INTERVAL_MS = 8000;
const BLINK_MIN_MS = 2400;
const BLINK_MAX_MS = 6000;
const BLINK_DURATION_MS = 130;

export function initMascot(): void {
  const host = document.getElementById('mascot');
  if (!host) return;

  let factIdx = 0;
  let reactionIdx = -1;
  let reactionTimers: number[] = [];
  let lastPupil = '';
  let factTimer: number | null = null;
  let blinkTimer: number | null = null;
  let allowed = motionAllowed();

  host.classList.add('mascot-wrap');
  host.innerHTML = '';

  // 1) Fact bubble — pixel-bubble with pb-tag/pb-t/pb-sub/pb-cta.
  const bubble = document.createElement('div');
  bubble.className = 'pixel-bubble fact-bubble';

  const tag = document.createElement('div');
  tag.className = 'pb-tag';
  tag.textContent = 'DID YOU KNOW?';
  bubble.appendChild(tag);

  const tEn = document.createElement('div');
  tEn.className = 'pb-t';
  const enSpan = document.createElement('span'); enSpan.dataset.lang = 'en';
  tEn.appendChild(enSpan);
  bubble.appendChild(tEn);

  const sub = document.createElement('div');
  sub.className = 'pb-sub';
  const jaSpan = document.createElement('span'); jaSpan.dataset.lang = 'ja';
  const idSpan = document.createElement('span'); idSpan.dataset.lang = 'id';
  sub.append(jaSpan, idSpan);
  bubble.appendChild(sub);

  const cta = document.createElement('div');
  cta.className = 'pb-cta';
  cta.textContent = '→ TAP FOR NEXT';
  bubble.appendChild(cta);

  host.appendChild(bubble);

  // 2) Character — wrapper div + SVG inside (matches prototype's `.mascot`).
  const charWrap = document.createElement('div');
  charWrap.className = 'mascot';
  charWrap.setAttribute('role', 'button');
  charWrap.setAttribute('aria-label', 'Tap Moru for the next disaster fact');
  charWrap.setAttribute('tabindex', '0');
  const sprite = createSprite({ pose: 'stand', gender: 'male' });
  sprite.classList.add('mascot-svg');
  charWrap.appendChild(sprite);
  host.appendChild(charWrap);

  // 3) Below-character hint.
  const hint = document.createElement('div');
  hint.className = 'mascot-hint';
  hint.textContent = '▼ TAP FOR NEXT FACT ▼';
  host.appendChild(hint);

  function renderFact(): void {
    const t = DISASTER_FACTS[factIdx];
    enSpan.textContent = t.en;
    jaSpan.textContent = t.ja;
    idSpan.textContent = t.id;
  }
  renderFact();

  function nextFact(): void {
    factIdx = (factIdx + 1) % DISASTER_FACTS.length;
    renderFact();
  }

  function scheduleFactTimer(): void {
    if (!allowed) return;
    factTimer = window.setInterval(nextFact, FACT_INTERVAL_MS);
  }
  function clearFactTimer(): void {
    if (factTimer !== null) { window.clearInterval(factTimer); factTimer = null; }
  }

  function scheduleBlink(): void {
    if (!allowed) return;
    const delay = BLINK_MIN_MS + Math.random() * (BLINK_MAX_MS - BLINK_MIN_MS);
    blinkTimer = window.setTimeout(() => {
      updateSprite(sprite, { blink: true });
      window.setTimeout(() => {
        updateSprite(sprite, { blink: false });
        scheduleBlink();
      }, BLINK_DURATION_MS);
    }, delay);
  }
  function clearBlink(): void {
    if (blinkTimer !== null) { window.clearTimeout(blinkTimer); blinkTimer = null; }
  }

  function onPointerMove(e: MouseEvent): void {
    if (!allowed) return;
    const r = charWrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.32;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const ang = Math.atan2(dy, dx);
    const dist = Math.min(1, Math.hypot(dx, dy) / 220);
    const px = Math.round(Math.cos(ang) * dist * 1.5);
    const py = Math.round(Math.sin(ang) * dist * 1.0);
    // The eyes only move in whole pixels, so skip rebuilding the SVG until they would.
    const key = `${px},${py}`;
    if (key === lastPupil) return;
    lastPupil = key;
    updateSprite(sprite, { pupil: { x: px, y: py } });
  }

  function spawnParticles(kind: Particle): void {
    if (!allowed) return;
    PARTICLE_X.forEach((dx, i) => {
      const p = document.createElement('span');
      p.className = 'mk-particle';
      p.innerHTML = particleSvg(kind);
      p.style.left = `calc(50% + ${dx}px)`;
      p.style.setProperty('--dx', `${(i - 1.5) * 12}px`);
      p.style.animationDelay = `${i * 70}ms`;
      charWrap.appendChild(p);
      window.setTimeout(() => p.remove(), 1200);
    });
  }

  function react(): void {
    reactionTimers.forEach(t => window.clearTimeout(t));
    reactionTimers = [];
    reactionIdx = (reactionIdx + 1) % REACTIONS.length;
    const { emote, particle, frames } = REACTIONS[reactionIdx];
    let at = 0;
    frames.forEach(({ ms, ...pose }, i) => {
      const apply = () => updateSprite(sprite, i === 0 ? { ...pose, emote } : pose);
      if (i === 0) apply();
      else reactionTimers.push(window.setTimeout(apply, at));
      at += ms;
    });
    reactionTimers.push(window.setTimeout(
      () => updateSprite(sprite, { emote: 'idle', arms: undefined, face: undefined, blink: false }), at));
    spawnParticles(particle);
  }

  function spawnRipple(x: number, y: number): void {
    if (!allowed) return;
    const ripple = document.createElement('span');
    ripple.className = 'mk-ripple';
    ripple.style.left = `${x - 4}px`;
    ripple.style.top = `${y - 4}px`;
    charWrap.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  }

  charWrap.addEventListener('click', (e) => {
    react();
    nextFact();
    const r = charWrap.getBoundingClientRect();
    spawnRipple(e.clientX - r.left, e.clientY - r.top);
  });

  charWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      react();
      nextFact();
    }
  });

  function applyMotion(now: boolean): void {
    allowed = now;
    clearFactTimer();
    clearBlink();
    window.removeEventListener('mousemove', onPointerMove);
    if (allowed) {
      scheduleFactTimer();
      scheduleBlink();
      window.addEventListener('mousemove', onPointerMove);
    } else {
      updateSprite(sprite, { pupil: { x: 0, y: 0 }, blink: false });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
