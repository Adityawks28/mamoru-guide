import type { Language } from './types';

export let currentLang: Language = 'en';

export function setLang(lang: Language): void {
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

export function initLang(): void {
  const saved = (localStorage.getItem('mamoru-lang') || 'en') as Language;
  setLang(saved);
}
