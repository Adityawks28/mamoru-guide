# MAMORU GUIDE — Full Codebase Audit (Round 2)

**Date:** 2026-06-21
**Method:** Five parallel read-only audit agents — safety-critical logic, accessibility, security/privacy, mobile/CSS, and PWA/i18n/tests — over the current tree (post mobile-fix + SW-rewrite + mascot-emote commits).
**Baseline:** `docs/superpowers/specs/2026-06-20-full-app-evaluation.md`. Findings tagged NEW / KNOWN (still open) / FIXED.

---

## TL;DR

The June-20 life-threatening items are **all fixed and verified in code** (CPR depth, shock, burns, impossible bag score, inverted theme init, `<html lang>`, mascot keyboard access, seizure-flash, timer/listener leaks, CI-runs-tests, i18n 90/90 parity). The recent mobile + SW + emote work is coherent with no regressions.

What remains clusters in three themes: **(1) the EARTHQUAKE NOW emergency dialog is not keyboard/screen-reader operable** (the single most important gap — it's the life-critical surface); **(2) several infinite animations on emergency/critical screens still lack `prefers-reduced-motion` guards**; **(3) a handful of correctness/data-hygiene + PWA-offline + pre-emptive-XSS issues** before external data lands.

---

## CRITICAL

### C1 — EARTHQUAKE NOW dialog is not keyboard/SR operable · `src/earthquake-now.ts:71-124`, `index.html` *(NEW)*
`#earthquakeNow role="dialog"` has no `aria-modal`, no focus-in on open, no focus trap, no Escape-to-close, no focus restore. Keyboard and screen-reader users cannot navigate or dismiss the app's life-critical fullscreen guide. **Fix:** mirror the working modal pattern in `src/show-plan.ts:36-105` (set `aria-modal`, focus the close button, trap Tab, bind Escape, restore prior focus).

---

## HIGH

### H1 — Infinite pulses on the emergency screen, no reduced-motion guard · `css/emergency-mode.css:46,77` *(KNOWN, still open)*
`em-pulse` (title) and `em-call-pulse` (Call-119 card) animate `infinite` with no guard — exactly where motion-sensitive users are most vulnerable. **Fix:** `@media (prefers-reduced-motion: reduce){ .em-title,.em-card-primary{animation:none} }`.

### H2 — `aria-hidden` wraps a focusable button (WCAG 4.1.2) · `index.html:433` + `src/character/mascot.ts:70-72` *(NEW)*
Host `#mascot` has `aria-hidden="true"` but contains `role="button" tabindex="0"` — a focusable element hidden from the a11y tree = phantom tab stop, unnamed to SR. **Fix:** remove `aria-hidden` from the host (the sprite already has a proper label), or make the sprite `tabindex="-1"` and drop the button role.

### H3 — 11 infinite shake/pulse animations, no reduced-motion guard · `css/earthquake-scale.css` *(KNOWN, still open)*
`shake1`–`shake7` (translate+rotate) and `pulse7` run infinitely with zero `prefers-reduced-motion` coverage — vestibular-trigger risk. **Fix:** add a reduced-motion block setting `.scale-row`/`.shake-demo { animation: none }`.

### H4 — Undefined CSS token in hero gradient · `css/hero-arcade.css:25` *(NEW)*
`.kobe-scene` gradient references `var(--harbor-mid)` which is **never defined** (no fallback), and day-mode never sets it → invalid color stop. **Fix:** define `--harbor-mid` in `css/variables.css` `:root` + `body.day-mode`, or inline a fallback `var(--harbor-mid,#1a2f55)`.

### H5 — Dead/dropped plan field · `src/plan-storage.ts:22-78` *(NEW)*
`documents.storageLocation` is never populated by `migrateV1ToV2` and has no wizard field in `emergency-plan.ts`; any v1 value is silently dropped and the model field is permanently empty. **Fix:** either map a v1 key into it (and add a wizard field) or remove it from `PlanDocuments` so the schema matches reality.

### H6 — Pre-emptive XSS before external data lands · `src/shelter-finder.ts:155,188-195` *(NEW, latent)*
Leaflet popups and the list build HTML via template strings from `s.name`/`name_en`/`address`. Safe **today** (static bundled array), but this is the exact sink that becomes DOM-XSS the moment shelter/hazard data is fetched (the planned alert feed). **Fix:** escape these fields (or use `textContent`/safe Leaflet bindings) now, and make "never `innerHTML` fetched JSON" a rule for the upcoming hazard-map code.

---

## MEDIUM

| # | Issue | Location | Tag | Fix |
|---|---|---|---|---|
| M1 | Router moves no focus on route change; SR users stranded on hidden view | `src/router.ts:38-74` | NEW | After activating a route, focus its `<h1>` (`tabindex="-1"`) and/or add an `aria-live` route announcer |
| M2 | `--alert-red #e84040` not overridden in day-mode → ~3.4:1, fails 4.5:1 for small red text | `css/variables.css` | NEW | Add a darker day-mode `--alert-red` (e.g. `#c01818`) |
| M3 | Emergency FAB panel has no Escape / focus-in on open | `src/emergency-fab.ts` | KNOWN | Add Escape-to-close + focus first item (copy `nav.ts`) |
| M4 | SW never precaches hashed JS/CSS via `asset-manifest.json` → first offline load after install misses bundles | `public/sw.js:2-8` | KNOWN | Fetch `asset-manifest.json` in `install`, add its entries to `cache.addAll` |
| M5 | SW cache-first caches **any** cross-origin `ok` GET (unpkg Leaflet, OSM tiles) unbounded into the versioned cache | `public/sw.js` (cache-first branch) | NEW | Cache same-origin only, or use a separate size-capped runtime cache for tiles |
| M6 | "EARTHQUAKE NOW" buries tsunami/high-ground at step 7 — most time-critical action for coastal users | `src/earthquake-now.ts` | NEW | Surface the tsunami/high-ground step immediately after "shaking stops" |
| M7 | Drill "Expert" tier `pct>=0.9` unreachable for the 6-scenario drill (5/6=0.833 → drops a tier) | `src/drill.ts:281` | NEW | Use count-based thresholds (e.g. `>=5/6`) |
| M8 | Sub-44px tap targets: `.lang-btn` 36px (shrinks at 480px), `.section-chip` 36px, EQ-now close 40px | `css/layout.css:146,238`, `css/earthquake-now.css:39` | NEW | Raise to ≥44×44 |
| M9 | Missing reduced-motion guards: `tabIn`/`fcSlideIn` (vocab), `timerPulse` (first-aid), `shelterSpin` (shelter) | `css/vocab.css`, `css/first-aid.css`, `css/shelter-finder.css` | KNOWN | Add per-file reduced-motion blocks |
| M10 | Highest-value **untested** logic: shelter haversine/`walkMinutes`/`formatDistance`; bag scoring band; i18n key-parity | `src/shelter-finder.ts:26-48`, `src/bag-game.ts:125`, locales | NEW | Add unit tests (pure, deterministic, safety-relevant) |
| M11 | Untranslated hard-coded strings: `'Link copied!'`/share text; shelter `typeLabels` English-only in JA/ID | `src/main.ts:16-30`, `src/shelter-finder.ts:58-64` | NEW | Route through `t()`/`getLangText` |
| M12 | Storage keys bypass typed `StorageSchema`: `mamoru-drill-best`, `mamoru-shelter-last-location`; `motion.ts` uses `a11y-reduced-motion` vs schema's `mamoru-a11y` | `src/drill.ts:286`, `src/shelter-finder.ts:85`, `src/motion.ts:1` | KNOWN | Declare keys in `StorageSchema`, route through `getItem/setItem` |

---

## LOW

| # | Issue | Location | Fix |
|---|---|---|---|
| L1 | SWR may persist redirected/opaque responses (cache poisoning surface) | `public/sw.js:47,55` | Gate on `response.type==='basic' && !response.redirected` and same-origin |
| L2 | No CSP `<meta>` and no SRI on unpkg Leaflet / Google Fonts | `index.html` | Add CSP meta + `integrity`/`crossorigin` on third-party tags |
| L3 | `serviceWorker.register` has no `.catch` (unhandled rejection) | `src/main.ts:78` | `.catch(()=>{})` |
| L4 | Theme toggle has no `aria-pressed`; label static regardless of mode | `index.html:76,91` | Toggle `aria-pressed` + label |
| L5 | "Tape windows in an X" (typhoon) is debunked advice | `src/character/tips.ts:51`, `src/data.ts` | Replace with "close shutters / move away from windows" |
| L6 | `theme_color` mismatch: manifest `#f5a623` vs `<meta>` `#0f1f3d` | `public/manifest.json`, `index.html:10` | Reconcile |
| L7 | OG image is SVG (unsupported by socials); no apple-PWA meta; sitemap 1 URL | `index.html:16` | Add 1200×630 PNG, apple meta, JSON-LD |
| L8 | `emergency-fab` adds a `document` click listener per init (stacks if re-inited) | `src/emergency-fab.ts:14` | Guard double-init |
| L9 | `id.ts` `nav.shelter` = `"Shelter"` (identical to EN) | `src/locales/id.ts` | Localize if intended |
| L10 | `placeholder.test.ts` is `expect(true).toBe(true)` dead weight | `src/__tests__/placeholder.test.ts` | Remove |

---

## Verified FIXED since 2026-06-20 (no regressions)

CPR depth (age-differentiated) · shock (blood-loss vs breathing) · burns ("cover loosely") · impossible bag perfect-score · inverted theme init + `prefers-color-scheme` auto-detect · `<html lang>` updates · mascot keyboard access · `aria-current` · seizure flash (`alertBlink`→gentle `alertFade`, guarded) · first-aid/drill/mascot/scene timer & listener leaks · CI + deploy both run tests+build · mobile theme-toggle tap-swallow · horizontal overflow (root `overflow-x: clip`) · i18n 90/90 en/ja/id parity · plan storage round-trip + v1→v2 migration + corrupt-JSON fallback · flashcard `aria-live`.

---

## Recommended next batch (small, safe, high-impact)

1. **C1** — focus management for the EARTHQUAKE NOW dialog (reuse `show-plan.ts`).
2. **H1 + H3 + M9** — one sweep adding `prefers-reduced-motion` guards to `emergency-mode.css`, `earthquake-scale.css`, `vocab.css`, `first-aid.css`, `shelter-finder.css`.
3. **H2 + H4** — remove the mascot `aria-hidden`; define `--harbor-mid`.
4. **H6** — escape shelter fields now (pre-empt the fetched-data XSS path).
5. **M10** — add shelter distance-math + i18n-parity unit tests to lock in correctness.

Everything above is read-only analysis — no files were modified.
