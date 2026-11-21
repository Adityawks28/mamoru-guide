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
  /** Real source location of each language's text (a text can span lines). */
  loc: Partial<Record<Lang, Loc>>;
}
export interface Loc { file: string; line: number; end: number }

const ROOT = resolve(__dirname, '../../..');
const LANGS: Lang[] = ['en', 'ja', 'id'];

type Tok =
  | { t: 'str'; v: string; line: number; end: number }
  | { t: 'id'; v: string; line: number }
  | { t: 'p'; v: string; line: number };

const ESC: Record<string, string> = { n: '\n', t: '\t', r: '\r', '0': '\0' };

// Reads a template literal body starting after the opening backtick.
// Each ${...} interpolation (including nested strings and templates) becomes "{}".
function readTemplate(src: string, from: number): { v: string; next: number; lines: number } {
  let i = from;
  let v = '';
  let lines = 0;
  const n = src.length;
  while (i < n && src[i] !== '`') {
    if (src[i] === '\\') { i++; v += ESC[src[i]] ?? src[i]; }
    else if (src[i] === '$' && src[i + 1] === '{') {
      let depth = 1;
      i += 2;
      while (i < n && depth > 0) {
        const ch = src[i];
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        else if (ch === "'" || ch === '"') {
          i++;
          while (i < n && src[i] !== ch) { if (src[i] === '\\') i++; i++; }
        } else if (ch === '`') {
          const r = readTemplate(src, i + 1);
          lines += r.lines;
          i = r.next - 1;
        } else if (ch === '\n') lines++;
        i++;
      }
      v += '{}';
      continue;
    } else { if (src[i] === '\n') lines++; v += src[i]; }
    i++;
  }
  return { v, next: i + 1, lines };
}

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
    if (c === '/') {
      const prev = toks[toks.length - 1];
      const regexAllowed = !prev || (prev.t === 'p' && !/^[)\]}\d.]$/.test(prev.v)) || (prev.t === 'id' && /^(return|typeof|case|in|of)$/.test(prev.v));
      if (regexAllowed) {
        i++;
        let inClass = false;
        while (i < n && (inClass || src[i] !== '/') && src[i] !== '\n') {
          if (src[i] === '\\') i++;
          else if (src[i] === '[') inClass = true;
          else if (src[i] === ']') inClass = false;
          i++;
        }
        i++;
        while (i < n && /[a-z]/.test(src[i])) i++;
        toks.push({ t: 'p', v: 'R', line });
        continue;
      }
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
      toks.push({ t: 'str', v, line: start, end: line });
      continue;
    }
    if (c === '`') {
      const start = line;
      const r = readTemplate(src, i + 1);
      line += r.lines;
      i = r.next;
      toks.push({ t: 'str', v: r.v, line: start, end: line });
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

interface Frame { props: Map<string, { v: string; line: number; end: number }>; }

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
    const groups = new Map<string, Partial<Record<Lang | 'bare', { v: string; line: number; end: number }>>>();
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
      const loc: CopyEntry['loc'] = {};
      for (const l of LANGS) if (g[l]) loc[l] = { file, line: g[l]!.line, end: g[l]!.end };
      out.push({
        file, line: first, key, en: g.en?.v, ja: g.ja?.v, id: g.id?.v, kind: kindOf(file, key), loc,
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
          stack[stack.length - 1].props.set(name, { v: val.v, line: val.line, end: val.end });
        }
      }
    }
  }
  return out;
}

// getLangText('en', 'ja', 'id') calls and confirm/alert('en\nja\nid') strings.
// Matched on raw text so calls inside template-literal interpolations are found too.
function fromPositional(file: string, src: string): CopyEntry[] {
  const out: CopyEntry[] = [];
  const S = String.raw`('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")`;
  const unq = (q: string) => q.slice(1, -1).replace(/\\(.)/g, (_, ch: string) => ESC[ch] ?? ch);
  const lineAt = (idx: number) => src.slice(0, idx).split('\n').length;
  const calls = new RegExp(String.raw`\bgetLangText\(\s*${S}\s*,\s*${S}\s*,\s*${S}\s*,?\s*\)`, 'g');
  let m: RegExpExecArray | null;
  while ((m = calls.exec(src))) {
    const [en, ja, id] = [unq(m[1]), unq(m[2]), unq(m[3])];
    const line = lineAt(m.index);
    const end = lineAt(m.index + m[0].length);
    const l = { file, line, end };
    out.push({ file, line, key: 'getLangText', en, ja, id, kind: 'descriptive', loc: { en: l, ja: l, id: l } });
  }
  const dialogs = new RegExp(String.raw`\b(?:confirm|alert)\(\s*${S}`, 'g');
  while ((m = dialogs.exec(src))) {
    const parts = unq(m[1]).split('\n');
    if (parts.length !== 3) continue;
    const line = lineAt(m.index);
    const l = { file, line, end: line };
    out.push({ file, line, key: 'dialog', en: parts[0], ja: parts[1], id: parts[2], kind: 'descriptive', loc: { en: l, ja: l, id: l } });
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
        const e = byKey.get(k.v) ?? { file, line: k.line, key: k.v, kind: 'descriptive' as const, loc: {} };
        if (lang === 'en') { e.file = file; e.line = k.line; }
        e.loc[lang] = { file, line: k.line, end: v.end };
        e[lang] = v.v;
        byKey.set(k.v, e);
      }
    }
  }
  return [...byKey.values()];
}

function fromHtml(file: string, src: string): CopyEntry[] {
  const re = /<span\s+data-lang=["'](en|ja|id)["'][^>]*>([\s\S]*?)<\/span>/g;
  const spans: { lang: Lang; text: string; line: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    spans.push({
      lang: m[1] as Lang,
      text: m[2].replace(/\$\{[^}]*\}/g, '{}').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      line: src.slice(0, m.index).split('\n').length,
      end: src.slice(0, m.index + m[0].length).split('\n').length,
    });
  }
  const out: CopyEntry[] = [];
  let cur: CopyEntry | null = null;
  for (const s of spans) {
    if (!cur || cur[s.lang] !== undefined) {
      cur = { file, line: s.line, key: 'data-lang', kind: 'descriptive', loc: {} };
      out.push(cur);
    }
    cur[s.lang] = s.text;
    cur.loc[s.lang] = { file, line: s.line, end: s.end };
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
  // The glossary holds reference terms in ja/en/id objects, not user-visible text.
  const glossary = resolve(ROOT, 'src/data/glossary.ts');
  for (const p of walk(resolve(ROOT, 'src'))) {
    if (p.startsWith(locales) || p === glossary) continue;
    const text = readFileSync(p, 'utf8');
    out.push(...fromObjectLiterals(relative(ROOT, p), text));
    out.push(...fromHtml(relative(ROOT, p), text));
    out.push(...fromPositional(relative(ROOT, p), text));
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

/** Source files the corpus must cover: non-test .ts files under src, and index.html. */
export function sourceFiles(): string[] {
  return [...walk(resolve(ROOT, 'src')), resolve(ROOT, 'index.html')].map(p => relative(ROOT, p));
}

export function readSource(file: string): string {
  return readFileSync(resolve(ROOT, file), 'utf8');
}

export function locOf(c: CopyEntry, lang: Lang): string {
  const l = c.loc[lang];
  return l ? `${l.file}:${l.line}` : `${c.file}:${c.line}`;
}
