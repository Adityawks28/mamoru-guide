import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace(/^#/, '');
  expect(cleaned).toMatch(/^[0-9a-fA-F]{6}$/);
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return [r, g, b];
}

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

/** Reads `--name: #hexvalue` and returns its RGB. Fails loudly if not found or invalid. */
function colorOf(name: string, occurrence: number): RGB {
  const all = [...vars.matchAll(
    new RegExp(`--${name}\\s*:\\s*(#[0-9a-fA-F]{6})`, 'g'),
  )];
  expect(all.length).toBeGreaterThan(occurrence);
  return hexToRgb(all[occurrence][1]);
}

const AA_NORMAL = 4.5;
const NIGHT_BG = colorOf('harbor-navy', 0);   // :root occurrence 0 (#0f1f3d)
const NIGHT_FG = colorOf('kitano-white', 0);  // :root occurrence 0 (#f8f4ed)
const DAY_BG = colorOf('bg-main', 0);         // body.day-mode hex match (#d4e6f4)
const DAY_FG = colorOf('text-main', 0);       // body.day-mode hex match (#1a2a3a)

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
