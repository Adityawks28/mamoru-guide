import { describe, it, expect, beforeEach, vi } from 'vitest';

function mockMotion(reduced: boolean) {
  (globalThis as any).window.matchMedia = () => ({
    matches: reduced, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
}

beforeEach(() => {
  document.body.innerHTML = `<div id="bag-scene" class="character-scene"></div>`;
  localStorage.clear();
  mockMotion(false);
  vi.useFakeTimers();
});

const host = () => document.getElementById('bag-scene')!;
const sprite = () => document.querySelector('#bag-scene svg')!;
const sweatDrops = () => sprite().querySelectorAll('rect[fill="#8fd3ff"]').length;
const bubbleEn = () => document.querySelector('#bag-scene .tip-bubble [data-lang="en"]')!.textContent ?? '';
const pack = (weight: number, extra: object = {}) =>
  document.dispatchEvent(new CustomEvent('mamoru:bag-weight', { detail: { weight, max: 10, ...extra } }));

describe('bag-scene', () => {
  it('returns early when mount is absent', async () => {
    document.body.innerHTML = '';
    const { initBagScene } = await import('../bag-scene');
    expect(() => initBagScene()).not.toThrow();
  });

  it('starts standing at ease with an empty bag', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    expect(sprite().getAttribute('data-pose')).toBe('stand');
    expect(host().dataset.load).toBe('empty');
    expect(sweatDrops()).toBe(0);
  });

  it('a light bag makes him cheerful', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    pack(2.4);
    expect(host().dataset.load).toBe('light');
    expect(sprite().getAttribute('data-pose')).toBe('stand');
    expect(sweatDrops()).toBe(0);
  });

  it('past 70% of the limit he slumps and sweats', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    pack(7.5);
    expect(host().dataset.load).toBe('heavy');
    expect(sprite().getAttribute('data-pose')).toBe('tired');
    expect(sweatDrops()).toBe(1);
  });

  it('past 90% he gasps for breath, dripping sweat', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    pack(9.6);
    expect(host().dataset.load).toBe('strain');
    expect(sweatDrops()).toBe(3);
    expect(bubbleEn()).toMatch(/heavy/i);
  });

  it('an item that would not fit makes him stagger, then he settles back', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    pack(9.6);
    pack(9.6, { rejected: true });
    expect(host().dataset.load).toBe('reject');
    vi.advanceTimersByTime(1000);
    expect(host().dataset.load).toBe('strain');
  });

  it('says how the weight feels when it changes tier', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    pack(7.5);
    const heavy = bubbleEn();
    pack(2);
    expect(bubbleEn()).not.toBe(heavy);
  });

  it('still reacts with reduced motion', async () => {
    mockMotion(true);
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    pack(9.6);
    expect(sprite().getAttribute('data-pose')).toBe('tired');
    expect(sweatDrops()).toBe(3);
  });
});
