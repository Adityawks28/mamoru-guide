// === SKYLINE ===
// Bug #4 fix: removed trailing space from 'bld-window' (was 'bld-window ' when lit)
function buildSkyline(){
  const c=document.getElementById('skyline');
  c.innerHTML='';
  const blds=[
    {w:16,h:35},{w:20,h:45,type:'eu'},{w:14,h:30},
    {w:22,h:50,type:'eu'},{w:18,h:40,type:'eu'},{w:30,h:70},{w:16,h:55},
    {w:40,h:100},{w:24,h:80},{w:35,h:110},{w:20,h:60},
    {w:28,h:75},{w:36,h:90},{w:20,h:50},{w:24,h:65},{w:18,h:45,type:'eu'},
    {w:14,h:35},{w:22,h:55},{w:16,h:40,type:'eu'},{w:20,h:30},
  ];
  blds.forEach(b=>{
    const el=document.createElement('div');
    el.className='bld';
    el.style.width=b.w+'px';
    el.style.height=b.h+'px';
    if(b.type==='eu'){
      el.style.borderRadius='4px 4px 0 0';
      el.style.clipPath='polygon(50% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%)';
    }
    const cols=Math.floor(b.w/8);
    const rows=Math.floor(b.h/10);
    for(let r=1;r<rows;r++){
      for(let cl=0;cl<cols;cl++){
        const w=document.createElement('div');
        w.className='bld-window'+(Math.random()>0.45?'':' off');
        w.style.left=(4+cl*8)+'px';
        w.style.top=(4+r*10)+'px';
        el.appendChild(w);
      }
    }
    c.appendChild(el);
  });
}
