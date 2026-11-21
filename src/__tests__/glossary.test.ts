import { describe, it, expect } from 'vitest';
import { loadCopy, locOf, type CopyEntry } from './helpers/copy-corpus';
import { GLOSSARY, type GlossaryTerm } from '../data/glossary';
import { SOURCES } from '../data/sources';

const contains = (text: string | undefined, term: string) => (text ?? '').toLowerCase().includes(term.toLowerCase());

// en and id: an entry whose ja has the term must use the term's en or id.
// ja: an entry whose en has the term must use the Japanese term, so a やさしい日本語 rewrite cannot drop it.
function mismatches(copy: CopyEntry[], terms: ReadonlyArray<GlossaryTerm>, lang: 'en' | 'ja' | 'id'): string[] {
  const key = lang === 'ja' ? 'en' : 'ja';
  const out: string[] = [];
  for (const t of terms) {
    for (const c of copy) {
      if (!contains(c[key], t[key])) continue;
      if (!contains(c[lang], t[lang])) out.push(`${t.ja} ${lang} "${t[lang]}" ${locOf(c, lang)}: ${c[lang]}`);
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
  it('reports a string that drops part of a term, per language', () => {
    const entry: CopyEntry = { file: 'x.ts', line: 1, key: '', kind: 'descriptive', loc: {}, ja: '避難所へ行く', en: 'Go to the Evacuation Shelter', id: 'Pergi ke pengungsian' };
    const term: GlossaryTerm = { ja: '避難所', reading: 'ひなんじょ', en: 'evacuation shelter', id: 'tempat pengungsian', source: 'x' };
    const plain: CopyEntry = { ...entry, line: 2, ja: 'にげる ところへ 行く' };
    expect(mismatches([entry], [term], 'en')).toEqual([]);
    expect(mismatches([entry], [term], 'id')).toEqual(['避難所 id "tempat pengungsian" x.ts:1: Pergi ke pengungsian']);
    expect(mismatches([entry, plain], [term], 'ja')).toEqual(['避難所 ja "避難所" x.ts:2: にげる ところへ 行く']);
  });
  // Failure lists: .superpowers/sdd/2026-11-21-content-quality/task-2-failures.md
  // To enable one: import loadCopy, then expect(mismatches(loadCopy(), GLOSSARY, '<lang>')).toEqual([]).
  it('glossary terms are consistent in English', () => {
    expect(mismatches(loadCopy(), GLOSSARY, 'en')).toEqual([]);
  });
  it('glossary terms are consistent in Japanese', () => {
    expect(mismatches(loadCopy(), GLOSSARY, 'ja')).toEqual([]);
  });
  it('glossary terms are consistent in Indonesian', () => {
    expect(mismatches(loadCopy(), GLOSSARY, 'id')).toEqual([]);
  });
});
