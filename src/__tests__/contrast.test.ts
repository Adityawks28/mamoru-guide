import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type RGB = [number, number, number];

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: RGB): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function composite(fg: RGB, alpha: number, bg: RGB): RGB {
  return fg.map((f, i) => Math.round(f * alpha + bg[i] * (1 - alpha))) as RGB;
}

const vars = readFileSync(resolve(__dirname, '../../css/variables.css'), 'utf8');

/** Reads `--name: rgba(r,g,b,a)` and returns its alpha. */
function alphaOf(name: string, occurrence: number): number {
  const all = [...vars.matchAll(
    new RegExp(`--${name}\\s*:\\s*rgba\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*([\\d.]+)\\s*\\)`, 'g'),
  )];
  expect(all.length).toBeGreaterThan(occurrence);
  return Number(all[occurrence][1]);
}

const AA_NORMAL = 4.5;
const DAY_BG: RGB = [212, 230, 244];   // --bg-main in body.day-mode
const DAY_FG: RGB = [26, 42, 58];      // --text-main in body.day-mode
const NIGHT_BG: RGB = [15, 31, 61];    // --harbor-navy
const NIGHT_FG: RGB = [248, 244, 237]; // --kitano-white

describe('WCAG AA contrast for text tokens', () => {
  // Occurrence 0 = night block (:root), occurrence 1 = day block (body.day-mode).
  it('day --text-soft clears AA for normal text', () => {
    const r = ratio(composite(DAY_FG, alphaOf('text-soft', 1), DAY_BG), DAY_BG);
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('day --text-muted clears AA for normal text', () => {
    const r = ratio(composite(DAY_FG, alphaOf('text-muted', 1), DAY_BG), DAY_BG);
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('night --text-soft clears AA for normal text', () => {
    const r = ratio(composite(NIGHT_FG, alphaOf('text-soft', 0), NIGHT_BG), NIGHT_BG);
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('night --text-muted clears AA for normal text', () => {
    const r = ratio(composite(NIGHT_FG, alphaOf('text-muted', 0), NIGHT_BG), NIGHT_BG);
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});
