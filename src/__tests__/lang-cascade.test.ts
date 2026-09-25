import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CSS_DIR = resolve(__dirname, '../../css');

// Matches a CSS rule: everything up to `{`, then the body up to the closing `}`.
const RULE = /([^{}]+)\{([^{}]*)\}/g;
const DATA_LANG = /\[data-lang="(en|ja|id)"\]/;

/**
 * Scans every stylesheet for `[data-lang="xx"]` selectors that are not
 * scoped under a matching `body.lang-xx` ancestor. base.css's own language
 * switch (lines 60-63) is written this way on purpose; anything else that
 * targets `[data-lang="xx"]` directly sits at the same (0,2,0) specificity
 * and can silently outrank it later in cascade order, showing that
 * language's text regardless of which one is selected.
 */
function offendingRules(): string[] {
  const offenders: string[] = [];
  for (const file of readdirSync(CSS_DIR).filter((f) => f.endsWith('.css'))) {
    const css = readFileSync(resolve(CSS_DIR, file), 'utf8');
    for (const [, selectorList] of css.matchAll(RULE)) {
      for (const rawSelector of selectorList.split(',')) {
        const selector = rawSelector.trim();
        const match = selector.match(DATA_LANG);
        if (!match) continue;
        const lang = match[1];
        const gate = `body.lang-${lang}`;
        const gateIndex = selector.indexOf(gate);
        const dataLangIndex = selector.indexOf(match[0]);
        if (gateIndex !== -1 && gateIndex < dataLangIndex) continue;
        offenders.push(`${file}: ${selector.replace(/\s+/g, ' ')}`);
      }
    }
  }
  return offenders;
}

describe('data-lang cascade scoping', () => {
  it('every [data-lang="xx"] selector is gated by a body.lang-xx ancestor', () => {
    // css/hero-arcade.css:259 used `.pb-sub [data-lang="id"]` unscoped, which
    // won the cascade over base.css's language switch and rendered the
    // Indonesian fact line in every language.
    expect(offendingRules()).toEqual([]);
  });
});
