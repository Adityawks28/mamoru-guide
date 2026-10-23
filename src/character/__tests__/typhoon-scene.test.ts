import { describe, it, expect, beforeEach, vi } from 'vitest';

let observed: ((entries: unknown[]) => void) | null = null;

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
  observed = null;
  (globalThis as any).IntersectionObserver = class {
    constructor(cb: (entries: unknown[]) => void) { observed = cb; }
    observe() {} unobserve() {} disconnect() {}
    takeRecords() { return []; }
  };
  vi.useFakeTimers();
});

const sprite = () => document.querySelector<SVGSVGElement>('#typhoon-scene .mamoru-sprite')!;
const prop = (name: string) => document.querySelector(`#typhoon-scene [data-prop="${name}"]`);
const level = (l: number | null) =>
  document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: l } }));

describe('typhoon-scene', () => {
  it('stands with empty hands', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    expect(sprite().dataset.pose).toBe('stand');
    expect(document.querySelectorAll('#typhoon-scene [data-prop]').length).toBe(0);
  });

  it('scrolling the page does not change what he does', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    observed?.([{ boundingClientRect: { top: -2000, height: 400 } }]);
    expect(sprite().dataset.pose).toBe('stand');
  });

  it('tropical storm: checks the forecast on a phone', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    level(0);
    expect(sprite().querySelector('[data-prop="phone"]')).not.toBeNull();
  });

  it('severe storm: tapes an X on the window, one strip at a time', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    level(1);
    expect(prop('window')).not.toBeNull();
    const strips = new Set<number>();
    for (let t = 0; t < 4000; t += 50) {
      vi.advanceTimersByTime(50);
      strips.add(document.querySelectorAll('#typhoon-scene [data-prop="tape"]').length);
    }
    expect([...strips].sort()).toEqual([0, 1, 2]);
  });

  it('typhoon: walks to the shelter leaning into the wind', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    level(2);
    expect(prop('wind')).not.toBeNull();
    const poses = new Set<string>();
    for (let t = 0; t < 2000; t += 50) { vi.advanceTimersByTime(50); poses.add(sprite().dataset.pose!); }
    expect([...poses].sort()).toEqual(['run', 'walk']);
  });

  it('very strong: has a torch ready for the power cut', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    level(3);
    expect(sprite().querySelector('[data-prop="torch"]')).not.toBeNull();
  });

  it('violent typhoon: stays inside while the rain hits the house', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    level(4);
    expect(prop('house')).not.toBeNull();
    expect(prop('rain')).not.toBeNull();
    expect(sprite().dataset.pose).toBe('stand');
  });

  it('goes back to standing as soon as the row is closed', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    level(2);
    level(null);
    expect(sprite().dataset.pose).toBe('stand');
    expect(prop('wind')).toBeNull();
  });
});
