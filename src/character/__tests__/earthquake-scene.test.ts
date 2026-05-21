import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <section class="section" id="earthquake">
      <div id="earthquake-scene" class="character-scene"></div>
    </section>
  `;
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
  (globalThis as any).IntersectionObserver = class {
    observe() {} unobserve() {} disconnect() {}
    takeRecords() { return []; }
  };
  vi.useFakeTimers();
});

describe('earthquake-scene', () => {
  it('returns early when mount is absent', async () => {
    document.body.innerHTML = '';
    const { initEarthquakeScene } = await import('../earthquake-scene');
    expect(() => initEarthquakeScene()).not.toThrow();
  });

  it('mounts an SVG and a tip bubble', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    expect(document.querySelector('#earthquake-scene svg')).toBeTruthy();
    expect(document.querySelector('#earthquake-scene .tip-bubble')).toBeTruthy();
  });

  it('shindo 4 → cover pose', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 4 } }));
    const svg = document.querySelector('#earthquake-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('cover');
  });

  it('shindo 7 → headcover pose', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 7 } }));
    const svg = document.querySelector('#earthquake-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('headcover');
  });

  it('null shindo → returns to scroll-driven default (stand)', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 6 } }));
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: null } }));
    vi.advanceTimersByTime(4100);
    const svg = document.querySelector('#earthquake-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });
});
