import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <section class="section" id="firstaid">
      <div id="firstaid-scene" class="character-scene"></div>
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

describe('firstaid-scene', () => {
  it('mounts with Mamo (female) in stand', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
    expect(svg.getAttribute('data-gender')).toBe('female');
  });

  it('cpr → thrust', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: 'cpr' } }));
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('thrust');
  });

  it('smoke → crouch', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: 'smoke' } }));
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('crouch');
  });

  it('crush → phone', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: 'crush' } }));
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('phone');
  });

  it('null → stand after lock expires', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: 'cpr' } }));
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: null } }));
    vi.advanceTimersByTime(4100);
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });
});
