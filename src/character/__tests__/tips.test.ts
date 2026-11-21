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

  it('the power fact asks only for what the Cabinet Office checklist lists (spare batteries, a phone charger)', async () => {
    const { CLAIMS } = await import('../../data/sources');
    const tip = DISASTER_FACTS.concat(QUAKE_TIPS).find(t => t.claimId === 'tip-kobe-power')!;
    expect(tip.en).toMatch(/^Keep spare batteries and a phone charger ready\. /);
    expect(tip.ja).toMatch(/^予備（よび）の電池と、スマホの充電器を用意してください。/);
    expect(tip.id).toMatch(/^Siapkan baterai cadangan dan pengisi daya ponsel\. /);
    for (const t of [tip.en, tip.ja, tip.id]) expect(t).toMatch(/6/);
    expect(CLAIMS['tip-kobe-power'].sources).toEqual(expect.arrayContaining(['cao-kyokun-1-9-2', 'cao-checklist-sonae']));
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
