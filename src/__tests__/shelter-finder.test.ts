import { loadShelters } from '../shelter-data';
import { t } from '../i18n';

const SANNOMIYA = { lat: 34.6950, lng: 135.1955 };
const TOKYO = { lat: 35.6812, lng: 139.7671 };

function mountAt(where: { lat: number; lng: number }) {
  document.body.innerHTML = `
    <button id="shelterFindBtn"></button>
    <div id="shelterCachedHint"></div>
    <div id="shelterContainer"></div>`;
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition: (ok: PositionCallback) => ok({ coords: { latitude: where.lat, longitude: where.lng } } as GeolocationPosition) },
  });
}

async function search(): Promise<string[]> {
  vi.resetModules();
  const { initShelterFinder } = await import('../shelter-finder');
  initShelterFinder();
  document.getElementById('shelterFindBtn')!.click();
  await vi.waitFor(() => {
    if (!document.querySelector('.shelter-card, .shelter-out-of-area')) throw new Error('not rendered yet');
  });
  return [...document.querySelectorAll('.shelter-card .shelter-name')].map(n => n.textContent ?? '');
}

describe('shelter data', () => {
  it('comes from the official GSI list, with a source and a date', async () => {
    const { sites, source, asOf } = await loadShelters();
    expect(source).toContain('国土地理院');
    expect(asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(sites.length).toBeGreaterThan(1000);
    for (const s of sites) {
      expect(s.lat).toBeGreaterThan(34.3); expect(s.lat).toBeLessThan(35.2);
      expect(s.lng).toBeGreaterThan(134.6); expect(s.lng).toBeLessThan(135.8);
      expect(s.types.length).toBeGreaterThan(0);
    }
  });

  it('puts each site where GSI puts it', async () => {
    const { sites } = await loadShelters();
    const park = sites.find(s => s.name === '東遊園地')!;
    expect(park.lat).toBeCloseTo(34.6888, 4);
    expect(park.lng).toBeCloseTo(135.1961, 4);
    expect(park.types.sort()).toEqual(['earthquake', 'fire', 'tsunami']);
  });

  it('has no CJK compatibility ideographs, so every kanji is the one the font draws', async () => {
    const { sites } = await loadShelters();
    const compat = /[\uF900-\uFAFF]|[\u{2F800}-\u{2FA1F}]/u;
    const odd = sites.flatMap(s => [s.name, s.address]).filter(text => compat.test(text) && text.normalize('NFC') !== text);
    expect(odd).toEqual([]);
    expect(sites.some(s => s.name === '宝塚文化芸術センター庭園及び花のみち・さくら橋公園')).toBe(true);
  });

  it('never lists a beach park as a tsunami site when GSI does not', async () => {
    const { sites } = await loadShelters();
    const beach = sites.find(s => s.name === '須磨海浜公園')!;
    expect(beach.types).not.toContain('tsunami');
  });
});

describe('shelter finder', () => {
  it('lists the 5 nearest official sites', async () => {
    mountAt(SANNOMIYA);
    const names = await search();
    expect(names).toHaveLength(5);
    expect(names).not.toContain('神戸市立中央区役所');
  });

  it('says so when the user is outside the covered area, instead of listing sites 400 km away', async () => {
    mountAt(TOKYO);
    const names = await search();
    expect(names).toEqual([]);
    expect(document.querySelector('.shelter-out-of-area a')?.getAttribute('href')).toBe('https://disaportal.gsi.go.jp/maps/');
  });

  it('credits the source under the list', async () => {
    mountAt(SANNOMIYA);
    await search();
    expect(document.getElementById('shelterContainer')!.textContent).toContain('国土地理院');
  });
});

const GEO = (code: number) => ({ code });

function mountWithGeoError(code: number) {
  document.body.innerHTML = `
    <button id="shelterFindBtn"></button>
    <div id="shelterCachedHint"></div>
    <div id="shelterContainer"></div>`;
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition: (_ok: PositionCallback, err: PositionErrorCallback) => err(GEO(code) as GeolocationPositionError) },
  });
}

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => value });
}

async function start() {
  vi.resetModules();
  const mod = await import('../shelter-finder');
  mod.initShelterFinder();
  return mod;
}

async function see(selector: string) {
  await vi.waitFor(() => {
    if (!document.querySelector(selector)) throw new Error(`no ${selector} yet`);
  });
}

async function find(selector: string) {
  document.getElementById('shelterFindBtn')!.click();
  await see(selector);
}

function failShelters(times: number) {
  vi.doMock('../shelter-data', async (orig) => {
    const real = await orig<typeof import('../shelter-data')>();
    let n = 0;
    return { ...real, loadShelters: () => (n++ < times ? Promise.reject(new Error('offline')) : real.loadShelters()) };
  });
}

function fakeLeaflet() {
  const handlers: Record<string, () => void> = {};
  const chain: Record<string, unknown> = {};
  const self = () => chain;
  Object.assign(chain, { addTo: self, bindPopup: self, setView: self, fitBounds: self, remove: () => {},
    on: (ev: string, cb: () => void) => { handlers[ev] = cb; return chain; } });
  (globalThis as unknown as { L: unknown }).L = {
    map: self, tileLayer: self, circleMarker: self, marker: self,
  };
  return handlers;
}

describe('shelter finder problems', () => {
  beforeEach(() => { document.head.innerHTML = ''; });
  afterEach(() => {
    document.head.innerHTML = '';
    setOnline(true);
    vi.doUnmock('../shelter-data');
    delete (globalThis as unknown as { L?: unknown }).L;
  });

  it('keeps the list and says the map needs the internet when Leaflet does not load', async () => {
    mountAt(SANNOMIYA); await start(); await find('.shelter-card');
    await vi.waitFor(() => { if (!document.head.querySelector('script[src*="leaflet"]')) throw new Error('no script'); });
    document.head.querySelector('script[src*="leaflet"]')!.dispatchEvent(new Event('error'));
    await see('#shelterMap .shelter-problem[data-problem="map"]');
    expect(document.querySelectorAll('.shelter-card')).toHaveLength(5);
  });

  it('skips the map and shows the note when the phone is offline', async () => {
    mountAt(SANNOMIYA); await start(); setOnline(false);
    await find('.shelter-problem[data-problem="map"]');
    expect(document.head.querySelector('script[src*="leaflet"]')).toBeNull();
    expect(document.querySelectorAll('.shelter-card')).toHaveLength(5);
  });

  it('shows the map note when map tiles fail, and keeps the map', async () => {
    const handlers = fakeLeaflet();
    mountAt(SANNOMIYA); await start(); await find('.shelter-card');
    await vi.waitFor(() => { if (!document.head.querySelector('script[src*="leaflet"]')) throw new Error('no script'); });
    document.head.querySelector('script[src*="leaflet"]')!.dispatchEvent(new Event('load'));
    await vi.waitFor(() => { if (!handlers.tileerror) throw new Error('no handler'); });
    handlers.tileerror();
    handlers.tileerror();
    expect(document.querySelectorAll('.shelter-problem[data-problem="map"]')).toHaveLength(1);
    expect(document.getElementById('shelterMap')).not.toBeNull();
  });

  it('says the site list did not load, and Try again works after one failure', async () => {
    failShelters(1);
    mountAt(SANNOMIYA); await start(); await find('.shelter-problem[data-problem="data"] .shelter-retry');
    document.querySelector<HTMLButtonElement>('.shelter-retry')!.click();
    await vi.waitFor(() => expect(document.querySelectorAll('.shelter-card')).toHaveLength(5));
  });

  it('choosing an area never throws when the site list fails', async () => {
    const unhandled = vi.fn(); process.on('unhandledRejection', unhandled);
    failShelters(Infinity);
    mountWithGeoError(1); await start(); await find('#shelterCitySelect');
    const select = document.getElementById('shelterCitySelect') as HTMLSelectElement;
    select.value = '0'; select.dispatchEvent(new Event('change'));
    await vi.waitFor(() => expect(document.querySelector('#shelterList .shelter-problem[data-problem="data"]')).not.toBeNull());
    await new Promise(r => setTimeout(r, 20));
    expect(unhandled).not.toHaveBeenCalled(); process.off('unhandledRejection', unhandled);
  });

  it('the area list says why location failed, in the shared problem words', async () => {
    mountWithGeoError(3); await start(); await find('.shelter-fallback .shelter-problem');
    expect(document.querySelector('.shelter-fallback .shelter-problem')!.textContent).toContain(t('shelter.problem.locationTimeout', 'en'));
  });

  it('a problem message follows a language switch', async () => {
    failShelters(Infinity);
    mountAt(SANNOMIYA); await start(); await find('.shelter-problem[data-problem="data"]');
    const { setI18nLang, applyTranslations } = await import('../i18n');
    setI18nLang('ja'); applyTranslations();
    expect(document.querySelector('.shelter-problem p')!.textContent).toBe(t('shelter.problem.data', 'ja'));
    setI18nLang('en');
  });

  it('leaves no Leaflet tags in the head after failed loads', async () => {
    mountAt(SANNOMIYA); await start(); await find('.shelter-card');
    for (let i = 0; i < 2; i++) {
      await vi.waitFor(() => { if (!document.head.querySelector('script[src*="leaflet"]')) throw new Error('no script'); });
      document.head.querySelector('script[src*="leaflet"]')!.dispatchEvent(new Event('error'));
      await see('#shelterMap .shelter-problem[data-problem="map"]');
      expect(document.head.querySelectorAll('script[src*="leaflet"]')).toHaveLength(0);
      expect(document.head.querySelectorAll('link[href*="leaflet"]')).toHaveLength(0);
      if (i === 0) document.getElementById('shelterFindBtn')!.click();
    }
  });

  it('the Try again button uses the colored secondary style, so it reads in night mode', async () => {
    failShelters(1);
    mountAt(SANNOMIYA); await start(); await find('.shelter-retry');
    expect(document.querySelector('.shelter-retry')!.classList).toContain('secondary');
  });

  it('offers a reload when Try again fails while the phone is online', async () => {
    failShelters(Infinity);
    mountAt(SANNOMIYA); await start(); await find('.shelter-problem[data-problem="data"] .shelter-retry');
    expect(document.querySelector('.shelter-reload')).toBeNull();
    document.querySelector<HTMLButtonElement>('.shelter-retry')!.click();
    await see('.shelter-problem[data-problem="data"] .shelter-reload');
    const reload = document.querySelector<HTMLButtonElement>('.shelter-reload')!;
    expect(reload.textContent).toBe(t('shelter.reload', 'en'));
    expect(reload.classList).toContain('secondary');
    expect(document.querySelector('.shelter-retry')).not.toBeNull();
  });

  it('offers no reload when Try again fails offline', async () => {
    failShelters(Infinity);
    mountAt(SANNOMIYA); await start(); await find('.shelter-problem[data-problem="data"] .shelter-retry');
    setOnline(false);
    const first = document.querySelector('.shelter-problem');
    document.querySelector<HTMLButtonElement>('.shelter-retry')!.click();
    await vi.waitFor(() => expect(document.querySelector('.shelter-problem')).not.toBe(first));
    expect(document.querySelector('.shelter-problem[data-problem="data"]')).not.toBeNull();
    expect(document.querySelector('.shelter-reload')).toBeNull();
  });

  it('moves focus to the area list when location fails', async () => {
    mountWithGeoError(1); await start(); await find('#shelterCitySelect');
    expect(document.activeElement?.id).toBe('shelterCitySelect');
  });

  it('shows only the latest area when two are chosen quickly', async () => {
    vi.doMock('../shelter-data', async (orig) => {
      const real = await orig<typeof import('../shelter-data')>();
      let n = 0;
      return { ...real, loadShelters: async () => {
        if (n++ === 0) await new Promise(r => setTimeout(r, 60));
        return real.loadShelters();
      } };
    });
    mountWithGeoError(1); await start(); await find('#shelterCitySelect');
    const select = document.getElementById('shelterCitySelect') as HTMLSelectElement;
    select.value = '0'; select.dispatchEvent(new Event('change'));
    select.value = '5'; select.dispatchEvent(new Event('change'));
    await see('.shelter-card');
    await new Promise(r => setTimeout(r, 120));
    const addresses = [...document.querySelectorAll('.shelter-card .shelter-address')].map(a => a.textContent ?? '');
    expect(addresses).toHaveLength(5);
    for (const a of addresses) expect(a).toContain('明石市');
    expect(document.head.querySelectorAll('script[src*="leaflet"]')).toHaveLength(1);
  });

  it('adds one Leaflet script when two map loads overlap', async () => {
    const { loadLeaflet } = await start();
    void loadLeaflet().catch(() => {}); void loadLeaflet().catch(() => {});
    expect(document.head.querySelectorAll('script[src*="leaflet"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('link[href*="leaflet"]')).toHaveLength(1);
  });

  it('maps geolocation codes to problems', async () => {
    const { problemFromGeolocation } = await start();
    expect([1, 2, 3, 9].map(c => problemFromGeolocation({ code: c }))).toEqual(
      ['locationDenied', 'locationUnavailable', 'locationTimeout', 'locationFailed']);
    expect(problemFromGeolocation(new Error('x'))).toBe('locationFailed');
  });

  it('loadShelters tries again after a failed load', async () => {
    vi.resetModules(); const { loadShelters: load } = await import('../shelter-data');
    await expect(load(() => Promise.reject(new Error('offline')))).rejects.toThrow('offline');
    expect((await load()).sites.length).toBeGreaterThan(1000);
  });

  it('has every new shelter key in all three languages', () => {
    for (const k of ['data', 'map', 'locationDenied', 'locationTimeout', 'locationUnavailable', 'locationFailed'])
      for (const l of ['en', 'ja', 'id'] as const) expect(t(`shelter.problem.${k}`, l)).not.toBe(`shelter.problem.${k}`);
    for (const k of ['shelter.retry', 'shelter.reload'])
      for (const l of ['en', 'ja', 'id'] as const) expect(t(k, l)).not.toBe(k);
  });
});
