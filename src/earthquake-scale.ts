import { scaleData } from './data';
import { motionAllowed, playQuake } from './character/motion';

export function initEarthquakeScale(): void {
  const sv = document.getElementById('scaleVertical');
  if (!sv) return;
  scaleData.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'scale-row' + (s.s7 ? ' s7' : '');
    row.style.borderLeftColor = s.colors[0];
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    row.setAttribute('aria-pressed', 'false');
    row.setAttribute('aria-label', s.jp + ', ' + s.en);
    row.innerHTML = `
      <div class="num" style="--lvl:${s.colors[0]}">${s.n}</div>
      <div class="jp-name">${s.jp}</div>
      <div class="desc"><span data-lang="en">${s.en}</span><span data-lang="ja">${s.ja}</span><span data-lang="id">${s.id}</span></div>
      <div class="shake-demo">${s.icon}</div>
      <div class="intensity-bar" style="width:${s.pct}%;background:${s.colors[0]}"></div>
    `;
    // Every tap plays this level's quake once; the room scene follows the event.
    function feel() {
      sv!.querySelectorAll('.scale-row').forEach(r => r.setAttribute('aria-pressed', String(r === row)));
      if (motionAllowed()) playQuake(row.querySelector('.shake-demo')!, i);
      document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: i } }));
    }
    row.addEventListener('click', feel);
    row.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); feel(); }
    });
    sv.appendChild(row);
  });
}
