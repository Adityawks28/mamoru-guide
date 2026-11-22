import { describe, it, expect } from 'vitest';
import { WARNING_WORDS, warningVocab } from '../data/warning-words';
import { GLOSSARY } from '../data/glossary';
import { CLAIMS } from '../data/sources';

describe('warning words', () => {
  it('lists the kept words in order', () => {
    expect(WARNING_WORDS.map(w => w.term)).toEqual(['警戒レベル', 'レベル２大雨注意報', '高齢者等避難',
      'レベル３大雨警報', '避難指示', 'レベル４大雨危険警報', '緊急安全確保', 'レベル５大雨特別警報', '津波注意報',
      '津波警報', '大津波警報', '緊急地震速報', 'Jアラート', '避難場所']);
  });
  it('points every word at a glossary term', () => {
    expect(WARNING_WORDS.filter(w => !GLOSSARY.some(g => g.ja === w.term)).map(w => w.term)).toEqual([]);
  });
  it('has a verified or changed claim for every word', () => {
    expect(WARNING_WORDS.filter(w => !['verified', 'changed'].includes(CLAIMS[w.claimId]?.status ?? '')).map(w => w.term)).toEqual([]);
  });
  it('writes romaji in ASCII letters', () => {
    expect(WARNING_WORDS.filter(w => !/^[A-Za-z][A-Za-z -]*$/.test(w.rom)).map(w => w.term)).toEqual([]);
  });
  it('builds one flashcard per word from the glossary', () => {
    const cards = warningVocab();
    expect(cards).toHaveLength(WARNING_WORDS.length);
    const g = GLOSSARY.find(t => t.ja === '避難指示')!;
    expect(cards.find(c => c.jp === '避難指示')).toMatchObject({ en: g.en, id: g.id, reading: g.reading });
  });
  it('names the missing term when a word has no glossary entry', () => {
    expect(() => warningVocab([{ ...WARNING_WORDS[0], term: 'レベル4大雨危険警報' }])).toThrow('No glossary term: レベル4大雨危険警報');
  });
});
