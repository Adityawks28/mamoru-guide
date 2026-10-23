import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadLeaflet } from '../shelter-finder';

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
