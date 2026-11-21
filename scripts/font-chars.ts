// The characters the self-hosted font subsets must cover (scripts/build-fonts.ts).
// Pure: it reads files and touches nothing else.
import { readdirSync, readFileSync } from 'node:fs';

// Always kept, so a small text change does not need a new subset at once:
// printable ASCII, CJK punctuation, hiragana, katakana and full-width forms.
const BASE_RANGES: [number, number][] = [
  [0x0020, 0x007e],
  [0x3000, 0x303f],
  [0x3040, 0x309f],
  [0x30a0, 0x30ff],
  [0xff01, 0xff5e],
];

// Emoji come from the system emoji font, and control characters draw nothing.
const DROP = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|‍|️|⃣|\p{Cc})$/u;

const read = (root: string, file: string) => readFileSync(`${root}/${file}`, 'utf8');

// Non-test .ts files under dir, as paths relative to root.
function sourceFiles(root: string, dir: string): string[] {
  return readdirSync(`${root}/${dir}`, { withFileTypes: true }).flatMap(e => {
    const path = `${dir}/${e.name}`;
    if (e.isDirectory()) return e.name === '__tests__' ? [] : sourceFiles(root, path);
    return e.name.endsWith('.ts') && !e.name.endsWith('.test.ts') ? [path] : [];
  });
}

function addText(chars: Set<string>, text: string): void {
  for (const c of text) if (!DROP.test(c)) chars.add(c);
}

// Only the characters the app files use, without the base ranges.
export function appTextChars(root: string): Set<string> {
  const chars = new Set<string>();
  const files = [
    'index.html',
    'public/404.html',
    ...readdirSync(`${root}/css`).filter(f => f.endsWith('.css')).map(f => `css/${f}`),
    ...sourceFiles(root, 'src'),
  ];
  for (const file of files) addText(chars, read(root, file));
  return chars;
}

export function collectAppChars(root: string): Set<string> {
  const chars = new Set<string>();
  for (const [from, to] of BASE_RANGES) for (let cp = from; cp <= to; cp++) chars.add(String.fromCodePoint(cp));
  for (const c of appTextChars(root)) chars.add(c);
  return chars;
}

export function shelterChars(root: string): Set<string> {
  const data = JSON.parse(read(root, 'src/data/shelters.json')) as { fields: string[]; sites: unknown[][] };
  const columns = ['name', 'address'].map(f => data.fields.indexOf(f));
  if (columns.includes(-1)) throw new Error('src/data/shelters.json: no name or address field');
  const chars = new Set<string>();
  for (const site of data.sites) for (const i of columns) addText(chars, String(site[i] ?? ''));
  return chars;
}
