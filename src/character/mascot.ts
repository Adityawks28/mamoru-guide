import { createSprite, updateSprite, type Emote } from './sprite';
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

const EMOTE_CYCLE: Emote[] = ['wave', 'jump', 'spin', 'peace', 'burst', 'bow'];
const FACT_INTERVAL_MS = 8000;
const BLINK_MIN_MS = 2400;
const BLINK_MAX_MS = 6000;
const BLINK_DURATION_MS = 130;

export function initMascot(): void {
  const host = document.getElementById('mascot');
  if (!host) return;

  let factIdx = 0;
  let emoteIdx = -1;
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
    const px = Math.cos(ang) * dist * 1.5;
    const py = Math.sin(ang) * dist * 1.0;
    updateSprite(sprite, { pupil: { x: px, y: py } });
  }

  function flashEmote(): void {
    emoteIdx = (emoteIdx + 1) % EMOTE_CYCLE.length;
    const emote = EMOTE_CYCLE[emoteIdx];
    updateSprite(sprite, { emote });
    window.setTimeout(() => updateSprite(sprite, { emote: 'idle' }), 600);
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
    flashEmote();
    nextFact();
    const r = charWrap.getBoundingClientRect();
    spawnRipple(e.clientX - r.left, e.clientY - r.top);
  });

  function applyMotion(now: boolean): void {
    allowed = now;
    clearFactTimer();
    clearBlink();
    if (allowed) {
      scheduleFactTimer();
      scheduleBlink();
      window.addEventListener('mousemove', onPointerMove);
    } else {
      window.removeEventListener('mousemove', onPointerMove);
      updateSprite(sprite, { pupil: { x: 0, y: 0 }, blink: false });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
