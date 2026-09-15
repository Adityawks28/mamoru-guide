# Antislop Accessibility Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three verified accessibility defects found by an antislop audit, and add regression guards so each one fails loudly if reintroduced.

**Architecture:** Three independent fixes, each paired with a test that encodes the rule rather than the instance. Two of the three defects are *silent overrides* — correctly-authored accessibility that a wider-scoped declaration cancels (ARIA inheritance in one case, CSS zero-specificity in the other). Neither shows up in `tsc`, the build, or the existing suite, so each fix ships with a guard test that reads the real source file.

**Tech Stack:** Vanilla TypeScript (strict), Vite 6, Vitest 2 + jsdom, zero runtime dependencies.

**Spec:** This document, section "Findings" below. The audit was performed in-session against commit `f32a263`; there is no separate spec doc.

## Global Constraints

- **Zero new runtime dependencies.** The project ships none; this stays true. Test-only helpers are written inline, not installed.
- **TypeScript strict mode.** `npm run build` runs `tsc --noEmit && vite build` and must stay clean.
- **i18n EN / JA / ID.** Any user-facing string added must exist in all three via the `data-lang="en|ja|id"` span pattern that `src/lang.ts` toggles.
- **Reduced motion.** Honors both `prefers-reduced-motion: reduce` and the `a11y-reduced-motion` storage key via `motionAllowed()`. Do not bypass it.
- **Commits:** English conventional-commit style, one line, matching existing history (`fix:`, `feat:`, `test:`). No `Co-Authored-By` trailer.
- **Do not restructure.** These are surgical fixes. No refactors, no file splits, no dependency changes, no visual redesign.

---

## Findings

All three verified against commit `f32a263`.

### F-1 — Mascot is hidden from assistive tech but still takes keyboard focus

`index.html:432` mounts `<div id="mascot" aria-hidden="true">`. Inside it, `src/character/mascot.ts:68-72` builds a control with `role="button"`, `aria-label="Tap Moru for the next disaster fact"`, `tabindex="0"`, and an Enter/Space handler at line 158.

`aria-hidden="true"` on an ancestor removes the entire subtree from the accessibility tree. Consequences:

1. **WCAG 4.1.2 failure.** A `tabindex="0"` element inside `aria-hidden` is focusable but nonexistent to AT — focus lands somewhere a screen reader cannot announce. This is the axe `aria-hidden-focus` rule.
2. The `role`, `aria-label` and keyboard handler are unreachable dead code.
3. `DISASTER_FACTS` (`src/character/tips.ts`) carries real trilingual safety content that screen reader users never receive.

**Fix:** remove `aria-hidden` from the `#mascot` container; put it on the decorative sprite `<svg>` instead, so the pixel art stays decorative while the labelled control and fact text stay announceable.

### F-2 — Global focus ring silently overridden at five sites

`css/base.css:49-52` defines the focus ring:

```css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
  box-shadow: 0 0 0 2px var(--bg);
}
```

`:where()` contributes **zero specificity**, so any later rule with a class selector wins. Five rules cancel it with `outline: none`:

| File | Line | Selector | Replacement offered |
|---|---|---|---|
| `css/emergency-mode.css` | 144 | `.em-card:hover, .em-card:focus-visible` | `transform: translateY(-3px)` only — identical to hover, no contrast change |
| `css/emergency-mode.css` | 83 | `.em-card-primary:hover, .em-card-primary:focus-visible` | transform + red glow; reads as hover |
| `css/shelter-finder.css` | 183 | `.shelter-city-select:focus` | `border-color` only |
| `css/plan-wizard.css` | 91 | `.wizard-field input/select/textarea:focus` | `border-color` only |
| `css/components.css` | 451 | `.plan-field input/select/textarea:focus` | `border-color` only |

`var(--focus-ring)` is defined for both themes and used in exactly one place. The emergency screen is the highest-stakes surface in the app.

**Fix:** delete the five `outline: none` declarations. Everything else in those rules stays — the `border-color` and `transform` changes remain as secondary affordances, layered on top of the restored ring.

### F-3 — Day-mode `--text-soft` fails WCAG AA

`css/variables.css:67` sets day-mode `--text-soft: rgba(26,42,58,0.66)` over `--bg-main: #d4e6f4`.

| Theme | Token | Effective | Ratio | AA normal (4.5:1) |
|---|---|---|---|---|
| Day | `--text-soft` 0.66 | `#596a79` | **4.37** | **FAIL** |
| Day | `--text-muted` 0.76 | `#475767` | 5.81 | PASS |
| Night | `--text-soft` 0.68 | `#adb0b5` | 7.52 | PASS |

Applied at 11px in `css/layout.css:362` (`.footer-copy`) and 12px elsewhere — well under the 18px large-text threshold, so 4.5:1 is the applicable bar. Night passes; only day fails. This is the theme asymmetry antislop R-34 targets.

**Fix:** raise the day-mode alpha `0.66` → `0.70` (ratio 4.90). Rejected alternatives: `0.68` clears at 4.62 but leaves almost no margin; `0.72` reaches 5.16 but sits so close to `--text-muted` (0.76) that the soft/muted hierarchy collapses.

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `index.html` | Modify line 432 | Remove `aria-hidden` from mascot host |
| `src/character/sprite.ts` | Modify (~line 249) | Mark the decorative sprite SVG `aria-hidden` |
| `src/character/__tests__/mascot-a11y.test.ts` | Create | Guard F-1: no focusable element inside `aria-hidden` |
| `css/emergency-mode.css` | Modify lines 83, 144 | Remove `outline: none` |
| `css/shelter-finder.css` | Modify line 183 | Remove `outline: none` |
| `css/plan-wizard.css` | Modify line 91 | Remove `outline: none` |
| `css/components.css` | Modify line 451 | Remove `outline: none` |
| `src/__tests__/focus-ring.test.ts` | Create | Guard F-2: no `:focus` rule may cancel the ring |
| `css/variables.css` | Modify line 67 | Raise day `--text-soft` alpha |
| `src/__tests__/contrast.test.ts` | Create | Guard F-3: every text token clears AA in both themes |

The three guard tests read real source files rather than fixtures, because all three defects live in files the existing jsdom suite never loads.

---

### Task 1: Restore the mascot to the accessibility tree

**Files:**
- Modify: `index.html:432`
- Modify: `src/character/sprite.ts` (the `createSprite` SVG element setup, ~line 249)
- Test: `src/character/__tests__/mascot-a11y.test.ts` (create)

**Interfaces:**
- Consumes: `initMascot(): void` from `src/character/mascot.ts` — no arguments, reads `document.getElementById('mascot')` and returns early if absent.
- Consumes: `createSprite(...)` from `src/character/sprite.ts` — returns the `SVGElement` appended into the `.mascot` control.
- Produces: nothing new. This task changes attributes only; no signature changes.

- [ ] **Step 1: Write the failing test**

Create `src/character/__tests__/mascot-a11y.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

beforeEach(() => {
  document.body.innerHTML = `<div id="mascot"></div>`;
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
  vi.useFakeTimers();
});

describe('mascot accessibility', () => {
  it('does not mark the mascot host aria-hidden in index.html', () => {
    const html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf8');
    const tag = html.match(/<div[^>]*id="mascot"[^>]*>/);
    expect(tag).not.toBeNull();
    expect(tag![0]).not.toMatch(/aria-hidden\s*=\s*"true"/);
  });

  it('exposes the fact control as a labelled, focusable button', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const btn = document.querySelector('#mascot [role="button"]') as HTMLElement | null;
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute('tabindex')).toBe('0');
    expect(btn!.getAttribute('aria-label')).toBeTruthy();
  });

  it('never leaves a focusable element inside an aria-hidden subtree', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const focusable = document.querySelectorAll('#mascot [tabindex], #mascot button, #mascot a[href]');
    expect(focusable.length).toBeGreaterThan(0);
    focusable.forEach((el) => {
      expect(el.closest('[aria-hidden="true"]')).toBeNull();
    });
  });

  it('marks the decorative sprite aria-hidden', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const svg = document.querySelector('#mascot svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- mascot-a11y`

Expected: the first test FAILS (`index.html` still carries `aria-hidden="true"` on `#mascot`) and the fourth FAILS (sprite has no `aria-hidden`). Tests two and three pass already, since the jsdom fixture has no `aria-hidden` — they lock in behavior that must not regress.

- [ ] **Step 3: Remove aria-hidden from the mascot host**

In `index.html` line 432, change:

```html
    <div id="mascot" aria-hidden="true"></div>
```

to:

```html
    <div id="mascot"></div>
```

- [ ] **Step 4: Mark the decorative sprite aria-hidden**

In `src/character/sprite.ts`, find the block that configures the root SVG element (it already calls `svg.setAttribute('viewBox', '0 0 64 96')` and `svg.setAttribute('shape-rendering', 'crispEdges')`). Add one line alongside those:

```ts
  svg.setAttribute('aria-hidden', 'true');
```

The sprite is pure decoration; the `aria-label` on the `role="button"` wrapper carries the meaning.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- mascot-a11y`

Expected: 4 passed.

- [ ] **Step 6: Run the full suite and typecheck**

Run: `npm run test && npm run build`

Expected: all tests pass, `tsc --noEmit` clean, vite build succeeds. The character tests (`bible.test.ts`, `typhoon-scene.test.ts`) also assert on sprite SVGs — if either breaks because it asserted on the absence of `aria-hidden`, update that assertion rather than reverting Step 4.

- [ ] **Step 7: Commit**

```bash
git add index.html src/character/sprite.ts src/character/__tests__/mascot-a11y.test.ts
git commit -m "fix(a11y): expose mascot facts to screen readers, hide only the sprite"
```

---

### Task 2: Restore the global focus ring at five override sites

**Files:**
- Modify: `css/emergency-mode.css:83`, `css/emergency-mode.css:144`
- Modify: `css/shelter-finder.css:183`
- Modify: `css/plan-wizard.css:91`
- Modify: `css/components.css:451`
- Test: `src/__tests__/focus-ring.test.ts` (create)

**Interfaces:**
- Consumes: the `--focus-ring` custom property from `css/variables.css` (defined in both themes: `#ffe28a` night, `#6a3d05` day) and the global rule at `css/base.css:49-52`.
- Produces: nothing importable. The guard test is self-contained.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/focus-ring.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CSS_DIR = resolve(__dirname, '../../css');

// Matches a CSS rule: everything up to `{`, then the body up to the closing `}`.
const RULE = /([^{}]+)\{([^{}]*)\}/g;

function offendingRules(): string[] {
  const offenders: string[] = [];
  for (const file of readdirSync(CSS_DIR).filter((f) => f.endsWith('.css'))) {
    const css = readFileSync(resolve(CSS_DIR, file), 'utf8');
    for (const [, selector, body] of css.matchAll(RULE)) {
      if (!selector.includes(':focus')) continue;
      if (!/outline\s*:\s*(none|0)\b/.test(body)) continue;
      offenders.push(`${file}: ${selector.trim().replace(/\s+/g, ' ')}`);
    }
  }
  return offenders;
}

describe('focus ring', () => {
  it('is never cancelled by a :focus rule', () => {
    // css/base.css:49 defines the ring inside :where(), which has ZERO
    // specificity — any later class rule silently wins. Cancelling the
    // outline there leaves keyboard users with no visible focus.
    expect(offendingRules()).toEqual([]);
  });

  it('defines --focus-ring for both themes', () => {
    const vars = readFileSync(resolve(CSS_DIR, 'variables.css'), 'utf8');
    const rings = vars.match(/--focus-ring\s*:/g) ?? [];
    expect(rings.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- focus-ring`

Expected: FAIL. The first test reports five offenders — `emergency-mode.css` (twice), `shelter-finder.css`, `plan-wizard.css`, `components.css`.

- [ ] **Step 3: Delete the five `outline: none` declarations**

Remove **only** the `outline: none;` line from each rule below. Leave every other declaration in place — the `transform`, `box-shadow` and `border-color` changes stay as secondary affordances layered on the restored ring.

`css/emergency-mode.css:144`:

```css
.em-card:hover,
.em-card:focus-visible {
  transform: translateY(-3px);
}
```

`css/emergency-mode.css:83`:

```css
.em-card-primary:hover,
.em-card-primary:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 0 40px rgba(232,64,64,0.45), 0 12px 32px rgba(0,0,0,0.45);
}
```

`css/shelter-finder.css:183`:

```css
.shelter-city-select:focus {
  border-color: var(--accent);
}
```

`css/plan-wizard.css:91`:

```css
.wizard-field input:focus,
.wizard-field select:focus,
.wizard-field textarea:focus {
  border-color: var(--accent);
}
```

`css/components.css:451`:

```css
.plan-field input:focus,
.plan-field select:focus,
.plan-field textarea:focus {
  border-color: var(--accent);
}
```

- [ ] **Step 4: Add a guard comment at the definition site**

In `css/base.css`, directly above line 49, add one line so the next person understands why the rule loses:

```css
/* :where() = zero specificity: any class rule below can cancel this ring. Don't. */
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- focus-ring`

Expected: 2 passed.

- [ ] **Step 6: Verify the ring is actually visible**

Run: `npm run dev`, open the app, and press Tab repeatedly through: the hero arcade buttons, the three mode cards, emergency mode cards, the shelter city select, and the plan wizard fields. Each must show a 3px `--focus-ring` outline with a 3px offset, in **both** day and night mode.

Record the result as evidence, element by element. This is a manual check — the test proves the CSS no longer cancels the ring, not that the ring renders.

- [ ] **Step 7: Commit**

```bash
git add css/emergency-mode.css css/shelter-finder.css css/plan-wizard.css css/components.css css/base.css src/__tests__/focus-ring.test.ts
git commit -m "fix(a11y): stop five rules cancelling the global focus ring"
```

---

### Task 3: Fix day-mode text contrast

**Files:**
- Modify: `css/variables.css:67`
- Test: `src/__tests__/contrast.test.ts` (create)

**Interfaces:**
- Consumes: the token definitions in `css/variables.css` — night under `:root` (bg `--harbor-navy: #0f1f3d`, text `--kitano-white: #f8f4ed`) and day under `body.day-mode` (`--bg-main: #d4e6f4`, `--text-main: #1a2a3a`).
- Produces: nothing importable. The contrast helpers are local to the test file.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/contrast.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type RGB = [number, number, number];

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: RGB): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function composite(fg: RGB, alpha: number, bg: RGB): RGB {
  return fg.map((f, i) => Math.round(f * alpha + bg[i] * (1 - alpha))) as RGB;
}

const vars = readFileSync(resolve(__dirname, '../../css/variables.css'), 'utf8');

/** Reads `--name: rgba(r,g,b,a)` and returns its alpha. */
function alphaOf(name: string, occurrence: number): number {
  const all = [...vars.matchAll(
    new RegExp(`--${name}\\s*:\\s*rgba\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*([\\d.]+)\\s*\\)`, 'g'),
  )];
  expect(all.length).toBeGreaterThan(occurrence);
  return Number(all[occurrence][1]);
}

const AA_NORMAL = 4.5;
const DAY_BG: RGB = [212, 230, 244];   // --bg-main in body.day-mode
const DAY_FG: RGB = [26, 42, 58];      // --text-main in body.day-mode
const NIGHT_BG: RGB = [15, 31, 61];    // --harbor-navy
const NIGHT_FG: RGB = [248, 244, 237]; // --kitano-white

describe('WCAG AA contrast for text tokens', () => {
  // Occurrence 0 = night block (:root), occurrence 1 = day block (body.day-mode).
  it('day --text-soft clears AA for normal text', () => {
    const r = ratio(composite(DAY_FG, alphaOf('text-soft', 1), DAY_BG), DAY_BG);
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('day --text-muted clears AA for normal text', () => {
    const r = ratio(composite(DAY_FG, alphaOf('text-muted', 1), DAY_BG), DAY_BG);
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('night --text-soft clears AA for normal text', () => {
    const r = ratio(composite(NIGHT_FG, alphaOf('text-soft', 0), NIGHT_BG), NIGHT_BG);
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('night --text-muted clears AA for normal text', () => {
    const r = ratio(composite(NIGHT_FG, alphaOf('text-muted', 0), NIGHT_BG), NIGHT_BG);
    expect(r).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- contrast`

Expected: exactly one failure — `day --text-soft` at ratio **4.37**, below 4.5. The other three pass (day muted 5.81, night soft 7.52, night muted 9.49).

- [ ] **Step 3: Raise the day-mode alpha**

In `css/variables.css` line 67 (inside the `body.day-mode` block), change:

```css
  --text-soft: rgba(26,42,58,0.66);
```

to:

```css
  --text-soft: rgba(26,42,58,0.70);
```

This yields 4.90:1. Do **not** change the night value at line 23 — it already passes at 7.52, and matching the alphas would darken night text for no reason.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- contrast`

Expected: 4 passed.

- [ ] **Step 5: Verify visually in day mode**

Run: `npm run dev`, switch to day mode, and check that `.footer-copy` (11px, `css/layout.css:362`) and the shelter/wizard secondary text are legible and still read as *softer* than `--text-muted` text beside them. If the hierarchy looks flat, that is a signal the fix went too far — report it rather than tuning silently.

- [ ] **Step 6: Run the full suite and typecheck**

Run: `npm run test && npm run build`

Expected: all tests pass, build clean.

- [ ] **Step 7: Commit**

```bash
git add css/variables.css src/__tests__/contrast.test.ts
git commit -m "fix(a11y): raise day-mode --text-soft to clear WCAG AA"
```

---

## Out of Scope (deliberately)

- **Em dashes (antislop R-02).** 139 user-facing occurrences. R-02 is a heuristic for AI-written English marketing prose; here the dashes carry grammatical weight in trilingual safety instruction (`地震後はエレベーター、電気スイッチ、火気を絶対に使わない — ガス漏れで爆発の危険。`). A blanket replace would damage the copy. A selective pass over English marketing-adjacent strings is a separate, optional change.
- **`DESIGN.md` (antislop R-37).** Direction exists in `docs/hero.md` and the character-system spec but not where antislop looks. Promoting it is a docs task, not an a11y fix.
- **Full R-35 click-through.** The audit verified 40 buttons against 40 click listeners by count, which is circumstantial, not proof. A recorded click-through of every control is its own task.
- **Any visual redesign.** The audit found the design itself sound: strong identity, bespoke motion (48 of 52 keyframes are content-specific), authored palette, hard-edged arcade shadows. Nothing here changes how it looks beyond one alpha value.
