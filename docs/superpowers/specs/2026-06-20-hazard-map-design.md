# Hazard Map & Emergency Dashboard — Design Spec

**Date:** 2026-06-20
**Status:** Draft
**Scope:** Kobe/Kansai region hazard map with shelter overlay, hazard zone layers, real-time alerts, and evacuation guidance

## Summary

Replace the current Shelter Finder (`#shelter` section + `src/shelter-finder.ts`) with a full hazard map system that serves two modes:

1. **Emergency Mode** — fullscreen map activated from `#/emergency`. Shows user location, nearest shelters, active hazard zones, real-time alert banner, and walking direction/distance to safety.
2. **Educational Mode** — browseable map accessible from Learn/Prepare routes. Toggle layers (flood, tsunami, landslide, earthquake probability) to understand local risk before disaster strikes.

The system is offline-first: ~2MB of pre-cached GeoJSON (shelters + hazard zone polygons for Kobe/Kansai) stored in the service worker cache. Real-time JMA alerts are fetched on-demand when online and cached for offline display.

## Goals

- Provide a single map interface that absorbs the current Shelter Finder and becomes the Emergency Mode destination.
- Display hazard zones (flood inundation, tsunami inundation, landslide risk, earthquake probability) as toggleable map layers using open government data.
- Show real-time JMA alerts (earthquake early warning, tsunami warning, typhoon track) when online, with graceful offline fallback.
- Calculate and display walking distance/time and compass heading to the nearest 5 shelters from the user's current position.
- Work fully offline after initial data cache — shelters, hazard polygons, and base map tiles for the Kobe/Kansai region.
- Keep all user location data local per CLAUDE.md privacy rules.

## Non-Goals

- Turn-by-turn navigation. The map shows direction arrows and straight-line distance, not routed paths.
- Coverage beyond Kobe/Kansai in v1. Hyogo, Osaka, Kyoto, and surrounding prefectures only.
- Real-time crowd-sourced reports or user-submitted hazard data.
- Integration with native J-Alert push notifications (OS-level; PWA cannot intercept these).
- Custom base map tile server. We use existing GSI or OSM tile CDNs.
- Replacing the Emergency Mode 4-action layout. The map augments it — the "Find Shelter" card in `#/emergency` opens the map view.

## Architecture

### System overview

```
┌─────────────────────────────────────────────────────────┐
│  index.html                                             │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │ #emergency-mode  │  │ #shelter (map section)       │  │
│  │ em-card-shelter ─┼──▶ HazardMap (emergency mode)   │  │
│  └─────────────────┘  │                              │  │
│                       │ HazardMap (educational mode)  │  │
│  ┌─────────────────┐  │ - layer toggles              │  │
│  │ Learn/Prepare   ├──▶ - info panels                │  │
│  │ nav links       │  └──────────────────────────────┘  │
│  └─────────────────┘                                    │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  ┌───────────┐    ┌──────────────┐   ┌──────────────┐
  │ Leaflet   │    │ GeoJSON      │   │ JMA Alerts   │
  │ (lazy)    │    │ (SW cache)   │   │ (on-demand)  │
  └───────────┘    └──────────────┘   └──────────────┘
```

### Module dependency graph

```
src/hazard-map/
├── hazard-map.ts          # main entry: initHazardMap(), mode switching
├── map-renderer.ts        # Leaflet wrapper: init, layers, markers, user dot
├── hazard-layers.ts       # GeoJSON layer management: load, toggle, style
├── shelter-layer.ts       # shelter markers, popup rendering, nearest-N logic
├── alert-feed.ts          # JMA alert fetching, parsing, caching
├── evacuation.ts          # distance/heading calc, walking time estimation
├── geolocation.ts         # getUserLocation, watchPosition, cached location
├── hazard-data.ts         # data loading from SW cache or network
└── types.ts               # interfaces for hazard zones, alerts, shelters

src/shelter-finder.ts      # DEPRECATED — retained temporarily, init gated behind feature flag
src/shelter-data.ts        # MIGRATED — data moves to public/data/shelters.geojson
```

### Integration with existing code

- `src/main.ts`: add `initHazardMap()` call. Remove `initShelterFinder()` call (or gate behind feature flag during transition).
- `index.html`: the `#shelter` section HTML is replaced with a map container. The `#emergency-mode` section's `.em-card-shelter` link changes from `href="#/shelter"` to triggering the emergency map view.
- `src/lang.ts` / `src/i18n.ts`: new translation keys added for map UI strings.
- `public/sw.js`: updated to pre-cache GeoJSON data files and optionally GSI/OSM tiles for the Kobe bounding box.

### Leaflet usage

Leaflet is already lazy-loaded in the current shelter finder via `loadLeaflet()` in `src/shelter-finder.ts`. The new system extracts this into `src/hazard-map/map-renderer.ts` with the same CDN loading pattern:

```ts
// Leaflet loaded from CDN, lazy, same as current approach
// CSS: https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
// JS:  https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
```

No Leaflet npm dependency is added. The `L` global is typed with a local `declare const L: any` (matching current pattern) or a minimal type shim in `src/hazard-map/types.ts`.

## Data Sources

All sources are free, open, and require no API keys.

### 1. Shelter locations

- **Source:** Municipal open data (Kobe city CSV/GeoJSON), OpenStreetMap `amenity=shelter` / `emergency=assembly_point`
- **Current state:** `src/shelter-data.ts` has ~55 hardcoded shelters for Kobe/Kansai
- **Migration:** expand to ~500+ shelters from municipal datasets, convert to `public/data/shelters.geojson`, pre-cache in SW
- **Schema:** extends current `Shelter` interface with `capacity`, `phone`, `name_id` (Indonesian name where available)

```ts
interface HazardShelter {
  name: string;           // Japanese name
  name_en?: string;       // English name
  name_id?: string;       // Indonesian name (new)
  lat: number;
  lng: number;
  address: string;
  types: ShelterType[];   // 'earthquake' | 'flood' | 'tsunami' | 'fire' | 'landslide'
  capacity?: number;      // max occupants (new)
  phone?: string;         // contact number (new)
  elevation?: number;     // meters above sea level (new, for tsunami risk)
}
```

### 2. Flood/tsunami inundation zones

- **Source:** National Land Numerical Information (国土数値情報), MLIT
- **URL:** https://nlftp.mlit.go.jp/ksj/ (GeoJSON/Shapefile downloads)
- **Data:** flood inundation depth polygons, tsunami inundation area polygons for Hyogo, Osaka, Kyoto prefectures
- **Size estimate:** ~800KB GeoJSON (simplified to ~500m resolution for offline cache)
- **Update frequency:** static datasets, updated annually

### 3. Landslide risk areas

- **Source:** 国土数値情報 sediment disaster warning zones (土砂災害警戒区域)
- **URL:** same MLIT portal
- **Data:** polygons for landslide warning zones, steep slope failure zones
- **Size estimate:** ~400KB GeoJSON (simplified)

### 4. Earthquake probability

- **Source:** J-SHIS (地震ハザードステーション), NIED
- **URL:** https://www.j-shis.bosai.go.jp/
- **Data:** 30-year probability grid for the region, pre-simplified to ~1km resolution polygons
- **Size estimate:** ~300KB GeoJSON
- **Display:** color gradient overlay (low to high probability)

### 5. Real-time alerts (online only)

- **Source:** JMA (Japan Meteorological Agency) public feeds
- **Endpoints:**
  - Earthquake early warning: JMA XML/JSON feed
  - Tsunami warning: JMA tsunami advisory feed
  - Typhoon track: JMA tropical cyclone data
- **Fetch strategy:** poll every 60s when map is open and online; cache last-fetched alerts in `localStorage` (`mamoru-alerts-cache`) for offline display
- **Privacy:** no user data sent; request contains no location info (full feed parsed client-side)

### 6. Base map tiles

- **Primary:** GSI Maps (地理院地図) — `https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png`
- **Fallback:** OpenStreetMap — `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Offline:** pre-cache tiles for Kobe/Kansai bounding box at zoom levels 10-14 (~200 tiles, ~1.5MB). Higher zoom levels cached on first view.
- **Bounding box:** roughly `[34.5, 134.8]` to `[35.1, 135.8]` (Akashi to Kyoto)

## File Structure

### New files

```
src/hazard-map/
├── hazard-map.ts          # 250 lines — main init, mode switching, event wiring
├── map-renderer.ts        # 200 lines — Leaflet init, tile layer, view control
├── hazard-layers.ts       # 180 lines — GeoJSON layer creation, toggle, styling
├── shelter-layer.ts       # 150 lines — shelter markers, popups, nearest-N
├── alert-feed.ts          # 120 lines — JMA fetch, parse, cache
├── evacuation.ts          # 100 lines — haversine, bearing, walk time
├── geolocation.ts         #  80 lines — location services, caching
├── hazard-data.ts         # 100 lines — data loader from cache/network
└── types.ts               #  60 lines — shared interfaces

css/hazard-map.css         # 350 lines — map UI, layer toggles, alert banner, panels

public/data/
├── shelters.geojson       # shelter locations for Kobe/Kansai (~500 entries)
├── flood-zones.geojson    # flood inundation polygons (simplified)
├── tsunami-zones.geojson  # tsunami inundation polygons (simplified)
├── landslide-zones.geojson # landslide risk polygons (simplified)
└── earthquake-prob.geojson # earthquake probability grid (simplified)

src/hazard-map/__tests__/
├── evacuation.test.ts     # haversine, bearing, walk time calculations
├── hazard-layers.test.ts  # layer toggle logic, GeoJSON parsing
├── shelter-layer.test.ts  # nearest-N selection, popup content
├── alert-feed.test.ts     # JMA feed parsing, cache read/write
└── geolocation.test.ts    # cached location TTL, fallback behavior
```

### Modified files

```
src/main.ts                # add initHazardMap() import and call
index.html                 # replace #shelter section HTML, update #emergency-mode links
public/sw.js               # add GeoJSON files and tile bounding box to precache list
css/shelter-finder.css     # retained for transition period, then removed
```

### Deprecated files (remove after transition)

```
src/shelter-finder.ts      # replaced by src/hazard-map/
src/shelter-data.ts        # data migrated to public/data/shelters.geojson
```

## UX Design

### Emergency Mode map

When the user taps "Find Shelter" from `#/emergency`, the map opens fullscreen:

```
┌──────────────────────────────────────┐
│ ⚠️ TSUNAMI WARNING — Osaka Bay      │  ← alert banner (red, if active)
│    Seek higher ground immediately    │
├──────────────────────────────────────┤
│                                      │
│         [map fills viewport]         │
│                                      │
│    🟢 Shelter A (350m, ~4min)        │  ← shelter markers (green)
│              ·                       │
│         🔵 You                       │  ← user location (pulsing blue dot)
│              ·                       │
│    🟢 Shelter B (580m, ~7min)        │
│                                      │
│   ┌─────────────────────────────┐    │
│   │ 🟥 red = danger zone       │    │  ← hazard overlay (semi-transparent)
│   │ 🟧 orange = nearby risk    │    │
│   └─────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  ← Back    [nearest 5 shelters list] │  ← bottom drawer (swipe up)
│                                      │
│  🏫 Ikuta JHS        350m  ~4min    │
│  🏫 Chuo Ward Office 580m  ~7min    │
│  🏫 Isokami Park      720m  ~9min    │
│  🏫 Flower Clock      850m ~11min   │
│  🏫 Higashi Yuenchi   900m ~12min   │
└──────────────────────────────────────┘
```

Key behaviors:
- Map auto-centers on user location with zoom level 14-15.
- Nearest 5 shelters shown with green markers. Lines or arrows from user to shelters indicate direction.
- If user is inside a hazard zone, that zone is highlighted red with an overlay message.
- Zones adjacent to the user are shown in orange as a warning.
- Alert banner at top is fixed-position, dismissed with tap (re-appears on new alert).
- Bottom drawer shows shelter list with name (JA + EN), distance, walk time, shelter types. Tapping a shelter pans the map and opens its popup.
- "Back" button returns to the Emergency Mode 4-action layout.

### Educational Mode map

Accessible from a new nav link or from the existing `#shelter` section position in the page:

```
┌──────────────────────────────────────┐
│  Hazard Map — Kobe/Kansai            │
│  ┌──────────────────────────────┐    │
│  │ ☑ Shelters (always on)       │    │
│  │ ☐ Flood zones               │    │
│  │ ☐ Tsunami zones             │    │
│  │ ☐ Landslide risk            │    │
│  │ ☐ Earthquake probability    │    │
│  └──────────────────────────────┘    │
├──────────────────────────────────────┤
│                                      │
│         [map, 16:10 aspect]          │
│                                      │
│   tap a colored zone to see an       │
│   info panel explaining the risk     │
│                                      │
├──────────────────────────────────────┤
│  ℹ️ Info Panel (appears on tap)      │
│  Flood Inundation Zone              │
│  Depth: 0.5–3.0m                    │
│  Source: MLIT 国土数値情報            │
│  What to do: Move to 2nd floor...   │
└──────────────────────────────────────┘
```

Key behaviors:
- Map defaults to a regional view (zoom 11) centered on Kobe.
- Layer toggle panel on top. Shelters are always visible. Other layers toggled independently.
- Tapping a hazard zone polygon opens an info panel below the map with: zone type, risk level, data source, and a brief action recommendation in the current language.
- "Find my location" button available (same GPS flow as current shelter finder).
- When location is available, shows nearest shelters and highlights any hazard zones the user is in.

### Shelter detail popup

When tapping a shelter marker (either mode):

```
┌─────────────────────────────┐
│ 生田中学校                   │
│ Ikuta Junior High School    │
│ 📍 神戸市中央区中山手通4-23-2 │
│ 🏷️ Earthquake, Flood, Fire  │
│ 👥 Capacity: 800            │
│ 📞 078-XXX-XXXX             │
│ 📏 350m · ~4 min walk       │
│ 🧭 ← heading arrow          │
└─────────────────────────────┘
```

### Color system

| Element | Color | Hex | Use |
|---|---|---|---|
| Danger zone (user inside) | Red | `#e63946` | hazard polygon the user is currently in |
| Nearby risk | Orange | `#f4a261` | hazard polygons adjacent to user |
| Safe shelter | Green | `#2a9d8f` | shelter markers |
| Water/tsunami | Blue | `#457b9d` | tsunami/flood zone fills |
| User location | Bright blue | `#4cc9f0` | pulsing dot (matches current shelter finder) |
| Alert banner | Dark red bg | `#d62828` | emergency alert bar |

All colors meet WCAG 2.1 AA contrast against both light and dark map backgrounds. Day mode and night mode adjust opacity of overlays accordingly.

## Offline Strategy

### Service worker pre-caching

The service worker (`public/sw.js`) is updated to pre-cache the GeoJSON data files:

```js
const HAZARD_DATA_CACHE = 'mamoru-hazard-data-v1';
const HAZARD_DATA_FILES = [
  './data/shelters.geojson',
  './data/flood-zones.geojson',
  './data/tsunami-zones.geojson',
  './data/landslide-zones.geojson',
  './data/earthquake-prob.geojson',
];
```

Strategy:
1. **Install phase:** pre-cache all GeoJSON files (~2MB total). User sees a one-time "Downloading hazard data..." progress indicator on first visit.
2. **Tile caching:** base map tiles for the Kobe/Kansai bounding box at zoom 10-14 are pre-cached on first map open (~200 tiles). Higher-zoom tiles are cached on first view (cache-then-network).
3. **Alert caching:** last-fetched JMA alerts stored in `localStorage` (`mamoru-alerts-cache`) with timestamp. Displayed with a "Last updated X minutes ago" label when offline.
4. **Leaflet offline:** Leaflet CSS/JS are cached by the existing SW fetch handler on first load. When offline, the map renders using cached tiles and data.

### Data freshness

| Data type | Update strategy | Staleness tolerance |
|---|---|---|
| Shelters | Background update check weekly | months (shelters rarely change) |
| Hazard zones | Background update check monthly | years (geological data) |
| Base map tiles | Cache-first, network-fallback | months |
| JMA alerts | Network-first, cache-fallback | show "offline" label if >5 min stale |

### Download progress

On first visit (or when hazard data cache is empty), show a progress bar in the shelter/map section:

```
Downloading offline hazard data...
████████████░░░░░░░░  62% (1.2 MB / 2.0 MB)
```

This uses `fetch` with a `ReadableStream` to track bytes received, falling back to an indeterminate spinner if streaming is not supported.

## i18n

All map UI strings are trilingual (EN/JA/ID), using the existing `data-lang="en|ja|id"` span pattern that `src/lang.ts` toggles.

### New translation keys

Managed via the `data-lang` span pattern in HTML and `getLangText()` calls in TypeScript (consistent with current `shelter-finder.ts` approach):

| Context | EN | JA | ID |
|---|---|---|---|
| Section title | Hazard Map | 防災マップ | Peta Bahaya |
| Emergency map title | Emergency Map | 緊急マップ | Peta Darurat |
| Find location | Find My Location | 現在地を検索 | Cari Lokasi Saya |
| Nearest shelters | Nearest Shelters | 最寄りの避難所 | Tempat Perlindungan Terdekat |
| Layer: Flood | Flood Zones | 浸水想定区域 | Zona Banjir |
| Layer: Tsunami | Tsunami Zones | 津波浸水区域 | Zona Tsunami |
| Layer: Landslide | Landslide Risk | 土砂災害警戒区域 | Risiko Longsor |
| Layer: Earthquake | Earthquake Probability | 地震発生確率 | Probabilitas Gempa |
| Walking time | ~{n} min walk | 徒歩約{n}分 | ~{n} menit jalan |
| Distance | {d} | {d} | {d} |
| Capacity | Capacity: {n} | 収容人数: {n}人 | Kapasitas: {n} |
| Offline notice | Map data available offline | オフラインで利用可能 | Data peta tersedia offline |
| Downloading | Downloading hazard data... | 防災データをダウンロード中... | Mengunduh data bahaya... |
| Alert banner | Active alert | 警報発令中 | Peringatan aktif |
| You are here | You are here | あなたの位置 | Posisi Anda |
| Danger zone msg | You are in a {type} zone | {type}区域内にいます | Anda berada di zona {type} |
| Back | Back | 戻る | Kembali |
| Privacy hint | Location used locally only | 位置情報は端末内でのみ使用 | Lokasi hanya digunakan secara lokal |
| No alerts | No active alerts | 警報なし | Tidak ada peringatan |
| Last updated | Updated {n}m ago | {n}分前に更新 | Diperbarui {n}m lalu |

Shelter names display `name` (JA) with `name_en` below it. `name_id` is shown when language is set to Indonesian, falling back to `name_en` then `name`.

## Accessibility

### Keyboard navigation

- All layer toggles are `<button>` elements with `aria-pressed` state.
- Map container has `role="application"` and `aria-label` describing the current view.
- Shelter list in the bottom drawer is navigable with arrow keys; each item is a `<button>` that pans the map.
- Alert banner has `role="alert"` and `aria-live="assertive"`.
- Info panels are focusable and dismissible with Escape.
- "Back" button is always keyboard-accessible.

### Screen readers

- Each shelter marker has an `aria-label` with name, distance, and walk time.
- Hazard zones have `aria-label` describing the zone type and risk level.
- Layer toggle state changes are announced via `aria-live="polite"` region.
- Offline/online status changes announced.

### Reduced motion

- `prefers-reduced-motion: reduce` disables:
  - Pulsing animation on user location dot (shows static dot)
  - Map pan/zoom transitions (instant jumps)
  - Alert banner slide-in animation
  - Progress bar animation
- Checked via the existing `motionAllowed()` gate from `src/character/motion.ts` OR direct media query if the character module is not loaded.

### Color and contrast

- All hazard zone overlays have pattern fills (diagonal lines, dots) in addition to color, so color-blind users can distinguish zones.
- Text labels on the map use a dark background pill for contrast against any map tile.
- Shelter markers use distinct shapes (circle for shelters, triangle for user) in addition to color.
- WCAG 2.1 AA contrast ratios maintained for all text.

### Touch targets

- All interactive elements (buttons, toggles, shelter cards) meet 44x44px minimum touch target.
- Map controls (zoom +/-, locate me) are large and spaced for gloved/wet hands (emergency context).

## Testing Strategy

### Unit tests (Vitest + jsdom)

| Test file | What it covers |
|---|---|
| `evacuation.test.ts` | `haversineDistance` returns correct km for known lat/lng pairs; `calculateBearing` returns correct compass degrees; `estimateWalkTime` uses 4km/h walking speed |
| `shelter-layer.test.ts` | `findNearest(lat, lng, 5)` returns exactly 5 closest shelters sorted by distance; popup HTML contains name, distance, walk time |
| `hazard-layers.test.ts` | GeoJSON feature parsing produces valid Leaflet layer configs; toggle state management (on/off/on round-trip) |
| `alert-feed.test.ts` | JMA XML/JSON parsing extracts alert type, severity, affected area; cache write/read round-trip; stale cache returns data with staleness flag |
| `geolocation.test.ts` | Cached location TTL enforcement (expired returns null); fresh cache returns coordinates; `writeCachedLocation` uses namespaced `mamoru-*` key |
| `hazard-data.test.ts` | Data loader falls back to fetch when cache miss; returns cached data when available |

### Integration tests

- Map renders with mocked Leaflet (verify `L.map`, `L.tileLayer`, `L.geoJSON`, `L.circleMarker` calls).
- Emergency mode init flow: geolocation success path renders map + shelters + alert check.
- Emergency mode init flow: geolocation failure path shows manual area selector (preserving current fallback UX).
- Layer toggle adds/removes GeoJSON layers from the map instance.
- Language switch updates all visible map UI strings.
- Offline scenario: data loads from cache, alert shows "offline" label.

### Manual testing checklist

- [ ] Emergency mode: tap "Find Shelter" from `#/emergency`, verify fullscreen map with location dot
- [ ] Nearest 5 shelters appear with correct distance/time from known test location (Sannomiya)
- [ ] Each hazard layer toggles on/off without map glitches
- [ ] Tap hazard zone polygon, verify info panel appears with correct data
- [ ] Tap shelter marker, verify popup with name (JA+EN), distance, capacity, phone
- [ ] Language switch (EN/JA/ID) updates all map UI strings and shelter name display
- [ ] Offline test: enable airplane mode, verify map tiles + shelters + hazard layers load from cache
- [ ] Offline test: verify alert section shows "Last updated Xm ago" instead of live data
- [ ] GPS denied: verify manual area selector fallback appears
- [ ] Reduced motion: verify no pulsing dot, no pan animation, no slide-in transitions
- [ ] Day mode / night mode: verify map tile contrast and overlay readability in both themes
- [ ] Mobile (375px width): verify map is usable, bottom drawer scrollable, touch targets >= 44px
- [ ] Tablet landscape: verify map expands properly, layer toggles don't overlap

## Verification Criteria

- [ ] `npm run build` passes; `npx tsc --noEmit` passes with zero new type errors.
- [ ] `npm test` passes; all new and existing tests green.
- [ ] Bundle delta: new JS modules < 20KB gzipped (excluding GeoJSON data files).
- [ ] GeoJSON data files total < 2.5MB (target 2MB, hard limit 2.5MB).
- [ ] Service worker pre-caches all GeoJSON files on install; verified via DevTools Application tab.
- [ ] Emergency Mode map loads in < 2s on 3G with warm cache (Lighthouse simulated throttling).
- [ ] Offline smoke test: airplane mode after first visit, Emergency Mode map renders shelters and hazard zones from cache.
- [ ] All 3 languages display correctly on map UI, shelter popups, info panels, and alert banner.
- [ ] `prefers-reduced-motion: reduce` disables all animations (pulsing dot, pan transitions, slide-ins).
- [ ] No user location data in network requests (verified via DevTools Network tab); GPS coordinates stay local.
- [ ] Shelter markers, hazard zones, and alert banner render correctly in both day and night themes.
- [ ] Current Shelter Finder functionality is preserved or improved — no regressions in finding nearest shelters.
- [ ] Zero new runtime dependencies in `package.json`. Leaflet remains CDN-loaded and lazy.
- [ ] CLAUDE.md privacy rules: all `localStorage` keys use `mamoru-*` prefix; no GPS data in URLs or console logs.
- [ ] Accessibility: alert banner has `role="alert"`, layer toggles have `aria-pressed`, keyboard navigation works through all interactive elements.

## Risk & Rollback

### Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GeoJSON data too large (>2.5MB) | Medium | Slow first load, storage pressure | Simplify polygon resolution (reduce vertex count); split by prefecture and lazy-load |
| JMA feed format changes | Low | Real-time alerts stop working | Alert display degrades gracefully to "no alerts available"; feed parser is isolated in `alert-feed.ts` for easy updates |
| GSI tile server rate limiting | Low | Map tiles fail to load | Fallback to OSM tiles; SW caches tiles aggressively after first view |
| Leaflet CDN unavailable | Low | Map won't render | SW caches Leaflet JS/CSS after first load; shelter list still works without map (current fallback behavior preserved) |
| GPS accuracy poor indoors | Medium | Wrong nearest shelter | Show accuracy radius on map; allow manual location correction via map tap or area selector |
| Service worker cache storage quota | Low | Can't cache all data | Check `navigator.storage.estimate()` before caching; prioritize shelters > hazard zones > tiles; show warning if quota insufficient |
| Offline tile coverage gaps | Medium | Blank map areas when offline | Pre-cache at zoom 10-14 which covers the full region; higher zooms may have gaps, show placeholder |

### Rollback plan

The hazard map system is additive. Rollback strategy:

1. **Feature flag:** `initHazardMap()` checks `localStorage.getItem('mamoru-hazard-map-enabled')`. During rollout, defaults to `'true'`. If critical issues found, set to `'false'` to revert to the old Shelter Finder (`initShelterFinder()`).
2. **Old code retained:** `src/shelter-finder.ts` and `src/shelter-data.ts` are not deleted until the hazard map has been stable for 2+ weeks in production.
3. **Data cache isolation:** hazard data uses a separate cache name (`mamoru-hazard-data-v1`) from the main SW cache. Clearing the hazard cache does not affect the rest of the app.
4. **Git revert:** all changes are on a feature branch (`feat/hazard-map`). Revert = revert the merge commit.

### Implementation phases

| Phase | Scope | Estimated effort |
|---|---|---|
| Phase 1 | Map renderer + shelter layer (replaces current shelter finder) | 2-3 days |
| Phase 2 | Hazard zone layers (flood, tsunami, landslide, earthquake) + educational mode | 2-3 days |
| Phase 3 | JMA alert feed + emergency mode integration | 2 days |
| Phase 4 | Offline strategy (SW pre-caching, tile caching, progress UI) | 2 days |
| Phase 5 | i18n, accessibility audit, reduced motion, testing | 1-2 days |
| Phase 6 | Data preparation (GeoJSON processing, simplification, validation) | 2-3 days |

Total estimated: 11-16 days of development effort.
