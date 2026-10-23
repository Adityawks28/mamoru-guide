export type Hazard = 'flood' | 'landslide' | 'surge' | 'earthquake' | 'tsunami' | 'fire' | 'inland' | 'volcano';

export interface Shelter {
  name: string;
  lat: number;
  lng: number;
  address: string;
  /** Hazards the city designated this site for. */
  types: Hazard[];
}

export interface ShelterList {
  source: string;
  asOf: string;
  sites: Shelter[];
}

// Bit order of hazardFlags in src/data/shelters.json (GSI disaster1..8).
const HAZARD_BITS: Hazard[] = ['flood', 'landslide', 'surge', 'earthquake', 'tsunami', 'fire', 'inland', 'volcano'];

type Row = [name: string, lat: number, lng: number, flags: number, address: string];

let list: Promise<ShelterList> | null = null;

// Built by scripts/build-shelter-data.mjs. A separate chunk, loaded on the
// first search; the service worker precaches it with the other assets.
export function loadShelters(): Promise<ShelterList> {
  list ??= import('./data/shelters.json').then(({ default: data }) => ({
    source: data.source,
    asOf: data.asOf,
    sites: (data.sites as Row[]).map(([name, lat, lng, flags, address]) => ({
      name, lat, lng, address,
      types: HAZARD_BITS.filter((_, i) => flags & (1 << i)),
    })),
  }));
  return list;
}
