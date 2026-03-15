interface BuildingTemplate {
  w: number;
  hMin: number;
  hMax: number;
  type?: string;
}

export function buildSkyline(): void {
  const c = document.getElementById('skyline');
  if (!c) return;
  c.innerHTML = '';
  const vw = window.innerWidth;
  const templates: BuildingTemplate[] = [
    {w:16,hMin:25,hMax:45},{w:20,hMin:30,hMax:55,type:'eu'},{w:14,hMin:20,hMax:40},
    {w:22,hMin:40,hMax:65,type:'eu'},{w:18,hMin:30,hMax:50,type:'eu'},{w:30,hMin:55,hMax:80},
    {w:16,hMin:40,hMax:60},{w:40,hMin:80,hMax:120},{w:24,hMin:60,hMax:90},
    {w:35,hMin:90,hMax:120},{w:20,hMin:45,hMax:70},{w:28,hMin:55,hMax:85},
    {w:36,hMin:70,hMax:100},{w:20,hMin:35,hMax:55},{w:24,hMin:50,hMax:75},
  ];
  let totalW = 0;
  const blds: { w: number; h: number; type?: string }[] = [];
  while (totalW < vw + 60) {
    const t = templates[Math.floor(Math.random() * templates.length)];
    const h = Math.floor(t.hMin + Math.random() * (t.hMax - t.hMin));
    blds.push({ w: t.w, h: h, type: t.type });
    totalW += t.w;
  }
  blds.forEach(b => {
    const el = document.createElement('div');
    el.className = 'bld';
    el.style.width = b.w + 'px';
    el.style.height = b.h + 'px';
    if (b.type === 'eu') {
      el.style.borderRadius = '4px 4px 0 0';
      el.style.clipPath = 'polygon(50% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%)';
    }
    const cols = Math.floor(b.w / 8);
    const rows = Math.floor(b.h / 10);
    for (let r = 1; r < rows; r++) {
      for (let cl = 0; cl < cols; cl++) {
        const w = document.createElement('div');
        w.className = 'bld-window' + (Math.random() > 0.45 ? '' : ' off');
        w.style.left = (4 + cl * 8) + 'px';
        w.style.top = (4 + r * 10) + 'px';
        el.appendChild(w);
      }
    }
    c.appendChild(el);
  });
}
