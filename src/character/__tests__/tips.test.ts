import { describe, it, expect } from 'vitest';
import {
  QUAKE_TIPS, BAG_TIPS, MAP_TIPS,
  FIRSTAID_TIPS, TYPHOON_TIPS, DISASTER_FACTS,
} from '../tips';

const ALL_POOLS = {
  QUAKE_TIPS, BAG_TIPS, MAP_TIPS,
  FIRSTAID_TIPS, TYPHOON_TIPS, DISASTER_FACTS,
};

describe('tips', () => {
  it('every pool has at least 3 entries', () => {
    for (const [name, pool] of Object.entries(ALL_POOLS)) {
      expect(pool.length, name).toBeGreaterThanOrEqual(3);
    }
  });

  it('every entry has non-empty en/ja/id strings', () => {
    for (const [name, pool] of Object.entries(ALL_POOLS)) {
      pool.forEach((t, i) => {
        expect(t.en, `${name}[${i}].en`).toBeTruthy();
        expect(t.ja, `${name}[${i}].ja`).toBeTruthy();
        expect(t.id, `${name}[${i}].id`).toBeTruthy();
      });
    }
  });

  it('strings stay under 110 characters (bubble fits one line)', () => {
    for (const [name, pool] of Object.entries(ALL_POOLS)) {
      pool.forEach((t, i) => {
        expect(t.en.length, `${name}[${i}].en`).toBeLessThanOrEqual(110);
        expect(t.id.length, `${name}[${i}].id`).toBeLessThanOrEqual(110);
      });
    }
  });
});
