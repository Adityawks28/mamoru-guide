import { describe, it, expect } from 'vitest';
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
  it.todo('uses one Indonesian pronoun (Decision D-1) (enabled by Task 9a)');
  it('keeps Japanese sentences at 40 characters or fewer', () => {
    expect(copy.flatMap(c => sentences(c.ja ?? '', 'ja')
      .filter(s => s.length > 40)
      .map(s => `${locOf(c, 'ja')} (${s.length}): ${s}`))).toEqual([]);
  });
});
