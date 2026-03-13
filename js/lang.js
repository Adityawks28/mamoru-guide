// === LANGUAGE ===
// Bug #1 fix: use classList.remove/add instead of wiping document.body.className
// Bug #7 fix: removed applyLang() — CSS handles [data-lang] visibility via body.lang-* classes
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + lang);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.lang-btn[onclick="setLang('${lang}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
  });
  document.documentElement.setAttribute('lang', lang === 'ja' ? 'ja' : lang === 'id' ? 'id' : 'en');
  localStorage.setItem('mamoru-lang', lang);
}

function initLang() {
  const saved = localStorage.getItem('mamoru-lang') || 'en';
  setLang(saved);
}
