import { describe, it, expect } from 'vitest';
import { sourceFiles, readSource } from './helpers/copy-corpus';

// Verified figure: 3 L of water per person per day (claim tip-water-3l).
// Any other per-day figure (for example "2 L/day") contradicts it.
const PER_DAY = [
  /(\d+(?:[.,]\d+)?)\s?L\s?\/\s?(?:day|hari|日)/gi,
  /(\d+(?:[.,]\d+)?)\s?(?:L|liters?|litres?|liter)\s+per\s+(?:person\s+per\s+day|orang\s+per\s+hari|day|hari)/gi,
  /1日\s?(\d+(?:\.\d+)?)\s?(?:L|リットル)/g,
];

describe('water per day', () => {
  it('every per-day water figure in the app is 3 L', () => {
    const hits: string[] = [];
    for (const file of [...sourceFiles(), 'public/404.html']) {
      readSource(file).split('\n').forEach((line, i) => {
        for (const re of PER_DAY) {
          for (const m of line.matchAll(re)) if (m[1] !== '3') hits.push(`${file}:${i + 1}: ${m[0]}`);
        }
      });
    }
    expect(hits).toEqual([]);
  });
});
