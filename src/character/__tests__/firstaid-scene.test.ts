import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FIRSTAID_TIPS } from '../tips';

let observed: ((entries: unknown[]) => void) | null = null;

function mockMotion(reduced: boolean) {
  (globalThis as any).window.matchMedia = () => ({
    matches: reduced, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
}

beforeEach(() => {
  document.body.innerHTML = `
    <section class="section" id="firstaid">
      <div id="firstaid-scene" class="character-scene"></div>
    </section>
  `;
  localStorage.clear();
  mockMotion(false);
  observed = null;
  (globalThis as any).IntersectionObserver = class {
    constructor(cb: (entries: unknown[]) => void) { observed = cb; }
    observe() {} unobserve() {} disconnect() {}
    takeRecords() { return []; }
  };
  vi.useFakeTimers();
});

const sprite = () => document.querySelector<SVGSVGElement>('#firstaid-scene .mamoru-sprite')!;
const prop = (name: string) => document.querySelector(`#firstaid-scene [data-prop="${name}"]`);
const step = (s: string | null) =>
  document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: s } }));

describe('firstaid-scene', () => {
  it('Mamo stands on a pixel stage with nothing in her hands', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    expect(sprite().dataset.pose).toBe('stand');
    expect(sprite().dataset.gender).toBe('female');
    expect(document.querySelectorAll('#firstaid-scene [data-prop]').length).toBe(0);
  });

  it('scrolling the page does not make her kneel or reach', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    observed?.([{ boundingClientRect: { top: -2000, height: 400 } }]);
    vi.advanceTimersByTime(5000);
    expect(sprite().dataset.pose).toBe('stand');
  });

  it('blinks now and then while idle', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    let blinked = false;
    for (let t = 0; t < 6000; t += 50) {
      vi.advanceTimersByTime(50);
      if (sprite().dataset.blink) blinked = true;
    }
    expect(blinked).toBe(true);
    vi.advanceTimersByTime(400);
  });

  it('CPR: kneels at a patient and pushes on a 100 to 120 per minute beat', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    step('cpr');
    expect(sprite().dataset.pose).toBe('kneel');
    expect(prop('patient')).not.toBeNull();
    const ys = new Set<string>();
    let pushes = 0;
    let last = sprite().getAttribute('y');
    for (let t = 0; t < 6000; t += 10) {
      vi.advanceTimersByTime(10);
      const y = sprite().getAttribute('y')!;
      ys.add(y);
      if (y !== last && Number(y) > Number(last)) pushes++;
      last = y;
    }
    expect(ys.size).toBe(2);
    expect(pushes).toBeGreaterThanOrEqual(10);
    expect(pushes).toBeLessThanOrEqual(12);
  });

  it('crush injury: calls 119 on a phone she actually holds', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    step('crush');
    expect(sprite().dataset.pose).toBe('phone');
    expect(sprite().querySelector('[data-prop="phone"]')).not.toBeNull();
  });

  it('burns: holds the burn under running water', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    step('burns');
    expect(prop('tap')).not.toBeNull();
  });

  it('smoke: stays low under the smoke', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    step('smoke');
    expect(sprite().dataset.pose).toBe('crouch');
    expect(prop('smoke')).not.toBeNull();
  });

  it('shows the tip that matches the card', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    step('cpr');
    const en = document.querySelector('#firstaid-scene .tip-bubble [data-lang="en"]')!.textContent;
    expect(en).toBe(FIRSTAID_TIPS[2].en);
  });

  it('stands up and puts things away right after the card closes', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    step('cpr');
    step(null);
    expect(sprite().dataset.pose).toBe('stand');
    expect(prop('patient')).toBeNull();
  });

  it('reduced motion: shows the action as one still frame', async () => {
    mockMotion(true);
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    step('cpr');
    const y = sprite().getAttribute('y');
    vi.advanceTimersByTime(3000);
    expect(sprite().dataset.pose).toBe('kneel');
    expect(sprite().getAttribute('y')).toBe(y);
  });
});
