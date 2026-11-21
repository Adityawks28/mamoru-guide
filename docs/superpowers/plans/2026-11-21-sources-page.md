# Sources Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Sources and checks" section that shows how the guide checks facts and lists every official source in use, grouped by area, reachable from Learn and from a "See the sources" link on the first aid cards, the alerts card, the typhoon panel and the contacts.

**Architecture:** Each source in `src/data/sources.ts` gets an `area` field. A pure module (`src/data/source-groups.ts`) picks the sources in use and groups them. A DOM module (`src/sources-page.ts`) renders the list. A small loader in the first-load bundle imports that module with `import()` when the `learn` or `sources` route opens, so the source data is a lazy chunk that the service worker still precaches from `asset-manifest.json`. The router learns one parameter form, `#/sources/<area>`, for the topic links.

**Tech Stack:** TypeScript, Vite 6, Vitest + jsdom. No new dependency.

**Spec:** This document, section "Requirements" (controller brief of 2026-11-21, approved by the owner). Read with `README.md`, `ROADMAP.md` ("People trust what it says"; idea 5 "Sources and Review page") and the four records `docs/superpowers/specs/2026-11-21-{medical,history,safety,remaining}-verification.md`.

**Base branch:** start from `main` after PRs #28 to #33 merge. If they are not merged yet, branch `feat/aditya/sources-page` from `fix/aditya/animation-check` and rebase later. The counts in this plan are from `fix/aditya/animation-check` at `7b91c88`: 118 sources, 97 claims (72 changed, 20 verified, 5 removed). If `main` differs after the merge, recount with Task 1 Step 1 and update the pinned numbers; the area rules stay.

## Requirements

1. A "Sources and checks" section on the Learn route, after About, with its own chip. A "See the sources" link on each first aid card, the alerts card, the typhoon panel and the contacts section opens the section filtered to that topic.
2. Content: a "How this guide checks facts" text (only information that an official source certifies; the date of the last check; no medical professional reviewed the medical steps). Then the sources grouped by area (Medical, History, Safety and alerts, Contacts, Language and terms). Each source shows publisher, title (a link that opens in a new tab with `rel="noopener noreferrer"`) and the date checked. Titles stay in their original language. Labels and group names are translated.
3. Data: every source has an area (tested). The source data loads as a lazy chunk when the section opens; the first load does not carry it; the chunk is precached for offline use.
4. Only sources used by at least one non-removed claim, by the glossary, or by a verification record appear (tested).
5. The app makes no automatic external request. A source page opens only when the user taps its title.
6. A visual check list for the controller.

## Global Constraints

- Branch `feat/aditya/sources-page`. Commit messages: one line, no AI or Claude trailer.
- Never costs money; never needs an account; no user data leaves the device; no new third-party runtime request.
- No new npm runtime dependency. No new devDependency is needed for this plan.
- Owner rule "erase uncertified information": this plan adds no fact. It shows the existing registry. The how-text describes the method only.
- Every user-visible string in en, ja, id with the same meaning. English ASD-STE100 (instructions max 20 words, descriptive max 25, active voice). Japanese やさしい日本語 (です/ます, sentences max 40 characters, reading in parentheses after a hard kanji on first use). Indonesian casual-polite with `kamu`, never `Anda`, EYD V. Glossary terms exactly as in `src/data/glossary.ts`. No em dash (U+2014). The copy below already passes these rules; do not reword it.
- UI strings live in `src/locales/{en,ja,id}.ts` and reach the page through `data-i18n` (`applyTranslations`, `t()` in `src/i18n.ts`). New strings must pass `copy-rules.test.ts`, `glossary.test.ts` and `i18n.test.ts`.
- UI: `--pixel-font` for labels and headings, `--pixel-text` for sentences (`css/variables.css`); no text below 12px; sentences in `--pixel-text` at 14px or more; WCAG AA in day and night mode (use `--text` and `--text-muted`); keyboard use with a visible focus ring (do not override `:focus-visible` in `css/base.css`); tap targets 44px; works at 390px and desktop; no new animation.
- Offline: the section works offline after the first visit (`public/sw.js` precaches every `assets/*.js` that `scripts/vite-sw-manifest.ts` lists).
- Privacy: the section stores nothing.
- Tests first: each task writes a failing test, then the code, then runs `npm test`, `npx tsc --noEmit`, `npm run build`.
- Visual checks are for the controller (Claude in Chrome), listed at the end. Implementers do not open a browser.

## Decisions

| ID | Decision | Why |
|---|---|---|
| S-1 | An explicit `area: SourceArea` field on every source, not a derived area. | Derivation is not reliable: 29 sources serve claims with different prefixes (`fa`, `tip`, `eqnow`, `drill`, `typhoon`), and 45 sources have no claim at all (the record is their only use). A required field makes `tsc` fail on a new source with no area. |
| S-2 | One area per source, by this precedence: Language and terms, Contacts, History, Medical, Safety and alerts. The exact lists are in Task 1. | A source appears once, so the page has no duplicates. |
| S-3 | "Used by a verification record" means: the source ID appears as a whole word in a `docs/superpowers/specs/*-verification.md` file. The IDs live in `src/data/source-records.ts`; a test keeps that list equal to a scan of the records. | The app cannot read `docs/` at runtime. The test catches drift when a record changes. |
| S-4 | "Used by the glossary" means the `source` field of a `GLOSSARY` entry. Sources named only in glossary comments stay hidden: `jma-nagasaki-levels-id`, `cao-evacuation-points-id`, `isa-guidebook-id`, `kemenkes-rjp`, `alodokter-crush`. Result: 113 of 118 sources show. | The field is machine-checkable; a comment is not. |
| S-5 | Topic links filter by area: first aid to `medical`, alerts and typhoon to `safety`, contacts to `contacts`. URL form `#/sources/<area>`. `#/sources` shows the section alone; `#/learn` shows it after About with all areas. | The alerts, typhoon and contacts text has no claim IDs, so a finer topic filter has no data. |
| S-6 | The last check date is the latest `checked` value among the shown sources. | It is the date of the most recent check, and it changes when the data changes. |
| S-7 | The chunk loads when the `learn` or `sources` route opens. A load failure shows a translated message, and the next route change tries again. | The section is on the Learn page; the home page first load stays the same. |
| S-8 | The About card "Sources and References" stays and gains a "See the sources" link to `#/sources`. | It points readers from the summary to the full list. |
| S-9 | Known limit: Back from `#/sources/<area>` returns to the top of the previous route, because `activateRoute` scrolls to the top. Scroll restore is out of scope. | Keeps the router change small. |

## Review Focus

1. A user opens an old or mistyped link such as `#/sources/medic`: the page shows all areas with "All" pressed, not a blank section. Test: Task 2 "shows all areas for an unknown param".
2. A user opens Learn offline, and the chunk is not in the cache (for example an old service worker), or the import fails: the section shows "The source list did not load..." and tries again on the next route. Test: Task 3 "shows the load error, then tries again on the next route".
3. A user switches the language while the list is open: group names, filter names and "Checked" change, and the titles stay in their own language. Test: Task 2 "translates labels on a language switch and keeps titles as they are".
4. A long Japanese title (for example the 消防救第385号 title, 80 characters with no spaces) at 390px: it wraps and the page has no horizontal scroll. Test: Task 5 "wraps long source titles".
5. A later change adds a source, a claim or a verification record: a source without an area fails `tsc`, and a record list that drifts fails a test. A screen reader reads a Japanese title with a Japanese voice. Tests: Task 1 "lists exactly the source IDs that the verification records cite"; Task 2 "marks Japanese text lang=ja".

---

### Task 1: Source areas and the visibility rule

**Files:**
- Modify: `src/data/sources.ts` (add `SOURCE_AREAS`, `SourceArea`, `Source.area`, an `area` on all 118 entries)
- Create: `src/data/source-records.ts`
- Create: `src/data/source-groups.ts`
- Test: `src/__tests__/source-groups.test.ts`

**Interfaces:**
- Produces in `src/data/sources.ts`: `export const SOURCE_AREAS = ['medical', 'history', 'safety', 'contacts', 'terms'] as const;` `export type SourceArea = (typeof SOURCE_AREAS)[number];` `Source` gains required `area: SourceArea`.
- Produces in `src/data/source-records.ts`: `export const RECORD_SOURCES: ReadonlyArray<SourceId>` (106 IDs today, sorted).
- Produces in `src/data/source-groups.ts`:
  - `export interface SourceUse { sources: Record<SourceId, Source>; claims: Record<string, Claim>; glossary: ReadonlyArray<{ source: SourceId }>; records: ReadonlyArray<SourceId> }`
  - `export function visibleSourceIds(use?: SourceUse): SourceId[]` (default: the real data; result in `SOURCES` key order)
  - `export interface SourceEntry extends Source { id: SourceId }`
  - `export interface SourceGroup { area: SourceArea; sources: SourceEntry[] }`
  - `export function groupSources(ids: SourceId[], area: SourceArea | null, sources?: Record<SourceId, Source>): SourceGroup[]` (groups in `SOURCE_AREAS` order, empty groups dropped, `area` set means that group only)
  - `export function lastChecked(ids: SourceId[], sources?: Record<SourceId, Source>): string` (latest `YYYY-MM-DD`, `''` for none)
  - `export function isSourceArea(x: string | null): x is SourceArea`

- [ ] **Step 1: Record the baseline.** Run `npm run build && wc -c dist/assets/index-*.js`. Write the byte count in the PR body. Task 5 compares with it.

- [ ] **Step 2: Write the failing tests** in `src/__tests__/source-groups.test.ts`:

```ts
const specs = resolve(__dirname, '../../docs/superpowers/specs');
const recordText = readdirSync(specs).filter(f => f.endsWith('-verification.md'))
  .map(f => readFileSync(resolve(specs, f), 'utf8')).join('\n');
const cited = (id: string) => new RegExp(`(^|[^a-z0-9-])${id}([^a-z0-9-]|$)`).test(recordText);
const HIDDEN = ['jma-nagasaki-levels-id', 'cao-evacuation-points-id', 'isa-guidebook-id', 'kemenkes-rjp', 'alodokter-crush'];
const src = (area: SourceArea, checked = '2026-11-21'): Source => ({ publisher: 'P', title: 'T', url: 'https://example.org', checked, area });

describe('source areas', () => {
  it('gives every source a known area', () => {
    for (const [id, s] of Object.entries(SOURCES)) expect(SOURCE_AREAS, id).toContain(s.area);
  });
  it('counts the sources in each area', () => {
    const n: Record<string, number> = {};
    for (const s of Object.values(SOURCES)) n[s.area] = (n[s.area] ?? 0) + 1;
    expect(n).toEqual({ terms: 16, medical: 29, history: 14, safety: 46, contacts: 13 });
  });
  it('puts sample sources in their areas', () => {
    expect([SOURCES['who-pfa-ja'].area, SOURCES['fdma-hanshin-final'].area, SOURCES['kantei-keihou'].area,
      SOURCES['keishicho-110'].area, SOURCES['jma-multilingual'].area]).toEqual(['medical', 'history', 'safety', 'contacts', 'terms']);
  });
});

describe('record sources', () => {
  it('lists exactly the source IDs that the verification records cite', () => {
    expect([...RECORD_SOURCES].sort()).toEqual(Object.keys(SOURCES).filter(cited).sort());
  });
});

describe('visible sources', () => {
  it('shows 113 sources and hides the 5 that nothing uses', () => {
    const shown = visibleSourceIds();
    expect(shown).toHaveLength(113);
    expect(Object.keys(SOURCES).filter(id => !shown.includes(id))).toEqual(HIDDEN);
  });
  it('keeps the SOURCES order', () => {
    const shown = visibleSourceIds();
    expect(shown).toEqual(Object.keys(SOURCES).filter(id => shown.includes(id)));
  });
  it('hides a source that only a removed claim uses', () => {
    const use = { sources: { a: src('medical') }, claims: { c: { sources: ['a'], status: 'removed' as const, note: '' } }, glossary: [], records: [] };
    expect(visibleSourceIds(use)).toEqual([]);
  });
  it('shows a source that only the glossary or only a record uses', () => {
    const use = { sources: { g: src('terms'), r: src('history') }, claims: {}, glossary: [{ source: 'g' }], records: ['r'] };
    expect(visibleSourceIds(use)).toEqual(['g', 'r']);
  });
});

describe('groups', () => {
  const fixture = { a: src('safety'), b: src('medical', '2026-01-02'), c: src('safety', '2026-11-30') };
  it('returns areas in SOURCE_AREAS order and drops empty areas', () => {
    expect(groupSources(['a', 'b', 'c'], null, fixture).map(g => [g.area, g.sources.map(s => s.id)]))
      .toEqual([['medical', ['b']], ['safety', ['a', 'c']]]);
  });
  it('returns one group for one area', () => {
    expect(groupSources(['a', 'b', 'c'], 'safety', fixture).map(g => g.area)).toEqual(['safety']);
  });
  it('returns the latest checked date', () => {
    expect(lastChecked(['a', 'b', 'c'], fixture)).toBe('2026-11-30');
    expect(lastChecked([], fixture)).toBe('');
  });
  it('accepts only the five area names', () => {
    expect(['medical', 'terms', 'medic', '', null].map(isSourceArea)).toEqual([true, true, false, false, false]);
  });
});
```

- [ ] **Step 3: Run** `npx vitest run src/__tests__/source-groups.test.ts`. Expected: FAIL (`source-records` and `source-groups` do not exist).

- [ ] **Step 4: Add the areas** to `src/data/sources.ts`. Put `area` as the last property of each entry. Assign by these lists:
  - `terms` (16): the 13 entries before the `// First-aid sources` comment (`jma-multilingual` to `aha-arc-first-aid-2024`), plus `jma-nagasaki-levels-en`, `jma-warning-2026-english`, `jma-multilingual-page`.
  - `medical` (29): every entry from the `// First-aid sources (Task 4)` comment to the `// Task 5` comment (`fdma-385-cpr-2025` to `nhs-burns`).
  - `history` (14): `fdma-hanshin-final`, `kobe-city-damage`, `cao-kyokun-1-1-2`, `cao-kyokun-1-11-4`, `cao-kyokun-1-6-1`, `cao-kyokun-2-5-6`, `cao-kyokun-1-9-2`, `mlit-whitepaper-2021`, `cao-toilet-guideline`, `jma-tsunami-kaizen-2012`, `jma-faq-tsunami`, `jma-typhoon-normals`, `mext-school-safety-r6`, `bda-launch`.
  - `contacts` (13): `keishicho-110`, `kaiho-118`, `jnto-mi-guide`, `ntt-east-171-intro`, `ntt-east-171-rec`, `amda-activities`, `amda-indonesia`, `isa-info-center`, `mofa-emblist-asia`, `osaka-pref-consulates`, `hyogo-pref-consulates`, `jhelp-home`, `yorisoi-n2`.
  - `safety` (46): every other source.
  Fix the missing line break in `},  // Task 6c:` (after `jma-warning-2026-english`) while there.

- [ ] **Step 5: Write `src/data/source-records.ts`.** A one-line comment names the four records and says that `source-groups.test.ts` keeps the list equal to them. To fill the list, run the record test once: its diff prints the 106 expected IDs.

- [ ] **Step 6: Implement `src/data/source-groups.ts`** with the Task 1 signatures. A source is visible when a claim with `status !== 'removed'` lists it, a glossary entry names it in `source`, or `records` contains it.

- [ ] **Step 7: Run** `npm test && npx tsc --noEmit && npm run build`. Expected: all PASS.

- [ ] **Step 8: Commit** `git add src/data src/__tests__/source-groups.test.ts` and `git commit -m "feat(sources): give each source an area and list the sources in use"`.

### Task 2: Render the source list

**Files:**
- Create: `src/sources-page.ts`
- Modify: `src/locales/en.ts`, `src/locales/ja.ts`, `src/locales/id.ts` (the `sources.*` keys below)
- Test: `src/__tests__/sources-page.test.ts`

**Interfaces:**
- Consumes: `visibleSourceIds`, `groupSources`, `lastChecked`, `isSourceArea`, `SourceGroup` (Task 1); `SOURCE_AREAS`, `SOURCES` (Task 1); `t` (`src/i18n.ts`).
- Produces: `export function showSources(param: string | null): void`. It reads `#sourcesLastCheck` (a `<time>`), `#sourcesFilters` and `#sourcesList` from `document`, and does nothing if `#sourcesList` is missing.
- Produces: `export function renderSourceList(list: HTMLElement, groups: SourceGroup[]): void`.
- DOM contract (Task 5 styles it):
  - `#sourcesFilters`: one `button.contact-filter-btn` with `data-area="all"` and `data-i18n="sources.all"`, then one per area with `data-area="<area>"` and `data-i18n="sources.area.<area>"`, each with `aria-pressed`. Build the buttons once.
  - `#sourcesList`: one `section.sources-group` per group, holding `h3.sources-group-title[data-i18n="sources.area.<area>"]` and `ul.sources-items`. Each `li.source-item` holds `span.source-publisher`, `a.source-title`, and `span.source-checked` (a `span[data-i18n="sources.checked"]` and a `<time datetime>`).

Locale keys (en | ja | id). Copy is fixed:

| Key | en | ja | id |
|---|---|---|---|
| `sources.title` | Sources and checks | 出典とチェック | Sumber dan pemeriksaan |
| `sources.howTitle` | How this guide checks facts | このガイドの確かめ方 | Cara panduan ini memeriksa fakta |
| `sources.howOfficial` | This guide shows only information that an official source certifies. | このガイドには、公式の情報源（じょうほうげん）が確かめた情報だけがあります。 | Panduan ini hanya berisi informasi yang dikonfirmasi oleh sumber resmi. |
| `sources.howRemoved` | Aditya removes each line that no official source supports. | 公式の情報源にない文は、Adityaが消します。 | Aditya menghapus setiap kalimat yang tidak didukung sumber resmi. |
| `sources.howMedical` | The first aid steps come from official guidance. No medical professional checked them. | 応急手当（おうきゅうてあて）のステップは、公式の情報をもとにしています。医師（いし）などの専門家（せんもんか）は、まだ確認していません。 | Langkah pertolongan pertama berasal dari panduan resmi. Tenaga medis profesional belum memeriksanya. |
| `sources.howLinks` | Tap a title to open the official page in a new tab. The guide connects to a page only when you tap it. | タイトルをタップすると、公式のページが新しいタブで開きます。タップしないときは、どのページにもつなぎません。 | Ketuk judul untuk membuka halaman resmi di tab baru. Panduan ini hanya membuka halaman itu kalau kamu mengetuknya. |
| `sources.lastCheck` | Last check of the sources: | 出典を最後に確かめた日： | Pemeriksaan sumber terakhir: |
| `sources.filterAria` | Filter sources by area | 分野（ぶんや）で出典をしぼりこむ | Saring sumber menurut bidang |
| `sources.all` | All | すべて | Semua |
| `sources.area.medical` | Medical | 医療（いりょう） | Medis |
| `sources.area.history` | History | 歴史（れきし） | Sejarah |
| `sources.area.safety` | Safety and alerts | 安全と警報（けいほう） | Keselamatan dan peringatan |
| `sources.area.contacts` | Contacts | 連絡先（れんらくさき） | Kontak |
| `sources.area.terms` | Language and terms | ことばと用語（ようご） | Bahasa dan istilah |
| `sources.checked` | Checked | 確認した日 | Diperiksa |
| `sources.link` | See the sources | 出典（しゅってん）を見る | Lihat sumbernya |
| `sources.loadError` | The source list did not load. Connect to the internet, then open this page again. | 出典のリストを読みこめませんでした。インターネットにつないで、もう一度開いてください。 | Daftar sumber gagal dimuat. Sambungkan ke internet, lalu buka halaman ini lagi. |

- [ ] **Step 1: Write the failing tests** in `src/__tests__/sources-page.test.ts`. Fixture: `document.body.innerHTML = '<time id="sourcesLastCheck"></time><div id="sourcesFilters"></div><div id="sourcesList"></div>'`, `setI18nLang('en')` and `window.location.hash = '#/learn'` before each test. `read(f)` returns the text of a repo file (`readFileSync(resolve(process.cwd(), f), 'utf8')`), as in `offline.test.ts`.

```ts
const titles = () => [...document.querySelectorAll<HTMLElement>('.sources-group-title')];
const item = (id: string) => [...document.querySelectorAll('.source-item')]
  .find(li => li.querySelector('a')!.getAttribute('href') === SOURCES[id].url)!;

it('shows five groups in area order', () => {
  showSources(null);
  expect(titles().map(h => h.dataset.i18n)).toEqual(SOURCE_AREAS.map(a => `sources.area.${a}`));
});
it('shows 113 sources with publisher, title link and checked date', () => {
  showSources(null);
  expect(document.querySelectorAll('.source-item')).toHaveLength(113);
  const li = document.querySelector('.source-item')!;
  expect(li.querySelector('.source-publisher')!.textContent).toBe(SOURCES['fdma-385-cpr-2025'].publisher);
  expect(li.querySelector('a.source-title')!.textContent).toBe(SOURCES['fdma-385-cpr-2025'].title);
  expect(li.querySelector('time')!.getAttribute('datetime')).toBe('2026-11-21');
});
it('opens every title in a new tab with rel noopener noreferrer', () => {
  showSources(null);
  for (const a of document.querySelectorAll('a.source-title')) {
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    expect(a.getAttribute('href')).toMatch(/^https:\/\//);
  }
});
it('adds no element that loads on its own', () => {
  showSources(null);
  expect(document.querySelectorAll('img, script, iframe, link, object, embed, source, video, audio')).toHaveLength(0);
});
it('has no network call in its code', () => {
  for (const f of ['src/sources-page.ts', 'src/data/source-groups.ts'])
    expect(read(f)).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon|new Image|WebSocket|EventSource/);
});
it('marks Japanese text lang=ja', () => {
  showSources(null);
  expect(item('kantei-keihou').querySelector('a')!.getAttribute('lang')).toBe('ja');
  expect(item('jma-multilingual-page').querySelector('a')!.hasAttribute('lang')).toBe(false);
});
it('filters to the area in the param and presses its button', () => {
  showSources('medical');
  expect(titles().map(h => h.dataset.i18n)).toEqual(['sources.area.medical']);
  expect(document.querySelector('[data-area="medical"]')!.getAttribute('aria-pressed')).toBe('true');
  expect(document.querySelector('[data-area="all"]')!.getAttribute('aria-pressed')).toBe('false');
});
it('shows all areas for an unknown param', () => {
  showSources('medic');
  expect(titles()).toHaveLength(5);
  expect(document.querySelector('[data-area="all"]')!.getAttribute('aria-pressed')).toBe('true');
});
it('changes the list from a filter button and leaves the hash alone', () => {
  showSources(null);
  document.querySelector<HTMLButtonElement>('[data-area="history"]')!.click();
  expect(titles().map(h => h.dataset.i18n)).toEqual(['sources.area.history']);
  expect(window.location.hash).toBe('#/learn');
});
it('builds the filter buttons once', () => {
  showSources(null); showSources('medical');
  expect(document.querySelectorAll('#sourcesFilters button')).toHaveLength(6);
});
it('translates labels on a language switch and keeps titles as they are', () => {
  showSources('medical');
  setI18nLang('ja'); applyTranslations();
  expect(titles()[0].textContent).toBe('医療（いりょう）');
  expect(document.querySelector('.source-checked [data-i18n]')!.textContent).toBe('確認した日');
  expect(document.querySelector('a.source-title')!.textContent).toBe(SOURCES['fdma-385-cpr-2025'].title);
});
it('writes the latest check date', () => {
  showSources(null);
  const time = document.getElementById('sourcesLastCheck')!;
  expect([time.textContent, time.getAttribute('datetime')]).toEqual(['2026-11-21', '2026-11-21']);
});
it('renders data as text, not markup', () => {
  const list = document.createElement('div');
  renderSourceList(list, [{ area: 'medical', sources: [{ id: 'x', publisher: '<b>P</b>', title: '<img src=x>', url: 'https://example.org', checked: '2026-01-01', area: 'medical' }] }]);
  expect(list.querySelector('img, b')).toBeNull();
  expect(list.textContent).toContain('<img src=x>');
});
```

- [ ] **Step 2: Run** `npx vitest run src/__tests__/sources-page.test.ts`. Expected: FAIL (module missing).
- [ ] **Step 3: Add the locale keys** from the table to all three locale files, after the `chip.*` block.
- [ ] **Step 4: Implement `src/sources-page.ts`.** Build every node with `createElement` and `textContent`; never assign data to `innerHTML`. Set `lang="ja"` on a publisher or title that matches `/[぀-ヿ㐀-鿿]/`. Build the filter buttons only when `#sourcesFilters` has none (tests replace the DOM, so a module flag is wrong). Keep the active filter in a module variable; a button click calls `renderSourceList` and updates `aria-pressed`. Set `data-i18n` on every translated node and fill it with `t(key)`.
- [ ] **Step 5: Run** `npm test && npx tsc --noEmit && npm run build`. Expected: all PASS, including `copy-rules`, `glossary` and `no-em-dash`.
- [ ] **Step 6: Commit** `git commit -m "feat(sources): render the source list with area filters"`.

### Task 3: Route, section and lazy loader

**Files:**
- Modify: `src/router.ts`, `src/section-nav.ts`, `src/main.ts`, `index.html` (new section after `#about`, before the contacts comment), `src/locales/{en,ja,id}.ts` (`label.sources`, `chip.sources`)
- Create: `src/sources-loader.ts`
- Test: `src/__tests__/router.test.ts` (modify), `src/__tests__/sources-loader.test.ts`, `src/__tests__/sources-lazy.test.ts`

**Interfaces:**
- Consumes: `showSources` (Task 2).
- Produces in `src/router.ts`: `export interface RouteDetail { route: string; param: string | null }` (`route` is the name, for example `'sources'`); `export const PARAM_ROUTES: readonly string[] = ['#/sources']`; `export function resolveRoute(hash: string): { route: string; param: string | null }` (`route` is the hash key, for example `'#/sources'`; `param` matches `[a-z]+`; any other unknown hash gives `{ route: '#/', param: null }`). `ROUTE_SECTIONS['#/learn']` becomes `['drill', 'quiz', 'about', 'sources']`; new `ROUTE_SECTIONS['#/sources'] = ['sources']`. At its end, `activateRoute` dispatches `new CustomEvent<RouteDetail>('mamoru:route', { detail })` on `document`.
- Produces in `src/sources-loader.ts`: `export interface SourcesModule { showSources(param: string | null): void }`; `export function initSourcesLoader(load?: () => Promise<SourcesModule>): () => void`. The default is `() => import('./sources-page')`. The return value removes the listener.
- Produces: `ROUTE_CHIPS.learn` gains `{ section: 'sources', i18n: 'chip.sources' }` after `about`.

Locale keys: `label.sources` = `SOURCES` | `出典（しゅってん）` | `SUMBER`; `chip.sources` = `📚 Sources` | `📚 出典` | `📚 Sumber`.

Section markup (English text is the no-JS fallback; `data-i18n` replaces it):

```html
<section class="section" id="sources">
  <div class="section-label" data-i18n="label.sources">SOURCES</div>
  <h2 class="section-title" data-i18n="sources.title">Sources and checks</h2>
  <h3 class="sources-how-title" data-i18n="sources.howTitle">How this guide checks facts</h3>
  <ul class="sources-how">
    <li data-i18n="sources.howOfficial">…</li>
    <li data-i18n="sources.howRemoved">…</li>
    <li data-i18n="sources.howMedical">…</li>
    <li data-i18n="sources.howLinks">…</li>
    <li><span data-i18n="sources.lastCheck">Last check of the sources:</span> <time id="sourcesLastCheck"></time></li>
  </ul>
  <div id="sourcesFilters" class="contact-filters" role="toolbar" aria-label="Filter sources by area" data-i18n-aria="sources.filterAria"></div>
  <div id="sourcesList"></div>
</section>
```

- [ ] **Step 1: Write the failing tests.**
  - `router.test.ts`: add `'sources'` to `ALL_IDS`. Change "shows learn sections on #/learn" to expect `['drill', 'quiz', 'about', 'sources']`. Add:

```ts
it('shows only sources on #/sources and #/sources/medical', () => {
  for (const h of ['#/sources', '#/sources/medical']) {
    activateRoute(h);
    expect(visibleSections()).toEqual(['sources']);
    expect(document.body.dataset.route).toBe('sources');
  }
});
it('falls back to landing for a sub-route of a route that takes no param', () => {
  activateRoute('#/prepare/medical');
  expect(visibleSections()).toEqual(['hero']);
});
it('tells listeners the route name and its param', () => {
  const seen: RouteDetail[] = [];
  const on = (e: Event) => seen.push((e as CustomEvent<RouteDetail>).detail);
  document.addEventListener('mamoru:route', on);
  activateRoute('#/sources/medical'); activateRoute('#/learn');
  document.removeEventListener('mamoru:route', on);
  expect(seen).toEqual([{ route: 'sources', param: 'medical' }, { route: 'learn', param: null }]);
});
it('resolves a param only for a param route', () => {
  expect(['#/sources/medical', '#/sources', '#/sources/', '#/learn/x'].map(resolveRoute)).toEqual([
    { route: '#/sources', param: 'medical' }, { route: '#/sources', param: null },
    { route: '#/', param: null }, { route: '#/', param: null }]);
});
```

  - `sources-loader.test.ts` (fixture `<div id="sourcesList"></div>`; `fire(route, param)` dispatches `mamoru:route`; `flush = () => new Promise(r => setTimeout(r))`; call the cleanup in `afterEach`):

```ts
it('does not load on home or prepare', async () => {
  const load = vi.fn(); stop = initSourcesLoader(load);
  fire('home'); fire('prepare'); await flush();
  expect(load).not.toHaveBeenCalled();
});
it('loads once and passes the param on learn and sources', async () => {
  const show = vi.fn(); const load = vi.fn(async () => ({ showSources: show }));
  stop = initSourcesLoader(load);
  fire('learn'); await flush(); fire('sources', 'medical'); await flush();
  expect(load).toHaveBeenCalledTimes(1);
  expect(show.mock.calls).toEqual([[null], ['medical']]);
});
it('shows the load error, then tries again on the next route', async () => {
  const show = vi.fn();
  const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ showSources: show });
  stop = initSourcesLoader(load);
  fire('learn'); await flush();
  expect(document.querySelector('#sourcesList [data-i18n="sources.loadError"]')!.textContent).toBe(t('sources.loadError'));
  fire('learn'); await flush();
  expect(load).toHaveBeenCalledTimes(2);
  expect(show).toHaveBeenCalledWith(null);
});
```

  - `sources-lazy.test.ts`: write `staticImports(entry: string): string[]`, a walk over `import ... from './x'`, `import './x'` and `export ... from './x'` that skips `import type` and `import(`, and resolves `.ts`. Then:

```ts
it('keeps the sources data out of the first load', () => {
  const seen = staticImports('src/main.ts');
  expect(seen).toContain('src/router.ts');
  for (const f of ['src/data/sources.ts', 'src/data/glossary.ts', 'src/data/source-records.ts', 'src/data/source-groups.ts', 'src/sources-page.ts'])
    expect(seen).not.toContain(f);
});
it('loads the sources page with a dynamic import', () => {
  expect(read('src/sources-loader.ts')).toMatch(/import\(\s*'\.\/sources-page'\s*\)/);
});
```

- [ ] **Step 2: Run** `npx vitest run src/__tests__/router.test.ts src/__tests__/sources-loader.test.ts src/__tests__/sources-lazy.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** the router change, `src/sources-loader.ts`, the chip and the two locale keys. The loader keeps one cached promise, clears it on a rejection, and writes the error as `<p data-i18n="sources.loadError">` built with `createElement`. In `src/main.ts`, call `initSourcesLoader()` on the line before `initRouter()`, because the first `activateRoute` runs inside `initRouter`.
- [ ] **Step 4: Add the section** to `index.html` with the markup above.
- [ ] **Step 5: Run** `npm test && npx tsc --noEmit && npm run build`. Expected: all PASS. `section-nav.test.ts` confirms the chip order, `i18n.test.ts` confirms `label.sources` in three languages, and `nav-order.test.ts` stays green.
- [ ] **Step 6: Commit** `git commit -m "feat(sources): add the sources section to Learn and load its data on demand"`.

### Task 4: "See the sources" links

**Files:**
- Create: `src/sources-link.ts`
- Modify: `src/first-aid.ts` (`renderCategories` and `renderSteps`, after `${REVIEW_NOTE}`), `index.html` (alerts after `.alert-grid`; typhoon after the before/during/after `.split-panel`; contacts after `#contactsGrid`; the About card "Sources and References" after its `<p>`)
- Test: `src/__tests__/sources-links.test.ts`

**Interfaces:**
- Consumes: `type SourceArea` (Task 1, type-only import, so the first load gets no data); `t`.
- Produces: `export function sourcesLinkHtml(area?: SourceArea): string`. It returns `<p class="sources-link-row"><a class="sources-link" href="#/sources/<area>" data-i18n="sources.link">…</a></p>`. With no area, the href is `#/sources`. The link has no `target`. The static links in `index.html` use the same markup.

- [ ] **Step 1: Write the failing tests:**

```ts
const doc = new DOMParser().parseFromString(read('index.html'), 'text/html');
const hrefIn = (sel: string) => doc.querySelector(`${sel} a.sources-link`)?.getAttribute('href');

it('links alerts, typhoon, contacts and About to their area', () => {
  expect(['#alerts', '#typhoon', '#contacts', '#about'].map(hrefIn))
    .toEqual(['#/sources/safety', '#/sources/safety', '#/sources/contacts', '#/sources']);
});
it('names only known areas and opens no new tab', () => {
  const ok = new RegExp(`^#/sources(/(${SOURCE_AREAS.join('|')}))?$`);
  const links = [...doc.querySelectorAll('a.sources-link')];
  expect(links.length).toBe(4);
  for (const a of links) { expect(a.getAttribute('href')).toMatch(ok); expect(a.hasAttribute('target')).toBe(false); }
});
it('shows the medical link on the first aid grid and on an open card', () => {
  document.body.innerHTML = '<div id="firstAidContainer"></div>';
  initFirstAid();
  expect(document.querySelector('a.sources-link')!.getAttribute('href')).toBe('#/sources/medical');
  document.querySelector<HTMLButtonElement>('.firstaid-card')!.click();
  expect(document.querySelector('a.sources-link')!.getAttribute('href')).toBe('#/sources/medical');
});
it('writes the link in the current language', () => {
  setI18nLang('id');
  expect(sourcesLinkHtml('medical')).toContain('Lihat sumbernya');
});
```

- [ ] **Step 2: Run** `npx vitest run src/__tests__/sources-links.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `sourcesLinkHtml` and add the links. Do not put the link inside `REVIEW_NOTE`: `src/drill.ts` shows that note in the middle of a drill.
- [ ] **Step 4: Run** `npm test && npx tsc --noEmit && npm run build`. Expected: all PASS, and `sources-lazy.test.ts` still passes.
- [ ] **Step 5: Commit** `git commit -m "feat(sources): link first aid, alerts, typhoon and contacts to their sources"`.

### Task 5: Styles, offline check and release

**Files:**
- Modify: `css/components.css` (after the `.contacts-grid` rules), `src/__tests__/fonts.test.ts` (`SENTENCES`), `public/sw.js` (`CACHE_NAME`), `ROADMAP.md` (idea 5)
- Test: `src/__tests__/sources-style.test.ts`

**Interfaces:**
- Consumes: the class names from Task 2, Task 3 and Task 4.

- [ ] **Step 1: Write the failing tests.** In `fonts.test.ts`, add `'components.css': ['.source-item', '.sources-how', '.sources-link']` to `SENTENCES`. Create `sources-style.test.ts` with `rule(selector)`: the joined bodies of the `css/components.css` rules whose selector list contains `selector`.

```ts
it('gives the sources link a 44px tap target', () => expect(rule('.sources-link')).toMatch(/min-height:\s*44px/));
it('wraps long source titles', () => expect(rule('.source-item')).toMatch(/overflow-wrap:\s*anywhere/));
it('sets group titles in --pixel-font, at 14px in Japanese', () => {
  expect(rule('.sources-group-title')).toMatch(/font-family:\s*var\(--pixel-font\)/);
  expect(rule('body.lang-ja .sources-group-title')).toMatch(/font-size:\s*14px/);
});
it('uses theme tokens for source text colors', () => {
  expect(rule('.source-publisher')).toMatch(/color:\s*var\(--text-muted\)/);
  expect(rule('.source-title')).toMatch(/color:\s*var\(--text\)/);
});
```

- [ ] **Step 2: Run** `npx vitest run src/__tests__/fonts.test.ts src/__tests__/sources-style.test.ts`. Expected: FAIL.
- [ ] **Step 3: Write the CSS.**
  - `.sources-how`, `.source-item` and `.sources-link`: `var(--pixel-text)` at 14px.
  - `.sources-group-title`: `var(--pixel-font)` at 12px; `body.lang-ja .sources-group-title`: 14px. This follows the `css/first-aid.css` pattern.
  - `.source-item`: `overflow-wrap: anywhere`.
  - `.source-title`: `color: var(--text)`, underlined.
  - `.source-publisher` and `.source-checked`: `color: var(--text-muted)`.
  - `.sources-link`: `display: inline-flex; align-items: center; min-height: 44px`.
  - The filter buttons reuse `.contact-filter-btn`. Add no transition or animation.
- [ ] **Step 4: Cache name.** If the reliability plan (2026-11-21-reliability-offline.md, Task 4) has already landed, the build stamps `CACHE_NAME` automatically: skip this step. Otherwise bump `CACHE_NAME` in `public/sw.js` from `mamoru-guide-v13` to `mamoru-guide-v14`.
- [ ] **Step 5: Run** `npm test && npx tsc --noEmit && npm run build`. Expected: all PASS.
- [ ] **Step 6: Verify the lazy chunk and the precache.** Run each command and compare:
  - `node -e "const m=require('./dist/asset-manifest.json');console.log(m.js.filter(f=>/sources-page/.test(f)).length)"`. Expected: `1`.
  - `grep -l "jma-shindo-table" dist/assets/*.js`. Expected: only `dist/assets/sources-page-<hash>.js`.
  - `wc -c dist/assets/index-*.js`. Expected: less than 6,000 bytes more than the Task 1 Step 1 baseline. The growth comes from the locale strings, the router change and the loader.
- [ ] **Step 7: Update `ROADMAP.md`** idea 5, "Sources and Review page". Mark the source and date part done with today's date and the section name. Keep "who reviewed it" open, because no reviewer exists (Decision D-4 in the content-quality plan).
- [ ] **Step 8: Commit** `git commit -m "style(sources): readable source list, cache bump and roadmap note"`.

## Visual checks for the controller (Claude in Chrome, after Task 5)

Run `npm run build && npm run preview`. Check each item in en, ja and id, at 390px and 1280px, in day and night mode:

1. `#/learn`: the "Sources" chip scrolls to the section. The how-text, the last check date (2026-11-21) and five groups appear in the order Medical, History, Safety and alerts, Contacts, Language and terms.
2. Japanese titles and headings render in DotGothic16 with no system-font fallback. Group titles are 14px in Japanese.
3. The 消防救第385号 title and other long titles wrap. The page has no horizontal scroll at 390px.
4. `#/sources/medical` shows the Medical group only, with "Medical" pressed. "All" shows all groups.
5. Tab through the filters and the links: the focus ring shows on each. Each filter and each "See the sources" link is at least 44px tall.
6. Publisher and date text are readable in day and night mode (AA).
7. The first aid grid and an open card show "See the sources" under the review note. Alerts, typhoon and contacts each show the link, and each link opens the right filter. The About card link opens `#/sources`.
8. Network (`read_network_requests`): the home page does not load `sources-page-*.js`. `#/learn` loads it once. No request goes to any source URL until a title is tapped. A tap opens a new tab, and the guide stays in its tab.
9. Offline: load the app once, switch the network off, reload, and open `#/learn`. The list renders from the cache.
10. With reduced motion on, nothing in the section moves. Back from `#/sources/medical` returns to Prepare at the top (Decision S-9).
