# Reliability and Offline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mamoru Guide works offline after one visit, and in an emergency it never shows a blank page or a dead end.

**Architecture:** The shelter finder gets one error path with translated messages. The emergency buttons open their exact section through routes. A `<noscript>` block gives the emergency numbers. The build stamps the service worker cache name. Leaflet and the three fonts move from CDNs into `public/`, and the service worker precaches them. Fixes that need no new files come first.

**Tech Stack:** TypeScript, Vite 6, Vitest + jsdom, Node 24. Build-time only: `subset-font` (font subsets), `vite-node` (runs the font script; it ships with Vitest).

**Spec:** This document, section "Requirements" (controller decisions approved by the owner, 2026-11-21).

**Base branch:** start from `main` after PRs #28 to #33 merge. If they are not merged, branch from `fix/aditya/animation-check` and rebase later. Stack the branches below in task order.

## Requirements

1. Leaflet 1.9.4 (`leaflet.js`, `leaflet.css`, marker images, LICENSE) is vendored in `public/vendor/leaflet/`, loaded from there, and precached. OpenStreetMap tiles stay online-only.
2. The shelter finder has one error path. A failure of the shelter data chunk, Leaflet, geolocation or tiles shows a clear en/ja/id message, and the list stays usable. The city-select handler never throws an unhandled rejection. Tile failure (`tileerror`, `navigator.onLine === false`) shows a "map unavailable" note.
3. Press Start 2P, DotGothic16 and M PLUS Rounded 1c are self-hosted woff2 in `public/fonts/` with OFL files, declared with local `@font-face` (`font-display: swap`) in `index.html` and `public/404.html`, and precached. DotGothic16 and M PLUS Rounded 1c are subsets of every character in the app text plus full ASCII, hiragana, katakana and Japanese punctuation. A test proves the subsets cover the app text.
4. `scripts/vite-sw-manifest.ts` stamps `CACHE_NAME` in `dist/sw.js` with a build hash. The manual bump and its README line go away. A test covers the stamping.
5. `index.html` has a `<noscript>` block in en/ja/id: JavaScript is needed, plus 110, 119, 118 and the 171 name, with their existing sources.
6. The floating emergency buttons open the exact section (`#/firstaid`, `#/shelter`, `#/show`). A test proves each button's target section is visible.
7. The controller runs the visual checks in "Visual checks" at the end.

## Global Constraints

- Branch names `type/aditya/short-description`. Commit messages: one line, no AI/Claude trailer.
- Never costs money. Never needs an account. No user data leaves the device. No new third-party runtime request.
- No new npm runtime dependency. Vendored static files in `public/` carry their license file. New devDependencies are for build-time scripts only, with a one-line reason.
- Owner rule "erase uncertified information": every fact needs a source in `src/data/sources.ts` and a row in a `docs/superpowers/specs/*-verification.md` record (Japanese quote, English gist).
- Every user-visible string in en, ja, id with the same meaning. English ASD-STE100 (instructions max 20 words, descriptive max 25, active voice). Japanese やさしい日本語 (です/ます, max 40 characters a sentence, reading after hard kanji on first use). Indonesian casual-polite with `kamu`, never `Anda`, EYD V. Glossary terms from `src/data/glossary.ts` exactly (避難場所 = "evacuation site" = "tempat evakuasi"). No U+2014.
- UI strings go in `src/locales/{en,ja,id}.ts`, applied with `data-i18n` and `t()`. New strings pass `copy-rules.test.ts` and `glossary.test.ts`.
- No text below 12px. WCAG AA in day and night mode. Keyboard focus visible. Tap targets 44px. Works at 390px and desktop.
- Each task: failing test first, then code, then `npm test`, `npx tsc --noEmit`, `npm run build` all pass.

## Decisions

| ID | Decision | Why |
|---|---|---|
| R-1 | New route `#/firstaid` shows only `#firstaid`, like `#/show` and `#/alerts`. FAB links become `#/firstaid`, `#/shelter`, `#/show`. Legacy `#firstaid` redirects to `#/firstaid`, `#showthis` to `#/show`. | A one-section route needs no scroll math and matches the emergency-mode cards. |
| R-2 | `subset-font` 2.9 for subsets. `harfbuzzjs` and `fontverter` become explicit devDependencies (both are already in its tree). | Pure npm (HarfBuzz WASM): no Python on the owner's no-admin Mac or on CI. |
| R-3 | Press Start 2P is converted to woff2 losslessly, not subset. | Its OFL has a Reserved Font Name; a subset is a modified version. The full woff2 is 29 KiB. |
| R-4 | Shelter names and addresses (`src/data/shelters.json`) are added to the M PLUS Rounded 1c 400 and 700 subsets only. | `.shelter-name` is 700 and `.shelter-address` is 400; other faces never draw them. |
| R-5 | Font sources pinned to `google/fonts@06bfe0d62a98375cb09c942fa18e68bd32cff057`, checked by SHA-256, cached in a git-ignored `scripts/.font-cache/`. Only the woff2 output is committed. | The build needs no network; the generator is reproducible. |
| R-6 | User-entered text (My Plan fields) with a character outside the subset falls back to the system font for that character. | Accepted trade-off for a ~770 KiB precache instead of ~3.7 MiB. |
| R-7 | Cache name = `mamoru-guide-` + first 12 hex of SHA-256 over every `dist/` file except `sw.js` (sorted path + content). | Any shipped change makes a new name; an identical rebuild keeps the cache. |
| R-8 | The noscript text reuses the certified `contacts.ts` strings. Its record rows go into `docs/superpowers/specs/2026-11-21-remaining-verification.md` as X2 to X5. | Same sources and quotes as rows R9, R14, R65 to R69. Contacts have no `CLAIMS`; that table is their record. |

### Font size targets (measured 2026-11-21, subset-font 2.9.0, harfbuzzjs 1.6.4, current text)

App character set: 1,184 characters (731 kanji). With shelter data: 1,662 (1,203 kanji).

| File | Chars | Target bytes | Full font as woff2 |
|---|---|---|---|
| `PressStart2P-Regular.woff2` | full font | 29,740 | 29,740 |
| `DotGothic16-Regular.woff2` | app | 84,612 | 500,452 |
| `MPLUSRounded1c-Regular.woff2` (400) | app + shelters | 240,528 | 1,016,840 |
| `MPLUSRounded1c-Bold.woff2` (700) | app + shelters | 260,136 | 1,108,988 |
| `MPLUSRounded1c-ExtraBold.woff2` (800) | app | 173,480 | 1,131,936 |
| Total | | 788,496 (770 KiB) | 3,788,956 |

Characters the source fonts do not have (they fall back today too): DotGothic16 `⊞✓✗Ōūīōā`; M PLUS Rounded 1c all weights `⊞`; shelter data in M PLUS 400/700 `刎㈱簑蹊` (the data had 塚 as U+FA10; the shelter builder now writes U+585A, which the font has).

## Review Focus

1. A precache path that does not exist makes `cache.addAll` reject, so the install fails and nothing works offline. Task 5 tests that every `PRECACHE` entry exists in `public/`.
2. The shelter chunk fails once (offline before the worker installed) and `loadShelters` keeps the rejected promise forever, so "Try again" fails after reconnecting. Task 1 tests a retry after one failure.
3. Leaflet is precached, the phone is offline, and the map draws markers on grey with no explanation. Task 1 tests that `navigator.onLine === false` skips the map and shows the note.
4. The user is already on `#/firstaid`, scrolled down, and taps the First Aid button again: the hash does not change, so nothing happens. Task 2 tests that the tap scrolls to the section again.
5. The user switches language while a shelter error message shows, and the message stays in the old language. Task 1 tests that `applyTranslations()` rewrites it.

---

### Task 1: Shelter finder error path (`fix/aditya/shelter-offline-message`)

**Files:**
- Modify: `src/shelter-finder.ts:160-197` (tile error), `:243-293` (fallback, city select), `:309-336` (geolocation messages), `:338-408` (`findShelters`)
- Modify: `src/shelter-data.ts:27-37` (`loadShelters`)
- Modify: `src/locales/en.ts`, `ja.ts`, `id.ts` (keys below)
- Modify: `css/shelter-finder.css:52-57` (rename `.shelter-map-offline` to `.shelter-problem`; add `.shelter-retry` with `min-height: 44px`; keep the day-mode rule at `:259`)
- Test: `src/__tests__/shelter-finder.test.ts`

**Interfaces:**
- Produces: `type ShelterProblem = 'locationDenied' | 'locationTimeout' | 'locationUnavailable' | 'locationFailed' | 'data' | 'map'`. Locale key `shelter.problem.<problem>`.
- Produces: `export function problemFromGeolocation(err: unknown): ShelterProblem` (code 1 denied, 2 unavailable, 3 timeout, else failed).
- Produces: `loadShelters(load = () => import('./data/shelters.json')): Promise<ShelterList>`. On rejection it sets the cached promise back to `null`.
- Produces: problem markup `<div class="shelter-problem" role="status" data-problem="<p>"><p data-i18n="shelter.problem.<p>">…</p>[<button type="button" class="bag-btn shelter-retry" data-i18n="shelter.retry">]</div>`.

Locale strings (the four location keys move the existing text from `src/shelter-finder.ts:312-332` unchanged):

| Key | en | ja | id |
|---|---|---|---|
| `shelter.problem.data` | The list of evacuation sites did not load. Connect to the internet. Then try again. | 避難場所（ひなんばしょ）のリストを読みこめませんでした。インターネットにつないで、もう一度ためしてください。 | Daftar tempat evakuasi tidak bisa dimuat. Sambungkan ke internet, lalu coba lagi. |
| `shelter.problem.map` | 🗺️ The map needs the internet. The list of evacuation sites still works. | 🗺️ 地図を見るには、インターネットが必要です。避難場所（ひなんばしょ）のリストは使えます。 | 🗺️ Peta butuh internet. Daftar tempat evakuasi tetap bisa dipakai. |
| `shelter.retry` | Try again | もう一度ためす | Coba lagi |

- [ ] **Step 1: Write the failing tests** in `shelter-finder.test.ts`. Add a helper `find(selector)` that clicks `#shelterFindBtn` and waits for `selector`. Reset `document.head`, `navigator.onLine` and `vi.doUnmock('../shelter-data')` in `afterEach`. Fail the shelter data with `vi.doMock('../shelter-data', async orig => ({ ...await orig(), loadShelters: failOnce(...) }))` before the dynamic import.

```ts
it('keeps the list and says the map needs the internet when Leaflet does not load', async () => {
  mountAt(SANNOMIYA); await find('.shelter-card');
  document.head.querySelector('script[src*="leaflet"]')!.dispatchEvent(new Event('error'));
  await find('#shelterMap .shelter-problem[data-problem="map"]');
  expect(document.querySelectorAll('.shelter-card')).toHaveLength(5);
});
it('skips the map and shows the note when the phone is offline', async () => {
  mountAt(SANNOMIYA); setOnline(false); await find('.shelter-problem[data-problem="map"]');
  expect(document.head.querySelector('script[src*="leaflet"]')).toBeNull();
  expect(document.querySelectorAll('.shelter-card')).toHaveLength(5);
});
it('shows the map note when map tiles fail, and keeps the map', async () => {
  // globalThis.L = fake whose tileLayer().on('tileerror', cb) stores cb; then dispatch 'load' on the script
  ...; tileHandlers.tileerror();
  expect(document.querySelector('.shelter-problem[data-problem="map"]')).not.toBeNull();
  expect(document.getElementById('shelterMap')).not.toBeNull();
});
it('says the site list did not load, and Try again works after one failure', async () => {
  // loadShelters rejects once, then uses the real data
  mountAt(SANNOMIYA); await find('.shelter-problem[data-problem="data"] .shelter-retry');
  document.querySelector<HTMLButtonElement>('.shelter-retry')!.click();
  await vi.waitFor(() => expect(document.querySelectorAll('.shelter-card')).toHaveLength(5));
});
it('choosing an area never throws when the site list fails', async () => {
  const unhandled = vi.fn(); process.on('unhandledRejection', unhandled);
  // geolocation calls the error callback with { code: 1 }; loadShelters always rejects
  ...; select.value = '0'; select.dispatchEvent(new Event('change'));
  await vi.waitFor(() => expect(document.querySelector('#shelterList .shelter-problem[data-problem="data"]')).not.toBeNull());
  expect(unhandled).not.toHaveBeenCalled(); process.off('unhandledRejection', unhandled);
});
it('the area list says why location failed, in the same words as the toast', async () => {
  // geolocation error { code: 3 }
  expect(document.querySelector('.shelter-fallback .shelter-problem')!.textContent).toContain(t('shelter.problem.locationTimeout', 'en'));
});
it('a problem message follows a language switch', async () => {
  // after the data problem shows: import i18n after the finder (same module instance)
  setI18nLang('ja'); applyTranslations();
  expect(document.querySelector('.shelter-problem p')!.textContent).toBe(t('shelter.problem.data', 'ja'));
});
it('loadShelters tries again after a failed load', async () => {
  vi.resetModules(); const { loadShelters } = await import('../shelter-data');
  await expect(loadShelters(() => Promise.reject(new Error('offline')))).rejects.toThrow('offline');
  expect((await loadShelters()).sites.length).toBeGreaterThan(1000);
});
it('has every new shelter key in all three languages', () => {
  for (const k of ['data', 'map', 'locationDenied', 'locationTimeout', 'locationUnavailable', 'locationFailed'])
    for (const l of ['en', 'ja', 'id'] as const) expect(t(`shelter.problem.${k}`, l)).not.toBe(`shelter.problem.${k}`);
});
```

- [ ] **Step 2:** Run `npx vitest run src/__tests__/shelter-finder.test.ts`. Expected: FAIL (no `.shelter-problem`, unhandled rejection reported, `loadShelters` rejects twice).
- [ ] **Step 3:** Implement. One private `renderResults(lat, lng): Promise<void>` renders list, stats, out-of-area and map into the existing containers and never rejects: a `findNearest` failure renders the `data` problem with a retry that calls `renderResults` again. `findShelters` and the city-select handler both call it. `showMap` checks `navigator.onLine === false` first, then `loadLeaflet()` + `renderMap` in a try; failure puts the `map` problem inside `#shelterMap` (class `offline`, shown). `renderMap` adds `.on('tileerror', …)` to the tile layer; the first error inserts one `map` problem before `#shelterMap`. `reportGeolocationError` and `showManualFallback(problem)` both use `problemFromGeolocation`, so the fallback shows the same message as the toast, as problem markup (no retry) in place of the fixed "You did not allow location access" paragraph. Messages use `t()` and carry `data-i18n`.
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: all PASS.
- [ ] **Step 5:** Commit `fix(shelter): one translated error path, the list keeps working offline`.

### Task 2: Emergency buttons open their section (`fix/aditya/emergency-deep-links`)

**Files:**
- Modify: `src/router.ts:6-32` (route `#/firstaid`, redirects)
- Modify: `index.html:1185,1189,1193` (FAB hrefs)
- Modify: `src/emergency-fab.ts:40-43` (same-hash tap)
- Test: `src/__tests__/router.test.ts`

**Interfaces:**
- Produces: `ROUTE_SECTIONS['#/firstaid'] = ['firstaid']`. `REDIRECTS['#firstaid'] = '#/firstaid'`, `REDIRECTS['#showthis'] = '#/show'`.

- [ ] **Step 1: Write the failing tests.** Change the legacy test to `redirects #firstaid to #/firstaid` and add `redirects #showthis to #/show`. Add:

```ts
describe('emergency buttons', () => {
  const TARGET: Record<string, string> = { '#/firstaid': 'firstaid', '#/shelter': 'shelter', '#/show': 'showthis' };
  beforeEach(() => { document.body.innerHTML = new DOMParser().parseFromString(read('index.html'), 'text/html').body.innerHTML; });
  it('link only to routes, never to legacy anchors', () => {
    const hrefs = [...document.querySelectorAll('#emergencyFabPanel a[href^="#"]')].map(a => a.getAttribute('href')!);
    expect(hrefs).toEqual(Object.keys(TARGET));
    hrefs.forEach(h => expect(Object.keys(ROUTE_SECTIONS)).toContain(h));
  });
  it.each(Object.entries(TARGET))('%s shows section #%s and only that section', (href, id) => {
    activateRoute(href);
    expect(document.getElementById(id)!.classList.contains('route-hidden')).toBe(false);
    expect(ROUTE_SECTIONS[href]).toEqual([id]);
  });
  it('a tap on the button for the route already open scrolls to the section again', () => {
    window.location.hash = '#/firstaid'; activateRoute('#/firstaid');
    const scroll = vi.spyOn(window, 'scrollTo'); initEmergencyFab();
    document.querySelector<HTMLAnchorElement>('#emergencyFabPanel a[href="#/firstaid"]')!.click();
    expect(scroll).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2:** Run `npx vitest run src/__tests__/router.test.ts`. Expected: FAIL (hrefs are `#firstaid`, `#shelter`, `#showthis`; no `#/firstaid` route).
- [ ] **Step 3:** Add the route and redirects, change the three hrefs, and in `emergency-fab.ts` call `activateRoute(location.hash)` when a panel link's `href` equals `location.hash`.
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: all PASS.
- [ ] **Step 5:** Commit `fix(nav): emergency buttons open first aid, evacuation site and show-this directly`.

### Task 3: Page without JavaScript (`feat/aditya/noscript-emergency-numbers`)

**Files:**
- Modify: `index.html` (after the skip link, before `<nav class="navbar">`)
- Modify: `css/base.css` (`.noscript-note [data-lang] { display: block; }`, tel links `min-height: 44px`)
- Modify: `src/contacts.ts:19` (`export const contacts`)
- Modify: `docs/superpowers/specs/2026-11-21-remaining-verification.md` (rows X2 to X5)
- Test: `src/__tests__/offline.test.ts`

**Interfaces:**
- Produces: `export const contacts: Contact[]` from `src/contacts.ts`.

Copy (spans use `data-lang` so the copy tests read them; `lang="ja"`/`lang="id"` on those spans):

| Line | en | ja | id |
|---|---|---|---|
| Intro | This guide needs JavaScript. Turn on JavaScript in your browser settings. | このガイドは、JavaScriptが必要です。ブラウザの設定で、JavaScriptをオンにしてください。 | Panduan ini butuh JavaScript. Aktifkan JavaScript di pengaturan browser. |
| Lead | In an emergency, call these numbers: | 緊急（きんきゅう）のときは、この番号に電話してください： | Saat darurat, telepon nomor ini: |
| 110, 119, 118 | `desc_en` from `contacts.ts` | `desc_ja` | `desc_id` |
| 171 | Disaster Emergency Message Dial | `name_ja` | Layanan Pesan Darurat Bencana |

Each number is `<a href="tel:NNN">NNN</a>` before its spans, in a `<ul>`.

- [ ] **Step 1: Write the failing tests** in a `describe('without JavaScript')`:
  - `index.html has one noscript block, before the navbar`: one `<noscript>` match; its index is after `<body` and before `<nav class="navbar"`.
  - `gives 110, 119, 118 and 171 as tap-to-call links`: the noscript inner HTML (parsed into a `<template>`) has `a[href="tel:110"]`, `tel:119`, `tel:118`, `tel:171`.
  - `uses the certified contact text in all three languages`: for 110, 119, 118 the text contains the `contacts` entry's `desc_en`, `desc_ja`, `desc_id`; for 171 it contains `name_ja` and both names without ` (171)`.
  - `shows all three languages, because no script sets the language`: `css/base.css` has a rule `.noscript-note [data-lang]` with `display: block`.
- [ ] **Step 2:** Run `npx vitest run src/__tests__/offline.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Add the block, the CSS and the export. Add rows X2 (110, keishicho-110), X3 (119, jnto-mi-guide), X4 (118, kaiho-118), X5 (171 name, ntt-east-171-intro) with the same quotes and gists as rows R9, R14 and R65 to R69, verdict `match`, File:line `index.html:<line>`.
- [ ] **Step 4:** Run `npm test` (copy-rules and glossary include the new spans), `npx tsc --noEmit`, `npm run build`. Expected: all PASS.
- [ ] **Step 5:** Commit `feat: page without JavaScript shows the emergency numbers`.

### Task 4: Cache name from the build (`chore/aditya/sw-cache-stamp`)

**Files:**
- Modify: `scripts/vite-sw-manifest.ts` (export helpers, stamp in `writeBundle`)
- Modify: `public/sw.js:1` (`const CACHE_NAME = 'mamoru-guide-dev';`)
- Modify: `README.md:43` (remove the CACHE_NAME line; say the build stamps the cache name, so each deploy refreshes the offline copy)
- Modify: `package.json` (`"build": "tsc --noEmit && tsc -p scripts --noEmit && vite build"`, so script tests are type-checked)
- Create: `scripts/__tests__/vite-sw-manifest.test.ts` (Vitest finds it; import `describe/it/expect` from `vitest`, because `scripts/tsconfig.json` has no globals)

**Interfaces:**
- Produces: `export function buildHash(files: ReadonlyArray<{ path: string; content: Uint8Array | string }>): string` (12 lowercase hex, order-independent).
- Produces: `export function stampCacheName(sw: string, hash: string): string` (replaces the one `const CACHE_NAME = '…';` line; throws `Error` with "CACHE_NAME" in the message when there is not exactly one).

- [ ] **Step 1: Write the failing tests:**

```ts
it('stamps the build hash into CACHE_NAME', () => {
  expect(stampCacheName("const CACHE_NAME = 'mamoru-guide-dev';\nconst X = 1;", 'abc123def456'))
    .toBe("const CACHE_NAME = 'mamoru-guide-abc123def456';\nconst X = 1;");
});
it('refuses a worker without exactly one CACHE_NAME line', () => {
  expect(() => stampCacheName('const X = 1;', 'abc123def456')).toThrow(/CACHE_NAME/);
  expect(() => stampCacheName("const CACHE_NAME = 'a';\nconst CACHE_NAME = 'b';", 'abc123def456')).toThrow(/CACHE_NAME/);
});
it('gives the same hash for the same files in any order', () => {
  const a = { path: 'index.html', content: 'x' }, b = { path: 'assets/a.js', content: 'y' };
  expect(buildHash([a, b])).toBe(buildHash([b, a]));
  expect(buildHash([a, b])).toMatch(/^[0-9a-f]{12}$/);
});
it('changes the hash when one file changes', () => {
  expect(buildHash([{ path: 'index.html', content: 'x' }])).not.toBe(buildHash([{ path: 'index.html', content: 'z' }]));
});
it('the source worker keeps the placeholder, and the README has no manual bump', () => {
  expect(read('public/sw.js')).toContain("const CACHE_NAME = 'mamoru-guide-dev';");
  expect(read('README.md')).not.toContain('CACHE_NAME');
});
```

- [ ] **Step 2:** Run `npx vitest run scripts/__tests__/vite-sw-manifest.test.ts`. Expected: FAIL (no exports).
- [ ] **Step 3:** Implement with `node:crypto` `createHash('sha256')`. In `writeBundle`, after writing `asset-manifest.json`, read every file under the out dir except `sw.js`, compute `buildHash`, and write the stamped `sw.js`.
- [ ] **Step 4:** Run `npm test` and `npm run build`. Then `grep -o "mamoru-guide-[0-9a-f]\{12\}" dist/sw.js`. Expected: one match. Run the build again with no change; expected: the same name.
- [ ] **Step 5:** Commit `build: stamp the service worker cache name with a build hash`.

### Task 5: Leaflet from the app's own files (`feat/aditya/vendor-leaflet`)

**Files:**
- Create: `public/vendor/leaflet/leaflet.js`, `leaflet.css`, `LICENSE`, `images/layers.png`, `images/layers-2x.png`, `images/marker-icon.png`, `images/marker-icon-2x.png`, `images/marker-shadow.png`
- Modify: `src/shelter-finder.ts:98-119` (`loadLeaflet`)
- Modify: `public/sw.js:2-10` (`PRECACHE`)
- Test: `src/__tests__/offline.test.ts`

**Interfaces:**
- Produces: `export const LEAFLET_SRI = { js: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=', css: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=' } as const`.
- Produces: helper `publicFiles(dir: string, skip: RegExp): string[]` in `offline.test.ts`, returning `./`-prefixed paths. Task 6 reuses it.

- [ ] **Step 1: Write the failing tests** (replace "Leaflet from the CDN is pinned by hash"):
  - `loads Leaflet from the vendored copy, pinned by hash`: link `href` ends with `vendor/leaflet/leaflet.css`, script `src` ends with `vendor/leaflet/leaflet.js`, neither contains `unpkg`, `integrity` equals `LEAFLET_SRI.css` / `LEAFLET_SRI.js`.
  - `the vendored files are the published Leaflet 1.9.4`: base64 SHA-256 of `public/vendor/leaflet/leaflet.js` and `leaflet.css` equals the `LEAFLET_SRI` values without `sha256-`.
  - `precaches every vendored Leaflet file`: `install()` result contains `publicFiles('vendor/leaflet', /LICENSE$/)` (7 files).
  - `every precached path exists, so one missing file cannot break the install`: each `PRECACHE` entry exists under `public/`, except `./` and `./index.html` (which is `index.html` at the repo root).
  - `no source file requests unpkg.com`: no file in `src/` contains `unpkg.com`.
- [ ] **Step 2:** Run `npx vitest run src/__tests__/offline.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Copy the files byte for byte from the npm tarball (do not strip the `sourceMappingURL` line; it would break the hash):

```bash
T=$(mktemp -d) && (cd "$T" && npm pack leaflet@1.9.4 --silent && tar xzf leaflet-1.9.4.tgz)
mkdir -p public/vendor/leaflet/images
cp "$T"/package/dist/leaflet.{js,css} public/vendor/leaflet/
cp "$T"/package/dist/images/*.png public/vendor/leaflet/images/
cp "$T"/package/LICENSE public/vendor/leaflet/LICENSE
```

  In `loadLeaflet`, build URLs from `import.meta.env.BASE_URL + 'vendor/leaflet/'`, keep `integrity`, drop `crossOrigin`. Add the 7 files to `PRECACHE`.
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: all PASS; `ls dist/vendor/leaflet/images` lists 5 PNG files.
- [ ] **Step 5:** Commit `feat(shelter): vendor Leaflet 1.9.4 so the map script works offline`.

### Task 6: Self-hosted font subsets (`feat/aditya/self-host-fonts`)

**Files:**
- Create: `scripts/font-chars.ts` (pure, `node:fs` only), `scripts/build-fonts.ts` (generator), `scripts/subset-font.d.ts` (module types), `scripts/fonts-manifest.json` (generated), `scripts/__tests__/font-subset.test.ts`
- Create (generated): `public/fonts/PressStart2P-Regular.woff2`, `DotGothic16-Regular.woff2`, `MPLUSRounded1c-Regular.woff2`, `MPLUSRounded1c-Bold.woff2`, `MPLUSRounded1c-ExtraBold.woff2`, `OFL-PressStart2P.txt`, `OFL-DotGothic16.txt`, `OFL-MPLUSRounded1c.txt`
- Create: `css/fonts.css` (five `@font-face`, `url('/fonts/…') format('woff2')`, `font-display: swap`, weights 400/400/400/700/800)
- Modify: `index.html:28-29` (remove the Google Fonts link and comment; link `css/fonts.css` first)
- Modify: `public/404.html:8` (inline `@font-face` with `/mamoru-guide/fonts/…` for Press Start 2P, DotGothic16, M PLUS 400 and 700)
- Modify: `public/sw.js` (`PRECACHE` + 5 woff2), `package.json` (`"fonts": "vite-node scripts/build-fonts.ts"`; devDependencies `subset-font@^2.9.0`, `harfbuzzjs@^1.6.4`, `fontverter@^2.1.0`), `.gitignore` (`scripts/.font-cache/`), `README.md` (one line: run `npm run fonts` after a text change adds a character; it needs the internet once)
- Modify: `src/__tests__/fonts.test.ts:41-44,92-111` and `src/__tests__/offline.test.ts` (Google Fonts tests)

**Interfaces:**
- Produces (`font-chars.ts`): `collectAppChars(root: string): Set<string>`: every character of `index.html`, `public/404.html`, `css/*.css` and non-test `src/**/*.ts`, plus U+0020-007E, U+3000-303F, U+3040-309F, U+30A0-30FF, U+FF01-FF5E; minus `\p{Extended_Pictographic}`, `\p{Regional_Indicator}`, U+200D, U+FE0F, U+20E3 and `\p{Cc}` (emoji draw from the system emoji font).
- Produces: `shelterChars(root: string): Set<string>`: characters of every site name and address in `src/data/shelters.json`.
- Produces: `scripts/fonts-manifest.json` shape `{ source: string; chars: { app: string; shelters: string }; files: Record<string, { bytes: number; missing: string }> }`. `missing` = input characters above U+007E that the source font has no glyph for (HarfBuzz `Face.collectUnicodes()`).
- Source fonts, from `https://raw.githubusercontent.com/google/fonts/06bfe0d62a98375cb09c942fa18e68bd32cff057/ofl/`:

| Output | Path | SHA-256 | Mode |
|---|---|---|---|
| PressStart2P-Regular | `pressstart2p/PressStart2P-Regular.ttf` | `034c77f1f05ec89421e4a63f0e3a4ca1ecf852cc6d2bf611f126f275728e017d` | lossless (`fontverter`) |
| DotGothic16-Regular | `dotgothic16/DotGothic16-Regular.ttf` | `3ad9af88726d42b40f7f365f0dcac785af73cf20ea6f1d5b44e57cc21150b8f1` | subset: app |
| MPLUSRounded1c-Regular | `mplusrounded1c/MPLUSRounded1c-Regular.ttf` | `fd003ca21668b7f1ab5665accd1a785587b75e18b8edff65c663fa6facefd882` | subset: app + shelters |
| MPLUSRounded1c-Bold | `mplusrounded1c/MPLUSRounded1c-Bold.ttf` | `c698330e24aadd0da80cab1f321eee9c052d41b66ef84e7e5379e81fb084a890` | subset: app + shelters |
| MPLUSRounded1c-ExtraBold | `mplusrounded1c/MPLUSRounded1c-ExtraBold.ttf` | `990f04475a93ef0c7a3fadbaa3307d449172c75ca7c0f9bd754c614b93190e15` | subset: app |

  OFL files: `pressstart2p/OFL.txt` and `dotgothic16/OFL.txt` as published. google/fonts has no OFL.txt for M PLUS Rounded 1c, so write its copyright line from the font ("Copyright 2016 The Rounded M+ Project Authors.") followed by the OFL 1.1 text from line 2 of the DotGothic16 file.

- [ ] **Step 1: Write the failing tests.** In `font-subset.test.ts`:

```ts
const KNOWN_MISSING: Record<string, string> = {
  'DotGothic16-Regular.woff2': '⊞✓✗Ōūīōā',
  'MPLUSRounded1c-Regular.woff2': '⊞刎㈱簑蹊塚', 'MPLUSRounded1c-Bold.woff2': '⊞刎㈱簑蹊塚',
  'MPLUSRounded1c-ExtraBold.woff2': '⊞',
};
it('the subsets cover every character of the app text', () => {
  const have = new Set(manifest.chars.app);
  expect([...collectAppChars(ROOT)].filter(c => !have.has(c)).join(''), 'run npm run fonts').toBe('');
});
it('the M PLUS 400 and 700 subsets cover every shelter name and address', () => {
  const have = new Set(manifest.chars.shelters);
  expect([...shelterChars(ROOT)].filter(c => !have.has(c)).join(''), 'run npm run fonts').toBe('');
});
it('no app character is missing from a source font, except the known ones', () => {
  for (const [file, known] of Object.entries(KNOWN_MISSING))
    expect([...manifest.files[file].missing].filter(c => !known.includes(c)).join(''), file).toBe('');
});
it('every subset file exists, matches the manifest, and all fonts stay under 900 KiB', () => {
  let total = 0;
  for (const [file, { bytes }] of Object.entries(manifest.files)) { expect(statSync(`public/fonts/${file}`).size, file).toBe(bytes); total += bytes; }
  expect(total).toBeLessThanOrEqual(900 * 1024);
});
```

  In `fonts.test.ts`, replace the Google Fonts tests with: `loadedFamilies` reads the `@font-face` families of `css/fonts.css`; `every @font-face points to a woff2 file in public/fonts, with font-display: swap` (for `css/fonts.css` `/fonts/X` and `public/404.html` `/mamoru-guide/fonts/X`); `index.html and the 404 page make no request to fonts.googleapis.com or fonts.gstatic.com`; `each font has its OFL file` (three `OFL-*.txt` contain "SIL Open Font License, Version 1.1"). In `offline.test.ts`, replace the CORS test with `precaches every font` (`install()` contains `publicFiles('fonts', /\.txt$/)`).
- [ ] **Step 2:** Run `npx vitest run scripts/__tests__/font-subset.test.ts src/__tests__/fonts.test.ts src/__tests__/offline.test.ts`. Expected: FAIL (no manifest, no `css/fonts.css`).
- [ ] **Step 3:** Run `npm install -D subset-font@^2.9.0 harfbuzzjs@^1.6.4 fontverter@^2.1.0`. Write `font-chars.ts`, `subset-font.d.ts` and `build-fonts.ts`. The script downloads each source to `scripts/.font-cache/` once, stops when a SHA-256 differs, writes the woff2 files, OFL files and manifest, and prints each file size.
- [ ] **Step 4:** Run `npm run fonts`. Expected: sizes within a few KB of the targets in "Font size targets", total about 770 KiB.
- [ ] **Step 5:** Add `css/fonts.css`, change `index.html`, `404.html` and `PRECACHE`. Run `npm test`, `npx tsc --noEmit`, `npm run build`. Then `grep -o "/mamoru-guide/fonts/[A-Za-z0-9-]*\.woff2" dist/assets/index-*.css | sort -u`. Expected: 5 lines (Vite prefixes the base on public URLs in CSS).
- [ ] **Step 6:** Commit `feat(fonts): self-host font subsets so text reads the same offline`.

## Visual checks (controller, Claude in Chrome, after Task 6)

Run `npm run build && npm run preview`. Check at 390px and 1280px, in en, ja and id, day and night mode:

1. Shelter finder: visit once online, then go offline (DevTools "Offline" or airplane mode) and reload. Expected: the page loads; "Find" lists 5 sites; the map box shows the map note in the chosen language. Deny location: the area list shows the reason. Throttle tiles to fail online: the note shows above the map.
2. Fonts: visit once, go offline, reload. Expected: pixel headings, DotGothic16 sentences and M PLUS body text look the same as online; DevTools Network shows no request to Google.
3. noscript: disable JavaScript in DevTools and reload. Expected: the note with three languages and 4 tap-to-call numbers shows above the navbar, readable in day and night mode, with no overflow at 390px.
4. Emergency buttons: open the 🆘 button and tap each of First Aid, Evacuation Site and Show This. Expected: each opens its section at the top with the heading visible. Scroll down on `#/firstaid` and tap First Aid again: the page goes back to the section top.
5. Update: deploy-like rebuild with one text change, reload twice. Expected: the "new version" toast shows, and the offline copy has the new text.

## Order of work

1. Task 1, Task 2, Task 3 (no new app files), in that order.
2. Task 4, so every later deploy gets a new cache name.
3. Task 5, then Task 6 (both change `PRECACHE` and `offline.test.ts`; stack them).
4. The visual checks.
