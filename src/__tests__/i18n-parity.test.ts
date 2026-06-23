// i18n-parity.test.ts — locks in en/ja/id key parity so a missing or empty
// translation fails CI instead of silently falling back to English.

import { en } from '../locales/en';
import { ja } from '../locales/ja';
import { id } from '../locales/id';

describe('locale key parity', () => {
  const enKeys = Object.keys(en).sort();

  it('ja has exactly the same keys as en', () => {
    expect(Object.keys(ja).sort()).toEqual(enKeys);
  });

  it('id has exactly the same keys as en', () => {
    expect(Object.keys(id).sort()).toEqual(enKeys);
  });

  it('no locale has empty/whitespace values', () => {
    const empties: string[] = [];
    for (const [name, dict] of [['en', en], ['ja', ja], ['id', id]] as const) {
      for (const [k, v] of Object.entries(dict)) {
        if (!v || !v.trim()) empties.push(`${name}.${k}`);
      }
    }
    expect(empties).toEqual([]);
  });
});
