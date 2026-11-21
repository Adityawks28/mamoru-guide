import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '<div id="mascot"></div>';
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false,
    media: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
  vi.useFakeTimers();
});

describe('mascot', () => {
  it('returns early when #mascot is absent', async () => {
    document.body.innerHTML = '';
    const { initMascot } = await import('../mascot');
    expect(() => initMascot()).not.toThrow();
  });

  it('renders mascot-wrap with pixel-bubble, mascot character, and hint', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const wrap = document.getElementById('mascot')!;
    expect(wrap.classList.contains('mascot-wrap')).toBe(true);
    expect(wrap.querySelector('.pixel-bubble.fact-bubble')).toBeTruthy();
    expect(wrap.querySelector('.mascot')).toBeTruthy();
    expect(wrap.querySelector('.mascot svg.mascot-svg')).toBeTruthy();
    expect(wrap.querySelector('.mascot-hint')).toBeTruthy();
  });

  it('bubble has pb-tag, the fact in EN, JA and ID inside pb-t, and pb-cta', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const bubble = document.querySelector('#mascot .pixel-bubble')!;
    expect(bubble.querySelector('.pb-tag')).toBeTruthy();
    for (const lang of ['en', 'ja', 'id']) {
      expect(bubble.querySelector(`.pb-t [data-lang="${lang}"]`)!.textContent, lang).not.toBe('');
    }
    expect(bubble.querySelector('.pb-sub')).toBeNull();
    expect(bubble.querySelector('.pb-cta')).toBeTruthy();
  });

  const LABELS = {
    en: { tag: 'DID YOU KNOW?', cta: '→ TAP FOR NEXT', hint: '▼ TAP FOR NEXT FACT ▼' },
    ja: { tag: '知っていますか？', cta: '→ タップして次へ', hint: '▼ タップして次の話へ ▼' },
    id: { tag: 'TAHUKAH KAMU?', cta: '→ KETUK UNTUK LANJUT', hint: '▼ KETUK UNTUK FAKTA LAIN ▼' },
  } as const;
  const labels = () => ({
    tag: document.querySelector('#mascot .pb-tag')!.textContent,
    cta: document.querySelector('#mascot .pb-cta')!.textContent,
    hint: document.querySelector('#mascot .mascot-hint')!.textContent,
  });

  it.each(['en', 'ja', 'id'] as const)('labels the bubble and hint in %s when the page starts in that language', async (lang) => {
    const { setLang } = await import('../../lang');
    setLang(lang);
    const { initMascot } = await import('../mascot');
    initMascot();
    expect(labels()).toEqual(LABELS[lang]);
  });

  it('relabels the bubble and hint when the language changes', async () => {
    const { setLang } = await import('../../lang');
    setLang('en');
    const { initMascot } = await import('../mascot');
    initMascot();
    for (const lang of ['ja', 'id', 'en'] as const) {
      setLang(lang);
      expect(labels(), lang).toEqual(LABELS[lang]);
    }
  });

  it('clicking the mascot character advances the fact', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const charWrap = document.querySelector('#mascot .mascot') as HTMLDivElement;
    const en = () => document.querySelector('#mascot [data-lang="en"]')!.textContent;
    const before = en();
    charWrap.click();
    expect(en()).not.toBe(before);
  });

  it('rotates facts on the 8s timer', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const en = () => document.querySelector('#mascot [data-lang="en"]')!.textContent;
    const before = en();
    vi.advanceTimersByTime(8100);
    expect(en()).not.toBe(before);
  });

  it('reduced motion: no fact rotation', async () => {
    localStorage.setItem('a11y-reduced-motion', 'true');
    vi.resetModules();
    const { initMascot } = await import('../mascot');
    initMascot();
    const en = () => document.querySelector('#mascot [data-lang="en"]')!.textContent;
    const before = en();
    vi.advanceTimersByTime(20000);
    expect(en()).toBe(before);
  });
});
