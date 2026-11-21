import { describe, it, expect } from 'vitest';
import { SOURCES, CLAIMS } from '../data/sources';
import { categories } from '../first-aid';
import { STEPS } from '../earthquake-now';
import { scenarios } from '../drill';
import { typhoonScale } from '../typhoon';
import {
  QUAKE_TIPS, BAG_TIPS, MAP_TIPS, FIRSTAID_TIPS, TYPHOON_TIPS, DISASTER_FACTS,
} from '../character/tips';

const allTips = [QUAKE_TIPS, BAG_TIPS, MAP_TIPS, FIRSTAID_TIPS, TYPHOON_TIPS, DISASTER_FACTS].flat();
const hasDigit = (t: { en: string; ja: string; id: string }) => /\d/.test(t.en + t.ja + t.id);

describe('claims registry', () => {
  it('every first-aid step has a claimId in CLAIMS', () => {
    for (const cat of categories) {
      cat.steps.forEach((s, i) => {
        expect(s.claimId, `${cat.id} step ${i + 1}`).toBeTruthy();
        expect(CLAIMS[s.claimId], s.claimId).toBeDefined();
      });
    }
  });

  it('every tip with a digit has a claimId in CLAIMS', () => {
    const digitTips = allTips.filter(hasDigit);
    expect(digitTips.length).toBeGreaterThan(0);
    for (const t of digitTips) {
      expect(t.claimId, t.en).toBeTruthy();
      expect(CLAIMS[t.claimId!], t.claimId).toBeDefined();
    }
  });

  it('every tip that has a claimId points into CLAIMS', () => {
    for (const t of allTips.filter((x) => x.claimId)) expect(CLAIMS[t.claimId!], t.claimId).toBeDefined();
  });

  it('every earthquake-now, drill and typhoon item has a claimId in CLAIMS', () => {
    for (const item of [...STEPS, ...scenarios, ...typhoonScale]) {
      expect(item.claimId).toBeTruthy();
      expect(CLAIMS[item.claimId], item.claimId).toBeDefined();
    }
  });

  it('every first-aid step has a verified or changed claim (Task 4)', () => {
    for (const cat of categories) {
      for (const s of cat.steps) expect(['verified', 'changed'], s.claimId).toContain(CLAIMS[s.claimId].status);
    }
  });

  it('verified and changed claims have at least one source', () => {
    for (const [id, c] of Object.entries(CLAIMS)) {
      if (c.status === 'verified' || c.status === 'changed') expect(c.sources.length, id).toBeGreaterThan(0);
    }
  });

  it('every claim source exists in SOURCES', () => {
    for (const [id, c] of Object.entries(CLAIMS)) {
      for (const s of c.sources) expect(SOURCES[s], `${id} -> ${s}`).toBeDefined();
    }
  });

  it('claim ids are kebab-case', () => {
    for (const id of Object.keys(CLAIMS)) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('every claim is used by at least one item, unless it is removed', () => {
    const used = new Set<string>([
      ...categories.flatMap((c) => c.steps.map((s) => s.claimId)),
      ...allTips.map((t) => t.claimId).filter((x): x is string => !!x),
      ...[...STEPS, ...scenarios, ...typhoonScale].map((x) => x.claimId),
    ]);
    // A removed claim stays in CLAIMS as a record, and no item may use it.
    for (const [id, c] of Object.entries(CLAIMS)) expect(used.has(id), id).toBe(c.status !== 'removed');
  });
});

describe('sources', () => {
  it('every source URL starts with https://', () => {
    for (const [id, s] of Object.entries(SOURCES)) expect(s.url, id).toMatch(/^https:\/\//);
  });
});
