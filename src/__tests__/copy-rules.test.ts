import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadCopy, sentences, wordCount, sourceFiles, readSource, locOf, type CopyEntry } from './helpers/copy-corpus';

const at = (c: CopyEntry) => `${c.file}:${c.line}`;

function longSentences(copy: CopyEntry[], kind: CopyEntry['kind'], max: number): string[] {
  return copy
    .filter(c => c.kind === kind)
    .flatMap(c => sentences(c.en ?? '', 'en').filter(s => wordCount(s) > max).map(s => `${at(c)} (${wordCount(s)}): ${s}`));
}

describe('copy rules', () => {
  const copy = loadCopy();
  it('finds the trilingual corpus', () => expect(copy.length).toBeGreaterThan(400));
  it('has all three languages for every entry', () => {
    expect(copy.filter(c => !c.en || !c.ja || !c.id).map(at)).toEqual([]);
  });
  it('covers every Indonesian "Anda" line in the source by location', () => {
    const uncovered: string[] = [];
    for (const file of sourceFiles()) {
      readSource(file).split('\n').forEach((text, i) => {
        if (!/\bAnda\b/.test(text)) return;
        const line = i + 1;
        const hit = copy.some(c => c.loc.id && c.loc.id.file === file && line >= c.loc.id.line && line <= c.loc.id.end);
        if (!hit) uncovered.push(`${file}:${line}: ${text.trim().slice(0, 100)}`);
      });
    }
    expect(uncovered).toEqual([]);
  });
  it('has no em dash in user-visible text', () => {
    expect(copy.filter(c => [c.en, c.ja, c.id].some(t => t?.includes('\u2014'))).map(at)).toEqual([]);
  });
  it('keeps English instruction sentences at 20 words or fewer', () => {
    expect(longSentences(copy, 'instruction', 20)).toEqual([]);
  });
  it('keeps English descriptive sentences at 25 words or fewer', () => {
    expect(longSentences(copy, 'descriptive', 25)).toEqual([]);
  });
  it('uses one Indonesian pronoun, kamu (Decision D-1)', () => {
    expect(copy.filter(c => /\bAnda\b/i.test(c.id ?? '')).map(c => `${locOf(c, 'id')}: ${c.id}`)).toEqual([]);
  });
  it('uses kamu, not Anda, in public/*.html too (Decision D-1)', () => {
    const dir = resolve(__dirname, '../../public');
    const pages = readdirSync(dir).filter(f => f.endsWith('.html'));
    expect(pages.length).toBeGreaterThan(0);
    const hits: string[] = [];
    for (const f of pages) {
      readFileSync(resolve(dir, f), 'utf8').split('\n').forEach((text, i) => {
        if (/\bAnda\b/.test(text)) hits.push(`public/${f}:${i + 1}: ${text.trim()}`);
      });
    }
    expect(hits).toEqual([]);
  });
  it('keeps Japanese sentences at 40 characters or fewer', () => {
    expect(copy.flatMap(c => sentences(c.ja ?? '', 'ja')
      .filter(s => s.length > 40)
      .map(s => `${locOf(c, 'ja')} (${s.length}): ${s}`))).toEqual([]);
  });
});
