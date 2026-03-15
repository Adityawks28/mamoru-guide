export function initStars(): void {
  const starField = document.getElementById('stars');
  if (!starField) return;
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() > 0.7 ? 4 : 2;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--dur:${1.5 + Math.random() * 3}s;animation-delay:${Math.random() * 3}s`;
    starField.appendChild(s);
  }
}
