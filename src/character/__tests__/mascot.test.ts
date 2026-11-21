import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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
    en: { tag: 'DID YOU KNOW?', cta: '→ TAP FOR NEXT', hint: '▼ TAP FOR NEXT FACT ▼', aria: 'Tap Mamoru for the next disaster fact' },
    ja: { tag: '知っていますか？', cta: '→ タップして次へ', hint: '▼ タップして次の話へ ▼', aria: 'マモルをタップすると、次の災害の話が出ます' },
    id: { tag: 'TAHUKAH KAMU?', cta: '→ KETUK UNTUK LANJUT', hint: '▼ KETUK UNTUK FAKTA LAIN ▼', aria: 'Ketuk Mamoru untuk fakta bencana berikutnya' },
  } as const;
  const labels = () => ({
    tag: document.querySelector('#mascot .pb-tag')!.textContent,
    cta: document.querySelector('#mascot .pb-cta')!.textContent,
    hint: document.querySelector('#mascot .mascot-hint')!.textContent,
    aria: document.querySelector('#mascot .mascot')!.getAttribute('aria-label'),
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

  describe('when the tab is hidden', () => {
    let hidden = false;
    const setHidden = (h: boolean) => {
      hidden = h;
      document.dispatchEvent(new Event('visibilitychange'));
    };
    const en = () => document.querySelector('#mascot [data-lang="en"]')!.textContent;
    const blinks = () => document.querySelector('#mascot .mascot-svg')!.getAttribute('data-blink');

    beforeEach(() => {
      hidden = false;
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    });
    afterEach(() => {
      delete (document as any).hidden;
    });

    it('pauses the fact rotation and the blink, and starts them again when visible', async () => {
      const { initMascot } = await import('../mascot');
      initMascot();
      setHidden(true);
      const before = en();
      let blinked = false;
      for (let t = 0; t < 30000; t += 50) {
        vi.advanceTimersByTime(50);
        if (blinks()) blinked = true;
      }
      expect(en()).toBe(before);
      expect(blinked).toBe(false);

      setHidden(false);
      for (let t = 0; t < 8100; t += 50) {
        vi.advanceTimersByTime(50);
        if (blinks()) blinked = true;
      }
      expect(en()).not.toBe(before);
      expect(blinked).toBe(true);
    });

    it('does not leave the eyes shut when the tab hides during a blink', async () => {
      const { initMascot } = await import('../mascot');
      initMascot();
      for (let t = 0; t < 7000 && !blinks(); t += 10) vi.advanceTimersByTime(10);
      expect(blinks()).toBeTruthy();
      setHidden(true);
      expect(blinks()).toBeFalsy();
      vi.advanceTimersByTime(30000);
      expect(blinks()).toBeFalsy();
    });

    it('does not start the timers when the page loads in a hidden tab', async () => {
      hidden = true;
      const { initMascot } = await import('../mascot');
      initMascot();
      const before = en();
      vi.advanceTimersByTime(30000);
      expect(en()).toBe(before);
    });
  });
});
