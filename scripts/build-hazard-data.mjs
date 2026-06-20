#!/usr/bin/env node
/**
 * build-hazard-data.mjs — Phase 2.1/2.2 build-time hazard-data pipeline
 *
 * WHAT IT DOES (build-time only; never runs in the browser):
 *   For each configured dataset:
 *     1. download  the raw source archive (MLIT 国土数値情報 / J-SHIS),
 *     2. extract   the shapefile (or GeoJSON) inside it,
 *     3. clip      to the Kobe/Kansai bbox,
 *     4. reproject to a metric CRS so the outward buffer is true *metres*,
 *     5. simplify  toward the hazard (buffer outward, then simplify keeping
 *                  shapes) so a danger zone is NEVER shrunk by simplification
 *                  — under-warning is the failure mode we refuse,
 *     6. reproject back to WGS84 (lon/lat) for Leaflet,
 *     7. stamp     every Feature with properties.source + properties.asOf,
 *     8. write     public/data/{flood,tsunami,landslide,earthquake-prob}.geojson,
 *     9. measure   total committed size against the < 2.5 MB Phase-0.3 budget.
 *
 * WHY A SCRIPT (not runtime): constraint 2 — no placeholder/unattributed data
 *   ever ships, and the *runtime* app must never fetch these hosts. Data prep is
 *   build-time → committed, attributed, date-stamped artifacts.
 *
 * REQUIREMENTS (build-time only): `npx mapshaper` (installed on demand below).
 *   Run from repo root:  node scripts/build-hazard-data.mjs
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️  CONFIRM-ON-EGRESS  ⚠️
 *   The exact MLIT/J-SHIS download URLs, dataset year codes, attribute field
 *   names, and the `asOf` dataset dates below are the items the Phase-0 spike
 *   could NOT verify (egress to nlftp.mlit.go.jp / www.j-shis.bosai.go.jp was
 *   `host_not_allowed`). Each is marked `CONFIRM:`. Verify against the live
 *   download page the moment egress opens, then delete the CONFIRM markers.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, existsSync, statSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'public', 'data');

// Kobe/Kansai bbox  [lon_min, lat_min, lon_max, lat_max]  (design §bbox)
const BBOX = { lonMin: 134.8, latMin: 34.5, lonMax: 135.8, latMax: 35.1 };

// Metric CRS for buffering in real metres. EPSG:3857 (Web Mercator) is the
// pragmatic choice (mapshaper ships it; ~0.8% scale error at this latitude is
// negligible relative to the deliberate outward buffer). For survey-grade
// metres use a JGD2011 plane-rectangular zone (Kansai ≈ EPSG:6674) instead.
const METRIC_CRS = 'EPSG:3857';

// Outward safety buffer (metres) applied BEFORE simplification so the simplified
// boundary still fully contains the original hazard polygon. Document any change.
const OUTWARD_BUFFER_M = 20;

// Douglas–Peucker retention. `keep-shapes` prevents small critical polygons
// (e.g. an isolated low-lying block) from being simplified away entirely.
const SIMPLIFY_PERCENT = 25;

const SIZE_BUDGET_BYTES = 2.5 * 1024 * 1024; // Phase-0.3 gate: < 2.5 MB total

/**
 * Dataset registry. One entry per output layer.
 *  - url:      raw archive (zip of shapefile) or direct GeoJSON.  CONFIRM.
 *  - source:   attribution string baked into every Feature + map UI.
 *  - asOf:     dataset publication date (YYYY-MM or YYYY).  CONFIRM.
 *  - license:  redistribution terms (must be 政府標準利用規約 ≈ CC-BY).  CONFIRM.
 *
 * MLIT 国土数値情報 ships per-prefecture shapefile zips. Hyogo/Osaka/Kyoto pref
 * codes: 28 / 27 / 26. Known dataset families:
 *   A31 浸水想定区域 (flood)   A40/A48 津波浸水想定 (tsunami)   A33 土砂災害警戒区域 (landslide)
 * J-SHIS publishes earthquake-probability mesh via its data download / API.
 */
const DATASETS = [
  {
    name: 'flood',
    // CONFIRM: exact A31 archive URL(s) for pref 28/27/26 + year code.
    urls: [
      'https://nlftp.mlit.go.jp/ksj/gml/data/A31/A31-12/A31-12_28_GML.zip', // CONFIRM
    ],
    source: '国土交通省 国土数値情報（浸水想定区域データ A31）', // CONFIRM exact label
    asOf: 'CONFIRM', // e.g. '2012' — from the download page
    license: '政府標準利用規約（CC-BY 互換）', // CONFIRM
  },
  {
    name: 'tsunami',
    urls: [
      'https://nlftp.mlit.go.jp/ksj/gml/data/A40/A40-15/A40-15_28_GML.zip', // CONFIRM (A40 or A48)
    ],
    source: '国土交通省 国土数値情報（津波浸水想定 A40）', // CONFIRM
    asOf: 'CONFIRM',
    license: '政府標準利用規約（CC-BY 互換）', // CONFIRM
  },
  {
    name: 'landslide',
    urls: [
      'https://nlftp.mlit.go.jp/ksj/gml/data/A33/A33-21/A33-21_28_GML.zip', // CONFIRM
    ],
    source: '国土交通省 国土数値情報（土砂災害警戒区域 A33）', // CONFIRM
    asOf: 'CONFIRM',
    license: '政府標準利用規約（CC-BY 互換）', // CONFIRM
  },
  {
    name: 'earthquake-prob',
    // CONFIRM: J-SHIS probability mesh download (J-SHIS Map API / bulk download).
    urls: [
      'https://www.j-shis.bosai.go.jp/labs/...CONFIRM...', // CONFIRM
    ],
    source: '防災科学技術研究所 J-SHIS 地震ハザードステーション', // CONFIRM
    asOf: 'CONFIRM',
    license: 'J-SHIS 利用規約（要確認）', // CONFIRM
  },
];

function log(...a) { console.log('[hazard-data]', ...a); }
function fail(msg) { console.error('[hazard-data] ERROR:', msg); process.exit(1); }

function hasConfirmMarkers(ds) {
  const blob = JSON.stringify(ds);
  return blob.includes('CONFIRM');
}

/** Run mapshaper via npx; installs it on first use into the local cache. */
function mapshaper(args, opts = {}) {
  return execFileSync('npx', ['--yes', 'mapshaper', ...args], {
    stdio: ['ignore', 'pipe', 'inherit'],
    encoding: 'utf8',
    ...opts,
  });
}

async function download(url, destPath) {
  log('GET', url);
  const res = await fetch(url);
  if (!res.ok) {
    // The Phase-0 spike: this is exactly where `host_not_allowed` surfaces.
    throw new Error(`download failed ${res.status} ${res.statusText} for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const { writeFileSync } = await import('node:fs');
  writeFileSync(destPath, buf);
  return destPath;
}

/** Extract a .zip into a dir using the system `unzip`; return the dir. */
function unzip(zipPath, intoDir) {
  mkdirSync(intoDir, { recursive: true });
  execFileSync('unzip', ['-o', '-q', zipPath, '-d', intoDir], { stdio: 'inherit' });
  return intoDir;
}

/** Find the first shapefile (or geojson) under a dir, recursively. */
function findVector(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findVector(p);
      if (found) return found;
    } else if (/\.(shp|geojson|json)$/i.test(entry.name)) {
      return p;
    }
  }
  return null;
}

async function buildDataset(ds, workRoot) {
  log(`── ${ds.name} ──`);
  if (hasConfirmMarkers(ds)) {
    fail(
      `dataset "${ds.name}" still has CONFIRM markers — verify URL/asOf/license ` +
      `against the live MLIT/J-SHIS page (needs egress) before building.`,
    );
  }

  const dsDir = join(workRoot, ds.name);
  mkdirSync(dsDir, { recursive: true });

  // 1–2. download + extract every source archive, collect vector inputs.
  const inputs = [];
  for (const url of ds.urls) {
    const isZip = /\.zip$/i.test(url);
    const dl = join(dsDir, isZip ? `src-${inputs.length}.zip` : `src-${inputs.length}.geojson`);
    await download(url, dl);
    if (isZip) {
      const ex = unzip(dl, join(dsDir, `ex-${inputs.length}`));
      const vec = findVector(ex);
      if (!vec) fail(`no .shp/.geojson found inside ${url}`);
      inputs.push(vec);
    } else {
      inputs.push(dl);
    }
  }

  const outPath = join(OUT_DIR, `${ds.name}.geojson`);

  // 3–8. mapshaper pipeline. -merge-layers combines multi-prefecture inputs.
  //   clip → metric CRS → outward buffer → simplify(keep-shapes) → WGS84 →
  //   stamp source/asOf → drop everything else → write minified GeoJSON.
  // NOTE: field names for any source-specific attributes you want to keep
  //       (e.g. flood depth rank) must be confirmed from the real shapefile
  //       and added to the `-each` below.  CONFIRM.
  const each =
    `this.properties = {` +
    `source:'${ds.source.replace(/'/g, "\\'")}',` +
    `asOf:'${ds.asOf}',` +
    `kind:'${ds.name}'` +
    `}`;

  mapshaper([
    '-i', ...inputs, 'combine-files',
    '-merge-layers', 'force',
    '-clip', `bbox=${BBOX.lonMin},${BBOX.latMin},${BBOX.lonMax},${BBOX.latMax}`,
    '-proj', METRIC_CRS,
    '-buffer', `${OUTWARD_BUFFER_M}`,        // outward = safe side (Task 2.2)
    '-simplify', `${SIMPLIFY_PERCENT}%`, 'keep-shapes',
    '-clean',                                 // fix any buffer self-intersections
    '-proj', 'wgs84',
    '-each', each,
    '-o', `format=geojson`, 'precision=0.00001', outPath,
  ]);

  const bytes = statSync(outPath).size;
  log(`${ds.name}: ${(bytes / 1024).toFixed(0)} KB → ${outPath}`);
  return bytes;
}

async function main() {
  // Preflight: tooling + system unzip.
  try { execFileSync('unzip', ['-v'], { stdio: 'ignore' }); }
  catch { fail('`unzip` not found — install it (apt-get install unzip) before running.'); }

  mkdirSync(OUT_DIR, { recursive: true });
  const workRoot = mkdtempSync(join(tmpdir(), 'hazard-'));

  let total = 0;
  try {
    for (const ds of DATASETS) total += await buildDataset(ds, workRoot);
  } finally {
    rmSync(workRoot, { recursive: true, force: true });
  }

  log('────────────────────────────────────────');
  log(`TOTAL committed: ${(total / 1024 / 1024).toFixed(2)} MB`);
  log(`Budget (Phase 0.3): ${(SIZE_BUDGET_BYTES / 1024 / 1024).toFixed(2)} MB`);
  if (total > SIZE_BUDGET_BYTES) {
    log('⚠️  OVER BUDGET → trigger the Phase-0.3 decision gate: narrow scope to');
    log('    Kobe-city + adjacency, OR split into per-prefecture lazy-loaded files.');
    process.exit(2);
  }
  log('✅ within budget.');
}

main().catch((e) => fail(e.stack || e.message));
