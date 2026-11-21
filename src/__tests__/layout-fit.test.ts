import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { en } from '../locales/en';
import { ja } from '../locales/ja';
import { id } from '../locales/id';

const read = (f: string) => readFileSync(resolve(process.cwd(), f), 'utf8');
const css = (f: string) => read(f).replace(/\/\*[\s\S]*?\*\//g, '');

// Chrome, 2026-11-21: at a 958px viewport the full navbar was 1075px wide in en and id
// (12px pixel links, 20px gaps). A desktop scrollbar takes up to 17px of the viewport.
const NAVBAR_FULL_WIDTH = 1075;
const SCROLLBAR = 17;
// Width of the nav labels in that measurement: 46 pixel-font characters at 13px (12px + 1px letter-spacing).
const MEASURED_LABEL_WIDTH = 46 * 13;
const NAV_KEYS = ['nav.emergency', 'nav.prepare', 'nav.shelter', 'nav.learn', 'nav.plan'];

// Every `@media (max-width: Npx) { ... }` block, with its body.
function maxWidthBlocks(text: string): { px: number; body: string }[] {
  const blocks: { px: number; body: string }[] = [];
  for (const m of text.matchAll(/@media\s*\(max-width:\s*(\d+)px\)\s*\{/g)) {
    let depth = 1;
    let j = m.index! + m[0].length;
    for (; j < text.length && depth > 0; j++) {
      if (text[j] === '{') depth++;
      else if (text[j] === '}') depth--;
    }
    blocks.push({ px: Number(m[1]), body: text.slice(m.index! + m[0].length, j - 1) });
  }
  return blocks;
}

describe('navbar fits', () => {
  const collapse = maxWidthBlocks(css('css/responsive.css')).filter(b => /\.nav-links\s*\{\s*display:\s*none/.test(b.body));

  it('one media query collapses the nav links into the menu', () => {
    expect(collapse).toHaveLength(1);
    const { body } = collapse[0];
    expect(body).toMatch(/\.hamburger\s*\{[^}]*display:\s*flex/);
    expect(body).toMatch(/\.mobile-menu\s*\{[^}]*display:\s*flex/);
    expect(body).toMatch(/\.lang-switcher[^{]*\{[^}]*display:\s*none/);
  });

  it('collapses at every width where the full navbar does not fit', () => {
    expect(collapse[0].px).toBeGreaterThanOrEqual(NAVBAR_FULL_WIDTH + SCROLLBAR);
  });

  it('no language has nav labels wider than the measured ones (measure again if this fails)', () => {
    const width = (locale: Record<string, string>, perChar: number) =>
      NAV_KEYS.reduce((sum, k) => sum + [...locale[k]].length * perChar, 0);
    expect(width(en, 13)).toBeLessThanOrEqual(MEASURED_LABEL_WIDTH);
    expect(width(id, 13)).toBeLessThanOrEqual(MEASURED_LABEL_WIDTH);
    expect(width(ja, 15)).toBeLessThanOrEqual(MEASURED_LABEL_WIDTH); // 14px + 1px under body.lang-ja
  });

  it('the open menu holds all three language buttons', () => {
    const doc = new DOMParser().parseFromString(read('index.html'), 'text/html');
    const buttons = [...doc.querySelectorAll('#mobileMenu .lang-btn')].map(b => b.getAttribute('onclick'));
    expect(buttons).toEqual(["setLang('en')", "setLang('ja')", "setLang('id')"]);
  });
});

describe('mascot tip bubble', () => {
  it('sits in the frame above the sprite on wide screens, not on top of it', () => {
    const rule = css('css/hero-arcade.css').match(/(?:^|\})\s*\.pixel-bubble\s*\{([^}]*)\}/)![1];
    expect(rule).not.toMatch(/position:\s*absolute/);
    expect(rule).not.toMatch(/(^|[;\s])(top|right):/);
  });
});
