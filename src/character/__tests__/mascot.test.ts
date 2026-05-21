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

  it('mounts an SVG sprite into #mascot', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const svg = document.querySelector('#mascot svg');
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('data-pose')).toBe('stand');
    expect(svg!.getAttribute('data-gender')).toBe('male');
  });

  it('mounts a fact bubble with EN/JA/ID spans', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const bubble = document.querySelector('#mascot .mascot-fact');
    expect(bubble).toBeTruthy();
    expect(bubble!.querySelector('[data-lang="en"]')).toBeTruthy();
    expect(bubble!.querySelector('[data-lang="ja"]')).toBeTruthy();
    expect(bubble!.querySelector('[data-lang="id"]')).toBeTruthy();
  });

  it('advances to next fact on click', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const host = document.getElementById('mascot')!;
    const en = () => host.querySelector('[data-lang="en"]')!.textContent;
    const before = en();
    host.click();
    expect(en()).not.toBe(before);
  });

  it('rotates facts on a 7s timer', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const host = document.getElementById('mascot')!;
    const en = () => host.querySelector('[data-lang="en"]')!.textContent;
    const before = en();
    vi.advanceTimersByTime(7100);
    expect(en()).not.toBe(before);
  });

  it('reduced motion: no bobbing class, no fact rotation', async () => {
    localStorage.setItem('a11y-reduced-motion', 'true');
    vi.resetModules();
    const { initMascot } = await import('../mascot');
    initMascot();
    const host = document.getElementById('mascot')!;
    expect(host.classList.contains('bobbing')).toBe(false);
    const en = () => host.querySelector('[data-lang="en"]')!.textContent;
    const before = en();
    vi.advanceTimersByTime(20000);
    expect(en()).toBe(before);
  });
});
