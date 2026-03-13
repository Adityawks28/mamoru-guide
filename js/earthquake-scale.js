// === VERTICAL EARTHQUAKE SCALE ===
// Bug #6 fix: added tabindex, role, aria-label, and keydown handler for accessibility
function initEarthquakeScale() {
  const sv = document.getElementById('scaleVertical');
  let activeShake = null;
  scaleData.forEach((s,i) => {
    const row = document.createElement('div');
    row.className = 'scale-row' + (s.s7 ? ' s7' : '');
    row.style.borderLeftColor = s.colors[0];
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', s.jp + ' - ' + s.en);
    row.innerHTML = `
      <div class="num" style="color:${s.colors[0]}">${s.n}</div>
      <div class="jp-name">${s.jp}</div>
      <div class="desc"><span data-lang="en">${s.en}</span><span data-lang="ja">${s.ja}</span><span data-lang="id">${s.id}</span></div>
      <div class="shake-demo">${s.icon}</div>
      <div class="intensity-bar" style="width:${s.pct}%;background:${s.colors[0]}"></div>
    `;
    function toggleShake() {
      if(activeShake === i) {
        row.classList.remove(s.shakeClass);
        activeShake = null;
        return;
      }
      if(activeShake !== null) {
        const prev = sv.children[activeShake];
        prev.classList.remove(scaleData[activeShake].shakeClass);
      }
      row.classList.add(s.shakeClass);
      activeShake = i;
    }
    row.addEventListener('click', toggleShake);
    row.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleShake(); }
    });
    sv.appendChild(row);
  });
}
