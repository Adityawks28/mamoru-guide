import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `<div id="bag-scene" class="character-scene"></div>`;
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
  vi.useFakeTimers();
});

describe('bag-scene', () => {
  it('returns early when mount is absent', async () => {
    document.body.innerHTML = '';
    const { initBagScene } = await import('../bag-scene');
    expect(() => initBagScene()).not.toThrow();
  });

  it('mounts SVG starting in stand', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    const svg = document.querySelector('#bag-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });

  it('over → tired', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    document.dispatchEvent(new CustomEvent('mamoru:bag-weight', { detail: { weight: 12, status: 'over' } }));
    const svg = document.querySelector('#bag-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('tired');
  });

  it('perfect briefly shows peace emote, returns to stand', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    document.dispatchEvent(new CustomEvent('mamoru:bag-weight', { detail: { weight: 9.8, status: 'perfect' } }));
    vi.advanceTimersByTime(800);
    const svg = document.querySelector('#bag-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });
});
