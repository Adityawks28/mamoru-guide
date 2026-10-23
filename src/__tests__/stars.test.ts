import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initStars } from '../stars';

function mockMotion(reduced: boolean) {
  (window as any).matchMedia = () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} });
}

describe('night sky', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="stars"></div><div class="ks-shooters"></div>';
    localStorage.clear();
    mockMotion(false);
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('most stars hold still and only some blink', () => {
    initStars();
    const stars = document.querySelectorAll('.ks-star');
    const blinking = document.querySelectorAll('.ks-star.blink');
    expect(stars.length).toBe(120);
    expect(blinking.length).toBeGreaterThan(stars.length * 0.15);
    expect(blinking.length).toBeLessThan(stars.length * 0.5);
  });

  it('a shooting star shows up now and then, and is gone once it burns out', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    initStars();
    const shooters = () => document.querySelectorAll('.ks-shooters .ks-shooter');
    expect(shooters().length).toBe(0);
    vi.advanceTimersByTime(12000);
    expect(shooters().length).toBe(1);
    // Removed on a timer, not animationend: a hidden sky (day mode, other
    // routes) never runs the animation, so the event would never come.
    vi.advanceTimersByTime(1500);
    expect(shooters().length).toBe(0);
    vi.mocked(Math.random).mockRestore();
  });

  it('no shooting stars with reduced motion', () => {
    mockMotion(true);
    initStars();
    vi.advanceTimersByTime(60000);
    expect(document.querySelectorAll('.ks-shooter').length).toBe(0);
  });

  it('a shooting star travels along its own tail, not sideways', () => {
    const css = readFileSync(resolve(process.cwd(), 'css/hero-arcade.css'), 'utf8');
    const frames = css.match(/@keyframes ks-shoot\s*\{([\s\S]*?)\n\}/)![1];
    expect(frames).toMatch(/translateX\(/);
    expect(frames).not.toMatch(/translate\(/);
  });
});
