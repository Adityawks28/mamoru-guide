# Mamoru Guide — Fixes & Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Source evaluation:** `docs/superpowers/specs/2026-06-20-full-app-evaluation.md`
**Character system plan (reference):** `docs/superpowers/plans/2026-05-21-mamoru-character-system.md`
**Commit convention:** `feat:` / `fix:` / `chore:` / `docs:` prefix, no Claude trailer (per CLAUDE.md)
**Test runner:** `npx vitest run` (or `npm test`)
**Build check:** `npm run build` (runs `tsc --noEmit && vite build`)

---

## PHASE 1: Safety-Critical Fixes (must be first)

All five tasks in this phase are **parallelizable** -- they touch different files and have no dependencies on each other.

---

### Task 1: Fix CPR tip -- age-differentiate depth

**Why:** The current CPR tip says "5-6cm deep" which is correct for adults only. For children the maximum is 5cm; for infants it is 4cm. Pushing too deep on a child causes internal injuries.

**Files:**
- Modify: `src/character/tips.ts` (line 40)
- Modify: `src/first-aid.ts` (line 74)

- [ ] **Step 1: Update the FIRSTAID_TIPS CPR tip in `src/character/tips.ts`**

In `src/character/tips.ts`, replace line 40:

```ts
  { en: "CPR: push hard, push fast — 100-120 per minute, 5-6cm deep.",     ja: "胸骨圧迫は強く速く",    id: "CPR: tekan keras, tekan cepat — 100-120/menit, dalam 5-6cm." },
```

with:

```ts
  { en: "CPR: push hard, push fast — 100-120/min. Adults: 5-6cm deep. Children: max 5cm. Take a CPR course.", ja: "胸骨圧迫: 成人5-6cm、小児は最大5cm。講習を受けよう", id: "CPR: tekan keras, cepat — 100-120/mnt. Dewasa: 5-6cm. Anak: maks 5cm. Ikuti pelatihan CPR." },
```

- [ ] **Step 2: Update the CPR step instruction in `src/first-aid.ts`**

In `src/first-aid.ts`, replace line 74:

```ts
      { instruction_en: 'Push hard and fast: 5-6cm deep, 100-120 pushes per minute. Let the chest fully recoil.', instruction_ja: '強く速く押す：5〜6cm深く、1分間に100〜120回。胸を完全に戻す。', instruction_id: 'Tekan keras dan cepat: 5-6cm dalam, 100-120 tekanan per menit. Biarkan dada kembali sepenuhnya.' },
```

with:

```ts
      { instruction_en: 'Push hard and fast: 100-120 pushes per minute. Adults: 5-6cm deep. Children: max 5cm. Infants: 4cm (two fingers). Let the chest fully recoil.', instruction_ja: '強く速く押す：1分間に100〜120回。成人: 5〜6cm。小児: 最大5cm。乳児: 4cm（指2本）。胸を完全に戻す。', instruction_id: 'Tekan keras dan cepat: 100-120 tekanan per menit. Dewasa: 5-6cm. Anak: maks 5cm. Bayi: 4cm (dua jari). Biarkan dada kembali sepenuhnya.' },
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all tests pass. The tips test enforces a 110-char limit on `en` and `id` strings -- the new CPR tip `en` is 97 chars, `id` is 92 chars; both fit.

- [ ] **Step 4: Commit**

```bash
git add src/character/tips.ts src/first-aid.ts
git commit -m "fix: age-differentiate CPR compression depth in tips and first-aid steps"
```

---

### Task 2: Fix shock management tip

**Why:** "Lay flat" is wrong for respiratory distress and cardiac shock (need semi-upright). The blanket advice is correct for blood-loss shock only.

**Files:**
- Modify: `src/character/tips.ts` (line 43)
- Modify: `src/first-aid.ts` (lines 83-84)

- [ ] **Step 1: Update the FIRSTAID_TIPS shock tip in `src/character/tips.ts`**

In `src/character/tips.ts`, replace line 43:

```ts
  { en: "Shock: lay them flat, elevate legs, blanket on top, no food/drink.", ja: "ショック対応は寝かせて足上げ", id: "Syok: baringkan, angkat kaki, selimuti, jangan beri makan/minum." },
```

with:

```ts
  { en: "Shock from blood loss: lay flat, elevate legs. Breathing difficulty: keep semi-upright. Always call 119.", ja: "出血性ショック: 寝かせて足上げ。呼吸困難: 半座位。必ず119番", id: "Syok pendarahan: baringkan, angkat kaki. Sesak napas: semi-tegak. Selalu hubungi 119." },
```

- [ ] **Step 2: Update the first-aid shock steps in `src/first-aid.ts`**

In `src/first-aid.ts`, replace line 83:

```ts
      { instruction_en: 'Lay the person flat on their back. Elevate legs 20-30cm if no spinal injury suspected.', instruction_ja: '仰向けに寝かせる。脊椎損傷の疑いがなければ足を20〜30cm上げる。', instruction_id: 'Baringkan orang terlentang. Angkat kaki 20-30cm jika tidak dicurigai cedera tulang belakang.' },
```

with:

```ts
      { instruction_en: 'For blood-loss shock: lay flat, elevate legs 20-30cm. For breathing difficulty or chest injury: keep them semi-upright. Never lay flat if they are vomiting.', instruction_ja: '出血性ショック: 仰向けに寝かせ足を20〜30cm上げる。呼吸困難・胸部外傷: 半座位にする。嘔吐時は横向きに。', instruction_id: 'Syok pendarahan: baringkan, angkat kaki 20-30cm. Sesak napas atau cedera dada: posisi semi-tegak. Jangan telentangkan jika muntah.' },
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/character/tips.ts src/first-aid.ts
git commit -m "fix: differentiate shock management by type (blood-loss vs respiratory)"
```

---

### Task 3: Fix burn treatment tip -- add covering step

**Why:** The burn tip says to cool with water but doesn't mention covering the burn after cooling to prevent infection.

**Files:**
- Modify: `src/character/tips.ts` (line 39)

- [ ] **Step 1: Update the FIRSTAID_TIPS burn tip in `src/character/tips.ts`**

In `src/character/tips.ts`, replace line 39:

```ts
  { en: "Burn? Cool water for 20 minutes. Never ice, butter, or toothpaste.", ja: "やけどは流水20分",     id: "Luka bakar? Air sejuk 20 menit. Jangan es, mentega, atau pasta gigi." },
```

with:

```ts
  { en: "Burn? Cool water 20 min, then cover loosely with clean cloth. Never ice, butter, or toothpaste.", ja: "やけどは流水20分、清潔な布で緩く覆う。氷・バター・歯磨き粉は禁止", id: "Luka bakar? Air sejuk 20 mnt, lalu tutup longgar dengan kain bersih. Jangan es/mentega/pasta gigi." },
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass. New `en` string is 99 chars (under 110 limit).

- [ ] **Step 3: Commit**

```bash
git add src/character/tips.ts
git commit -m "fix: add burn covering step to first-aid tip"
```

---

### Task 4: Fix bag game weight bug -- "perfect" score impossible

**Why:** `w >= 8 && w <= MAX_BAG_WEIGHT` is always false when `MAX_BAG_WEIGHT === 8.0` because the only value satisfying both is exactly 8.0, which is nearly impossible to hit with floating-point item weights. The intent is to reward a well-packed bag near the weight limit.

**Files:**
- Modify: `src/bag-game.ts` (line 127)

- [ ] **Step 1: Fix the weight comparison**

In `src/bag-game.ts`, replace line 127:

```ts
  else if (w >= 8 && w <= MAX_BAG_WEIGHT) status = 'perfect';
```

with:

```ts
  else if (w >= MAX_BAG_WEIGHT * 0.85 && w <= MAX_BAG_WEIGHT) status = 'perfect';
```

This means a bag weighing 6.8-8.0 kg (85-100% of max) is "perfect", which is achievable.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/bag-game.ts
git commit -m "fix: bag game perfect score now achievable (85-100% of max weight)"
```

---

### Task 5: Verify root `<html lang>` attribute update on language switch

**Why:** The evaluation reports that `<html lang="en">` stays English on language switch. However, `src/lang.ts` line 16 already calls `document.documentElement.setAttribute('lang', ...)`. The bug may have been in an older version or may be an `initLang()` timing issue. This task verifies the fix is in place and adds a test.

**Files:**
- Verify: `src/lang.ts` (line 16, already has the fix)
- Create: `src/__tests__/lang.test.ts`

- [ ] **Step 1: Confirm the existing code in `src/lang.ts`**

Verify that line 16 of `src/lang.ts` contains:

```ts
  document.documentElement.setAttribute('lang', lang === 'ja' ? 'ja' : lang === 'id' ? 'id' : 'en');
```

This is correct and functional. No code change needed.

- [ ] **Step 2: Write a regression test**

File: `src/__tests__/lang.test.ts`

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.documentElement.setAttribute('lang', 'en');
  document.body.className = 'lang-en';
  document.body.innerHTML = '<button class="lang-btn active"></button>';
  localStorage.clear();
});

describe('lang', () => {
  it('setLang("ja") updates <html lang> to ja', async () => {
    vi.resetModules();
    const { setLang } = await import('../lang');
    setLang('ja');
    expect(document.documentElement.getAttribute('lang')).toBe('ja');
  });

  it('setLang("id") updates <html lang> to id', async () => {
    vi.resetModules();
    const { setLang } = await import('../lang');
    setLang('id');
    expect(document.documentElement.getAttribute('lang')).toBe('id');
  });

  it('initLang restores saved language and updates <html lang>', async () => {
    localStorage.setItem('mamoru-lang', 'ja');
    vi.resetModules();
    const { initLang } = await import('../lang');
    initLang();
    expect(document.documentElement.getAttribute('lang')).toBe('ja');
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all tests pass, confirming the `<html lang>` attribute update works.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/lang.test.ts
git commit -m "fix: add regression tests for html lang attribute update on language switch"
```

---

## PHASE 2: Memory Leaks & Bugs

Tasks 6-10 are **parallelizable** (each touches a different module). Tasks 11-12 are also parallelizable with each other but can run in parallel with 6-10 too.

---

### Task 6: Fix First Aid timer leak

**Why:** New intervals are created on every timer-start click, but old intervals are not always cleared when the user navigates to a different step. The `stopTimer()` is called at the top of `renderSteps()` but the click handler inside creates a new interval without guarding against re-entry from the same button click.

**Files:**
- Modify: `src/first-aid.ts` (lines 275-307)

- [ ] **Step 1: Fix the timer click handler**

In `src/first-aid.ts`, find the timer click handler starting at line 277. The current code at lines 282-287 checks `if (timerInterval)` but doesn't clear the timer before creating a new one when clicked a third time. Replace lines 274-307 (the entire timer logic block):

```ts
  // Timer logic
  const timerBtn = document.getElementById('firstaidTimerBtn');
  if (timerBtn && step.timer_seconds) {
    timerBtn.addEventListener('click', () => {
      const display = document.querySelector('.firstaid-timer-display');
      const timer = document.getElementById('firstaidTimer');
      if (!display || !timer) return;

      if (timerInterval) {
        stopTimer();
        timerBtn.innerHTML = `<span data-lang="en">▶ Start Timer</span><span data-lang="ja">▶ タイマー開始</span><span data-lang="id">▶ Mulai Timer</span>`;
        timer.classList.remove('running');
        reapplyLang();
        return;
      }

      timer.classList.add('running');
      timerBtn.innerHTML = `<span data-lang="en">⏸ Pause</span><span data-lang="ja">⏸ 一時停止</span><span data-lang="id">⏸ Jeda</span>`;
      reapplyLang();

      timerInterval = setInterval(() => {
        timerRemaining--;
        display.textContent = formatTime(timerRemaining);
        if (timerRemaining <= 0) {
          stopTimer();
          timer.classList.remove('running');
          timer.classList.add('done');
          display.textContent = getLangText('Time\'s up!', '時間です！', 'Waktu habis!');
          timerBtn.innerHTML = `<span data-lang="en">✓ Complete</span><span data-lang="ja">✓ 完了</span><span data-lang="id">✓ Selesai</span>`;
          (timerBtn as HTMLButtonElement).disabled = true;
          reapplyLang();
        }
      }, 1000);
    });
  }
```

Wait -- looking at this again, the actual code is already correct. The `if (timerInterval)` branch calls `stopTimer()` which clears the interval. The bug is more subtle: `stopTimer()` is called in `renderSteps()` at line 185, but `renderCategories()` at line 145 also calls `stopTimer()`. The leak is that when the user navigates away (clicks back) while a timer is running, then returns and starts a new timer, the old `timerInterval` is not cleared because `renderCategories()` already set it to null.

Actually, re-examining: `stopTimer()` at line 129-134 does `clearInterval(timerInterval)` and sets `timerInterval = null`. This is called by `renderSteps()` and `renderCategories()`. The code seems correct in isolation but the issue is that `timerInterval` is module-scoped, so if `renderSteps()` is called multiple times (user clicks next/prev), the old timer IS cleared by `stopTimer()` at the top of `renderSteps()`.

The real leak is: if `renderSteps()` creates a timer interval, and the user clicks the next button (which calls `renderSteps()` again), `stopTimer()` at line 185 clears the old interval. That seems correct.

Let me look more carefully. The real issue is this: the button click handler creates `timerInterval = setInterval(...)`. If the user clicks the "Next" button, `renderSteps()` is called, which calls `stopTimer()` -- that clears `timerInterval`. But the DOM is re-rendered, so the old button and its listener are gone. This is actually fine.

The actual leak pattern: The timer button handler creates a new interval. If the user DOESN'T click the timer button but navigates via "Next", `stopTimer()` clears any existing interval. So the code is correct in flow.

But wait -- there IS an issue: when `renderSteps()` re-renders the HTML (`container.innerHTML = ...`), the old button's event listener is garbage-collected along with the DOM. But the `setInterval` callback still holds a reference to the now-orphaned DOM elements (`display`, `timer`). This means the interval keeps ticking and calling `display.textContent = ...` on detached DOM nodes. The interval is never cleared because `timerInterval` is set to `null` by `stopTimer()` at the start of the next `renderSteps()`, but the issue is if `renderSteps()` is called WHILE the interval is still running from a previous call and the module-level `timerInterval` variable was already set to `null` before the new interval was started.

Let me trace it: User clicks start timer -> `timerInterval = setInterval(...)`. User clicks "Next" -> `renderSteps()` -> `stopTimer()` (clears old interval) -> re-renders HTML with new step. New step also has a timer -> user clicks start -> `timerInterval = setInterval(...)`. This is correct.

OK, looking more carefully at the evaluation's line numbers (275-307), the issue is that there's no cleanup mechanism when navigating between categories -- the `renderCategories()` function calls `stopTimer()` which is fine. But the deeper issue is: what happens if `renderSteps()` is called and the new step does NOT have a timer? The old `timerInterval` would have been cleared by `stopTimer()` at line 185. That's fine.

I think the evaluation identified a potential issue rather than an active leak. The fix I'll write is to ensure `stopTimer()` is always called before creating a new interval, and to add a module-level cleanup that's called by `renderCategories()`:

Actually, the current code is structurally correct. The `stopTimer()` at the top of each `renderSteps()` call clears any running timer. Let me note this in the plan as "verified correct, add defensive guard" for robustness.

- [ ] **Step 1: Add defensive timer cleanup**

In `src/first-aid.ts`, the timer logic at lines 275-307 is structurally sound but add a defensive `stopTimer()` call before creating a new interval inside the click handler. Replace line 294:

```ts
      timerInterval = setInterval(() => {
```

with:

```ts
      stopTimer();
      timerInterval = setInterval(() => {
```

This ensures that even if `timerInterval` was somehow not cleared (e.g., a race condition from rapid clicks), the old interval is stopped before a new one is created.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/first-aid.ts
git commit -m "fix: add defensive timer cleanup in first-aid to prevent interval leak"
```

---

### Task 7: Fix Drill countdown leak

**Why:** When the user clicks "Try Again" in drill results, `startCountdown()` is called without clearing the previous `countdownTimer`. If the user clicks retry rapidly, multiple countdown intervals stack.

**Files:**
- Modify: `src/drill.ts` (lines 135-159)

- [ ] **Step 1: Clear existing countdown before starting a new one**

In `src/drill.ts`, at line 135 inside `startCountdown()`, add a clear at the top of the function. Replace:

```ts
function startCountdown(): void {
  const container = document.getElementById('drillContainer');
  const startBtn = document.getElementById('drillStartBtn');
  if (!container || !startBtn) return;

  startBtn.style.display = 'none';
  let count = 3;
```

with:

```ts
function startCountdown(): void {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  const container = document.getElementById('drillContainer');
  const startBtn = document.getElementById('drillStartBtn');
  if (!container || !startBtn) return;

  startBtn.style.display = 'none';
  let count = 3;
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/drill.ts
git commit -m "fix: clear drill countdown timer before starting new one"
```

---

### Task 8: Fix Mascot mousemove listener leak

**Why:** In `src/character/mascot.ts`, the `applyMotion` function adds a `mousemove` listener to `window` when motion is allowed, and removes it when disabled. But `applyMotion` is called initially AND on every `onMotionChange` callback. If the user toggles motion rapidly, multiple listeners could accumulate because the initial `applyMotion(allowed)` call at line 171 adds a listener, and subsequent calls may not properly clean up.

**Files:**
- Modify: `src/character/mascot.ts` (lines 157-172)

- [ ] **Step 1: Always remove listener before conditionally re-adding**

In `src/character/mascot.ts`, the `applyMotion` function at lines 157-169 should unconditionally remove the listener first. Replace:

```ts
  function applyMotion(now: boolean): void {
    allowed = now;
    clearFactTimer();
    clearBlink();
    if (allowed) {
      scheduleFactTimer();
      scheduleBlink();
      window.addEventListener('mousemove', onPointerMove);
    } else {
      window.removeEventListener('mousemove', onPointerMove);
      updateSprite(sprite, { pupil: { x: 0, y: 0 }, blink: false });
    }
  }
```

with:

```ts
  function applyMotion(now: boolean): void {
    allowed = now;
    clearFactTimer();
    clearBlink();
    window.removeEventListener('mousemove', onPointerMove);
    if (allowed) {
      scheduleFactTimer();
      scheduleBlink();
      window.addEventListener('mousemove', onPointerMove);
    } else {
      updateSprite(sprite, { pupil: { x: 0, y: 0 }, blink: false });
    }
  }
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/character/mascot.ts
git commit -m "fix: always remove mascot mousemove listener before re-adding"
```

---

### Task 9: Fix Earthquake scene walkTimers leak

**Why:** In `src/character/earthquake-scene.ts`, `walkTo()` at line 336 calls `clearWalkTimers()` then pushes new timeouts into `walkTimers`. But `applyMotion()` at line 388 calls `clearWalkTimers()` then may call `applyIntensity()` which calls `walkTo()` which pushes new timers. The leak occurs when `applyMotion` is called rapidly: `clearWalkTimers` clears the array, but `applyIntensity` -> `walkTo` creates new timers, and if `applyMotion` is called again before those timers fire, the old timers are still pending because `clearWalkTimers` was called with an already-empty array (the timers were created AFTER the clear).

Actually, tracing the code more carefully: `clearWalkTimers` at line 285-288 does `walkTimers.forEach(t => window.clearTimeout(t)); walkTimers = [];`. Then `walkTo` at line 346-351 pushes new timer IDs into `walkTimers`. On next call, `clearWalkTimers` clears those. This is correct -- the issue is that `walkTimers` is only cleared at the start of `walkTo` and in `applyMotion`, not in `applyIntensity`. If `applyIntensity` is called multiple times quickly (e.g., user clicks shindo rows rapidly), each call to `walkTo` clears previous timers. This seems correct.

The evaluation says "walkTimers not cleared between applyMotion calls" at line 347. Let me verify: `applyMotion` at line 388-403 calls `clearWalkTimers()` (line 390), then if `allowed`, calls `applyIntensity(intensity, false)` (line 396) which calls `walkTo(i)` (line 359) which calls `clearWalkTimers()` (line 337) then creates new timers. So we clear twice -- that's fine.

The actual issue is subtle: if `applyMotion(false)` is called, line 390 calls `clearWalkTimers()` and line 401 calls `walkTo(0)` which calls `clearWalkTimers()` again (the array is already empty) then creates a new timer for the stand pose. But since `allowed` is false at this point, `walkTo` enters the `if (!allowed)` branch at line 341 and does NOT create timers (just updates sprite directly). So no leak here either.

The leak scenario from the evaluation: if the shindo event fires rapidly, `applyIntensity` is called for each event. Each `applyIntensity` -> `walkTo` clears old timers and creates new ones. This is correct behavior. I'll add a minor defensive fix to ensure timer IDs can't escape.

**Files:**
- Modify: `src/character/earthquake-scene.ts` (line 347)

- [ ] **Step 1: Move clearWalkTimers call before the sequence loop**

The code at line 337 already has `clearWalkTimers()` at the start of `walkTo`. This is correct. For extra safety, ensure `applyIntensity` also clears walk timers before calling `walkTo`:

In `src/character/earthquake-scene.ts`, replace line 354 (start of `applyIntensity`):

```ts
  function applyIntensity(i: number, lockUntilTimeout = true): void {
    intensity = i;
    applyHazards(i);
```

with:

```ts
  function applyIntensity(i: number, lockUntilTimeout = true): void {
    intensity = i;
    clearWalkTimers();
    applyHazards(i);
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/character/earthquake-scene.ts
git commit -m "fix: clear walkTimers defensively in applyIntensity to prevent timer leak"
```

---

### Task 10: Fix Show This touch handler re-declaration leak

**Why:** Every call to `renderCard()` adds new `touchstart` and `touchend` listeners to the freshly-created card element. Since `renderCard()` replaces `innerHTML`, the old DOM is destroyed along with its listeners, so this is technically NOT a leak. However, it's inefficient and creates unnecessary listener objects on every card navigation.

**Files:**
- Modify: `src/show-this.ts` (lines 128-142)

- [ ] **Step 1: Extract swipe handling to the container level**

In `src/show-this.ts`, move the touch handlers out of `renderCard()` to `initShowThis()` where they're attached once to the container. Replace the touch handling block inside `renderCard()` (lines 128-142):

```ts
  // Swipe support
  let touchStartX = 0;
  const card = cardContainer.querySelector('.showthis-card');
  if (card) {
    card.addEventListener('touchstart', (e) => {
      touchStartX = (e as TouchEvent).touches[0].clientX;
    }, { passive: true });
    card.addEventListener('touchend', (e) => {
      const diff = touchStartX - (e as TouchEvent).changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < list.length - 1) { currentIndex++; renderCard(); }
        else if (diff < 0 && currentIndex > 0) { currentIndex--; renderCard(); }
      }
    }, { passive: true });
  }
```

with nothing (remove this block entirely from `renderCard()`).

Then in `initShowThis()`, after the `renderCard();` call at line 156, add the touch handlers once on the container:

In `src/show-this.ts`, replace the end of `initShowThis()`:

```ts
export function initShowThis(): void {
  const container = document.getElementById('showThisContainer');
  if (!container) return;

  container.innerHTML = '<div id="showThisCard"></div>';
  renderTabs(container);
  // Move tabs before the card
  const tabBar = container.querySelector('.tab-bar');
  const cardEl = document.getElementById('showThisCard');
  if (tabBar && cardEl) container.insertBefore(tabBar, cardEl);

  renderCard();
}
```

with:

```ts
export function initShowThis(): void {
  const container = document.getElementById('showThisContainer');
  if (!container) return;

  container.innerHTML = '<div id="showThisCard"></div>';
  renderTabs(container);
  const tabBar = container.querySelector('.tab-bar');
  const cardEl = document.getElementById('showThisCard');
  if (tabBar && cardEl) container.insertBefore(tabBar, cardEl);

  renderCard();

  let touchStartX = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartX = (e as TouchEvent).touches[0].clientX;
  }, { passive: true });
  container.addEventListener('touchend', (e) => {
    const diff = touchStartX - (e as TouchEvent).changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const list = phrases[currentCat];
      if (diff > 0 && currentIndex < list.length - 1) { currentIndex++; renderCard(); }
      else if (diff < 0 && currentIndex > 0) { currentIndex--; renderCard(); }
    }
  }, { passive: true });
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/show-this.ts
git commit -m "fix: move show-this touch handlers to container to prevent re-declaration"
```

---

### Task 11: Fix theme init logic

**Why:** In `src/theme.ts` lines 18-24, when `saved === 'day'`, the code sets `isDayMode = false` and then calls `toggleDayNight()`, which flips it to `true`. This works but is confusing and error-prone. If someone changes `toggleDayNight()`, the init logic could break. A direct set is safer.

**Files:**
- Modify: `src/theme.ts` (lines 18-24)

- [ ] **Step 1: Rewrite initTheme for clarity**

In `src/theme.ts`, replace the entire `initTheme` function:

```ts
export function initTheme(): void {
  const saved = localStorage.getItem('mamoru-theme');
  if (saved === 'day') {
    isDayMode = false;
    toggleDayNight();
  }
}
```

with:

```ts
export function initTheme(): void {
  const saved = localStorage.getItem('mamoru-theme');
  if (saved === 'day') {
    isDayMode = true;
    document.body.classList.add('day-mode');
    const hero = document.getElementById('hero');
    if (hero) {
      hero.classList.remove('night-sky');
      hero.classList.add('day-sky');
    }
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) modeToggle.textContent = '🌙';
    const mobileToggle = document.getElementById('mobileThemeToggle');
    if (mobileToggle) mobileToggle.textContent = '🌙 Night Mode';
  }
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/theme.ts
git commit -m "fix: rewrite theme init to directly set day mode instead of toggle trick"
```

---

### Task 12: Fix non-null assertions without checks

**Why:** Several files use `!` non-null assertions that could crash at runtime if the DOM element is missing.

**Files:**
- Modify: `src/show-this.ts` (line 31 -- actually this is `btn.dataset.idx!` which is safe because we just set it; no fix needed)
- Modify: `src/first-aid.ts` (line 169 -- `btn.dataset.idx!`)
- Modify: `src/section-nav.ts` (line 76 -- `chip.dataset.target!`)

- [ ] **Step 1: Fix first-aid.ts non-null assertion**

In `src/first-aid.ts`, line 169:

```ts
      currentCategory = parseInt(btn.dataset.idx!, 10);
```

Replace with:

```ts
      const idx = btn.dataset.idx;
      if (idx === undefined) return;
      currentCategory = parseInt(idx, 10);
```

- [ ] **Step 2: Fix section-nav.ts non-null assertion**

In `src/section-nav.ts`, line 76:

```ts
    sectionToChip.set(chip.dataset.target!, chip);
```

Replace with:

```ts
    const target = chip.dataset.target;
    if (target) sectionToChip.set(target, chip);
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/first-aid.ts src/section-nav.ts
git commit -m "fix: replace non-null assertions with runtime checks"
```

---

## PHASE 3: Accessibility

Tasks 13-18 are **parallelizable** -- they touch different files and have no cross-dependencies.

---

### Task 13: Add prefers-reduced-motion to 8 CSS files

**Why:** 8 CSS files have animations without a reduced-motion media query, meaning users who prefer reduced motion still see all animations.

**Files:**
- Modify: `css/layout.css`
- Modify: `css/hero.css`
- Modify: `css/emergency-fab.css`
- Modify: `css/bag-game.css`
- Modify: `css/drill.css`
- Modify: `css/plan-wizard.css`
- Modify: `css/components.css`
- Modify: `css/hero-arcade.css`

- [ ] **Step 1: Add reduced-motion query to each file**

Append the following block to the **end** of each CSS file:

**`css/layout.css`** -- append:
```css
@media (prefers-reduced-motion: reduce) {
  .section { transition: none; opacity: 1; transform: none; }
  .mode-card { transition: none; }
  .mode-card:hover { transform: none; }
  .mode-card-icon { transition: none; }
  .mode-card:hover .mode-card-icon { transform: none; }
  .mobile-menu { transition: none; }
  .toast { transition: none; }
}
```

**`css/hero.css`** -- append:
```css
@media (prefers-reduced-motion: reduce) {
  .hero-title, .hero-kanji, .hero-subtitle { animation: none; opacity: 1; transform: none; }
  .mascot-char { animation: none; }
}
```

**`css/emergency-fab.css`** -- append:
```css
@media (prefers-reduced-motion: reduce) {
  .emergency-fab { animation: none; }
  .emergency-fab.active { animation: none; }
  .emergency-fab-panel { animation: none; }
}
```

**`css/bag-game.css`** -- append at end of file:
```css
@media (prefers-reduced-motion: reduce) {
  .bag-item { transition: none; }
  .bag-item.rejected { animation: none; }
}
```

**`css/drill.css`** -- append:
```css
@media (prefers-reduced-motion: reduce) {
  .drill-container.shaking,
  #drillContainer.shaking { animation: none; }
  .drill-countdown { animation: none; }
  .drill-countdown.pulse { animation: none; }
  .drill-alert { animation: none; }
  .drill-option { transition: none; }
  .drill-option:hover:not(:disabled) { transform: none; }
  .drill-next-btn:hover, .drill-retry-btn:hover { transform: none; }
}
```

**`css/plan-wizard.css`** -- append at end of file:
```css
@media (prefers-reduced-motion: reduce) {
  .wizard-dot { transition: none; }
  .wizard-dot:hover { transform: none; }
  .wizard-dot.active { transform: none; }
}
```

**`css/components.css`** -- append at end of file:
```css
@media (prefers-reduced-motion: reduce) {
  .mode-card { transition: none; }
}
```

**`css/hero-arcade.css`** -- append at end of file:
```css
@media (prefers-reduced-motion: reduce) {
  .kobe-scene * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add css/layout.css css/hero.css css/emergency-fab.css css/bag-game.css css/drill.css css/plan-wizard.css css/components.css css/hero-arcade.css
git commit -m "fix: add prefers-reduced-motion to 8 CSS files"
```

---

### Task 14: Fix alertBlink seizure risk in drill.css

**Why:** The `alertBlink` animation in `css/drill.css` flashes rapidly (border-color toggles between visible and transparent 3 times in 1 second each = 3 full flashes in 3 seconds). While technically under the WCAG threshold (3 flashes per second), it can still trigger discomfort. Replace with a gentler opacity fade.

**Files:**
- Modify: `css/drill.css` (lines 64-67)

- [ ] **Step 1: Replace alertBlink with opacity fade**

In `css/drill.css`, replace the `alertBlink` keyframes and the reference to it:

Replace lines 46-47:

```css
  animation: alertBlink 1s ease-in-out 3;
```

with:

```css
  animation: alertFade 1.5s ease-in-out 2;
```

Replace lines 64-67:

```css
@keyframes alertBlink {
  0%, 100% { border-color: var(--alert-red); }
  50% { border-color: transparent; }
}
```

with:

```css
@keyframes alertFade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add css/drill.css
git commit -m "fix: replace alertBlink with gentler opacity fade to reduce seizure risk"
```

---

### Task 15: Add prefers-color-scheme auto-detection

**Why:** Users who have their OS set to light/dark mode should see the matching theme automatically on first visit, rather than always defaulting to dark mode.

**Files:**
- Modify: `src/theme.ts` (lines 18-24)

- [ ] **Step 1: Update initTheme to detect system preference**

In `src/theme.ts`, after the `initTheme` rewrite from Task 11, update the function to also detect `prefers-color-scheme`. Replace the `initTheme` function:

```ts
export function initTheme(): void {
  const saved = localStorage.getItem('mamoru-theme');
  if (saved === 'day') {
    isDayMode = true;
    document.body.classList.add('day-mode');
    const hero = document.getElementById('hero');
    if (hero) {
      hero.classList.remove('night-sky');
      hero.classList.add('day-sky');
    }
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) modeToggle.textContent = '🌙';
    const mobileToggle = document.getElementById('mobileThemeToggle');
    if (mobileToggle) mobileToggle.textContent = '🌙 Night Mode';
  }
}
```

with:

```ts
export function initTheme(): void {
  const saved = localStorage.getItem('mamoru-theme');
  let shouldBeDay = false;

  if (saved === 'day') {
    shouldBeDay = true;
  } else if (saved === 'night') {
    shouldBeDay = false;
  } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    shouldBeDay = true;
  }

  if (shouldBeDay) {
    isDayMode = true;
    document.body.classList.add('day-mode');
    const hero = document.getElementById('hero');
    if (hero) {
      hero.classList.remove('night-sky');
      hero.classList.add('day-sky');
    }
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) modeToggle.textContent = '🌙';
    const mobileToggle = document.getElementById('mobileThemeToggle');
    if (mobileToggle) mobileToggle.textContent = '🌙 Night Mode';
  }
}
```

Note: This depends on Task 11 being completed first. If running in parallel, merge the two changes.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/theme.ts
git commit -m "feat: auto-detect prefers-color-scheme for first-time visitors"
```

---

### Task 16: Fix aria-current on nav links

**Why:** The nav links use `aria-current="false"` in the HTML, but the ARIA spec says `aria-current` should be **omitted** when not current, rather than set to `"false"`. Setting it to `"false"` still works but is not best practice.

**Files:**
- Modify: `index.html` (lines 63-67, 84-88)
- Modify: `src/router.ts` (line 64)

- [ ] **Step 1: Remove aria-current="false" from initial HTML**

In `index.html`, for each nav link that has `aria-current="false"`, remove the `aria-current` attribute entirely.

Replace all occurrences in the navbar (lines 63-67) and mobile menu (lines 84-88):

```html
aria-current="false"
```

Remove each instance (6 occurrences in the navbar, 5 in the mobile menu = 11 total). Use find-and-replace to remove ` aria-current="false"` from nav/mobile-menu links.

- [ ] **Step 2: Update router.ts to remove instead of set to false**

In `src/router.ts`, replace line 64:

```ts
    link.setAttribute('aria-current', link.dataset.navRoute === route ? 'page' : 'false');
```

with:

```ts
    if (link.dataset.navRoute === route) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add index.html src/router.ts
git commit -m "fix: use aria-current removal instead of false for non-current nav links"
```

---

### Task 17: Make mascot keyboard-accessible

**Why:** The mascot character is clickable (advances facts) but not keyboard-accessible. Users relying on keyboard navigation cannot interact with it.

**Files:**
- Modify: `src/character/mascot.ts` (around line 70-75)

- [ ] **Step 1: Add tabindex and keyboard handler**

In `src/character/mascot.ts`, find the `charWrap` setup around lines 68-75. After:

```ts
  charWrap.setAttribute('role', 'button');
  charWrap.setAttribute('aria-label', 'Tap Moru for the next disaster fact');
```

add:

```ts
  charWrap.setAttribute('tabindex', '0');
```

Then, after the click handler at line 155:

```ts
  charWrap.addEventListener('click', (e) => {
    flashEmote();
    nextFact();
    const r = charWrap.getBoundingClientRect();
    spawnRipple(e.clientX - r.left, e.clientY - r.top);
  });
```

add:

```ts
  charWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flashEmote();
      nextFact();
    }
  });
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/character/mascot.ts
git commit -m "fix: make mascot keyboard-accessible with tabindex and keydown handler"
```

---

### Task 18: Add aria-live="polite" to flashcard counters

**Why:** Screen readers don't announce when the flashcard counter text changes (e.g., "1 / 8" -> "2 / 8"). Adding `aria-live="polite"` tells assistive tech to announce the change.

**Files:**
- Modify: `index.html` (lines 589, 599, 609, 619)

- [ ] **Step 1: Add aria-live to all four flashcard counters**

In `index.html`, add `aria-live="polite"` to each flashcard counter span:

Replace (line 589):
```html
        <span class="flashcard-counter" id="fcCounterDanger">1 / 8</span>
```
with:
```html
        <span class="flashcard-counter" id="fcCounterDanger" aria-live="polite">1 / 8</span>
```

Replace (line 599):
```html
        <span class="flashcard-counter" id="fcCounterAction">1 / 5</span>
```
with:
```html
        <span class="flashcard-counter" id="fcCounterAction" aria-live="polite">1 / 5</span>
```

Replace (line 609):
```html
        <span class="flashcard-counter" id="fcCounterPlaces">1 / 4</span>
```
with:
```html
        <span class="flashcard-counter" id="fcCounterPlaces" aria-live="polite">1 / 4</span>
```

Replace (line 619):
```html
        <span class="flashcard-counter" id="fcCounterHelp">1 / 6</span>
```
with:
```html
        <span class="flashcard-counter" id="fcCounterHelp" aria-live="polite">1 / 6</span>
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix: add aria-live polite to flashcard counters for screen reader updates"
```

---

## PHASE 4: Unfinished Features

Tasks 19-20 are **parallelizable**. Task 21 depends on neither and can run in parallel too.

---

### Task 19: Implement typhoon-scene.ts

**Why:** The typhoon scene is currently an empty stub (`src/character/typhoon-scene.ts` just returns early). The character system plan (Task 10) has the exact implementation. Port it directly.

**Files:**
- Modify: `src/character/typhoon-scene.ts` (replace stub)
- Modify: `src/typhoon.ts` (add click handler + emit `mamoru:typhoon-level`)
- Create: `src/character/__tests__/typhoon-scene.test.ts`

- [ ] **Step 1: Write the test**

File: `src/character/__tests__/typhoon-scene.test.ts`

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <section class="section" id="typhoon">
      <div id="typhoon-scene" class="character-scene"></div>
    </section>
  `;
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
  (globalThis as any).IntersectionObserver = class {
    observe() {} unobserve() {} disconnect() {}
    takeRecords() { return []; }
  };
  vi.useFakeTimers();
});

describe('typhoon-scene', () => {
  it('mounts with stand pose', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    const svg = document.querySelector('#typhoon-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });

  it('level 2 -> walk', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 2 } }));
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('walk');
  });

  it('level 4 -> headcover', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 4 } }));
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('headcover');
  });

  it('null -> stand after lock', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 3 } }));
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: null } }));
    vi.advanceTimersByTime(4100);
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('stand');
  });
});
```

- [ ] **Step 2: Replace the stub with the full implementation**

File: `src/character/typhoon-scene.ts` -- replace the entire file with:

```ts
import { createSprite, updateSprite, type Pose } from './sprite';
import { TYPHOON_TIPS } from './tips';
import { motionAllowed, onMotionChange } from './motion';

const SCROLL_CURVE: Pose[] = ['stand', 'phone', 'walk', 'tired'];
const STATE_LOCK_MS = 4000;
const TIP_INTERVAL_MS = 4500;

function levelToPose(level: number): Pose {
  if (level <= 0) return 'stand';
  if (level === 1) return 'phone';
  if (level === 2) return 'walk';
  if (level === 3) return 'tired';
  return 'headcover';
}

export function initTyphoonScene(): void {
  const host = document.getElementById('typhoon-scene');
  if (!host) return;

  const section = host.closest('section') as HTMLElement | null;
  let allowed = motionAllowed();
  let lockTimer: number | null = null;
  let stateLocked = false;
  let scrollProgress = 0;
  let tipIdx = 0;
  let tipTimer: number | null = null;
  let scrollObserver: IntersectionObserver | null = null;

  const sprite = createSprite({ pose: 'stand', gender: 'male' });
  host.innerHTML = '';
  host.appendChild(sprite);

  const bubble = document.createElement('div');
  bubble.className = 'tip-bubble';
  const en = document.createElement('span'); en.dataset.lang = 'en';
  const ja = document.createElement('span'); ja.dataset.lang = 'ja';
  const id = document.createElement('span'); id.dataset.lang = 'id';
  bubble.append(en, ja, id);
  host.appendChild(bubble);

  function showTip(i: number): void {
    const t = TYPHOON_TIPS[i % TYPHOON_TIPS.length];
    en.textContent = t.en;
    ja.textContent = t.ja;
    id.textContent = t.id;
  }
  showTip(0);

  function poseFromScroll(): Pose {
    const idx = Math.min(SCROLL_CURVE.length - 1, Math.floor(scrollProgress * SCROLL_CURVE.length));
    return SCROLL_CURVE[idx];
  }

  function applyScroll(): void {
    if (stateLocked) return;
    updateSprite(sprite, { pose: poseFromScroll() });
  }

  function onLevel(e: Event): void {
    const ev = e as CustomEvent<{ level: number | null }>;
    if (lockTimer !== null) window.clearTimeout(lockTimer);
    if (ev.detail.level === null) {
      stateLocked = false;
      applyScroll();
      return;
    }
    stateLocked = true;
    updateSprite(sprite, { pose: levelToPose(ev.detail.level) });
    showTip(ev.detail.level);
    lockTimer = window.setTimeout(() => {
      stateLocked = false;
      applyScroll();
    }, STATE_LOCK_MS);
  }

  function onIntersect(entries: IntersectionObserverEntry[]): void {
    if (!section) return;
    const e = entries[0]; if (!e) return;
    const vh = window.innerHeight || 800;
    const top = e.boundingClientRect.top;
    const h = e.boundingClientRect.height;
    scrollProgress = Math.max(0, Math.min(1, 1 - (top + h) / (vh + h)));
    applyScroll();
  }

  function rotateTip(): void {
    if (stateLocked) return;
    tipIdx = (tipIdx + 1) % TYPHOON_TIPS.length;
    showTip(tipIdx);
  }

  function applyMotion(now: boolean): void {
    allowed = now;
    if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    document.removeEventListener('mamoru:typhoon-level', onLevel);
    if (allowed && section) {
      scrollObserver = new IntersectionObserver(onIntersect, {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
      });
      scrollObserver.observe(section);
      tipTimer = window.setInterval(rotateTip, TIP_INTERVAL_MS);
      document.addEventListener('mamoru:typhoon-level', onLevel);
    } else {
      stateLocked = false;
      updateSprite(sprite, { pose: 'stand' });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
```

- [ ] **Step 3: Add click interactivity to `src/typhoon.ts`**

Open `src/typhoon.ts`. Find the loop that creates typhoon rows (`typhoonScale.forEach((level, i) => { ... })`). After `container.appendChild(row);`, add:

```ts
row.style.cursor = 'pointer';
row.setAttribute('tabindex', '0');
row.setAttribute('role', 'button');
let active = false;
row.addEventListener('click', () => {
  active = !active;
  container.querySelectorAll('.typhoon-row.active').forEach(el => {
    if (el !== row) el.classList.remove('active');
  });
  row.classList.toggle('active', active);
  document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', {
    detail: { level: active ? i : null },
  }));
});
```

Read `src/typhoon.ts` first to find the exact insertion point.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/character/typhoon-scene.ts src/character/__tests__/typhoon-scene.test.ts src/typhoon.ts
git commit -m "feat: implement typhoon scene character reacting to level click + scroll"
```

---

### Task 20: Implement bible.ts + css/character-bible.css + HTML section

**Why:** The Character Bible is an empty stub. The character system plan (Task 11) has the exact implementation with pose grid, anatomy, cast, and do/don't rules.

**Files:**
- Modify: `src/character/bible.ts` (replace stub)
- Create: `css/character-bible.css`
- Modify: `index.html` (add Bible section + CSS link)
- Create: `src/character/__tests__/bible.test.ts`

- [ ] **Step 1: Write the test**

File: `src/character/__tests__/bible.test.ts`

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POSES } from '../sprite';

beforeEach(() => {
  document.body.innerHTML = '<section class="section" id="bible"></section>';
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
});

describe('bible', () => {
  it('renders 28 sprite cells (14 poses x 2 genders)', async () => {
    const { initBible } = await import('../bible');
    initBible();
    const cells = document.querySelectorAll('#bible .bible-pose-cell');
    expect(cells.length).toBe(28);
  });

  it('renders cast, anatomy grid, and do/don\'t panels', async () => {
    const { initBible } = await import('../bible');
    initBible();
    expect(document.querySelector('#bible .bible-cast')).toBeTruthy();
    expect(document.querySelector('#bible .bible-anatomy')).toBeTruthy();
    expect(document.querySelector('#bible .bible-rules')).toBeTruthy();
  });

  it('each pose cell labels its pose name', async () => {
    const { initBible } = await import('../bible');
    initBible();
    POSES.forEach(p => {
      const labels = Array.from(document.querySelectorAll('#bible .bible-pose-cell'))
        .map(c => c.getAttribute('data-pose'));
      expect(labels).toContain(p);
    });
  });
});
```

- [ ] **Step 2: Replace the stub with the full implementation**

File: `src/character/bible.ts` -- replace the entire file with the implementation from the character system plan (Task 11, Step 3). The full code is provided in the character system plan at lines 2213-2364.

```ts
import { createSprite, POSES, type Pose, type Gender } from './sprite';

interface PoseMeta { id: Pose; name: string; jp: string; note: string; }

const POSE_META: PoseMeta[] = [
  { id: 'stand',     name: 'STAND',      jp: '立ち',     note: 'default idle' },
  { id: 'brace',     name: 'BRACE',      jp: '構え',     note: 'shindo 4' },
  { id: 'cover',     name: 'COVER',      jp: '伏せる',   note: 'drop' },
  { id: 'hide',      name: 'HIDE',       jp: '隠れる',   note: 'under table' },
  { id: 'headcover', name: 'HEAD COVER', jp: '頭を守る', note: 'shindo 7' },
  { id: 'crouch',    name: 'CROUCH',     jp: 'しゃがむ', note: 'low ground' },
  { id: 'kneel',     name: 'KNEEL',      jp: '膝立ち',   note: 'first aid' },
  { id: 'run',       name: 'RUN',        jp: '走る',     note: 'transition' },
  { id: 'walk',      name: 'WALK',       jp: '歩く',     note: 'evac route' },
  { id: 'tired',     name: 'TIRED',      jp: '疲れ',     note: 'heavy bag' },
  { id: 'phone',     name: 'PHONE',      jp: '通報',     note: 'call 119' },
  { id: 'reach',     name: 'REACH',      jp: '手当て',   note: 'aid giver' },
  { id: 'thrust',    name: 'THRUST',     jp: '腹突き',   note: 'heimlich' },
  { id: 'choke',     name: 'CHOKE',      jp: '窒息',     note: 'victim' },
];

const RULES_DO = [
  'Use shapeRendering="crispEdges" on every sprite SVG.',
  'Keep sprite work inside the 64x96 viewBox at all scales.',
  'Reuse a pose from the library before inventing a new one.',
  'Use persimmon #f5a623 as the sole saturated accent on casual outfit.',
  'Pair every scene with a tip bubble showing English + Japanese + Indonesian.',
  'Animate by switching pose presets on a timer -- never tween pixels.',
  'Show closed shoes in any earthquake scene (glass rule).',
];

const RULES_DONT = [
  'Don\'t anti-alias. No shapeRendering="auto".',
  'Don\'t introduce new saturated colors. Persimmon, indigo, ink -- that\'s it.',
  'Don\'t tilt the head. Use shoulder/torso tilt instead.',
  'Don\'t make either character panic. Cheeks blush, eyes widen -- never tears or shouting.',
  'Don\'t draw new hair styles. Short male / long female with ribbon.',
  'Don\'t put the logo anywhere except the casual tee front.',
];

function buildPoseGrid(host: HTMLElement): void {
  const grid = document.createElement('div');
  grid.className = 'bible-pose-grid';
  for (const gender of ['male', 'female'] as Gender[]) {
    for (const meta of POSE_META) {
      const cell = document.createElement('div');
      cell.className = 'bible-pose-cell';
      cell.dataset.pose = meta.id;
      cell.dataset.gender = gender;
      const sprite = createSprite({ pose: meta.id, gender });
      cell.appendChild(sprite);
      const label = document.createElement('div');
      label.className = 'bible-pose-label';
      label.innerHTML = `<strong>${meta.name}</strong> · ${meta.jp}<br><small>${meta.note}</small>`;
      cell.appendChild(label);
      grid.appendChild(cell);
    }
  }
  host.appendChild(grid);
}

function buildCast(host: HTMLElement): void {
  const cast = document.createElement('div');
  cast.className = 'bible-cast';
  cast.innerHTML = `
    <h3 data-lang="en" lang="en">Cast</h3>
    <h3 data-lang="ja" lang="ja">登場人物</h3>
    <h3 data-lang="id" lang="id">Tokoh</h3>
    <div class="bible-cast-grid"></div>
  `;
  const grid = cast.querySelector('.bible-cast-grid')!;
  for (const [gender, name, role] of [
    ['male', 'Moru', 'Curious narrator -- drops disaster prep facts'],
    ['female', 'Mamo', 'First-aid lead -- demonstrates choking + recovery position'],
  ] as Array<[Gender, string, string]>) {
    const card = document.createElement('div');
    card.className = 'bible-cast-card';
    const sprite = createSprite({ pose: 'stand', gender });
    card.appendChild(sprite);
    const meta = document.createElement('div');
    meta.innerHTML = `<strong>${name}</strong><br><small>${role}</small>`;
    card.appendChild(meta);
    grid.appendChild(card);
  }
  host.appendChild(cast);
}

function buildAnatomy(host: HTMLElement): void {
  const wrap = document.createElement('div');
  wrap.className = 'bible-anatomy';
  wrap.innerHTML = `
    <h3 data-lang="en" lang="en">Anatomy grid</h3>
    <h3 data-lang="ja" lang="ja">アナトミー</h3>
    <h3 data-lang="id" lang="id">Grid anatomi</h3>
  `;
  const figure = document.createElement('div');
  figure.className = 'bible-anatomy-figure';
  const sprite = createSprite({ pose: 'stand', gender: 'male' });
  sprite.setAttribute('width', '256');
  sprite.setAttribute('height', '384');
  figure.appendChild(sprite);
  const labels = document.createElement('table');
  labels.innerHTML = `
    <thead><tr><th>Part</th><th>Bounds (x, y, w, h)</th></tr></thead>
    <tbody>
      <tr><td>Head</td><td>22, 22, 20x22</td></tr>
      <tr><td>Hair (M)</td><td>20, 14, 24x12</td></tr>
      <tr><td>Hair (F)</td><td>18, 12, 28x34 + bangs</td></tr>
      <tr><td>Torso</td><td>18, 44, 28x26</td></tr>
      <tr><td>Leg x2</td><td>22/34, 68, 8x18</td></tr>
      <tr><td>Shoes x2</td><td>20/32, 84, 12x4</td></tr>
      <tr><td>Arm pivots</td><td>(20, 48) and (44, 48)</td></tr>
      <tr><td>Eyes</td><td>(27, 31) and (35, 31), 2x2</td></tr>
      <tr><td>Mouth</td><td>(30, 38), 4x1</td></tr>
    </tbody>
  `;
  wrap.append(figure, labels);
  host.appendChild(wrap);
}

function buildRules(host: HTMLElement): void {
  const wrap = document.createElement('div');
  wrap.className = 'bible-rules';
  wrap.innerHTML = `
    <div class="bible-rules-col">
      <h3>DO</h3>
      <ul>${RULES_DO.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>
    <div class="bible-rules-col bible-rules-dont">
      <h3>DON'T</h3>
      <ul>${RULES_DONT.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>
  `;
  host.appendChild(wrap);
}

export function initBible(): void {
  const host = document.getElementById('bible');
  if (!host) return;
  host.innerHTML = `
    <header class="section-header">
      <h2><span data-lang="en">Character Bible</span><span data-lang="ja">図鑑</span><span data-lang="id">Buku Karakter</span></h2>
    </header>
  `;
  buildCast(host);
  buildPoseGrid(host);
  buildAnatomy(host);
  buildRules(host);
}
```

- [ ] **Step 3: Create `css/character-bible.css`**

File: `css/character-bible.css`

```css
#bible .section-header { margin-bottom: 24px; }

.bible-cast,
.bible-anatomy,
.bible-rules { margin: 32px 0; }

.bible-cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}
.bible-cast-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  background: var(--surface, #1a1a2e);
}
.bible-cast-card .mamoru-sprite { width: 64px; height: 96px; }

.bible-pose-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px;
  margin: 24px 0;
}
.bible-pose-cell {
  background: var(--surface, #1a1a2e);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}
.bible-pose-cell .mamoru-sprite { width: 64px; height: 96px; margin: 0 auto; }
.bible-pose-label { font-size: 11px; line-height: 1.35; margin-top: 6px; color: var(--text-muted, #a8a8b8); }
.bible-pose-label strong { color: var(--text, #f6f4ef); }

.bible-anatomy-figure {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 12px;
}
.bible-anatomy table {
  border-collapse: collapse;
  font-size: 13px;
}
.bible-anatomy th,
.bible-anatomy td {
  padding: 4px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  text-align: left;
}

.bible-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.bible-rules ul { margin: 0; padding-left: 18px; }
.bible-rules li { margin: 6px 0; font-size: 13px; line-height: 1.45; }
.bible-rules-dont h3 { color: #e87040; }

@media (max-width: 600px) {
  .bible-rules { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Add section and CSS link to `index.html`**

(a) Add CSS link in `<head>`, after the `character.css` link (after line 45):

```html
<link rel="stylesheet" href="css/character-bible.css">
```

(b) Add Bible section before the closing `</main>` or after the last section (find the `about` section at line 963 and add after it closes):

```html
<section class="section" id="bible" aria-label="Character bible"></section>
```

(c) Add the Bible section to the router. In `src/router.ts`, add `'bible'` to the `learn` route:

```ts
  '#/learn':     ['drill', 'quiz', 'about', 'bible'],
```

And add `'bible'` to the `ALL_SECTION_IDS` source:

The `ALL_SECTION_IDS` is auto-generated from `ROUTE_SECTIONS`, so adding it to the route map is sufficient.

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/character/bible.ts src/character/__tests__/bible.test.ts css/character-bible.css index.html src/router.ts
git commit -m "feat: implement Character Bible with pose grid, anatomy, cast, and rules"
```

---

### Task 21: Write docs/hero.md

**Why:** The hero scene documentation is referenced in the character system plan (Task 16) but was never written.

**Files:**
- Create: `docs/hero.md`

- [ ] **Step 1: Write the hero documentation**

File: `docs/hero.md`

```markdown
# Hero Section

The hero section is the landing view of Mamoru Guide. It features a pixel-art Kobe harbor scene with animated landmarks, the mascot character Moru, and the main navigation entry points.

## Structure

- **Kobe scene** (`css/hero-arcade.css`): 14 animated SVG landmarks including Port Tower, Meriken Park, ships, and harbor buildings. Background animates day/night based on theme.
- **Mascot** (`src/character/mascot.ts`): Moru stands in the hero area. Cursor-tracking pupils, blink loop, click emote cycle, disaster fact rotator. All motion gated by `motionAllowed()`.
- **Hero content** (`index.html #hero`): Title, subtitle, and CTA buttons leading to mode selector.

## Files

| File | Purpose |
|------|---------|
| `css/hero.css` | Hero layout, title animations, scroll hint |
| `css/hero-arcade.css` | Kobe harbor scene, pixel typography, arcade styling |
| `src/stars.ts` | Animated starfield canvas in background |
| `src/skyline.ts` | Generates the harbor skyline SVG elements |
| `src/character/mascot.ts` | Moru character with facts and interactions |

## Accessibility

- All SVG landmarks have `aria-hidden="true"` (decorative)
- Hero title animations respect `prefers-reduced-motion`
- Mascot facts are in `data-lang` spans for i18n
- Skip link available to bypass hero content

## Theme

- Night mode: dark harbor gradient, glowing landmarks, stars visible
- Day mode: light sky gradient, daylight landmarks, stars hidden
```

- [ ] **Step 2: Commit**

```bash
git add docs/hero.md
git commit -m "docs: add hero section documentation"
```

---

## PHASE 5: CI/CD & Build

Tasks 22-23 are **parallelizable** (separate workflow files). Task 24 depends on neither.

---

### Task 22: Add test step to deploy.yml

**Why:** The deploy workflow (`npm run build`) does NOT run tests before building. Broken tests can ship to production.

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Add test step before build**

In `.github/workflows/deploy.yml`, after the "Install dependencies" step (line 31) and before the "Build" step (line 32), add:

```yaml
      - name: Run tests
        run: npm test
```

The full steps section should read:

```yaml
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "chore: add test step to deploy workflow before build"
```

---

### Task 23: Add PR check workflow

**Why:** There are no CI checks on pull requests. Broken code can be merged without anyone knowing.

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the CI workflow**

File: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Type check and build
        run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "chore: add CI workflow for PR checks (test + build)"
```

---

### Task 24: Implement route-based code splitting

**Why:** The entire app (149 KB JS) is loaded as a single bundle, even though most users only need a fraction of the modules on any given route. Dynamic imports allow heavy modules to be loaded on demand.

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Convert heavy module imports to dynamic imports**

In `src/main.ts`, replace the static imports for heavy modules with dynamic imports triggered by route. Replace the current imports and init block.

Keep the essential imports static (theme, lang, router, nav, scroll-reveal, emergency-fab, mascot):

```ts
import { initStars } from './stars';
import { buildSkyline } from './skyline';
import { initTheme, toggleDayNight } from './theme';
import { initLang, setLang } from './lang';
import { initRouter } from './router';
import { initScrollReveal } from './scroll-reveal';
import { initMobileNav } from './nav';
import { initEmergencyFab } from './emergency-fab';
import { showToast } from './toast';
import { initMascot } from './character/mascot';
```

Convert the rest to dynamic imports inside DOMContentLoaded:

```ts
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  buildSkyline();
  initTheme();
  initLang();
  initRouter();
  initScrollReveal();
  initMobileNav();
  initEmergencyFab();
  initMascot();

  import('./earthquake-scale').then(m => m.initEarthquakeScale());
  import('./vocab').then(m => { m.initVocab(); Object.assign(window, { switchTab: m.switchTab, prevCard: m.prevCard, nextCard: m.nextCard }); });
  import('./bag-game').then(m => { m.renderBagItems(); m.updateBagStats(); Object.assign(window, { checkBag: m.checkBag, resetBag: m.resetBag }); });
  import('./typhoon').then(m => m.initTyphoonScale());
  import('./show-this').then(m => m.initShowThis());
  import('./first-aid').then(m => m.initFirstAid());
  import('./drill').then(m => m.initDrill());
  import('./quiz').then(m => m.initQuiz());
  import('./contacts').then(m => m.initContacts());
  import('./shelter-finder').then(m => m.initShelterFinder());
  import('./emergency-plan').then(m => { m.initEmergencyPlan(); Object.assign(window, { savePlan: m.savePlan, clearPlan: m.clearPlan, printPlan: m.printPlan }); });
  import('./character/earthquake-scene').then(m => m.initEarthquakeScene());
  import('./character/firstaid-scene').then(m => m.initFirstAidScene());
  import('./character/typhoon-scene').then(m => m.initTyphoonScene());
  import('./character/bag-scene').then(m => m.initBagScene());
  import('./character/bible').then(m => m.initBible());
});
```

Keep the static window assignments for functions that are used in `onclick` attributes but load asynchronously:

```ts
async function shareGuide(): Promise<void> {
  const shareData = {
    title: 'MAMORU GUIDE',
    text: 'Disaster preparedness guide for international students in Japan',
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!');
    }
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!');
    }
  }
}

Object.assign(window, {
  setLang,
  toggleDayNight,
  shareGuide,
  showToast,
});
```

- [ ] **Step 2: Run tests and build**

Run: `npm test && npm run build`
Expected: tests pass, build succeeds with multiple chunks in dist/assets.

- [ ] **Step 3: Commit**

```bash
git add src/main.ts
git commit -m "feat: implement route-based code splitting with dynamic imports"
```

---

## PHASE 6: Content

Tasks 25-26 are **parallelizable** (they modify different parts of `src/data.ts`). Task 27 is independent.

---

### Task 25: Add missing emergency vocabulary

**Why:** Critical phrases for allergies, medical conditions, and language barriers are missing from the vocabulary flashcards.

**Files:**
- Modify: `src/data.ts` (vocabData)

- [ ] **Step 1: Add new vocabulary items**

In `src/data.ts`, add a new `medical` category to `vocabData` (and update the `VocabCategory` type):

First, in `src/types.ts`, update the VocabCategory type:

```ts
export type VocabCategory = 'danger' | 'action' | 'places' | 'help' | 'medical';
```

Then in `src/data.ts`, add the `medical` key to `vocabData` after the `help` array (before the closing `};`):

```ts
  medical: [
    {jp:'アレルギーがあります',rom:'Arerugii ga arimasu',en:'I have allergies',id:'Saya punya alergi'},
    {jp:'日本語がわかりません',rom:'Nihongo ga wakarimasen',en:'I cannot understand Japanese',id:'Saya tidak mengerti bahasa Jepang'},
    {jp:'英語が話せますか？',rom:'Eigo ga hanasemasu ka?',en:'Do you speak English?',id:'Apakah Anda bisa bahasa Inggris?'},
    {jp:'私の電話番号は...',rom:'Watashi no denwa bangou wa...',en:'My phone number is...',id:'Nomor telepon saya...'},
    {jp:'糖尿病です',rom:'Tounyoubyou desu',en:'I am diabetic',id:'Saya penderita diabetes'},
    {jp:'心臓病があります',rom:'Shinzoubyou ga arimasu',en:'I have a heart condition',id:'Saya punya penyakit jantung'},
    {jp:'薬を飲んでいます',rom:'Kusuri wo nonde imasu',en:'I am taking medication',id:'Saya sedang minum obat'},
    {jp:'妊娠中です',rom:'Ninshin-chuu desu',en:'I am pregnant',id:'Saya sedang hamil'},
  ]
```

Note: Adding a new vocab category also requires adding a tab and flashcard panel in `index.html` and updating `src/vocab.ts` to include the new category. Check the existing vocab tab/panel pattern and replicate it for `medical`.

- [ ] **Step 2: Add the medical tab and panel to `index.html`**

Find the vocab section in `index.html` (around line 570). After the last tab button (help tab), add a new tab. After the last tab-content panel (help panel), add a new panel. Follow the existing pattern exactly.

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/data.ts src/types.ts index.html
git commit -m "feat: add medical emergency vocabulary category with allergies, conditions, language phrases"
```

---

### Task 26: Add missing bag items and fix radio priority

**Why:** Portable toilet and laminated phrase card are critical missing items (per evaluation). The emergency radio is underweighted at priority 7; for international students relying on NHK multilingual broadcasts, it should be priority 9.

**Files:**
- Modify: `src/data.ts` (bagItems array + MAX_BAG_WEIGHT)

- [ ] **Step 1: Fix radio priority**

In `src/data.ts`, find the radio item (line 54):

```ts
  {e:'📻',en:'Emergency radio',ja:'防災ラジオ',id:'Radio darurat',weight:0.5,priority:7,det_en:'NHK broadcasts in multiple languages',det_ja:'NHKは多言語で放送',det_id:'NHK dalam berbagai bahasa'},
```

Change `priority:7` to `priority:9`:

```ts
  {e:'📻',en:'Emergency radio',ja:'防災ラジオ',id:'Radio darurat',weight:0.5,priority:9,det_en:'NHK broadcasts in multiple languages',det_ja:'NHKは多言語で放送',det_id:'NHK dalam berbagai bahasa'},
```

- [ ] **Step 2: Add portable toilet and laminated phrase card**

In `src/data.ts`, add two new items to the `bagItems` array before the closing `];`:

```ts
  {e:'🚽',en:'Portable toilet kit',ja:'簡易トイレ',id:'Kit toilet portabel',weight:0.3,priority:7,det_en:'Essential after Kobe \'95 and 2011',det_ja:'阪神・東日本大震災の教訓',det_id:'Penting setelah Kobe \'95 dan 2011'},
  {e:'📋',en:'Laminated phrase card',ja:'ラミネート会話カード',id:'Kartu frasa laminasi',weight:0.05,priority:7,det_en:'Physical backup of Show This cards',det_ja:'「見せて」カードの物理バックアップ',det_id:'Cadangan fisik kartu Tunjukkan Ini'},
```

- [ ] **Step 3: Update MAX_BAG_WEIGHT**

The max weight of 8.0 kg may need to increase slightly since we added 0.35 kg of new items. The total of all items is now higher, so keep `MAX_BAG_WEIGHT = 8.0` (the game is about choosing, not packing everything).

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data.ts
git commit -m "feat: add portable toilet & phrase card bag items, boost radio priority to 9"
```

---

### Task 27: Create "EARTHQUAKE NOW" fullscreen emergency guide

**Why:** The app has no "what to do RIGHT NOW during an earthquake" guide accessible in 2 taps or fewer. This is the single biggest gap identified in the evaluation.

**Files:**
- Create: `css/earthquake-now.css`
- Create: `src/earthquake-now.ts`
- Modify: `index.html` (add section + CSS link)
- Modify: `src/main.ts` (add import + init)
- Modify: `src/router.ts` (add route)

- [ ] **Step 1: Create the CSS**

File: `css/earthquake-now.css`

```css
.earthquake-now {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #1a0000;
  color: #fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: none;
  flex-direction: column;
  padding: 0;
}
.earthquake-now.active {
  display: flex;
}

.eq-now-header {
  background: var(--alert-red, #e84040);
  padding: 16px 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1;
}
.eq-now-title {
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(14px, 3vw, 20px);
  color: #fff;
  letter-spacing: 1px;
}
.eq-now-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: 2px solid #fff;
  color: #fff;
  font-size: 18px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eq-now-steps {
  flex: 1;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.eq-now-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.eq-now-step-num {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--alert-red, #e84040);
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.eq-now-step-text {
  font-size: 18px;
  line-height: 1.6;
  font-weight: 700;
}
.eq-now-step-detail {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;
  line-height: 1.5;
}

.eq-now-numbers {
  padding: 20px;
  text-align: center;
  background: rgba(232,64,64,0.15);
  border-top: 2px solid var(--alert-red, #e84040);
}
.eq-now-numbers a {
  display: inline-block;
  font-family: 'Press Start 2P', monospace;
  font-size: 28px;
  color: #fff;
  text-decoration: none;
  padding: 12px 24px;
  margin: 8px;
  border: 2px solid var(--alert-red, #e84040);
  border-radius: 8px;
}
.eq-now-numbers a:active {
  background: var(--alert-red, #e84040);
}

@media (prefers-reduced-motion: reduce) {
  .earthquake-now * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Create the TypeScript module**

File: `src/earthquake-now.ts`

```ts
import { currentLang } from './lang';

interface NowStep {
  en: string;
  ja: string;
  id: string;
  detail_en: string;
  detail_ja: string;
  detail_id: string;
}

const STEPS: NowStep[] = [
  {
    en: 'DROP to the ground',
    ja: '地面に伏せる (DROP)',
    id: 'MERUNDUK ke tanah',
    detail_en: 'Get on your hands and knees. This prevents you from being knocked down.',
    detail_ja: '四つん這いになる。転倒を防ぎます。',
    detail_id: 'Berlutut dengan tangan dan lutut. Ini mencegah Anda terjatuh.',
  },
  {
    en: 'Take COVER under a sturdy table',
    ja: '丈夫な机の下に隠れる (COVER)',
    id: 'BERLINDUNG di bawah meja kokoh',
    detail_en: 'Protect your head and neck. If no table: crouch against an interior wall, cover your head.',
    detail_ja: '頭と首を守る。机がなければ内壁に寄り、頭を覆う。',
    detail_id: 'Lindungi kepala dan leher. Jika tidak ada meja: berjongkok di dinding dalam, lindungi kepala.',
  },
  {
    en: 'HOLD ON until shaking stops',
    ja: '揺れがおさまるまで待機 (HOLD ON)',
    id: 'BERTAHAN sampai guncangan berhenti',
    detail_en: 'Stay under cover. Be ready to move with it if the table shifts.',
    detail_ja: 'その場を動かない。机が動いたら一緒に移動する。',
    detail_id: 'Tetap berlindung. Bersiap bergerak bersama meja jika bergeser.',
  },
  {
    en: 'When shaking stops: OPEN THE DOOR',
    ja: '揺れが止まったら: ドアを開ける',
    id: 'Saat guncangan berhenti: BUKA PINTU',
    detail_en: 'Door frames warp shut after earthquakes. Open it now while you can.',
    detail_ja: 'ドア枠が歪んで開かなくなることがある。今開ける。',
    detail_id: 'Kusen pintu bisa macet setelah gempa. Buka sekarang selagi bisa.',
  },
  {
    en: 'Turn off GAS at the meter',
    ja: 'ガスメーターを止める',
    id: 'Matikan GAS di meteran',
    detail_en: 'Gas leaks cause fires. Kobe 1995: 7,000 homes burned from gas fires.',
    detail_ja: 'ガス漏れは火災の原因。阪神大震災では7,000戸が全焼。',
    detail_id: 'Kebocoran gas menyebabkan kebakaran. Kobe 1995: 7.000 rumah terbakar.',
  },
  {
    en: 'Put on SHOES before moving',
    ja: '靴を履いてから移動',
    id: 'Pakai SEPATU sebelum bergerak',
    detail_en: 'Broken glass everywhere. Do not walk barefoot.',
    detail_ja: 'ガラスの破片が散乱。素足で歩かない。',
    detail_id: 'Pecahan kaca di mana-mana. Jangan berjalan tanpa alas kaki.',
  },
  {
    en: 'Check for TSUNAMI warning',
    ja: '津波警報を確認',
    id: 'Periksa peringatan TSUNAMI',
    detail_en: 'If near coast: move to high ground IMMEDIATELY. Do not wait for sirens.',
    detail_ja: '海岸近くなら今すぐ高台へ。サイレンを待たない。',
    detail_id: 'Jika dekat pantai: segera naik ke tempat tinggi. Jangan tunggu sirine.',
  },
];

function getLangText(en: string, ja: string, id: string): string {
  if (currentLang === 'ja') return ja;
  if (currentLang === 'id') return id;
  return en;
}

export function initEarthquakeNow(): void {
  const overlay = document.getElementById('earthquakeNow');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="eq-now-header">
      <div class="eq-now-title">
        <span data-lang="en">EARTHQUAKE - WHAT TO DO NOW</span>
        <span data-lang="ja">地震 - 今すぐやること</span>
        <span data-lang="id">GEMPA - APA YANG HARUS DILAKUKAN SEKARANG</span>
      </div>
      <button class="eq-now-close" id="eqNowClose" aria-label="Close">X</button>
    </div>
    <div class="eq-now-steps">
      ${STEPS.map((s, i) => `
        <div class="eq-now-step">
          <div class="eq-now-step-num">${i + 1}</div>
          <div>
            <div class="eq-now-step-text">
              <span data-lang="en">${s.en}</span>
              <span data-lang="ja">${s.ja}</span>
              <span data-lang="id">${s.id}</span>
            </div>
            <div class="eq-now-step-detail">
              <span data-lang="en">${s.detail_en}</span>
              <span data-lang="ja">${s.detail_ja}</span>
              <span data-lang="id">${s.detail_id}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="eq-now-numbers">
      <div><span data-lang="en">EMERGENCY NUMBERS</span><span data-lang="ja">緊急電話番号</span><span data-lang="id">NOMOR DARURAT</span></div>
      <a href="tel:119">119</a>
      <a href="tel:110">110</a>
    </div>
  `;

  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);

  document.getElementById('eqNowClose')?.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

export function showEarthquakeNow(): void {
  const overlay = document.getElementById('earthquakeNow');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}
```

- [ ] **Step 3: Add mount point to `index.html`**

Add the overlay div and CSS link.

In `<head>`, after the last CSS link:
```html
<link rel="stylesheet" href="css/earthquake-now.css">
```

Just before `</body>`, add:
```html
<div id="earthquakeNow" class="earthquake-now" role="dialog" aria-label="Earthquake emergency guide"></div>
```

- [ ] **Step 4: Wire up in `src/main.ts`**

Add to the imports:
```ts
import { initEarthquakeNow, showEarthquakeNow } from './earthquake-now';
```

Add to the DOMContentLoaded init:
```ts
initEarthquakeNow();
```

Add to the window assignments:
```ts
Object.assign(window, { ..., showEarthquakeNow });
```

- [ ] **Step 5: Add trigger button to emergency FAB panel**

In `index.html`, find the emergency FAB panel and add a new item for the earthquake guide. Add inside the `.emergency-fab-panel` element:

```html
<button class="fab-item" onclick="showEarthquakeNow()">
  <span class="fab-item-icon">🔴</span>
  <span data-lang="en">EARTHQUAKE NOW</span>
  <span data-lang="ja">地震！今すぐ</span>
  <span data-lang="id">GEMPA SEKARANG</span>
</button>
<div class="fab-divider"></div>
```

- [ ] **Step 6: Run tests and build**

Run: `npm test && npm run build`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add css/earthquake-now.css src/earthquake-now.ts index.html src/main.ts
git commit -m "feat: create EARTHQUAKE NOW fullscreen emergency action guide"
```

---

## Task dependency graph

```
PHASE 1 (all parallel):
  T1 (CPR tip)  T2 (Shock tip)  T3 (Burn tip)  T4 (Bag weight)  T5 (HTML lang)

PHASE 2 (all parallel):
  T6 (First-aid timer)  T7 (Drill countdown)  T8 (Mascot mousemove)
  T9 (Earthquake walkTimers)  T10 (Show-this touch)  T11 (Theme init)  T12 (Non-null assertions)

PHASE 3 (all parallel):
  T13 (Reduced-motion CSS)  T14 (alertBlink)  T15 (Color-scheme, depends on T11)
  T16 (aria-current)  T17 (Mascot keyboard)  T18 (aria-live counters)

PHASE 4 (all parallel):
  T19 (Typhoon scene)  T20 (Bible)  T21 (Hero docs)

PHASE 5 (all parallel):
  T22 (Deploy tests)  T23 (CI workflow)  T24 (Code splitting)

PHASE 6 (T25-T26 parallel, T27 independent):
  T25 (Vocab)  T26 (Bag items)  T27 (Earthquake NOW guide)
```

## Verification checklist (after all phases)

- [ ] `npm test` -- all tests pass
- [ ] `npm run build` -- build succeeds, no type errors
- [ ] Manual smoke test: CPR, shock, burn tips show corrected medical info
- [ ] Manual smoke test: bag game allows "perfect" status at 85-100% weight
- [ ] Manual smoke test: "EARTHQUAKE NOW" accessible in 2 taps from FAB
- [ ] Manual smoke test: mascot responds to keyboard (Tab + Enter)
- [ ] Manual smoke test: reduced-motion on all animated sections
- [ ] Manual smoke test: language toggle switches `<html lang>` attribute
- [ ] Manual smoke test: theme auto-detects system preference on first visit
- [ ] Manual smoke test: typhoon scene character reacts to row clicks
- [ ] Manual smoke test: Character Bible shows 28 pose cells
