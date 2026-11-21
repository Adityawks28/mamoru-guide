import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (f: string) => readFileSync(resolve(process.cwd(), f), 'utf8');
const CSS_FILES = readdirSync(resolve(process.cwd(), 'css')).filter(f => f.endsWith('.css'));
const css = (file: string) => read(`css/${file}`).replace(/\/\*[\s\S]*?\*\//g, '');

const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'emoji', 'math', 'inherit', 'initial', 'unset']);
// Installed with the OS, so the page does not need to load them.
const SYSTEM_FONTS = new Set([
  'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo',
  // Print stack only (css/print.css): ships with Android and ChromeOS, and the stack ends in system-ui where it is absent.
  'Noto Sans JP',
]);
// Text below 12px is allowed nowhere outside @media print.
const SMALL_SIZE_EXCEPTIONS: string[] = [];

// Removes every `@media print { ... }` block, braces matched.
function withoutPrint(text: string): string {
  let out = '';
  let i = 0;
  for (;;) {
    const at = text.indexOf('@media print', i);
    if (at === -1) return out + text.slice(i);
    out += text.slice(i, at);
    let depth = 0;
    let j = text.indexOf('{', at);
    for (; j < text.length; j++) {
      if (text[j] === '{') depth++;
      else if (text[j] === '}' && --depth === 0) break;
    }
    i = j + 1;
  }
}

function families(value: string): string[] {
  // A var() fallback list is checked like any other family list.
  return value.replace(/!important/, '').replace(/var\(--[\w-]+\s*,?/g, '').replace(/\)/g, '').split(',')
    .map(f => f.trim().replace(/^['"]|['"]$/g, ''))
    .filter(f => f && !f.startsWith('ui-') && !GENERIC.has(f));
}

function loadedFamilies(html: string): string[] {
  const href = html.match(/<link[^>]+href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"/)?.[1] ?? '';
  return [...href.matchAll(/family=([^:&]+)/g)].map(m => decodeURIComponent(m[1]).replace(/\+/g, ' '));
}

// Smallest length in a font-size value, in px (rem and em counted against the 16px root).
function smallestPx(value: string): number {
  const sizes = [...value.matchAll(/(\d*\.?\d+)(px|rem|em|pt|%)/g)].map(([, n, unit]) => {
    const v = parseFloat(n);
    return unit === 'px' ? v : unit === 'pt' ? v * 4 / 3 : unit === '%' ? v / 100 * 16 : v * 16;
  });
  if (/\b(xx?-small|smaller)\b/.test(value)) sizes.push(0);
  return sizes.length ? Math.min(...sizes) : Infinity;
}

function declarations(text: string, prop: RegExp): { selector: string; value: string }[] {
  const found: { selector: string; value: string }[] = [];
  for (const [, selector, body] of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const [, value] of body.matchAll(prop)) found.push({ selector: selector.trim().replace(/\s+/g, ' '), value: value.trim() });
  }
  return found;
}

describe('fonts', () => {
  it('names Press Start 2P only in the --pixel-font token', () => {
    const offenders: string[] = [];
    for (const file of CSS_FILES) {
      read(`css/${file}`).split('\n').forEach((line, i) => {
        if (!/Press Start 2P/.test(line)) return;
        if (file === 'variables.css' && /^\s*--pixel-font:/.test(line)) return;
        offenders.push(`css/${file}:${i + 1}: ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('has one token for pixel text, defined once', () => {
    const defs = CSS_FILES.flatMap(f => [...css(f).matchAll(/(--(?:pixel|arcade)-font)\s*:/g)].map(m => `${f}: ${m[1]}`));
    expect(defs).toEqual(['variables.css: --pixel-font']);
    expect(CSS_FILES.filter(f => /var\(--arcade[,)]|var\(--arcade-font\)/.test(css(f)))).toEqual([]);
  });

  it('--pixel-font lists a Japanese-capable pixel font before the generic family', () => {
    const value = css('variables.css').match(/--pixel-font:\s*([^;]+);/)?.[1] ?? '';
    const list = value.split(',').map(f => f.trim().replace(/^['"]|['"]$/g, ''));
    expect(list[0]).toBe('Press Start 2P');
    expect(list).toContain('DotGothic16');
    expect(list.indexOf('DotGothic16')).toBeLessThan(list.indexOf('monospace'));
  });

  it('loads every font family the CSS names from the Google Fonts link', () => {
    const loaded = new Set(loadedFamilies(read('index.html')));
    const missing = new Set<string>();
    for (const file of CSS_FILES) {
      for (const { value } of declarations(css(file), /(?:font-family|--[\w-]*font)\s*:\s*([^;]+)/g)) {
        families(value).filter(f => !loaded.has(f) && !SYSTEM_FONTS.has(f)).forEach(f => missing.add(`${file}: ${f}`));
      }
    }
    expect([...missing]).toEqual([]);
  });

  it('keeps the font link CORS-enabled and swap-displayed, with DotGothic16, in index.html and the 404 page', () => {
    for (const page of ['index.html', 'public/404.html']) {
      const link = read(page).match(/<link[^>]+fonts\.googleapis\.com[^>]*>/)?.[0] ?? '';
      expect(loadedFamilies(link), page).toContain('DotGothic16');
      expect(link, page).toContain('display=swap');
      expect(link, page).toContain('crossorigin="anonymous"');
    }
  });

  it('sets no font-size below 12px outside @media print', () => {
    const small: string[] = [];
    for (const file of CSS_FILES) {
      for (const { selector, value } of declarations(withoutPrint(css(file)), /(?:^|[;\s])font-size\s*:\s*([^;]+)/g)) {
        const where = `${file}: ${selector}`;
        if (smallestPx(value) < 12 && !SMALL_SIZE_EXCEPTIONS.includes(where)) small.push(`${where} { font-size: ${value} }`);
      }
    }
    expect(small).toEqual([]);
  });

  it('shows the Japanese tip at 14px or more, the size DotGothic16 kanji need', () => {
    const rule = declarations(css('hero-arcade.css'), /(?:^|[;\s])font-size\s*:\s*([^;]+)/g)
      .find(d => d.selector.split(',').map(s => s.trim()).includes('body.lang-ja .pb-t'));
    expect(rule, 'body.lang-ja .pb-t { font-size }').toBeDefined();
    expect(smallestPx(rule!.value)).toBeGreaterThanOrEqual(14);
  });
});
