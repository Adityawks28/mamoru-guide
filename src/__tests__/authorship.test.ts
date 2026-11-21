import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { en } from '../locales/en';
import { ja } from '../locales/ja';
import { id } from '../locales/id';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', 'dist', '.git', 'docs', 'anti-slop', '.superpowers', 'coverage']);
const TEXT = /\.(ts|js|json|html|css|md|svg|webmanifest|txt|yml|yaml)$/;
// Built at runtime so this file does not match itself.
const BANNED = ['P' + 'PI', 'Perhim' + 'punan'];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (TEXT.test(name) && name !== 'package-lock.json') out.push(p);
  }
  return out;
}

describe('authorship', () => {
  it('no file names the former association', () => {
    const hits = walk(ROOT).filter(f => {
      const text = readFileSync(f, 'utf8');
      return BANNED.some(b => text.includes(b));
    });
    expect(hits).toEqual([]);
  });

  it('index.html credits Aditya as author', () => {
    const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
    expect(html).toContain('<meta name="author" content="Aditya">');
  });

  it('footer copy names Aditya in every locale', () => {
    for (const l of [en, ja, id]) expect(l['footer.copy']).toContain('Aditya');
  });
});
