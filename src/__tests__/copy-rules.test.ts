import { describe, it, expect } from 'vitest';
import { loadCopy, sentences, wordCount, type CopyEntry } from './helpers/copy-corpus';

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
  it('has no em dash in user-visible text', () => {
    expect(copy.filter(c => [c.en, c.ja, c.id].some(t => t?.includes('—'))).map(at)).toEqual([]);
  });
  it('keeps English instruction sentences at 20 words or fewer', () => {
    expect(longSentences(copy, 'instruction', 20)).toEqual([]);
  });
  it.todo('keeps English descriptive sentences at 25 words or fewer (enabled by Task 7)');
  it.todo('uses one Indonesian pronoun (Decision D-1) (enabled by Task 9a)');
  it.todo('keeps Japanese sentences at 40 characters or fewer (enabled by Task 8)');
});
