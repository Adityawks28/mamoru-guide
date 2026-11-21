import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { loadLeaflet, LEAFLET_SRI } from '../shelter-finder';
import { contacts } from '../contacts';

const read = (f: string) => readFileSync(resolve(process.cwd(), f), 'utf8');

// Files under public/<dir>, as './'-prefixed paths like the PRECACHE list.
export function publicFiles(dir: string, skip: RegExp): string[] {
  const walk = (d: string): string[] => readdirSync(resolve(process.cwd(), 'public', d), { withFileTypes: true })
    .flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
  return walk(dir).filter(f => !skip.test(f)).map(f => './' + f);
}

// Runs public/sw.js against a fake worker scope and returns what install cached.
async function install(manifest: () => Promise<unknown>): Promise<string[]> {
  const handlers: Record<string, (e: unknown) => void> = {};
  const added: string[] = [];
  const scope = { addEventListener: (t: string, h: (e: unknown) => void) => { handlers[t] = h; }, skipWaiting: async () => {} };
  const caches = { open: async () => ({ addAll: async (urls: string[]) => { added.push(...urls); } }) };
  const fetch = async () => ({ ok: true, json: manifest });
  new Function('self', 'caches', 'fetch', read('public/sw.js'))(scope, caches, fetch);
  let done: Promise<unknown> = Promise.resolve();
  handlers.install({ waitUntil: (p: Promise<unknown>) => { done = p; } });
  await done;
  return added;
}

describe('offline', () => {
  it('installing the service worker caches the whole app, not just the page shell', async () => {
    const added = await install(async () => ({ js: ['assets/index-a.js', 'assets/plan-b.js'], css: ['assets/index-c.css'] }));
    expect(added).toEqual(expect.arrayContaining([
      './index.html', './assets/index-a.js', './assets/plan-b.js', './assets/index-c.css', './img/icons/icon-192.svg',
    ]));
  });

  it('still caches the shell when the asset list cannot be read', async () => {
    const added = await install(async () => { throw new Error('offline'); });
    expect(added).toContain('./index.html');
  });

  it('precaches every font', async () => {
    const files = publicFiles('fonts', /\.txt$/);
    expect(files).toHaveLength(5);
    const added = await install(async () => ({ js: [], css: [] }));
    expect(added).toEqual(expect.arrayContaining(files));
  });

  it('loads Leaflet from the vendored copy, pinned by hash', () => {
    document.head.innerHTML = '';
    void loadLeaflet().catch(() => {});
    const css = document.head.querySelector<HTMLLinkElement>('link[href*="leaflet"]')!;
    const js = document.head.querySelector<HTMLScriptElement>('script[src*="leaflet"]')!;
    expect(css.getAttribute('href')).toMatch(/vendor\/leaflet\/leaflet\.css$/);
    expect(js.getAttribute('src')).toMatch(/vendor\/leaflet\/leaflet\.js$/);
    expect(css.href).not.toContain('unpkg');
    expect(js.src).not.toContain('unpkg');
    expect(css.integrity).toBe(LEAFLET_SRI.css);
    expect(js.integrity).toBe(LEAFLET_SRI.js);
  });

  it('the vendored files are the published Leaflet 1.9.4', () => {
    const hash = (f: string) => 'sha256-' + createHash('sha256').update(readFileSync(resolve(process.cwd(), f))).digest('base64');
    expect(hash('public/vendor/leaflet/leaflet.js')).toBe(LEAFLET_SRI.js);
    expect(hash('public/vendor/leaflet/leaflet.css')).toBe(LEAFLET_SRI.css);
  });

  it('precaches every vendored Leaflet file', async () => {
    const files = publicFiles('vendor/leaflet', /LICENSE$/);
    expect(files).toHaveLength(7);
    const added = await install(async () => ({ js: [], css: [] }));
    expect(added).toEqual(expect.arrayContaining(files));
  });

  it('every precached path exists, so one missing file cannot break the install', async () => {
    const added = await install(async () => ({ js: [], css: [] }));
    for (const url of added) {
      if (url === './') continue;
      const file = url === './index.html' ? 'index.html' : 'public/' + url.slice(2);
      expect(existsSync(resolve(process.cwd(), file)), url).toBe(true);
    }
  });

  it('no source file requests unpkg.com', () => {
    const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true })
      .flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
    const offenders = walk(resolve(process.cwd(), 'src'))
      .filter(f => !f.endsWith('offline.test.ts'))
      .filter(f => readFileSync(f, 'utf8').includes('unpkg.com'));
    expect(offenders).toEqual([]);
  });
});

describe('without JavaScript', () => {
  const html = read('index.html');
  const blocks = html.match(/<noscript>[\s\S]*?<\/noscript>/g) ?? [];
  const inner = (blocks[0] ?? '').replace(/<\/?noscript>/g, '');
  const tpl = document.createElement('template');
  tpl.innerHTML = inner;
  const text = tpl.content.textContent ?? '';

  it('index.html has one noscript block, before the navbar', () => {
    expect(blocks).toHaveLength(1);
    const at = html.indexOf('<noscript>');
    expect(at).toBeGreaterThan(html.indexOf('<body'));
    expect(at).toBeLessThan(html.indexOf('<nav class="navbar"'));
  });

  it('gives 110, 119, 118 and 171 as tap-to-call links', () => {
    for (const n of ['110', '119', '118', '171']) expect(tpl.content.querySelector(`a[href="tel:${n}"]`)).not.toBeNull();
  });

  it('uses the certified contact text in all three languages', () => {
    for (const n of ['110', '119', '118']) {
      const c = contacts.find(x => x.number === n)!;
      expect(text).toContain(c.desc_en);
      expect(text).toContain(c.desc_ja);
      expect(text).toContain(c.desc_id);
    }
    const c = contacts.find(x => x.number === '171')!;
    expect(text).toContain(c.name_ja);
    expect(text).toContain(c.name.replace(' (171)', ''));
    expect(text).toContain(c.name_id.replace(' (171)', ''));
  });

  it('shows all three languages, because no script sets the language', () => {
    expect(read('css/base.css')).toMatch(/\.noscript-note \[data-lang\]\s*\{[^}]*display:\s*block/);
  });
});
