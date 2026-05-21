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
