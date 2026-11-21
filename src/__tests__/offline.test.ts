import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadLeaflet } from '../shelter-finder';
import { contacts } from '../contacts';

const read = (f: string) => readFileSync(resolve(process.cwd(), f), 'utf8');

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

  it('Google Fonts load with CORS so the service worker can keep a copy', () => {
    const doc = new DOMParser().parseFromString(read('index.html'), 'text/html');
    const link = doc.querySelector('link[href^="https://fonts.googleapis.com"]')!;
    expect(link.getAttribute('crossorigin')).toBe('anonymous');
  });

  it('Leaflet from the CDN is pinned by hash, so a tampered copy will not run', () => {
    document.head.innerHTML = '';
    void loadLeaflet().catch(() => {});
    const css = document.head.querySelector<HTMLLinkElement>('link[href*="leaflet"]')!;
    const js = document.head.querySelector<HTMLScriptElement>('script[src*="leaflet"]')!;
    for (const el of [css, js]) {
      expect(el.integrity).toMatch(/^sha256-[A-Za-z0-9+/]{43}=$/);
      expect(el.crossOrigin).toBe('anonymous');
    }
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
