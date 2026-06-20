import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <section class="section" id="typhoon">
      <div id="typhoon-scene" class="character-scene"></div>
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

describe('typhoon-scene', () => {
  it('mounts with stand pose', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    const svg = document.querySelector('#typhoon-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });

  it('level 2 -> walk', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 2 } }));
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('walk');
  });

  it('level 4 -> headcover', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 4 } }));
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('headcover');
  });

  it('null -> stand after lock', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 3 } }));
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: null } }));
    vi.advanceTimersByTime(4100);
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('stand');
  });
});
