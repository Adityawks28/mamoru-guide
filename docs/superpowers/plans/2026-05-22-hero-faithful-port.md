# Hero Faithful Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the prototype hero (`mamoru_guide_design/screens.jsx` `<Hero>` + `<KobeScene>`) into `mamoru-guide` as a 1:1 visual match while staying on vanilla TS + Vite.

**Architecture:** Two stacked layers inside `<section class="hero arcade-hero">`: a scene layer (`.kobe-scene` wrapping mountains, skyline, harbor cluster, water, atmosphere) and a content layer (`.hero-text`, `.hero-side`). Renames unify class names with the prototype so future ports become copy-paste. Mascot stays as-is in `src/character/mascot.ts`.

**Tech Stack:** HTML5, CSS (with custom properties + `@keyframes`), TypeScript (Vite), Vitest. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-05-22-hero-faithful-port-design.md`

**Branch:** `feat/aditya/character-system-design-spec` (already current)

**Commit policy:** One-line commits, no Claude trailer. Commit after every task that ends in a passing typecheck + test run.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `css/variables.css` | Design tokens. Add prototype scene tokens (`--mt-*`, `--crystal-*`, `--ferris-frame`, `--museum-*`, `--bridge-*`). Rename mountain vars. | Modify |
| `css/hero.css` | Legacy hero base styles (kept). Rename classes; delete duplicated rules now covered in hero-arcade.css. | Modify |
| `css/hero-arcade.css` | Arcade hero + Kobe scene styles. New wrapper, atmosphere, building positioning, animations. | Modify |
| `css/print.css` | Print-hides scene elements. Update renamed selectors. | Modify |
| `css/character.css` | Mascot rendering. Untouched — verified no scene-class references. | — |
| `index.html` | Hero markup. Wrap scene in `.kobe-scene`, add 6 new SVG elements, rename existing classes, restructure foreground cluster. | Modify |
| `src/skyline.ts` | Procedural skyline. Update target element ID/class to match new HTML. | Modify |
| `src/stars.ts` | Procedural stars. Verify still mounts inside `.ks-stars`. | Modify (small) |
| `docs/hero.md` | New: prototype-to-mamoru-guide mapping + asset inventory + porting cookbook. | Create |

---

## Task 1: CSS variables — rename mountain vars and add scene tokens

**Files:**
- Modify: `css/variables.css`
- Modify: `css/hero.css:174` (uses `--mountain-far/mid/near`)
- Modify: `index.html:174-178` (uses `--mountain-far/mid/near`)

**Why first:** Pure additive + rename. Lets every downstream task reference the new var names.

- [ ] **Step 1: Rename mountain vars in variables.css and add new scene tokens**

Replace lines 29-31 in `css/variables.css`:
```css
  --mt-far: #1a3050;
  --mt-mid: #122440;
  --mt-near: #081830;
```

Replace lines 51-53 (day mode):
```css
  --mt-far: #8aaa9a;
  --mt-mid: #6a9a78;
  --mt-near: #4a7a58;
```

Add new tokens after `--star-opacity` (before closing brace of `:root`):
```css
  /* Harbor cluster — night defaults */
  --crystal-body: #d8e0e8;
  --crystal-crown: #5a6a7a;
  --crystal-line: #6a7a8a;
  --crystal-pane: #2a4a6a;
  --ferris-frame: #4a5a7a;
  --museum-white: #d8d0c0;
  --museum-line: #6a7a9a;
  --bridge-tower: #c44048;
  --bridge-cable: #6a4848;
```

Add inside `body.day-mode { ... }` block (before closing brace):
```css
  --crystal-body: #e8eef4;
  --crystal-crown: #4a5a6a;
  --crystal-line: #8090a0;
  --crystal-pane: #6a90b0;
  --ferris-frame: #4a4a4a;
  --museum-white: #f8f5e8;
  --museum-line: #6a7a9a;
  --bridge-tower: #d8504a;
  --bridge-cable: #d8b890;
```

- [ ] **Step 2: Update consumers of old mountain var names**

In `index.html` lines 174, 176, 178 — replace:
- `var(--mountain-far)` → `var(--mt-far)`
- `var(--mountain-mid)` → `var(--mt-mid)`
- `var(--mountain-near)` → `var(--mt-near)`

`css/hero.css` does not reference these vars by name (verified — `grep -n "mountain-" css/hero.css` returns no var usages, only class definitions). Nothing to change there yet.

- [ ] **Step 3: Verify typecheck + dev server renders unchanged**

Run:
```bash
cd /Users/aditya/mamoru-guide && npm run typecheck
```
Expected: PASS (no TS errors — CSS-only change).

Run:
```bash
npm run dev
```
Open `http://localhost:5173` and confirm mountains still render in both day and night mode. The colors should be unchanged (same hex values, just renamed tokens).

- [ ] **Step 4: Commit**

```bash
git add css/variables.css index.html
git commit -m "refactor: rename mountain vars to --mt-* and add harbor cluster tokens"
```

---

## Task 2: Class renames — `.kobe-tower` → `.ks-tower`, drop inner tower-anim classes, rename `.water` → `.ks-water`

**Files:**
- Modify: `index.html:184` (kobe-tower wrapper), `:189` (tower-body-anim), `:252` (tower-crown-anim), `:282` (water)
- Modify: `css/hero.css:103-125` (kobe-tower + old tower animations), `:128-138` (water)
- Modify: `css/print.css:22-25`

**Why next:** No new functionality, just renames + drop animations that will be replaced by the `.ks-tower`-level animation in Task 13. Keeps each commit reviewable.

The prototype applies tower animation to the `.ks-tower` selector itself (no inner `.tower-anim` wrapper class). The existing inner `<g>` elements get their classes stripped — they stay as plain `<g>` groupings for SVG drawing order.

- [ ] **Step 1: Rename in index.html**

In `index.html`, line 184:
- `<div class="kobe-tower"` → `<div class="ks-tower"`

Line 189:
- `<g class="tower-body-anim">` → `<g>`  (strip the class)

Line 252:
- `<g class="tower-crown-anim">` → `<g>`  (strip the class)

Line 282:
- `<div class="water"></div>` → `<div class="ks-water"></div>`

The `tower-top-light` class on lines 277-278 stays for now — Task 13 renames it to `tower-top`.

- [ ] **Step 2: Update css/hero.css**

Replace `.kobe-tower {` (line 103) with `.ks-tower {`.
Replace `.kobe-tower svg` (line 110) with `.ks-tower svg`.

Delete lines 111-125 (old animations no longer needed after Task 13 supersedes them):
```
@keyframes tower-crown-pulse { ... }
@keyframes tower-glow-pulse { ... }
@keyframes top-light-blink { ... }
.tower-crown-anim { animation: tower-crown-pulse 2.5s ease-in-out infinite; }
.tower-body-anim { animation: tower-glow-pulse 3s ease-in-out infinite; }
.tower-top-light { animation: top-light-blink 1.4s step-end infinite; }
```

Replace `.water {` (line 128) with `.ks-water {`.

Note: the Port Tower will lose its glow/pulse animation after this commit. Task 13 re-adds it via the `.ks-tower` selector with the prototype's `tower-shine` keyframe. This intermediate state is acceptable — each task should still leave a working site.

- [ ] **Step 3: Rename in css/print.css**

In `css/print.css` lines 22-25, replace:
```
  .skyline-container,
  .mountains-container,
  .water,
  .kobe-tower,
```
with:
```
  .kobe-scene,
  .ks-skyline,
  .ks-mountains,
  .ks-water,
  .ks-tower,
```

(We're adding `.kobe-scene` proactively — its print hide is harmless even before Task 3 wraps things in it.)

- [ ] **Step 4: Verify build + visual**

Run:
```bash
npm run typecheck && npm test
```
Expected: PASS (no test touches these classes — verified via grep).

Reload `http://localhost:5173`. Confirm Port Tower, water animation, and skyline still render. Port Tower may flash differently because we removed the `tower-crown-pulse` animation — that's expected; it will be re-introduced via the unified `tower-shine` keyframe in Task 13.

- [ ] **Step 5: Commit**

```bash
git add index.html css/hero.css css/print.css
git commit -m "refactor: rename hero scene classes to .ks-* to match prototype"
```

---

## Task 3: Wrap scene in `.kobe-scene` + restructure mountains/skyline into prototype layout

**Files:**
- Modify: `index.html` (lines 99-283 — restructure hero scene wrapper)
- Modify: `css/hero.css:69-86` (mountains/skyline rules — rename + simplify)
- Modify: `css/hero-arcade.css` (add `.kobe-scene` wrapper rule)
- Modify: `src/skyline.ts:9` (target element selector)

- [ ] **Step 1: Add `.kobe-scene` wrapper rule to hero-arcade.css**

After the existing `:root` block in `css/hero-arcade.css` (after line 15), insert:
```css
/* ───── KOBE SCENE WRAPPER ───── */
.kobe-scene {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  margin: -14px -100vw 0;
  background: linear-gradient(180deg, var(--harbor-deep) 0%, var(--harbor-navy) 50%, var(--harbor-mid) 100%);
}
[data-theme="day"] .kobe-scene,
body.day-mode .kobe-scene {
  background:
    linear-gradient(180deg, #a8d8f0 0%, #c8e8f8 35%, #f8e8c8 80%, #e8d8a8 100%);
}
.ks-foreground {
  position: absolute;
  inset: 0 100vw 0 100vw;
  pointer-events: none;
}
```

(Note: existing site uses `body.day-mode` not `[data-theme="day"]`. Selectors target both for forward compat.)

- [ ] **Step 2: Rewrite hero scene structure in index.html**

Find the block starting at line 99 (`<div class="celestial-body" ...`) through line 283 (`<div class="water"></div>` — now `<div class="ks-water"></div>`).

The current structure is roughly:
```
.celestial-body
.ks-blossoms (with 12 petals)
.ks-shooters (with 4 shooters)
.hero-text
.hero-side
.mountains-container > .mountain-layer (SVG)
.skyline-container > #skyline + .ks-tower (now renamed) + .ks-water (now renamed)
```

Restructure into prototype-matching order. Wrap all scene atmosphere/scenery in `.kobe-scene`, leave `.hero-text` and `.hero-side` as content siblings:

```html
<section class="hero arcade-hero night-sky" id="hero">
  <div class="kobe-scene" aria-hidden="true">
    <div class="celestial-body" id="celestialBody"></div>

    <!-- atmosphere (day) -->
    <div class="ks-sun-rays"></div>
    <div class="ks-clouds">
      <div class="ks-cloud c1"></div>
      <div class="ks-cloud c2"></div>
      <div class="ks-cloud c3"></div>
    </div>
    <div class="ks-blossoms">
      <!-- existing 12 petal spans (unchanged) -->
    </div>

    <!-- atmosphere (night) -->
    <div class="ks-stars" id="stars"></div>
    <div class="ks-shooters">
      <!-- existing 4 shooter spans (unchanged) -->
    </div>

    <!-- mountains -->
    <svg class="ks-mountains" viewBox="0 0 1400 300" preserveAspectRatio="none">
      <!-- existing 3 mountain paths -->
    </svg>

    <!-- skyline -->
    <div class="ks-skyline" id="skyline"></div>

    <!-- bridge — far horizon -->
    <!-- Task 8 adds .ks-bridge SVG here -->

    <!-- city hall -->
    <!-- Task 7 adds .ks-cityhall here -->

    <!-- foreground cluster -->
    <div class="ks-foreground">
      <!-- Task 9 adds .ks-crystal here -->
      <!-- Task 10 adds .ks-ferris here -->
      <!-- Task 11 adds .ks-museum here -->
      <div class="ks-tower" title="Kobe Port Tower 神戸ポートタワー">
        <!-- existing tower SVG -->
      </div>
      <!-- Task 12 adds .ks-boat here -->
    </div>

    <div class="ks-water"></div>
  </div>

  <div class="hero-text">
    <!-- unchanged -->
  </div>
  <div class="hero-side">
    <!-- unchanged -->
  </div>
</section>
```

Concrete changes to make:
1. After line 98 `<section class="hero arcade-hero night-sky" id="hero">`, open `<div class="kobe-scene" aria-hidden="true">` and move the `.celestial-body` line inside.
2. Move `.ks-blossoms` and `.ks-shooters` inside `.kobe-scene` (they're currently between `.celestial-body` and `.hero-text`).
3. After `.ks-shooters`, add empty `<div class="ks-sun-rays"></div>` and `<div class="ks-clouds"><div class="ks-cloud c1"></div><div class="ks-cloud c2"></div><div class="ks-cloud c3"></div></div>`.
4. Add `<div class="ks-stars" id="stars"></div>` (this re-uses the existing `#stars` ID that `src/stars.ts` already targets — verified via grep).
5. Replace `<div class="mountains-container">…</div>` (lines 171-180) with the inner `<svg class="ks-mountains" ...>` element directly (no outer container). Keep the 3 path elements as-is.
6. Replace `<div class="skyline-container">…</div>` wrapper (lines 182-283) with: a `<div class="ks-skyline" id="skyline"></div>`, followed by `<div class="ks-foreground">…</div>` wrapping the `.ks-tower` element, followed by the existing `<div class="ks-water"></div>`.
7. Close `</div>` for `.kobe-scene` before `.hero-text` starts on line 123.
8. Keep `.hero-text` and `.hero-side` exactly as they are (no changes to their content).

- [ ] **Step 3: Update css/hero.css mountain/skyline rules**

In `css/hero.css`:

Delete lines 69-76 (old `.mountains-container` + `.mountain-layer`).
Replace with:
```css
/* Mountains */
.ks-mountains {
  position: absolute;
  bottom: 240px;
  left: 0;
  width: 100%;
  height: 280px;
  z-index: 2;
}
body.day-mode .ks-mountains path:nth-child(1) { fill: #8aaab0; }
body.day-mode .ks-mountains path:nth-child(2) { fill: #6a9a78; }
body.day-mode .ks-mountains path:nth-child(3) { fill: #4a7a58; }
```

Delete lines 79-86 (old `.skyline-container` + `.skyline`).
Replace with:
```css
/* Skyline */
.ks-skyline {
  position: absolute;
  bottom: 40px; left: 0; right: 0;
  display: flex; align-items: flex-end; gap: 0;
  z-index: 3;
  height: 220px;
  overflow: hidden;
}
```

Keep `.bld` and `.bld-window` rules in `css/hero.css` for now (still used by `src/skyline.ts` which generates them). Task 4 will optionally rename to `.ks-bld` / `.ks-win` to match prototype — defer to keep this commit small.

- [ ] **Step 4: Update src/skyline.ts**

The current code at `src/skyline.ts:9` is:
```typescript
const c = document.getElementById('skyline');
```

This still works because we preserved the `id="skyline"` on the new `.ks-skyline` div. No change needed.

But verify: open `src/skyline.ts` and confirm line 9 still does `document.getElementById('skyline')`. If yes, no change. If anything else, update to match.

- [ ] **Step 5: Verify**

```bash
npm run typecheck && npm test
```
Expected: PASS.

Reload browser. Confirm:
- Mountains render at the same vertical position (`bottom: 240px` may differ from `bottom: 40px` in the old `.mountains-container` — that's expected; prototype puts mountains higher above water)
- Skyline renders (procedural buildings)
- Port Tower renders
- Water renders at bottom
- Blossoms (day) and shooters (night) still animate

Visual note: The hero will look slightly different already because mountains have moved up. This is correct — matches prototype.

- [ ] **Step 6: Commit**

```bash
git add index.html css/hero.css css/hero-arcade.css src/skyline.ts
git commit -m "refactor: wrap hero scene in .kobe-scene + .ks-foreground per prototype layout"
```

---

## Task 4: Rename `.bld` → `.ks-bld` and `.bld-window` → `.ks-win` (skyline alignment)

**Files:**
- Modify: `src/skyline.ts:30,42` (class names emitted)
- Modify: `css/hero.css:87-100` (rules)
- Modify: `css/base.css:14-16` (day-mode rules)

**Why:** Matches prototype names exactly so future skyline CSS edits from the prototype port 1:1.

- [ ] **Step 1: Update src/skyline.ts**

Change line 30:
```typescript
    el.className = 'bld';
```
to:
```typescript
    el.className = 'ks-bld';
```

Change line 42:
```typescript
        w.className = 'bld-window' + (Math.random() > 0.45 ? '' : ' off');
```
to:
```typescript
        w.className = 'ks-win' + (Math.random() > 0.45 ? '' : ' off');
```

- [ ] **Step 2: Update css/hero.css**

Replace lines 87-100 (the four rules: `.bld`, `.bld-window`, `.bld-window.off`):
```css
.ks-bld {
  position: relative;
  background: var(--harbor-deep, #060d1f);
  flex-shrink: 0;
  border-top: 1px solid var(--harbor-mid, #1a2f55);
}
.ks-win {
  position: absolute;
  width: 4px; height: 4px;
  background: var(--amber, #f5a623);
  opacity: 0.7;
  box-shadow: 0 0 4px var(--amber, #f5a623);
}
.ks-win.off { background: #2a4a6a; opacity: 0.2; box-shadow: none; }
```

- [ ] **Step 3: Update css/base.css**

Replace lines 14-16:
```css
body.day-mode .bld { background: #a0b8c8; }
body.day-mode .bld-window { background: #6090b0; }
body.day-mode .bld-window.off { background: #c0d4e0; }
```
with:
```css
body.day-mode .ks-bld { background: #2a3a5a; }
body.day-mode .ks-win.off { background: #6a7a9a; opacity: 0.4; }
body.day-mode .ks-win:not(.off) { background: rgba(255,224,64,0.4); box-shadow: none; }
```

(Day mode values come from `arcade.css:228-230` for fidelity to the prototype.)

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm test
```
Expected: PASS.

Reload browser. Toggle day/night. Confirm skyline buildings show:
- Night: dark navy with amber-glow windows
- Day: lighter blue-gray with soft yellow windows

- [ ] **Step 5: Commit**

```bash
git add src/skyline.ts css/hero.css css/base.css
git commit -m "refactor: rename .bld/.bld-window to .ks-bld/.ks-win"
```

---

## Task 5: Atmosphere — sun rays + drifting clouds (day-only)

**Files:**
- Modify: `css/hero-arcade.css` (add atmosphere rules after `.kobe-scene` block from Task 3)

The HTML elements (`.ks-sun-rays`, `.ks-clouds`, three `.ks-cloud.c1/c2/c3`) were added in Task 3.

- [ ] **Step 1: Add atmosphere CSS to hero-arcade.css**

Append after the `.ks-foreground` rule (added in Task 3):
```css
/* ───── ATMOSPHERE (day-only) ───── */
.ks-sun-rays { display: none; }
body.day-mode .ks-sun-rays,
[data-theme="day"] .ks-sun-rays {
  display: block;
  position: absolute;
  top: 8%; left: 12%;
  width: 280px; height: 280px;
  background: conic-gradient(from 0deg,
    rgba(255,224,64,0.25) 0deg, transparent 12deg,
    rgba(255,224,64,0.25) 30deg, transparent 42deg,
    rgba(255,224,64,0.25) 60deg, transparent 72deg,
    rgba(255,224,64,0.25) 90deg, transparent 102deg,
    rgba(255,224,64,0.25) 120deg, transparent 132deg,
    rgba(255,224,64,0.25) 150deg, transparent 162deg,
    rgba(255,224,64,0.25) 180deg, transparent 192deg,
    rgba(255,224,64,0.25) 210deg, transparent 222deg,
    rgba(255,224,64,0.25) 240deg, transparent 252deg,
    rgba(255,224,64,0.25) 270deg, transparent 282deg,
    rgba(255,224,64,0.25) 300deg, transparent 312deg,
    rgba(255,224,64,0.25) 330deg, transparent 342deg);
  transform: translate(-50%, -50%);
  animation: ks-sun-spin 80s linear infinite;
  z-index: 0;
}
@keyframes ks-sun-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

.ks-clouds { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.ks-cloud { display: none; position: absolute; }
body.day-mode .ks-cloud,
[data-theme="day"] .ks-cloud {
  display: block;
  background: #f8f5e8;
  box-shadow:
    -16px 0 0 -4px #f8f5e8, 16px 0 0 -4px #f8f5e8,
    -28px -2px 0 -10px #f8f5e8, 28px -2px 0 -10px #f8f5e8;
  width: 64px; height: 16px;
  image-rendering: pixelated;
  animation: ks-drift 50s linear infinite;
}
body.day-mode .ks-cloud.c1,
[data-theme="day"] .ks-cloud.c1 { top: 14%; left: -10%; animation-duration: 60s; }
body.day-mode .ks-cloud.c2,
[data-theme="day"] .ks-cloud.c2 { top: 22%; left: -10%; animation-delay: -20s; animation-duration: 75s; transform: scale(1.4); }
body.day-mode .ks-cloud.c3,
[data-theme="day"] .ks-cloud.c3 { top:  8%; left: -10%; animation-delay: -40s; animation-duration: 90s; transform: scale(0.8); }
@keyframes ks-drift { from { left: -10%; } to { left: 110%; } }

@media (prefers-reduced-motion: reduce) {
  body.day-mode .ks-sun-rays, [data-theme="day"] .ks-sun-rays,
  body.day-mode .ks-cloud, [data-theme="day"] .ks-cloud {
    animation: none;
  }
}
```

- [ ] **Step 2: Verify**

Reload `http://localhost:5173`. Toggle to **day mode**. Confirm:
- Sun rays radiate from top-left, slowly rotating
- Three pixel clouds drift left-to-right at different speeds

Toggle to **night mode**. Confirm sun rays and clouds are hidden.

- [ ] **Step 3: Commit**

```bash
git add css/hero-arcade.css
git commit -m "feat: add sun rays and drifting clouds atmosphere (day-only)"
```

---

## Task 6: Stars system (verify night-mode twinkle inside `.ks-stars`)

**Files:**
- Modify: `src/stars.ts` (verify selector)
- Modify: `css/hero-arcade.css` (add `.ks-stars` + `.ks-star` rules)
- Modify: `css/hero.css` (remove or scope old `#stars` rule)

The `<div class="ks-stars" id="stars"></div>` was added in Task 3.

- [ ] **Step 1: Update src/stars.ts to emit `.ks-star`**

In `src/stars.ts` line 6, change:
```typescript
    s.className = 'star';
```
to:
```typescript
    s.className = 'ks-star';
```

No other changes needed — the file already targets `#stars` (line 2), which is preserved on the new `<div class="ks-stars" id="stars">` from Task 3. The per-star `--dur` CSS var continues to drive twinkle speed in conjunction with the new `.ks-star` rule below (the rule uses `--dur` if present, falls back to 3s).

- [ ] **Step 2: Add `.ks-stars` + `.ks-star` rules to hero-arcade.css**

Append:
```css
/* ───── STARS (night-only) ───── */
.ks-stars {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: var(--star-opacity, 1);
  transition: opacity 0.6s;
}
body.day-mode .ks-stars,
[data-theme="day"] .ks-stars { display: none; }
.ks-star {
  position: absolute;
  background: #fff;
  animation: ks-twinkle var(--dur, 3s) ease-in-out infinite alternate;
  opacity: 0;
}
@keyframes ks-twinkle {
  0%   { opacity: 0.15; }
  100% { opacity: 0.9; }
}

@media (prefers-reduced-motion: reduce) {
  .ks-star { animation: none; opacity: 0.6; }
}
```

The rule honors the existing `--dur` per-star CSS var (set inline by `src/stars.ts` line 8) so each star twinkles at a slightly different cadence. The rule also honors `--star-opacity` (defined in `css/variables.css`) so day mode fades stars out smoothly via that variable, in addition to the hard `display: none`.

- [ ] **Step 3: Remove old #stars rule in hero.css**

In `css/hero.css`, delete lines 1-8 entirely:
```css
#stars { position: fixed; top:0; left:0; width:100%; height:100%; z-index:0; pointer-events:none; opacity: var(--star-opacity); transition: opacity 0.6s; }
.star {
  position: absolute; background: #fff;
  animation: twinkle var(--dur) ease-in-out infinite alternate;
  opacity: 0;
}
@keyframes twinkle { 0%{opacity:0.15;} 100%{opacity:0.85;} }
```

The old `#stars` was a fixed-position fullscreen overlay; the new `.ks-stars` is absolute-positioned inside `.kobe-scene`. The old `.star` rule is dead because Step 1 changed `src/stars.ts` to emit `.ks-star`.

- [ ] **Step 4: Verify**

Reload in night mode. Confirm:
- ~120 stars twinkle across the hero (the existing generator emits 120, intentionally more than the prototype's 60)
- Stars are inside the hero only (not the entire viewport)

Toggle day mode. Confirm stars are hidden.

- [ ] **Step 5: Commit**

```bash
git add src/stars.ts css/hero-arcade.css css/hero.css
git commit -m "feat: scope stars to .ks-stars container in night mode"
```

---

## Task 7: Kobe City Hall (`.ks-cityhall`)

**Files:**
- Modify: `index.html` (insert `.ks-cityhall` inside `.kobe-scene`, before `.ks-foreground`)
- Modify: `css/hero-arcade.css` (add `.ks-cityhall`, `.ch-top`, `.ch-body` rules)

- [ ] **Step 1: Add HTML inside `.kobe-scene`**

In `index.html`, immediately before the `<div class="ks-foreground">` opening tag (added in Task 3), insert:
```html
<div class="ks-cityhall" title="Kobe City Hall">
  <div class="ch-top"></div>
  <div class="ch-body"></div>
</div>
```

- [ ] **Step 2: Add CSS to hero-arcade.css**

Append (after the atmosphere block from Task 5):
```css
/* ───── KOBE CITY HALL ───── */
.ks-cityhall {
  position: absolute;
  bottom: 40px;
  right: 32%;
  width: 38px;
  height: 200px;
  z-index: 3;
}
.ch-body {
  width: 38px;
  height: 180px;
  background:
    linear-gradient(90deg, transparent 4px, rgba(245,166,35,0.6) 4px, rgba(245,166,35,0.6) 6px, transparent 6px, transparent 14px, rgba(245,166,35,0.6) 14px, rgba(245,166,35,0.6) 16px, transparent 16px, transparent 24px, rgba(245,166,35,0.6) 24px, rgba(245,166,35,0.6) 26px, transparent 26px, transparent 34px),
    linear-gradient(0deg, transparent 4px, rgba(245,166,35,0.4) 4px, rgba(245,166,35,0.4) 5px, transparent 5px),
    linear-gradient(180deg, #1a2a4a 0%, #2a3a5a 100%);
  background-size: 38px 180px, 38px 12px, 100% 100%;
  border: 1px solid #0a1424;
}
.ch-top {
  width: 28px;
  height: 24px;
  margin-left: 5px;
  background: #1a2a4a;
}
body.day-mode .ch-body,
[data-theme="day"] .ch-body { background: #6a7a9a; background-image: none; }
body.day-mode .ch-top,
[data-theme="day"] .ch-top { background: #6a7a9a; }
```

- [ ] **Step 3: Verify**

Reload. Confirm a tall lit block appears to the right of center (around 68% from left) on the harbor, with amber window dots.

- [ ] **Step 4: Commit**

```bash
git add index.html css/hero-arcade.css
git commit -m "feat: add Kobe City Hall to harbor scene"
```

---

## Task 8: Akashi-Kaikyo Bridge (`.ks-bridge`)

**Files:**
- Modify: `index.html` (insert SVG inside `.kobe-scene`, after city hall, before `.ks-foreground`)
- Modify: `css/hero-arcade.css` (add `.ks-bridge` rule)

- [ ] **Step 1: Add SVG to index.html**

After the `.ks-cityhall` block, before `.ks-foreground`, insert:
```html
<svg class="ks-bridge" viewBox="0 0 480 100" preserveAspectRatio="none" aria-hidden="true">
  <line x1="0" y1="60" x2="480" y2="60" stroke="#3a4a6a" stroke-width="2"/>
  <path d="M0,60 Q120,15 240,60 Q360,15 480,60" fill="none" stroke="var(--bridge-cable)" stroke-width="1.5"/>
  <rect x="118" y="5" width="4" height="80" fill="var(--bridge-tower)"/>
  <rect x="358" y="5" width="4" height="80" fill="var(--bridge-tower)"/>
  <rect x="115" y="0" width="10" height="6" fill="var(--bridge-tower)"/>
  <rect x="355" y="0" width="10" height="6" fill="var(--bridge-tower)"/>
  <line x1="40"  y1="60" x2="40"  y2="29" stroke="var(--bridge-cable)" stroke-width="0.6"/>
  <line x1="80"  y1="60" x2="80"  y2="44" stroke="var(--bridge-cable)" stroke-width="0.6"/>
  <line x1="160" y1="60" x2="160" y2="44" stroke="var(--bridge-cable)" stroke-width="0.6"/>
  <line x1="200" y1="60" x2="200" y2="29" stroke="var(--bridge-cable)" stroke-width="0.6"/>
  <line x1="280" y1="60" x2="280" y2="29" stroke="var(--bridge-cable)" stroke-width="0.6"/>
  <line x1="320" y1="60" x2="320" y2="44" stroke="var(--bridge-cable)" stroke-width="0.6"/>
  <line x1="400" y1="60" x2="400" y2="44" stroke="var(--bridge-cable)" stroke-width="0.6"/>
  <line x1="440" y1="60" x2="440" y2="29" stroke="var(--bridge-cable)" stroke-width="0.6"/>
</svg>
```

- [ ] **Step 2: Add CSS**

Append to hero-arcade.css:
```css
/* ───── AKASHI-KAIKYO BRIDGE ───── */
.ks-bridge {
  position: absolute;
  bottom: 220px; left: 0;
  width: 36%; height: 80px;
  z-index: 3;
  opacity: 0.85;
  filter: drop-shadow(0 0 6px rgba(232,64,64,0.4));
}
body.day-mode .ks-bridge,
[data-theme="day"] .ks-bridge { opacity: 0.7; filter: none; }
```

- [ ] **Step 3: Verify**

Reload. Confirm a red suspension bridge silhouette appears at the upper-left horizon, with two towers and curved cable lines.

- [ ] **Step 4: Commit**

```bash
git add index.html css/hero-arcade.css
git commit -m "feat: add Akashi-Kaikyo Bridge silhouette to far horizon"
```

---

## Task 9: Kobe Crystal Tower (`.ks-crystal`)

**Files:**
- Modify: `index.html` (insert SVG inside `.ks-foreground`, before `.ks-tower`)
- Modify: `css/hero-arcade.css` (add `.ks-crystal` rules)

**Note:** The prototype has 40 randomized lit windows. We'll hardcode a representative pattern so it's deterministic across reloads (vanilla site doesn't have React's `useMemo`).

- [ ] **Step 1: Add SVG inside `.ks-foreground`**

The `.ks-foreground` div was added empty in Task 3. Inside it, before the `.ks-tower` block, insert:
```html
<div class="ks-crystal" title="Kobe Crystal Tower" aria-hidden="true">
  <svg viewBox="0 0 70 240" shape-rendering="crispEdges">
    <rect x="6" y="20" width="58" height="200" fill="var(--crystal-body)"/>
    <rect x="10" y="8" width="50" height="14" fill="var(--crystal-crown)"/>
    <rect x="14" y="0" width="42" height="10" fill="var(--crystal-crown)"/>
    <rect x="32" y="-8" width="6" height="10" fill="#3a3a3a"/>
    <!-- horizontal floor stripes (22 rows) -->
    <rect x="6" y="26"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="35"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="44"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="53"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="62"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="71"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="80"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="89"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="98"  width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="107" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="116" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="125" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="134" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="143" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="152" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="161" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="170" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="179" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="188" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="197" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="206" width="58" height="1" fill="var(--crystal-line)"/>
    <rect x="6" y="215" width="58" height="1" fill="var(--crystal-line)"/>
    <!-- vertical mullions -->
    <rect x="14" y="22" width="1" height="200" fill="var(--crystal-line)"/>
    <rect x="24" y="22" width="1" height="200" fill="var(--crystal-line)"/>
    <rect x="34" y="22" width="1" height="200" fill="var(--crystal-line)"/>
    <rect x="44" y="22" width="1" height="200" fill="var(--crystal-line)"/>
    <rect x="54" y="22" width="1" height="200" fill="var(--crystal-line)"/>
    <!-- lit window scatter (deterministic — 30 panes; ~50% lit) -->
    <rect x="9"  y="28"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="29" y="28"  width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="49" y="28"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="19" y="37"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="39" y="37"  width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="59" y="37"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="9"  y="55"  width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="29" y="55"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="49" y="55"  width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="19" y="73"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="39" y="73"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="59" y="73"  width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="9"  y="91"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="29" y="91"  width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="49" y="91"  width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="19" y="109" width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="39" y="109" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="59" y="109" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="9"  y="127" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="29" y="127" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="49" y="127" width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="19" y="145" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="39" y="145" width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="59" y="145" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="9"  y="163" width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="29" y="163" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="49" y="163" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="19" y="181" width="4" height="6" fill="#f5a623" opacity="0.85"/>
    <rect x="39" y="181" width="4" height="6" fill="var(--crystal-pane)" opacity="0.5"/>
    <rect x="59" y="181" width="4" height="6" fill="#f5a623" opacity="0.85"/>
  </svg>
</div>
```

- [ ] **Step 2: Add CSS**

Append to hero-arcade.css:
```css
/* ───── KOBE CRYSTAL TOWER ───── */
.ks-crystal {
  position: absolute;
  bottom: 56px;
  left: 60%;
  width: 90px; height: 320px;
  z-index: 4;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));
}
.ks-crystal svg { width: 100%; height: 100%; overflow: visible; }
```

- [ ] **Step 3: Verify**

Reload. Confirm a tall light-grey skyscraper appears slightly to the right of center, behind/right of where the Port Tower will sit, with rows of lit and unlit windows.

- [ ] **Step 4: Commit**

```bash
git add index.html css/hero-arcade.css
git commit -m "feat: add Kobe Crystal Tower to harbor cluster"
```

---

## Task 10: Mosaic Ferris Wheel (`.ks-ferris`)

**Files:**
- Modify: `index.html` (insert SVG inside `.ks-foreground`, before `.ks-tower`, after `.ks-crystal` if you want left-to-right reading — but z-index handles draw order regardless)
- Modify: `css/hero-arcade.css` (add `.ks-ferris`, `.ferris-spin`, `.ferris-cab` rules)

- [ ] **Step 1: Add SVG**

Inside `.ks-foreground`, after `.ks-crystal`, insert:
```html
<div class="ks-ferris" title="Mosaic Ferris Wheel" aria-hidden="true">
  <svg viewBox="0 0 80 90" shape-rendering="crispEdges">
    <circle cx="40" cy="40" r="32" fill="none" stroke="var(--ferris-frame)" stroke-width="2"/>
    <circle cx="40" cy="40" r="3" fill="var(--ferris-frame)"/>
    <g class="ferris-spin" style="transform-origin: 40px 40px;">
      <line x1="40" y1="40" x2="72.0" y2="40.0" stroke="var(--ferris-frame)" stroke-width="0.6"/>
      <rect x="69.0" y="38.0" width="6" height="4" fill="#e84040" class="ferris-cab"/>
      <line x1="40" y1="40" x2="62.6" y2="62.6" stroke="var(--ferris-frame)" stroke-width="0.6"/>
      <rect x="59.6" y="60.6" width="6" height="4" fill="#f5a623" class="ferris-cab"/>
      <line x1="40" y1="40" x2="40.0" y2="72.0" stroke="var(--ferris-frame)" stroke-width="0.6"/>
      <rect x="37.0" y="70.0" width="6" height="4" fill="#ffe040" class="ferris-cab"/>
      <line x1="40" y1="40" x2="17.4" y2="62.6" stroke="var(--ferris-frame)" stroke-width="0.6"/>
      <rect x="14.4" y="60.6" width="6" height="4" fill="#6ad494" class="ferris-cab"/>
      <line x1="40" y1="40" x2="8.0"  y2="40.0" stroke="var(--ferris-frame)" stroke-width="0.6"/>
      <rect x="5.0"  y="38.0" width="6" height="4" fill="#4cc9f0" class="ferris-cab"/>
      <line x1="40" y1="40" x2="17.4" y2="17.4" stroke="var(--ferris-frame)" stroke-width="0.6"/>
      <rect x="14.4" y="15.4" width="6" height="4" fill="#a06ad4" class="ferris-cab"/>
      <line x1="40" y1="40" x2="40.0" y2="8.0"  stroke="var(--ferris-frame)" stroke-width="0.6"/>
      <rect x="37.0" y="6.0"  width="6" height="4" fill="#f06292" class="ferris-cab"/>
      <line x1="40" y1="40" x2="62.6" y2="17.4" stroke="var(--ferris-frame)" stroke-width="0.6"/>
      <rect x="59.6" y="15.4" width="6" height="4" fill="#ff9040" class="ferris-cab"/>
    </g>
    <rect x="36" y="72" width="8" height="14" fill="var(--ferris-frame)"/>
    <line x1="20" y1="86" x2="60" y2="86" stroke="var(--ferris-frame)" stroke-width="2"/>
  </svg>
</div>
```

- [ ] **Step 2: Add CSS**

Append:
```css
/* ───── MOSAIC FERRIS WHEEL ───── */
.ks-ferris {
  position: absolute;
  bottom: 56px;
  left: 38%;
  width: 110px; height: 130px;
  z-index: 5;
  filter: drop-shadow(0 0 8px rgba(245,166,35,0.4));
}
.ks-ferris svg { width: 100%; height: 100%; overflow: visible; }
.ferris-spin { animation: ferris-rotate 30s linear infinite; transform-origin: 40px 40px; }
@keyframes ferris-rotate { to { transform: rotate(360deg); } }
.ferris-cab { animation: cab-glow 1.5s ease-in-out infinite alternate; }
@keyframes cab-glow {
  from { opacity: 0.7; }
  to   { opacity: 1; filter: brightness(1.3); }
}
body.day-mode .ks-ferris,
[data-theme="day"] .ks-ferris { filter: none; }

@media (prefers-reduced-motion: reduce) {
  .ferris-spin, .ferris-cab { animation: none; }
}
```

- [ ] **Step 3: Verify**

Reload. Confirm a Ferris wheel appears in the harbor area (around 38% from left) with 8 colored cabins rotating continuously every 30s. Cabins pulse brightness.

- [ ] **Step 4: Commit**

```bash
git add index.html css/hero-arcade.css
git commit -m "feat: add Mosaic Ferris Wheel with rotating cabins"
```

---

## Task 11: Maritime Museum (`.ks-museum`)

**Files:**
- Modify: `index.html` (insert SVG inside `.ks-foreground`, between `.ks-ferris` and `.ks-tower`)
- Modify: `css/hero-arcade.css` (add `.ks-museum` rule)

- [ ] **Step 1: Add SVG**

Inside `.ks-foreground`, after `.ks-ferris`, before `.ks-tower`, insert:
```html
<div class="ks-museum" title="Kobe Maritime Museum" aria-hidden="true">
  <svg viewBox="0 0 120 60" shape-rendering="crispEdges">
    <path d="M0,60 L20,30 L40,40 L60,15 L80,38 L100,28 L120,60 Z"
          fill="var(--museum-white)" stroke="var(--museum-line)" stroke-width="1"/>
    <path d="M0,60 L20,30 L40,40 L60,15 L80,38 L100,28 L120,60"
          fill="none" stroke="var(--museum-line)" stroke-width="1"/>
  </svg>
</div>
```

- [ ] **Step 2: Add CSS**

Append:
```css
/* ───── MARITIME MUSEUM ───── */
.ks-museum {
  position: absolute;
  bottom: 56px;
  left: 47%;
  width: 130px; height: 64px;
  z-index: 5;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.3));
}
.ks-museum svg { width: 100%; height: 100%; }
body.day-mode .ks-museum,
[data-theme="day"] .ks-museum { filter: none; }
```

- [ ] **Step 3: Verify**

Reload. Confirm a white tent-silhouette building appears between the Ferris wheel and where the Port Tower sits.

- [ ] **Step 4: Commit**

```bash
git add index.html css/hero-arcade.css
git commit -m "feat: add Maritime Museum tent silhouette"
```

---

## Task 12: Harbor Boat (`.ks-boat`) with drift animation

**Files:**
- Modify: `index.html` (insert SVG inside `.ks-foreground`, after `.ks-tower`)
- Modify: `css/hero-arcade.css` (add `.ks-boat`, `boat-drift`, `wake-pulse` rules)

- [ ] **Step 1: Add SVG**

Inside `.ks-foreground`, after the existing `.ks-tower` block, insert:
```html
<div class="ks-boat" aria-hidden="true">
  <svg viewBox="0 0 140 60" shape-rendering="crispEdges">
    <polygon points="6,42 134,42 124,52 16,52" fill="#fff"/>
    <rect x="6" y="40" width="128" height="3" fill="#1a4a8a"/>
    <rect x="20" y="22" width="92" height="18" fill="#fff"/>
    <rect x="20" y="22" width="92" height="2" fill="#c8c0b0"/>
    <rect x="24" y="28" width="6" height="4" fill="#4cc9f0" opacity="0.9"/>
    <rect x="36" y="28" width="6" height="4" fill="#4cc9f0" opacity="0.9"/>
    <rect x="48" y="28" width="6" height="4" fill="#4cc9f0" opacity="0.9"/>
    <rect x="60" y="28" width="6" height="4" fill="#4cc9f0" opacity="0.9"/>
    <rect x="72" y="28" width="6" height="4" fill="#4cc9f0" opacity="0.9"/>
    <rect x="84" y="28" width="6" height="4" fill="#4cc9f0" opacity="0.9"/>
    <rect x="96" y="28" width="6" height="4" fill="#4cc9f0" opacity="0.9"/>
    <rect x="108" y="28" width="6" height="4" fill="#4cc9f0" opacity="0.9"/>
    <rect x="44" y="10" width="44" height="14" fill="#fff"/>
    <rect x="50" y="14" width="6" height="4" fill="#4cc9f0"/>
    <rect x="60" y="14" width="6" height="4" fill="#4cc9f0"/>
    <rect x="70" y="14" width="6" height="4" fill="#4cc9f0"/>
    <rect x="64" y="0"  width="2" height="12" fill="#3a3a3a"/>
    <rect x="66" y="2"  width="8" height="5" fill="#e84040"/>
    <rect x="92" y="6"  width="8" height="16" fill="#1a4a8a"/>
    <rect x="92" y="6"  width="8" height="3"  fill="#ffe040"/>
    <line x1="6"   y1="40" x2="6"   y2="34" stroke="#1a4a8a" stroke-width="1"/>
    <line x1="134" y1="40" x2="134" y2="34" stroke="#1a4a8a" stroke-width="1"/>
    <g class="boat-wake">
      <rect x="-10" y="50" width="14" height="2" fill="#fff" opacity="0.6"/>
      <rect x="-26" y="54" width="22" height="2" fill="#fff" opacity="0.4"/>
    </g>
  </svg>
</div>
```

- [ ] **Step 2: Add CSS**

Append:
```css
/* ───── HARBOR BOAT ───── */
.ks-boat {
  position: absolute;
  bottom: 18px;
  left: -180px;
  width: 160px; height: 70px;
  z-index: 5;
  animation: boat-drift 38s linear infinite;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.ks-boat svg { width: 100%; height: 100%; overflow: visible; }
@keyframes boat-drift {
  0%   { transform: translateX(0)     translateY(0); }
  50%  { transform: translateX(60vw)  translateY(-3px); }
  100% { transform: translateX(120vw) translateY(0); }
}
.boat-wake { animation: wake-pulse 1.4s ease-in-out infinite alternate; }
@keyframes wake-pulse {
  from { opacity: 0.6; }
  to   { opacity: 1; transform: translateX(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .ks-boat, .boat-wake { animation: none; }
}
```

- [ ] **Step 3: Verify**

Reload. Wait up to ~30s. Confirm a small white passenger boat drifts left-to-right across the water, with a small wake trail behind it. The boat should disappear off the right edge and re-enter from the left.

- [ ] **Step 4: Commit**

```bash
git add index.html css/hero-arcade.css
git commit -m "feat: add drifting harbor boat with wake"
```

---

## Task 13: Port Tower — reposition + replace pulse animations with `tower-shine` + `tower-blink`

**Files:**
- Modify: `css/hero.css` (remove old `.kobe-tower` position rules now obsolete — already renamed `.ks-tower` in Task 2)
- Modify: `css/hero-arcade.css` (add proper `.ks-tower` positioning + `tower-shine` + `tower-blink` keyframes)

**Why:** Task 2 renamed classes but the Port Tower is still positioned via old rules (`bottom: 40px; right: 15%`) instead of the prototype's `bottom: 56px; left: 56%` inside `.ks-foreground`. This task corrects positioning and finalizes animations.

- [ ] **Step 1: Remove old `.ks-tower` positioning from css/hero.css**

In `css/hero.css`, find the `.ks-tower` block (renamed from `.kobe-tower` in Task 2 — the `position: absolute; bottom: 40px; right: 15%;...` rule). Delete it entirely along with the `.ks-tower svg` rule beneath it.

The old animation `@keyframes` and class rules were already deleted in Task 2. After this step, `css/hero.css` contains nothing tower-related. New positioning + animations live in `hero-arcade.css` below.

- [ ] **Step 2: Add prototype-faithful `.ks-tower` block to hero-arcade.css**

Append:
```css
/* ───── KOBE PORT TOWER ───── */
.ks-tower {
  position: absolute;
  bottom: 56px;
  left: 56%;
  width: 96px;
  height: 280px;
  z-index: 6;
  image-rendering: pixelated;
  filter:
    drop-shadow(0 0 8px rgba(232,64,64,0.9))
    drop-shadow(0 0 18px rgba(255,80,40,0.6))
    drop-shadow(0 0 36px rgba(255,80,40,0.35));
  animation: tower-shine 2.4s ease-in-out infinite;
}
.ks-tower svg { width: 100%; height: 100%; image-rendering: pixelated; }

/* Day mode — lighter glow, no animation */
body.day-mode .ks-tower,
[data-theme="day"] .ks-tower {
  filter:
    drop-shadow(0 0 12px rgba(232,64,64,0.7))
    drop-shadow(0 0 24px rgba(232,64,64,0.3));
  animation: none;
}

@keyframes tower-shine {
  0%, 100% {
    filter:
      drop-shadow(0 0 8px rgba(232,64,64,0.9))
      drop-shadow(0 0 18px rgba(255,80,40,0.6))
      drop-shadow(0 0 36px rgba(255,80,40,0.35));
  }
  50% {
    filter:
      drop-shadow(0 0 14px rgba(255,100,60,1))
      drop-shadow(0 0 32px rgba(255,120,60,0.8))
      drop-shadow(0 0 60px rgba(255,140,60,0.5));
  }
}

.tower-top { animation: tower-blink 1.4s step-end infinite; }
@keyframes tower-blink {
  0%, 48%    { opacity: 1; }
  49%, 100%  { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ks-tower, .tower-top { animation: none; }
}
```

- [ ] **Step 3: Update Port Tower SVG to add `.tower-top` class on antenna light**

In `index.html`, inside the `.ks-tower` `<svg>`, locate the antenna-top light element. In current code (around line 277), it's:
```html
<rect x="33" y="16" width="6" height="5" fill="#ff4444" class="tower-top-light"/>
```
Change `class="tower-top-light"` to `class="tower-top"` to match the prototype animation hook.

There's also a second `tower-top-light` on line 278 — change that one too.

- [ ] **Step 4: Verify**

Reload. Confirm:
- Port Tower is positioned roughly at horizontal 56% from left (near where the museum tent ends, slightly right of center)
- Port Tower has a red pulsing glow (slower, smoother than before)
- The antenna top light blinks ~1.4s on/off

In day mode, the glow is more muted but still visible.

- [ ] **Step 5: Commit**

```bash
git add index.html css/hero.css css/hero-arcade.css
git commit -m "feat: reposition Port Tower and replace pulse with tower-shine + tower-blink"
```

---

## Task 14: Mobile responsive scaling

**Files:**
- Modify: `css/hero-arcade.css` (add `@media (max-width: 900px)` overrides)

- [ ] **Step 1: Append mobile scale rules**

Append to `hero-arcade.css`:
```css
/* ───── MOBILE — scale harbor cluster down ───── */
@media (max-width: 900px) {
  .ks-tower    { left: 50%; transform: scale(0.55); transform-origin: bottom left; }
  .ks-crystal  { left: 60%; transform: scale(0.55); transform-origin: bottom left; }
  .ks-ferris   { left: 4%;  transform: scale(0.7);  transform-origin: bottom left; }
  .ks-museum   { left: 22%; transform: scale(0.7);  transform-origin: bottom left; }
  .ks-boat     { transform: scale(0.7); }
  .ks-cityhall { right: 8%; transform: scale(0.65); transform-origin: bottom right; }
  .ks-bridge   { width: 50%; }
}
```

- [ ] **Step 2: Verify**

Open DevTools, set viewport to 375×667 (iPhone SE). Confirm all harbor buildings shrink and re-position so the scene fits the narrow viewport without overlap.

- [ ] **Step 3: Commit**

```bash
git add css/hero-arcade.css
git commit -m "feat: scale harbor cluster down on viewports under 900px"
```

---

## Task 15: Full visual diff against the prototype

This task is verification, not new code. No file changes unless gaps are found.

- [ ] **Step 1: Open prototype hero locally**

```bash
cd /Users/aditya/Downloads/mamoru_guide_design
python3 -m http.server 8000
```
Open `http://localhost:8000/Mamoru%20Guide.html`. This is the source-of-truth render.

- [ ] **Step 2: Open the ported hero**

In a separate tab: `http://localhost:5173`.

- [ ] **Step 3: Side-by-side comparison**

For each item below, confirm parity (✓) or note a discrepancy:

**Night mode:**
- [ ] Background gradient (deep blue → navy → mid)
- [ ] ~60 stars twinkling
- [ ] 4 shooting stars trailing periodically
- [ ] Mountains visible (3 layers)
- [ ] Bridge silhouette upper-left with red glow
- [ ] Skyline of dark buildings with amber windows
- [ ] City Hall vertical lit block
- [ ] Crystal Tower with grid of windows
- [ ] Ferris wheel rotating
- [ ] Maritime Museum tent
- [ ] Port Tower at center, pulsing red glow, blinking top light
- [ ] Boat drifting across water
- [ ] Water with horizontal stripe animation
- [ ] Mascot in arcade frame on right
- [ ] Mode rail (3 cards) below mascot

**Day mode (toggle the theme button):**
- [ ] Background gradient (sky blue → cream → tan)
- [ ] Sun rays rotating top-left
- [ ] 3 pixel clouds drifting
- [ ] Cherry blossom petals falling
- [ ] Stars hidden
- [ ] Shooters hidden
- [ ] Mountain colors shift to green/blue
- [ ] All buildings still visible (less glow, lighter palette)

- [ ] **Step 4: Fix any discrepancies**

If a discrepancy is found, identify the relevant Task above (Tasks 1-14) and create a follow-up commit fixing only that piece. Note: don't add new features here — only correct existing ports.

- [ ] **Step 5: Run final checks**

```bash
npm run typecheck && npm test
```
Expected: PASS.

- [ ] **Step 6: Commit any fixes from Step 4**

```bash
git add <fixed-files>
git commit -m "fix: <specific discrepancy from visual diff>"
```

(If no discrepancies, skip this commit.)

---

## Task 16: Write `docs/hero.md`

**Files:**
- Create: `docs/hero.md`

- [ ] **Step 1: Create docs/hero.md with the three parts**

Create `/Users/aditya/mamoru-guide/docs/hero.md` with the content below.

```markdown
# Hero — Kobe Scene reference

The mamoru-guide hero is a faithful port of `<Hero>` + `<KobeScene>` from the React prototype at `Downloads/mamoru_guide_design/`. This doc explains how the pieces map and how to port new sections using the same pattern.

## Prototype → mamoru-guide mapping

| Prototype source | Symbol / Class | mamoru-guide location |
|---|---|---|
| `screens.jsx:309` `<Hero>` | — | `index.html` `<section class="hero arcade-hero">` |
| `screens.jsx:35` `<KobeScene>` | `.kobe-scene` | `index.html` (inline div tree) |
| `screens.jsx:97-101` mountain SVG | `.ks-mountains` | `index.html` (inline SVG) |
| `screens.jsx:102-114` skyline buildings | `.ks-skyline` + `.ks-bld` + `.ks-win` | `src/skyline.ts` (procedural generator) |
| `screens.jsx:116-126` bridge SVG | `.ks-bridge` | `index.html` (inline SVG) |
| `screens.jsx:128-131` city hall | `.ks-cityhall` (`.ch-top`, `.ch-body`) | `index.html` (CSS-only div) |
| `screens.jsx:135-159` Crystal Tower | `.ks-crystal` | `index.html` (inline SVG) |
| `screens.jsx:161-179` Ferris wheel | `.ks-ferris` + `.ferris-spin` + `.ferris-cab` | `index.html` (inline SVG) + animation in `css/hero-arcade.css` |
| `screens.jsx:181-186` museum | `.ks-museum` | `index.html` (inline SVG) |
| `screens.jsx:187-264` Port Tower | `.ks-tower` + `.tower-anim` + `.tower-top` | `index.html` (inline SVG) + animations in `css/hero-arcade.css` |
| `screens.jsx:267-299` boat | `.ks-boat` + `.boat-wake` | `index.html` (inline SVG) + animations in `css/hero-arcade.css` |
| `screens.jsx:301` water | `.ks-water` | `index.html` (CSS-only div) |
| `arcade.css:155-167` sun rays | `.ks-sun-rays` | `index.html` empty div + conic gradient in `css/hero-arcade.css` |
| `arcade.css:168-184` clouds | `.ks-clouds` + `.ks-cloud.c1/c2/c3` | `index.html` empty divs + CSS shadows |
| `arcade.css:186-201` blossoms | `.ks-blossoms` + `.ks-petal` | `index.html` 12 spans, kept from earlier work |
| `arcade.css:203-220` shooting stars | `.ks-shooters` + `.ks-shooter` | `index.html` 4 spans |
| `arcade.css:366-373` twinkle stars | `.ks-stars` + `.ks-star` | generated by `src/stars.ts` |
| `mascot.jsx` hero variant | `#mascot` mount + `<Mascot>` | `src/character/mascot.ts` |
| `screens.jsx:336-360` mode rail | `.mode-rail` + `.mode-card` | `index.html` (inline anchors) |
| `arcade.css:6-23` design tokens | `--amber`, `--neon-cyan`, `--crt-red`, `--crt-yellow`, `--harbor-*`, `--mt-*` | `css/variables.css` + `css/hero-arcade.css :root` |

## Asset inventory

| # | Element | Class | viewBox | Source | Animation |
|---|---|---|---|---|---|
| 1 | Kobe Port Tower | `.ks-tower` | 72×200 (current SVG) | `index.html` inline | `tower-shine` 2.4s + `tower-blink` 1.4s on `.tower-top` |
| 2 | Kobe Crystal Tower | `.ks-crystal` | 70×240 | `index.html` inline | — |
| 3 | Mosaic Ferris Wheel | `.ks-ferris` | 80×90 | `index.html` inline | `ferris-rotate` 30s + `cab-glow` 1.5s |
| 4 | Maritime Museum | `.ks-museum` | 120×60 | `index.html` inline | — |
| 5 | Akashi-Kaikyo Bridge | `.ks-bridge` | 480×100 | `index.html` inline | — |
| 6 | Kobe City Hall | `.ks-cityhall` | CSS only | `index.html` divs | — |
| 7 | Harbor Boat | `.ks-boat` | 140×60 | `index.html` inline | `boat-drift` 38s + `wake-pulse` 1.4s |
| 8 | Mountains | `.ks-mountains` | 1400×300 | `index.html` inline | — |
| 9 | Cherry blossoms | `.ks-petal` | CSS sprites | `index.html` 12 spans | `ks-fall` (var-driven duration) |
| 10 | Shooting stars | `.ks-shooter` | CSS gradient | `index.html` 4 spans | `ks-shoot` 14s |
| 11 | Twinkle stars | `.ks-star` | CSS dots | generated by `src/stars.ts` | `ks-twinkle` 3s |
| 12 | Skyline buildings | `.ks-bld` + `.ks-win` | CSS sprites | generated by `src/skyline.ts` | — |
| 13 | Sun rays | `.ks-sun-rays` | CSS conic | `index.html` empty div | `ks-sun-spin` 80s |
| 14 | Clouds | `.ks-cloud.c1/c2/c3` | CSS shadows | `index.html` 3 divs | `ks-drift` 60/75/90s |

All scene elements honor `prefers-reduced-motion: reduce` — animations freeze, elements stay visible.

## Day/night palette tokens

Defined in `css/variables.css` + `css/hero-arcade.css`:

- `--mt-far / --mt-mid / --mt-near` — mountain ridges (3 depths)
- `--crystal-body / --crystal-crown / --crystal-line / --crystal-pane` — Crystal Tower
- `--ferris-frame` — Ferris wheel structure
- `--museum-white / --museum-line` — Maritime Museum
- `--bridge-tower / --bridge-cable` — Akashi-Kaikyo Bridge
- `--harbor-deep / --harbor-navy / --harbor-mid` — scene gradient and skyline buildings
- `--amber / --neon-cyan / --crt-red / --crt-yellow` — arcade accents (do not redefine per scene; they are stable)

Each token has both a night default (in `:root`) and a day override (in `body.day-mode`).

## How to port a new section from the prototype

1. **Identify the JSX component** in `Downloads/mamoru_guide_design/`. Most live in `screens.jsx`; first-aid scenes in `first-aid-scenes.jsx`, typhoon in `typhoon-scenes.jsx`, scenarios in `mamoru-scenarios.jsx`.

2. **Map the class names.** The prototype uses semantic + `.ks-*` naming. If the section uses `.ks-*` classes, copy them verbatim. If it uses domain classes (`.scale-board`, `.flashcard`, etc.), keep them as the prototype names them — that lets future CSS updates port 1:1.

3. **Transcribe JSX to HTML or TS.**
   - For **static** JSX (no `useState`, no event handlers, no `useMemo` for random arrays): write it directly as HTML in `index.html`. Inline SVG with `shape-rendering="crispEdges"` for pixel art.
   - For **procedural** content (e.g., random arrays via `useMemo`): write a TS generator in `src/<feature>.ts` mirroring the JSX `useMemo` logic, then call it from `src/main.ts` after DOM ready. Precedents: `src/skyline.ts` (skyline buildings), `src/stars.ts` (stars).
   - For **interactive** content (`useState`, click handlers, keyboard nav): write a TS module that wires DOM events. Precedents: `src/quiz.ts` (vocab flashcards), `src/drill.ts` (drill timer), `src/character/mascot.ts` (hero mascot).

4. **Port CSS.** Copy the relevant block from `arcade.css` / `scenarios.css` / `style.css` into the existing CSS files. If the prototype uses CSS variables you don't have, add them to `css/variables.css` (with both `:root` night and `body.day-mode` day variants).

5. **Verify.** Run `npm run typecheck && npm test`. Open `npm run dev` and the prototype side-by-side; toggle day/night and reduced-motion.
```

- [ ] **Step 2: Commit**

```bash
git add docs/hero.md
git commit -m "docs: add docs/hero.md — prototype-to-mamoru-guide mapping and porting cookbook"
```

---

## Final verification

- [ ] **Step 1: Run full test + typecheck**

```bash
npm run typecheck && npm test
```
Expected: PASS.

- [ ] **Step 2: Build production bundle**

```bash
npm run build
```
Expected: PASS, no warnings about missing assets or unresolved imports.

- [ ] **Step 3: Preview build**

```bash
npm run preview
```
Open the preview URL, confirm hero renders identically to dev mode.

- [ ] **Step 4: Final git status**

```bash
git status
git log --oneline -20
```
Expected: clean working tree, 16 commits since branching off `feat/aditya/character-system-design-spec` head (one per task, except commits where nothing changed).
