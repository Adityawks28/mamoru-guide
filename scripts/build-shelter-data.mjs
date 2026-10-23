#!/usr/bin/env node
/**
 * build-shelter-data.mjs — official evacuation sites for the shelter finder
 *
 * Downloads the GSI (国土地理院) 指定緊急避難場所 GeoJSON tiles that cover
 * Kobe, Hanshin and Osaka, keeps the cities below, and writes
 * src/data/shelters.json. The app only reads that committed file, so the
 * runtime never contacts GSI and the user's location never leaves the device.
 *
 * Run from repo root:  node scripts/build-shelter-data.mjs
 * Data terms: https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html
 */

import { writeFileSync, mkdirSync } from 'node:fs';

// One layer per hazard; every feature carries all its disaster flags anyway.
const LAYERS = ['skhb01', 'skhb02', 'skhb03', 'skhb04', 'skhb05', 'skhb06', 'skhb07', 'skhb08'];
// Zoom 10 tiles: lng 134.65 to 135.70, lat 34.31 to 35.17.
const XS = [895, 896, 897];
const YS = [405, 406, 407];
const CITIES = /^(兵庫県|大阪府)(神戸市|芦屋市|西宮市|尼崎市|伊丹市|宝塚市|明石市|大阪市)/;
const OUT = 'src/data/shelters.json';

const sites = new Map();
for (const layer of LAYERS) {
  for (const x of XS) {
    for (const y of YS) {
      const url = `https://cyberjapandata.gsi.go.jp/xyz/${layer}/10/${x}/${y}.geojson`;
      const res = await fetch(url);
      if (res.status === 404) continue; // no sites for this hazard in this tile
      if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
      for (const f of (await res.json()).features) {
        const p = f.properties;
        if (!CITIES.test(p.address ?? '')) continue;
        const [lng, lat] = f.geometry.coordinates;
        // disaster1..8 → bits 0..7 (flood, landslide, surge, earthquake, tsunami, fire, inland, volcano)
        let flags = 0;
        for (let i = 1; i <= 8; i++) if (p[`disaster${i}`] === 1) flags |= 1 << (i - 1);
        const key = `${p.name}|${lat}|${lng}`;
        sites.set(key, [p.name, +lat.toFixed(6), +lng.toFixed(6), flags | (sites.get(key)?.[3] ?? 0), p.address.replace(/^(兵庫県|大阪府)/, '')]);
      }
    }
  }
}

const rows = [...sites.values()].sort((a, b) => a[4].localeCompare(b[4], 'ja') || a[0].localeCompare(b[0], 'ja'));
if (rows.length < 1000) throw new Error(`only ${rows.length} sites: the GSI tiles may have moved`);
mkdirSync('src/data', { recursive: true });
writeFileSync(OUT, JSON.stringify({
  source: '国土地理院 指定緊急避難場所データ (GSI designated emergency evacuation sites)',
  asOf: new Date().toISOString().slice(0, 10),
  fields: ['name', 'lat', 'lng', 'hazardFlags', 'address'],
  sites: rows,
}));
console.log(`${OUT}: ${rows.length} sites`);
