# Hazard Map — Phase 0 De-risking Spike: Results

**Date:** 2026-06-20
**Environment:** Claude Code remote execution sandbox (egress-allowlisted network policy).
**Plan:** `docs/superpowers/plans/2026-06-20-hazard-map-implementation.md` (Phase 0).

## TL;DR

The single dominant finding: **this remote environment uses a network egress allowlist.** `npm` registry and GitHub are reachable; **every external hazard-data source is blocked** (`HTTP 403`, `x-deny-reason: host_not_allowed`, "Add this host to your network egress settings"). That gates the three data-dependent spike tasks. The pipeline *mechanics* that run on npm tooling are validated and green.

## Reachability matrix (measured)

| Host | Needed for | Result |
|---|---|---|
| `registry.npmjs.org` | build tooling (mapshaper, pmtiles) | ✅ 200 |
| `github.com` / `raw.githubusercontent.com` | source / CI | ✅ 200 |
| `www.jma.go.jp` (bosai JSON) | **0.2 live alerts** | ❌ 403 host_not_allowed |
| `cyberjapandata.gsi.go.jp` (GSI tiles) | **0.1 basemap source** | ❌ 403 host_not_allowed |
| `nlftp.mlit.go.jp` (国土数値情報) | **0.3 hazard data** | ❌ 403 host_not_allowed |
| `api.protomaps.com`, `demotiles.maplibre.org` | basemap alts | ❌ 403 host_not_allowed |

## Per-task outcome

### 0.1 PMTiles basemap — ⚠️ BLOCKED (source), mechanics OK
- Tile source hosts (GSI/OSM/protomaps) are not allowlisted; `tippecanoe` additionally needs an apt build chain (distro mirror also likely blocked).
- `pmtiles` npm package installs fine. The basemap can be produced **wherever egress is open**, then the resulting `kobe.pmtiles` committed (git-LFS) — the runtime app reads it same-origin and never needs these hosts.
- **Gate:** allowlist a tile source **or** generate the PMTiles in an open-egress context (local/CI) and commit the artifact.

### 0.2 JMA alert feed — ❌ BLOCKED, highest residual uncertainty
- `www.jma.go.jp` is not allowlisted, so the candidate `bosai` endpoints (`/bosai/quake/data/list.json`, `/bosai/forecast/data/forecast/280000.json`) and — critically — **their CORS headers** cannot be verified from here.
- Note: the production alert fetch executes in the **end user's browser**, not this sandbox, so the real question remains "does JMA send `Access-Control-Allow-Origin`?" — still unanswered. The Cloudflare-Worker-proxy fallback in the plan remains the hedge.
- **Gate:** verify JMA endpoint + CORS from any open-egress browser/context before building the live feed; until then the alert feed stays stubbed behind the OFF flag with the fail-loud "check NHK/Yahoo" link only.

### 0.3 Hazard data licensing + size — ⚠️ BLOCKED (download), pipeline OK
- `nlftp.mlit.go.jp` not allowlisted → cannot download/measure real MLIT data here.
- **Pipeline mechanic validated** on a sample MLIT-shaped polygon: `mapshaper -simplify 25% keep-shapes -buffer 20 -o` runs, **buffers outward (safe side, Task 2.2)**, preserves `source`/`asOf` properties, emits valid GeoJSON. (Refinement for real data: project to a metric CRS before `-buffer` so the 20 m is true metres, not planar degrees.)
- **Gate:** allowlist MLIT/J-SHIS **or** the data is fetched + simplified in an open-egress context and the simplified GeoJSON committed.

## What this means for the build (architecture is unchanged, sequencing is)

The v2 design already makes data prep **build-time → committed artifacts**, so the *runtime* app is unaffected by this sandbox's allowlist. What's blocked is the **artifact-generation + live-validation** steps. Two ways forward (decision required — it's a network/security config choice):

- **(A) Open egress:** add `www.jma.go.jp`, `cyberjapandata.gsi.go.jp`, `nlftp.mlit.go.jp` (+ `www.j-shis.bosai.go.jp`, and an OSM source such as `download.geofabrik.de` if going OSM/tippecanoe) to the environment's egress settings. Then the full spike + real artifact generation run here.
- **(B) Build offline-of-this-env:** I build every component that doesn't need live data now (pipeline scripts, PMTiles render integration against a sample tileset, alert-feed code against a captured schema, all UI/SW/theming/tests), and the real data download + JMA-CORS check happen later in an open-egress context, dropping committed artifacts into the same pipeline.

Either way, **no placeholder data ships** (constraint 2) and the feature flag stays OFF until real artifacts land.
