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
  // Everything that stands in the city stands on the shore line, so nothing
  // sinks into the water band below it and the mountains reach down behind
  // the city instead of ending mid-sky.
  const grounded = [
    '.ks-mountains', '.ks-bridge', '.ks-skyline', '.ks-cityhall',
    '.ks-crystal', '.ks-ferris', '.ks-museum', '.ks-tower', '.ks-quay',
  ];

  grounded.forEach(layer => {
    it(`${layer} stands on the shore`, () => {
      expect(propOf(layer, 'bottom')).toBe('var(--ks-shore)');
    });
  });

  it('the water fills exactly the band below the shore', () => {
    expect(propOf('.ks-water', 'height')).toBe('var(--ks-shore)');
  });
});

