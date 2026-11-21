# Emergency Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the guide more useful when the network or the power is gone: an "Add to Home Screen" tip (iPhone) and an install button (Android), a "saved for offline use" status, the direction and distance to the nearest evacuation sites without a map, a sourced "When the power goes out" card, and, after a size check, a map that works offline.

**Architecture:** A verification record and the `SOURCES`/`CLAIMS` registry come first, because a line without an official source is dropped. Three small DOM modules follow (`offline-status.ts`, `install-tip.ts`, `geo.ts` used by `shelter-finder.ts`), then one static section (`#power`) with `data-claim` attributes. The offline map is last and gated: the owner measures the map file size first. If it fits, the map comes from a PMTiles file on our own GitHub Pages site (OpenStreetMap data, ODbL), so the app stops loading tiles from `tile.openstreetmap.org`, and a "Save the map" button stores the file in its own cache.

**Tech Stack:** TypeScript, Vite 6, Vitest + jsdom. Tasks 8 and 9 vendor `pmtiles` and `protomaps-leaflet` (both BSD-3-Clause) into `public/vendor/`. No npm runtime dependency.

**Spec:** This document, section "Requirements" (owner request of 2026-11-22). Research notes that this plan argues from: the controller's research of 2026-11-22 (platform and emergency facts; offline map options), summarized in Decisions with their sources.

**Base branch:** start from `main` after the Plan 2 to Plan 5 PRs merge, or from the top of their stack if they are still open. Branches: `docs/aditya/emergency-readiness-record` (Task 1), `feat/aditya/offline-status` (Task 2), `feat/aditya/install-tip` (Task 3), `feat/aditya/shelter-direction` (Tasks 4 and 5), `feat/aditya/power-outage-card` (Task 6), `docs/aditya/map-size-check` (Task 7), `feat/aditya/offline-map` (Tasks 8 and 9).

## Requirements

1. iPhone users see an "Add to Home Screen" tip with Apple's steps and the reason (Safari can delete the saved copy; a Home Screen app keeps its own count). Android Chrome users see an "Install" button. Nobody sees either inside the installed app. The tip can be closed, and it stays closed.
2. A status line says whether the guide is saved on this phone for use with no internet. The app asks the browser to keep its storage (`navigator.storage.persist()`), silently.
3. With no map, each nearest evacuation site shows its distance and its direction from the user (north, northeast, ...). An optional live arrow uses the phone compass.
4. A "When the power goes out" card in Prepare: power outage preparation, phone battery saving, free Wi-Fi 00000JAPAN with its security caution, free disaster public phones. Every line has an official source.
5. A map that works offline, only if the map file is small enough (owner check). Never prefetch from `tile.openstreetmap.org` (its policy forbids it).
6. Visual and phone check lists for the controller and the owner.

## Global Constraints

- Branch names `type/aditya/short-description`. Commit messages one line, no AI or Claude trailer.
- Never costs money. Never needs an account. No user data leaves the device. No new third-party runtime request (Task 8 removes one: the OSM tile server).
- No new npm runtime dependency. Vendored static files in `public/` with their license file are allowed. No new devDependency.
- Owner rule, "erase uncertified information": every fact, safety action and how-to step has an official source in `src/data/sources.ts` (`SOURCES` with `area`, `CLAIMS` with status `verified`, `changed` or `removed`) and a row in `docs/superpowers/specs/2026-11-22-emergency-readiness-verification.md` with the original quote and an English gist. Cut a partly supported line to the source. Remove an unsupported line. Japanese official sources first. Platform facts (Apple, WebKit) use the platform owner's own pages.
- Every user-visible string in en, ja and id with the same meaning. English ASD-STE100 (instructions max 20 words, descriptive max 25, active voice). Japanese やさしい日本語 (です/ます, sentences max 40 characters, reading in parentheses after a hard kanji on first use). Indonesian casual-polite with `kamu`, never `Anda`, EYD V. Glossary terms exactly as in `src/data/glossary.ts`. No em dash (U+2014). New strings pass `copy-rules.test.ts`, `glossary.test.ts` and `i18n.test.ts`. The draft copy in this plan is a starting point: shorten it to pass the rules, never add meaning.
- UI strings in `src/locales/{en,ja,id}.ts` via `data-i18n` and `t()`. Storage only through `src/storage.ts` (add keys to `StorageSchema`).
- UI: `--pixel-font` for labels, `--pixel-text` for sentences at 14px or more; no text below 12px; WCAG AA in day and night mode; keyboard use with visible focus; tap targets 44px; 390px and desktop; `prefers-reduced-motion` and `motionAllowed()` respected.
- Offline: everything in Tasks 2 to 6 works offline after the first visit (it ships in the build that `public/sw.js` precaches).
- Tests first: each code task has a failing test, then the code, then `npm test`, `npx tsc --noEmit`, `npm run build`.
- After adding or changing app text, run `npm run fonts` and commit the regenerated subsets.
- Visual checks by the controller with Claude in Chrome; phone checks by the owner. Implementers do not use a browser.

## Decisions

| ID | Decision | Why |
|---|---|---|
| E-1 | No offline use of `tile.openstreetmap.org`. | OSMF tile policy: "Offline use is not permitted on tile.openstreetmap.org", and it names "Save area for later" as not allowed. |
| E-2 | Directions first (Task 4): distance plus an 8-point direction. It needs no map data. | Zero size, no license risk, works offline. Formulas: Chris Veness, movable-type.co.uk (MIT; keep the notice in a code comment). |
| E-3 | Show the direction only when the position came from the Geolocation API, never from the city list fallback. | From a city centre, the direction points the wrong way for most users. |
| E-4 | Do not tell users that location works offline. | Apple's page says devices without cellular use Wi-Fi for location; no primary source says GPS works with no network. The city list stays the fallback. |
| E-5 | Map tiles (Tasks 8 to 9): a PMTiles extract of the Protomaps basemap, hosted on our GitHub Pages site, read with vendored `pmtiles` + `protomaps-leaflet`. | ODbL data, BSD-3 code, no third-party server. GitHub Pages answers Range requests (measured: HTTP 206). GSI 地理院タイル stay out: offline storage is not addressed in their terms (ask GSI first). |
| E-6 | Task 7 is an owner gate. Go at maxzoom 14 if the file is 45 MiB or less; else maxzoom 13 if 45 MiB or less; else no-go. | Git warns at 50 MiB per file and blocks 100 MiB. A phone download of more than about 45 MB on mobile data is too much for an optional feature. |
| E-7 | The map file is saved only when the user taps "Save the map". It goes into its own cache `mamoru-map-v1`. | The main cache must stay small for every visitor. The name does not start with `mamoru-guide-`, so the service worker's activate step never deletes it. |
| E-8 | Carrier pages (au, docomo) are allowed as the source for phone battery steps, marked in the record. | No government page with battery steps was found. A carrier's own disaster page is the official source for its phones. The owner can remove these lines in review. |
| E-9 | 災害時用公衆電話 is the current NTT name (old name 特設公衆電話). The app uses the current name. | NTT West: 「※旧：特設公衆電話」. |
| E-10 | No flashlight button. | No primary source states browser support for the `torch` constraint, and nothing states iOS support. A full white screen drains the battery, against the battery advice. |
| E-11 | Breaker and 通電火災 steps stay out unless Task 1 finds them on an official page. | The research found them only in search summaries. |
| E-12 | The install tip shows on the Home route only, below the hero. The offline status line shows in About and inside the tip. | Home is the first screen of a new user. About is where a returning user looks for app facts. |
| E-13 | New sources for the tip and the power card use `area: 'safety'`; the NTT phone and 00000JAPAN sources use `area: 'contacts'`. | Plan 2 fixed five areas. These fit without a new area. |

## Review Focus

1. A user picks a city from the list (no GPS): no direction shows, only the distance. Test: Task 4 "shows no direction for a city fallback position".
2. An iPad reports a Mac user agent: the iPhone tip must still show. Test: Task 3 "detects an iPad that reports a Mac user agent".
3. The tip is closed, or the app runs from the Home Screen: the tip never shows again. Tests: Task 3 "stays closed after a reload" and "never shows in standalone mode".
4. `navigator.storage` or `persist` is missing, or `persist()` rejects: no error, and the status still renders. Test: Task 2 "ignores a missing or failing persist".
5. The map save fails halfway (offline, quota): the button shows an error and can try again; no partial file is used. Test: Task 9 "keeps no partial map after a failed save".

---

### Task 1: Verify and register the facts (no UI)

**Files:**
- Create: `docs/superpowers/specs/2026-11-22-emergency-readiness-verification.md`
- Modify: `src/data/sources.ts` (new `SOURCES` with `area`; no `CLAIMS` yet, see Step 4), `src/data/glossary.ts` (災害時用公衆電話, 00000JAPAN if Task 1 finds official en and id), `src/data/source-records.ts` (new record IDs)
- Test: `src/__tests__/sources.test.ts`, `src/__tests__/source-groups.test.ts` (counts)

**Interfaces:**
- Produces the record rows and source IDs. The claim IDs below are added to `CLAIMS` by the task that first shows the line (Task 3 or Task 6), so "every claim is used" never fails between tasks: `install-ios-steps`, `install-ios-7day`, `power-cook`, `power-heat`, `power-medical`, `power-water`, `power-fire`, `battery-low-power`, `battery-brightness`, `battery-radios`, `battery-dark`, `wifi-00000japan`, `wifi-00000japan-caution`, `phone-shelter-free`, `phone-payphone-free`.

- [ ] **Step 1:** Open each page below yourself (not a search summary) and copy the exact sentence. A row whose sentence is not on the page gets status `removed`, and its line is dropped from Tasks 3 and 6.

| Row | Claim | Source page | Expected content (from research; confirm on the page) |
|---|---|---|---|
| E1 | `install-ios-steps` | support.apple.com/guide/iphone/bookmark-favorite-webpages-iph42ab2f3a7/ios and the `/ja-jp/` and `/id-id/` versions | Share, Add to Home Screen, Open as Web App, Add. Record the exact button labels in ja and id from Apple's localized pages. |
| E2 | `install-ios-7day` | webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ | "after seven days of Safari use without user interaction on the site"; "Web applications added to the home screen are not part of Safari and thus have their own counter of days of use." |
| E3-E7 | `power-cook` .. `power-fire` | bousai.go.jp/jishin/syuto/denkikasaitaisaku/teidentaisaku.html | 調理手段, 暖（涼）をとる手段, 家庭用医療機器の予備バッテリー, 断水に備える, 火気と余震 |
| E8-E11 | `battery-*` | au.com/network/anti-disaster/2026/0001/ (E-8) | 低電力モード／バッテリーセーバー, 明るさ, Wi-Fi・Bluetoothをオフ, ダークモード |
| E12-E13 | `wifi-00000japan*` | wlan-business.org/00000japan/for_users | free for anyone in a large disaster; no encryption; minimum use; no IDs, passwords or banking |
| E14-E15 | `phone-*` | ntt-west.co.jp/corporate/disa.html | 避難所の「災害時用公衆電話」は無料; 大規模な災害で公衆電話の通話料が無料となることがある |

- [ ] **Step 2:** Write the record with the same columns as `2026-11-21-remaining-verification.md` (ID, claim, quote, gist, URL, checked 2026-11-22 or later, status).
- [ ] **Step 3: Failing test.** In `source-groups.test.ts`, update the area counts and the visible count to include the new sources (the test fails until Step 4).
- [ ] **Step 4:** Add the `SOURCES` (with `area` per E-13) and the record IDs to `RECORD_SOURCES`. Add a `CLAIMS` entry now only for a removed row (status `removed`, so it needs no user).
- [ ] **Step 5:** `npm test && npx tsc --noEmit && npm run build`. Expected: PASS.
- [ ] **Step 6: Commit** `docs: verify install, power outage, battery, Wi-Fi and payphone facts`.

### Task 2: Saved-for-offline status and persistent storage

**Files:**
- Create: `src/offline-status.ts`
- Modify: `src/main.ts`, `index.html` (`<p id="offlineStatus" class="offline-status" role="status"></p>` in `#about`), `src/locales/{en,ja,id}.ts`
- Test: `src/__tests__/offline-status.test.ts`

**Interfaces:**
- `export type OfflineState = 'ready' | 'saving' | 'unsupported'`
- `export async function offlineState(win?: Window): Promise<OfflineState>`: `unsupported` when `serviceWorker` or `caches` is missing; `ready` when `caches.match(new URL('index.html', document.baseURI).href)` finds a response; else `saving`.
- `export async function requestPersistence(nav?: Navigator): Promise<boolean | null>`: `null` when the API is missing; returns `persisted()` if true, else `persist()`; never throws.
- `export function initOfflineStatus(): void`: renders every `[data-offline-status]` and `#offlineStatus`, again on `navigator.serviceWorker` `controllerchange` and on the `SW_UPDATED` message.

Copy (`offline.ready` | `offline.saving` | `offline.unsupported`):
- en: "Saved on this phone. The guide opens with no internet." | "Saving the guide for use with no internet. Keep this page open." | "This browser cannot save the guide for use with no internet."
- ja: 「このスマホに保存（ほぞん）しました。インターネットがなくても開けます。」 | 「インターネットなしで使えるように保存しています。このページを開いたままにしてください。」 | 「このブラウザでは、インターネットなしで使うための保存ができません。」
- id: "Sudah tersimpan di ponsel ini. Panduan ini bisa dibuka tanpa internet." | "Panduan sedang disimpan supaya bisa dipakai tanpa internet. Biarkan halaman ini terbuka." | "Browser ini tidak bisa menyimpan panduan untuk dipakai tanpa internet."

- [ ] **Step 1: Failing tests** with fake `caches` and `navigator`: "is ready when index.html is cached", "is saving when the cache has no index.html", "is unsupported without caches", "asks persist only when not persisted", "ignores a missing or failing persist" (missing `storage`, missing `persist`, `persist` rejects: resolves `null`/`false`, no throw), "renders the state with data-i18n".
- [ ] **Step 2:** Run them. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement. Call `initOfflineStatus()` and `requestPersistence()` from `main.ts` after the service worker registration.
- [ ] **Step 4:** `npm test && npx tsc --noEmit && npm run build`, then `npm run fonts`.
- [ ] **Step 5: Commit** `feat(offline): show whether the guide is saved for use with no internet`.

### Task 3: Install tip

**Files:**
- Create: `src/install-tip.ts`
- Modify: `index.html` (`<aside id="installTip" class="install-tip" hidden>` below the hero content in `#hero`), `src/storage.ts` (`'mamoru-install-tip': 'closed'`), `src/main.ts`, `src/locales/*`, `css/components.css`
- Test: `src/__tests__/install-tip.test.ts`

**Interfaces:**
- `export function isStandalone(win?: Window): boolean`: `navigator.standalone === true` or `matchMedia('(display-mode: standalone)').matches`.
- `export function isIos(ua: string, maxTouchPoints: number): boolean`: `/iPhone|iPad|iPod/` or (`/Macintosh/` and `maxTouchPoints > 1`).
- `export function initInstallTip(win?: Window): void`: hidden when standalone or closed. iOS: shows the steps (claim `install-ios-steps`) and the reason (claim `install-ios-7day`). Otherwise listens for `beforeinstallprompt`: `preventDefault()`, keeps the event, shows an "Install" button that calls `prompt()` and hides the tip after `userChoice`. Other browsers: stays hidden. A close button stores `closed`. The tip includes `<p data-offline-status>` (Task 2).

Draft copy (button labels in ja and id come from the Task 1 record E1, exactly):
- `install.title`: "Keep this guide on your phone" | 「このガイドをスマホに入れる」 | "Simpan panduan ini di ponselmu"
- `install.why` (claim `install-ios-7day`): "Safari can delete the saved copy when you do not open this site for 7 days of Safari use. A Home Screen app has its own count." | ja and id with the same meaning.
- `install.step1..4` (claim `install-ios-steps`): "Open this page in Safari." / "Tap Share." / "Tap Add to Home Screen." / "Turn on Open as Web App if you see it. Then tap Add."
- `install.button`: "Install" | 「インストール」 | "Pasang"; `install.close`: "Close" | 「閉じる（とじる）」 | "Tutup"

- [ ] **Step 1: Failing tests:** "shows the iPhone steps on iOS Safari", "detects an iPad that reports a Mac user agent", "never shows in standalone mode" (both checks), "stays closed after a reload", "shows the Install button after beforeinstallprompt and calls prompt on tap", "stays hidden on other browsers", "marks the reason and the steps with their claims" (`data-claim`).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Add the `install-*` claims to `CLAIMS` (status from the Task 1 record). Put the steps and the reason in `index.html` as static markup with `data-claim`, so `usedClaimIds()` in `sources.test.ts` (warning-words plan, W-7) counts them. Implement, with styles: `--pixel-text` 14px, 44px buttons, AA in both themes, no animation.
- [ ] **Step 4:** `npm test && npx tsc --noEmit && npm run build`, then `npm run fonts`.
- [ ] **Step 5: Commit** `feat(install): add-to-home-screen tip for iPhone and install button for Android`.

### Task 4: Direction and distance to the nearest sites

**Files:**
- Create: `src/geo.ts`
- Modify: `src/shelter-finder.ts` (use `geo.ts`; remove `haversineDistance`; rows show direction), `src/locales/*`
- Test: `src/__tests__/geo.test.ts`, `src/__tests__/shelter-finder.test.ts`

**Interfaces:**
- `export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number`
- `export function bearingDeg(lat1: number, lng1: number, lat2: number, lng2: number): number` (initial bearing, 0 to <360)
- `export type CompassPoint = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'`
- `export function compassPoint(deg: number): CompassPoint` (`Math.round(deg / 45) % 8` over the list in that order)
- `renderResults` gains a source flag: `'gps' | 'city'`. Rows show `dir.<point>` only for `'gps'` (E-3).

Copy: `shelter.direction` "Direction from you:" | 「あなたからの方向（ほうこう）：」 | "Arah dari kamu:". `dir.n` .. `dir.nw`: north, northeast, east, southeast, south, southwest, west, northwest | 北（きた）, 北東（ほくとう）, 東（ひがし）, 南東（なんとう）, 南（みなみ）, 南西（なんせい）, 西（にし）, 北西（ほくせい） | utara, timur laut, timur, tenggara, selatan, barat daya, barat, barat laut.

- [ ] **Step 1: Failing tests:** `distanceKm` matches the old function on 3 pairs; `bearingDeg(34.70, 135.20, 34.71, 135.20)` < 0.5 or > 359.5; `bearingDeg(34.70, 135.20, 34.70, 135.30)` within 0.5 of 90 (east); `compassPoint` maps 0, 22.4, 22.6, 90, 180, 270, 337.6, 359 to n, n, ne, e, s, w, nw, n; "shows the direction for a GPS position"; "shows no direction for a city fallback position".
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. One comment line: `// Haversine and bearing after Chris Veness, movable-type.co.uk/scripts/latlong.html (MIT)`.
- [ ] **Step 4:** `npm test && npx tsc --noEmit && npm run build`, then `npm run fonts`.
- [ ] **Step 5: Commit** `feat(shelter): show the direction to each nearest site, with no map needed`.

### Task 5 (optional): Live compass arrow

**Files:** Modify `src/shelter-finder.ts`, `src/locales/*`, `css/components.css`. Test: `src/__tests__/shelter-compass.test.ts`.

**Interfaces:** `export function headingFrom(e: { webkitCompassHeading?: number; alpha: number | null; absolute?: boolean }): number | null` (iOS: `webkitCompassHeading`; Android `deviceorientationabsolute`: `(360 - alpha) % 360`; else `null`). A "Use compass" button (GPS results only) calls `DeviceOrientationEvent.requestPermission()` when it exists, then listens; each row's arrow rotates by `bearing - heading`. No button when neither event exists.

- [ ] **Step 1: Failing tests:** `headingFrom` for the iOS, Android and missing cases; "asks permission on iOS only after a tap"; "hides the button without orientation events"; "does not rotate the arrow with reduced motion on, and shows the text direction instead".
- [ ] **Step 2-4:** Run (FAIL), implement, `npm test && npx tsc --noEmit && npm run build`, `npm run fonts`.
- [ ] **Step 5: Commit** `feat(shelter): optional compass arrow to each nearest site`.

### Task 6: "When the power goes out" card

**Files:**
- Modify: `index.html` (new `<section class="section" id="power">` after `#bag`), `src/router.ts` (`'power'` in `ROUTE_SECTIONS['#/prepare']` after `'bag'`), `src/section-nav.ts` (`{ section: 'power', i18n: 'chip.power' }` after `bag`), `src/locales/*`, `css/components.css`
- Test: `src/__tests__/power-card.test.ts`, `src/__tests__/router.test.ts`, `src/__tests__/section-nav.test.ts`

**Interfaces:** Four groups, each `<h3>` plus `<ul>`; every `<li>` has `data-claim` and `data-i18n`. Only rows that Task 1 marked `verified` or `changed` appear.

Draft copy (en; ja and id with the same meaning):
- Group "Prepare for a power cut" (`power-*`): "Prepare a way to cook when the fridge and the microwave do not work." / "Prepare a way to stay warm or cool when the air conditioner does not work." / "If a home medical device needs power, prepare a spare battery or another way." / "Prepare for no water. A power cut can stop the water pump." / "When you use fire, keep things that burn away from it. Aftershocks can make them fall."
- Group "Save your phone battery" (`battery-*`): "Turn on Low Power Mode (iPhone) or Battery Saver (Android)." / "Make the screen darker." / "Turn off Wi-Fi and Bluetooth when you do not use them." / "Use dark mode."
- Group "Free Wi-Fi: 00000JAPAN" (`wifi-*`): "In a large disaster, the free Wi-Fi 00000JAPAN can open. Anyone can use it." / "It has no encryption. Use it only to contact people and get information. Do not type passwords or use banking."
- Group "Free public phones" (`phone-*`): "Shelters can have free disaster public phones (災害時用公衆電話)." / "In a large disaster, calls from public phones can be free."
- `label.power` "POWER" | 「停電（ていでん）」 | "LISTRIK"; `power.title` "When the power goes out" | 「停電のとき」 | "Saat listrik padam"; `chip.power` "🔋 Power" | 「🔋 停電」 | "🔋 Listrik".

- [ ] **Step 1: Failing tests:** "every line names a verified or changed claim" (read `index.html`, look up `CLAIMS`), "has no line for a removed claim", "shows power on #/prepare after bag", "chips follow the section order" (existing `nav-order.test.ts` stays green).
- [ ] **Step 2-4:** Run (FAIL), add the `power-*`, `battery-*`, `wifi-*` and `phone-*` claims to `CLAIMS` (status from the Task 1 record), implement, `npm test && npx tsc --noEmit && npm run build`, `npm run fonts`.
- [ ] **Step 5: Commit** `feat(prepare): sourced power outage, battery, free Wi-Fi and payphone card`.

### Task 7: Map size check (owner gate)

**Files:** Create `docs/superpowers/specs/2026-11-22-offline-map-size-check.md`.

- [ ] **Step 1:** The controller writes the doc: purpose (E-5, E-6), the commands, an empty result table (`maxzoom | bytes | MiB | decision`), and the decision rule E-6.
- [ ] **Step 2 (owner):** Download the `pmtiles` CLI from the official release page (github.com/protomaps/go-pmtiles/releases) into a user folder (no sudo). Run, for maxzoom 13 and 14: `pmtiles extract https://build.protomaps.com/<latest YYYYMMDD>.pmtiles osaka-kobe.pmtiles --bbox=134.95,34.45,135.65,34.90 --maxzoom=14 --dry-run`. Fill the table.
- [ ] **Step 3: Stop.** Tasks 8 and 9 start only on "go". On "no-go", keep Task 4 and the online map, and close the map branch.
- [ ] **Step 4: Commit** `docs: record the offline map size check`.

### Task 8 (after go): Self-hosted map tiles

**Files:**
- Create: `public/map/osaka-kobe.pmtiles` (owner extract from Task 7, without `--dry-run`), `public/vendor/pmtiles/` and `public/vendor/protomaps-leaflet/` (minified file + LICENSE, versions pinned in a README line with SHA-256)
- Modify: `src/shelter-finder.ts` (replace `L.tileLayer('https://tile.openstreetmap.org/...')` with the protomaps layer, `lang: 'ja'`), attribution "© OpenStreetMap contributors" linked to https://www.openstreetmap.org/copyright
- Test: `src/__tests__/offline.test.ts` (vendored files exist and match their pins; no source file names `tile.openstreetmap.org`), `src/__tests__/shelter-finder.test.ts`

- [ ] **Step 1: Failing tests** as listed; "shows the OpenStreetMap attribution with a link".
- [ ] **Step 2-4:** Run (FAIL), implement (load the vendored scripts the same way `loadLeaflet` does, with SRI), `npm test && npx tsc --noEmit && npm run build`.
- [ ] **Step 5: Commit** `feat(map): self-hosted map tiles, no third-party tile server`.

### Task 9 (after go): Save the map for offline use

**Files:** Modify `public/sw.js`, `src/shelter-finder.ts`, `src/locales/*`. Test: `src/__tests__/offline.test.ts`, `src/__tests__/map-save.test.ts`.

**Interfaces:**
- `export async function saveMap(url: string, cacheName = 'mamoru-map-v1'): Promise<void>`: fetches the whole file, then `cache.put` once (never a partial entry); rejects on a non-OK response.
- `public/sw.js`: a request for `*.pmtiles` with a `Range` header is answered from `mamoru-map-v1` when the file is there (status 206, `Content-Range`, the byte slice), else from the network. The activate filter (`mamoru-guide-` prefix) leaves `mamoru-map-v1` alone.
- A button "Save the map for use with no internet (<size> MB)" with states: idle, saving, saved, failed (with "Try again").

- [ ] **Step 1: Failing tests:** "answers a range request from the saved map with 206 and the right bytes", "goes to the network when the map is not saved", "keeps no partial map after a failed save", "activate keeps mamoru-map-v1".
- [ ] **Step 2-4:** Run (FAIL), implement, `npm test && npx tsc --noEmit && npm run build`, `npm run fonts`.
- [ ] **Step 5: Commit** `feat(map): save the map on the phone for use with no internet`.

## Visual checks (controller, Claude in Chrome)

In en, ja and id, at 390px and 1280px, in day and night mode:
1. Home: the tip shows with a desktop Safari-like iPad user agent override (or a test page flag); it is hidden after Close and after a reload.
2. About: the status reads "Saved on this phone" after the service worker finishes; "Saving" before.
3. Shelter finder with a GPS position (Chrome sensor override): each row shows distance and direction. With a city from the list: distance only.
4. Prepare: the power card sits after the bag section, its chip scrolls to it, every line is readable (AA), and Japanese renders in DotGothic16.
5. After Task 8: the map loads with no request to `tile.openstreetmap.org` (`read_network_requests`), and the attribution link shows. After Task 9: save the map, go offline, reload, open the shelter finder: the map draws.

## Phone checks (owner)

1. iPhone Safari: follow the tip, add to the Home Screen, open it once online, then in airplane mode. The app opens, and the tip does not show inside it.
2. Android Chrome: the Install button installs the app.
3. Optional Task 5: the compass arrow on both phones, outdoors.
4. After Task 9: save the map on mobile data and note the time it takes.
