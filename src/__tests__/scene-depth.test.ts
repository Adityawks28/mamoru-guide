// scene-depth.test.ts

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = ['hero.css', 'hero-arcade.css']
  .map(f => readFileSync(resolve(process.cwd(), 'css', f), 'utf8'))
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

// Matches a CSS rule: everything up to `{`, then the body up to the closing `}`.
const RULE = /([^{}]+)\{([^{}]*)\}/g;

// Last value of `prop` in any rule (media blocks included) for exactly `selector`.
function propOf(selector: string, prop: string): string | undefined {
  let v: string | undefined;
  for (const [, selectors, body] of css.matchAll(RULE)) {
    if (!selectors.split(',').some(s => s.trim() === selector)) continue;
    const m = body.match(new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([^;]+)`));
    if (m) v = m[1].trim();
  }
  return v;
}

function zIndexOf(selector: string): number | undefined {
  const v = propOf(selector, 'z-index');
  return v === undefined ? undefined : Number(v);
}

describe('harbor scene depth', () => {
  // Side view: lower on screen is closer to the viewer. The boat is on the
  // water, in front of everything it sails past. A z-index tie falls back to
  // HTML order, which is how the quay ended up slicing through the cabin.
  const behindBoat = [
    '.ks-water', '.ks-quay', '.ks-skyline', '.ks-cityhall', '.ks-bridge',
    '.ks-crystal', '.ks-ferris', '.ks-museum', '.ks-tower',
  ];

  behindBoat.forEach(layer => {
    it(`boat paints over ${layer}`, () => {
      const boat = zIndexOf('.ks-boat');
      const other = zIndexOf(layer);
      expect(boat).toBeDefined();
      expect(other).toBeDefined();
      expect(boat!).toBeGreaterThan(other!);
    });
  });
});

describe('harbor scene ground line', () => {
  // Side view with one ground line: the top of the quay. Every building's
  // lowest pixel sits on it, so nothing hovers over the pavement or sinks
  // into it. Only the backdrop (mountains) and the quay itself start lower,
  // at the shore, where the water band ends.
  const standing = [
    '.ks-bridge', '.ks-skyline', '.ks-cityhall',
    '.ks-crystal', '.ks-ferris', '.ks-museum', '.ks-tower',
  ];

  standing.forEach(layer => {
    it(`${layer} stands on the quay`, () => {
      expect(propOf(layer, 'bottom')).toBe('var(--ks-ground)');
    });
  });

  it('the mountains and the quay start at the shore', () => {
    expect(propOf('.ks-mountains', 'bottom')).toBe('var(--ks-shore)');
    expect(propOf('.ks-quay', 'bottom')).toBe('var(--ks-shore)');
  });

  it('the quay fills the band from the shore up to the ground', () => {
    expect(propOf('.ks-quay', 'height')).toBe('calc(var(--ks-ground) - var(--ks-shore))');
  });

  it('the water fills exactly the band below the shore', () => {
    expect(propOf('.ks-water', 'height')).toBe('var(--ks-shore)');
  });

  it('city hall hugs its content instead of a fixed box it overflows', () => {
    expect(propOf('.ks-cityhall', 'height')).toBeUndefined();
  });
});

describe('harbor landmark art', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Lowest y any shape reaches, in viewBox units.
  function lowestY(svg: Element): number {
    let max = -Infinity;
    const n = (el: Element, a: string) => Number(el.getAttribute(a) ?? 0);
    for (const el of svg.querySelectorAll('rect, line, circle, ellipse, path, polygon')) {
      if (el.closest('[class*="ferris-spin"]')) continue; // the spinning wheel never reaches the stand's feet
      const stroke = el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none' ? n(el, 'stroke-width') / 2 : 0;
      let y: number;
      switch (el.tagName.toLowerCase()) {
        case 'rect': y = n(el, 'y') + n(el, 'height'); break;
        case 'line': y = Math.max(n(el, 'y1'), n(el, 'y2')) + stroke; break;
        case 'circle': y = n(el, 'cy') + n(el, 'r') + stroke; break;
        case 'ellipse': y = n(el, 'cy') + n(el, 'ry') + stroke; break;
        default: {
          const nums = (el.getAttribute('d') ?? el.getAttribute('points') ?? '').match(/-?\d+(\.\d+)?/g) ?? [];
          y = Math.max(...nums.filter((_, i) => i % 2 === 1).map(Number));
        }
      }
      max = Math.max(max, y);
    }
    return max;
  }

  const landmarks = ['.ks-crystal svg', '.ks-ferris svg', '.ks-museum svg', '.ks-tower svg', 'svg.ks-bridge'];

  landmarks.forEach(sel => {
    it(`${sel} draws down to the bottom edge of its box`, () => {
      const svg = doc.querySelector(sel)!;
      const [, minY, , h] = svg.getAttribute('viewBox')!.split(/\s+/).map(Number);
      expect(lowestY(svg)).toBe(minY + h);
      // 'meet' letterboxes a mismatched box top and bottom; YMax keeps the gap above.
      expect(svg.getAttribute('preserveAspectRatio') ?? 'xMidYMid meet').toMatch(/^none$|YMax/);
    });
  });
});
