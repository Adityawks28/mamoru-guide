// shelter-finder.test.ts — pure, safety-relevant distance/sorting math.

import { haversineDistance, findNearest, formatDistance } from '../shelter-finder';
import { shelters } from '../shelter-data';

describe('haversineDistance', () => {
  it('is ~0 for identical points', () => {
    expect(haversineDistance(34.69, 135.19, 34.69, 135.19)).toBeCloseTo(0, 6);
  });

  it('matches a known Kobe→Osaka great-circle distance (~27 km)', () => {
    // Sannomiya (34.694,135.198) → Umeda (34.702,135.495)
    const d = haversineDistance(34.694, 135.198, 34.702, 135.495);
    expect(d).toBeGreaterThan(26);
    expect(d).toBeLessThan(28);
  });

  it('is symmetric', () => {
    const a = haversineDistance(34.69, 135.19, 34.72, 135.23);
    const b = haversineDistance(34.72, 135.23, 34.69, 135.19);
    expect(a).toBeCloseTo(b, 10);
  });
});

describe('findNearest', () => {
  it('returns the requested count', () => {
    expect(findNearest(34.69, 135.19, 5)).toHaveLength(5);
  });

  it('sorts ascending by distance', () => {
    const r = findNearest(34.69, 135.19, 8);
    for (let i = 1; i < r.length; i++) {
      expect(r[i].distance).toBeGreaterThanOrEqual(r[i - 1].distance);
    }
  });

  it('computes walkMinutes at 4 km/h, rounded up, always positive', () => {
    findNearest(34.69, 135.19, 3).forEach(s => {
      expect(s.walkMinutes).toBe(Math.ceil(s.distance / (4 / 60)));
      expect(s.walkMinutes).toBeGreaterThan(0);
    });
  });

  it('never returns more than the available shelters', () => {
    expect(findNearest(34.69, 135.19, 9999)).toHaveLength(shelters.length);
  });
});

describe('formatDistance', () => {
  it('uses metres below 1 km', () => {
    expect(formatDistance(0.42)).toBe('420m');
  });

  it('uses km at and above 1 km', () => {
    expect(formatDistance(1)).toBe('1.0km');
    expect(formatDistance(2.345)).toBe('2.3km');
  });

  it('rounds metres to the nearest integer', () => {
    expect(formatDistance(0.1239)).toBe('124m');
  });
});
