import { seededRandom } from './skyline';

export function initStars(): void {
  const starField = document.getElementById('stars');
  if (!starField) return;
  const random = seededRandom(117); // same sky every load
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'ks-star';
    const sz = random() > 0.7 ? 4 : 2;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${random() * 100}%;top:${random() * 100}%;--dur:${1.5 + random() * 3}s;animation-delay:${random() * 3}s`;
    starField.appendChild(s);
  }
}
