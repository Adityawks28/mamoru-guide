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
  {category:'Tropical Storm',wind_en:'34–47 kt',wind_ja:'34〜47ノット',wind_id:'34–47 knot',desc_en:'Light damage, some disruption to trains',desc_ja:'軽微な被害、電車の一部運休',desc_id:'Kerusakan ringan, gangguan kereta',color:'#4cc9f0',icon:'🌧️'},
  {category:'Severe Tropical Storm',wind_en:'48–63 kt',wind_ja:'48〜63ノット',wind_id:'48–63 knot',desc_en:'Moderate damage, flooding possible',desc_ja:'中程度の被害、浸水の可能性',desc_id:'Kerusakan sedang, mungkin banjir',color:'#f5a623',icon:'🌀'},
  {category:'Typhoon',wind_en:'64–84 kt',wind_ja:'64〜84ノット',wind_id:'64–84 knot',desc_en:'Significant damage, evacuations likely',desc_ja:'大きな被害、避難の可能性',desc_id:'Kerusakan signifikan, kemungkinan evakuasi',color:'#e87040',icon:'🌀'},
  {category:'Very Strong Typhoon',wind_en:'85–104 kt',wind_ja:'85〜104ノット',wind_id:'85–104 knot',desc_en:'Severe damage, widespread power outages',desc_ja:'深刻な被害、広範囲の停電',desc_id:'Kerusakan parah, listrik padam luas',color:'#e84040',icon:'🔴'},
  {category:'Violent Typhoon',wind_en:'105+ kt',wind_ja:'105ノット以上',wind_id:'105+ knot',desc_en:'Catastrophic — stay indoors at all costs',desc_ja:'壊滅的 — 絶対に屋内にいること',desc_id:'Bencana — tetap di dalam bagaimanapun',color:'#c22040',icon:'⛔'},
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
        <div class="typhoon-name" style="color:${level.color}">${level.category}</div>
        <div class="typhoon-wind"><span data-lang="en">${level.wind_en}</span><span data-lang="ja">${level.wind_ja}</span><span data-lang="id">${level.wind_id}</span></div>
        <div class="typhoon-desc"><span data-lang="en">${level.desc_en}</span><span data-lang="ja">${level.desc_ja}</span><span data-lang="id">${level.desc_id}</span></div>
      </div>
      <div class="typhoon-bar-wrap"><div class="typhoon-bar" style="width:${pct}%;background:${level.color}"></div></div>
    `;
    container.appendChild(row);
  });
}
