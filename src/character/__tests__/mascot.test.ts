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

  it('bubble has pb-tag, pb-t with EN, pb-sub with JA + ID, pb-cta', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const bubble = document.querySelector('#mascot .pixel-bubble')!;
    expect(bubble.querySelector('.pb-tag')!.textContent).toBe('DID YOU KNOW?');
    expect(bubble.querySelector('.pb-t [data-lang="en"]')).toBeTruthy();
    expect(bubble.querySelector('.pb-sub [data-lang="ja"]')).toBeTruthy();
    expect(bubble.querySelector('.pb-sub [data-lang="id"]')).toBeTruthy();
    expect(bubble.querySelector('.pb-cta')!.textContent).toContain('TAP FOR NEXT');
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
