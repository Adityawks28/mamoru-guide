# Content Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every word, fact, font and animation in Mamoru Guide correct, sourced and readable in English, Japanese and Indonesian, and remove AI slop from the code comments.

**Architecture:** Guard tests come first: they read the source text and fail on rule breaks, so later rewrites cannot drift. Facts come before wording, because a fact that has no source is removed, and rewording it first is wasted work. Fonts and animations are checked last, because text changes move the layout.

**Tech Stack:** TypeScript, Vite, Vitest + jsdom, Claude in Chrome for the visual checks.

**Spec:** This document, section "Requirements" (from the 2026-11-21 session with Aditya).

## Requirements

1. English follows ASD-STE100 (Issue 9) writing rules.
2. Japanese follows やさしい日本語.
3. Indonesian is casual but polite and straightforward.
4. Every medical step and every history fact follows an official guide from a trusted source, with the source recorded.
5. Every animation shows correctly.
6. Every font shows correctly in every language, with no "ugly" fallback.
7. Comments and code have no AI slop (antislop, After mode: audit first, Aditya picks the numbers, then fix).

## Global Constraints

- Branch names: `type/aditya/short-description`. Commit messages: one line, no AI trailer.
- One PR per task group below; `main` is protected, CI check `check` must pass.
- No em dash (`—`) in any user-visible text (antislop R-02).
- No number or statistic without a recorded official source (antislop R-17). No source found means the fact is removed.
- No new runtime dependency. No paid service. No account.
- English instruction sentences: max 20 words. English descriptive sentences: max 25 words (STE Rules 5.1, 6.1). Active voice. One word for one meaning.
- Japanese: です/ます form, one idea per sentence, no 尊敬語/謙譲語, a reading in parentheses after a hard kanji term on first use (for example 避難所（ひなんじょ）).
- Indonesian: EYD V spelling (KBBI), pronoun per Decision D-1, short sentences.
- Medical text that no qualified person has reviewed carries a visible "not yet reviewed by a medical professional" note in all three languages.

## Decisions (made by Aditya on 2026-11-21)

Aditya works alone and is no longer in PPI Kobe. No outside reviewer is available, so no step may depend on one.

| ID | Decision | Why |
|---|---|---|
| D-1 | Indonesian pronoun: `kamu`, with polite verbs ("yuk", "tolong") | The audience is students. `kamu` reads friendly and still respectful, like Gojek and Tokopedia copy. `Anda` (98 uses now) reads like a government form. |
| D-2 | Japanese hard kanji: reading in parentheses now, `<ruby>` later with the ROADMAP "Furigana switch" | Parentheses need no CSS or JS change and work in the print view. |
| D-3 | Japanese pixel font: DotGothic16 after Press Start 2P | Press Start 2P has no Japanese glyphs, so 65 rules fall back to a random system monospace font. DotGothic16 is a free pixel font with Japanese glyphs. |
| D-4 | Medical review: a verification agent compares every step with the official source text, and a second agent checks that comparison. The "not yet reviewed by a medical professional" note stays on every card. | No qualified person is available. An AI check finds differences from official guides; it does not replace a medical review, and the note tells the user that. |
| D-5 | Japanese review: a rule test plus an agent review against the やさしい日本語 guidelines. Aditya reads the result. | No native reviewer is available. Aditya reviews the Indonesian as a native speaker. |
| D-6 | Remove PPI Kobe. The maker is "Aditya", linked to https://github.com/Adityawks28. The footer PPI Kobe pixel logo becomes the Mamo-kun sprite. | Aditya decided on 2026-11-21: they work alone and left PPI Kobe. First name only shares the least personal data. Mamo-kun reuses existing art. |

## Trusted sources (check each URL is live, record the date checked)

| Area | Source |
|---|---|
| CPR, AED | 日本蘇生協議会 (JRC) 蘇生ガイドライン 2020; use the 2025 edition instead if it is published |
| First aid | JRC ガイドライン 第7章 ファーストエイド; 総務省消防庁「一般市民向け 応急手当WEB講習」; 日本赤十字社 救急法; 東京消防庁 応急手当 |
| Psychological first aid | WHO「心理的応急処置（サイコロジカル・ファーストエイド：PFA）フィールドガイド」(Japanese edition by 国立精神・神経医療研究センター) |
| Quake and typhoon actions | 内閣府 防災情報; 気象庁; 総務省消防庁; 首相官邸「災害に対するご家庭での備え」; 東京都「東京防災」 |
| Warnings and terms | 気象庁「多言語辞書」(warning terms in やさしい日本語 and Indonesian) |
| 1995 Kobe facts | 総務省消防庁「阪神・淡路大震災について（確定報）」; 神戸市「阪神・淡路大震災の概要及び復興」; 内閣府 防災白書 |
| 2011 Tōhoku facts | 気象庁 東北地方太平洋沖地震 reports; 東北地方太平洋沖地震津波合同調査グループ (run-up heights) |
| やさしい日本語 | 出入国在留管理庁・文化庁「在留支援のためのやさしい日本語ガイドライン」; 弘前大学 社会言語学研究室「減災のためのやさしい日本語」 |
| STE | ASD-STE100 Issue 9 (the dictionary is free on request from ASD) |
| Indonesian | EYD V (Badan Bahasa, 2022); KBBI Daring |

## Review Focus

1. A Japanese reader sets the language to 日本語 and sees pixel headings in a random system font: Task 9 checks every section in Japanese at 390 px and 1280 px.
2. An Indonesian string is about 25% longer than the English and overflows a chip or a button at 390 px: Task 9 adds an Indonesian 390 px pass.
3. A rewrite changes the meaning of a medical step (for example "do not" lost in Japanese): Task 3 records each step as a claim, and Task 6 to Task 8 must keep `claimId` links, so a reviewer compares claim to text.
4. A user with "reduce motion" on still gets the drill shake: Task 10 tests `triggerShake` against `motionAllowed()`.
5. A fact stays in one language and is removed in the other two: Task 1 parity test fails when one language is empty.

---

## Phase 0: Anti-slop audit (read only, can run in parallel with Phase 1)

### Task 0: Write the anti-slop audit

**Files:**
- Create: `anti-slop/audit-001-2026-11-21.md`

- [ ] **Step 1:** Scan all files in `src/`, `css/`, `public/sw.js`, `scripts/`, `index.html` against `antislop-code` (comments) and antislop R-02 (em dash in UI text). Known counts on 2026-11-21: 645 comment lines, 27 banner comments (mostly `css/hero-arcade.css`), 57 em dashes in comments, 11 em dashes outside comments, 2 internal plan references, 112 comment lines in two dead scripts.
- [ ] **Step 2:** Write one numbered finding per file group: number, file:line, pattern, rule (R-XX), priority (Hard Gate HIGH, Purpose-Gate MEDIUM, Quality Lock LOW), one-line reason. Separate "comment only" findings from "code" findings (the `lang3` helper copied in 7 modules, the unused `mamoru-a11y` schema in `src/storage.ts:31-37`, the dead scripts `scripts/build-basemap.mjs` and `scripts/build-hazard-data.mjs`, the wrong reference to `shelter-storage.ts` in `src/storage.ts:28-29`).
- [ ] **Step 3:** Stop. Aditya picks the numbers. Do not change any file before that.
- [ ] **Step 4:** Fix the picked comment findings on `refactor/aditya/comment-cleanup` (comments only, code untouched). Fix the picked code findings on `refactor/aditya/dead-code`. Run `npm test` and `npm run build` after each. Write `anti-slop/audit-001-2026-11-21-report.md` with what was fixed.

## Phase 1: Guard tests (`test/aditya/copy-guards`)

### Task 1: Text corpus helper and rule tests

**Files:**
- Create: `src/__tests__/helpers/copy-corpus.ts`
- Create: `src/__tests__/copy-rules.test.ts`

**Interfaces:**
- Produces: `loadCopy(): CopyEntry[]` where `CopyEntry = { file: string; line: number; key: string; en?: string; ja?: string; id?: string; kind: 'instruction' | 'descriptive' }`.
  Reads every non-test `src/**/*.ts` and `index.html`. Groups `x_en/x_ja/x_id` and `en/ja/id` properties of one object literal, and the three `data-lang` spans of one element. `kind` is `instruction` for `instruction_*`, `steps`, drill and earthquake-now action text, else `descriptive`.
- Produces: `sentences(text: string, lang: 'en' | 'ja' | 'id'): string[]`.

- [ ] **Step 1: Write the failing tests**

```ts
describe('copy rules', () => {
  const copy = loadCopy();
  it('finds the trilingual corpus', () => expect(copy.length).toBeGreaterThan(400));
  it('has all three languages for every entry', () => {
    expect(copy.filter(c => !c.en || !c.ja || !c.id).map(at)).toEqual([]);
  });
  it('has no em dash in user-visible text', () => {
    expect(copy.filter(c => [c.en, c.ja, c.id].some(t => t?.includes('—'))).map(at)).toEqual([]);
  });
  it('keeps English instruction sentences at 20 words or fewer', () => {
    expect(longSentences(copy, 'instruction', 20)).toEqual([]);
  });
  it('keeps English descriptive sentences at 25 words or fewer', () => {
    expect(longSentences(copy, 'descriptive', 25)).toEqual([]);
  });
  it('uses one Indonesian pronoun (Decision D-1)', () => {
    expect(copy.filter(c => /\bAnda\b/.test(c.id ?? '')).map(at)).toEqual([]);
  });
  it('keeps Japanese sentences at 40 characters or fewer', () => {
    expect(copy.flatMap(c => sentences(c.ja ?? '', 'ja')).filter(s => s.length > 40)).toEqual([]);
  });
});
```

`at(c)` returns `` `${c.file}:${c.line}` `` so a failure lists every location.

- [ ] **Step 2:** Run `npx vitest run src/__tests__/copy-rules.test.ts`. Expected: FAIL. The corpus test passes; the em dash, Indonesian pronoun and Japanese length tests fail with lists of locations. Save the failure lists; Phase 3 works from them.
- [ ] **Step 3:** Implement `loadCopy` and `sentences` (`Intl.Segmenter` with `granularity: 'sentence'` handles 。 and . alike).
- [ ] **Step 4:** Mark the rule tests that Phase 3 fixes with `it.todo` replacements pointing to the task that fixes them, so `main` stays green. The parity and corpus tests stay active.
- [ ] **Step 5:** Run `npm test`. Expected: PASS. Commit `test: add copy rule guards for three languages`.

### Task 2: Term glossary

**Files:**
- Create: `src/data/sources.ts` (sources only; Task 3 adds claims)
- Create: `src/data/glossary.ts`
- Create: `src/__tests__/glossary.test.ts`

**Interfaces:**
- Produces: `type SourceId = string`; `SOURCES: Record<SourceId, { publisher: string; title: string; url: string; checked: string /* YYYY-MM-DD */ }>`.
- Produces: `GLOSSARY: ReadonlyArray<{ ja: string; reading: string; en: string; id: string; source: SourceId }>`.

- [ ] **Step 1:** Fill the glossary from the 気象庁 多言語辞書 for warning terms, and from the sources table for the rest. Minimum terms: 避難所, 避難場所, 避難指示, 高齢者等避難, 緊急安全確保, 津波警報, 大津波警報, 緊急地震速報, 震度, 余震, 通電火災, 圧挫症候群, 心肺蘇生, AED, 止血帯.
- [ ] **Step 2: Write the failing test:** for each glossary term, every `CopyEntry` whose `ja` contains `term.ja` has `en` containing `term.en` (case-insensitive) and `id` containing `term.id`. Example that must fail today: 避難所 is "shelter" in some strings and "evacuation shelter" in others.
- [ ] **Step 3:** Run it. Expected: FAIL with a list. Mark it `it.todo` until Task 6 to Task 8 fix the strings. Commit `test: add disaster term glossary`.

## Phase 2: Facts (`fix/aditya/verified-facts`)

### Task 3: Sources and claims registry

**Files:**
- Modify: `src/data/sources.ts` (add `CLAIMS`)
- Create: `src/__tests__/sources.test.ts`
- Modify: `src/first-aid.ts`, `src/character/tips.ts`, `src/earthquake-now.ts`, `src/drill.ts`, `src/typhoon.ts` (add `claimId` fields only)

**Interfaces:**
- Consumes: `SourceId`, `SOURCES` from Task 2.
- Produces: `CLAIMS: Record<string, { sources: SourceId[]; status: 'verified' | 'changed' | 'removed' | 'needs-medical-review'; note: string }>`.

- [ ] **Step 1: Write the failing tests:** every first-aid step, every tip that contains a digit, every earthquake-now and drill action has a `claimId` in `CLAIMS`; every claim with status `verified` or `changed` has at least one source; every source URL starts with `https://`.
- [ ] **Step 2:** Run. Expected: FAIL (no `claimId` exists yet).
- [ ] **Step 3:** Add the registry and the `claimId` fields with status `needs-medical-review` for medical steps and `verified` only after Task 4 or Task 5 confirms them.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Commit `feat: add sources and claims registry`.

### Task 4: Verify the medical steps

**Files:**
- Create: `docs/superpowers/specs/2026-11-21-medical-verification.md`
- Modify: `src/first-aid.ts` (steps, and the review note in the card render), `src/data/sources.ts`

- [ ] **Step 1:** For each of the 8 cards (bleeding, burns, fractures, crush, CPR, shock, smoke, psychological) and each step, write a row: claim (English), source and section, what the source says (quote in Japanese with an English gist), verdict (`match`, `differs`, `not found`), proposed text.
- [ ] **Step 2:** Check these known risks first:
  - Crush: "more than 15 minutes, do not free them" (`src/first-aid.ts:60`). Find the official threshold or remove the number.
  - Shock: "raise their legs 20 to 30 cm" against the current JRC first-aid chapter.
  - CPR: 100 to 120 per minute, 5 to 6 cm adults, infant two fingers, against JRC 2020 or 2025.
  - Tourniquet advice for lay people, against JRC first aid and 消防庁.
  - Psychological: the 5-4-3-2-1 grounding step is not in WHO PFA ("look, listen, link"). Keep it only with a source.
- [ ] **Step 3:** Apply every `differs` and `not found` fix to all three languages. Update `CLAIMS` status. Add the "not yet reviewed by a medical professional" note to every card (Decision D-4).
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Commit `fix(first-aid): align steps with JRC and FDMA guidance`.

### Task 5: Verify the history facts

**Files:**
- Create: `docs/superpowers/specs/2026-11-21-history-verification.md`
- Modify: `src/character/tips.ts`, `src/earthquake-now.ts`, `src/data.ts:79`, `index.html:424-426,983-985,1028`

- [ ] **Step 1:** Write one row per fact: 6,434 deaths; 4,571 in Kobe City; fire burned about 7,000 buildings; ATMs down 5 days; 100 km of roads jammed; most deaths from being crushed; shindo 7; tsunami "waves reached 40 m in some bays"; first wave 8 to 25 minutes after the warning.
- [ ] **Step 2:** Known risks: "waves reached 40 m" mixes wave height with run-up height (water height on land), so the wording changes even if the number stays. "ATMs 5 days" and "100 km of roads" need a primary source or they are removed.
- [ ] **Step 3:** Fix or remove in all three languages. Replace "Last updated March 2026" (`index.html:1028`) with the build date from `import.meta.env` set in `vite.config.ts` `define`.
- [ ] **Step 4:** Run `npm test`. Commit `fix(facts): source every history number, remove the unsourced ones`.

### Task 5b: Made by Aditya (Decision D-6)

**Files:**
- Modify: `index.html:9` (author meta), `index.html:424-426` (hero line), `index.html:974-985` (About card), `index.html:1113-1176` (footer SVG logo), `index.html:1222` and `src/locales/en.ts:114`, `src/locales/ja.ts:114`, `src/locales/id.ts:114` (footer.copy), `README.md:5`, `css/layout.css:189` (rename `.ppi-logo-svg` to `.footer-mascot`), `src/contacts.ts:34` (comment only)
- Create: `src/__tests__/authorship.test.ts`

- [ ] **Step 1: Write the failing test:** no non-test file outside `docs/` and `anti-slop/` contains `PPI` or `Perhimpunan`; `index.html` has `<meta name="author" content="Aditya">`; the footer copy in all three locales contains `Aditya`.
- [ ] **Step 2:** Run `npx vitest run src/__tests__/authorship.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Rewrite in all three languages. Hero: say Aditya made it in Kobe, keep the 1995 reference only if Task 5 kept it. About card: title "About the maker"; body: Aditya made this guide alone, as a free tool for people in Japan who find disaster information hard to read; link the GitHub profile. Do not invent biography facts. Footer: "Mamoru Guide 守る · Made by Aditya." Replace the footer SVG with the Mamo-kun sprite markup the hero already uses (reuse its classes or sprite function, `aria-hidden="true"`). Keep the Indonesian embassy contact; change only its comment.
- [ ] **Step 4:** Run `npm test` and `npm run build`. Expected: PASS. Commit `feat: credit Aditya as the maker, replace the PPI Kobe logo with Mamo-kun`.

### Task 6: Verify the safety actions

**Files:**
- Modify: `src/earthquake-now.ts`, `src/drill.ts`, `src/typhoon.ts`, `index.html:740-780` (alerts)

- [ ] **Step 1:** Check each action against 内閣府, 気象庁, 消防庁. Check the alert names against the current 気象庁 page (the ROADMAP open item on the 2026 warning names).
- [ ] **Step 2:** Fix in all three languages, update `CLAIMS`. Run `npm test`. Commit `fix(safety): align actions and warning names with JMA and Cabinet Office`.

## Phase 3: Wording (one PR per language)

Each task uses the failure lists from Task 1 and Task 2. Each task keeps every `claimId` and changes no fact. A reviewer compares each changed string with its claim in the Task 4 to Task 6 tables.

### Task 7: English to STE (`fix/aditya/copy-ste`)

- [ ] **Step 1:** Re-enable the English rules in `copy-rules.test.ts` and the English half of `glossary.test.ts`. Run. Expected: FAIL with a list.
- [ ] **Step 2:** Rewrite each listed string: one instruction per sentence, active voice, simple tenses, glossary terms only, no "&" in titles ("Fractures and sprains").
- [ ] **Step 3:** Run `npm test`. Expected: PASS. Commit `fix(copy): English follows STE writing rules`.

### Task 8: Japanese to やさしい日本語 (`fix/aditya/copy-yasashii`)

- [ ] **Step 1:** Re-enable the Japanese length rule and the Japanese half of the glossary test. Run. Expected: FAIL.
- [ ] **Step 2:** Rewrite: short sentences, one idea each, です/ます, readings after hard terms (D-2), the 69 kanji-heavy strings first, 圧挫症候群 and 圧挫傷 unified to one term.
- [ ] **Step 3:** Add `lang="ja"` to the `.jp-sub` blocks (`index.html:759,765,771,777`).
- [ ] **Step 4:** Run `npm test`. Run the D-5 agent review; Aditya reads the result. Commit `fix(copy): Japanese follows やさしい日本語`.

### Task 9a: Indonesian, casual and polite (`fix/aditya/copy-indonesian`)

- [ ] **Step 1:** Re-enable the Indonesian pronoun rule and the Indonesian half of the glossary test. Run. Expected: FAIL with the 98 `Anda` locations.
- [ ] **Step 2:** Rewrite with the D-1 pronoun, EYD V spelling, short sentences, common words before loanwords (keep "CPR" and "AED", which Indonesians know).
- [ ] **Step 3:** Run `npm test`. Aditya reviews. Commit `fix(copy): Indonesian reads casual, polite and direct`.

## Phase 4: Fonts and animations

### Task 9: Fonts in every language (`fix/aditya/fonts-all-languages`)

**Files:**
- Modify: `index.html:29`, `public/404.html`, the 65 `'Press Start 2P', monospace` rules (move to one `--pixel-font` token in `css/variables.css`), `css/hero-arcade.css:107,398` (`Noto Serif JP` is used but never loaded)
- Create: `src/__tests__/fonts.test.ts`

- [ ] **Step 1: Baseline.** With Claude in Chrome on `http://localhost:5173/mamoru-guide/`, take screenshots of every route (`#/prepare`, `#/learn`, `#/plan`, `#/shelter`, `#/show`, `#/alerts`, home) in en, ja, id, day and night, at 390 px and 1280 px. Note each place where a fallback font shows, text overflows, or text is below 12 px.
- [ ] **Step 2: Write the failing test:** no CSS file contains `'Press Start 2P', monospace` directly (all use `var(--pixel-font)`); `--pixel-font` lists a Japanese-capable font before the generic family; every `font-family` name used in CSS is loaded in `index.html` or is a system font.
- [ ] **Step 3:** Run. Expected: FAIL.
- [ ] **Step 4:** Add `--pixel-font: 'Press Start 2P', 'DotGothic16', monospace` (D-3), load DotGothic16 in the same Google Fonts request, replace the 65 rules, fix `Noto Serif JP`. Raise pixel text below 10 px to 10 px or switch it to the rounded font.
- [ ] **Step 5:** Run `npm test`, then repeat the Step 1 screenshots. Expected: no fallback font, no overflow. Commit `fix(fonts): pixel and Japanese fonts read correctly in all three languages`.

### Task 10: Animations show correctly (`fix/aditya/animation-check`)

**Files:**
- Modify: `src/drill.ts:127-132`, `src/character/mascot.ts:135-146`
- Create: `src/__tests__/drill-motion.test.ts`, `docs/superpowers/specs/2026-11-21-animation-check.md`

- [ ] **Step 1:** List every animation: the 42 `@keyframes` (19 in `css/hero-arcade.css`) and the JS animations in `src/drill.ts`, `src/first-aid.ts`, `src/character/*`. One row each: where it plays, what triggers it, expected end state.
- [ ] **Step 2:** For each row, record a GIF with Claude in Chrome (`gif_creator`), day and night, 390 px and 1280 px. Mark: plays, ends in the correct state, no layout jump, no console error.
- [ ] **Step 3:** Turn on the OS "reduce motion" setting and check each row again: the animation stops or becomes a fade.
- [ ] **Step 4: Write the failing test:** with `motionAllowed()` false, `triggerShake()` adds no `.shaking` class and does not call `navigator.vibrate`. Run. Expected: FAIL.
- [ ] **Step 5:** Gate `triggerShake` with `motionAllowed()`. Pause the mascot timers on `visibilitychange`. Fix each broken row from Step 2 in its own commit.
- [ ] **Step 6:** Run `npm test`. Commit `fix(motion): drill respects reduced motion, mascot pauses when hidden`.

## Order of work

1. Merge PR #25 (Node 24).
2. Task 0 (audit) and Task 1 to Task 2 (guards), in parallel.
3. Aditya picks the audit numbers.
4. Task 3 to Task 6, with Task 5b after Task 5 (facts and authorship).
5. Task 7, Task 8, Task 9a (wording), one PR each.
6. Task 9 (fonts), then Task 10 (animations). Text is final by then, so the screenshots and GIFs stay valid.
7. Phase 0 fixes (comment cleanup, dead code).
