import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.documentElement.setAttribute('lang', 'en');
  document.body.className = 'lang-en';
  document.body.innerHTML = '<button class="lang-btn active"></button>';
  localStorage.clear();
});

describe('lang', () => {
  it('setLang("ja") updates <html lang> to ja', async () => {
    vi.resetModules();
    const { setLang } = await import('../lang');
    setLang('ja');
    expect(document.documentElement.getAttribute('lang')).toBe('ja');
  });

  it('setLang("id") updates <html lang> to id', async () => {
    vi.resetModules();
    const { setLang } = await import('../lang');
    setLang('id');
    expect(document.documentElement.getAttribute('lang')).toBe('id');
  });

  it('marks the active language in both the desktop switcher and the mobile menu', async () => {
    document.body.innerHTML = ['desktop', 'mobile'].map(where => `
      <div class="${where}">
        <button class="lang-btn" onclick="setLang('en')"></button>
        <button class="lang-btn" onclick="setLang('ja')"></button>
      </div>`).join('');
    vi.resetModules();
    const { setLang } = await import('../lang');
    setLang('ja');
    const active = [...document.querySelectorAll('.lang-btn.active')].map(b => b.parentElement!.className);
    expect(active).toEqual(['desktop', 'mobile']);
  });

  it('initLang restores saved language and updates <html lang>', async () => {
    localStorage.setItem('mamoru-lang', 'ja');
    vi.resetModules();
    const { initLang } = await import('../lang');
    initLang();
    expect(document.documentElement.getAttribute('lang')).toBe('ja');
  });
});
