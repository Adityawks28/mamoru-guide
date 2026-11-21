// Writes the self-hosted fonts in public/fonts/: Press Start 2P as a full woff2,
// and woff2 subsets of DotGothic16 and M PLUS Rounded 1c that hold only the
// characters the app uses. Run `npm run fonts` after a text change adds a character.
// Sources are pinned to one google/fonts commit and checked by SHA-256. The first
// run downloads them to scripts/.font-cache/ (git-ignored); later runs need no network.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { convert } from 'fontverter';
import { Blob, Face } from 'harfbuzzjs';
import subsetFont from 'subset-font';
import { appTextChars, collectAppChars, shelterChars } from './font-chars';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = 'https://raw.githubusercontent.com/google/fonts/06bfe0d62a98375cb09c942fa18e68bd32cff057/ofl/';
const CACHE = `${ROOT}scripts/.font-cache`;
const OUT = `${ROOT}public/fonts`;

type Chars = 'full' | 'app' | 'app+shelters';
const FONTS: { out: string; path: string; sha256: string; chars: Chars }[] = [
  // Lossless, not a subset: the Press Start 2P OFL has a Reserved Font Name (plan R-3).
  { out: 'PressStart2P-Regular.woff2', path: 'pressstart2p/PressStart2P-Regular.ttf', sha256: '034c77f1f05ec89421e4a63f0e3a4ca1ecf852cc6d2bf611f126f275728e017d', chars: 'full' },
  { out: 'DotGothic16-Regular.woff2', path: 'dotgothic16/DotGothic16-Regular.ttf', sha256: '3ad9af88726d42b40f7f365f0dcac785af73cf20ea6f1d5b44e57cc21150b8f1', chars: 'app' },
  // Shelter names are 700 and addresses are 400; no other face draws them (plan R-4).
  { out: 'MPLUSRounded1c-Regular.woff2', path: 'mplusrounded1c/MPLUSRounded1c-Regular.ttf', sha256: 'fd003ca21668b7f1ab5665accd1a785587b75e18b8edff65c663fa6facefd882', chars: 'app+shelters' },
  { out: 'MPLUSRounded1c-Bold.woff2', path: 'mplusrounded1c/MPLUSRounded1c-Bold.ttf', sha256: 'c698330e24aadd0da80cab1f321eee9c052d41b66ef84e7e5379e81fb084a890', chars: 'app+shelters' },
  { out: 'MPLUSRounded1c-ExtraBold.woff2', path: 'mplusrounded1c/MPLUSRounded1c-ExtraBold.ttf', sha256: '990f04475a93ef0c7a3fadbaa3307d449172c75ca7c0f9bd754c614b93190e15', chars: 'app' },
];
const LICENSES: { out: string; path: string; sha256: string }[] = [
  { out: 'OFL-PressStart2P.txt', path: 'pressstart2p/OFL.txt', sha256: '705960c3281a5765ecc0b59bd4ed7ca59eed165748076bc2fc3e8fdbfeb944b0' },
  { out: 'OFL-DotGothic16.txt', path: 'dotgothic16/OFL.txt', sha256: 'b6630c61ea078cacd7fabe37d14ffe557a0b45b06683374a9aa9e24262993e33' },
];

const sorted = (chars: Set<string>) => [...chars].sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!).join('');

// The pinned source file, from the cache or downloaded once. Stops when the hash differs.
async function source(path: string, sha256: string): Promise<Buffer> {
  const cached = `${CACHE}/${path.replace(/\//g, '__')}`;
  if (!existsSync(cached)) {
    const res = await fetch(SOURCE + path);
    if (!res.ok) throw new Error(`${SOURCE + path}: HTTP ${res.status}`);
    mkdirSync(CACHE, { recursive: true });
    writeFileSync(cached, Buffer.from(await res.arrayBuffer()));
  }
  const data = readFileSync(cached);
  const actual = createHash('sha256').update(data).digest('hex');
  if (actual !== sha256) throw new Error(`${path}: SHA-256 ${actual}, expected ${sha256}. Delete ${cached} and run again.`);
  return data;
}

async function main(): Promise<void> {
  const app = sorted(collectAppChars(ROOT));
  const shelters = sorted(shelterChars(ROOT));
  const input: Record<Chars, string> = { full: '', app, 'app+shelters': sorted(new Set([...app, ...shelters])) };
  // A glyph a font lacks matters only when real text uses it, not for the base-range filler.
  const used = new Set([...appTextChars(ROOT), ...shelters]);
  mkdirSync(OUT, { recursive: true });

  const files: Record<string, { bytes: number; missing: string }> = {};
  let mplusCopyright = '';
  for (const font of FONTS) {
    const ttf = await source(font.path, font.sha256);
    const face = new Face(new Blob(ttf));
    const have = new Set(face.collectUnicodes());
    if (font.path.startsWith('mplusrounded1c/')) mplusCopyright = face.getName(0, 'en');
    const text = input[font.chars];
    const woff2 = font.chars === 'full' ? await convert(ttf, 'woff2') : await subsetFont(ttf, text, { targetFormat: 'woff2' });
    writeFileSync(`${OUT}/${font.out}`, woff2);
    const missing = [...text].filter(c => used.has(c) && c.codePointAt(0)! > 0x7e && !have.has(c.codePointAt(0)!)).join('');
    files[font.out] = { bytes: woff2.length, missing };
    console.log(`${font.out.padEnd(32)} ${String(woff2.length).padStart(9)} bytes${missing ? `  no glyph: ${missing}` : ''}`);
  }

  for (const license of LICENSES) writeFileSync(`${OUT}/${license.out}`, await source(license.path, license.sha256));
  // google/fonts has no OFL.txt for M PLUS Rounded 1c: the copyright line from the
  // font, then the OFL 1.1 text from line 2 of the DotGothic16 file.
  if (mplusCopyright !== 'Copyright 2016 The Rounded M+ Project Authors.') throw new Error(`M PLUS Rounded 1c copyright: ${mplusCopyright}`);
  const dotOfl = LICENSES.find(l => l.out === 'OFL-DotGothic16.txt');
  if (!dotOfl) throw new Error('OFL-DotGothic16.txt is not in LICENSES');
  const ofl = (await source(dotOfl.path, dotOfl.sha256)).toString('utf8');
  writeFileSync(`${OUT}/OFL-MPLUSRounded1c.txt`, mplusCopyright + ofl.slice(ofl.search(/\r?\n/)));

  const total = Object.values(files).reduce((sum, f) => sum + f.bytes, 0);
  console.log(`${'Total'.padEnd(32)} ${String(total).padStart(9)} bytes (${(total / 1024).toFixed(1)} KiB)`);
  const manifest = { source: SOURCE, chars: { app, shelters }, files };
  writeFileSync(`${ROOT}scripts/fonts-manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
