# Hazard Map & Emergency Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Source design spec:** `docs/superpowers/specs/2026-06-20-hazard-map-design.md`
**Evaluation reference:** `docs/superpowers/specs/2026-06-20-full-app-evaluation.md` (item 26: "Offline shelter map")
**Commit convention:** `feat:` / `fix:` / `chore:` / `docs:` prefix, no Claude trailer (per CLAUDE.md)
**Test runner:** `npx vitest run` (or `npm test`)
**Build check:** `npm run build` (runs `tsc --noEmit && vite build`)

---

## Guiding constraints (read first)

These are hard rules pulled from CLAUDE.md, the design spec, and the existing codebase. Every task must respect them:

1. **Zero new runtime dependencies.** Leaflet stays CDN-loaded and lazy (see `src/shelter-finder.ts:66-83` `loadLeaflet()`). `package.json` `dependencies` stays empty.
2. **Privacy.** GPS coordinates never leave the device. All `localStorage` keys use the `mamoru-*` prefix (existing example: `mamoru-shelter-last-location`). No location in network requests, URLs, or `console.log`.
3. **Trilingual.** Every user-facing string is EN/JA/ID, via the existing `data-lang="en|ja|id"` span pattern + `getLangText(en, ja, id)` helper (see `src/shelter-finder.ts:15-19`).
4. **Reuse, don't rewrite.** The current shelter finder already implements haversine distance, nearest-N, geolocation with TTL caching, and a manual area-selector fallback. Extract and reuse this logic — do not reimplement it.
5. **Additive + reversible.** Ship behind a feature flag (`mamoru-hazard-map-enabled`). Keep `src/shelter-finder.ts` + `src/shelter-data.ts` working until the hazard map is stable (spec §Risk & Rollback).
6. **Data realism.** Real MLIT/J-SHIS/JMA GeoJSON must be sourced and simplified (Phase 6). Until then, Phases 2–3 use small committed **sample** GeoJSON so the feature is buildable and testable without blocking on data acquisition.

---

## Current-state inventory (what already exists)

| Capability | Where it lives today | Plan disposition |
|---|---|---|
| Haversine distance | `src/shelter-finder.ts:26-34` | Extract → `hazard-map/evacuation.ts` |
| Nearest-N + walk time (4 km/h) | `src/shelter-finder.ts:36-44` | Extract → `evacuation.ts` / `shelter-layer.ts` |
| Geolocation + `mamoru-shelter-last-location` TTL cache | `src/shelter-finder.ts:85-122` | Extract → `hazard-map/geolocation.ts` |
| Manual area-selector fallback (8 Kansai cities) | `src/shelter-finder.ts:206-256` | Preserve in emergency-mode flow |
| Lazy Leaflet (CDN, CSS+JS) | `src/shelter-finder.ts:66-83` | Extract → `hazard-map/map-renderer.ts` |
| 56 shelters, `Shelter` interface | `src/shelter-data.ts` | Migrate → `public/data/shelters.geojson` (+ keep TS as fallback) |
| Service worker, cache-first | `public/sw.js` (`mamoru-guide-v9`) | Add hazard-data precache + tile caching |
| `#shelter` section | `index.html:905-931` | Becomes the educational map mount |
| `em-card-shelter` → `#/shelter` | `index.html:508-512` | Re-point to emergency map view |
| Routes (`#/shelter`, `#/emergency`) | `src/router.ts:6-15` | Reuse; map mounts inside existing sections |
| Dynamic init of shelter finder | `src/main.ts` `import('./shelter-finder')` | Swap to `import('./hazard-map/hazard-map')` behind flag |

---

## Module architecture (target)

```
src/hazard-map/
├── hazard-map.ts        # entry: initHazardMap(); reads feature flag, picks mode, wires events
├── map-renderer.ts      # Leaflet lazy-load + L.map/tileLayer/markers/user-dot (from shelter-finder)
├── shelter-layer.ts     # shelter markers, popups, nearest-N selection + rendering
├── hazard-layers.ts     # GeoJSON layer create/toggle/style + info-panel on click
├── alert-feed.ts        # JMA fetch/parse/cache (mamoru-alerts-cache), offline staleness
├── evacuation.ts        # haversine, bearing, estimateWalkTime (pure, fully unit-tested)
├── geolocation.ts       # getUserLocation, readCachedLocation/writeCachedLocation (TTL)
├── hazard-data.ts       # load GeoJSON from SW cache or network; shelter GeoJSON parse
└── types.ts             # HazardShelter, HazardZone, Alert, Mode, minimal Leaflet shims
src/hazard-map/__tests__/ # evacuation, shelter-layer, hazard-layers, alert-feed, geolocation, hazard-data

css/hazard-map.css       # map shell, layer toggles, alert banner, info panel, bottom drawer
public/data/             # shelters.geojson + (sample then real) hazard zone GeoJSON
```

`L` is typed with `declare const L: any` (matching `src/shelter-finder.ts:10`). No `@types/leaflet`.

---

## Design integration with the Mamoru Guide style

The map must read as **part of Mamoru Guide**, not a bolted-on Leaflet widget. It inherits the existing Kobe-harbor arcade aesthetic: harbor-navy surfaces, persimmon/amber accent, pixel typography for labels, amber-bordered glass cards, and full day/night theming. **This is a cross-cutting requirement for every CSS task below — `css/hazard-map.css` uses the design tokens from `css/variables.css`, never raw hex.**

### Token mapping (supersedes the design spec's raw hex)

The design spec listed standalone colours; map them onto existing `css/variables.css` tokens so day/night theming and brand consistency come for free:

| Spec element | Spec hex | Use this token instead |
|---|---|---|
| Map shell / panels bg | — | `var(--card-bg)` + `1px solid var(--card-border)` |
| Section/banner text | — | `var(--text)` / `var(--text-muted)` |
| Safe shelter marker | `#2a9d8f` | `var(--safe-green)` (`#4ecb71`) |
| User location dot | `#4cc9f0` | `var(--portopia-blue)` |
| Danger zone (user inside) | `#e63946` | `var(--alert-red)` |
| Nearby risk zone | `#f4a261` | `var(--meriken-amber)` |
| Water / tsunami / flood fill | `#457b9d` | `var(--water-dark)` / `var(--water-shimmer)` |
| Alert banner bg | `#d62828` | `var(--alert-red)` (pixel font, see below) |
| Focus ring | — | `var(--focus-ring)` |

Add only **new** tokens that don't exist yet (e.g. `--hazard-landslide`, `--earthquake-prob-low/high`) to `css/variables.css` under **both** `:root` and `body.day-mode`, following the existing two-block pattern (`variables.css:1-44` night, `:46-82` day). Never hard-code a colour that won't flip with the theme.

### Visual language to match

- **Section framing.** The educational map keeps the existing arcade section chrome: the `08 — SHELTER FINDER`-style `.section-label`, the trilingual `.section-title`, and the privacy hint already in `index.html:905-931`. Rename to a hazard-map label but keep the format (`08 — HAZARD MAP`).
- **Pixel typography.** Use `'Press Start 2P'` (already loaded) for the alert-banner headline, the layer-toggle panel header, and stat chips — matching the arcade headings. Body text (popups, info panel) stays in the normal UI font for readability.
- **Glass cards.** Shelter popups, the bottom drawer, and the info panel use `background: var(--card-bg)` + `border: 1px solid var(--card-border)` + rounded corners, identical to existing `.shelter-card` / `.mode-card` styling — so they sit naturally next to the rest of the app.
- **Toggle chips.** Layer toggles reuse the `.tab-btn` look (amber underline/active state) from the vocab tab bar, as `<button aria-pressed>` — consistent with how the app already does tabs.
- **Stat chips.** The nearest/avg-walk readout reuses the existing `.shelter-stat-chip` component (`shelter-finder.ts:163-182`) verbatim — do not invent a new one.

### Themed map tiles (day/night parity)

Leaflet tiles are raster, so theme them with a CSS filter on the tile pane rather than swapping tile servers:

```css
/* night: tint GSI/OSM tiles toward harbor-navy to match the dark UI */
body:not(.day-mode) .hazard-map .leaflet-tile-pane {
  filter: brightness(0.78) saturate(0.85) hue-rotate(8deg);
}
/* day mode: leave tiles natural (matches the light harbor sky) */
@media (prefers-reduced-motion: reduce) { /* filter is static; no motion concern */ }
```

GSI std tiles stay the primary source (cleaner cartography that tints well); OSM is the fallback (Task 0.4). Tune the filter values during Task 1.3 so the map doesn't fight the harbor-navy background.

### Marker & overlay styling

- **User dot:** `var(--portopia-blue)` circle with a soft pulsing ring — reuse the existing pulse treatment from the current shelter finder's user marker; gate the pulse behind `prefers-reduced-motion` (static dot when reduced).
- **Shelter markers:** `var(--safe-green)` `L.circleMarker` with a white stroke (distinct **circle** shape per a11y); selected marker gets a `var(--meriken-amber)` ring.
- **Hazard polygons:** themed fill at ~0.35 opacity + a 2px stroke + an SVG **pattern** (diagonal lines for flood/tsunami, dots for landslide, cross-hatch for earthquake-prob) so they're distinguishable without colour and don't drown the tiles.
- **Alert banner:** full-width, `var(--alert-red)` bg, `'Press Start 2P'` headline, sliding in from the top (slide disabled under reduced-motion), matching the urgency styling of the existing emergency FAB / `.mode-card.urgent`.

### Day/night wiring

Because every colour is a token and tiles are filtered by a `body.day-mode` selector, the map flips automatically with the existing `toggleDayNight()` (`src/theme.ts`) — **no map-specific theme code required.** Manual smoke must confirm parity in both themes (verification checklist already covers this).

> **Plan-wide effect:** wherever a task below cites a spec hex (Tasks 1.3, 2.2, 3.2), substitute the mapped token from the table above. The CSS-bearing tasks (1.3, 2.3, 3.2, 4.2, 5.2) each carry an implicit acceptance criterion: *renders correctly in both day and night themes using `variables.css` tokens, with arcade-consistent framing.*

---

## PHASE 0: Scaffolding & shared extraction

Lay the foundation without changing user-visible behavior. The old shelter finder keeps working throughout this phase.

---

### Task 0.1: Create types and the feature flag

**Files:**
- Create: `src/hazard-map/types.ts`

- [ ] **Step 1: Define shared interfaces**

```ts
// src/hazard-map/types.ts
export type ShelterType = 'earthquake' | 'flood' | 'tsunami' | 'fire' | 'landslide';
export type HazardKind = 'flood' | 'tsunami' | 'landslide' | 'earthquake';
export type MapMode = 'emergency' | 'educational';

export interface HazardShelter {
  name: string;
  name_en?: string;
  name_id?: string;
  lat: number;
  lng: number;
  address: string;
  types: ShelterType[];
  capacity?: number;
  phone?: string;
  elevation?: number;
}

export interface ShelterWithDistance extends HazardShelter {
  distance: number;   // km
  walkMinutes: number;
  bearing: number;    // degrees, 0 = N
}

export interface Alert {
  kind: 'earthquake' | 'tsunami' | 'typhoon';
  severity: 'advisory' | 'warning' | 'emergency';
  area: string;
  headline_en: string;
  headline_ja: string;
  headline_id: string;
  issuedAt: number;   // epoch ms
}

// GeoJSON FeatureCollection<Polygon|MultiPolygon> with hazard props in feature.properties
export interface HazardZoneProps {
  kind: HazardKind;
  level?: number;       // depth(m) for flood/tsunami, probability(%) for earthquake
  source: string;       // e.g. "MLIT 国土数値情報"
}

export const HAZARD_FLAG_KEY = 'mamoru-hazard-map-enabled';
export function hazardMapEnabled(): boolean {
  // default ON during rollout; set to 'false' to fall back to old shelter finder
  return localStorage.getItem(HAZARD_FLAG_KEY) !== 'false';
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hazard-map/types.ts
git commit -m "feat(hazard-map): add shared types and feature flag"
```

---

### Task 0.2: Extract evacuation math into a pure, tested module

**Why:** Distance/bearing/walk-time are pure functions — extract from `shelter-finder.ts` so both the old finder and the new map share one tested implementation.

**Files:**
- Create: `src/hazard-map/evacuation.ts`
- Create: `src/hazard-map/__tests__/evacuation.test.ts`

- [ ] **Step 1: Write the module** (reuse `shelter-finder.ts:26-34`, add bearing)

```ts
// src/hazard-map/evacuation.ts
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// 4 km/h walking speed (matches existing shelter-finder.ts:40)
export function estimateWalkTime(km: number): number {
  return Math.ceil(km / (4 / 60));
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}
```

- [ ] **Step 2: Write tests** — assert known pairs (e.g. Sannomiya 34.6901,135.1956 → a nearby shelter), bearing cardinal directions (N≈0, E≈90), walk time uses 4 km/h, `formatDistance` switches at 1 km.

- [ ] **Step 3: Point the old finder at the shared module** — in `src/shelter-finder.ts`, delete the local `haversineDistance`/`formatDistance` and import from `./hazard-map/evacuation`. Confirm existing shelter behavior unchanged.

- [ ] **Step 4: Run tests + commit**

```bash
npm test
git add src/hazard-map/evacuation.ts src/hazard-map/__tests__/evacuation.test.ts src/shelter-finder.ts
git commit -m "feat(hazard-map): extract evacuation math (haversine, bearing, walk-time) with tests"
```

---

### Task 0.3: Extract geolocation + location cache

**Files:**
- Create: `src/hazard-map/geolocation.ts`
- Create: `src/hazard-map/__tests__/geolocation.test.ts`

- [ ] **Step 1: Move `getUserLocation`, `readCachedLocation`, `writeCachedLocation`** from `shelter-finder.ts:85-122` into `geolocation.ts`. Keep the key `mamoru-shelter-last-location` and 1-hour TTL so the existing cache still works.
- [ ] **Step 2: Tests** — expired cache returns `null`; fresh cache returns coords; `writeCachedLocation` uses the `mamoru-*` key; missing `navigator.geolocation` rejects.
- [ ] **Step 3: Re-import in `shelter-finder.ts`; verify no behavior change.**
- [ ] **Step 4: Run tests + commit** (`feat(hazard-map): extract geolocation + TTL location cache with tests`)

---

### Task 0.4: Extract the lazy Leaflet loader → map-renderer skeleton

**Files:**
- Create: `src/hazard-map/map-renderer.ts`

- [ ] **Step 1:** Move `loadLeaflet()` (`shelter-finder.ts:66-83`) into `map-renderer.ts` and export it. Add a thin `createMap(elId, center, zoom)` that returns an `L.map` with the GSI primary tile layer and OSM fallback:

```ts
// GSI primary (spec §Data Sources #6), OSM fallback
const GSI = 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png';
const OSM = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
```

- [ ] **Step 2: Re-import `loadLeaflet` in `shelter-finder.ts`; verify unchanged.**
- [ ] **Step 3: Commit** (`feat(hazard-map): extract lazy Leaflet loader + map factory`)

> Dependency note: Tasks 0.2–0.4 each leave `shelter-finder.ts` working by re-importing the extracted code. They are sequential (each edits `shelter-finder.ts`) but small.

---

## PHASE 1: Map renderer + shelter layer (replaces the finder behind the flag)

Goal: a working shelter map served by `src/hazard-map/`, gated by the feature flag, with the old finder as fallback. No hazard layers yet.

---

### Task 1.1: Migrate shelter data to GeoJSON + loader

**Files:**
- Create: `public/data/shelters.geojson` (converted from the 56 entries in `src/shelter-data.ts`)
- Create: `scripts/shelters-to-geojson.mjs` (one-shot converter, committed for reproducibility)
- Create: `src/hazard-map/hazard-data.ts`
- Create: `src/hazard-map/__tests__/hazard-data.test.ts`

- [ ] **Step 1: Write `scripts/shelters-to-geojson.mjs`** that imports the existing `shelters` array and emits a `FeatureCollection` of `Point` features whose `properties` match `HazardShelter`. Run it to produce `public/data/shelters.geojson`. (Keeps `src/shelter-data.ts` as the source of truth + offline fallback for v1.)
- [ ] **Step 2: Write `hazard-data.ts`** — `loadShelters()` and generic `loadHazardGeoJSON(kind)` that `fetch()` the files (SW serves them from cache when offline) and fall back to the bundled TS shelters if the fetch fails.
- [ ] **Step 3: Tests** — parse a fixture FeatureCollection → `HazardShelter[]`; fetch-failure falls back to bundled shelters; malformed feature is skipped not thrown.
- [ ] **Step 4: Run tests + commit** (`feat(hazard-map): migrate shelters to GeoJSON + data loader with fallback`)

---

### Task 1.2: Shelter layer (markers, popups, nearest-N)

**Files:**
- Create: `src/hazard-map/shelter-layer.ts`
- Create: `src/hazard-map/__tests__/shelter-layer.test.ts`

- [ ] **Step 1:** `findNearest(shelters, lat, lng, n)` → `ShelterWithDistance[]` (reuse `evacuation.ts`); `addShelterMarkers(map, shelters)` using `L.circleMarker` green `#2a9d8f`; `shelterPopupHtml(s)` trilingual with name (JA + EN/ID), distance, walk time, capacity, phone, heading arrow (spec §Shelter detail popup). Each marker gets `aria-label` with name/distance/time.
- [ ] **Step 2: Tests (mock `L`)** — `findNearest` returns exactly N sorted ascending; popup HTML contains name + distance + walk time; `L.circleMarker` called once per shelter.
- [ ] **Step 3: Run tests + commit** (`feat(hazard-map): shelter layer with nearest-N, markers, trilingual popups`)

---

### Task 1.3: hazard-map entry + emergency map flow

**Files:**
- Create: `src/hazard-map/hazard-map.ts`
- Create: `css/hazard-map.css`
- Modify: `index.html` (`#shelter` section body, `css/hazard-map.css` link, `em-card-shelter`)
- Modify: `src/main.ts` (swap dynamic import behind flag)

- [ ] **Step 1: Write `initHazardMap()`** — read `hazardMapEnabled()`. If `false`, dynamically import and run the legacy `initShelterFinder()` and return. Otherwise mount the map shell into `#shelterContainer`, wire the existing `#shelterFindBtn` and cached-location hint to: get location (`geolocation.ts`) → load shelters (`hazard-data.ts`) → render map (`map-renderer.ts`) + shelter layer (`shelter-layer.ts`) + bottom drawer list + stats bar. On geolocation failure, show the existing 8-city manual fallback (port `showManualFallback` behavior). Pulsing user dot `#4cc9f0` (reduced-motion → static).
- [ ] **Step 2: Write `css/hazard-map.css`** — full-height map container, bottom drawer (swipe-up), user dot pulse keyframe with `@media (prefers-reduced-motion: reduce)` override, 44×44px touch targets, day/night overlay opacity.
- [ ] **Step 3: `index.html`** — add `<link rel="stylesheet" href="css/hazard-map.css">` after the shelter-finder CSS link; leave `#shelterContainer` as the mount; point `em-card-shelter` (line 508) at the emergency map (`href="#/shelter"` is fine — the map auto-centers and shows nearest-5).
- [ ] **Step 4: `src/main.ts`** — replace `import('./shelter-finder').then(m => m.initShelterFinder())` with `import('./hazard-map/hazard-map').then(m => m.initHazardMap())`.
- [ ] **Step 5: Run tests + build; manual smoke** — Sannomiya test location shows nearest-5; flag `false` reverts to old finder.
- [ ] **Step 6: Commit** (`feat(hazard-map): emergency map flow replaces shelter finder behind flag`)

**Phase 1 exit:** Map at `#/shelter` shows user + nearest-5 shelters with directions; old finder reachable via flag; build + tests green.

---

## PHASE 2: Hazard zone layers + educational mode

Adds toggleable flood/tsunami/landslide/earthquake layers. Uses **sample** GeoJSON committed now; real data lands in Phase 6.

---

### Task 2.1: Sample hazard GeoJSON

**Files:**
- Create: `public/data/flood-zones.geojson`, `tsunami-zones.geojson`, `landslide-zones.geojson`, `earthquake-prob.geojson` (small hand-authored polygons around Kobe, each `properties` = `HazardZoneProps`)

- [ ] **Step 1:** Author 3–6 representative polygons per file near known Kobe areas. Keep each file < 30 KB. Mark clearly with a `properties.sample: true` flag and a comment-style `name` so they are obviously placeholder until Phase 6.
- [ ] **Step 2: Commit** (`feat(hazard-map): add sample hazard-zone GeoJSON (placeholder for Phase 6 real data)`)

---

### Task 2.2: Hazard layers module (create / toggle / style / info panel)

**Files:**
- Create: `src/hazard-map/hazard-layers.ts`
- Create: `src/hazard-map/__tests__/hazard-layers.test.ts`

- [ ] **Step 1:** `createHazardLayer(map, kind, geojson)` via `L.geoJSON` with per-kind fill (water/tsunami `#457b9d`, danger `#e63946`, nearby `#f4a261`) **plus pattern fills** (diagonal lines/dots) for colour-blind accessibility (spec §Accessibility). `toggleLayer(kind, on)` adds/removes from the map. On feature click, emit info-panel data (kind, level, source, localized "what to do"). `userInZone(lat, lng, geojson)` point-in-polygon for the "you are in a {type} zone" warning.
- [ ] **Step 2: Tests** — GeoJSON → valid layer config; toggle on/off/on round-trips; point-in-polygon true inside / false outside; info-panel payload has localized action text.
- [ ] **Step 3: Run tests + commit** (`feat(hazard-map): hazard zone layers with toggle, styling, info panel`)

---

### Task 2.3: Educational mode UI

**Files:**
- Modify: `src/hazard-map/hazard-map.ts` (educational branch), `css/hazard-map.css`, `index.html` (#shelter header → layer-toggle panel)

- [ ] **Step 1:** Regional default view (zoom 11, Kobe centre). Layer-toggle panel: Shelters (always on) + 4 hazard toggles as `<button aria-pressed>`. Tapping a zone opens the info panel below the map. "Find my location" reuses the Phase 1 flow and highlights any zone the user is in.
- [ ] **Step 2: Run tests + build; manual smoke** — each layer toggles cleanly; info panel shows correct localized content.
- [ ] **Step 3: Commit** (`feat(hazard-map): educational mode with layer toggles and info panel`)

---

## PHASE 3: JMA alert feed + emergency-mode integration

---

### Task 3.1: Alert feed (fetch / parse / cache / offline)

**Files:**
- Create: `src/hazard-map/alert-feed.ts`
- Create: `src/hazard-map/__tests__/alert-feed.test.ts`

- [ ] **Step 1:** `fetchAlerts()` polls a JMA public feed (60 s) **only while the map is open and online**, parses to `Alert[]`, caches last result in `localStorage['mamoru-alerts-cache']` with timestamp. `readCachedAlerts()` returns `{ alerts, ageMinutes, stale }` (stale > 5 min). No location data is sent; the full feed is parsed client-side (spec §Data Sources #5). Parser isolated here so a JMA format change only touches this file.
- [ ] **Step 2: Tests** — parse a fixture feed → `Alert[]` with kind/severity/area; cache write/read round-trip; stale cache flagged; fetch failure returns cached with `stale: true`.
- [ ] **Step 3: Run tests + commit** (`feat(hazard-map): JMA alert feed with parse, cache, offline staleness`)

---

### Task 3.2: Alert banner + emergency dashboard wiring

**Files:**
- Modify: `src/hazard-map/hazard-map.ts`, `css/hazard-map.css`, `index.html` (`em-card-shelter`)

- [ ] **Step 1:** Fixed-position banner at the top of the emergency map: dark-red `#d62828`, `role="alert"` + `aria-live="assertive"`, dismiss-on-tap, re-appears on a new alert. When offline, show "Updated {n}m ago". Poll only while the emergency map is visible (use the existing IntersectionObserver/route signal); stop polling on close to save battery (eval §7.3).
- [ ] **Step 2: Run tests + build; manual smoke** — active alert renders banner; offline shows staleness label; no network calls when map closed.
- [ ] **Step 3: Commit** (`feat(hazard-map): emergency alert banner + poll lifecycle`)

---

## PHASE 4: Offline strategy

---

### Task 4.1: Service worker pre-caches hazard data

**Files:**
- Modify: `public/sw.js`

- [ ] **Step 1:** Bump `CACHE_NAME` to `mamoru-guide-v10`. Add a dedicated `mamoru-hazard-data-v1` cache (isolated per spec §Rollback) and pre-cache the 5 GeoJSON files on `install`:

```js
const HAZARD_DATA_CACHE = 'mamoru-hazard-data-v1';
const HAZARD_DATA_FILES = [
  './data/shelters.geojson', './data/flood-zones.geojson',
  './data/tsunami-zones.geojson', './data/landslide-zones.geojson',
  './data/earthquake-prob.geojson',
];
```
Keep the existing `activate` cleanup but **do not** delete `HAZARD_DATA_CACHE` when bumping `CACHE_NAME`. Serve `/data/*.geojson` and tile requests cache-first.

- [ ] **Step 2: Manual verify** (DevTools → Application): both caches present; GeoJSON served offline.
- [ ] **Step 3: Commit** (`feat(hazard-map): service worker pre-caches hazard GeoJSON in isolated cache`)

---

### Task 4.2: Tile caching + download-progress UI

**Files:**
- Modify: `public/sw.js` (cache GSI/OSM tiles cache-first), `src/hazard-map/hazard-data.ts` (streamed download with progress), `css/hazard-map.css`

- [ ] **Step 1:** On first map open, warm-cache tiles for the Kobe bbox `[34.5,134.8]–[35.1,135.8]` at z10–14; higher zooms cache on first view. Show a one-time "Downloading hazard data… NN%" bar using `fetch` + `ReadableStream` byte tracking, falling back to an indeterminate spinner. Check `navigator.storage.estimate()` first; if quota is tight, prioritise shelters > zones > tiles and warn.
- [ ] **Step 2: Build + manual offline smoke** (airplane mode after first visit): map tiles + shelters + zones render from cache.
- [ ] **Step 3: Commit** (`feat(hazard-map): offline tile caching + download-progress UI`)

---

## PHASE 5: i18n, accessibility, reduced motion, testing

---

### Task 5.1: i18n sweep

**Files:** Modify all `src/hazard-map/*.ts` emitting UI strings; verify the spec §i18n key table (section/emergency titles, layer names, walk time, capacity, offline notice, danger-zone message, "you are here", back, privacy hint, last-updated). Shelter names: `name` (JA) + `name_en`; show `name_id` when lang = ID, falling back EN→JA.

- [ ] Run a language-switch manual pass (EN/JA/ID) over map UI, popups, info panels, banner. Commit (`feat(hazard-map): complete trilingual coverage of map UI`).

### Task 5.2: Accessibility + reduced motion

**Files:** `src/hazard-map/*`, `css/hazard-map.css`

- [ ] Map container `role="application"` + `aria-label`; layer toggles `aria-pressed`; drawer items are arrow-key-navigable `<button>`s; banner `role="alert"`/`aria-live`; info panels focusable + Escape-dismiss; markers/zones `aria-label`d; live-region announces toggle + online/offline changes.
- [ ] `prefers-reduced-motion: reduce` (via existing `motionAllowed()` from `src/character/motion.ts`, with a direct media-query fallback) disables: user-dot pulse, pan/zoom transitions (instant), banner slide-in, progress animation.
- [ ] Distinct **shapes** (circle = shelter, triangle = user) + pattern fills so colour isn't the only cue. Commit (`feat(hazard-map): accessibility + reduced-motion for map`).

### Task 5.3: Integration tests + cleanup

- [ ] Integration tests (mock Leaflet): emergency init (geo success → map+shelters+alert check; geo fail → manual selector); layer toggle add/remove; language switch updates strings; offline path loads from cache with stale banner.
- [ ] Remove dead code paths; ensure `npx tsc --noEmit` clean. Commit (`test(hazard-map): integration tests + cleanup`).

---

## PHASE 6: Real data preparation

---

### Task 6.1: Source + simplify real hazard GeoJSON

**Files:** `scripts/build-hazard-data.mjs`, replace `public/data/*-zones.geojson` + `earthquake-prob.geojson`, expand `public/data/shelters.geojson`

- [ ] **Step 1: Sources** (all free, no API key) — shelters: Kobe city open data + OSM `amenity=shelter`/`emergency=assembly_point` (target ~500); flood/tsunami: MLIT 国土数値情報 https://nlftp.mlit.go.jp/ksj/ ; landslide: MLIT 土砂災害警戒区域; earthquake prob: J-SHIS https://www.j-shis.bosai.go.jp/ .
- [ ] **Step 2:** `build-hazard-data.mjs` simplifies polygons (Douglas–Peucker, no new runtime dep — vendor a tiny simplifier or do it offline as a build-time devDependency) to the spec's resolutions; clip to the Kobe/Kansai bbox; strip `sample` flags. **Budget: total `public/data/*.geojson` < 2.5 MB (target 2 MB).**
- [ ] **Step 3:** Re-run shelter conversion to ~500 entries; verify each `properties` validates against `HazardShelter`.
- [ ] **Step 4: Build + offline smoke + size check; commit** (`feat(hazard-map): real MLIT/J-SHIS hazard data, simplified under 2.5MB`).

---

### Task 6.2: Flip rollout + remove deprecated code (after stable)

- [ ] After the map is stable (spec: ~2 weeks), delete `src/shelter-finder.ts` + `src/shelter-data.ts` (now superseded by GeoJSON + `hazard-map/`), drop the flag fallback branch, and remove `css/shelter-finder.css`. Commit (`chore(hazard-map): remove deprecated shelter finder after stable rollout`). **Do not do this task until explicitly approved.**

---

## Task dependency graph

```
PHASE 0 (sequential — each re-wires shelter-finder.ts):
  0.1 types → 0.2 evacuation → 0.3 geolocation → 0.4 map-renderer

PHASE 1 (1.1 → 1.2 → 1.3):
  1.1 shelter GeoJSON+loader → 1.2 shelter layer → 1.3 entry + emergency flow

PHASE 2 (after Phase 1):
  2.1 sample GeoJSON → 2.2 hazard-layers → 2.3 educational mode

PHASE 3 (after Phase 1; parallel with Phase 2):
  3.1 alert-feed → 3.2 banner + dashboard

PHASE 4 (after Phases 1–3 produce the data files):
  4.1 SW precache → 4.2 tiles + progress

PHASE 5 (after Phases 1–4): 5.1 i18n  5.2 a11y  5.3 integration tests

PHASE 6 (after Phase 5): 6.1 real data → 6.2 remove deprecated (approval-gated)
```

---

## Verification checklist (after all phases)

- [ ] `npm test` — all new + existing tests pass.
- [ ] `npm run build` — `tsc --noEmit` clean, vite build succeeds.
- [ ] Zero new runtime dependencies in `package.json`; Leaflet still CDN-loaded + lazy.
- [ ] New JS (excluding GeoJSON) < 20 KB gzipped; `public/data/*.geojson` total < 2.5 MB.
- [ ] SW pre-caches all GeoJSON on install (DevTools → Application); `mamoru-hazard-data-v1` isolated from `mamoru-guide-v*`.
- [ ] Offline smoke (airplane mode after first visit): emergency map renders shelters + zones from cache; alert shows "Updated Nm ago".
- [ ] All 3 languages correct on map UI, popups, info panels, alert banner; shelter `name_id` honoured.
- [ ] `prefers-reduced-motion: reduce` disables pulse, pan transitions, banner slide-in, progress animation.
- [ ] No GPS data in network requests/URLs/console (DevTools → Network); all map `localStorage` keys are `mamoru-*`.
- [ ] Markers/zones render in both day + night themes; colour-blind-safe (shapes + patterns, not colour alone).
- [ ] Feature flag `mamoru-hazard-map-enabled=false` cleanly reverts to the old shelter finder.
- [ ] No regression in "find nearest shelter" vs. the current finder (Sannomiya nearest-5 matches or improves).
- [ ] Accessibility: banner `role="alert"`, toggles `aria-pressed`, full keyboard path through controls + drawer.

---

## Risk & rollback (inherited from design spec)

- **Data too large / unavailable:** sample data keeps Phases 2–5 buildable; real data is the last phase and gated on the < 2.5 MB budget (simplify further / split per-prefecture if needed).
- **JMA feed change:** isolated in `alert-feed.ts`; degrades to "no alerts available".
- **GSI tiles rate-limited / Leaflet CDN down:** OSM fallback; shelter **list** still works without the map (current behavior preserved).
- **Rollback:** flip `mamoru-hazard-map-enabled` to `false`; the old finder + `mamoru-guide-v*` cache are untouched (separate `mamoru-hazard-data-v1` cache). Git revert of the feature branch also restores the prior state.
