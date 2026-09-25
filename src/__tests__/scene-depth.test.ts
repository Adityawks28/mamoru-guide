// scene-depth.test.ts

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = ['hero.css', 'hero-arcade.css']
  .map(f => readFileSync(resolve(process.cwd(), 'css', f), 'utf8'))
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

// Matches a CSS rule: everything up to `{`, then the body up to the closing `}`.
const RULE = /([^{}]+)\{([^{}]*)\}/g;

function zIndexOf(selector: string): number | undefined {
  let z: number | undefined;
  for (const [, selectors, body] of css.matchAll(RULE)) {
    if (!selectors.split(',').some(s => s.trim() === selector)) continue;
    const m = body.match(/z-index\s*:\s*(-?\d+)/);
    if (m) z = Number(m[1]);
  }
  return z;
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
