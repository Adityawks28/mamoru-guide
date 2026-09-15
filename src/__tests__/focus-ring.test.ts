import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CSS_DIR = resolve(__dirname, '../../css');

// Matches a CSS rule: everything up to `{`, then the body up to the closing `}`.
const RULE = /([^{}]+)\{([^{}]*)\}/g;

function offendingRules(): string[] {
  const offenders: string[] = [];
  for (const file of readdirSync(CSS_DIR).filter((f) => f.endsWith('.css'))) {
    const css = readFileSync(resolve(CSS_DIR, file), 'utf8');
    for (const [, selector, body] of css.matchAll(RULE)) {
      if (!selector.includes(':focus')) continue;
      if (!/outline\s*:\s*(none|0)\b/.test(body)) continue;
      offenders.push(`${file}: ${selector.trim().replace(/\s+/g, ' ')}`);
    }
  }
  return offenders;
}

describe('focus ring', () => {
  it('is never cancelled by a :focus rule', () => {
    // css/base.css:49 defines the ring inside :where(), which has ZERO
    // specificity — any later class rule silently wins. Cancelling the
    // outline there leaves keyboard users with no visible focus.
    expect(offendingRules()).toEqual([]);
  });

  it('defines --focus-ring for both themes', () => {
    const vars = readFileSync(resolve(CSS_DIR, 'variables.css'), 'utf8');
    const rings = vars.match(/--focus-ring\s*:/g) ?? [];
    expect(rings.length).toBeGreaterThanOrEqual(2);
  });
});
