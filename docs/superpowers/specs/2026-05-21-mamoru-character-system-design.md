# Mamoru Character System — Design

**Date:** 2026-05-21
**Status:** Approved (brainstorming)
**Scope:** Port the Moru & Mamo pixel-character system from the React/JSX prototype at `/Users/aditya/Downloads/mamoru_guide_design/` into the existing vanilla-TS `mamoru-guide` project.

## 1. Goal

Integrate the Moru & Mamo character system into `mamoru-guide` without disturbing existing modules, adopting only the character layer (sprites, mascot behaviors, scenario sprites, Character Bible page). No broader visual overhaul.

## 2. Constraints

- **Zero new runtime dependencies.** Existing project ships zero runtime deps; this stays true. No React, no Preact.
- **TypeScript strict mode**, Vite, Vitest + jsdom — existing build chain unchanged.
- **i18n: EN / JA / ID.** All tip bubbles render via the existing `data-lang="en|ja|id"` span pattern that `src/lang.ts` toggles.
- **Reduced motion.** Honors both `prefers-reduced-motion: reduce` AND the project's existing `a11y-reduced-motion` storage key (currently declared in `src/storage.ts` but unconsumed; this work activates it).
- **Casual outfit only.** No `college` / `yukata` / `batik` branches in `sprite.ts`. Bible showcases the 14 poses × both genders in casual.
- **Faithful visual spec, not literal port.** Prototype JSX files (`mamoru-scenarios.jsx`, `mascot.jsx`, `character-bible.jsx`) are the source of truth for SVG geometry, palette, and pose math, ported into idiomatic TS.

## 3. Architecture

### File layout

```
src/character/
├── sprite.ts            # core SVG builder, pose presets, palette constants
├── tips.ts              # tip pools (EN/JA/ID) — QUAKE/FIRSTAID/TYPHOON/BAG/DISASTER_FACTS
├── motion.ts            # reduced-motion gate
├── mascot.ts            # initMascot() — hero
├── earthquake-scene.ts  # initEarthquakeScene()
├── firstaid-scene.ts    # initFirstAidScene()
├── typhoon-scene.ts     # initTyphoonScene()
├── bag-scene.ts         # initBagScene()
└── bible.ts             # initBible() — pose grid, anatomy, do/don't

css/
├── character.css        # sprite pixelation, hero motion, tip-bubble, hearts/ripples
└── character-bible.css  # bible-only layout
```

### Mount points (additions to `index.html`)

| Section | New element |
|---|---|
| `#hero` | `<div id="mascot" class="mascot" aria-hidden="true"></div>` over the existing skyline |
| `#earthquake` | `<div id="earthquake-scene" class="character-scene"></div>` next to the shindo scale |
| `#firstaid` | `<div id="firstaid-scene" class="character-scene"></div>` inside the first-aid panel |
| `#typhoon` | `<div id="typhoon-scene" class="character-scene"></div>` |
| `#bag` | `<div id="bag-scene" class="character-scene"></div>` |
| (new section) | `<section class="section" id="bible">` |

A new nav link `Bible / 図鑑 / Buku` is added to the existing header nav.

### Wire-up in `src/main.ts`

Add six imports + six init calls (`initMascot`, `initEarthquakeScene`, `initFirstAidScene`, `initTyphoonScene`, `initBagScene`, `initBible`) after the existing inits. Each init is a no-op if its mount element is absent — additive only.

### Event bridge

Existing modules emit one `CustomEvent` line each on `document`:

| Module | Event | Detail |
|---|---|---|
| `src/earthquake-scale.ts` | `mamoru:shindo` | `{ shindo: number \| null }` (0–7 or null on deactivate) |
| `src/bag-game.ts` | `mamoru:bag-weight` | `{ weight: number, status: 'ok' \| 'over' \| 'perfect' }` |
| `src/first-aid.ts` | `mamoru:firstaid-step` | `{ step: 'choking' \| 'recovery' \| 'cpr' \| null }` |
| `src/typhoon.ts` | `mamoru:typhoon-stage` | `{ stage: 'prep' \| 'warning' \| 'evac' \| null }` |

Scene files subscribe via `document.addEventListener('mamoru:*', …)`. No other changes to existing modules.

## 4. Core contracts

### `sprite.ts`

```ts
export type Pose =
  | 'stand' | 'brace' | 'cover' | 'hide' | 'headcover'
  | 'crouch' | 'kneel' | 'run' | 'walk' | 'tired'
  | 'phone' | 'reach' | 'thrust' | 'choke';
export type Gender = 'male' | 'female';
export type Emote =
  | 'idle' | 'wave' | 'jump' | 'spin' | 'peace' | 'burst' | 'bow';

export interface SpriteOptions {
  pose: Pose;
  gender: Gender;
  emote?: Emote;
  flip?: boolean;
  tilt?: number;
  blink?: boolean;
  pupil?: { x: number; y: number };
}

export function createSprite(opts: SpriteOptions): SVGSVGElement;
export function updateSprite(svg: SVGSVGElement, opts: Partial<SpriteOptions>): void;
```

Direct port of `MiniMamoru` from `mamoru-scenarios.jsx`: 64×96 viewBox, `shape-rendering="crispEdges"`, anatomy bounds and palette per Character Bible (skin `#f5d5a8`, hair `#2a1a08`, tee `#4a8aba`, persimmon `#f5a623`, pants `#1a1a3a`, ink `#1a1a1a`). Pose presets are a single `Record<Pose, PosePreset>` object literal where `PosePreset` carries `armRotL`, `armRotR`, and leg geometry. Hair branches on `gender`; outfit is implicit casual.

### `tips.ts`

```ts
export interface Tip { en: string; ja: string; id: string; }

export const QUAKE_TIPS: Tip[];
export const BAG_TIPS: Tip[];
export const MAP_TIPS: Tip[];
export const FIRSTAID_TIPS: Tip[];
export const TYPHOON_TIPS: Tip[];
export const DISASTER_FACTS: Tip[];
```

EN/JA strings ported verbatim from the prototype's tip pools. ID translations written fresh (~60–80 strings total). Tip bubbles render as:

```html
<div class="tip-bubble">
  <span data-lang="en">…</span>
  <span data-lang="ja">…</span>
  <span data-lang="id">…</span>
</div>
```

`src/lang.ts` already handles `data-lang` visibility — no new i18n plumbing.

### `motion.ts`

```ts
export function motionAllowed(): boolean;
export function onMotionChange(cb: (allowed: boolean) => void): void;
```

Returns `false` if `window.matchMedia('(prefers-reduced-motion: reduce)').matches` OR `localStorage.getItem('a11y-reduced-motion') === 'true'`. `onMotionChange` subscribes to the media-query `change` event and to `window`'s `storage` event so cross-tab toggles propagate. When motion flips off, scenes detach their listeners and freeze sprites at their rest pose.

## 5. Hero — `mascot.ts`

- Casual Moru in default `stand`.
- Cursor-tracking pupils: max ±1.5 px x, ±1 px y, recomputed on `mousemove`.
- Blink loop: every 2.4–6 s (random within range), eyes close for 130 ms.
- Click cycles emotes (`wave → jump → spin → peace → burst → bow`), each one-shot, then returns to `stand`.
- Fact rotator: pulls from `DISASTER_FACTS`, advances every 7 s and on click.
- Hover hearts + tap ripples: CSS animations triggered by JS class toggles.
- Motion gate: `motionAllowed() === false` ⇒ static `stand`, no cursor listener, no blink loop, no rotation timer, first fact shown statically, hearts/ripples disabled.

## 6. Scenes

### Pose-source precedence

Scroll progress drives the pose by default. When the user interacts with the section's existing control, the pose snaps to the corresponding state-driven pose and locks there for **4 s**. After 4 s of inactivity, scroll-progress takes over again. The tip bubble reflects the most recent driver (state interaction or scroll progress).

### Per-scene mapping

| Scene | Gender | Scroll-progress pose curve | State trigger | State → pose | Tip pool |
|---|---|---|---|---|---|
| `earthquake-scene` | Moru | `stand → brace → cover → hide → headcover` mapped across 0–1 progress | `mamoru:shindo` | 0–2 → `stand`, 3 → `brace`, 4–5 → `cover`, 6 → `hide`, 7 → `headcover` | `QUAKE_TIPS` |
| `firstaid-scene` | Mamo | `stand → kneel → reach → thrust` mapped across 0–1 progress | `mamoru:firstaid-step` | `choking` → `thrust`, `recovery` → `kneel`, `cpr` → `reach`, `null` → `stand` | `FIRSTAID_TIPS` |
| `typhoon-scene` | Moru | `stand → phone → walk → tired` | `mamoru:typhoon-stage` | `prep` → `phone`, `warning` → `walk`, `evac` → `tired` | `TYPHOON_TIPS` |
| `bag-scene` | Moru | (no scroll cycle — state-only) | `mamoru:bag-weight` | `ok` → `stand`, `over` → `tired`, `perfect` → `peace` (one-shot, returns to `stand`) | `BAG_TIPS` |

### Scene module contract

Each scene module exports `init{Name}Scene(): void`:

1. Look up its mount element by ID. If absent, return.
2. Mount the sprite via `createSprite`. Append the tip bubble next to it.
3. Subscribe to `onMotionChange`:
   - If motion allowed: attach `IntersectionObserver` for scroll progress (RAF-throttled) and `addEventListener` for the state event.
   - If motion not allowed: render rest pose + first tip statically.
4. On state event: update pose + tip, set a 4 s timer; the timer resets on each new state event.
5. While the timer is active, scroll-progress is ignored; when it expires, scroll-progress resumes.

## 7. Scroll wiring

### Reveal-in

`css/character.css` styles `.character-scene { opacity: 0; transform: translateY(8px); transition: opacity 400ms, transform 400ms; }` and `.section.visible .character-scene { opacity: 1; transform: none; }`. Rides the existing `initScrollReveal()` `IntersectionObserver` — no new observer for reveal.

### Scroll-progress cycle

Each scene attaches its own `IntersectionObserver` with `threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]`. On change, it reads `getBoundingClientRect().top` relative to viewport and computes a 0–1 progress value, RAF-throttled. The progress maps onto the scene's pose curve (table in §6). Observers disconnect under reduced motion.

## 8. Character Bible — `bible.ts`

New `<section class="section" id="bible">` containing:

1. **Cast** — Moru and Mamo headshots side by side, each with a name + role line in EN/JA/ID.
2. **Pose library** — 14 cells × 2 genders = 28 sprites in a grid; each card labeled with `STAND / 立ち / Berdiri / default idle`.
3. **Anatomy grid** — one enlarged Moru sprite with overlay showing bounds table (head, torso, legs, arm pivots, eyes, mouth, cheeks) — direct port from `character-bible.jsx`.
4. **Do / Don't standards** — text panel listing the rules from `HANDOFF_PROMPT.md` (crispEdges, no anti-alias, no new saturated colors, no head tilt, no new hair styles, persimmon-only-on-tee, etc.).

Scroll-reveal applies via `.section.visible`. No scroll-progress pose cycling on the Bible page (it's reference, not narrative).

## 9. Testing strategy

Vitest + jsdom is already configured. New tests:

- **`src/character/__tests__/sprite.test.ts`** — render each pose; assert `viewBox`, `shape-rendering="crispEdges"`, persimmon present on tee/ribbon only, no other saturated colors, expected `<rect>` count > 0.
- **`src/character/__tests__/tips.test.ts`** — every entry of every pool has non-empty `en`, `ja`, `id`.
- **`src/character/__tests__/motion.test.ts`** — `motionAllowed()` returns expected boolean across all four permutations of media query × storage key.
- **`src/character/__tests__/earthquake-scene.test.ts`** (and one per scene) — `init`, dispatch `mamoru:shindo` with each level, assert sprite's `data-pose` attribute and tip text update.
- **`src/character/__tests__/bible.test.ts`** — `initBible()` produces 14 × 2 sprite cells.

## 10. Acceptance criteria

- [ ] `npm run build` passes; zero new lint or type errors.
- [ ] Bundle delta under 15 KB gzipped (target; all SVG is inline string output).
- [ ] Casual outfit renders Moru (male) and Mamo (female) at 64×96, `crispEdges`, palette per spec.
- [ ] All 14 poses render for both genders in the Bible without breaking proportions.
- [ ] Hero mascot: cursor pupils, blink loop, click-emote cycle, fact rotator, hearts, ripples — all functional in default motion mode.
- [ ] Each scene fades in on scroll-reveal, cycles poses with scroll-progress, snaps to state-driven pose for 4 s after the user interacts with that section's existing control, then returns to scroll-progress.
- [ ] Tip bubbles toggle correctly with the EN / JA / ID language switch.
- [ ] Reduced motion (system media query OR `a11y-reduced-motion` storage key): no listeners attached, sprite frozen at the scene's rest pose, no fact rotator, no cursor tracking, no hearts or ripples.
- [ ] Bible page lists all 14 poses × both genders, anatomy grid, and do/don't panel; reachable from the nav link.
- [ ] Zero new runtime dependencies in `package.json`.
- [ ] Existing tests still pass.

## 11. Out of scope (explicit)

- Other outfits (college, yukata, batik) — Bible and scenes only render casual.
- New scenario sections beyond what already exists in `index.html`.
- A broader visual overhaul of `style.css` / `arcade.css` / `scenarios.css` typography or colors.
- Migrating any non-character feature from the prototype (e.g., the design canvas, tweaks panel, alternate screens).
- Character on every existing section (only hero / earthquake / firstaid / typhoon / bag + the new Bible).
- Persistent / sticky mascot that follows users past the hero.
- Greeting emotes triggered on scroll-into-view.
