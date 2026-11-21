# My Needs Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A foreign resident fills in allergies, medicines, food needs, languages and an emergency contact once, then shows a helper one full-screen card in Japanese, with their own language below.

**Architecture:** A `needs` group joins the existing v2 plan in the same localStorage key. `loadPlanV2` fills it in for plans saved before this change. A new wizard step (`src/needs-step.ts`) edits it in en, ja and id. A new module (`src/needs-card.ts`) builds the card with `textContent` only and opens it from the plan and from emergency mode. The preset lists (official allergens, food needs, languages, contact relations) live in `src/data/needs.ts`, and the allergen list has a recorded official source.

**Tech Stack:** TypeScript, Vite, Vitest + jsdom. No new dependency.

**Spec:** This document, section "Requirements" (ROADMAP.md idea 1, "My needs card"; controller decisions approved by the owner on 2026-11-21).

**Base branch:** The content-quality stack is in open PRs #28 to #33. Start from `main` after they merge. If they are not merged yet, branch from `fix/aditya/animation-check` and rebase later. Branch: `feat/aditya/my-needs-card` (Tasks 1 to 5), `feat/aditya/plan-wizard-indonesian` (Task 6).

## Requirements

1. Extend the plan model with a `needs` group: food allergies, other allergies (free text), medicines (free text), food needs, languages I speak, emergency contact (name, relation, phone), notes (free text). A storage migration keeps every existing saved plan.
2. Food allergy presets are the 消費者庁 特定原材料 list (the current list, with くるみ), with the official Japanese names. The source goes in SOURCES with a verification row. Other allergens are free text.
3. Food need presets are neutral and never inferred from nationality: halal, vegetarian, vegan, no pork, no beef, no alcohol, other (free text). Japanese labels in plain words. No stereotypes.
4. The needs step has en, ja and id. Indonesian for the whole wizard is a separate task.
5. "Show my needs" opens a full-screen card for a helper: Japanese first in large text (やさしい日本語, with readings), the user's language below, free text as typed. It opens from emergency mode and from the plan. It prints through `css/print.css`. User data goes in with `textContent` only.
6. Privacy: localStorage only; a visible shared-device note next to Save; a "Clear my needs" button with a confirmation that names what it deletes.
7. A visual check list for the controller.

## Global Constraints

- Branch names `type/aditya/short-description`; commit messages one line, no AI/Claude trailer.
- Never costs money; never needs an account; no user data leaves the device; no new third-party runtime request.
- No new npm runtime dependency. No new devDependency in this plan.
- Owner rule "erase uncertified information": every fact needs an official source in `src/data/sources.ts` (SOURCES + CLAIMS) and a row in a `docs/superpowers/specs/*-verification.md` record with a Japanese quote and an English gist. Japanese official sources first.
- Every user-visible string in en, ja, id with the same meaning. English ASD-STE100 (instruction max 20 words, descriptive max 25, active voice). Japanese やさしい日本語 (です/ます, sentences max 40 characters, reading in parentheses after a hard kanji on first use). Indonesian casual-polite with `kamu`, never `Anda`, EYD V; first person `saya` as in `src/show-this.ts`. Glossary terms from `src/data/glossary.ts` exactly. No em dash (U+2014). Aditya reviews the Indonesian.
- UI strings in `src/locales/{en,ja,id}.ts` (`t()`, `data-i18n`); data objects use `*_en/*_ja/*_id` fields. A single-language field must not end in `_en`, `_ja` or `_id` (the copy corpus would read it as a half-filled entry).
- UI: `--pixel-font` for labels and headings, `--pixel-text` for sentences; no text below 12px; WCAG AA in day and night; keyboard and visible focus; tap targets 44px; works at 390px and desktop; respects `prefers-reduced-motion`.
- Offline: the card works offline after the first visit (it is part of the Vite build, so `asset-manifest.json` precaches it).
- Privacy: personal data only through `src/storage.ts` / `src/plan-storage.ts`; a visible note where the user enters it.
- TDD: failing test, code, then `npm test`, `npx tsc --noEmit`, `npm run build`.
- Visual checks are for the controller (see "Visual check list"); implementers do not use a browser.

## Decisions

| ID | Decision | Why |
|---|---|---|
| N-1 | Keep `version: 2` and the key `mamoru-plan-v2`; add `needs` as a new group. `loadPlanV2` normalizes it. | An old cached app (service worker update window) still loads a v2 plan, and its autosave keeps the unknown `needs` group, because it saves the parsed object. A version bump would make the old app load an empty plan and then save over it. |
| N-2 | The migration does not copy `medical.medications`, `medical.conditions` or `profile.languages` into `needs`. | The card is shown to strangers. The user chooses what goes on it. `conditions` mixes conditions and allergies, so a copy would show a condition as an allergy. |
| N-3 | Food needs show the term only (ハラール, ベジタリアン, ビーガン) or a concrete line (豚肉を食べません). No definitions. | A definition of "vegetarian" is a term definition and needs a source. The user adds detail in "Other food needs". |
| N-4 | Language presets: the languages of the JMA multilingual dictionary (`jma-multilingual`, already in SOURCES), with Chinese as one item, plus "Easy Japanese" (やさしい日本語), plus free text. | A neutral, official list. The helper reads the Japanese language name, not the user's spelling. |
| N-5 | Contact relation is a select: family, friend, school, work, other. | The helper reads 家族 or 学校, not "Ibu". Name and phone stay free text. |
| N-6 | The needs step is step 7 of 8, just before Review. | No existing step index (`MEDICAL_STEP`, `WORKSHEET_ORDER`) changes, and the worksheet test that clicks the last dot still reaches Review. |
| N-7 | When the UI language is ja, the card shows Japanese only (no second line). | The second line would repeat the first. |
| N-8 | The phone number also becomes a `tel:` link; the href keeps only digits and `+`. | A helper can call with one tap. The text stays as typed. |

## Review Focus

1. The user types, then taps "Show my needs" within 1 second: the autosave has not run, so the card shows old data. The button saves first (Task 4 test `shows what was just typed`).
2. The user prints from the card on `#/plan`: the worksheet `beforeprint` handler adds `print-plan-only`, which hides the card. The worksheet handler skips while the card is open (Task 5 test `does not print the worksheet while the needs card is open`).
3. Storage from an older version, or edited by hand: `needs` missing, partly filled, wrong types, unknown allergen keys. Load fills and cleans it and never throws (Task 2 tests).
4. The old "Clear" button on Review now also deletes the needs card, without saying so. Its confirmation names the needs card (Task 4 test `plan clear confirmation names the needs card`).
5. Free text with markup, or a long text with no spaces: it shows as text and wraps at 390px (Task 3 test `shows markup as text`; visual check V-4).

---

### Task 1: Official allergen list and preset data

**Files:**
- Create: `src/data/needs.ts`
- Create: `src/__tests__/needs-data.test.ts`
- Create: `docs/superpowers/specs/<date of the check>-needs-verification.md`
- Modify: `src/plan-model.ts` (the two union types below), `src/data/sources.ts` (one SOURCE, one CLAIM)
- Modify: `src/__tests__/sources.test.ts` (add the allergen claim to `usedIds` and `used`)

**Interfaces:**
- Consumes: `FoodAllergen`, `DietNeed` types. Define them in `src/plan-model.ts` in this task (Task 2 uses them):
  `type FoodAllergen = 'ebi' | 'kani' | 'kurumi' | 'komugi' | 'soba' | 'tamago' | 'nyu' | 'rakkasei'`;
  `type DietNeed = 'halal' | 'vegetarian' | 'vegan' | 'no-pork' | 'no-beef' | 'no-alcohol'`.
- Produces (`src/data/needs.ts`):
  - `interface NeedOption { key: string; label_en: string; label_ja: string; label_id: string }`
  - `FOOD_ALLERGENS: readonly (NeedOption & { key: FoodAllergen; officialName: string })[]`
  - `FOOD_ALLERGENS_CLAIM = 'needs-food-allergens'`
  - `DIET_NEEDS: readonly (NeedOption & { key: DietNeed })[]`
  - `NEED_LANGUAGES: readonly NeedOption[]` (keys are BCP 47 codes, plus `'ja-easy'`)
  - `CONTACT_RELATIONS: readonly NeedOption[]` (keys `family`, `friend`, `school`, `work`, `other`)

- [ ] **Step 1: Check the source.** Open the 消費者庁 food allergy labeling page (candidate URL `https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/`). Copy the 特定原材料 list exactly. Expected on 2026-11-21: えび、かに、くるみ、小麦、そば、卵、乳、落花生（ピーナッツ）. If the page lists more items (for example カシューナッツ), add them to the type, the data and the test below. Do not add 特定原材料に準ずるもの.
- [ ] **Step 2: Write the verification record** with one row: claim "The mandatory allergen list is …", source ID `caa-allergen-labeling`, Japanese quote, English gist, verdict, date checked. Use the format of `docs/superpowers/specs/2026-11-21-remaining-verification.md`. Also record the JMA dictionary language columns used for N-4.
- [ ] **Step 3: Write the failing tests** in `src/__tests__/needs-data.test.ts`:

```ts
it('lists the official 特定原材料 in the official order', () =>
  expect(FOOD_ALLERGENS.map(a => a.officialName)).toEqual(
    ['えび', 'かに', 'くるみ', '小麦', 'そば', '卵', '乳', '落花生（ピーナッツ）']));
it('shows each official name, with only hiragana readings added', () => {
  for (const a of FOOD_ALLERGENS) expect(a.label_ja.replace(/（[ぁ-ゖ]+）/g, '')).toBe(a.officialName);
});
it('records a verified source for the allergen list', () => {
  const c = CLAIMS[FOOD_ALLERGENS_CLAIM];
  expect(c.status).toBe('verified');
  expect(c.sources).toContain('caa-allergen-labeling');
  expect(SOURCES['caa-allergen-labeling'].url).toMatch(/^https:\/\/www\.caa\.go\.jp\//);
});
it('has the six neutral food needs', () =>
  expect(DIET_NEEDS.map(d => d.key)).toEqual(['halal', 'vegetarian', 'vegan', 'no-pork', 'no-beef', 'no-alcohol']));
it('never ties a preset to a nationality', () => {
  const src = readFileSync(resolve(__dirname, '../data/needs.ts'), 'utf8');
  expect(src).not.toMatch(/nationality|country/i);
});
it('offers easy Japanese and has unique keys in every list', () => {
  expect(NEED_LANGUAGES.map(l => l.key)).toContain('ja-easy');
  for (const list of [FOOD_ALLERGENS, DIET_NEEDS, NEED_LANGUAGES, CONTACT_RELATIONS])
    expect(new Set(list.map(o => o.key)).size).toBe(list.length);
});
```

- [ ] **Step 4:** Run `npx vitest run src/__tests__/needs-data.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 5: Add the data.** Pinned labels (en / ja / id):

| key | label_en | label_ja | label_id |
|---|---|---|---|
| ebi | Shrimp | えび | Udang |
| kani | Crab | かに | Kepiting |
| kurumi | Walnut | くるみ | Kenari (walnut) |
| komugi | Wheat | 小麦（こむぎ） | Gandum |
| soba | Buckwheat (soba) | そば | Soba (buckwheat) |
| tamago | Egg | 卵（たまご） | Telur |
| nyu | Milk | 乳（にゅう） | Susu |
| rakkasei | Peanut | 落花生（らっかせい）（ピーナッツ） | Kacang tanah |
| halal | Halal food only | ハラールの食べ物だけ食べます | Hanya makanan halal |
| vegetarian | Vegetarian | ベジタリアンです | Vegetarian |
| vegan | Vegan | ビーガンです | Vegan |
| no-pork | No pork | 豚肉（ぶたにく）を食べません | Tidak makan daging babi |
| no-beef | No beef | 牛肉（ぎゅうにく）を食べません | Tidak makan daging sapi |
| no-alcohol | No alcohol | アルコールをとりません | Tanpa alkohol |
| ja-easy | Easy Japanese | やさしい日本語ならわかります | Bahasa Jepang sederhana |
| family / friend / school / work / other | Family / Friend / School / Work / Other | 家族（かぞく） / 友（とも）だち / 学校（がっこう） / 会社（かいしゃ） / その他（ほか） | Keluarga / Teman / Sekolah / Kantor / Lainnya |

  `NEED_LANGUAGES`: one entry per language column in the JMA dictionary (Chinese once), `label_ja` as the Japanese language name with a reading for kanji (英語（えいご）), then `ja-easy` last. Add `caa-allergen-labeling` to SOURCES and `needs-food-allergens` to CLAIMS (status `verified`, note with the quote). In `sources.test.ts`, add `FOOD_ALLERGENS_CLAIM` to both `usedIds` and `used`.
- [ ] **Step 6:** Run `npm test`. Expected: PASS, including `copy-rules` and `glossary`.
- [ ] **Step 7:** Commit `feat(needs): add the official allergen list and needs presets`.

### Task 2: `needs` group in the plan model and storage

**Files:**
- Modify: `src/plan-model.ts`, `src/plan-storage.ts`, `src/storage.ts:23-24` (doc comment: the v2 plan now holds the needs group)
- Test: `src/__tests__/plan-storage.test.ts`

**Interfaces:**
- Consumes: `FOOD_ALLERGENS`, `DIET_NEEDS`, `NEED_LANGUAGES`, `CONTACT_RELATIONS` (Task 1).
- Produces (`src/plan-model.ts`):
  `interface PlanNeeds { foodAllergies: FoodAllergen[]; otherAllergies: string; medicines: string; diet: DietNeed[]; dietOther: string; languages: string[]; languagesOther: string; contactName: string; contactRelation: string; contactPhone: string; notes: string }`;
  `EmergencyPlan.needs: PlanNeeds`; `emptyNeeds(): PlanNeeds` (empty strings and arrays); `hasNeeds(n: PlanNeeds): boolean` (true when any array is non-empty or any string has non-space text); `emptyPlan()` includes `needs: emptyNeeds()`.
- Produces (`src/plan-storage.ts`): `normalizeNeeds(raw: unknown): PlanNeeds`. `loadPlanV2()` returns `{ ...parsed, needs: normalizeNeeds(parsed.needs) }`.

- [ ] **Step 1: Write the failing tests** in a new `describe('needs group')`:

```ts
it('adds an empty needs group to a plan saved before this change', () => {
  const old = { ...emptyPlan(), profile: { ...emptyPlan().profile, name: 'Aditya' } } as Partial<EmergencyPlan>;
  delete old.needs;
  localStorage.setItem('mamoru-plan-v2', JSON.stringify(old));
  const p = loadPlanV2();
  expect(p.profile.name).toBe('Aditya');
  expect(p.needs).toEqual(emptyNeeds());
});
it('keeps known needs and drops unknown keys and wrong types', () => {
  localStorage.setItem('mamoru-plan-v2', JSON.stringify({ ...emptyPlan(), needs: {
    foodAllergies: ['soba', 'durian', 7], diet: 'halal', languages: ['id', 'xx'],
    medicines: 'Insulin', notes: 42, contactRelation: 'boss' } }));
  const n = loadPlanV2().needs;
  expect(n.foodAllergies).toEqual(['soba']);
  expect(n.diet).toEqual([]);
  expect(n.languages).toEqual(['id']);
  expect(n.medicines).toBe('Insulin');
  expect(n.notes).toBe('');
  expect(n.contactRelation).toBe('');
});
it('round-trips every needs field', () => { /* set all 11 fields, save, load, toEqual */ });
it('hasNeeds is false for emptyNeeds and for spaces only, true for one ticked allergen', () => {
  expect(hasNeeds(emptyNeeds())).toBe(false);
  expect(hasNeeds({ ...emptyNeeds(), notes: '  ' })).toBe(false);
  expect(hasNeeds({ ...emptyNeeds(), foodAllergies: ['tamago'] })).toBe(true);
});
it('migrateV1ToV2 leaves needs empty (Decision N-2)', () => {
  localStorage.setItem('mamoru-emergency-plan', JSON.stringify({ medications: 'Ventolin', languages: 'English' }));
  expect(migrateV1ToV2()!.needs).toEqual(emptyNeeds());
});
```

- [ ] **Step 2:** Run `npx vitest run src/__tests__/plan-storage.test.ts`. Expected: FAIL (`emptyNeeds` not exported).
- [ ] **Step 3:** Implement the types, `emptyNeeds`, `hasNeeds`, `normalizeNeeds` and the `loadPlanV2` change. Arrays keep only strings that are keys of the matching preset list, without duplicates. `contactRelation` keeps only a `CONTACT_RELATIONS` key. A non-object `raw` gives `emptyNeeds()`.
- [ ] **Step 4:** Run `npm test` and `npx tsc --noEmit`. Expected: PASS (the existing wrong-version and corrupt-JSON tests still pass).
- [ ] **Step 5:** Commit `feat(needs): add the needs group to the saved plan`.

### Task 3: The "Show my needs" card

**Files:**
- Create: `src/needs-card.ts`, `css/needs-card.css` (linked in `index.html` after `css/plan-wizard.css`)
- Modify: `src/locales/{en,ja,id}.ts` (`needs.card.*` keys)
- Test: `src/__tests__/needs-card.test.ts`

**Interfaces:**
- Consumes: `PlanNeeds`, `hasNeeds`, `loadPlanV2`, the Task 1 lists, `t(key, lang)`, `currentLang`, `trapFocus` (`src/focus-trap.ts`).
- Produces:
  - `buildNeedsCard(needs: PlanNeeds, lang: Language): HTMLElement`. Returns `article.needs-card`. Each filled section is `section.needs-sec[data-sec="allergies|otherAllergies|medicines|diet|languages|contact|notes"]`. Japanese text is in `.needs-ja` elements with `lang="ja"`; the user's language is in `.needs-sub` elements with `lang` set; free text is in `.needs-free`. Empty sections are left out.
  - `showNeedsCard(): void`: loads the plan, opens `div.needs-card-overlay[role=dialog][aria-modal=true]` on `document.body`, sets `body.style.overflow = 'hidden'`, traps focus, focuses Close.
  - `closeNeedsCard(): void`: removes the overlay, releases the trap, restores overflow and focus.

  Card copy (`needs.card.*` keys; the ja value is the large line, `t(key, lang)` is the line below):

| key | ja | en | id |
|---|---|---|---|
| title | わたしに必要（ひつよう）なこと | What I need | Yang saya butuhkan |
| lead | わたしは日本語がよくわかりません。このカードを読（よ）んでください。 | I do not understand Japanese well. Please read this card. | Saya kurang paham bahasa Jepang. Tolong baca kartu ini. |
| allergies | アレルギーがあります。これを食べられません。 | I have allergies. I cannot eat these. | Saya punya alergi. Saya tidak bisa makan ini. |
| otherAllergies | ほかのアレルギー | Other allergies | Alergi lain |
| medicines | 使（つか）っている薬（くすり） | Medicines I use | Obat yang saya pakai |
| diet | 食べ物で気をつけること | My food needs | Kebutuhan makanan saya |
| languages | 話（はな）せることば | Languages I speak | Bahasa yang saya bisa |
| contact | 緊急（きんきゅう）連絡先（れんらくさき）。この番号に電話してください。 | Emergency contact. Please call this number. | Kontak darurat. Tolong hubungi nomor ini. |
| notes | メモ | Notes | Catatan |
| close / print | 閉（と）じる / 印刷（いんさつ） | Close / Print | Tutup / Cetak |
| empty | (write under the copy rules) | Your needs card is empty. Fill in the "My needs card" step in My Plan. | (write under the copy rules) |

- [ ] **Step 1: Write the failing tests:**

```ts
const full = (): PlanNeeds => ({ ...emptyNeeds(), foodAllergies: ['soba', 'rakkasei'], otherAllergies: 'Kiwi',
  medicines: 'Insulin 10u', diet: ['halal'], languages: ['id', 'ja-easy'], contactName: 'Budi',
  contactRelation: 'friend', contactPhone: '080-1234-5678', notes: 'Line 1\nLine 2' });

it('puts Japanese first and the user language below', () => {
  const sec = buildNeedsCard(full(), 'id').querySelector('[data-sec="allergies"]')!;
  const lines = sec.querySelectorAll('.needs-ja, .needs-sub');
  expect(lines[0].getAttribute('lang')).toBe('ja');
  expect(lines[1].textContent).toBe(t('needs.card.allergies', 'id'));
  expect(sec.textContent).toContain('そば');
  expect(sec.textContent).toContain('Kacang tanah');
});
it('shows Japanese only when the UI language is Japanese (N-7)', () =>
  expect(buildNeedsCard(full(), 'ja').querySelectorAll('.needs-sub').length).toBe(0));
it('shows free text exactly as typed', () =>
  expect(buildNeedsCard(full(), 'en').querySelector('[data-sec="notes"] .needs-free')!.textContent).toBe('Line 1\nLine 2'));
it('shows markup as text', () => {
  const card = buildNeedsCard({ ...emptyNeeds(), notes: '<img src=x onerror=alert(1)>' }, 'en');
  expect(card.querySelector('img')).toBeNull();
  expect(card.textContent).toContain('<img src=x onerror=alert(1)>');
});
it('links the phone with digits and plus only (N-8)', () => {
  const a = buildNeedsCard({ ...full(), contactPhone: '+81 80-1234"x' }, 'en').querySelector('a')!;
  expect(a.getAttribute('href')).toBe('tel:+81801234');
  expect(a.textContent).toBe('+81 80-1234"x');
});
it('leaves out empty sections and shows the empty note for an empty card', () => {
  expect(buildNeedsCard({ ...emptyNeeds(), medicines: 'X' }, 'en').querySelectorAll('.needs-sec').length).toBe(1);
  expect(buildNeedsCard(emptyNeeds(), 'en').textContent).toContain(t('needs.card.empty', 'en'));
});
it('opens as a modal dialog, closes on Escape and gives focus back', () => { /* save plan, focus a button, showNeedsCard(), expect overlay + aria-modal + focus on Close; dispatch Escape; overlay gone, focus back, body.style.overflow === '' */ });
it('never uses innerHTML', () =>
  expect(readFileSync(resolve(__dirname, '../needs-card.ts'), 'utf8')).not.toMatch(/innerHTML|insertAdjacentHTML/));
```

- [ ] **Step 2:** Run `npx vitest run src/__tests__/needs-card.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3:** Implement `buildNeedsCard`, `showNeedsCard`, `closeNeedsCard` and the `needs.card.*` keys. CSS: the overlay fills the viewport and scrolls (`overflow-y: auto`); `.needs-ja` uses `--pixel-text` at `clamp(1.5rem, 6vw, 2.25rem)`; `.needs-sub` at 1rem or more; `.needs-free` has `white-space: pre-wrap; overflow-wrap: anywhere`; Close and Print are 44px high; colours from existing tokens in day and night.
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`. Expected: PASS.
- [ ] **Step 5:** Commit `feat(needs): add the full-screen needs card`.

### Task 4: The needs step in the plan wizard

**Files:**
- Create: `src/needs-step.ts`
- Modify: `src/emergency-plan.ts` (step count, `goToStep`, review actions, `clearPlan` confirm), `src/locales/{en,ja,id}.ts` (`needs.*` form keys), `css/plan-wizard.css` (checkbox grid)
- Test: `src/__tests__/needs-step.test.ts`

**Interfaces:**
- Consumes: `PlanNeeds`, `emptyNeeds`, the Task 1 lists, `showNeedsCard` (Task 3).
- Produces:
  - `renderNeedsStep(needs: PlanNeeds, on: { change(): void; save(): void; show(): void; print(): void; clear(): void }): HTMLElement`. Inputs carry `data-need="<field>"` (not `data-path`, so the wizard's `handleInput` ignores them). Checkbox groups are `fieldset` + `legend`; each preset is a `label` with a checkbox and three `span[data-lang]` texts. Labels use `data-i18n`, so a language change updates them.
  - `clearNeedsConfirmText(): string` returns `t('needs.clear.confirm')`.
  - In `emergency-plan.ts`: `NEEDS_STEP = STEPS.length` (6), `REVIEW_STEP = STEPS.length + 1`, `TOTAL_STEPS = STEPS.length + 2`. `show` and the new Review button "Show my needs" call `flushSave()` (clear the timer, `savePlanV2(plan)`, no toast) before `showNeedsCard()`. `clear` asks `confirm(clearNeedsConfirmText())`, then sets `plan.needs = emptyNeeds()`, saves, re-renders the step and shows a toast.

  Form keys (en pinned; write ja and id under the copy rules): `needs.step.title` "🧾 My needs card"; `needs.step.intro` "Fill in what a helper must know. Mamoru shows it on one card in Japanese."; `needs.food` "Food allergies"; `needs.food.hint` "This is the official Japanese list of allergens. Write other allergies below."; `needs.otherAllergies` "Other allergies"; `needs.medicines` "Medicines"; `needs.diet` "Food needs"; `needs.dietOther` "Other food needs"; `needs.languages` "Languages I speak"; `needs.languagesOther` "Other languages"; `needs.contact` "Emergency contact"; `needs.contactName` "Name"; `needs.contactRelation` "Relation"; `needs.contactPhone` "Phone number"; `needs.notes` "Notes"; `needs.privacy` "Mamoru keeps this information only on this device. Other people who use this device can see it. On a shared device, clear it when you finish."; `needs.btn.save` "💾 Save"; `needs.btn.show` "🆘 Show my needs"; `needs.btn.print` "🖨️ Print my needs card"; `needs.btn.clear` "🗑️ Clear my needs"; `needs.clear.confirm` "Delete your needs card? This deletes your food allergies, other allergies, medicines, food needs, languages I speak, emergency contact and notes. The rest of your plan stays. You cannot undo this."; `needs.toast.saved` "Needs card saved"; `needs.toast.cleared` "Needs card cleared".

- [ ] **Step 1: Write the failing tests** (start the wizard as `plan-worksheet.test.ts` does, then click dot 7):

```ts
it('is step 7 of 8, and Review is still last', () => {
  start(); dot(6).click();
  expect(document.querySelector('.wizard-step-counter')!.textContent).toBe('7 / 8');
  expect(document.querySelectorAll('fieldset').length).toBeGreaterThanOrEqual(3);
});
it('has no food need or language ticked for a new plan', () =>
  { start(); dot(6).click(); expect(document.querySelectorAll('input[type=checkbox]:checked').length).toBe(0); });
it('saves a ticked allergen and typed medicines', () => { /* tick soba, type medicines, click save; loadPlanV2().needs.foodAllergies === ['soba'] */ });
it('shows the shared-device note next to Save', () => {
  start(); dot(6).click();
  const save = button(t('needs.btn.save'));
  expect(save.closest('.needs-actions')!.textContent).toContain(t('needs.privacy'));
});
it('has every label in Indonesian when the language is id', () => {
  setLang('id'); start(); dot(6).click();
  expect(document.querySelector('legend')!.textContent).toBe(t('needs.food', 'id'));
});
it('shows what was just typed', () => { /* type notes, click show at once (no timer advance); overlay text contains the notes */ });
it('names every deleted field in the clear confirmation', () => {
  for (const k of ['needs.food', 'needs.otherAllergies', 'needs.medicines', 'needs.diet', 'needs.languages', 'needs.contact', 'needs.notes'])
    expect(clearNeedsConfirmText().toLowerCase()).toContain(t(k).toLowerCase());
});
it('clears only the needs after confirmation', () => { /* confirm=vi.fn(()=>true); click clear; needs === emptyNeeds(); profile.name kept */ });
it('keeps the needs when the user cancels', () => { /* confirm=vi.fn(()=>false); needs unchanged */ });
it('plan clear confirmation names the needs card', () => { /* spy confirm on clearPlan(); message contains 'needs card' */ });
```

  The confirm test pins wording per language: each `needs.clear.confirm` value contains the same nouns as the field label keys in that language. Run it for en, ja and id.
- [ ] **Step 2:** Run `npx vitest run src/__tests__/needs-step.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement `renderNeedsStep`, the wizard changes and the keys. Text fields use `autocomplete="off"`; the phone input is `type="tel"`. The `clearPlan` confirm gets one sentence in each language: "This also deletes your needs card."
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`. Expected: PASS, including `plan-worksheet.test.ts` unchanged.
- [ ] **Step 5:** Commit `feat(needs): add the needs step to My Plan`.

### Task 5: Emergency mode entry and printing

**Files:**
- Modify: `index.html:479-495` (a fourth card in `.em-grid-secondary`), `css/emergency-mode.css:120-122` (two columns at desktop for four cards), `src/main.ts` (bind it), `src/needs-card.ts`, `src/emergency-plan.ts` (`beforeprint` handler), `css/print.css`, `src/locales/{en,ja,id}.ts` (`em.needs.title` "Show My Needs", `em.needs.desc` "Allergies, medicines, food, contact")
- Test: `src/__tests__/needs-card.test.ts`, `src/__tests__/plan-worksheet.test.ts`

**Interfaces:**
- Consumes: `showNeedsCard` (Task 3), the `print` callback slot of `renderNeedsStep` (Task 4).
- Produces: `printNeedsCard(): void` (opens the card if it is closed, adds `body.print-needs-only`, calls `window.print()`); `initNeedsCard(): void` (runs once even if called again; binds `#emNeedsBtn`, adds `beforeprint` (adds `print-needs-only` while the overlay is open) and `afterprint` (removes it)). The emergency card is `<button type="button" id="emNeedsBtn" class="em-card em-card-needs">` with `data-i18n` title and description.

- [ ] **Step 1: Write the failing tests:**

```ts
it('opens the card from emergency mode', () => {
  document.body.innerHTML = '<button id="emNeedsBtn"></button>';
  initNeedsCard(); document.getElementById('emNeedsBtn')!.click();
  expect(document.querySelector('.needs-card-overlay')).not.toBeNull();
});
it('prints only the needs card, then puts the page back', () => {
  window.print = vi.fn(); initNeedsCard(); printNeedsCard();
  expect(document.body.classList.contains('print-needs-only')).toBe(true);
  expect(window.print).toHaveBeenCalled();
  window.dispatchEvent(new Event('afterprint'));
  expect(document.body.classList.contains('print-needs-only')).toBe(false);
});
// plan-worksheet.test.ts
it('does not print the worksheet while the needs card is open', () => {
  start(); showNeedsCard(); window.dispatchEvent(new Event('beforeprint'));
  expect(sheet()).toBeNull();
});
// print.css read as text
it('print.css shows only the needs card in needs print mode', () => {
  expect(css).toMatch(/body\.print-needs-only\s*>\s*:not\(\.needs-card-overlay\)\s*\{\s*display:\s*none/);
});
```

- [ ] **Step 2:** Run `npx vitest run src/__tests__/needs-card.test.ts src/__tests__/plan-worksheet.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement. The worksheet `beforeprint` handler returns early when `.needs-card-overlay` exists. Print CSS: overlay `position: static`, white background, black text, the `.ws` system font stack, Japanese lines 20pt or more, buttons hidden, `break-inside: avoid` on sections.
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: PASS; the build lists the needs-card chunk in `dist/asset-manifest.json` (`offline.test.ts` passes).
- [ ] **Step 5:** Commit `feat(needs): open the needs card from emergency mode and print it`.

### Task 6: Indonesian for the whole plan wizard (separate PR, optional)

The current wizard shows "English ・ 日本語" labels. This task shows "<user language> ・ 日本語" in the form. The worksheet and Show My Plan keep "English ・ 日本語", because rescuers read them.

**Files:**
- Modify: `src/emergency-plan.ts` (`FieldDef`, `StepDef`, the three option lists, the review empty text), `src/lang.ts` (`setLang` dispatches `document` event `mamoru:langchange`), `index.html:1103-1107` (the section note says the labels are in English and Japanese)
- Test: `src/__tests__/plan-worksheet.test.ts` (new `describe('wizard languages')`)

**Interfaces:**
- Produces: `FieldDef` and `StepDef` get `label_en`, `label_ja`, `label_id` (replace `label` / `title`), and `placeholder_en`, `placeholder_ja`, `placeholder_id`; `FieldOption` gets `label_en`, `label_ja`, `label_id`. `formLabel(x)` returns `label_ja` when the language is ja, else `` `${label_<lang>} ・ ${label_ja}` ``. `sheetLabel(x)` returns `` `${label_en} ・ ${label_ja}` `` (used by `buildWorksheet` and `renderReview`, so printed text does not change).

- [ ] **Step 1: Write the failing tests:** with `setLang('id')`, step 1's first label is `Nama Lengkap ・ 氏名`; with `setLang('ja')` it is `氏名`; the printed worksheet still contains `Full Name ・ 氏名` in every language; after `setLang('id')` on step 1, the label text changes without a click (the wizard listens for `mamoru:langchange` and calls `goToStep(currentStep)`).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Move every label, placeholder and option into the triples. The copy corpus now reads them, so `copy-rules` and `glossary` apply (for example 避難場所 needs "evacuation site" and "tempat evakuasi"). Update the section note in three languages.
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: PASS. Aditya reviews the Indonesian.
- [ ] **Step 5:** Commit `feat(plan): show the plan wizard in Indonesian`.

## Visual check list (controller, Claude in Chrome, after Task 5 and again after Task 6)

- V-1: `#/plan`, step 7, at 390px and 1280px, in en, ja and id, day and night: checkbox labels wrap, no horizontal scroll, tap targets 44px, the privacy note sits next to Save.
- V-2: The card from step 7 and from `#/emergency`, at 390px, in en, ja and id: the Japanese line is large and first, the second line is the UI language (none in ja), the readings show in parentheses, Close is reachable without scrolling on an empty card.
- V-3: `#/emergency` at 390px and 1280px: four secondary cards, no orphan card, equal heights.
- V-4: Notes of 600 characters with no spaces, and a 10-line medicine list: text wraps, the overlay scrolls, Close stays reachable.
- V-5: Print preview from the card on `#/plan` and on `#/emergency`: only the card prints, black on white, Japanese 20pt or more, no buttons, fits one A4 page for the `full()` test data.
- V-6: Keyboard only: Tab stays in the card, Escape closes it, focus goes back to the button. Focus rings show in day and night.
- V-7: Offline: load once, go offline in DevTools, reload, open the card from `#/emergency`.
