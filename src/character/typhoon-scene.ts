import { createSprite, updateSprite, type Pose } from './sprite';
import { TYPHOON_TIPS } from './tips';
import { motionAllowed, onMotionChange } from './motion';

const SCROLL_CURVE: Pose[] = ['stand', 'phone', 'walk', 'tired'];
const STATE_LOCK_MS = 4000;
const TIP_INTERVAL_MS = 4500;

function levelToPose(level: number): Pose {
  if (level <= 0) return 'stand';
  if (level === 1) return 'phone';
  if (level === 2) return 'walk';
  if (level === 3) return 'tired';
  return 'headcover';
}

export function initTyphoonScene(): void {
  const host = document.getElementById('typhoon-scene');
  if (!host) return;

  const section = host.closest('section') as HTMLElement | null;
  let allowed = motionAllowed();
  let lockTimer: number | null = null;
  let stateLocked = false;
  let scrollProgress = 0;
  let tipIdx = 0;
  let tipTimer: number | null = null;
  let scrollObserver: IntersectionObserver | null = null;

  const sprite = createSprite({ pose: 'stand', gender: 'male' });
  host.innerHTML = '';
  host.appendChild(sprite);

  const bubble = document.createElement('div');
  bubble.className = 'tip-bubble';
  const en = document.createElement('span'); en.dataset.lang = 'en';
  const ja = document.createElement('span'); ja.dataset.lang = 'ja';
  const id = document.createElement('span'); id.dataset.lang = 'id';
  bubble.append(en, ja, id);
  host.appendChild(bubble);

  function showTip(i: number): void {
    const t = TYPHOON_TIPS[i % TYPHOON_TIPS.length];
    en.textContent = t.en;
    ja.textContent = t.ja;
    id.textContent = t.id;
  }
  showTip(0);

  function poseFromScroll(): Pose {
    const idx = Math.min(SCROLL_CURVE.length - 1, Math.floor(scrollProgress * SCROLL_CURVE.length));
    return SCROLL_CURVE[idx];
  }

  function applyScroll(): void {
    if (stateLocked) return;
    updateSprite(sprite, { pose: poseFromScroll() });
  }

  function onLevel(e: Event): void {
    const ev = e as CustomEvent<{ level: number | null }>;
    if (lockTimer !== null) window.clearTimeout(lockTimer);
    if (ev.detail.level === null) {
      stateLocked = false;
      applyScroll();
      return;
    }
    stateLocked = true;
    updateSprite(sprite, { pose: levelToPose(ev.detail.level) });
    showTip(ev.detail.level);
    lockTimer = window.setTimeout(() => {
      stateLocked = false;
      applyScroll();
    }, STATE_LOCK_MS);
  }

  function onIntersect(entries: IntersectionObserverEntry[]): void {
    if (!section) return;
    const e = entries[0]; if (!e) return;
    const vh = window.innerHeight || 800;
    const top = e.boundingClientRect.top;
    const h = e.boundingClientRect.height;
    scrollProgress = Math.max(0, Math.min(1, 1 - (top + h) / (vh + h)));
    applyScroll();
  }

  function rotateTip(): void {
    if (stateLocked) return;
    tipIdx = (tipIdx + 1) % TYPHOON_TIPS.length;
    showTip(tipIdx);
  }

  function applyMotion(now: boolean): void {
    allowed = now;
    if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    document.removeEventListener('mamoru:typhoon-level', onLevel);
    if (allowed && section) {
      scrollObserver = new IntersectionObserver(onIntersect, {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
      });
      scrollObserver.observe(section);
      tipTimer = window.setInterval(rotateTip, TIP_INTERVAL_MS);
      document.addEventListener('mamoru:typhoon-level', onLevel);
    } else {
      stateLocked = false;
      updateSprite(sprite, { pose: 'stand' });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
