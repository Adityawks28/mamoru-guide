import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildHash, stampCacheName } from '../vite-sw-manifest';

const read = (p: string): string => readFileSync(resolve(__dirname, '../..', p), 'utf8');

describe('service worker cache stamp', () => {
  it('stamps the build hash into CACHE_NAME', () => {
    expect(stampCacheName("const CACHE_NAME = 'mamoru-guide-dev';\nconst X = 1;", 'abc123def456'))
      .toBe("const CACHE_NAME = 'mamoru-guide-abc123def456';\nconst X = 1;");
  });
  it('refuses a worker without exactly one CACHE_NAME line', () => {
    expect(() => stampCacheName('const X = 1;', 'abc123def456')).toThrow(/CACHE_NAME/);
    expect(() => stampCacheName("const CACHE_NAME = 'a';\nconst CACHE_NAME = 'b';", 'abc123def456')).toThrow(/CACHE_NAME/);
  });
  it('gives the same hash for the same files in any order', () => {
    const a = { path: 'index.html', content: 'x' }, b = { path: 'assets/a.js', content: 'y' };
    expect(buildHash([a, b])).toBe(buildHash([b, a]));
    expect(buildHash([a, b])).toMatch(/^[0-9a-f]{12}$/);
  });
  it('changes the hash when one file changes', () => {
    expect(buildHash([{ path: 'index.html', content: 'x' }])).not.toBe(buildHash([{ path: 'index.html', content: 'z' }]));
  });
  it('the source worker keeps the placeholder, and the README has no manual bump', () => {
    expect(read('public/sw.js')).toContain("const CACHE_NAME = 'mamoru-guide-dev';");
    expect(read('README.md')).not.toContain('CACHE_NAME');
  });
});
