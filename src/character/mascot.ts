import { createSprite, updateSprite, type Emote } from './sprite';
import { DISASTER_FACTS } from './tips';
import { motionAllowed, onMotionChange } from './motion';

const EMOTE_CYCLE: Emote[] = ['wave', 'jump', 'spin', 'peace', 'burst', 'bow'];
const FACT_INTERVAL_MS = 7000;
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

  const sprite = createSprite({ pose: 'stand', gender: 'male' });
  host.innerHTML = '';
  host.appendChild(sprite);

  const bubble = document.createElement('div');
  bubble.className = 'mascot-fact tip-bubble';
  const enSpan = document.createElement('span'); enSpan.dataset.lang = 'en';
  const jaSpan = document.createElement('span'); jaSpan.dataset.lang = 'ja';
  const idSpan = document.createElement('span'); idSpan.dataset.lang = 'id';
  bubble.append(enSpan, jaSpan, idSpan);
  host.appendChild(bubble);

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

  function onPointerMove(e: PointerEvent | MouseEvent): void {
    if (!allowed) return;
    const r = host!.getBoundingClientRect();
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

  function spawnHeart(x: number, y: number): void {
    if (!allowed) return;
    const heart = document.createElement('span');
    heart.className = 'mascot-heart';
    heart.textContent = '♥';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 30}px`);
    host!.appendChild(heart);
    window.setTimeout(() => heart.remove(), 900);
  }

  function spawnRipple(x: number, y: number): void {
    if (!allowed) return;
    const ripple = document.createElement('span');
    ripple.className = 'mascot-ripple';
    ripple.style.left = `${x - 4}px`;
    ripple.style.top = `${y - 4}px`;
    host!.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 600);
  }

  host.addEventListener('click', (e) => {
    flashEmote();
    nextFact();
    const r = host!.getBoundingClientRect();
    spawnRipple(e.clientX - r.left, e.clientY - r.top);
  });

  host.addEventListener('mouseenter', (e) => {
    const r = host!.getBoundingClientRect();
    spawnHeart(e.clientX - r.left, e.clientY - r.top);
  });

  function applyMotion(now: boolean): void {
    allowed = now;
    clearFactTimer();
    clearBlink();
    if (allowed) {
      host!.classList.add('bobbing');
      scheduleFactTimer();
      scheduleBlink();
      window.addEventListener('mousemove', onPointerMove);
    } else {
      host!.classList.remove('bobbing');
      window.removeEventListener('mousemove', onPointerMove);
      updateSprite(sprite, { pupil: { x: 0, y: 0 }, blink: false });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
