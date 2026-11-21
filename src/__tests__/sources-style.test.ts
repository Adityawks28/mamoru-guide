import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(process.cwd(), 'css/components.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rule = (selector: string) =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, sel]) => sel.split(',').map(s => s.trim().replace(/\s+/g, ' ')).includes(selector))
    .map(([, , body]) => body)
    .join('\n');

describe('sources page styles', () => {
  it('gives the sources link a 44px tap target', () => expect(rule('.sources-link')).toMatch(/min-height:\s*44px/));
  it('wraps long source titles', () => expect(rule('.source-item')).toMatch(/overflow-wrap:\s*anywhere/));
  it('sets group titles in --pixel-font, at 14px in Japanese', () => {
    expect(rule('.sources-group-title')).toMatch(/font-family:\s*var\(--pixel-font\)/);
    expect(rule('body.lang-ja .sources-group-title')).toMatch(/font-size:\s*14px/);
  });
  it('uses theme tokens for source text colors', () => {
    expect(rule('.source-publisher')).toMatch(/color:\s*var\(--text-muted\)/);
    expect(rule('.source-title')).toMatch(/color:\s*var\(--text\)/);
  });
});
