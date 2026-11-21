# Speak for Me Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a foreign resident tap 🔊 on a Show This phrase so the phone reads the Japanese aloud with an on-device voice, and show a reply card that a Japanese helper can point to.

**Architecture:** A new `src/speech.ts` owns the Web Speech API: it picks a local Japanese voice, speaks one utterance per tap and stops on every change of view. A hidden route `#/voice-check` uses the same voice filter, so the owner checks real phones before any feature code. `src/show-this.ts` adds the speak button only when a local Japanese voice exists; a new `src/reply-card.ts` renders the reply card under the phrase card.

**Tech Stack:** TypeScript, Vite PWA, Web Speech API (`speechSynthesis`, on-device voices only), Vitest + jsdom with a fake `speechSynthesis`, Claude in Chrome for the visual check.

**Spec:** This document, section "Requirements" (ROADMAP.md idea 1, "Speak for me"; controller decisions approved by the owner on 2026-11-21).

**Base branch:** Start from `main` after PRs #28 to #33 (content quality) merge. If they are not merged yet, branch from `fix/aditya/animation-check` and rebase later.

## Requirements

1. The user picks a phrase (for example 「けがをしました」 or 「避難所はどこですか？」). The phone shows it in large Japanese and reads it aloud.
2. A reply card lets the Japanese helper point to はい / いいえ, numbers 0 to 10, a pain scale 0 to 10, directions (left, right, straight, back), or write in a big text area (「ここに書いてください」). Labels show Japanese first and the user's language below.
3. Before feature code, the owner checks on one iPhone and one Android phone in airplane mode that a Japanese voice speaks offline. The result goes in `docs/superpowers/specs/2026-11-21-speak-for-me-device-check.md`.
4. If a platform has no Japanese voice on the device, the feature ships and the speak button stays hidden there (runtime check).
5. No auto-play. One tap speaks one utterance. Speech stops on route change. No audio and no error when `speechSynthesis` is missing. The speak button has an aria-label in en, ja and id.
6. Speech uses on-device voices only, never a cloud TTS, and makes no network request.
7. The plan lists a visual and audio check for the controller and the owner.

## Global Constraints

- Branch names `type/aditya/short-description`; commit messages one line, no AI/Claude trailer.
- Never costs money; never needs an account; no user data leaves the device; no new third-party runtime request.
- No new npm runtime dependency. New devDependencies only for build-time scripts, with a one-line reason (this plan adds none).
- Owner rule "erase uncertified information": a fact, number, safety action, term definition or medical step needs a source in `src/data/sources.ts` and a verification row. Phrases and reply labels are language, not facts, so this plan adds no claim. Do not add advice text to the reply card.
- Every user-visible string in en, ja, id with the same meaning. English ASD-STE100 (instructions max 20 words, descriptive max 25, active voice). Japanese やさしい日本語 (です/ます, sentences max 40 characters, reading in parentheses after hard kanji on first use). Indonesian casual-polite with `kamu`, never `Anda`, EYD V. Glossary terms in `src/data/glossary.ts` exactly. No em dash (U+2014) anywhere.
- UI strings go in `src/locales/{en,ja,id}.ts` and use `data-i18n` / `data-i18n-aria` with `applyTranslations` (`src/i18n.ts`); data objects use `{ ja, en, id }` fields so `src/__tests__/helpers/copy-corpus.ts` reads them.
- UI: `--pixel-font` for labels and buttons, `--pixel-text` for sentences; no text below 12px; WCAG AA in day and night; keyboard and visible focus; tap targets 44px; works at 390px and desktop; no motion on the speaking state, so `prefers-reduced-motion` needs no extra rule.
- Offline: the feature is part of the precached app bundle (`public/sw.js` + `asset-manifest.json`); no new file outside the build.
- Privacy: the reply card write area is never saved (not even in localStorage) and is cleared on close and on route change.
- TDD: each task writes the failing test first, then the code, then `npm test`, `npx tsc --noEmit`, `npm run build`.
- Visual checks are done by the controller with Claude in Chrome after implementation (Task 5); implementers do not use a browser.
- After adding or changing app text, run `npm run fonts` and commit the regenerated subsets, or `scripts/__tests__/font-subset.test.ts` fails.

## Decisions

Controller decisions (approved by the owner):

| ID | Decision |
|---|---|
| C-1 | Task 1 is a go/no-go device check before feature code. If no Japanese voice works offline on a platform, the feature still ships and the speak button is hidden on that platform. |
| C-2 | Build on the Show This cards. Speak with lang `ja-JP` and a slower rate. The large Japanese text stays the main output. |
| C-3 | Reply card content as in Requirement 2; follow やさしい日本語 and the glossary. |
| C-4 | No auto-play; one tap one utterance; cancel on route change; no audio without `speechSynthesis`; aria-label in three languages. |
| C-5 | On-device voices only; never a cloud TTS. |
| C-6 | Visual and audio check list for the controller and the owner (Task 5). |

Decisions made in this plan:

| ID | Decision | Why |
|---|---|---|
| P-1 | The check page is a hidden route `#/voice-check` (section `voicecheck`, no menu link), not a static `public/` page. | It uses the shipped voice filter and the precached app, so an offline reload works. |
| P-2 | "On-device" means `voice.localService === true` and a lang that normalizes to `ja` (`ja-JP`, `ja_JP`, `ja`). The utterance `voice` is always set; `lang` alone never picks a voice. | Chrome lists "Google 日本語" with `localService: false` (a network voice). Setting only `lang` can route to it. |
| P-3 | Rate `0.8`. | Slower than default, still natural. Task 5 owner check confirms it. |
| P-4 | Wait up to 2000 ms for `voiceschanged` when `getVoices()` is empty. | Chrome fills the list after page load. |
| P-5 | Speech stops on `hashchange`, `pagehide`, `visibilitychange` to hidden, and on card or tab change. A second tap cancels, then speaks again. | One utterance at a time, no queue. |
| P-6 | The reply card is an inline panel under the phrase card, opened with a toggle. Answers are buttons with `aria-pressed`, one pressed per group. | The helper can tap to make the answer big and clear; no modal, no focus trap. |
| P-7 | ` / ` inside a phrase is spoken as `、`. | 「頭が痛いです / お腹が痛いです」 must not read the slash. |
| P-8 | The owner runs Task 1 on the live https site after the Task 1 PR merges. Fallback when #28 to #33 are not merged: `npm run build && npx vite preview --host` on the same Wi-Fi. | The live site has the service worker, so the offline reload test is real. |
| P-9 | Direction "back" is もどる / Go back / Kembali. | "Back" as a direction to walk; Kembali is the app's word for back. |
| P-10 | The voice-check table headers are the API property names (`name`, `lang`, `localService`, `default`), shown as code. | It is a diagnostic for the owner; these are not prose. |

## Review Focus

1. Chrome (desktop or Android) lists the network voice "Google 日本語" (`localService: false`) before a local one: the app must skip it and pick the local voice, or hide the button. Test: Task 1 `skips a network-only Japanese voice`.
2. `getVoices()` is empty at load and fills later (Chrome), or never fills: the button appears after `voiceschanged`, and never appears after the timeout. Tests: Task 1 `waits for voiceschanged` and `resolves empty after the timeout`; Task 3 `shows the speak button after voices arrive late`.
3. A fast double tap, or a tap and then a swipe: one utterance only, and the swipe stops it. Tests: Task 2 `cancels before each speak`; Task 3 `stops speech when the card changes`.
4. A helper writes a name or address in the write area on a shared phone: it is never stored and is cleared on close and on route change. Tests: Task 4 `clears answers and the write area on close`, `clears the write area on route change`, `never stores the write area`.
5. The user's language is Japanese: the reply card shows no empty translation line. Test: Task 4 `hides the translation line in Japanese mode`.

---

### Task 1: Voice check (go/no-go, branch `feat/aditya/voice-check`)

**Files:**
- Create: `src/speech.ts`, `src/voice-check.ts`, `src/__tests__/helpers/fake-speech.ts`, `src/__tests__/speech.test.ts`, `src/__tests__/voice-check.test.ts`, `docs/superpowers/specs/2026-11-21-speak-for-me-device-check.md`
- Modify: `src/router.ts:6-15` (add `'#/voice-check': ['voicecheck']`), `src/__tests__/router.test.ts:9-16` (add `'voicecheck'` to `ALL_IDS`), `index.html` (new section before `</main>`, line 1113), `src/main.ts:71` (lazy import), `src/locales/{en,ja,id}.ts`

**Interfaces:**
- Produces (`src/speech.ts`): `SPEECH_LANG = 'ja-JP'`; `SPEECH_RATE = 0.8`; `getSynth(): SpeechSynthesis | undefined`; `isJapaneseVoice(v: SpeechSynthesisVoice): boolean`; `findJapaneseVoice(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | null` (local + Japanese, prefers `default`); `loadVoices(synth: SpeechSynthesis | undefined, timeoutMs = 2000): Promise<SpeechSynthesisVoice[]>`.
- Produces (`fake-speech.ts`): voice fixtures `KYOKO` (`ja-JP`, local), `GOOGLE_JA` (`ja-JP`, `localService: false`), `ANDROID_JA` (`ja_JP`, local), `SAMANTHA` (`en-US`, local, default); all typed `SpeechSynthesisVoice`; `installFakeSpeech(voices: SpeechSynthesisVoice[]): FakeSynth` sets `window.speechSynthesis` and a `SpeechSynthesisUtterance` class that records `text`, `lang`, `voice`, `rate`, `onend`, `onerror`; `type FakeSynth = SpeechSynthesis & { speak: Mock; cancel: Mock; setVoices(v: SpeechSynthesisVoice[]): void; fire(type: string): void }` (the helper casts once, so tests pass it where `SpeechSynthesis` is expected); `removeFakeSpeech(): void` deletes both globals.
- Produces (`src/voice-check.ts`): `initVoiceCheck(root?: HTMLElement | null): void` (default `#voiceCheckContainer`).

- [ ] **Step 1: Write the failing tests** in `speech.test.ts` (`describe('voice selection')`) and `voice-check.test.ts`:

```ts
it('picks the local Japanese voice', () => expect(findJapaneseVoice([SAMANTHA, KYOKO])).toBe(KYOKO));
it('skips a network-only Japanese voice', () => {
  expect(findJapaneseVoice([GOOGLE_JA, SAMANTHA])).toBeNull();
  expect(findJapaneseVoice([GOOGLE_JA, KYOKO])).toBe(KYOKO);
});
it('accepts ja_JP and ja', () => {
  expect(findJapaneseVoice([ANDROID_JA])).toBe(ANDROID_JA);
  expect(isJapaneseVoice({ ...KYOKO, lang: 'ja' })).toBe(true);
});
it('prefers the default local Japanese voice', () => {
  const def = { ...ANDROID_JA, default: true };
  expect(findJapaneseVoice([KYOKO, def])).toBe(def);
});
it('returns null for no voices', () => expect(findJapaneseVoice([])).toBeNull());
it('resolves at once when voices exist', async () => expect(await loadVoices(installFakeSpeech([KYOKO]))).toEqual([KYOKO]));
it('waits for voiceschanged', async () => {
  const s = installFakeSpeech([]); const p = loadVoices(s); s.setVoices([KYOKO]); s.fire('voiceschanged');
  expect(await p).toEqual([KYOKO]);
});
it('resolves empty after the timeout', async () => {
  vi.useFakeTimers(); const p = loadVoices(installFakeSpeech([])); await vi.advanceTimersByTimeAsync(2000);
  expect(await p).toEqual([]);
});
it('resolves empty without speechSynthesis', async () => expect(await loadVoices(undefined)).toEqual([]));
```

`voice-check.test.ts`: `lists only Japanese voices with their localService flag` (voices `[SAMANTHA, GOOGLE_JA, KYOKO]`, click `.vc-check`, expect 2 `tbody tr`, cell texts include `false` and `true`, and `.vc-selected` contains `Kyoko`); `speaks the test phrase with the row voice` (click the Kyoko row `.vc-speak`: last `speak` call utterance has `text === 'けがをしました'`, `lang === 'ja-JP'`, `voice === KYOKO`, `rate === 0.8`; `cancel` called before `speak`); `shows the missing message without speechSynthesis` (`.vc-output` text equals `t('vc.missing')`); `is not linked from any menu` (`index.html` has no `href="#/voice-check"`). In `router.test.ts`: `shows only voicecheck on #/voice-check`.

- [ ] **Step 2:** Run `npx vitest run src/__tests__/speech.test.ts src/__tests__/voice-check.test.ts src/__tests__/router.test.ts`. Expected: FAIL (modules and route missing).
- [ ] **Step 3:** Implement `src/speech.ts` (Task 1 exports only), `src/voice-check.ts`, the route, and the section `<section class="section route-hidden" id="voicecheck"><h2 class="section-title" data-i18n="vc.title">Voice check</h2><p class="section-note" data-i18n="vc.note"></p><div id="voiceCheckContainer"></div></section>`. `initVoiceCheck` renders a `.vc-check` button (`data-i18n="vc.check"`) and a `.vc-output`; on click it calls `loadVoices(getSynth())`, then shows `vc.selected` + the picked voice name (or `vc.none`) and a table of every `isJapaneseVoice` row with a `.vc-speak` button (`vc.speak`). Main: `import('./voice-check').then(m => m.initVoiceCheck());`. Locale keys:

| key | en | ja | id |
|---|---|---|---|
| `vc.title` | Voice check | 音声チェック | Cek suara |
| `vc.note` | Turn on airplane mode. Then tap Check voices. | 機内（きない）モードにします。それから「音声を調べる」をタップします。 | Nyalakan mode pesawat. Lalu ketuk Cek suara. |
| `vc.check` | Check voices | 音声を調べる | Cek suara |
| `vc.speak` | Speak | 話す | Bicara |
| `vc.selected` | The app uses: | アプリが使う音声： | Aplikasi memakai: |
| `vc.none` | This device has no Japanese voice. | この端末（たんまつ）には、日本語の音声がありません。 | Perangkat ini tidak punya suara bahasa Jepang. |
| `vc.missing` | This browser cannot read text aloud. | このブラウザは、文字を読み上げられません。 | Browser ini tidak bisa membacakan teks. |

- [ ] **Step 4:** Write `docs/superpowers/specs/2026-11-21-speak-for-me-device-check.md` with: purpose (C-1, P-2); how to open the page (P-8: `https://adityawks28.github.io/mamoru-guide/#/voice-check`, or the preview fallback); the owner checklist below; an empty result table with columns `Platform | OS version | Browser or home-screen app | Voice name | lang | localService | Pre-installed? | Spoke in airplane mode? | App picked it? | Silent switch on: sound? | Notes`; and the decision rules below.

  Owner checklist, once on an iPhone (Safari) and once on an Android phone (Chrome):
  1. Open the page online once. Then reload it once, so the service worker caches the app.
  2. Turn on airplane mode. Check that Wi-Fi and mobile data are both off.
  3. Reload the page. It must load from the cache.
  4. Tap Check voices. Copy every row into the result table.
  5. Tap Speak on each Japanese row. Write if you hear 「けがをしました」.
  6. If no Japanese row exists: online, install a Japanese voice (iPhone: Settings > Accessibility > Spoken Content > Voices > Japanese; Android: Settings > Google Text-to-speech > Install voice data > Japanese). Repeat steps 2 to 5. Write "No" in Pre-installed.
  7. iPhone: repeat step 5 with the silent switch on.
  8. If the app is on the home screen, repeat steps 3 to 5 in it.

  Decision rules: a row that spoke offline with `localService` true and "App picked it" yes is a go for that platform. No local Japanese voice: the button stays hidden there (C-1), ship anyway. Stop and tell the controller if a voice spoke offline with `localService` false (the filter hides a working voice), or if the picked voice did not speak offline (the filter is unsafe).
- [ ] **Step 5:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: all PASS. Commit `feat: add hidden voice check page for offline Japanese speech`.
- [ ] **Step 6: Stop.** The owner runs the checklist and fills the result table. Start Task 2 only after both platform rows exist and no stop rule fired. Commit the filled doc `docs: record speak-for-me device check results`.

### Task 2: Speech playback (branch `feat/aditya/speak-for-me`, Tasks 2 to 5)

**Files:**
- Modify: `src/speech.ts`, `src/__tests__/speech.test.ts`

**Interfaces:**
- Consumes: Task 1 `speech.ts` exports and `fake-speech.ts`.
- Produces: `initSpeech(synth: SpeechSynthesis | undefined = getSynth()): Promise<boolean>` (loads voices, stores the picked voice, adds the P-5 window and document listeners once, resolves `speechAvailable()`); `speechAvailable(): boolean`; `speakJapanese(text: string, onDone?: () => void): boolean` (false and no call when unavailable); `stopSpeaking(): void`; `toSpeechText(jp: string): string`.

- [ ] **Step 1: Write the failing tests** (`describe('playback')`; each test calls `vi.resetModules()` and `await import('../speech')` for fresh module state):

```ts
it('is unavailable without speechSynthesis', async () => {
  removeFakeSpeech(); expect(await initSpeech()).toBe(false);
  expect(speechAvailable()).toBe(false); expect(speakJapanese('はい')).toBe(false);
});
it('is unavailable with only a network voice', async () => expect(await initSpeech(installFakeSpeech([GOOGLE_JA]))).toBe(false));
it('speaks one utterance with the local voice, ja-JP and rate 0.8', async () => {
  const s = installFakeSpeech([KYOKO]); await initSpeech(s);
  expect(speakJapanese('けがをしました')).toBe(true);
  const u = s.speak.mock.calls[0][0];
  expect([u.text, u.lang, u.voice, u.rate]).toEqual(['けがをしました', 'ja-JP', KYOKO, 0.8]);
});
it('cancels before each speak', async () => {
  const s = installFakeSpeech([KYOKO]); await initSpeech(s);
  speakJapanese('はい'); speakJapanese('はい');
  expect(s.speak).toHaveBeenCalledTimes(2);
  expect(s.cancel.mock.invocationCallOrder[1]).toBeLessThan(s.speak.mock.invocationCallOrder[1]);
});
it.each(['hashchange', 'pagehide'])('stops on %s', async (type) => {
  const s = installFakeSpeech([KYOKO]); await initSpeech(s); s.cancel.mockClear();
  window.dispatchEvent(new Event(type)); expect(s.cancel).toHaveBeenCalled();
});
it('stops when the page is hidden', ...);   // set document.hidden true, dispatch visibilitychange, expect cancel
it('calls onDone on end and on error', ...); // utterance.onend() then a second utterance.onerror(): onDone called twice
it('makes no network request', async () => {
  const f = vi.spyOn(globalThis, 'fetch'); const s = installFakeSpeech([KYOKO]); await initSpeech(s);
  speakJapanese('はい'); expect(f).not.toHaveBeenCalled();
});
it('reads a slash as a pause', () => expect(toSpeechText('頭が痛いです / お腹が痛いです')).toBe('頭が痛いです、お腹が痛いです'));
```

- [ ] **Step 2:** Run `npx vitest run src/__tests__/speech.test.ts`. Expected: FAIL (`initSpeech` not exported).
- [ ] **Step 3:** Implement the Task 2 exports in `src/speech.ts`. `speakJapanese` calls `stopSpeaking()`, then builds one `SpeechSynthesisUtterance` with `SPEECH_LANG`, the stored voice and `SPEECH_RATE`, and calls `synth.speak`. No `fetch`, no URL in this module.
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`. Expected: PASS. Commit `feat: speak Japanese with an on-device voice, one utterance per tap`.

### Task 3: Speak button on the Show This cards

**Files:**
- Modify: `src/show-this.ts:88-154`, `css/show-this.css`, `index.html:663-667` (section note), `src/locales/{en,ja,id}.ts`
- Create: `src/__tests__/show-this.test.ts`

**Interfaces:**
- Consumes: `initSpeech`, `speechAvailable`, `speakJapanese`, `stopSpeaking`, `toSpeechText` (Task 2); `applyTranslations` (`src/i18n.ts`); `setLang` (`src/lang.ts`).
- Produces: `initShowThis(): Promise<void>` (renders the text card at once, then re-renders after `initSpeech()` resolves); button `button.showthis-speak[type=button][data-i18n-aria="show.speak.aria"]` with `🔊 <span data-i18n="show.speak.label"></span>`, placed after `.showthis-rom`, rendered only when `speechAvailable()`.

- [ ] **Step 1: Write the failing tests** (DOM `<div id="showThisContainer"></div>`, fresh modules per test):
  - `shows a speak button with an aria-label in en, ja and id`: for each lang, `setLang(l)`; `aria-label` equals `Read aloud in Japanese`, `日本語で読み上げ`, `Bacakan dalam bahasa Jepang`.
  - `does not speak on render, on Next or on a tab change`: `speak` not called.
  - `speaks the shown phrase on tap`: click, `speak` called once, utterance `text === '助けてください！'`.
  - `speaks a slash phrase with a pause`: open Medical, go to 「頭が痛いです / お腹が痛いです」, click, text `頭が痛いです、お腹が痛いです`.
  - `stops speech when the card changes`: click speak, clear `cancel`, click Next, `cancel` called.
  - `hides the speak button when no Japanese voice is on the device` (`[SAMANTHA]`) and `when speechSynthesis is missing`: no `.showthis-speak`; `.showthis-jp` text is `助けてください！`.
  - `shows the speak button after voices arrive late`: install with `[]`, call `initShowThis()`, `setVoices([KYOKO])`, `fire('voiceschanged')`, await, button exists.
- [ ] **Step 2:** Run `npx vitest run src/__tests__/show-this.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement. `renderCard` calls `stopSpeaking()` first and `applyTranslations(cardContainer)` last; the click handler toggles class `is-speaking` on the button until `onDone`. CSS: `.showthis-speak` uses `--pixel-font`, 14px, min 44px high, border `var(--card-border)`; `.showthis-speak.is-speaking` changes the border to `var(--accent)` only (no transform, no animation); visible `:focus-visible` outline; day-mode colors as the nav buttons. Locale keys:

| key | en | ja | id |
|---|---|---|---|
| `show.speak.label` | Read aloud | 読み上げ | Bacakan |
| `show.speak.aria` | Read aloud in Japanese | 日本語で読み上げ | Bacakan dalam bahasa Jepang |

  Append to the Show This section note (`index.html`), one span per language:
  - en: `Tap Read aloud to hear the Japanese text. If your phone has no Japanese voice, only the text shows.`
  - ja: `読み上げをタップすると、日本語の音声が出ます。日本語の音声がない携帯電話（けいたいでんわ）では、文字だけが出ます。`
  - id: `Ketuk Bacakan untuk mendengar teks Jepang. Jika ponselmu tidak punya suara bahasa Jepang, hanya teksnya yang muncul.`
- [ ] **Step 4:** Run `npm test` (includes copy-rules and glossary), `npx tsc --noEmit`, `npm run build`. Expected: PASS. Commit `feat(show-this): add a read-aloud button to each phrase`.

### Task 4: Reply card

**Files:**
- Create: `src/reply-card.ts`, `src/__tests__/reply-card.test.ts`
- Modify: `src/show-this.ts` (`initShowThis` calls `mountReplyCard(container)` after the card), `css/show-this.css`, `index.html` (section note), `src/locales/{en,ja,id}.ts`

**Interfaces:**
- Produces: `type ReplyText = { ja: string; en: string; id: string }`; `REPLY: Record<'title' | 'yes' | 'no' | 'number' | 'pain' | 'painLow' | 'painHigh' | 'direction' | 'left' | 'right' | 'straight' | 'back' | 'write', ReplyText>`; `mountReplyCard(host: HTMLElement): void` (appends `button.showthis-reply-toggle[aria-expanded][aria-controls="showThisReply"][data-i18n="show.reply.open"]` and `div#showThisReply.reply-card[hidden]`, adds one `hashchange` listener that calls `closeReplyCard()`); `closeReplyCard(): void`.
- Markup of each label: `<span class="reply-ja" lang="ja">{ja}</span><span class="reply-sub"><span data-lang="en">{en}</span><span data-lang="id">{id}</span></span>`. Groups: `[data-group="yesno"|"number"|"pain"|"direction"]` holding `button.reply-option[data-value][aria-pressed]`; write area `textarea#replyWrite` with a `<label for="replyWrite">`.

REPLY copy (exact):

| key | ja | en | id |
|---|---|---|---|
| title | 答（こた）えを指（ゆび）でさしてください。 | Please point to your answer. | Tolong tunjuk jawabanmu. |
| yes / no | はい / いいえ | Yes / No | Ya / Tidak |
| number | 数（かず） | Number | Angka |
| pain | 痛（いた）みの強（つよ）さ | Pain level | Tingkat rasa sakit |
| painLow | 痛くない | No pain | Tidak sakit |
| painHigh | いちばん痛い | Worst pain | Paling sakit |
| direction | 方向（ほうこう） | Direction | Arah |
| left / right | 左（ひだり） / 右（みぎ） | Left / Right | Kiri / Kanan |
| straight / back | まっすぐ / もどる | Straight on / Go back | Lurus / Kembali |
| write | ここに書（か）いてください。 | Please write here. | Tolong tulis di sini. |

Direction arrows (render only): left `←`, right `→`, straight `↑`, back `↩`. Pain buttons 0 and 10 carry the `painLow` and `painHigh` labels.

- [ ] **Step 1: Write the failing tests:**
  - `opens and closes with the toggle`: click toggle, `aria-expanded` `true`, `#showThisReply` not hidden, focus on `.reply-title` (`tabindex="-1"`); click again, `false`, hidden.
  - `shows Japanese first, then the user language`: in `.reply-title`, first child is `.reply-ja` with `REPLY.title.ja`, second is `.reply-sub`.
  - `has yes and no`, `has numbers 0 to 10` (`[data-group="number"] .reply-option` texts equal `['0',…,'10']`), `has a pain scale 0 to 10 with end labels` (11 options; option `0` contains `痛くない`, option `10` contains `いちばん痛い`), `has four directions` (values `left,right,straight,back`), `has a write area with a label`.
  - `presses one answer per group`: click number `3`, then `5`; only `5` is `aria-pressed="true"`; pain `3` stays unpressed.
  - `clears answers and the write area on close`; `clears the write area on route change` (type text, dispatch `hashchange`, value `''`, panel hidden).
  - `never stores the write area`: type `Tanaka 090`, close; no `localStorage` value contains `Tanaka`.
  - `hides the translation line in Japanese mode`: `css/show-this.css` has a rule `body.lang-ja .reply-sub` with `display: none`.
- [ ] **Step 2:** Run `npx vitest run src/__tests__/reply-card.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement `src/reply-card.ts` and the CSS. `.reply-ja` 20px `--pixel-text`; `.reply-sub` 14px `--pixel-text`, `var(--text-muted)`; number and pain grids `repeat(6, minmax(44px, 1fr))`; options min 44px; pressed option uses `var(--accent)` border and background tint, readable in day and night; textarea min 160px high, 22px `--pixel-text`, full width, `autocomplete="off"`. Locale key `show.reply.open`: en `Reply card`, ja `返事（へんじ）カード`, id `Kartu jawaban`. Append to the section note:
  - en: `Show the Reply card. Then the other person can point to an answer.`
  - ja: `返事（へんじ）カードを見せると、相手は答えをえらべます。`
  - id: `Tunjukkan Kartu jawaban. Lalu orang itu bisa menunjuk jawabannya.`
- [ ] **Step 4:** Run `npm test`, `npx tsc --noEmit`, `npm run build`. Expected: PASS. Commit `feat(show-this): add a reply card the helper can point to`.

### Task 5: Visual and audio check, roadmap

**Files:**
- Modify: `docs/superpowers/specs/2026-11-21-speak-for-me-device-check.md` (add "Feature check" results), `ROADMAP.md` (mark "Speak for me" done with the date and the doc path)

- [ ] **Step 1: Controller check (Claude in Chrome, `npm run dev`, `#/show` and `#/prepare`):** en, ja, id; day and night; 390px and 1280px.
  1. The 🔊 Read aloud button shows under the romaji (macOS Chrome picks a local voice such as Kyoko); 44px high; focus ring visible with Tab.
  2. The large Japanese text stays the biggest text on the card.
  3. Tapping Read aloud makes zero network requests (`read_network_requests`).
  4. The reply card opens under the card; Japanese line above the user-language line; no translation line in ja; the 0 to 10 grids fit at 390px with no horizontal scroll; Indonesian labels do not overflow.
  5. Pressed answers and the textarea text pass AA contrast in day and night (`check_contrast`); no text below 12px; Japanese labels show in DotGothic16, not a fallback.
  6. With reduced motion on, nothing on the speaking state moves.
  7. `#/voice-check` loads by URL and has no menu link.
- [ ] **Step 2: Owner audio check (iPhone and Android, airplane mode, after an online visit):**
  1. No sound on page load, on swipe, or on a tab change.
  2. Tap Read aloud on all 29 phrases. The voice is Japanese, slow and clear. Write each misreading in the doc (for follow-up; do not change phrases here).
  3. Tap twice fast: one voice only, no overlap.
  4. Tap, then open another page (menu): the voice stops.
  5. Tap, then switch apps: the voice stops.
  6. On a phone with no Japanese voice: no button, the text card still works.
  7. Open the reply card, write in the box, open another page, come back: the box is empty.
- [ ] **Step 3:** Fix each failed item in its own commit with a test where one is possible. Record the results in the doc. Mark the ROADMAP item done. Commit `docs: record speak-for-me feature check`. Open the PR for Tasks 2 to 5.
