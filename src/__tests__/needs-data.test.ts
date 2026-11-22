import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  FOOD_ALLERGENS, FOOD_ALLERGENS_CLAIM, DIET_NEEDS, NEED_LANGUAGES, CONTACT_RELATIONS,
} from '../data/needs';
import { SOURCES, CLAIMS } from '../data/sources';

describe('needs data', () => {
  it('lists the official 特定原材料 in the official order', () =>
    expect(FOOD_ALLERGENS.map(a => a.officialName)).toEqual(
      ['えび', 'カシューナッツ', 'かに', 'くるみ', '小麦', 'そば', '卵', '乳', '落花生（ピーナッツ）']));
  it('shows each official name, with only hiragana readings added', () => {
    for (const a of FOOD_ALLERGENS) expect(a.label_ja.replace(/（[ぁ-ゖ]+）/g, '')).toBe(a.officialName);
  });
  it('records a verified source for the allergen list', () => {
    const c = CLAIMS[FOOD_ALLERGENS_CLAIM];
    expect(c.status).toBe('verified');
    expect(c.sources).toContain('caa-allergen-labeling');
    expect(SOURCES['caa-allergen-labeling'].url).toMatch(/^https:\/\/www\.caa\.go\.jp\//);
  });
  it('has the six neutral food needs', () =>
    expect(DIET_NEEDS.map(d => d.key)).toEqual(['halal', 'vegetarian', 'vegan', 'no-pork', 'no-beef', 'no-alcohol']));
  it('never ties a preset to a nationality', () => {
    const src = readFileSync(resolve(__dirname, '../data/needs.ts'), 'utf8');
    expect(src).not.toMatch(/nationality|country/i);
  });
  it('offers the JMA dictionary languages, then easy Japanese', () => {
    expect(NEED_LANGUAGES.map(l => l.key)).toEqual(
      ['en', 'zh', 'ko', 'pt', 'es', 'id', 'vi', 'tl', 'th', 'ne', 'km', 'my', 'mn', 'ja-easy']);
  });
  it('offers easy Japanese and has unique keys in every list', () => {
    expect(NEED_LANGUAGES.map(l => l.key)).toContain('ja-easy');
    for (const list of [FOOD_ALLERGENS, DIET_NEEDS, NEED_LANGUAGES, CONTACT_RELATIONS])
      expect(new Set(list.map(o => o.key)).size).toBe(list.length);
  });
});
