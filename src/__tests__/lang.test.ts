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

  it('initLang restores saved language and updates <html lang>', async () => {
    localStorage.setItem('mamoru-lang', 'ja');
    vi.resetModules();
    const { initLang } = await import('../lang');
    initLang();
    expect(document.documentElement.getAttribute('lang')).toBe('ja');
  });
});
