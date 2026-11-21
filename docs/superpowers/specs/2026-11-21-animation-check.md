# Animation check (Task 10)

Date: 2026-11-21. Branch: `fix/aditya/animation-check`.

This document lists every animation in Mamoru Guide. The check is a code check: the author read each rule and each timer and ran the unit tests. The controller checked some rows in Chrome and the last column has the results.

## How to read this table

- **Reduced motion** means the OS setting `prefers-reduced-motion: reduce` (CSS `@media` rules) and `motionAllowed()` in `src/character/motion.ts` (JS). In Chrome, use DevTools > Rendering > "Emulate CSS media feature prefers-reduced-motion". This also changes `matchMedia`, so the JS follows.
- **Flash rate** is the number of bright-dark-bright cycles each second. WCAG 2.3.1 allows at most 3. "Motion" means the element moves but its brightness does not change.
- **Code check** says what the code does now, after the fixes on this branch.
- Line numbers are for this branch after the fixes.
- Routes: `#/` home (hero), `#/prepare`, `#/learn`, `#/plan`, `#/shelter`, `#/emergency`.

## Summary

- 46 `@keyframes` in `css/*.css` (19 in `css/hero-arcade.css`). `bob` is not in use (no element has its classes). `fadeUp` is in use only on `.hero-title`, and `pulse7` only on the shindo 7 row.
- 13 JS animations (timers, Web Animations API, frame swaps).
- All flash rates are 1.25 or less each second. The earthquake shake and the drill shake are motion at 6 to 7 Hz, not flashes. The controller must still confirm that the strongest quake does not strobe (visual list, item 1).
- 8 bugs found and fixed, each with a test. See "Bugs fixed".

## CSS keyframes

| # | Animation | Code | Where | Trigger | Expected end state | Reduced motion (code-checked) | Flash rate | Issues | Controller visual check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `arcade-blink` (eyebrow) | css/hero-arcade.css:82, 85 | `#/` hero, "INSERT COIN" line | Page load, loops 1.6 s | Loops; text dims to 50% for 20% of each cycle | Stops: hero-arcade.css:478 | 0.63 /s | None | not checked |
| 2 | `arcade-blink` (mascot hint) | css/hero-arcade.css:225 | `#/` hero, "TAP FOR NEXT FACT" | Page load, loops 1.4 s | Loops | Stops: hero-arcade.css:478 | 0.71 /s | None | not checked |
| 3 | `bubble-pop` | css/hero-arcade.css:245, 287 | `#/` hero, fact bubble | Page load, once, 0.15 s | Bubble at full size | Stops (fixed on this branch): hero-arcade.css:478 | None | Was not stopped (bug 6) | Motion: the bubble sits above the sprite and does not cover it; the pop itself not recorded. RM: owner check pending (macOS Reduce motion) |
| 4 | `mk-ripple-expand` | css/hero-arcade.css:301, 303 | `#/` hero, mascot | Click on the mascot, once, 0.7 s | Ripple removed after 700 ms (mascot.ts:213) | JS does not create it (`spawnRipple` checks `allowed`) | None | None | not checked |
| 5 | `mk-hop` | css/hero-arcade.css:313, 319 | `#/` hero, mascot | Tap reaction 1 (jump), once, 0.62 s | `transform: none`, then idle pose | Stops: hero-arcade.css:478 (`.mascot-svg[data-emote]`) | None | None | not checked |
| 6 | `mk-bob` | css/hero-arcade.css:314, 329 | `#/` hero, mascot | Tap reaction 2 (wave), once, 0.72 s | `transform: none` | Stops: hero-arcade.css:478 | None | None | not checked |
| 7 | `mk-shake` | css/hero-arcade.css:315, 333 | `#/` hero, mascot | Tap reaction 3 (burst), once, 0.62 s | `transform: none` | Stops: hero-arcade.css:478 | Motion | None | not checked |
| 8 | `mk-sway` | css/hero-arcade.css:316, 341 | `#/` hero, mascot | Tap reaction 4 (peace), once, 0.68 s | `transform: none` | Stops: hero-arcade.css:478 | None | None | not checked |
| 9 | `mk-bow` | css/hero-arcade.css:317, 348 | `#/` hero, mascot | Tap reaction 5 (bow), once, 0.68 s | `transform: none` | Stops: hero-arcade.css:478 | None | None | not checked |
| 10 | `mk-float` | css/hero-arcade.css:362, 365 | `#/` hero, mascot particles | Each tap, once, 0.9 s | Particles fade out, removed after 1.2 s (mascot.ts:182) | Hidden: hero-arcade.css:478; JS does not create them | None | None | not checked |
| 11 | `ks-fall` | css/hero-arcade.css:446, 449 | `#/` hero, day mode only, petals | Page load, loops 11 to 15 s | Loops | Stops: `.kobe-scene *` hero-arcade.css:793 (the `.ks-petal` rule at :478 loses on specificity, but the `!important` rule covers it) | None | None | not checked |
| 12 | `ks-shoot` | css/hero-arcade.css:466, 471 | `#/` hero, night only, meteor | stars.ts:20, one every 7 to 16 s | Meteor gone; removed after 1 s | Hidden: hero-arcade.css:478; JS does not create it (stars.ts:22), also not when the tab is hidden | 0.14 /s at most | None | not checked |
| 13 | `ks-drift` | css/hero-arcade.css:515, 528 | `#/` hero, day only, 3 clouds | Page load, loops 60 to 90 s | Loops | Stops: hero-arcade.css:525. Clouds now wait in the sky at 30%, 66%, 48% | None | Clouds stopped off-screen at -10% (bug 7, fixed) | not checked. RM: owner check pending (macOS Reduce motion) |
| 14 | `ks-blink` | css/hero-arcade.css:553, 554 | `#/` hero, night only, about 36 of 120 stars | Page load, loops 2.5 to 6.5 s each | Loops; each star dips to 15% for 6% of its cycle | Stops: hero-arcade.css:560 | 0.4 /s at most for each star; stars are 2 or 4 px | None | not checked |
| 15 | `ferris-rotate` | css/hero-arcade.css:634, 635 | `#/` hero, ferris wheel | Page load, loops 30 s | Loops | Stops: hero-arcade.css:644 | None | None | not checked |
| 16 | `cab-glow` | css/hero-arcade.css:636, 637 | `#/` hero, ferris cabins | Page load, loops 1.5 s alternate | Loops | Stops: hero-arcade.css:644 | 0.33 /s, smooth | None | not checked |
| 17 | `boat-drift` | css/hero-arcade.css:670, 674 | `#/` hero, harbor boat | Page load, loops 38 s | Loops | Stops: hero-arcade.css:685. Boat now waits at the middle frame | None | Boat stopped off-screen at left -180 px (bug 7, fixed) | not checked. RM: owner check pending (macOS Reduce motion) |
| 18 | `wake-pulse` | css/hero-arcade.css:679, 680 | `#/` hero, boat wake | Page load, loops 1.4 s alternate | Loops | Stops: hero-arcade.css:685 | 0.36 /s, smooth | None | not checked |
| 19 | `tower-shine` | css/hero-arcade.css:704, 716 | `#/` hero, night only, Port Tower glow | Page load, loops 2.4 s | Loops; day mode sets `animation: none` | Stops: hero-arcade.css:737 | 0.42 /s, smooth | None | not checked |
| 20 | `tower-blink` | css/hero-arcade.css:731, 732 | `#/` hero, tower top light | Page load, loops 1.4 s | Loops; on for 48%, off for 52% | Stops: hero-arcade.css:737 | 0.71 /s; small red light | None | not checked |
| 21 | `fadeUp` | css/hero.css:20, 38 | `#/` hero title | Page load, once, 1 s after 0.3 s | Opacity 1, no offset | Stops: hero.css:136 | None | `.hero-kanji`, `.hero-subtitle`, `.scroll-hint` also use it but are not in index.html (dead CSS) | not checked |
| 22 | `bob` | css/hero.css:44, 48 | Nowhere | `.mascot-char` and `.scroll-hint` are not in index.html | Not shown | Stops: hero.css:136 (`.scroll-hint` added on this branch so the guard test passes) | None | Dead CSS: remove in Phase 0 | not checked. RM: owner check pending (macOS Reduce motion) |
| 23 | `waves` | css/hero.css:107, 111 | `#/` hero, water | Page load, loops 3 s | Loops | Stops: `.kobe-scene *` hero-arcade.css:793 | None | None | not checked |
| 24 | `px-blink` | css/hero.css:125, 127 | `#/` hero, sun rays and moon twinkle | Page load, loops 1.2 s (two groups, 0.6 s apart) | Loops | Stops: hero.css:136; group B hidden | 0.83 /s; small | None | not checked |
| 25 | `packIn` | css/bag-game.css:53, 55 | `#/prepare` bag game, packed list | Item packed, once, 0.2 s | Item in place | Plays (8 px slide, 0.2 s; small and short) | None | None | not checked |
| 26 | `bag-hop` | css/bag-game.css:255, 259 | `#/prepare` bag scene | Load is light (under 40%), loops 0.8 s | Loops while light | Stops (fixed on this branch): bag-game.css:268 | Motion, 4 px | The stop rule lost on specificity (bug 4) | not checked. RM: owner check pending (macOS Reduce motion) |
| 27 | `bag-sag` | css/bag-game.css:256, 260 | `#/prepare` bag scene | Load is heavy (70% to 90%), loops 1.6 s | Loops while heavy | Stops (fixed): bag-game.css:268 | Motion, 2 px | Bug 4 | not checked. RM: owner check pending (macOS Reduce motion) |
| 28 | `bag-wobble` | css/bag-game.css:257, 261 | `#/prepare` bag scene | Load is strain (90% and over), loops 0.5 s | Loops while strain | Stops (fixed): bag-game.css:268 | Motion, 2 Hz | Bug 4 | not checked. RM: owner check pending (macOS Reduce motion) |
| 29 | `bag-stagger` | css/bag-game.css:258, 262 | `#/prepare` bag scene | Item too heavy, 3 times 0.3 s; back to the load pose after 900 ms (bag-scene.ts:78) | Previous load pose | Stops (fixed): bag-game.css:268 | Motion | Bug 4 | not checked. RM: owner check pending (macOS Reduce motion) |
| 30 | `drillShake` | css/drill.css:4, 6 | `#/learn` drill | Drill start and question 1 and 5, loops 0.15 s for 2 s (drill.ts:134) | `.shaking` removed after 2 s | Stops: drill.css:202. JS now does not add `.shaking` or vibrate (fixed) | Motion, 6.7 Hz, 4 px | Shook and vibrated with the app setting (bug 1) | Motion: the alert shakes, then stops; no console errors. RM: owner check pending (macOS Reduce motion) |
| 31 | `countPulse` | css/drill.css:21, 26 | `#/learn` drill countdown | Start drill, loops 1 s for 3 s | Countdown replaced by the alert | Stops: drill.css:202 | 1 /s, opacity 1 to 0.8, smooth; not a flash | None | Motion: 3 s countdown, then the alert; no console errors |
| 32 | `countPop` | css/drill.css:24, 30 | `#/learn` drill countdown | Each number, once, 0.3 s (drill.ts:164) | Number at full size | Stops: drill.css:202 | None | None | not checked |
| 33 | `alertFade` | css/drill.css:46, 64 | `#/learn` drill alert | Drill start, 2 times 1.5 s | Opacity 1 | Stops: drill.css:202 | 0.67 /s, opacity 1 to 0.6, smooth | None | not checked |
| 34 | `mr-lamp-sway` | css/earthquake-room.css:46, 47 | `#/prepare` earthquake room | Tap a shindo row (1 and up), loops 0.6 s while `.quaking` | Lamp still after the shaking stops | Stops: earthquake-room.css:108; JS does not add `.quaking` | Motion | None | Motion: shindo 7 end state OK; lamp not recorded separately |
| 35 | `mr-object-fall` | css/earthquake-room.css:63, 64 | `#/prepare` earthquake room, vase and book | Book at shindo 4 and up, vase at 5- and up, once, 0.5 s | On the floor | Stops: earthquake-room.css:108; objects shown on the floor at once | None | None | Motion: shindo 7, the vase and the picture are down; no console errors |
| 36 | `mr-door-pulse` | css/earthquake-room.css:75, 76 | `#/prepare` earthquake room, door glow | Shindo 4 and up, only after the shaking stops; loops 1 s alternate | Loops while that level shows | Stops: earthquake-room.css:108 | 0.5 /s | None | Motion: shindo 7, the door glow shows only after the shaking stops |
| 37 | `mr-warn-flash` | css/earthquake-room.css:82, 83 | `#/prepare` earthquake room, window warning | Shindo 5- and up, loops 0.8 s | Loops while that level shows | Stops: earthquake-room.css:108 | 1.25 /s; small text | None | Motion: shindo 7, the AVOID label shows |
| 38 | `pulse7` (scale row) | css/earthquake-scale.css:70, 72 | `#/prepare` shindo 7 row | Page load, loops 2 s | Loops | Stops (fixed): earthquake-scale.css:91, keeps the still glow | 0.5 /s, smooth | Did not stop (bug 5) | not checked. RM: owner check pending (macOS Reduce motion) |
| 39 | `pulse7` (bag weight) | css/bag-game.css:109 | Nowhere | `.bag-stat-value.over` is never set | Not shown | Stops (fixed): bag-game.css:268 | 1 /s | Dead CSS; bug 5 for the rule | not checked. RM: owner check pending (macOS Reduce motion) |
| 40 | `fab-pulse` | css/emergency-fab.css:17, 31 | Every route, SOS button | Page load, loops 3 s; stops when the panel is open | Loops | Stops: emergency-fab.css:105 | 0.33 /s, smooth | None | not checked |
| 41 | `fab-panel-in` | css/emergency-fab.css:49, 55 | Every route, SOS panel | Open the panel, once, 0.2 s | Panel in place | Stops: emergency-fab.css:105 | None | None | not checked |
| 42 | `em-pulse` | css/emergency-mode.css:46, 48 | `#/emergency` title | Page load, loops 2 s | Loops | Stops (fixed): emergency-mode.css:233 | 0.5 /s, opacity 1 to 0.85 | Did not stop (bug 5) | not checked. RM: owner check pending (macOS Reduce motion) |
| 43 | `em-call-pulse` | css/emergency-mode.css:78, 108 | `#/emergency` call 119 card | Page load, loops 2.4 s | Loops | Stops (fixed): emergency-mode.css:233 | 0.42 /s, smooth glow | Did not stop (bug 5) | not checked. RM: owner check pending (macOS Reduce motion) |
| 44 | `timerPulse` | css/first-aid.css:134, 139 | `#/prepare` first aid timer | Start a step timer, loops 2 s while running | `.done`, green border | Stops (fixed): first-aid.css:258 | 0.5 /s, smooth | Did not stop (bug 5) | not checked. RM: owner check pending (macOS Reduce motion) |
| 45 | `shelterSpin` | css/shelter-finder.css:75, 77 | `#/shelter` loading | Find shelters, loops 0.8 s while it looks for the location | Replaced by the results | Stops (fixed): shelter-finder.css:267; the "Please wait" text stays | None | Did not stop (bug 5) | not checked. RM: owner check pending (macOS Reduce motion) |
| 46 | `plan-show-fade` | css/plan-wizard.css:249, 251 | `#/plan` "show plan" overlay | Open the overlay, once, 0.18 s | Opacity 1 | Plays; it is a fade only | None | None | not checked |
| 47 | `tabIn` | css/vocab.css:19, 21; css/bag-game.css:203 | `#/prepare` vocab tabs and bag result | Tab shown or result shown, once, 0.3 s | In place | Plays (10 px slide, 0.3 s) | None | None | not checked |
| 48 | `fcSlideIn` | css/vocab.css:50, 52 | `#/prepare` vocab flashcard | Each new card, once, 0.22 s | Card in place | Plays (18 px slide, 0.22 s) | None | Played only for the first card of a tab (bug 8, fixed) | Motion: the card advances; no console errors; the slide itself not recorded |

Rows 1 and 2 share `arcade-blink`, and rows 38 and 39 share `pulse7`. So 48 rows cover the 46 keyframes.

## JS animations

| # | Animation | Code | Where | Trigger | Expected end state | Reduced motion (code-checked) | Flash rate | Issues | Controller visual check |
|---|---|---|---|---|---|---|---|---|---|
| J1 | Quake shake (Web Animations API, 12 fps steps) | src/character/motion.ts:36, 59 | `#/prepare` earthquake room and the shindo row icon | Tap a shindo row (earthquake-scale.ts:25, earthquake-scene.ts:323) | Offset 0, 0 (first and last frame are 0) | Not played: earthquake-scale.ts:25 and earthquake-scene.ts:332 check `motionAllowed()`; a change cancels it (earthquake-scene.ts:366) | Motion, 6 Hz side to side, up to 9 room px (about 18 px at 640 px wide), 1.6 s to 4.4 s | Confirm no strobe at shindo 7 | Motion: shindo 7 end state OK; no console errors; strobe check not recorded |
| J2 | Earthquake actor walk (2 frames, steps) | src/character/earthquake-scene.ts:306 | `#/prepare` earthquake room | Tap a shindo row | Under the table at every felt level; stands at level 0 | Placed at once (earthquake-scene.ts:308) | None | None | Motion: shindo 7, the actor ends under the table |
| J3 | Earthquake hazards timeline (fall at 30%, door after settle) | src/character/earthquake-scene.ts:323 | `#/prepare` earthquake room | Tap a shindo row | Door glow only after the shaking stops | Final state at once (earthquake-scene.ts:332) | None | None | Motion: shindo 7, cracked window, fallen shelf, vase and picture down; door glow only after the shaking |
| J4 | Earthquake tip rotation | src/character/earthquake-scene.ts:352 | `#/prepare` earthquake room bubble | Interval | Next tip | Stopped (earthquake-scene.ts:358) | None | Runs in a hidden tab (low risk; see concerns) | not checked |
| J5 | Drill shake and vibration | src/drill.ts:134 | `#/learn` drill | Drill start and shake questions | `.shaking` removed after 2 s | Fixed: no `.shaking`, no `navigator.vibrate` | Motion | Bug 1 | Motion: shakes, then stops; no console errors. RM: owner check pending (macOS Reduce motion) |
| J6 | Drill countdown | src/drill.ts:157 | `#/learn` drill | Start drill | Alert, then question 1 after 2.5 s | Numbers still count; CSS pulse stops | None | None | Motion: 3 s countdown, then question 1 of 6; no console errors |
| J7 | Mascot fact rotation (8 s) and blink (2.4 to 6 s) | src/character/mascot.ts:139, 147 | `#/` hero | Interval and timeout | Eyes open | Stopped (mascot.ts:238). Now also paused while the tab is hidden, and the eyes open if the pause comes during a blink | None | Bug 2 | not checked |
| J8 | Mascot eye tracking | src/character/mascot.ts:164 | `#/` hero, desktop pointer | Mouse move | Pupils follow in whole pixels | Off; pupils centered | None | None | not checked |
| J9 | Mascot tap reactions (frame swaps) | src/character/mascot.ts:196 | `#/` hero | Click or Enter on the mascot | Idle pose after the last frame | Frames still swap (pose only); the CSS body motion stops | None | None | not checked |
| J10 | Actor idle blink and action loop (typhoon, first aid) | src/character/actor.ts:131, 141 | `#/prepare` typhoon and first aid stages | Open a typhoon row or a first aid card | Loops while open; stand and blink when closed | One still frame (actor.ts:134, 145) | Torch beam dims once every 1.2 s (0.83 /s); rain and wind are small | None | not checked |
| J11 | Typhoon and first aid tip rotation (4.5 s) | src/character/typhoon-scene.ts:69, firstaid-scene.ts:72 | `#/prepare` | Interval while nothing is open | Next tip | Fixed: stopped at page load too | None | Started with `applyMotion(true)` (bug 3) | not checked. RM: owner check pending (macOS Reduce motion) |
| J12 | Bag scene load pose and tip rotation | src/character/bag-scene.ts:64, 86 | `#/prepare` bag | `mamoru:bag-weight` event | Pose for the load; reject pose for 900 ms | Tips stop; CSS loops stop (bug 4 fixed) | None | None | not checked. RM: owner check pending (macOS Reduce motion) |
| J13 | Stars and meteors | src/stars.ts:4, 20 | `#/` hero, night | Page load; meteor every 7 to 16 s | Meteor removed after 1 s | No meteor (stars.ts:22); CSS stops the blink | See rows 12 and 14 | None | not checked |
| J14 | Bag item reject state | src/bag-game.ts:39 | `#/prepare` bag game | Item too heavy | `.rejected` removed after 800 ms | Not an animation (static red border) | None | None | not checked |

`src/skyline.ts` and `src/character/footer-mascot.ts` draw static pixels only. They have no animation.

## Bugs fixed

| # | Bug | Fix | Test | Commit |
|---|---|---|---|---|
| 1 | The drill shook and vibrated when `motionAllowed()` was false (app setting; CSS covers only the OS setting, and `navigator.vibrate` had no check). | `triggerShake` returns when `motionAllowed()` is false. | src/__tests__/drill-motion.test.ts | `fix(motion): drill shake and vibration respect reduced motion` |
| 2 | Mascot fact and blink timers ran in a hidden tab. A pause during a blink could also leave the eyes shut. | Pause on `visibilitychange`, resume when visible; the inner blink timer is now tracked. | src/character/__tests__/mascot.test.ts ("when the tab is hidden") | `fix(motion): mascot timers pause while the tab is hidden` |
| 3 | Typhoon and first aid scenes started their tip rotation with `applyMotion(true)`, so tips changed by themselves under reduced motion. | `applyMotion(motionAllowed())`. | typhoon-scene.test.ts, firstaid-scene.test.ts ("reduced motion: the tip bubble does not change by itself") | `fix(motion): typhoon and first aid tips stay still under reduced motion` |
| 4 | The bag sprite kept hopping under reduced motion: `#bag-scene .mamoru-sprite` loses to `#bag-scene[data-load="light"] .mamoru-sprite` on specificity. | The stop rule uses the same four selectors. | src/__tests__/reduced-motion-css.test.ts | `fix(motion): bag sprite stops under reduced motion at every load level` |
| 5 | Looping pulses had no reduced-motion rule: `pulse7`, `em-pulse`, `em-call-pulse`, `timerPulse`, `shelterSpin` (and dead `.scroll-hint`). | Added `animation: none` rules. | reduced-motion-css.test.ts ("stops every looping animation") | `fix(motion): pulse and spinner loops stop under reduced motion` |
| 6 | The hero fact bubble popped from scale 0 under reduced motion. | `.pixel-bubble { animation: none; }` | reduced-motion-css.test.ts (one-shot list) | `fix(motion): hero fact bubble does not pop under reduced motion` |
| 7 | Under reduced motion, the boat and the day clouds stopped at their off-screen start, so they were never seen. | Boat waits at the middle frame; clouds wait at 30%, 66%, 48%. | reduced-motion-css.test.ts ("parks the boat", "parks cloud") | `fix(motion): boat and clouds stay in view under reduced motion` |
| 8 | The vocab flashcard slide-in played only for the first card. Setting the same class name again does not restart a CSS animation. | Each card is a new element (`replaceWith`). | src/__tests__/vocab-flashcard.test.ts | `fix(motion): vocab flashcard slides in again for each new card` |

The new guard test `reduced-motion-css.test.ts` reads every stylesheet in index.html. It fails when a looping animation has no reduced-motion stop rule that wins the cascade.

## Not fixed (concerns)

- **The app setting does not reach CSS.** `motionAllowed()` also reads `localStorage['a11y-reduced-motion']`, but no screen sets that key today, and the CSS reads only the OS setting. If an in-app toggle comes, the CSS loops (door glow, warning, bag sprite, drill countdown) need a class such as `body.reduce-motion` in each stop rule.
- **Other timers in hidden tabs.** The earthquake, bag, typhoon and first aid tip rotations and the actor blink still run in a hidden tab. They only change text or one sprite, and browsers slow timers in hidden tabs. Low risk.
- **Small one-shot slides stay** under reduced motion: `packIn` (8 px), `tabIn` (10 px), `fcSlideIn` (18 px), `plan-show-fade` (fade only). They are short and small.
- **Dead CSS** for Phase 0: `bob`, `.mascot-char`, `.scroll-hint`, `.hero-kanji`, `.hero-subtitle`, `.bag-stat-value.over`.

## Controller visual check list (ranked by risk)

Check each at 390 px and 1280 px, day and night where it matters. "RM on" means DevTools > Rendering > prefers-reduced-motion: reduce.

1. **Earthquake room, strongest quake.** `#/prepare`, Earthquake section, tap the 震度7 row. Look for: no strobing at any point of the 4.4 s shake; the vase and book land on the floor; the actor ends under the table; the door glow shows only after the shaking stops; the lamp stops. Then tap 震度0: calm room, actor stands. RM on: no shake, final state at once.
2. **Hero day mode, RM on (new positions).** `#/`, day mode. Look for: the boat waits in the harbor and the 3 clouds wait in the sky; nothing overlaps the sun, the tower or the title at 390 px.
3. **Bag sprite, RM on.** `#/prepare`, Bag section. Pack items to light, heavy and strain, then try one item too many. Look for: the sprite does not move at any load (it hopped before). RM off: hop, sag, wobble, stagger, then back to the load pose.
4. **Vocab flashcard.** `#/prepare`, Vocab section, press ▶ and ◀ several times. Look for: the card slides in each time; no layout jump of the counter or the buttons; no console error.
5. **Drill.** `#/learn`, Start drill. RM off: 3-2-1, the alert shakes for 2 s and stops, the question shows; question 1 shakes again. RM on: no shake.
6. **Mascot.** `#/`, tap the mascot 5 times. Look for: each reaction ends in the idle pose; particles and ripple disappear; the bubble and sprite do not jump. Switch to another tab for 20 s and come back: blink and fact rotation start again.
7. **Typhoon scene.** `#/prepare`, Typhoon section, open each row. Look for: Typhoon level has no tape and no wind; Very strong torch beam dims gently; Violent rain loops; closing the row returns him to stand. RM on: one still frame, the tip does not change by itself.
8. **Hero night sky.** `#/`, night mode, watch 20 s. Look for: star blinks and the tower light do not strobe; a meteor crosses and disappears; ferris wheel turns.
9. **First aid.** `#/prepare`, First aid, open CPR (push rhythm) and Burns, start the timer. Look for: timer border pulse while running, green when done. RM on: timer border still.
10. **Emergency mode.** `#/emergency`. Look for: the title and the call 119 card pulse gently. RM on: both still. Also open the SOS button panel on any route.
11. **Shelter loading.** `#/shelter`, start the search. RM on: the spinner is still and the "Please wait" text shows.

## Controller visual check: results

The controller checked in Chrome with motion allowed on 2026-11-21. The results are in the last column of each table.

- Earthquake room, shindo 7: the end state is correct. The window is cracked, the shelf has fallen, the vase and the picture are down, the actor is under the table, the door glow shows only after the shaking, and the AVOID label shows. No console errors.
- Drill: the 3 s countdown runs, the alert shakes and stops, and question 1 of 6 shows. No console errors.
- Vocab flashcard: the card advances. No console errors.
- Hero: the tip bubble sits above the sprite and does not cover it.

Key for the last column:

- "Motion: ..." is what the controller saw with motion allowed.
- "RM: owner check pending (macOS Reduce motion)" marks a row whose reduced-motion behavior changed on this branch. The owner checks it with the macOS Reduce motion setting.
- "not checked" means that nobody recorded this row in a browser.
