import { loadShelters } from '../shelter-data';

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
