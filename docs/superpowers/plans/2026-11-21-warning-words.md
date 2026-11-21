# Warning Words Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Teach the Japanese warning words that people see on TV, phone alerts and signs, with a "Warnings" flashcard tab and a short "避難場所 vs 避難所" card in the shelter section, every word and action sourced.

**Architecture:** A verification record comes first, because a word without an official source is dropped. The glossary (`src/data/glossary.ts`) stays the one place for official names in ja, en and id. A new `WARNING_WORDS` list points at glossary entries by their Japanese and adds a romaji and a sourced "what to do" line with a `claimId`. The vocabulary module renders it as a sixth tab with the same flashcard. The shelter card is static HTML with a `data-claim` attribute, so the claims test can see it.

**Tech Stack:** TypeScript, Vite PWA, Vitest + jsdom. No new dependency.

**Spec:** This document, section "Requirements" (controller brief of 2026-11-21, decisions approved by Aditya). ROADMAP.md item 2, "Warning words".

**Base branch:** start from `main` after the content-quality PRs #28 to #33 merge. If they are not merged yet, branch from `fix/aditya/animation-check` and rebase later. Branch: `feat/aditya/warning-words`, one PR.

## Requirements

1. A new "Warnings" tab in the vocabulary section, next to the five current tabs. Each flashcard shows the Japanese word large, its reading, the official English and Indonesian term, and a one-line "what to do" from an official source.
2. Words (drop any that has no source): the five 警戒レベル and the city alert names 高齢者等避難, 避難指示, 緊急安全確保; the 2026 JMA level-named weather warnings (レベル４大雨危険警報 and its siblings, JMA official English); 津波注意報, 津波警報, 大津波警報; 緊急地震速報; Jアラート; 避難場所 and 避難所.
3. Data: new terms go into the glossary (glossary tests keep passing). A small `WARNING_WORDS` list references glossary entries and adds a sourced "what to do" line with a `claimId` in `CLAIMS`.
4. A short "避難場所 vs 避難所" card in the shelter section, sourced from the Cabinet Office and Kantei evacuation pages already in `SOURCES`.
5. Optional, last: 2 or 3 quiz questions about warning words, only if each answer is sourced.
6. A visual check list for the controller.

## Global Constraints

- Branch names `type/aditya/short-description`. Commit messages are one line, with no AI or Claude trailer.
- Never costs money. Never needs an account. No user data leaves the device. No new third-party runtime request.
- No new npm runtime dependency. A new devDependency only for a build-time script, with a one-line reason (this plan needs none).
- Owner rule, "erase uncertified information": every term, definition and action has an official source in `src/data/sources.ts` (`SOURCES` + `CLAIMS`, status `verified`, `changed` or `removed`) and a row in `docs/superpowers/specs/2026-11-21-warning-words-verification.md` with a Japanese quote and an English gist. Cut a partly supported line to the source. Remove an unsupported line. Japanese official sources first; a non-Japanese official source only when no Japanese one covers it.
- Every user-visible string is in en, ja and id with the same meaning. English: ASD-STE100, instructions max 20 words, descriptive sentences max 25 words, active voice. Japanese: やさしい日本語, です/ます, sentences max 40 characters, reading in parentheses after a hard kanji on first use, official disaster terms kept. Indonesian: casual-polite with `kamu`, never `Anda`, EYD V.
- Use the glossary terms in `src/data/glossary.ts` exactly. No em dash (U+2014) anywhere. Tips max 110 characters.
- Data objects use `*_en/*_ja/*_id` fields. HTML text uses `<span data-lang="en|ja|id">` like the rest of the section. New strings pass `copy-rules.test.ts` and `glossary.test.ts` (corpus: `src/__tests__/helpers/copy-corpus.ts`).
- UI: `--pixel-font` for labels and headings, `--pixel-text` for pixel sentences (`css/variables.css`); no text below 12px; WCAG AA in day and night mode; keyboard use and visible focus; tap targets 44px; works at 390px and desktop; respects `prefers-reduced-motion` and `motionAllowed()`.
- Offline: the Warnings tab and the shelter card work offline after the first visit (they ship in the existing vocab chunk and `index.html`, which `public/sw.js` precaches; add nothing outside the build).
- Tests first: each code task has a failing test, then the code, then `npm test`, `npx tsc --noEmit`, `npm run build`.
- Visual checks are done by the controller with Claude in Chrome after implementation (see "Visual checks" at the end). Implementers do not use a browser.
- After adding or changing app text, run `npm run fonts` and commit the regenerated subsets, or `scripts/__tests__/font-subset.test.ts` fails.

## Decisions

Controller decisions (approved by Aditya) are the Requirements above. These were made while planning:

| ID | Decision | Why |
|---|---|---|
| W-1 | JMA level names: the heavy-rain ladder only (レベル２大雨注意報, レベル３大雨警報, レベル４大雨危険警報, レベル５大雨特別警報). The 警戒レベル card says what the level number means. | The app already uses the heavy-rain example. Flood, landslide and storm surge follow the same pattern; 12 more cards teach nothing new. |
| W-2 | Level 1 is 早期注意情報 (JMA). Levels 3 to 5 each get two cards: the city name and the JMA heavy-rain name. | Requirement 2 asks for all five levels. 早期注意情報 is dropped if Task 1 finds no official en and id. |
| W-3 | The card shows the kana reading from the glossary and a romaji from `WARNING_WORDS.rom`. | The other tabs show romaji; the glossary holds kana only. Romaji is a transliteration, not a fact, so it needs no source. |
| W-4 | `WARNING_WORDS` names the glossary term `term`, not `ja`, and the action `instruction_en/ja/id`. | A bare `ja` would make the copy corpus see a ja-only entry and fail the parity test. `instruction_*` gets the 20-word instruction limit. |
| W-5 | Japanese level names in the glossary use full-width digits (レベル４), as JMA writes them. | The glossary check is a substring match. One digit width keeps it reliable. |
| W-6 | Indonesian for Jアラート is the proper name "J-Alert" when no Indonesian official source gives another form. | It is a system name, not a translation. The app already uses it. |
| W-7 | The shelter card carries `data-claim="shelter-site-vs-shelter"`; `sources.test.ts` reads `data-claim` attributes from `index.html` as used claims. | Today a claim used only by `index.html` fails "every claim is used". |
| W-8 | The current Danger card レベル４大雨危険警報 and the Places cards 避難場所 and 避難所 stay. | Removing them is out of scope; a repeat in a second tab does no harm. |
| W-9 | Quiz questions reuse the warning-word claims; `questions` in `src/quiz.ts` is exported for the test. | No new claims for the same fact. |

## Review Focus

1. A `term` that does not match a glossary `ja` exactly (half-width digit, missing 等): `vocabData` is built at import time, so the whole vocab section breaks. Task 2 tests that every term exists and that `warningVocab` throws a clear error.
2. A level name written レベル4 in one place and レベル４ in another escapes the glossary check: Task 2 adds a glossary test that rejects half-width digits after レベル.
3. Keyboard use reaches the sixth tab: End and ArrowRight on the tab bar, and Left/Right on a warnings card. Task 3 tests End on the tab bar.
4. The language changes while a warnings card shows: the "what to do" line must change with it. Task 3 renders all three `data-lang` spans and tests them.
5. A claim used only by the shelter card or the quiz fails "every claim is used": Task 2 moves the used-claim list into one helper, and Tasks 4 and 5 add to it.

---

### Task 1: Verify every warning word (record only)

**Files:**
- Create: `docs/superpowers/specs/2026-11-21-warning-words-verification.md`
- Modify: `src/data/sources.ts` (`SOURCES` only, if a new source is needed)

**Interfaces:**
- Produces: for each kept row, the final term (ja, kana reading, en, id), the source IDs, the `claimId`, and the final "what to do" line in en, ja and id. Task 2 copies these exactly.

This task changes no code, so it has no failing test. Task 2's tests pin its output. The existing `sources.test.ts` checks any new `SOURCES` URL.

- [ ] **Step 1:** Write the header like `2026-11-21-safety-verification.md`: date, scope, evidence (fresh downloads on the day), source rule, key (`keep` / `drop`).
- [ ] **Step 2:** Fill one row per word. Columns: Row, Term (JA), Reading, Official EN (source ID + quote), Official ID (source ID + quote), What to do (source ID, JA quote, EN gist), Verdict, Claim, Final line (en / ja / id). Candidates:

| Row | Term | Romaji | EN and ID from | What to do from | Claim |
|---|---|---|---|---|---|
| W1 | 警戒レベル | Keikai reberu | jma-nagasaki-levels-en, cao-evac-leaflet-en; id jma-nagasaki-levels-id | kantei-keihou (levels 1-2 from JMA, 3-5 from the city; leave by Level 4) | warn-alert-level |
| W2 | 早期注意情報 | Souki chuui jouhou | jma-multilingual | kantei-keihou, Level 1 | warn-level-1 |
| W3 | レベル２大雨注意報 | Reberu ni ooame chuuihou | jma-warning-2026-english; id jma-multilingual | kantei-keihou, Level 2 (check your hazard map and how you will evacuate) | warn-level-2-advisory |
| W4 | 高齢者等避難 | Koureisha tou hinan | glossary | kantei-keihou, Level 3 (safety row C5) | warn-level-3-elderly |
| W5 | レベル３大雨警報 | Reberu san ooame keihou | jma-warning-2026-english; id jma-multilingual | jma-warning-2026 (level number = same action) + kantei-keihou | warn-level-3-warning |
| W6 | 避難指示 | Hinan shiji | glossary | kantei-keihou, Level 4 (row B50) | warn-level-4-instruction |
| W7 | レベル４大雨危険警報 | Reberu yon ooame kiken keihou | jma-warning-2026-english; id jma-multilingual | as W5, Level 4 | warn-level-4-urgent |
| W8 | 緊急安全確保 | Kinkyuu anzen kakuho | glossary | kantei-keihou, Level 5 (row C7) | warn-level-5-safety |
| W9 | レベル５大雨特別警報 | Reberu go ooame tokubetsu keihou | jma-warning-2026-english; id jma-multilingual | as W5, Level 5 | warn-level-5-emergency |
| W10 | 津波注意報 | Tsunami chuuihou | glossary | jma-tsunami-info (row B49) | warn-tsunami-advisory |
| W11 | 津波警報 | Tsunami keihou | glossary | jma-tsunami-info (row B49) | warn-tsunami-warning |
| W12 | 大津波警報 | Oo tsunami keihou | glossary | jma-tsunami-info, kantei-tsunami | warn-tsunami-major |
| W13 | 緊急地震速報 | Kinkyuu jishin sokuhou | glossary | kantei-jishin (row B48: あわてずにまずは身の安全を確保) | warn-eew |
| W14 | Jアラート | Jei araato | fdma-jalert; id: Decision W-6 | fdma-jalert (row B47) | warn-jalert |
| W15 | 避難場所 | Hinan basho | glossary | kantei-hinan (指定緊急避難場所) | warn-evac-site |
| W16 | 避難所 | Hinanjo | glossary | kantei-hinan (指定避難所), cao-evacuation-points-en/id | warn-evac-shelter |
| S1 | Shelter card: 避難場所 vs 避難所 | | | kantei-hinan, cao-evacuation-points-en/id | shelter-site-vs-shelter |

- [ ] **Step 3:** For the JMA dictionary rows, download the xlsx from `jma-multilingual` into a new empty folder in the scratchpad. Read it with a script kept outside that folder (`python3 -I`). Quote the row number and the cell text.
- [ ] **Step 4:** Write the final lines. Where the alert card already has a verified line (B47, B48, B49, B50, C5, C7), reuse its en, ja and id text word for word, or a shorter cut of it. Keep each line to one or two sentences and max 20 English words. Do not name a glossary term in a line unless the en and id use that term too. Mark a row `drop` when any of en, id or the action has no official quote.
- [ ] **Step 5:** Add a Results line (kept, dropped) and a Sources table for every source ID the record uses. Add a `SOURCES` entry only for a new source.
- [ ] **Step 6:** Run `npm test`. Expected: PASS. Commit `docs: verify the warning words against JMA, Kantei and FDMA`.

### Task 2: Glossary terms, `WARNING_WORDS` and claims

**Files:**
- Create: `src/data/warning-words.ts`
- Create: `src/__tests__/warning-words.test.ts`
- Modify: `src/types.ts` (two optional `VocabItem` fields)
- Modify: `src/data/glossary.ts` (new terms from Task 1)
- Modify: `src/data/sources.ts` (`CLAIMS`: one claim per kept row)
- Modify: `src/__tests__/glossary.test.ts` (one new test)
- Modify: `src/__tests__/sources.test.ts` (one used-claims helper)
- Modify: any existing string that the glossary tests now list (expected: `index.html:779` Indonesian, if the official id for 警戒レベル is not "tingkat siaga")

**Interfaces:**
- Consumes: Task 1 kept rows.
- Produces, in `src/data/warning-words.ts`:

```ts
export interface WarningWord {
  /** Exact `ja` of a GLOSSARY entry. */
  term: string;
  /** Modified Hepburn with doubled vowels, like vocabData `rom` (no macrons). */
  rom: string;
  claimId: string;
  instruction_en: string;
  instruction_ja: string;
  instruction_id: string;
}
export const WARNING_WORDS: ReadonlyArray<WarningWord>; // Task 1 row order
export function warningVocab(words?: ReadonlyArray<WarningWord>): VocabItem[]; // default WARNING_WORDS
```

- `warningVocab` maps each word to `{ jp: g.ja, rom: w.rom, reading: g.reading, en: g.en, id: g.id, instruction: { en, ja, id } }`, where `g` is the glossary entry with `g.ja === w.term`. It throws `Error('No glossary term: <term>')` when none exists. This task adds the two optional `VocabItem` fields in `src/types.ts`; Task 3 renders them:

```ts
export interface VocabItem { jp: string; rom: string; en: string; id: string;
  reading?: string; instruction?: { en: string; ja: string; id: string } }
```

- Produces, in `sources.test.ts`: `function usedClaimIds(): string[]`, used by both "every claim that an app item uses is verified or changed" and "every claim is used by at least one item".

- [ ] **Step 1: Write the failing tests** in `src/__tests__/warning-words.test.ts`:

```ts
describe('warning words', () => {
  it('lists the kept words in order', () => {
    expect(WARNING_WORDS.map(w => w.term)).toEqual(['警戒レベル', '早期注意情報', 'レベル２大雨注意報', '高齢者等避難',
      'レベル３大雨警報', '避難指示', 'レベル４大雨危険警報', '緊急安全確保', 'レベル５大雨特別警報', '津波注意報',
      '津波警報', '大津波警報', '緊急地震速報', 'Jアラート', '避難場所', '避難所']); // minus Task 1 drops
  });
  it('points every word at a glossary term', () => {
    expect(WARNING_WORDS.filter(w => !GLOSSARY.some(g => g.ja === w.term)).map(w => w.term)).toEqual([]);
  });
  it('has a verified or changed claim for every word', () => {
    expect(WARNING_WORDS.filter(w => !['verified', 'changed'].includes(CLAIMS[w.claimId]?.status ?? '')).map(w => w.term)).toEqual([]);
  });
  it('writes romaji in ASCII letters', () => {
    expect(WARNING_WORDS.filter(w => !/^[A-Za-z][A-Za-z -]*$/.test(w.rom)).map(w => w.term)).toEqual([]);
  });
  it('builds one flashcard per word from the glossary', () => {
    const cards = warningVocab();
    expect(cards).toHaveLength(WARNING_WORDS.length);
    const g = GLOSSARY.find(t => t.ja === '避難指示')!;
    expect(cards.find(c => c.jp === '避難指示')).toMatchObject({ en: g.en, id: g.id, reading: g.reading });
  });
  it('names the missing term when a word has no glossary entry', () => {
    expect(() => warningVocab([{ ...WARNING_WORDS[0], term: 'レベル4大雨危険警報' }])).toThrow('No glossary term: レベル4大雨危険警報');
  });
});
```

In `glossary.test.ts` add:

```ts
it('writes the level number after レベル as a full-width digit (Decision W-5)', () => {
  expect(GLOSSARY.filter(t => /レベル[0-9]/.test(t.ja)).map(t => t.ja)).toEqual([]);
});
```

In `sources.test.ts`, replace the two inline used-id lists with `usedClaimIds()`, and add `...WARNING_WORDS.map(w => w.claimId)` to it.

- [ ] **Step 2:** Run `npx vitest run src/__tests__/warning-words.test.ts src/__tests__/glossary.test.ts src/__tests__/sources.test.ts`. Expected: FAIL, "Cannot find module '../data/warning-words'".
- [ ] **Step 3:** Add the new glossary terms (W1, W2, W3, W5, W7, W9, W14, as kept), each with a comment naming the en and id sources like the existing entries. Readings are kana only: spell digits in kana (レベル４大雨危険警報 → `レベルよんおおあめきけんけいほう`; Jアラート → `ジェイアラート`).
- [ ] **Step 4:** Add the claims, one per kept row: `{ sources: [...], status: 'verified', note: 'Warning words W<n>: <short JA quote>. <source short name>' }`.
- [ ] **Step 5:** Create `src/data/warning-words.ts` with the Task 1 lines.
- [ ] **Step 6:** Run `npm test`. Expected: PASS. If a glossary consistency test lists an existing string, change that string to the glossary term in all three languages, add the change to the Task 1 record, and run again.
- [ ] **Step 7:** Run `npx tsc --noEmit`. Expected: no output. Commit `feat(vocab): add sourced warning words to the glossary`.

### Task 3: Warnings tab

**Files:**
- Modify: `src/types.ts` (`VocabCategory` gets `'warnings'`)
- Modify: `src/data.ts` (`vocabData.warnings: warningVocab()`)
- Modify: `src/vocab.ts` (card template, `cardIndex`, `initVocab` category list)
- Modify: `index.html` (sixth tab button after Medical, sixth panel, in the `#vocab` section)
- Modify: `css/vocab.css` (`.flashcard-card.cat-warnings`, `.flashcard-reading`, `.flashcard-instruction`)
- Test: `src/__tests__/vocab-flashcard.test.ts`

**Interfaces:**
- Consumes: `warningVocab(): VocabItem[]` and the optional `VocabItem.reading` / `VocabItem.instruction` from Task 2.
- Produces: `VocabCategory = 'danger' | 'action' | 'places' | 'help' | 'medical' | 'warnings'`. DOM ids `vocabTabWarnings`, `vocabPanelWarnings`, `fcCounterWarnings`, `vocabFlashcardWarnings`.

- [ ] **Step 1: Write the failing tests** in a new `describe('warnings flashcard')`. Its `beforeEach` builds its own DOM: `<section id="vocab">` with a `.tab-bar` of six `.tab-btn[data-tab]` (danger first, warnings last), the six `.tab-content[data-group="vocab"]` panels with their ids, and the counter and card box for Danger and Warnings. Then it calls `initVocab()` and `switchTab('danger', 'vocab')`. `card(cat)` returns `document.getElementById('vocabFlashcard' + cat)!`; `tabBar` is `#vocab .tab-bar`; `tabs` are its `.tab-btn` elements. The card index is module state, so each test that needs card 1 calls `switchTab('warnings', 'vocab')` first (it resets the index).

```ts
it('shows the first warning word with its reading, terms and what to do', () => {
  switchTab('warnings', 'vocab');
  const w = WARNING_WORDS[0];
  const g = GLOSSARY.find(t => t.ja === w.term)!;
  const c = document.getElementById('vocabFlashcardWarnings')!;
  expect(c.className).toBe('flashcard-card cat-warnings');
  expect(c.querySelector('.flashcard-jp')!.textContent).toBe(w.term);
  expect(c.querySelector('.flashcard-reading')!.textContent).toBe(g.reading);
  expect(c.querySelector('.flashcard-reading')!.getAttribute('lang')).toBe('ja');
  expect(c.querySelector('.flashcard-romaji')!.textContent).toBe(w.rom);
  expect(c.textContent).toContain(g.en);
  expect(c.textContent).toContain(g.id);
  for (const l of ['en', 'ja', 'id'] as const)
    expect(c.querySelector(`.flashcard-instruction [data-lang="${l}"]`)!.textContent).toBe(w[`instruction_${l}`]);
  expect(document.getElementById('fcCounterWarnings')!.textContent).toBe(`1 / ${WARNING_WORDS.length}`);
});
it('Previous on the first warning word shows the last one', () => {
  switchTab('warnings', 'vocab');
  prevCard('warnings');
  expect(card('Warnings').querySelector('.flashcard-jp')!.textContent).toBe(WARNING_WORDS[WARNING_WORDS.length - 1].term);
});
it('End on the tab bar opens the Warnings tab', () => {
  tabs[0].focus();
  tabBar.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  expect(document.activeElement!.getAttribute('data-tab')).toBe('warnings');
  expect(document.getElementById('vocabPanelWarnings')!.classList.contains('active')).toBe(true);
});
it('a card from another tab has no reading or instruction row', () => {
  expect(card('Danger').querySelector('.flashcard-reading, .flashcard-instruction')).toBeNull();
});
```

Keep the existing danger tests unchanged.

- [ ] **Step 2:** Run `npx vitest run src/__tests__/vocab-flashcard.test.ts`. Expected: FAIL (no `cat-warnings` card).
- [ ] **Step 3:** In `renderFlashcard`, add `lang="ja"` to `.flashcard-jp`. When `v.reading` exists, render `<div class="flashcard-reading" lang="ja">` before `.flashcard-romaji`. When `v.instruction` exists, render `<p class="flashcard-instruction">` after `.flashcard-translations` with three `<span data-lang="en|ja|id">` (the `ja` span gets `lang="ja"`). The other categories render as today.
- [ ] **Step 4:** Add the tab and panel in `index.html`, copying the Medical markup. Label: ⚠️ `Warnings` / `警報（けいほう）` / `Peringatan`. Static counter text `1 / <count>`. Previous and Next buttons call `prevCard('warnings')` and `nextCard('warnings')`.
- [ ] **Step 5:** CSS: `.flashcard-card.cat-warnings { border-left-color: var(--motomachi-brick); }`; `.flashcard-reading` uses the `.flashcard-romaji` font and colour at 16px with `margin-bottom: 4px`; `.flashcard-instruction` is 15px, line-height 1.5, `max-width: 480px`, `margin: 20px auto 0`, left-aligned, inside a 2px `--card-border` top rule with 16px padding. No new animation, no new colour value.
- [ ] **Step 6:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: all PASS, build writes `dist/`. Commit `feat(vocab): add a Warnings flashcard tab`.

### Task 4: "避難場所 vs 避難所" card in the shelter section

**Files:**
- Modify: `index.html` (`#shelter`, between `.section-note` and `.shelter-actions`)
- Modify: `css/shelter-finder.css` (`.svs-card`, `.svs-col`, `.svs-term`)
- Modify: `src/__tests__/sources.test.ts` (`usedClaimIds()` reads `data-claim` from `index.html`)
- Modify: `src/data/sources.ts` (claim `shelter-site-vs-shelter`)
- Modify: `ROADMAP.md` (item 2, "Warning words": add "Done 2026-11-<day>" with the record path, like the Open decisions lines)
- Create: `src/__tests__/shelter-explainer.test.ts`

**Interfaces:**
- Consumes: Task 1 row S1 final lines; `usedClaimIds()` from Task 2.
- Produces: `<section id="shelter">` contains `<div class="svs-card" data-claim="shelter-site-vs-shelter">` with an `h3` title and two `.svs-col` blocks, each starting with `<span class="svs-term" lang="ja">`.

- [ ] **Step 1: Write the failing tests:**

```ts
const doc = new DOMParser().parseFromString(readFileSync(resolve(__dirname, '../../index.html'), 'utf8'), 'text/html');
const svs = doc.querySelector('#shelter .svs-card[data-claim="shelter-site-vs-shelter"]');
it('sits in the shelter section before the finder button', () => {
  expect(svs).not.toBeNull();
  expect(svs!.compareDocumentPosition(doc.getElementById('shelterFindBtn')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
it('names 避難場所 first and 避難所 second, marked as Japanese', () => {
  const terms = [...svs!.querySelectorAll('.svs-term')];
  expect(terms.map(t => t.textContent)).toEqual(['避難場所', '避難所']);
  expect(terms.every(t => t.getAttribute('lang') === 'ja')).toBe(true);
});
it('uses a verified or changed claim', () => {
  expect(['verified', 'changed']).toContain(CLAIMS['shelter-site-vs-shelter']?.status);
});
```

In `sources.test.ts`, add to `usedClaimIds()` every `data-claim` value in `index.html` (`/data-claim="([a-z0-9-]+)"/g`).
- [ ] **Step 2:** Run `npx vitest run src/__tests__/shelter-explainer.test.ts`. Expected: FAIL (`svs` is null).
- [ ] **Step 3:** Add the card with the S1 lines. Draft, cut to the Task 1 quotes:
  - Title: "Evacuation site or evacuation shelter?" / 「避難場所（ひなんばしょ）と避難所（ひなんじょ）のちがい」 / "Tempat evakuasi atau tempat pengungsian?"
  - 避難場所: "An evacuation site is a place to escape to from danger now. Each site is for some types of disaster. This finder shows these sites."
  - 避難所: "An evacuation shelter is a place to stay for a time when you cannot go home."
- [ ] **Step 4:** Add the claim (`sources` from S1). CSS: two columns from 720px up, one column below; `--card-bg`, `--card-border`; `.svs-term` 20px; the title uses `--pixel-font`; body text at 14px or more.
- [ ] **Step 5:** Update `ROADMAP.md`. Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: PASS. Commit `feat(shelter): explain evacuation site and evacuation shelter`.

### Task 5 (optional): Quiz questions about warning words

Do this task only when Task 1 kept the rows it needs. Skip a question whose answer has no quote.

**Files:**
- Modify: `src/quiz.ts` (`QuizQuestion` gets `claimId?: string`; `export const questions`; 2 or 3 new questions at the end)
- Modify: `src/__tests__/sources.test.ts` (`usedClaimIds()` adds quiz claim ids)
- Create: `src/__tests__/quiz-claims.test.ts`

**Interfaces:**
- Consumes: claims `warn-tsunami-advisory` (W10), `warn-level-3-elderly` (W4), `shelter-site-vs-shelter` (S1). No new claim (Decision W-9).

- [ ] **Step 1: Write the failing test:**

```ts
it('has 2 or 3 sourced warning-word questions', () => {
  const sourced = questions.filter(q => q.claimId);
  expect(sourced.length).toBeGreaterThanOrEqual(2);
  expect(sourced.length).toBeLessThanOrEqual(3);
  for (const q of sourced) expect(['verified', 'changed']).toContain(CLAIMS[q.claimId!].status);
});
```

- [ ] **Step 2:** Run `npx vitest run src/__tests__/quiz-claims.test.ts`. Expected: FAIL (`questions` is not exported).
- [ ] **Step 3:** Add the questions. The correct answer and the explanation repeat the claim's line. A wrong option must be wrong by the same source.
  - You are swimming. Your phone shows 津波注意報. Correct: get out of the water and leave the coast (W10).
  - The city issues レベル3 高齢者等避難. Correct: older people and people who need more time leave a danger area; other people get ready (W4).
  - Which place is for staying when you cannot go home? Correct: 避難所, evacuation shelter (S1).
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: PASS. Commit `feat(quiz): add sourced warning word questions`.

---

## Visual checks (controller, Claude in Chrome)

Check `#/prepare` (vocabulary) and `#/shelter` at 390px and 1280px, in en, ja and id, in day and night mode:

1. The vocab tab bar with six tabs wraps cleanly at 390px. No horizontal scroll. Each tab is at least 44px high.
2. Every warnings card: the long Japanese names (レベル５大雨特別警報) wrap inside the card and do not overflow. Long Indonesian terms ("peringatan bahaya tsunami skala besar", "Proses Evakuasi Lansia, dll.") fit.
3. The kana reading and the Japanese line use a Japanese font, not a fallback font. No text is below 12px.
4. The "what to do" line changes language with the language switch, with no reload.
5. Keyboard: Tab to the tab bar, End opens Warnings, the focus ring shows, Left and Right change cards.
6. The warnings border colour reads in day and night mode.
7. The shelter card: two columns at 1280px, one column at 390px. Text meets AA in day and night mode. The card is above the "Find Evacuation Sites" button.
8. With reduced motion on, the warnings card behaves like the other cards (no new animation).
9. Offline: visit once, go offline, reload. The Warnings tab and the shelter card still show.
10. If Task 5 ran: the new quiz questions show in all three languages, and the explanation matches the card line.
