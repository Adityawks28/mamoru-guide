import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const DASH = '—';
const BINARY = /\.(png|jpe?g|gif|webp|ico|svg|woff2?|ttf|pmtiles|pbf|mp3|ogg|wav|zip|pdf)$/i;

describe('no em dash in shipped sources', () => {
  it('has no U+2014 in src, css, public, scripts or index.html', () => {
    const files = execSync('git ls-files src css public scripts index.html', {
      encoding: 'utf8',
      cwd: process.cwd(),
    })
      .split('\n')
      .filter((f) => f && !BINARY.test(f));
    const hits: string[] = [];
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (line.includes(DASH)) hits.push(`${file}:${i + 1}`);
      });
    }
    expect(hits).toEqual([]);
  });
});
