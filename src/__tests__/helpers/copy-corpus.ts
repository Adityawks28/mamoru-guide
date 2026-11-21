import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative, basename } from 'node:path';

export type Lang = 'en' | 'ja' | 'id';
export interface CopyEntry {
  file: string;
  line: number;
  key: string;
  en?: string;
  ja?: string;
  id?: string;
  kind: 'instruction' | 'descriptive';
}

const ROOT = resolve(__dirname, '../../..');
const LANGS: Lang[] = ['en', 'ja', 'id'];

type Tok =
  | { t: 'str'; v: string; line: number }
  | { t: 'id'; v: string; line: number }
  | { t: 'p'; v: string; line: number };

const ESC: Record<string, string> = { n: '\n', t: '\t', r: '\r', '0': '\0' };

// Minimal TypeScript tokenizer: strings, template literals, identifiers, punctuation.
// Template literals keep their text; each ${...} interpolation is replaced with "{}".
function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  let line = 1;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++; }
      i += 2;
      continue;
    }
    if (c === "'" || c === '"') {
      const start = line;
      let v = '';
      i++;
      while (i < n && src[i] !== c) {
        if (src[i] === '\\') { i++; v += ESC[src[i]] ?? src[i]; } else v += src[i];
        i++;
      }
      i++;
      toks.push({ t: 'str', v, line: start });
      continue;
    }
    if (c === '`') {
      const start = line;
      let v = '';
      i++;
      while (i < n && src[i] !== '`') {
        if (src[i] === '\\') { i++; v += ESC[src[i]] ?? src[i]; }
        else if (src[i] === '$' && src[i + 1] === '{') {
          let depth = 1;
          i += 2;
          while (i < n && depth > 0) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            else if (src[i] === '\n') line++;
            i++;
          }
          v += '{}';
          continue;
        } else { if (src[i] === '\n') line++; v += src[i]; }
        i++;
      }
      i++;
      toks.push({ t: 'str', v, line: start });
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < n && /[\w$]/.test(src[j])) j++;
      toks.push({ t: 'id', v: src.slice(i, j), line });
      i = j;
      continue;
    }
    toks.push({ t: 'p', v: c, line });
    i++;
  }
  return toks;
}

interface Frame { props: Map<string, { v: string; line: number }>; }

function kindOf(file: string, key: string): CopyEntry['kind'] {
  const base = basename(file);
  if (/^(instruction|steps?)(_|$)/.test(key)) return 'instruction';
  if (key === '' && (base === 'earthquake-now.ts' || base === 'show-this.ts')) return 'instruction';
  if (/^(drill|typhoon)\.ts$/.test(base) && /step/.test(key)) return 'instruction';
  return 'descriptive';
}

function fromObjectLiterals(file: string, src: string): CopyEntry[] {
  const toks = tokenize(src);
  const out: CopyEntry[] = [];
  const stack: Frame[] = [];
  const flush = (f: Frame) => {
    const groups = new Map<string, Partial<Record<Lang | 'bare', { v: string; line: number }>>>();
    for (const [name, val] of f.props) {
      const m = /^(.*)_(en|ja|id)$/.exec(name);
      let key: string;
      let lang: Lang | 'bare';
      if (m) { key = m[1]; lang = m[2] as Lang; }
      else if (name === 'en' || name === 'ja' || (name === 'id' && (f.props.has('en') || f.props.has('ja')))) { key = ''; lang = name; }
      else if (name === 'jp' && f.props.has('en')) { key = ''; lang = 'ja'; }
      else { key = name; lang = 'bare'; }
      const g = groups.get(key) ?? {};
      g[lang] = val;
      groups.set(key, g);
    }
    for (const [key, g] of groups) {
      // `name` + name_ja + name_id: the bare property holds the English text.
      if (key && g.bare && !g.en && g.ja && g.id) g.en = g.bare;
      if (!g.en && !g.ja && !g.id) continue;
      const first = [g.en, g.ja, g.id].filter(Boolean).map(x => x!.line).sort((a, b) => a - b)[0];
      out.push({
        file, line: first, key, en: g.en?.v, ja: g.ja?.v, id: g.id?.v, kind: kindOf(file, key),
      });
    }
  };
  for (let i = 0; i < toks.length; i++) {
    const tk = toks[i];
    if (tk.t === 'p' && tk.v === '{') { stack.push({ props: new Map() }); continue; }
    if (tk.t === 'p' && tk.v === '}') { const f = stack.pop(); if (f) flush(f); continue; }
    if ((tk.t === 'id' || tk.t === 'str') && stack.length) {
      const colon = toks[i + 1];
      const val = toks[i + 2];
      const after = toks[i + 3];
      if (colon?.t === 'p' && colon.v === ':' && val?.t === 'str' && after?.t === 'p' && /^[,}]$/.test(after.v)) {
        const name = tk.v;
        if (/^(.*_)?(en|ja|id)$/.test(name) || name === 'jp' || /^[A-Za-z]+$/.test(name)) {
          stack[stack.length - 1].props.set(name, { v: val.v, line: val.line });
        }
      }
    }
  }
  return out;
}

function fromLocales(files: Record<Lang, { file: string; src: string }>): CopyEntry[] {
  const byKey = new Map<string, CopyEntry>();
  for (const lang of LANGS) {
    const { file, src } = files[lang];
    const toks = tokenize(src);
    for (let i = 0; i + 3 < toks.length; i++) {
      const [k, colon, v, end] = [toks[i], toks[i + 1], toks[i + 2], toks[i + 3]];
      if (k.t === 'str' && colon.t === 'p' && colon.v === ':' && v.t === 'str' && end.t === 'p' && /^[,}]$/.test(end.v)) {
        const e = byKey.get(k.v) ?? { file: relative(ROOT, resolve(ROOT, 'src/locales/en.ts')), line: 0, key: k.v, kind: 'descriptive' as const };
        if (lang === 'en') e.line = k.line;
        else if (!e.line) e.line = k.line;
        e[lang] = v.v;
        void file;
        byKey.set(k.v, e);
      }
    }
  }
  return [...byKey.values()];
}

function fromHtml(file: string, src: string): CopyEntry[] {
  const re = /<span\s+data-lang="(en|ja|id)"[^>]*>([\s\S]*?)<\/span>/g;
  const spans: { lang: Lang; text: string; line: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    spans.push({
      lang: m[1] as Lang,
      text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      line: src.slice(0, m.index).split('\n').length,
    });
  }
  const out: CopyEntry[] = [];
  let cur: CopyEntry | null = null;
  for (const s of spans) {
    if (!cur || cur[s.lang] !== undefined) {
      cur = { file, line: s.line, key: 'data-lang', kind: 'descriptive' };
      out.push(cur);
    }
    cur[s.lang] = s.text;
  }
  return out;
}

function walk(dir: string): string[] {
  const res: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === '__tests__') continue;
      res.push(...walk(p));
    } else if (name.endsWith('.ts') && !name.endsWith('.test.ts') && !name.endsWith('.d.ts')) res.push(p);
  }
  return res;
}

export function loadCopy(): CopyEntry[] {
  const out: CopyEntry[] = [];
  const locales = resolve(ROOT, 'src/locales');
  const localeFiles = {} as Record<Lang, { file: string; src: string }>;
  for (const l of LANGS) {
    const p = join(locales, `${l}.ts`);
    localeFiles[l] = { file: relative(ROOT, p), src: readFileSync(p, 'utf8') };
  }
  for (const p of walk(resolve(ROOT, 'src'))) {
    if (p.startsWith(locales)) continue;
    out.push(...fromObjectLiterals(relative(ROOT, p), readFileSync(p, 'utf8')));
  }
  out.push(...fromLocales(localeFiles));
  out.push(...fromHtml('index.html', readFileSync(resolve(ROOT, 'index.html'), 'utf8')));
  return out;
}

export function sentences(text: string, lang: Lang): string[] {
  // The project's TS lib setting predates Intl.Segmenter, so type it locally.
  const Seg = (Intl as unknown as {
    Segmenter: new (l: string, o: { granularity: 'sentence' }) => { segment(t: string): Iterable<{ segment: string }> };
  }).Segmenter;
  return [...new Seg(lang, { granularity: 'sentence' }).segment(text)].map(s => s.segment.trim()).filter(Boolean);
}

export function wordCount(sentence: string): number {
  return sentence.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
}
