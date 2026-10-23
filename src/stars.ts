import { seededRandom } from './skyline';
import { motionAllowed } from './character/motion';

export function initStars(): void {
  const starField = document.getElementById('stars');
  if (!starField) return;
  const random = seededRandom(117); // same sky every load
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'ks-star' + (random() < 0.3 ? ' blink' : '');
    const sz = random() > 0.7 ? 4 : 2;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${random() * 100}%;top:${random() * 100}%;--glow:${0.5 + random() * 0.4};--dur:${2.5 + random() * 4}s;animation-delay:-${random() * 6}s`;
    starField.appendChild(s);
  }
  const sky = document.querySelector<HTMLElement>('.ks-shooters');
  if (sky) scheduleShootingStar(sky);
}

// Now and then a meteor streaks across the upper sky, then burns out.
function scheduleShootingStar(sky: HTMLElement): void {
  window.setTimeout(() => {
    if (motionAllowed() && !document.hidden) {
      const s = document.createElement('span');
      s.className = 'ks-shooter';
      s.style.left = `${5 + Math.random() * 60}%`;
      s.style.top = `${Math.random() * 30}%`;
      sky.appendChild(s);
      // A timer, not animationend: a hidden sky never plays the animation.
      window.setTimeout(() => s.remove(), 1000);
    }
    scheduleShootingStar(sky);
  }, 7000 + Math.random() * 9000);
}
