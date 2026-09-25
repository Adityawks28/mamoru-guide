// day-mode-selectors.test.ts

import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CSS_DIR = resolve(process.cwd(), 'css');

// Matches a CSS rule's selector list: everything up to `{`.
const SELECTORS = /([^{}]+)\{/g;

function selectorsIn(file: string): Set<string> {
  const css = readFileSync(resolve(CSS_DIR, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const found = new Set<string>();
  for (const [, list] of css.matchAll(SELECTORS)) {
    list.split(',').forEach(s => found.add(s.trim().replace(/\s+/g, ' ')));
  }
  return found;
}

describe('day mode selectors', () => {
  it('every [data-theme="day"] rule also targets body.day-mode', () => {
    // src/theme.ts only ever toggles body.day-mode. The [data-theme] form came
    // over from the prototype; on its own it never matches, so the rule is dead.
    const missing: string[] = [];
    for (const file of readdirSync(CSS_DIR).filter(f => f.endsWith('.css'))) {
      const selectors = selectorsIn(file);
      selectors.forEach(s => {
        if (!s.startsWith('[data-theme="day"]')) return;
        const twin = s.replace('[data-theme="day"]', 'body.day-mode');
        if (!selectors.has(twin)) missing.push(`${file}: ${twin}`);
      });
    }
    expect(missing).toEqual([]);
  });
});
