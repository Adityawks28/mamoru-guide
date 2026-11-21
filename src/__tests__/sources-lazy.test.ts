// sources-lazy.test.ts: the sources data must stay out of the first load.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const read = (f: string): string => readFileSync(f, 'utf8');

function staticImports(entry: string): string[] {
  const seen = new Set<string>();
  const walk = (file: string): void => {
    if (seen.has(file)) return;
    seen.add(file);
    const src = read(file);
    const re = /^\s*(?:import|export)\s+(?!type\b)(?:[^'";]*?\s+from\s+)?'(\.[^']*)'/gm;
    for (const m of src.matchAll(re)) {
      const base = join(dirname(file), m[1]);
      const next = [`${base}.ts`, join(base, 'index.ts')].find(existsSync);
      if (next) walk(next);
    }
  };
  walk(entry);
  return [...seen];
}

describe('sources lazy loading', () => {
  it('keeps the sources data out of the first load', () => {
    const seen = staticImports('src/main.ts');
    expect(seen).toContain('src/router.ts');
    for (const f of ['src/data/sources.ts', 'src/data/glossary.ts', 'src/data/source-records.ts', 'src/data/source-groups.ts', 'src/sources-page.ts'])
      expect(seen).not.toContain(f);
  });
  it('loads the sources page with a dynamic import', () => {
    expect(read('src/sources-loader.ts')).toMatch(/import\(\s*'\.\/sources-page'\s*\)/);
  });
});
