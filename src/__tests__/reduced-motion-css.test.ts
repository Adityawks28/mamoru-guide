// reduced-motion-css.test.ts: every looping CSS animation stops when the OS
// asks for reduced motion (WCAG 2.3.3), and the stop rule wins the cascade.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const RM = /prefers-reduced-motion:\s*reduce/;

interface Rule {
  file: string;
  /** Load order: the file's place in index.html, then the rule's place in the file. */
  order: [number, number];
  selectors: string[];
  decls: Map<string, string>;
  reduced: boolean;
}

const html = readFileSync(resolve(ROOT, 'index.html'), 'utf8');
const CSS_FILES = [...html.matchAll(/<link rel="stylesheet" href="(css\/[^"]+\.css)"(?! media="print")/g)].map(m => m[1]);

// A small block parser: enough for this project's plain CSS (no nesting
// except @media, no braces inside strings).
function parse(file: string, fileIdx: number): Rule[] {
  const css = readFileSync(resolve(ROOT, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rule[] = [];
  let n = 0;
  const walk = (text: string, reduced: boolean): void => {
    let i = 0;
    while (i < text.length) {
      const open = text.indexOf('{', i);
      if (open < 0) break;
      const prelude = text.slice(i, open).trim();
      let depth = 1, j = open + 1;
      while (depth > 0 && j < text.length) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
      }
      const body = text.slice(open + 1, j - 1);
      if (prelude.startsWith('@media')) walk(body, reduced || RM.test(prelude));
      else if (!prelude.startsWith('@')) {
        const decls = new Map<string, string>();
        body.split(';').forEach(d => {
          const k = d.indexOf(':');
          if (k > 0) decls.set(d.slice(0, k).trim(), d.slice(k + 1).trim());
        });
        rules.push({
          file, order: [fileIdx, n++], decls, reduced,
          selectors: prelude.split(',').map(s => s.trim().replace(/\s+/g, ' ')),
        });
      }
      i = j;
    }
  };
  walk(css, false);
  return rules;
}

const RULES = CSS_FILES.flatMap(parse);
const STOPS = RULES.filter(r => r.reduced && /^none\b/.test(r.decls.get('animation') ?? r.decls.get('animation-name') ?? ''));

const after = (a: Rule, b: Rule) => a.order[0] > b.order[0] || (a.order[0] === b.order[0] && a.order[1] > b.order[1]);
const important = (r: Rule) => /!important/.test(r.decls.get('animation') ?? '');

// A reduced-motion rule stops `selector` (declared in `rule`) when it names the
// same selector and comes later in the cascade, or when it is an !important
// `X *` rule and every element of that kind in index.html sits inside X.
function stopped(selector: string, rule: Rule): boolean {
  if (STOPS.some(s => s.selectors.includes(selector) && (after(s, rule) || important(s)))) return true;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const plain = selector.replace(/^(body\.day-mode|\[data-theme="day"\]) /, '');
  let found: Element[];
  try { found = [...doc.querySelectorAll(plain)]; } catch { return false; }
  if (!found.length) return false;
  return STOPS.some(s => important(s) && s.selectors.some(b => {
    const m = b.match(/^(.+) \*$/);
    return !!m && found.every(el => el.parentElement?.closest(m[1]));
  }));
}

describe('reduced motion in CSS', () => {
  it('finds the stylesheets and their reduced-motion rules', () => {
    expect(CSS_FILES.length).toBeGreaterThan(10);
    expect(STOPS.length).toBeGreaterThan(10);
  });

  it('stops the bag sprite at every load level (the stop rule must not lose on specificity)', () => {
    const loads = RULES.filter(r => !r.reduced && r.file === 'css/bag-game.css' && r.decls.has('animation')
      && r.selectors.some(s => s.startsWith('#bag-scene[data-load=')));
    expect(loads.length).toBe(4);
    const missing = loads.flatMap(r => r.selectors.filter(s => !stopped(s, r)));
    expect(missing).toEqual([]);
  });
});
