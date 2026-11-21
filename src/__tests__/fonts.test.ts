import { existsSync, readdirSync, readFileSync } from 'node:fs';
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

// The @font-face rules in a stylesheet: family, src and font-display of each.
function fontFaces(text: string): { family: string; src: string; display: string }[] {
  return [...text.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => ({
    family: body.match(/font-family:\s*([^;]+)/)?.[1].trim().replace(/^['"]|['"]$/g, '') ?? '',
    src: body.match(/src:\s*([^;]+)/)?.[1].trim() ?? '',
    display: body.match(/font-display:\s*([^;]+)/)?.[1].trim() ?? '',
  }));
}

function loadedFamilies(text: string): string[] {
  return fontFaces(text).map(f => f.family);
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
        if (file === 'fonts.css' && /^\s*font-family:/.test(line)) return;
        offenders.push(`css/${file}:${i + 1}: ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('has one token for pixel labels and one for pixel sentences, each defined once', () => {
    const defs = CSS_FILES.flatMap(f => [...css(f).matchAll(/(--(?:pixel|arcade)-font)\s*:/g)].map(m => `${f}: ${m[1]}`));
    expect(defs).toEqual(['variables.css: --pixel-font']);
    expect(CSS_FILES.flatMap(f => [...css(f).matchAll(/--pixel-text\s*:/g)].map(() => f))).toEqual(['variables.css']);
    expect(CSS_FILES.filter(f => /var\(--arcade[,)]|var\(--arcade-font\)/.test(css(f)))).toEqual([]);
  });

  it('--pixel-font lists a Japanese-capable pixel font before the generic family', () => {
    const value = css('variables.css').match(/--pixel-font:\s*([^;]+);/)?.[1] ?? '';
    const list = value.split(',').map(f => f.trim().replace(/^['"]|['"]$/g, ''));
    expect(list[0]).toBe('Press Start 2P');
    expect(list).toContain('DotGothic16');
    expect(list.indexOf('DotGothic16')).toBeLessThan(list.indexOf('monospace'));
  });

  it('loads every font family the CSS names from the local @font-face rules', () => {
    const loaded = new Set(loadedFamilies(read('css/fonts.css')));
    const missing = new Set<string>();
    for (const file of CSS_FILES) {
      for (const { value } of declarations(css(file), /(?:font-family|--[\w-]*font)\s*:\s*([^;]+)/g)) {
        families(value).filter(f => !loaded.has(f) && !SYSTEM_FONTS.has(f)).forEach(f => missing.add(`${file}: ${f}`));
      }
    }
    expect([...missing]).toEqual([]);
  });

  it('every @font-face points to a woff2 file in public/fonts, with font-display: swap', () => {
    const pages: [string, string, number][] = [['css/fonts.css', '/fonts/', 5], ['public/404.html', '/mamoru-guide/fonts/', 4]];
    for (const [page, prefix, count] of pages) {
      const faces = fontFaces(read(page));
      expect(faces, page).toHaveLength(count);
      for (const { family, src, display } of faces) {
        const url = src.match(/^url\(['"]?([^'")]+)['"]?\)\s+format\(['"]woff2['"]\)$/)?.[1] ?? '';
        expect(url.startsWith(prefix), `${page}: ${family} ${src}`).toBe(true);
        expect(url.endsWith('.woff2'), `${page}: ${family} ${src}`).toBe(true);
        expect(existsSync(resolve(process.cwd(), 'public/fonts', url.slice(prefix.length))), `${page}: ${url}`).toBe(true);
        expect(display, `${page}: ${family}`).toBe('swap');
      }
    }
    expect(loadedFamilies(read('public/404.html'))).toContain('DotGothic16');
  });

  it('index.html and the 404 page make no request to fonts.googleapis.com or fonts.gstatic.com', () => {
    for (const page of ['index.html', 'public/404.html', ...CSS_FILES.map(f => `css/${f}`)]) {
      expect(read(page), page).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
    }
    expect(read('index.html')).toMatch(/<link rel="stylesheet" href="css\/fonts\.css">\s*<link rel="stylesheet" href="css\/variables\.css">/);
  });

  it('each font has its OFL file', () => {
    for (const name of ['PressStart2P', 'DotGothic16', 'MPLUSRounded1c']) {
      expect(read(`public/fonts/OFL-${name}.txt`), name).toContain('SIL Open Font License, Version 1.1');
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

  // Sentences read in DotGothic16 (--pixel-text): Press Start 2P wraps them into two or three words a line,
  // and its digits do not match the Japanese next to them (ruling R36).
  const SENTENCES: Record<string, string[]> = {
    'hero-arcade.css': ['.pb-t', '.mascot-hint'],
    'earthquake-room.css': ['.mr-procedure', '.mamoru-room .tip-bubble'],
    'character.css': ['.tip-bubble'],
    'layout.css': ['.toast'],
  };
  const ruleBodies = (file: string, selector: string) =>
    [...css(file).matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, sel]) => sel.split(',').map(s => s.trim().replace(/\s+/g, ' ')).includes(selector))
      .map(([, , body]) => body);

  it('--pixel-text puts DotGothic16 first, for sentences', () => {
    const value = css('variables.css').match(/--pixel-text:\s*([^;]+);/)?.[1] ?? '';
    expect(value.split(',').map(f => f.trim().replace(/^['"]|['"]$/g, ''))).toEqual(['DotGothic16', 'monospace']);
  });

  it('sets pixel sentences in --pixel-text at 14px or more, in every language', () => {
    const wrong: string[] = [];
    for (const [file, selectors] of Object.entries(SENTENCES)) {
      for (const selector of selectors) {
        const bodies = ruleBodies(file, selector);
        if (!bodies.some(b => /font-family:\s*var\(--pixel-text\)/.test(b))) wrong.push(`${file}: ${selector} font-family`);
        if (bodies.some(b => /font-family:/.test(b) && !/var\(--pixel-text\)/.test(b.match(/font-family:[^;]+/)![0]))) wrong.push(`${file}: ${selector} other font`);
        const sizes = [...bodies, ...ruleBodies(file, `body.lang-ja ${selector}`), ...ruleBodies(file, `body.lang-id ${selector}`)]
          .flatMap(b => [...b.matchAll(/font-size:\s*([^;]+)/g)].map(m => smallestPx(m[1])));
        if (!sizes.length || Math.min(...sizes) < 14) wrong.push(`${file}: ${selector} size ${sizes.join('/')}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});
