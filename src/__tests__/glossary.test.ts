import { describe, it, expect } from 'vitest';
import { locOf, type CopyEntry } from './helpers/copy-corpus';
import { GLOSSARY, type GlossaryTerm } from '../data/glossary';
import { SOURCES } from '../data/sources';

const contains = (text: string | undefined, term: string) => (text ?? '').toLowerCase().includes(term.toLowerCase());

function mismatches(copy: CopyEntry[], terms: ReadonlyArray<GlossaryTerm>): string[] {
  const out: string[] = [];
  for (const t of terms) {
    for (const c of copy) {
      if (!c.ja?.includes(t.ja)) continue;
      if (!contains(c.en, t.en)) out.push(`${t.ja} en "${t.en}" ${locOf(c, 'en')}: ${c.en}`);
      if (!contains(c.id, t.id)) out.push(`${t.ja} id "${t.id}" ${locOf(c, 'id')}: ${c.id}`);
    }
  }
  return out;
}

describe('term glossary', () => {
  it('has ja, reading, en and id for every term', () => {
    expect(GLOSSARY.filter(t => [t.ja, t.reading, t.en, t.id].some(v => !v.trim())).map(t => t.ja)).toEqual([]);
  });
  it('writes every reading in kana only', () => {
    expect(GLOSSARY.filter(t => !/^[\p{Script=Hiragana}\p{Script=Katakana}ー]+$/u.test(t.reading)).map(t => t.ja)).toEqual([]);
  });
  it('cites a known source with an https url for every term', () => {
    expect(GLOSSARY.filter(t => !SOURCES[t.source]?.url.startsWith('https://')).map(t => t.ja)).toEqual([]);
  });
  it('keeps a nested term nested in en and id', () => {
    const broken = GLOSSARY.flatMap(inner => GLOSSARY
      .filter(outer => outer !== inner && outer.ja.includes(inner.ja))
      .filter(outer => !contains(outer.en, inner.en) || !contains(outer.id, inner.id))
      .map(outer => `${inner.ja} in ${outer.ja}`));
    expect(broken).toEqual([]);
  });
  it('reports a string that drops part of a term', () => {
    const entry: CopyEntry = { file: 'x.ts', line: 1, key: '', kind: 'descriptive', loc: {}, ja: '避難所へ行く', en: 'Go to the Evacuation Shelter', id: 'Pergi ke pengungsian' };
    const term: GlossaryTerm = { ja: '避難所', reading: 'ひなんじょ', en: 'evacuation shelter', id: 'tempat pengungsian', source: 'x' };
    expect(mismatches([entry], [term])).toEqual(['避難所 id "tempat pengungsian" x.ts:1: Pergi ke pengungsian']);
  });
  // Task 2 failure list: .superpowers/sdd/2026-11-21-content-quality/task-2-failures.md
  // To enable: expect(mismatches(loadCopy().filter(c => c.file !== 'src/data/glossary.ts'), GLOSSARY)).toEqual([]).
  // The filter is needed because the corpus walker also reads glossary.ts, whose entries match themselves.
  it.todo('glossary terms are consistent (enabled by Task 7, 8, 9a)');
});
