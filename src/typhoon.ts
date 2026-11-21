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
  claimId: string;
}

export const typhoonScale: TyphoonLevel[] = [
  {claimId:'typhoon-level-1',category:'Tropical Storm',wind_en:'34 to 47 knots',wind_ja:'34〜47ノット',wind_id:'34 sampai 47 knot',desc_en:'Near the center, people cannot walk into the wind. Some people fall.',desc_ja:'中心の近くでは、風に向かって歩けません。転ぶ人もいます。',desc_id:'Di dekat pusat, orang tidak bisa berjalan melawan angin. Sebagian orang jatuh.',color:'#4cc9f0',icon:'🌧️'},
  {claimId:'typhoon-level-2',category:'Severe Tropical Storm',wind_en:'48 to 63 knots',wind_ja:'48〜63ノット',wind_id:'48 sampai 63 knot',desc_en:'Near the center, people cannot stand if they do not hold on to something. Objects that fly in the wind can hurt people.',desc_ja:'中心の近くでは、何かにつかまらないと立っていられません。飛んできた物で、けがをすることがあります。',desc_id:'Di dekat pusat, orang tidak bisa berdiri tanpa berpegangan. Benda yang terbang bisa melukai orang.',color:'#f5a623',icon:'🌀'},
  {claimId:'typhoon-level-3',category:'Typhoon',wind_en:'64 to 84 knots',wind_ja:'64〜84ノット',wind_id:'64 sampai 84 knot',desc_en:'Near the center, it is extremely dangerous to be outside. Many trees fall.',desc_ja:'中心の近くでは、外にいるのはとても危険です。たくさんの木がたおれます。',desc_id:'Di dekat pusat, berada di luar sangat berbahaya. Banyak pohon tumbang.',color:'#e87040',icon:'🌀'},
  {claimId:'typhoon-level-4',category:'Very Strong Typhoon',wind_en:'85 to 104 knots',wind_ja:'85〜104ノット',wind_id:'85 sampai 104 knot',desc_en:'Near the center, trucks that move on the road can turn over. Some houses can collapse.',desc_ja:'中心の近くでは、走っているトラックがたおれることがあります。たおれる家もあります。',desc_id:'Di dekat pusat, truk yang melaju bisa terguling. Sebagian rumah bisa roboh.',color:'#e84040',icon:'🔴'},
  {claimId:'typhoon-level-5',category:'Violent Typhoon',wind_en:'105+ knots',wind_ja:'105ノット以上',wind_id:'105+ knot',desc_en:'Near the center, trucks that move on the road can turn over. Some houses can collapse.',desc_ja:'中心の近くでは、走っているトラックがたおれることがあります。たおれる家もあります。',desc_id:'Di dekat pusat, truk yang melaju bisa terguling. Sebagian rumah bisa roboh.',color:'#ff4d6d',icon:'⛔'},
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
