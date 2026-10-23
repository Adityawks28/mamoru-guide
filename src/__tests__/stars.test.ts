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
    initStars();
    const shooters = () => document.querySelectorAll('.ks-shooters .ks-shooter');
    expect(shooters().length).toBe(0);
    vi.advanceTimersByTime(20000);
    expect(shooters().length).toBeGreaterThan(0);
    shooters().forEach(s => s.dispatchEvent(new Event('animationend')));
    expect(shooters().length).toBe(0);
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
