# Hazard Map & Emergency Dashboard — Implementation Plan (v2: make it actually work)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

> **v2 changelog.** This replaces the v1 plan after an adversarial design+engineering critique (see `docs/superpowers/specs/2026-06-20-hazard-map-critique.md`). v1 hand-waved the four things that make a hazard map real — offline tiles, real data, live alerts, and correct geometry — and made safety-unsafe design choices. v2 front-loads a **de-risking spike**, self-hosts offline tiles via **PMTiles**, sources **real licensed hazard data first**, makes **alerts fail loud**, and fixes every Critical/High finding. It is honest about cost: **~3–4 weeks**, not 11–16 days.

**Source design spec:** `docs/superpowers/specs/2026-06-20-hazard-map-design.md`
**Critique driving v2:** `docs/superpowers/specs/2026-06-20-hazard-map-critique.md`
**Commit convention:** `feat:` / `fix:` / `chore:` / `docs:`, no Claude trailer (per CLAUDE.md)
**Test:** `npx vitest run` · **Build:** `npm run build`

---

## Revised constraints (what changed and why)

1. **Dependencies: "zero *CDN* runtime deps; small, audited, *bundled* deps allowed where safety/correctness requires."** v1's dogmatic zero-deps forced hand-rolled point-in-polygon and ruled out offline tiles. v2 bundles exactly two, tree-shaken, build-time (not CDN):
   - `pmtiles` — single-file offline vector basemap.
   - `@turf/boolean-point-in-polygon` — correct "are you in a danger zone?" geometry.
   Leaflet stays CDN-loaded + lazy (unchanged). No other new deps.
2. **No placeholder hazard data ever ships.** `public/data/*-zones.geojson` contains only real, sourced, attributed, date-stamped data. Sample geometry lives only in `src/hazard-map/__tests__/fixtures/` and can never be fetched by the app.
3. **Feature flag defaults OFF** until real data + offline tiles land (Phase 5). `hazardMapEnabled()` returns `localStorage.getItem('mamoru-hazard-map-enabled') === 'true'` (opt-in during build-out), flipped to default-on only at rollout (Phase 8).
4. **Safety overrides aesthetics on the critical path.** Press Start 2P is decoration-only; every emergency/critical string uses the legible system UI font. No `hue-rotate` on tiles.
5. **Privacy, stated honestly.** Self-hosted PMTiles means base-map tiles do **not** leak the viewport to a third party. The only outbound request is the region-wide JMA alert fetch, which carries no location. The plan documents this precisely — no "no data ever leaves" overclaim.
6. **Reuse, don't rewrite.** Extract the working haversine/geolocation/Leaflet-loader from `src/shelter-finder.ts` (do not reimplement). Keep the old finder behind the flag until Phase 8.

---

## Critique → resolution traceability

Every Critical/High finding maps to a task. Implementers must not close a phase with an open finding.

| # | Critique finding (severity) | Resolved by |
|---|---|---|
| 1 | Sample polygons ship to users (Critical) | Constraint 2; Phase 2 (real data first); flag default OFF (constraint 3) |
| 2 | Straight-line routing into hazards (Critical) | Task 3.3 (elevation-aware tsunami "nearest safe" + path-crosses-hazard exclusion + disclaimer) |
| 3 | OSM bulk tile precache violates policy (Critical) | Phase 1 (self-hosted PMTiles; no third-party bulk fetch) |
| 4 | Misprioritized vs Tier-1 safety (Critical) | **Already resolved** — Tier-1 medical fixes + EARTHQUAKE NOW shipped (commits `c6d7210`…`5f1ec8f`). Map is now a legitimately-next item. |
| 5 | Pixel font on alert banner (High) | Task 7.1 (legible font on critical path) |
| 6 | Night hue-rotate kills contrast (High) | Task 7.1 (drop hue-rotate; opaque label pills) |
| 7 | JMA feed hand-waved / false-negative (High) | Phase 0 spike + Task 5.1 (real endpoint, fail-loud) |
| 8 | Hand-rolled PIP on safety geometry (High) | Constraint 1 (bundle turf PIP) + Task 4.1 tests |
| 9 | GPS error → confident wrong shelter (High) | Task 3.2 (accuracy gating + accuracy circle) |
| 10 | SW unbounded cache + activate wipes hazard cache (High) | Phase 6 (rewrite activate to preserve caches; persist; integrity check) |
| — | Tile requests leak location (privacy) | Constraint 5 + Phase 1 (same-origin PMTiles) |
| — | `--meriken-amber` doesn't flip day-mode (contrast) | Task 7.2 (add day-mode token overrides) |
| — | "Reuse existing pulse" — doesn't exist | Task 3.1 (build the pulse; don't claim reuse) |
| — | role="application" + double-bound arrow keys | Task 7.3 (no app-role trap; disjoint key bindings) |
| — | No liability disclaimer | Task 3.3 (persistent disclaimer) |
| — | Simplification under-warns (boundary erosion) | Task 2.2 (simplify toward the *hazard* side; buffer outward) |

---

## PHASE 0: De-risk before building (spike — do this FIRST)

The three v1-fatal unknowns get validated here. **If a spike fails, the dependent phase is re-scoped or cut before any code is built on it.** Timebox: ~2 days.

### Task 0.1: PMTiles offline-basemap spike
- [ ] Build a Kobe/Kansai-bbox `.pmtiles` from OSM (ODbL) or GSI vector data using `pmtiles`/`tippecanoe` (build-time tooling). Confirm: file size for z0–14 over `[34.5,134.8]–[35.1,135.8]` (**target < 8 MB**), renders in Leaflet via `pmtiles` + a vector/raster adapter, and loads from a same-origin `public/tiles/` path offline.
- [ ] **Decision gate:** if size > ~15 MB or rendering is unworkable, fall back to *cache-on-view raster GSI tiles with attribution* (online-only map, offline = shelter **list** only) and update the offline claims.

### Task 0.2: JMA alert endpoint spike
- [ ] Identify the concrete JMA `bosai` JSON endpoint(s) for earthquake/tsunami/warning data. From a browser context, verify CORS (response `Access-Control-Allow-Origin`) and the actual JSON schema. Capture a real sample → `src/hazard-map/__tests__/fixtures/jma-*.json`.
- [ ] **Decision gate:** CORS-OK → direct fetch (Task 5.1). CORS-blocked → spec a minimal Cloudflare Worker proxy (you already use Cloudflare) that adds CORS + caches 60s; this is the only "server," scoped and documented. If neither is viable → **cut live alerts**, ship the fail-loud "check NHK/Yahoo" link only.

### Task 0.3: Hazard-data licensing + size spike
- [ ] Confirm 国土数値情報 (MLIT) flood/tsunami/landslide and J-SHIS earthquake datasets for Hyogo/Osaka/Kyoto are redistributable under 政府標準利用規約 (≈CC-BY) with attribution. Download one prefecture's flood polygons, simplify with `mapshaper`, measure: **does Hyogo+Osaka+Kyoto fit < 2.5 MB after simplification at a safety-preserving tolerance?**
- [ ] **Decision gate:** if not, reduce scope to **Kobe city + immediate adjacency** (not 3 prefectures) for v1, or split per-prefecture lazy-loaded files. Record the real attribution strings.

- [ ] **Commit** the spike findings: `docs/superpowers/specs/2026-06-20-hazard-map-spike-results.md` (`docs: hazard map de-risking spike results`).

---

## PHASE 1: Self-hosted offline basemap (PMTiles)

- [ ] **1.1** Add `pmtiles` as a bundled dependency; `scripts/build-basemap.mjs` generates `public/tiles/kobe.pmtiles` (reproducible, documented; the raw archive may be git-LFS or build-artifact, not necessarily committed). Attribution string baked into the map UI (OSM ODbL / GSI 出典：国土地理院 as applicable).
- [ ] **1.2** `src/hazard-map/map-renderer.ts`: lazy-load Leaflet (extract `loadLeaflet` from `shelter-finder.ts:66-83`) + init map against the PMTiles source, GSI raster as the *online-only* fallback if PMTiles fails. `declare const L: any` is replaced with a **minimal typed shim** in `types.ts` for the calls actually used (map, tileLayer, geoJSON, circleMarker, marker, divIcon) — no `any` on the new subsystem.
- [ ] **1.3** Tests (mock the renderer) + manual: map renders offline from `public/tiles/`. **Commit** `feat(hazard-map): self-hosted PMTiles offline basemap with attribution`.

---

## PHASE 2: Real hazard data pipeline (first, not last)

- [ ] **2.1** `scripts/build-hazard-data.mjs`: fetch → clip to bbox → simplify (`mapshaper`, build-time) → write `public/data/{flood,tsunami,landslide,earthquake-prob}.geojson`, each Feature stamped with `properties.source` and `properties.asOf` (dataset date). No `sample` data path exists.
- [ ] **2.2** Simplify **toward the hazard** (buffer polygons slightly outward / keep the conservative boundary) so simplification never *shrinks* a danger zone — under-warning is the failure mode to avoid. Document the tolerance + buffer.
- [ ] **2.3** `scripts/shelters-to-geojson.mjs`: expand `src/shelter-data.ts` (56) toward Kobe-city open data + OSM assembly points, **including `elevation`** (from a DEM lookup) — elevation is load-bearing for tsunami safety. Emit `public/data/shelters.geojson`. **Commit** `feat(hazard-map): real MLIT/J-SHIS hazard data + shelters with elevation`.

---

## PHASE 3: Location + shelter layer (safety-correct)

### Task 3.1: Foundations (types, flag, evacuation, geolocation, shelter layer)
- [ ] Extract `evacuation.ts` (haversine/bearing/walk-time from `shelter-finder.ts:26-44`) + tests; `geolocation.ts` (from `:85-122`) + tests; `types.ts` (incl. `elevation`, flag default OFF). Re-point `shelter-finder.ts` at the extracted modules (keep it working). Build the user-dot **pulse** as new CSS (it does not exist today — `shelter-finder.ts:143` is static); gate behind `prefers-reduced-motion`.

### Task 3.2: GPS-accuracy gating
- [ ] Inspect `pos.coords.accuracy`. Render an **accuracy circle**. If accuracy > ~150 m (typical indoors): do **not** commit to a single "nearest"; show the candidate cluster + "move to a window / open area for a better fix," and surface the **manual area-selector as a first-class option** (not just the geolocation-failure fallback). Tests for the threshold branches.

### Task 3.3: Elevation-aware, hazard-aware shelter selection + disclaimer
- [ ] `shelter-layer.ts`: default `findNearest` by distance, **but** during an active tsunami/flood context, rank by `(elevation desc, distance asc)` = "nearest *safe* shelter," and **exclude** any shelter whose straight line crosses a rendered tsunami/flood polygon (segment-vs-polygon test). Green `var(--safe-green)` circle markers; selected = `var(--meriken-amber)` ring; trilingual popup (name JA + EN/ID, distance, walk time, capacity, phone, elevation, heading).
- [ ] **Persistent disclaimer** on the map: "Direction is straight-line. Do not cross rivers, flooded roads, or move toward the sea. Follow official signs and 119." (trilingual). Tests: nearest-N sorted; tsunami mode prefers higher elevation; path-crossing exclusion fires. **Commit** `feat(hazard-map): elevation- and hazard-aware shelter selection + disclaimer`.

---

## PHASE 4: Hazard zone layers (correct geometry)

### Task 4.1: Tested point-in-polygon + zone layers
- [ ] Bundle `@turf/boolean-point-in-polygon`. `hazard-layers.ts`: `createHazardLayer(map, kind, geojson)` (themed token fills + SVG pattern via a custom `L.GeoJSON` renderer/`divIcon` where needed), `toggleLayer`, `userInZone(lat,lng,kind)` using turf. Info panel on feature click (kind, level, **`asOf` date**, source/attribution, localized "what to do").
- [ ] Tests — **exhaustive** PIP: inside, outside, on-edge, MultiPolygon, polygon-with-hole (water exclusions), winding-order. Toggle round-trip. Info-panel payload localized + date-stamped. **Commit** `feat(hazard-map): hazard zone layers with tested PIP, date-stamped info panel`.

### Task 4.2: Educational mode
- [ ] Regional view (zoom 11, Kobe). Layer toggles reuse `.tab-btn` look as `<button aria-pressed>`. "Find my location" reuses Phase 3 (accuracy-gated). Highlights any zone the user is in via turf. **Commit** `feat(hazard-map): educational mode with toggles + info panel`.

---

## PHASE 5: Alerts that fail loud

### Task 5.1: Alert feed (per Phase 0.2 outcome)
- [ ] `alert-feed.ts`: fetch the validated JMA endpoint (or Worker proxy) **only while the emergency map is open + online**; parse → `Alert[]`; cache `localStorage['mamoru-alerts-cache']` + timestamp. **Fail-loud**: any fetch/parse failure → state "Couldn't check alerts" (never "No alerts") and surface a link to NHK World / Yahoo 防災速報. Distinguish three states explicitly: *active alert* / *checked, none active* / *couldn't check*.
- [ ] Tests against the real captured fixture (Phase 0.2): parse kinds/severity/area; cache round-trip; failure → "couldn't check" state, not safe-looking silence. **Commit** `feat(hazard-map): fail-loud JMA alert feed`.

### Task 5.2: Emergency banner + flag default-on prep
- [ ] Banner: full-width `var(--alert-red)`, **legible system font** (not Press Start 2P), `role="alert"` + `aria-live="assertive"`. **Emergency-severity alerts are sticky/collapsible, not dismiss-to-gone** (a mis-tap must not erase a tsunami warning). Slide-in disabled under reduced-motion. Poll only while the emergency map is visible; stop on close. **Commit** `feat(hazard-map): sticky legible emergency alert banner`.

---

## PHASE 6: Offline service worker (correct caching)

- [ ] **6.1** Rewrite `public/sw.js`: bump `CACHE_NAME` to `mamoru-guide-v10`; add `mamoru-hazard-data-v1` (GeoJSON) and `mamoru-basemap-v1` (PMTiles). **Rewrite `activate`** so it deletes only stale `mamoru-guide-v*` caches and **preserves** the hazard/basemap caches across version bumps (the current `activate` at `sw.js:20-33` would delete them — the v1 plan's "don't delete" instruction was unimplementable without this rewrite).
- [ ] **6.2** Request `navigator.storage.persist()`. Pre-cache GeoJSON + PMTiles on install with a streamed **download-progress UI**. Startup **integrity check**: if a critical cache entry is missing, re-fetch. No unbounded raster tile cache (PMTiles is one file). Manual: airplane-mode after first visit renders map + shelters + zones. **Commit** `feat(hazard-map): offline SW preserving isolated caches + persist + integrity check`.

---

## PHASE 7: Design integration & accessibility (done right)

### Task 7.1: Legible critical path
- [ ] Press Start 2P **only** on decorative `.section-label` ("08 — HAZARD MAP") and non-critical chips. **All** emergency/critical strings (banner, danger-zone message, distances, disclaimer) use the legible system UI font at large weight. Map labels sit on **opaque high-contrast pills** (spec §431) — implemented, not just asserted. **No `hue-rotate`** on tiles; optional brightness-only night tweak that preserves label contrast.

### Task 7.2: Tokens that actually theme
- [ ] Map every colour to `css/variables.css` tokens. **Add the missing day-mode overrides** (e.g. `--meriken-amber` has no day-mode value → a `#f5a623` risk marker fails 3:1 on the light map; add a darker day-mode risk token). User dot = `var(--portopia-blue)` consistently (kill the stray raw `#4cc9f0`). User marker is a **triangle** `divIcon`, shelters are **circles** — consistent shapes for colour-blind users. Verify AA non-text contrast for every marker/overlay in **both** themes against representative tiles.

### Task 7.3: Accessibility without the traps
- [ ] **Do not** put `role="application"` on the map (it traps screen-reader users); use a labelled region + an accessible **list view** as the primary SR path (the shelter drawer is the real a11y affordance, not the canvas). Map-pan keys and list-navigation keys must be **disjoint** (no double-bound arrows). Banner `aria-live`; info panels focusable + Escape; live-region announces toggle + online/offline. **Commit** `feat(hazard-map): legible, correctly-themed, accessible map UI`.

---

## PHASE 8: i18n, integration tests, rollout

- [ ] **8.1** i18n sweep (spec §i18n table) incl. `name_id`, "couldn't check alerts," disclaimer, `asOf` labels. Language-switch manual pass.
- [ ] **8.2** Integration tests that exercise **real** geometry/state (not just "L.x was called"): turf PIP against real fixtures, elevation/hazard shelter selection, alert state machine (3 states), offline cache path. Keep Leaflet-render mocking only where unavoidable; assert behavior, not call counts.
- [ ] **8.3** Flip `hazardMapEnabled()` default to ON; re-point `em-card-shelter` + `#main.ts` import; keep the old finder reachable via `=false` for one release. Full verification checklist (below). **Commit** `feat(hazard-map): enable hazard map by default after data + offline land`.
- [ ] **8.4** (Approval-gated) remove `shelter-finder.ts` + `shelter-data.ts` + `css/shelter-finder.css` after stable. Do not run without explicit sign-off.

---

## Verification checklist

- [ ] `npm test` + `npm run build` green; `tsc --noEmit` clean; new subsystem has a typed Leaflet shim (no `any`).
- [ ] Only `pmtiles` + `@turf/boolean-point-in-polygon` added, bundled (not CDN); Leaflet still CDN-lazy.
- [ ] **No placeholder data** in `public/data/`; every zone Feature carries `source` + `asOf`, shown on the map.
- [ ] Base map is same-origin PMTiles offline; **no third-party bulk tile fetch**; attribution displayed (OSM ODbL / 出典：国土地理院).
- [ ] Tsunami context selects **higher-elevation** shelters and excludes paths crossing flood/tsunami polygons; persistent straight-line disclaimer present.
- [ ] GPS accuracy gating: accuracy circle shown; > 150 m shows cluster + manual selector, not a confident single pick.
- [ ] Alerts have three distinct, tested states; failure shows **"couldn't check → NHK/Yahoo,"** never "No alerts"; emergency alerts are sticky, not dismiss-to-gone.
- [ ] SW preserves `mamoru-hazard-data-v1` + `mamoru-basemap-v1` across a `CACHE_NAME` bump; `storage.persist()` requested; integrity re-fetch works; offline smoke passes.
- [ ] No Press Start 2P on any critical string; no `hue-rotate` on tiles; label pills opaque; all markers/overlays pass AA non-text contrast in **both** themes; risk markers legible in day mode.
- [ ] No `role="application"` trap; map-pan vs list-nav keys disjoint; list view is the primary SR path; colour-blind-safe shapes + patterns.
- [ ] **Mobile-first, verified on a real device/emulator at 320 / 375 / 414 px:** no horizontal overflow; map fills the viewport with the bottom drawer reachable one-handed; all controls ≥ 44×44 px; layer-toggle row wraps (never scrolls off-screen); alert banner + disclaimer legible without zoom; pinch-zoom on the map does not zoom the page chrome (`touch-action` scoped). This is a release gate, not a nicety — a disaster app is used on a phone.
- [ ] Privacy: only the region-wide alert fetch leaves the device (no location); all map `localStorage` keys are `mamoru-*`; documented honestly in-app.
- [ ] Flag `=false` cleanly reverts to the old finder; no regression vs. today's nearest-shelter result.

---

## Honest risk register (post-critique)

| Risk | Likelihood | Mitigation |
|---|---|---|
| JMA endpoint CORS-blocked | Medium | Phase 0.2 gate → Worker proxy or cut live alerts (fail-loud link remains) |
| Real hazard data > 2.5 MB after safe simplification | Medium | Phase 0.3 gate → narrow to Kobe-city + adjacency, or lazy per-prefecture |
| PMTiles basemap too large / render issues | Low–Med | Phase 0.1 gate → cache-on-view GSI raster (online map, offline = list) |
| turf PIP edge cases on real MultiPolygons | Low | Exhaustive Task 4.1 tests (holes, multipolygon, on-edge, winding) |
| Elevation data gaps for shelters | Medium | DEM lookup in Task 2.3; missing elevation → fall back to distance + explicit "elevation unknown" |
| Simplification still under-warns at boundaries | Low | Task 2.2 outward buffer; never shrink a hazard polygon |
| Scope creep past 3–4 weeks | Medium | Phase-gated; educational mode + alerts are independently cuttable without touching the shelter core |
