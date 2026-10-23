interface TyphoonLevel {
  category: string;
  wind_en: string;
  wind_ja: string;
  wind_id: string;
  desc_en: string;
  desc_ja: string;
  desc_id: string;
  color: string;
  icon: string;
}

const typhoonScale: TyphoonLevel[] = [
  {category:'Tropical Storm',wind_en:'34 to 47 knots',wind_ja:'34〜47ノット',wind_id:'34 sampai 47 knot',desc_en:'Light damage. Some trains stop.',desc_ja:'被害は小さいです。一部の電車が止まります。',desc_id:'Kerusakan ringan. Sebagian kereta berhenti.',color:'#4cc9f0',icon:'🌧️'},
  {category:'Severe Tropical Storm',wind_en:'48 to 63 knots',wind_ja:'48〜63ノット',wind_id:'48 sampai 63 knot',desc_en:'Medium damage. Flooding can happen.',desc_ja:'中くらいの被害があります。浸水（家などに水が入ること）するかもしれません。',desc_id:'Kerusakan sedang. Bisa terjadi banjir.',color:'#f5a623',icon:'🌀'},
  {category:'Typhoon',wind_en:'64 to 84 knots',wind_ja:'64〜84ノット',wind_id:'64 sampai 84 knot',desc_en:'Serious damage. Evacuation is likely.',desc_ja:'大きな被害があります。避難が必要になるかもしれません。',desc_id:'Kerusakan besar. Kemungkinan perlu mengungsi.',color:'#e87040',icon:'🌀'},
  {category:'Very Strong Typhoon',wind_en:'85 to 104 knots',wind_ja:'85〜104ノット',wind_id:'85 sampai 104 knot',desc_en:'Severe damage. Large areas lose power.',desc_ja:'とても大きな被害があります。広い範囲で停電します。',desc_id:'Kerusakan parah. Listrik padam di area yang luas.',color:'#e84040',icon:'🔴'},
  {category:'Violent Typhoon',wind_en:'105+ knots',wind_ja:'105ノット以上',wind_id:'105+ knot',desc_en:'Very severe damage. Stay inside a building. Do not go outside for any reason.',desc_ja:'ひじょうに大きな被害が出ます。絶対に建物の中にいてください。',desc_id:'Kerusakan sangat parah. Tetap di dalam gedung, apa pun yang terjadi.',color:'#ff4d6d',icon:'⛔'},
];

export function initTyphoonScale(): void {
  const container = document.getElementById('typhoonScale');
  if (!container) return;

  typhoonScale.forEach((level, i) => {
    const row = document.createElement('div');
    row.className = 'typhoon-row';
    row.style.borderLeftColor = level.color;
    const pct = ((i + 1) / typhoonScale.length) * 100;
    row.innerHTML = `
      <div class="typhoon-icon">${level.icon}</div>
      <div class="typhoon-info">
        <div class="typhoon-name" style="--lvl:${level.color}">${level.category}</div>
        <div class="typhoon-wind"><span data-lang="en">${level.wind_en}</span><span data-lang="ja">${level.wind_ja}</span><span data-lang="id">${level.wind_id}</span></div>
        <div class="typhoon-desc"><span data-lang="en">${level.desc_en}</span><span data-lang="ja">${level.desc_ja}</span><span data-lang="id">${level.desc_id}</span></div>
      </div>
      <div class="typhoon-bar-wrap"><div class="typhoon-bar" style="width:${pct}%;background:${level.color}"></div></div>
    `;
    container.appendChild(row);

    row.style.cursor = 'pointer';
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    let active = false;
    const toggle = () => {
      active = !active;
      container.querySelectorAll('.typhoon-row.active').forEach(el => {
        if (el !== row) el.classList.remove('active');
      });
      row.classList.toggle('active', active);
      document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', {
        detail: { level: active ? i : null },
      }));
    };
    row.addEventListener('click', toggle);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
}
