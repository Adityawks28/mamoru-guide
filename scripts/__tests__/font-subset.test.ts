import { describe, it, expect } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { collectAppChars, shelterChars } from '../font-chars';

const ROOT = resolve(__dirname, '../..');

interface Manifest {
  source: string;
  chars: { app: string; shelters: string };
  files: Record<string, { bytes: number; missing: string }>;
}
const manifest = (): Manifest => JSON.parse(readFileSync(resolve(ROOT, 'scripts/fonts-manifest.json'), 'utf8'));

// Glyphs the source fonts do not have. The browser draws them from a system font.
const SHELTER_MISSING = '刎㈱簑蹊';
const KNOWN_MISSING: Record<string, string> = {
  'DotGothic16-Regular.woff2': '⊞✓✗Ōūīōā',
  'MPLUSRounded1c-Regular.woff2': '⊞' + SHELTER_MISSING,
  'MPLUSRounded1c-Bold.woff2': '⊞' + SHELTER_MISSING,
  'MPLUSRounded1c-ExtraBold.woff2': '⊞',
};

describe('font subsets', () => {
  it('the subsets cover every character of the app text', () => {
    const have = new Set(manifest().chars.app);
    expect([...collectAppChars(ROOT)].filter(c => !have.has(c)).join(''), 'run npm run fonts').toBe('');
  });

  it('the M PLUS 400 and 700 subsets cover every shelter name and address', () => {
    const have = new Set(manifest().chars.shelters);
    expect([...shelterChars(ROOT)].filter(c => !have.has(c)).join(''), 'run npm run fonts').toBe('');
  });

  it('no app character is missing from a source font, except the known ones', () => {
    const { files } = manifest();
    for (const [file, known] of Object.entries(KNOWN_MISSING)) {
      expect(files[file], file).toBeDefined();
      expect([...files[file].missing].filter(c => !known.includes(c)).join(''), file).toBe('');
    }
  });

  it('every subset file exists, matches the manifest, and all fonts stay under 900 KiB', () => {
    let total = 0;
    for (const [file, { bytes }] of Object.entries(manifest().files)) {
      expect(statSync(resolve(ROOT, 'public/fonts', file)).size, file).toBe(bytes);
      total += bytes;
    }
    expect(Object.keys(manifest().files)).toHaveLength(5);
    expect(total).toBeLessThanOrEqual(900 * 1024);
  });

  it('collects app text, keeps the base ranges, and drops emoji and control characters', () => {
    const chars = collectAppChars(ROOT);
    for (const c of ['A', '~', ' ', '。', 'ぁ', 'ヿ', '！', '～', '避', '難']) expect(chars.has(c), c).toBe(true);
    for (const c of ['🆘', '‍', '️', '⃣', '\n', '\t', '🇯']) expect(chars.has(c), JSON.stringify(c)).toBe(false);
  });

  it('collects the characters of shelter names and addresses', () => {
    const chars = shelterChars(ROOT);
    for (const c of '潮芦屋交流センター海洋町7-1') expect(chars.has(c), c).toBe(true);
  });
});
