import { seededRandom } from '../skyline';

const STORAGE_KEY = 'a11y-reduced-motion';
const MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

export function motionAllowed(): boolean {
  if (typeof window === 'undefined') return true;
  const mql = window.matchMedia(MEDIA_QUERY);
  if (mql.matches) return false;
  if (localStorage.getItem(STORAGE_KEY) === 'true') return false;
  return true;
}

export function onMotionChange(cb: (allowed: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(MEDIA_QUERY);
  const onMql = () => cb(motionAllowed());
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb(motionAllowed());
  };
  mql.addEventListener('change', onMql);
  window.addEventListener('storage', onStorage);
  return () => {
    mql.removeEventListener('change', onMql);
    window.removeEventListener('storage', onStorage);
  };
}

export const QUAKE_FPS = 12;

export interface Offset { x: number; y: number }

// One quake, as whole-pixel offsets held for one 1/12 s frame each (old
// console screen shake): a faint P-wave rattle, the S-wave's big sway, then a
// coda that fades back to rest. `level` is the row on the 10-step scale.
export function quakeFrames(level: number): Offset[] {
  if (level <= 0) return [];
  const random = seededRandom(level);
  const count = Math.round((1.2 + 0.36 * level) * QUAKE_FPS);
  const frames: Offset[] = [];
  for (let f = 0; f < count; f++) {
    const t = f / (count - 1);
    const envelope = t < 0.2 ? 0.25 : t < 0.3 ? 0.25 + (t - 0.2) * 7.5 : t < 0.6 ? 1 : (1 - t) / 0.4;
    const amp = level * envelope;
    const side = f % 2 ? 1 : -1;
    frames.push({
      x: Math.round(side * amp * (0.5 + random() * 0.5)) + 0,
      y: Math.round((random() - 0.5) * amp * 0.6) + 0,
    });
  }
  frames[0] = frames[count - 1] = { x: 0, y: 0 };
  return frames;
}

export function quakeMs(level: number): number {
  return quakeFrames(level).length * 1000 / QUAKE_FPS;
}

export function playQuake(el: Element, level: number): void {
  el.getAnimations?.().forEach(a => a.cancel());
  const frames = quakeFrames(level);
  if (!frames.length || !el.animate) return;
  el.animate(
    frames.map(o => ({ transform: `translate(${o.x}px, ${o.y}px)`, easing: 'steps(1, end)' })),
    { duration: quakeMs(level) },
  );
}
