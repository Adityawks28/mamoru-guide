import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initDrill } from '../drill';

function mockReducedMotion(reduced: boolean): void {
  (globalThis as any).window.matchMedia = () => ({
    matches: reduced, media: '', onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}

let vibrate: ReturnType<typeof vi.fn>;

beforeEach(() => {
  document.body.innerHTML = '<button id="drillStartBtn"></button><div id="drillContainer"></div>';
  localStorage.clear();
  vibrate = vi.fn();
  Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true, writable: true });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Start the drill and run the 3-2-1 countdown: the alert screen shakes.
function startDrill(): HTMLElement {
  initDrill();
  document.getElementById('drillStartBtn')!.click();
  vi.advanceTimersByTime(3000);
  return document.getElementById('drillContainer')!;
}

describe('drill shake and reduced motion', () => {
  it('shakes and vibrates when motion is allowed', () => {
    mockReducedMotion(false);
    const container = startDrill();
    expect(container.querySelector('.drill-alert')).toBeTruthy();
    expect(container.classList.contains('shaking')).toBe(true);
    expect(vibrate).toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(container.classList.contains('shaking')).toBe(false);
  });

  it('does not shake or vibrate when the OS asks for reduced motion', () => {
    mockReducedMotion(true);
    const container = startDrill();
    expect(container.querySelector('.drill-alert')).toBeTruthy();
    expect(container.classList.contains('shaking')).toBe(false);
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('does not shake or vibrate when the app setting turns motion off', () => {
    mockReducedMotion(false);
    localStorage.setItem('a11y-reduced-motion', 'true');
    const container = startDrill();
    expect(container.classList.contains('shaking')).toBe(false);
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('does not shake the first question either', () => {
    mockReducedMotion(true);
    const container = startDrill();
    vi.advanceTimersByTime(2500); // the first question also has shake: true
    expect(container.querySelector('.drill-scenario')).toBeTruthy();
    expect(container.classList.contains('shaking')).toBe(false);
    expect(vibrate).not.toHaveBeenCalled();
  });
});
