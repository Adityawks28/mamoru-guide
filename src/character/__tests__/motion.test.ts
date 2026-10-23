import { describe, it, expect, beforeEach, vi } from 'vitest';

function mockMatchMedia(reducedMotion: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches: reducedMotion,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  };
  (globalThis as any).window = (globalThis as any).window ?? {};
  (globalThis as any).window.matchMedia = () => mql;
  return { mql, fire: (next: boolean) => {
    mql.matches = next;
    listeners.forEach(l => l({ matches: next } as MediaQueryListEvent));
  }};
}

describe('motion', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('motionAllowed returns true when neither flag is set', async () => {
    mockMatchMedia(false);
    const { motionAllowed } = await import('../motion');
    expect(motionAllowed()).toBe(true);
  });

  it('motionAllowed returns false when system prefers reduced', async () => {
    mockMatchMedia(true);
    const { motionAllowed } = await import('../motion');
    expect(motionAllowed()).toBe(false);
  });

  it('motionAllowed returns false when storage key is true', async () => {
    mockMatchMedia(false);
    localStorage.setItem('a11y-reduced-motion', 'true');
    const { motionAllowed } = await import('../motion');
    expect(motionAllowed()).toBe(false);
  });

  it('onMotionChange fires on media-query change', async () => {
    const { fire } = mockMatchMedia(false);
    const { onMotionChange } = await import('../motion');
    const cb = vi.fn();
    onMotionChange(cb);
    fire(true);
    expect(cb).toHaveBeenCalledWith(false);
    fire(false);
    expect(cb).toHaveBeenLastCalledWith(true);
  });

  it('onMotionChange fires on storage event', async () => {
    mockMatchMedia(false);
    const { onMotionChange } = await import('../motion');
    const cb = vi.fn();
    onMotionChange(cb);
    localStorage.setItem('a11y-reduced-motion', 'true');
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'a11y-reduced-motion', newValue: 'true',
    }));
    expect(cb).toHaveBeenCalledWith(false);
  });
});

describe('quakeFrames', () => {
  it('is whole-pixel offsets that start and end at rest', async () => {
    const { quakeFrames } = await import('../motion');
    const frames = quakeFrames(9);
    expect(frames.length).toBeGreaterThan(12);
    for (const f of frames) {
      expect(Number.isInteger(f.x) && Number.isInteger(f.y)).toBe(true);
    }
    expect(frames[0]).toEqual({ x: 0, y: 0 });
    expect(frames[frames.length - 1]).toEqual({ x: 0, y: 0 });
  });

  it('shakes harder and longer at a higher shindo', async () => {
    const { quakeFrames } = await import('../motion');
    const peak = (n: number) => Math.max(...quakeFrames(n).map(f => Math.abs(f.x)));
    expect(peak(9)).toBeGreaterThan(peak(4));
    expect(peak(4)).toBeGreaterThan(peak(1));
    expect(quakeFrames(9).length).toBeGreaterThan(quakeFrames(1).length);
  });

  it('builds up and dies down instead of shaking at one strength', async () => {
    const { quakeFrames } = await import('../motion');
    const xs = quakeFrames(9).map(f => Math.abs(f.x));
    const third = Math.floor(xs.length / 3);
    const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
    const start = mean(xs.slice(0, third / 2));
    const middle = mean(xs.slice(third, 2 * third));
    const end = mean(xs.slice(-third / 2));
    expect(middle).toBeGreaterThan(start * 2);
    expect(middle).toBeGreaterThan(end * 2);
  });

  it('does not shake at shindo 0', async () => {
    const { quakeFrames } = await import('../motion');
    expect(quakeFrames(0)).toEqual([]);
  });
});
