#!/usr/bin/env node
/**
 * build-basemap.mjs — Phase 1.1 build-time offline basemap (PMTiles)
 *
 * WHAT IT DOES (build-time only):
 *   1. acquire vector source for the Kobe/Kansai bbox — either
 *        (A) an OSM extract (.osm.pbf, ODbL) via Geofabrik / a bbox cut, or
 *        (B) GSI vector tiles,
 *   2. render z0–14 vector tiles with `tippecanoe` into a single archive,
 *   3. convert/emit `public/tiles/kobe.pmtiles` (one same-origin file — the
 *      runtime app reads it locally and NEVER fetches a tile host, so the
 *      viewport is not leaked to a third party — design constraint 5),
 *   4. measure the file against the < 8 MB Phase-0.1 budget (gate at ~15 MB).
 *
 * WHY: self-hosted PMTiles is the only basemap approach that is BOTH offline
 *   and privacy-preserving (critique findings 3 + privacy). The raw archive may
 *   be committed via git-LFS or kept as a CI build artifact; only the runtime
 *   read path (public/tiles/) ships.
 *
 * REQUIREMENTS (build-time only):
 *   - `tippecanoe` (C build chain; `brew install tippecanoe` or build from src).
 *     Needs an apt/build toolchain — in an allowlist sandbox the distro mirror
 *     may also be blocked; run this where egress + build tools exist (local/CI).
 *   - `npx pmtiles` for inspection/conversion (installed on demand).
 *
 *   Run from repo root:  node scripts/build-basemap.mjs
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️  CONFIRM-ON-EGRESS  ⚠️
 *   The source URL + attribution below could not be verified by the Phase-0
 *   spike (egress to cyberjapandata.gsi.go.jp / download.geofabrik.de was
 *   `host_not_allowed`). Confirm the exact extract URL, its licence, and the
 *   attribution string, then delete the CONFIRM markers.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'public', 'tiles');
const OUT_FILE = join(OUT_DIR, 'kobe.pmtiles');

// Kobe/Kansai bbox  [lon_min, lat_min, lon_max, lat_max]  (design §bbox)
const BBOX = { lonMin: 134.8, latMin: 34.5, lonMax: 135.8, latMax: 35.1 };
const MIN_ZOOM = 0;
const MAX_ZOOM = 14;

const SIZE_TARGET_BYTES = 8 * 1024 * 1024;   // Phase-0.1 target  < 8 MB
const SIZE_GATE_BYTES = 15 * 1024 * 1024;    // Phase-0.1 gate    > 15 MB → fall back

// Source extract.  CONFIRM url + licence + attribution.
const SOURCE = {
  // (A) OSM ODbL — a Kansai/Kinki regional extract, cut to BBOX below.
  url: 'https://download.geofabrik.de/asia/japan/kinki-latest.osm.pbf', // CONFIRM
  // For a smaller download you can bbox-cut the pbf first with `osmium extract`.
  attribution: '© OpenStreetMap contributors (ODbL)', // CONFIRM (GSI: 出典：国土地理院)
  license: 'ODbL 1.0', // CONFIRM
};

function log(...a) { console.log('[basemap]', ...a); }
function fail(msg) { console.error('[basemap] ERROR:', msg); process.exit(1); }

function which(bin) {
  try { execFileSync('sh', ['-c', `command -v ${bin}`], { stdio: 'ignore' }); return true; }
  catch { return false; }
}

async function download(url, destPath) {
  log('GET', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status} ${res.statusText} for ${url}`);
  const { writeFileSync } = await import('node:fs');
  writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
  return destPath;
}

async function main() {
  if (SOURCE.attribution.includes('CONFIRM') || SOURCE.license.includes('CONFIRM') || SOURCE.url.includes('CONFIRM')) {
    fail('SOURCE still has CONFIRM markers — verify extract URL/licence/attribution (needs egress) first.');
  }
  if (!which('tippecanoe')) {
    fail('`tippecanoe` not found. Install it (build chain required) and re-run; ' +
         'in an egress-allowlist sandbox build this in a local/CI context instead.');
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const work = mkdtempSync(join(tmpdir(), 'basemap-'));
  try {
    // 1. acquire source extract.
    const pbf = join(work, 'src.osm.pbf');
    await download(SOURCE.url, pbf);

    // (optional) bbox-cut to shrink before tiling — keeps tippecanoe fast.
    let cut = pbf;
    if (which('osmium')) {
      cut = join(work, 'cut.osm.pbf');
      execFileSync('osmium', [
        'extract', '-b',
        `${BBOX.lonMin},${BBOX.latMin},${BBOX.lonMax},${BBOX.latMax}`,
        pbf, '-o', cut, '--overwrite',
      ], { stdio: 'inherit' });
    } else {
      log('osmium not found — tiling full extract (slower; tippecanoe still clips by zoom).');
    }

    // 2–3. render vector tiles → PMTiles. tippecanoe writes .pmtiles directly
    //      when the output ends in .pmtiles (modern builds).
    execFileSync('tippecanoe', [
      '-o', OUT_FILE,
      '--force',
      `--minimum-zoom=${MIN_ZOOM}`,
      `--maximum-zoom=${MAX_ZOOM}`,
      `--clip-bounding-box=${BBOX.lonMin},${BBOX.latMin},${BBOX.lonMax},${BBOX.latMax}`,
      '--coalesce-densest-as-needed',  // keep size bounded
      '--drop-smallest-as-needed',
      '--attribution', SOURCE.attribution,
      cut,
    ], { stdio: 'inherit' });

    if (!existsSync(OUT_FILE)) fail('tippecanoe produced no output.');

    // 4. measure against the Phase-0.1 budget/gate.
    const bytes = statSync(OUT_FILE).size;
    log('────────────────────────────────────────');
    log(`kobe.pmtiles: ${(bytes / 1024 / 1024).toFixed(2)} MB  →  ${OUT_FILE}`);
    log(`Target (Phase 0.1): < ${(SIZE_TARGET_BYTES / 1024 / 1024).toFixed(0)} MB · ` +
        `Gate: > ${(SIZE_GATE_BYTES / 1024 / 1024).toFixed(0)} MB`);

    // Inspect with pmtiles (verifies a valid archive header + tile coverage).
    try {
      const info = execFileSync('npx', ['--yes', 'pmtiles', 'show', OUT_FILE],
        { encoding: 'utf8' });
      log('pmtiles show:\n' + info.split('\n').slice(0, 12).join('\n'));
    } catch { log('(pmtiles show skipped — install pmtiles CLI to inspect)'); }

    if (bytes > SIZE_GATE_BYTES) {
      log('⚠️  OVER GATE → Phase-0.1 fallback: cache-on-view raster GSI tiles');
      log('    (online-only map; offline = shelter LIST only) and update offline claims.');
      process.exit(2);
    }
    if (bytes > SIZE_TARGET_BYTES) {
      log('⚠️  over soft target but under gate — consider lowering max zoom or layer filtering.');
    }
    log('✅ within budget.');
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

main().catch((e) => fail(e.stack || e.message));
