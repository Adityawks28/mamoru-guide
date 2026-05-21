# Mamoru Character System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Moru & Mamo pixel-character system from the React/JSX prototype at `/Users/aditya/Downloads/mamoru_guide_design/` into the existing vanilla-TS `mamoru-guide` project, with hero mascot + reactive scenario sprites on five sections + a Character Bible page, in EN/JA/ID, honoring reduced-motion.

**Architecture:** A new `src/character/` module exporting `init*` functions for the hero mascot, four scenario scenes, and the Bible. Each scenario subscribes to `CustomEvent`s on `document` emitted by the corresponding existing feature module (one `dispatchEvent` line each). Sprite is a vanilla TS SVG builder (`createSprite`/`updateSprite`) that ports `MiniMamoru` from `mamoru-scenarios.jsx` line-for-line. Reduced motion is gated centrally in `motion.ts`.

**Tech Stack:** TypeScript (strict) + Vite + Vitest + jsdom. Zero new runtime dependencies.

**Working branch:** `feat/aditya/character-system-design-spec` (the existing branch the spec is on). All implementation commits land here.

**Source of truth:** the prototype files at `/Users/aditya/Downloads/mamoru_guide_design/` — especially `mamoru-scenarios.jsx` (MiniMamoru lines 58-290, outfitColors lines 35-56), `mascot.jsx`, `character-bible.jsx`, `arcade.css`, `scenarios.css`.

**Commit convention:** every commit is a single-line message, no Claude trailer (per project convention). Use the conventional prefix (`feat`/`test`/`docs`/`refactor`/`chore`).

---

## Task 1: Tip pools — `src/character/tips.ts`

**Files:**
- Create: `src/character/tips.ts`
- Test: `src/character/__tests__/tips.test.ts`

The tip pools render through the existing `data-lang` toggle in `src/lang.ts`. EN and JA are ported verbatim from the prototype's `mamoru-scenarios.jsx` (QUAKE_TIPS, BAG_TIPS, MAP_TIPS) and `mascot.jsx` (DISASTER_FACTS). FIRSTAID_TIPS and TYPHOON_TIPS are newly written here, calibrated to the actual category/level IDs in `first-aid.ts` and `typhoon.ts`. ID translations are written fresh, conversational and short.

- [ ] **Step 1: Write the failing test**

File: `src/character/__tests__/tips.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import {
  QUAKE_TIPS, BAG_TIPS, MAP_TIPS,
  FIRSTAID_TIPS, TYPHOON_TIPS, DISASTER_FACTS,
} from '../tips';

const ALL_POOLS = {
  QUAKE_TIPS, BAG_TIPS, MAP_TIPS,
  FIRSTAID_TIPS, TYPHOON_TIPS, DISASTER_FACTS,
};

describe('tips', () => {
  it('every pool has at least 3 entries', () => {
    for (const [name, pool] of Object.entries(ALL_POOLS)) {
      expect(pool.length, name).toBeGreaterThanOrEqual(3);
    }
  });

  it('every entry has non-empty en/ja/id strings', () => {
    for (const [name, pool] of Object.entries(ALL_POOLS)) {
      pool.forEach((t, i) => {
        expect(t.en, `${name}[${i}].en`).toBeTruthy();
        expect(t.ja, `${name}[${i}].ja`).toBeTruthy();
        expect(t.id, `${name}[${i}].id`).toBeTruthy();
      });
    }
  });

  it('strings stay under 110 characters (bubble fits one line)', () => {
    for (const [name, pool] of Object.entries(ALL_POOLS)) {
      pool.forEach((t, i) => {
        expect(t.en.length, `${name}[${i}].en`).toBeLessThanOrEqual(110);
        expect(t.id.length, `${name}[${i}].id`).toBeLessThanOrEqual(110);
      });
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/tips.test.ts`
Expected: FAIL — `Cannot find module '../tips'`.

- [ ] **Step 3: Write the implementation**

File: `src/character/tips.ts`

```ts
export interface Tip { en: string; ja: string; id: string; }

// Ported verbatim (EN/JA) from mamoru-scenarios.jsx lines 7-19; ID translations new.
export const QUAKE_TIPS: Tip[] = [
  { en: "Drop, Cover, Hold On — get under a sturdy table fast.",        ja: "落ちて・隠れて・待機",    id: "Tiarap, lindungi, tahan — segera ke bawah meja kokoh." },
  { en: "Stay away from windows. Glass is the #1 quake injury.",         ja: "窓から離れて",          id: "Jauhi jendela. Kaca adalah cedera gempa nomor satu." },
  { en: "Don't run outside mid-shake. Falling tiles kill.",              ja: "建物の外は危険",        id: "Jangan lari keluar saat gempa. Genteng jatuh berbahaya." },
  { en: "After shaking stops, open the door — frames warp shut.",        ja: "ドアを開けて避難路確保",  id: "Setelah getaran berhenti, buka pintu — kusen bisa macet." },
  { en: "1995 Kobe quake: 6,434 lives lost in 20 seconds.",              ja: "阪神・淡路大震災 1995",  id: "Gempa Kobe 1995: 6.434 jiwa hilang dalam 20 detik." },
  { en: "Kobe rebuilt with new seismic codes. Buildings now bend, not break.", ja: "神戸は強くなった",   id: "Kobe dibangun ulang dengan standar tahan gempa baru." },
  { en: "If outside, crouch in open ground — away from walls & vending machines.", ja: "壁から離れて", id: "Jika di luar, jongkok di tempat terbuka — jauh dari tembok." },
  { en: "Turn off gas at the meter — Kobe '95 lost 7,000 homes to fire.", ja: "ガスを止めて",         id: "Matikan gas di meteran — Kobe '95 kehilangan 7.000 rumah karena api." },
  { en: "Wear shoes — broken glass everywhere after a big one.",         ja: "靴を履いて",            id: "Pakai sepatu — pecahan kaca di mana-mana setelah gempa besar." },
  { en: "Tsunami may follow. Move to high ground, don't wait for sirens.", ja: "津波は早く・高く",     id: "Tsunami bisa menyusul. Naik ke tempat tinggi, jangan tunggu sirine." },
  { en: "Mt. Rokko's granite makes Kobe quakes feel sharper than Tokyo.", ja: "六甲山の地質",         id: "Granit Gunung Rokko membuat gempa Kobe terasa lebih tajam dari Tokyo." },
  { en: "Charge your phone now — power may go for 3+ days.",             ja: "携帯を充電",           id: "Isi daya ponsel sekarang — listrik bisa padam 3+ hari." },
];

// Ported verbatim (EN/JA) from mamoru-scenarios.jsx lines 21-27.
export const BAG_TIPS: Tip[] = [
  { en: "Aim for under 10kg. You'll carry this for hours.",     ja: "10kg以下で",        id: "Targetkan di bawah 10kg. Anda akan membawanya berjam-jam." },
  { en: "Water first. 3L per person, per day.",                 ja: "水が一番",          id: "Air dulu. 3 liter per orang per hari." },
  { en: "Pack copies of your residence card & passport.",       ja: "在留カードのコピーを", id: "Bawa fotokopi kartu izin tinggal dan paspor." },
  { en: "Whistle saves voice — three blasts means SOS.",        ja: "ホイッスル三回はSOS", id: "Peluit hemat suara — tiga tiupan berarti SOS." },
  { en: "Cash. ATMs failed for 5 days in Kobe '95.",            ja: "現金も忘れずに",     id: "Uang tunai. ATM mati 5 hari saat Kobe '95." },
];

// Ported verbatim (EN/JA) from mamoru-scenarios.jsx lines 28-32.
export const MAP_TIPS: Tip[] = [
  { en: "Schools = primary shelters. Look for 避難所 sign.",     ja: "学校は避難所",       id: "Sekolah = tempat pengungsian utama. Cari papan 避難所." },
  { en: "Walk, don't drive — Kobe '95 had 100km of jammed roads.", ja: "歩いて避難",       id: "Jalan kaki, jangan menyetir — Kobe '95 macet 100km." },
  { en: "Take the route you've practiced. New paths lose you.",  ja: "知ってる道で",      id: "Pakai rute yang sudah Anda latih. Jalan baru bisa menyesatkan." },
];

// New pool — calibrated to category IDs in src/first-aid.ts
// (bleeding / burns / fractures / crush / cpr / shock / smoke / psychological).
export const FIRSTAID_TIPS: Tip[] = [
  { en: "Bleeding: firm direct pressure beats any fancy bandage.",        ja: "出血は直接圧迫が最強",    id: "Pendarahan: tekanan langsung yang kuat lebih ampuh dari perban mewah." },
  { en: "Burn? Cool water for 20 minutes. Never ice, butter, or toothpaste.", ja: "やけどは流水20分",     id: "Luka bakar? Air sejuk 20 menit. Jangan es, mentega, atau pasta gigi." },
  { en: "CPR: push hard, push fast — 100-120 per minute, 5-6cm deep.",     ja: "胸骨圧迫は強く速く",    id: "CPR: tekan keras, tekan cepat — 100-120/menit, dalam 5-6cm." },
  { en: "AEDs in Japan: train stations, konbini, schools. Green heart sign.", ja: "AEDは緑のハート",     id: "AED di Jepang: stasiun, minimarket, sekolah. Tanda hati hijau." },
  { en: "Smoke: get low, cover mouth with wet cloth, follow green exit signs.", ja: "煙では低く濡れ布で", id: "Asap: merendah, tutup mulut dengan kain basah, ikuti tanda hijau." },
  { en: "Shock: lay them flat, elevate legs, blanket on top, no food/drink.", ja: "ショック対応は寝かせて足上げ", id: "Syok: baringkan, angkat kaki, selimuti, jangan beri makan/minum." },
  { en: "Crush injury > 15 min: DO NOT free them. Call 119 immediately.",   ja: "圧挫15分超は自力で救出しない", id: "Cedera himpitan > 15 menit: JANGAN bebaskan sendiri. Hubungi 119." },
  { en: "Panic? Try 4-4-4 breathing: in 4, hold 4, out 4.",                ja: "パニック時は4-4-4呼吸",  id: "Panik? Coba napas 4-4-4: tarik 4, tahan 4, buang 4." },
];

// New pool — typhoonScale has 5 levels (Tropical Storm → Violent Typhoon).
export const TYPHOON_TIPS: Tip[] = [
  { en: "Tropical storm: secure balcony items, charge devices, check the forecast.", ja: "熱帯低気圧: ベランダを片付け", id: "Badai tropis: rapikan balkon, isi daya gawai, cek prakiraan." },
  { en: "Severe storm: tape windows in an X, fill the bathtub, top up water.", ja: "強い暴風: 窓に養生テープ",   id: "Badai parah: lakban jendela bentuk X, isi bak mandi, sediakan air." },
  { en: "Typhoon class: stay home if possible, evacuate before winds peak.", ja: "台風: 強風がピーク前に避難",  id: "Kelas topan: tetap di rumah jika bisa, mengungsi sebelum angin puncak." },
  { en: "Very strong: power may be out for days — prepare cash, food, batteries.", ja: "非常に強い: 停電に備える", id: "Sangat kuat: listrik bisa padam berhari — siapkan tunai, makanan, baterai." },
  { en: "Violent typhoon: stay indoors at all costs. No 'quick errands'.",   ja: "猛烈な台風: 絶対に外出禁止",  id: "Topan dahsyat: tetap di dalam bagaimanapun. Jangan keluar sebentar." },
];

// Ported verbatim (EN/JA) from mascot.jsx lines 6-22.
export const DISASTER_FACTS: Tip[] = [
  { en: "1995 Hanshin-Awaji quake reached shindo 7. Kobe lost 6,434 lives in 20 seconds.", ja: "阪神・淡路大震災 — 震度7", id: "Gempa Hanshin-Awaji 1995 mencapai shindo 7. Kobe kehilangan 6.434 jiwa dalam 20 detik." },
  { en: "Falling furniture causes ~30% of quake injuries. Strap your bookshelves.", ja: "家具を固定して", id: "Furnitur jatuh sebabkan ~30% cedera gempa. Ikat rak buku Anda." },
  { en: "Japan has free hazard maps online. Check yours before signing a lease!", ja: "ハザードマップを確認", id: "Jepang punya peta bahaya gratis online. Cek sebelum tanda tangan kontrak!" },
  { en: "Teens & elderly take the heaviest casualties in big quakes — drill with them.", ja: "若者と高齢者を守る", id: "Remaja & lansia paling banyak korban di gempa besar — latih mereka." },
  { en: "Gas leaks kill more than shaking does — turn off the meter after a quake.", ja: "ガスを止めて", id: "Kebocoran gas lebih mematikan dari guncangan — matikan meteran setelah gempa." },
  { en: "2011 Tōhoku tsunami waves reached 40 meters in some bays.",  ja: "津波 — 最大40m",   id: "Tsunami Tōhoku 2011 mencapai 40 meter di beberapa teluk." },
  { en: "SMS gets through when calls don't. Tell family you're OK by text.", ja: "災害時はSMSで", id: "SMS lolos saat telepon gagal. Kabari keluarga via teks." },
  { en: "Pack 72 hours of supplies. Rescue often arrives on day 3.",   ja: "72時間分の備蓄",   id: "Siapkan persediaan 72 jam. Tim penyelamat sering tiba di hari ke-3." },
  { en: "Most quake injuries hit people running outside. Stay, drop, cover.", ja: "走って外へは危険", id: "Kebanyakan cedera gempa terjadi pada yang lari keluar. Diam, tiarap, lindungi." },
  { en: "Mt. Rokko's hard granite makes Kobe quakes feel sharper than Tokyo's.", ja: "六甲山の地質", id: "Granit Gunung Rokko buat gempa Kobe terasa lebih tajam dari Tokyo." },
  { en: "Tsunami warning to first wave: 8–25 min in Tōhoku 2011. Move now.", ja: "津波は早く来る", id: "Dari peringatan tsunami ke gelombang pertama: 8–25 menit di Tōhoku 2011. Bergerak sekarang." },
  { en: "Three whistle blasts = SOS. Saves your voice when buried.",   ja: "笛3回でSOS",      id: "Tiga tiupan peluit = SOS. Hemat suara saat tertimbun." },
  { en: "ATMs failed for 5 days in Kobe '95. Always keep some cash.",  ja: "現金も忘れずに",   id: "ATM mati 5 hari saat Kobe '95. Selalu sediakan uang tunai." },
  { en: "Japanese schools drill quakes monthly — that's why kids react fast.", ja: "毎月の防災訓練", id: "Sekolah Jepang latihan gempa setiap bulan — karena itu anak cepat tanggap." },
  { en: "Tape an X on windows in typhoons — keeps glass from spraying inward.", ja: "台風前の養生テープ", id: "Lakban jendela bentuk X saat topan — kaca tak menyebar ke dalam." },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/tips.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/character/tips.ts src/character/__tests__/tips.test.ts
git commit -m "feat: add character tip pools with EN/JA/ID translations"
```

---

## Task 2: Reduced-motion gate — `src/character/motion.ts`

**Files:**
- Create: `src/character/motion.ts`
- Test: `src/character/__tests__/motion.test.ts`

A small utility: `motionAllowed()` reads media query + localStorage; `onMotionChange(cb)` subscribes to either changing. Existing project storage key is `a11y-reduced-motion` (declared in `src/storage.ts:34`).

- [ ] **Step 1: Write the failing test**

File: `src/character/__tests__/motion.test.ts`

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

function mockMatchMedia(reducedMotion: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches: reducedMotion,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  };
  (globalThis as any).window = (globalThis as any).window ?? {};
  (globalThis as any).window.matchMedia = () => mql;
  return { mql, fire: (next: boolean) => {
    mql.matches = next;
    listeners.forEach(l => l({ matches: next } as MediaQueryListEvent));
  }};
}

describe('motion', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('motionAllowed returns true when neither flag is set', async () => {
    mockMatchMedia(false);
    const { motionAllowed } = await import('../motion');
    expect(motionAllowed()).toBe(true);
  });

  it('motionAllowed returns false when system prefers reduced', async () => {
    mockMatchMedia(true);
    const { motionAllowed } = await import('../motion');
    expect(motionAllowed()).toBe(false);
  });

  it('motionAllowed returns false when storage key is true', async () => {
    mockMatchMedia(false);
    localStorage.setItem('a11y-reduced-motion', 'true');
    const { motionAllowed } = await import('../motion');
    expect(motionAllowed()).toBe(false);
  });

  it('onMotionChange fires on media-query change', async () => {
    const { fire } = mockMatchMedia(false);
    const { onMotionChange } = await import('../motion');
    const cb = vi.fn();
    onMotionChange(cb);
    fire(true);
    expect(cb).toHaveBeenCalledWith(false);
    fire(false);
    expect(cb).toHaveBeenLastCalledWith(true);
  });

  it('onMotionChange fires on storage event', async () => {
    mockMatchMedia(false);
    const { onMotionChange } = await import('../motion');
    const cb = vi.fn();
    onMotionChange(cb);
    localStorage.setItem('a11y-reduced-motion', 'true');
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'a11y-reduced-motion', newValue: 'true',
    }));
    expect(cb).toHaveBeenCalledWith(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/motion.test.ts`
Expected: FAIL — `Cannot find module '../motion'`.

- [ ] **Step 3: Write the implementation**

File: `src/character/motion.ts`

```ts
const STORAGE_KEY = 'a11y-reduced-motion';
const MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

export function motionAllowed(): boolean {
  if (typeof window === 'undefined') return true;
  const mql = window.matchMedia(MEDIA_QUERY);
  if (mql.matches) return false;
  if (localStorage.getItem(STORAGE_KEY) === 'true') return false;
  return true;
}

export function onMotionChange(cb: (allowed: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(MEDIA_QUERY);
  const onMql = () => cb(motionAllowed());
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb(motionAllowed());
  };
  mql.addEventListener('change', onMql);
  window.addEventListener('storage', onStorage);
  return () => {
    mql.removeEventListener('change', onMql);
    window.removeEventListener('storage', onStorage);
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/motion.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/character/motion.ts src/character/__tests__/motion.test.ts
git commit -m "feat: add reduced-motion gate honoring system + storage key"
```

---

## Task 3: Sprite core — `src/character/sprite.ts`

**Files:**
- Create: `src/character/sprite.ts`
- Test: `src/character/__tests__/sprite.test.ts`

This is the visual heart. Port `MiniMamoru` from `mamoru-scenarios.jsx:58-290` to a vanilla-TS function returning `SVGSVGElement`. Casual outfit only (drop the `yukata`/`college`/`batik` branches). Sprite is keyed by a `data-pose` attribute so tests can assert pose changes.

- [ ] **Step 1: Write the failing test**

File: `src/character/__tests__/sprite.test.ts`

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createSprite, updateSprite, POSES } from '../sprite';

describe('sprite', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a 64x96 SVG with crispEdges', () => {
    const svg = createSprite({ pose: 'stand', gender: 'male' });
    expect(svg.tagName).toBe('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 64 96');
    expect(svg.getAttribute('shape-rendering')).toBe('crispEdges');
  });

  it('sets data-pose and data-gender attributes', () => {
    const svg = createSprite({ pose: 'brace', gender: 'female' });
    expect(svg.dataset.pose).toBe('brace');
    expect(svg.dataset.gender).toBe('female');
  });

  it('renders all 14 poses without throwing', () => {
    for (const pose of POSES) {
      const svg = createSprite({ pose, gender: 'male' });
      expect(svg.querySelectorAll('rect').length).toBeGreaterThan(10);
    }
  });

  it('renders both genders without throwing', () => {
    for (const gender of ['male', 'female'] as const) {
      const svg = createSprite({ pose: 'stand', gender });
      expect(svg.querySelectorAll('rect').length).toBeGreaterThan(10);
    }
  });

  it('renders female hair ribbon in persimmon', () => {
    const svg = createSprite({ pose: 'stand', gender: 'female' });
    const fills = Array.from(svg.querySelectorAll('rect'))
      .map(r => r.getAttribute('fill')?.toLowerCase());
    expect(fills).toContain('#f5a623');
  });

  it('uses no anti-aliasing on any nested SVG element', () => {
    const svg = createSprite({ pose: 'stand', gender: 'male' });
    svg.querySelectorAll('[shape-rendering]').forEach(el => {
      expect(el.getAttribute('shape-rendering')).toBe('crispEdges');
    });
  });

  it('updateSprite changes data-pose in place', () => {
    const svg = createSprite({ pose: 'stand', gender: 'male' });
    updateSprite(svg, { pose: 'cover' });
    expect(svg.dataset.pose).toBe('cover');
    // Body geometry should change: cover has wider stance.
    const rectCount = svg.querySelectorAll('rect').length;
    expect(rectCount).toBeGreaterThan(10);
  });

  it('persimmon (#f5a623) appears as the only saturated accent on casual male', () => {
    const svg = createSprite({ pose: 'stand', gender: 'male' });
    const fills = new Set(
      Array.from(svg.querySelectorAll('rect'))
        .map(r => r.getAttribute('fill')?.toLowerCase() ?? '')
    );
    // Casual male: skin/skin-shadow, hair, tee/tee-shadow, pants/pants-shadow, persimmon, ink, hands.
    // Should NOT contain college (#1a3a6a), yukata cream (#f6f4ef), batik (#7a4818), red tie (#c43818).
    expect(fills.has('#c43818')).toBe(false);
    expect(fills.has('#7a4818')).toBe(false);
    expect(fills.has('#1a3a6a')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/sprite.test.ts`
Expected: FAIL — `Cannot find module '../sprite'`.

- [ ] **Step 3: Write the implementation**

File: `src/character/sprite.ts`

```ts
export type Pose =
  | 'stand' | 'brace' | 'cover' | 'hide' | 'headcover'
  | 'crouch' | 'kneel' | 'run' | 'walk' | 'tired'
  | 'phone' | 'reach' | 'thrust' | 'choke';
export type Gender = 'male' | 'female';
export type Emote =
  | 'idle' | 'wave' | 'jump' | 'spin' | 'peace' | 'burst' | 'bow';

export const POSES: Pose[] = [
  'stand', 'brace', 'cover', 'hide', 'headcover',
  'crouch', 'kneel', 'run', 'walk', 'tired',
  'phone', 'reach', 'thrust', 'choke',
];

export interface SpriteOptions {
  pose: Pose;
  gender: Gender;
  emote?: Emote;
  flip?: boolean;
  tilt?: number;
  blink?: boolean;
  pupil?: { x: number; y: number };
}

// Casual-outfit palette (from Character Bible HANDOFF_PROMPT.md §"Color palette").
const PALETTE = {
  skin: '#f5d5a8',
  skinShadow: '#e0b888',
  hands: '#f0c8a0',
  hair: '#2a1a08',
  hairTip: '#3a2a18',
  earring: '#ffd070',
  ink: '#1a1a1a',
  tee: '#4a8aba',
  teeShadow: '#2a5a8a',
  pants: '#1a1a3a',
  pantsShadow: '#0a0a1a',
  persimmon: '#f5a623',
  eyeWhite: '#ffffff',
} as const;

const SVG_NS = 'http://www.w3.org/2000/svg';

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    e.setAttribute(k, String(v));
  }
  return e;
}

function rect(x: number, y: number, w: number, h: number, fill: string, opacity?: number): SVGRectElement {
  const r = el('rect', { x, y, width: w, height: h, fill });
  if (opacity !== undefined) r.setAttribute('opacity', String(opacity));
  return r;
}

// Pose presets — ported from mamoru-scenarios.jsx:66-95.
function armRotations(pose: Pose): [number, number] {
  const L =
    pose === 'headcover' ? -150 :
    pose === 'brace' ? -90 :
    pose === 'cover' ? -130 :
    pose === 'hide'  ? -150 :
    pose === 'crouch' ? -40 :
    pose === 'choke'  ? -140 :
    pose === 'phone'  ? -150 :
    pose === 'reach'  ? -60 :
    pose === 'kneel'  ? -30 :
    pose === 'thrust' ? -100 :
    pose === 'run'    ? -25 :
    pose === 'tired'  ? 10 : 0;
  const R =
    pose === 'headcover' ?  150 :
    pose === 'brace' ?  90 :
    pose === 'cover' ?  130 :
    pose === 'hide'  ?  150 :
    pose === 'crouch' ?  40 :
    pose === 'choke'  ?  140 :
    pose === 'phone'  ?  20 :
    pose === 'reach'  ?  60 :
    pose === 'kneel'  ?  30 :
    pose === 'thrust' ?  100 :
    pose === 'run'    ?  25 :
    pose === 'tired'  ? -10 : 0;
  return [L, R];
}

function crouchTransform(pose: Pose): { y: number; scale: number } {
  const y =
    pose === 'crouch' ? 14 :
    pose === 'hide'   ? 22 :
    pose === 'cover'  ? 18 :
    pose === 'headcover' ? 8 :
    pose === 'kneel'  ? 16 : 0;
  const scale = (pose === 'hide' || pose === 'crouch' || pose === 'kneel') ? 0.85 : 1;
  return { y, scale };
}

// Builds the body group — legs, torso, arms, head, eyes, mouth — into a parent <g>.
function buildBody(parent: SVGGElement, opts: SpriteOptions): void {
  const { pose, gender } = opts;
  const isTired = pose === 'tired';
  const [armL, armR] = armRotations(pose);

  // Legs (geometry branches per pose) — port of mamoru-scenarios.jsx:102-132.
  if (pose === 'hide' || pose === 'crouch') {
    parent.append(
      rect(20, 74, 10, 10, PALETTE.pants),
      rect(34, 74, 10, 10, PALETTE.pants),
      rect(18, 82, 14, 4, PALETTE.ink),
      rect(32, 82, 14, 4, PALETTE.ink),
    );
  } else if (pose === 'kneel') {
    parent.append(
      rect(18, 76, 14, 6, PALETTE.pants),
      rect(34, 68, 10, 14, PALETTE.pants),
      rect(16, 80, 18, 4, PALETTE.ink),
      rect(32, 80, 14, 4, PALETTE.ink),
    );
  } else if (pose === 'cover') {
    parent.append(
      rect(18, 68, 12, 14, PALETTE.pants),
      rect(34, 68, 12, 14, PALETTE.pants),
      rect(16, 80, 16, 4, PALETTE.ink),
      rect(32, 80, 16, 4, PALETTE.ink),
    );
  } else {
    parent.append(
      rect(22, 68, 8, 18, PALETTE.pants),
      rect(34, 68, 8, 18, PALETTE.pants),
      rect(22, 68, 2, 18, PALETTE.pantsShadow),
      rect(34, 68, 2, 18, PALETTE.pantsShadow),
      rect(20, 84, 12, 4, PALETTE.ink),
      rect(32, 84, 12, 4, PALETTE.ink),
    );
  }

  // Torso (casual tee + persimmon logo) — port of mamoru-scenarios.jsx:135-185.
  parent.append(
    rect(18, 44, 28, 26, PALETTE.tee),
    rect(18, 44, 3, 26, PALETTE.teeShadow),
    rect(43, 44, 3, 26, PALETTE.teeShadow),
    rect(28, 52, 8, 3, PALETTE.persimmon),
    rect(30, 56, 4, 2, PALETTE.persimmon),
  );

  // Left arm — rotated about pivot (20, 48); port of mamoru-scenarios.jsx:203-207.
  const lArm = el('g', { transform: `rotate(${armL} 20 48)` });
  lArm.append(
    rect(14, 46, 6, 16, PALETTE.tee),
    rect(14, 46, 2, 16, PALETTE.teeShadow),
    rect(13, 60, 8, 6, PALETTE.hands),
  );
  parent.appendChild(lArm);

  // Right arm — rotated about pivot (44, 48); port of mamoru-scenarios.jsx:208-212.
  const rArm = el('g', { transform: `rotate(${armR} 44 48)` });
  rArm.append(
    rect(44, 46, 6, 16, PALETTE.tee),
    rect(48, 46, 2, 16, PALETTE.teeShadow),
    rect(43, 60, 8, 6, PALETTE.hands),
  );
  parent.appendChild(rArm);

  // Head — port of mamoru-scenarios.jsx:215-217.
  parent.append(
    rect(22, 22, 20, 22, PALETTE.skin),
    rect(22, 22, 3, 22, PALETTE.skinShadow),
    rect(22, 42, 20, 2, PALETTE.skinShadow),
  );

  // Hair — port of mamoru-scenarios.jsx:219-248.
  if (gender === 'female') {
    parent.append(
      rect(18, 18, 28, 6, PALETTE.hair),
      rect(20, 14, 24, 6, PALETTE.hair),
      rect(24, 12, 16, 4, PALETTE.hair),
      rect(22, 22, 10, 4, PALETTE.hair),
      rect(34, 22, 6, 3, PALETTE.hair),
      rect(18, 24, 5, 22, PALETTE.hair),
      rect(41, 24, 5, 22, PALETTE.hair),
      rect(18, 46, 3, 3, PALETTE.hairTip),
      rect(43, 46, 3, 3, PALETTE.hairTip),
      // Persimmon ribbon (the female persimmon accent).
      rect(38, 14, 8, 4, PALETTE.persimmon),
      rect(40, 12, 4, 2, PALETTE.persimmon),
      rect(42, 14, 2, 4, PALETTE.eyeWhite, 0.4),
      // Gold earrings.
      rect(20, 34, 2, 2, PALETTE.earring),
      rect(42, 34, 2, 2, PALETTE.earring),
    );
  } else {
    parent.append(
      rect(20, 18, 24, 8, PALETTE.hair),
      rect(22, 16, 20, 4, PALETTE.hair),
      rect(26, 14, 12, 4, PALETTE.hair),
    );
  }

  // Eyes — port of mamoru-scenarios.jsx:251-268. Closed for hide/tired, wide for brace/cover.
  if (pose === 'hide' || isTired) {
    parent.append(
      rect(26, 32, 4, 1, PALETTE.ink),
      rect(34, 32, 4, 1, PALETTE.ink),
    );
  } else if (pose === 'brace' || pose === 'cover') {
    parent.append(
      rect(26, 30, 4, 4, PALETTE.eyeWhite),
      rect(34, 30, 4, 4, PALETTE.eyeWhite),
      rect(27, 31, 2, 2, PALETTE.ink),
      rect(35, 31, 2, 2, PALETTE.ink),
    );
  } else {
    parent.append(
      rect(27, 31, 2, 2, PALETTE.ink),
      rect(35, 31, 2, 2, PALETTE.ink),
    );
  }

  // Mouth — port of mamoru-scenarios.jsx:270-276.
  if (pose === 'brace' || pose === 'cover' || pose === 'hide') {
    parent.appendChild(rect(29, 38, 6, 2, PALETTE.ink));
  } else if (isTired) {
    parent.appendChild(rect(28, 38, 8, 1, PALETTE.ink));
  } else {
    parent.appendChild(rect(30, 38, 4, 1, PALETTE.ink));
  }
}

function fillSvg(svg: SVGSVGElement, opts: SpriteOptions): void {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.dataset.pose = opts.pose;
  svg.dataset.gender = opts.gender;
  if (opts.emote && opts.emote !== 'idle') svg.dataset.emote = opts.emote;
  else delete svg.dataset.emote;
  if (opts.blink) svg.dataset.blink = 'true';
  else delete svg.dataset.blink;

  const { y: crouchY, scale } = crouchTransform(opts.pose);
  const flipScaleX = opts.flip ? -1 : 1;
  const flipTx = opts.flip ? 64 : 0;
  const tilt = opts.tilt ? ` rotate(${opts.tilt} 32 64)` : '';

  // Shadow ellipse under the feet.
  const shadow = el('ellipse', {
    cx: 32, cy: 92, rx: 14, ry: 2.5, fill: '#000000', opacity: 0.3,
  });
  svg.appendChild(shadow);

  const outer = el('g', {
    transform: `translate(${flipTx},${crouchY}) scale(${flipScaleX} ${scale})${tilt}`,
  });
  buildBody(outer, opts);
  svg.appendChild(outer);
}

export function createSprite(opts: SpriteOptions): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
  svg.setAttribute('viewBox', '0 0 64 96');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('width', '64');
  svg.setAttribute('height', '96');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('mamoru-sprite');
  fillSvg(svg, opts);
  return svg;
}

export function updateSprite(svg: SVGSVGElement, partial: Partial<SpriteOptions>): void {
  const next: SpriteOptions = {
    pose: (svg.dataset.pose as Pose) ?? 'stand',
    gender: (svg.dataset.gender as Gender) ?? 'male',
    ...partial,
  };
  fillSvg(svg, next);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/sprite.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/character/sprite.ts src/character/__tests__/sprite.test.ts
git commit -m "feat: add Moru & Mamo SVG sprite builder with 14 poses"
```

---

## Task 4: Character CSS — `css/character.css`

**Files:**
- Create: `css/character.css`
- Modify: `index.html` (add `<link>` tag in `<head>`)

No tests — visual CSS, asserted via the smoke check in Task 12.

- [ ] **Step 1: Write the implementation**

File: `css/character.css`

```css
/* Mamoru character system — sprite, mascot, tip bubble, scene base. */

.mamoru-sprite {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  shape-rendering: crispEdges;
  display: block;
}

.character-scene {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin: 16px 0;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 400ms ease, transform 400ms ease;
}
.section.visible .character-scene { opacity: 1; transform: none; }

.tip-bubble {
  position: relative;
  max-width: 280px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--surface, #1a1a2e);
  color: var(--text, #f6f4ef);
  font-size: 13px;
  line-height: 1.4;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}
.tip-bubble::before {
  content: '';
  position: absolute;
  left: -8px; top: 18px;
  border: 6px solid transparent;
  border-right-color: var(--surface, #1a1a2e);
}

/* Hero mascot — bigger, with motion. */
.mascot {
  position: relative;
  width: 128px;
  height: 192px;
  cursor: pointer;
  user-select: none;
}
.mascot .mamoru-sprite {
  width: 128px;
  height: 192px;
}
.mascot.bobbing { animation: mamoru-bob 1.6s ease-in-out infinite; }
@keyframes mamoru-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
.mascot-fact {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 12px;
  white-space: nowrap;
}

.mascot-heart {
  position: absolute;
  pointer-events: none;
  font-size: 14px;
  color: #f5a623;
  animation: mamoru-heart 900ms ease-out forwards;
}
@keyframes mamoru-heart {
  0% { opacity: 1; transform: translate(0, 0); }
  100% { opacity: 0; transform: translate(var(--dx, 0), -40px); }
}
.mascot-ripple {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(245, 166, 35, 0.6);
  pointer-events: none;
  animation: mamoru-ripple 600ms ease-out forwards;
}
@keyframes mamoru-ripple {
  0% { width: 8px; height: 8px; opacity: 1; }
  100% { width: 80px; height: 80px; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .character-scene { transition: none; opacity: 1; transform: none; }
  .mascot.bobbing { animation: none; }
  .mascot-heart, .mascot-ripple { animation: none; display: none; }
}
```

- [ ] **Step 2: Add the stylesheet link to `index.html`**

In `index.html`, find the existing CSS `<link>` tags (around lines 15-30) and add this line after `<link rel="stylesheet" href="/mamoru-guide/css/responsive.css">` (or after the last existing CSS link):

```html
<link rel="stylesheet" href="/mamoru-guide/css/character.css">
```

Use grep to locate the exact insertion point: `grep -n 'rel="stylesheet"' index.html` and place the new line after the last result inside `<head>`.

- [ ] **Step 3: Verify the dev server still boots**

Run: `npm run dev` (then Ctrl-C). Expected: server starts at `http://localhost:5173/mamoru-guide/` with no console errors. Open the page once and confirm the page renders unchanged.

- [ ] **Step 4: Commit**

```bash
git add css/character.css index.html
git commit -m "feat: add character.css sprite + tip-bubble + mascot styles"
```

---

## Task 5: HTML mount points + main.ts wiring stubs

**Files:**
- Modify: `index.html` (add 5 new mount divs)
- Modify: `src/main.ts` (add 6 import + init calls)
- Create: `src/character/mascot.ts` (stub)
- Create: `src/character/earthquake-scene.ts` (stub)
- Create: `src/character/firstaid-scene.ts` (stub)
- Create: `src/character/typhoon-scene.ts` (stub)
- Create: `src/character/bag-scene.ts` (stub)
- Create: `src/character/bible.ts` (stub)

Stubs are no-ops that look up their mount element and return — so the rest of the app keeps booting cleanly while later tasks fill them in.

- [ ] **Step 1: Add mount divs to `index.html`**

Use grep to locate each section, then add the mount div as the FIRST child of that section's content area.

For `<section class="section" id="earthquake">` (around line 322): inside it, after the section's existing intro paragraph (the first `<p>` or `<header>`), insert:

```html
<div id="earthquake-scene" class="character-scene"></div>
```

Repeat for the other four sections:
- `<section class="section" id="bag">` → insert `<div id="bag-scene" class="character-scene"></div>`
- `<section class="section" id="typhoon">` → insert `<div id="typhoon-scene" class="character-scene"></div>`
- `<section class="section" id="firstaid">` → insert `<div id="firstaid-scene" class="character-scene"></div>`
- `<section class="hero night-sky" id="hero">` (around line 95) → insert `<div id="mascot" class="mascot" aria-hidden="true"></div>` AFTER the existing `<div class="skyline">` element.

- [ ] **Step 2: Create the six stub modules**

File: `src/character/mascot.ts`

```ts
export function initMascot(): void {
  const host = document.getElementById('mascot');
  if (!host) return;
}
```

File: `src/character/earthquake-scene.ts`

```ts
export function initEarthquakeScene(): void {
  const host = document.getElementById('earthquake-scene');
  if (!host) return;
}
```

File: `src/character/firstaid-scene.ts`

```ts
export function initFirstAidScene(): void {
  const host = document.getElementById('firstaid-scene');
  if (!host) return;
}
```

File: `src/character/typhoon-scene.ts`

```ts
export function initTyphoonScene(): void {
  const host = document.getElementById('typhoon-scene');
  if (!host) return;
}
```

File: `src/character/bag-scene.ts`

```ts
export function initBagScene(): void {
  const host = document.getElementById('bag-scene');
  if (!host) return;
}
```

File: `src/character/bible.ts`

```ts
export function initBible(): void {
  const host = document.getElementById('bible');
  if (!host) return;
}
```

- [ ] **Step 3: Wire the inits in `src/main.ts`**

Open `src/main.ts`. Add these imports after the existing imports block (around line 22):

```ts
import { initMascot } from './character/mascot';
import { initEarthquakeScene } from './character/earthquake-scene';
import { initFirstAidScene } from './character/firstaid-scene';
import { initTyphoonScene } from './character/typhoon-scene';
import { initBagScene } from './character/bag-scene';
import { initBible } from './character/bible';
```

Find the function that runs the existing init calls (search for `initEarthquakeScale()` — the call site, not the import). At the bottom of that block, add:

```ts
initMascot();
initEarthquakeScene();
initFirstAidScene();
initTyphoonScene();
initBagScene();
initBible();
```

- [ ] **Step 4: Verify the build still passes**

Run: `npm run build`
Expected: build succeeds. `tsc --noEmit` produces no errors.

- [ ] **Step 5: Commit**

```bash
git add index.html src/main.ts src/character/mascot.ts src/character/earthquake-scene.ts src/character/firstaid-scene.ts src/character/typhoon-scene.ts src/character/bag-scene.ts src/character/bible.ts
git commit -m "feat: wire character module mount points and init stubs"
```

---

## Task 6: Hero mascot — `src/character/mascot.ts`

**Files:**
- Modify: `src/character/mascot.ts`
- Test: `src/character/__tests__/mascot.test.ts`

Replaces the stub. Ports `Mascot` from `mascot.jsx` to vanilla TS: cursor-tracking pupils, blink loop, click emote cycle, fact rotator, hover hearts, tap ripples — all gated by `motionAllowed()`.

- [ ] **Step 1: Write the failing test**

File: `src/character/__tests__/mascot.test.ts`

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '<div id="mascot"></div>';
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false,
    media: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
  vi.useFakeTimers();
});

describe('mascot', () => {
  it('returns early when #mascot is absent', async () => {
    document.body.innerHTML = '';
    const { initMascot } = await import('../mascot');
    expect(() => initMascot()).not.toThrow();
  });

  it('mounts an SVG sprite into #mascot', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const svg = document.querySelector('#mascot svg');
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('data-pose')).toBe('stand');
    expect(svg!.getAttribute('data-gender')).toBe('male');
  });

  it('mounts a fact bubble with EN/JA/ID spans', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const bubble = document.querySelector('#mascot .mascot-fact');
    expect(bubble).toBeTruthy();
    expect(bubble!.querySelector('[data-lang="en"]')).toBeTruthy();
    expect(bubble!.querySelector('[data-lang="ja"]')).toBeTruthy();
    expect(bubble!.querySelector('[data-lang="id"]')).toBeTruthy();
  });

  it('advances to next fact on click', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const host = document.getElementById('mascot')!;
    const en = () => host.querySelector('[data-lang="en"]')!.textContent;
    const before = en();
    host.click();
    expect(en()).not.toBe(before);
  });

  it('rotates facts on a 7s timer', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const host = document.getElementById('mascot')!;
    const en = () => host.querySelector('[data-lang="en"]')!.textContent;
    const before = en();
    vi.advanceTimersByTime(7100);
    expect(en()).not.toBe(before);
  });

  it('reduced motion: no bobbing class, no fact rotation', async () => {
    localStorage.setItem('a11y-reduced-motion', 'true');
    vi.resetModules();
    const { initMascot } = await import('../mascot');
    initMascot();
    const host = document.getElementById('mascot')!;
    expect(host.classList.contains('bobbing')).toBe(false);
    const en = () => host.querySelector('[data-lang="en"]')!.textContent;
    const before = en();
    vi.advanceTimersByTime(20000);
    expect(en()).toBe(before);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/mascot.test.ts`
Expected: FAIL — currently the stub does nothing, so the SVG/fact/click assertions fail.

- [ ] **Step 3: Replace the stub with the full implementation**

File: `src/character/mascot.ts` (replace the stub entirely)

```ts
import { createSprite, updateSprite, type Pose, type Emote } from './sprite';
import { DISASTER_FACTS } from './tips';
import { motionAllowed, onMotionChange } from './motion';

const EMOTE_CYCLE: Emote[] = ['wave', 'jump', 'spin', 'peace', 'burst', 'bow'];
const FACT_INTERVAL_MS = 7000;
const BLINK_MIN_MS = 2400;
const BLINK_MAX_MS = 6000;
const BLINK_DURATION_MS = 130;

export function initMascot(): void {
  const host = document.getElementById('mascot');
  if (!host) return;

  let factIdx = 0;
  let emoteIdx = -1;
  let factTimer: number | null = null;
  let blinkTimer: number | null = null;
  let allowed = motionAllowed();

  const sprite = createSprite({ pose: 'stand', gender: 'male' });
  host.innerHTML = '';
  host.appendChild(sprite);

  // Fact bubble.
  const bubble = document.createElement('div');
  bubble.className = 'mascot-fact tip-bubble';
  const enSpan = document.createElement('span'); enSpan.dataset.lang = 'en';
  const jaSpan = document.createElement('span'); jaSpan.dataset.lang = 'ja';
  const idSpan = document.createElement('span'); idSpan.dataset.lang = 'id';
  bubble.append(enSpan, jaSpan, idSpan);
  host.appendChild(bubble);

  function renderFact(): void {
    const t = DISASTER_FACTS[factIdx];
    enSpan.textContent = t.en;
    jaSpan.textContent = t.ja;
    idSpan.textContent = t.id;
  }
  renderFact();

  function nextFact(): void {
    factIdx = (factIdx + 1) % DISASTER_FACTS.length;
    renderFact();
  }

  function scheduleFactTimer(): void {
    if (!allowed) return;
    factTimer = window.setInterval(nextFact, FACT_INTERVAL_MS);
  }

  function clearFactTimer(): void {
    if (factTimer !== null) { window.clearInterval(factTimer); factTimer = null; }
  }

  function scheduleBlink(): void {
    if (!allowed) return;
    const delay = BLINK_MIN_MS + Math.random() * (BLINK_MAX_MS - BLINK_MIN_MS);
    blinkTimer = window.setTimeout(() => {
      updateSprite(sprite, { blink: true });
      window.setTimeout(() => {
        updateSprite(sprite, { blink: false });
        scheduleBlink();
      }, BLINK_DURATION_MS);
    }, delay);
  }

  function clearBlink(): void {
    if (blinkTimer !== null) { window.clearTimeout(blinkTimer); blinkTimer = null; }
  }

  function onPointerMove(e: PointerEvent | MouseEvent): void {
    if (!allowed) return;
    const r = host.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.32;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const ang = Math.atan2(dy, dx);
    const dist = Math.min(1, Math.hypot(dx, dy) / 220);
    const px = Math.cos(ang) * dist * 1.5;
    const py = Math.sin(ang) * dist * 1.0;
    updateSprite(sprite, { pupil: { x: px, y: py } });
  }

  function flashEmote(): void {
    emoteIdx = (emoteIdx + 1) % EMOTE_CYCLE.length;
    const emote = EMOTE_CYCLE[emoteIdx];
    updateSprite(sprite, { emote });
    window.setTimeout(() => updateSprite(sprite, { emote: 'idle' }), 600);
  }

  function spawnHeart(x: number, y: number): void {
    if (!allowed) return;
    const heart = document.createElement('span');
    heart.className = 'mascot-heart';
    heart.textContent = '♥';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 30}px`);
    host.appendChild(heart);
    window.setTimeout(() => heart.remove(), 900);
  }

  function spawnRipple(x: number, y: number): void {
    if (!allowed) return;
    const ripple = document.createElement('span');
    ripple.className = 'mascot-ripple';
    ripple.style.left = `${x - 4}px`;
    ripple.style.top = `${y - 4}px`;
    host.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 600);
  }

  host.addEventListener('click', (e) => {
    flashEmote();
    nextFact();
    const r = host.getBoundingClientRect();
    spawnRipple(e.clientX - r.left, e.clientY - r.top);
  });

  host.addEventListener('mouseenter', (e) => {
    const r = host.getBoundingClientRect();
    spawnHeart(e.clientX - r.left, e.clientY - r.top);
  });

  function applyMotion(now: boolean): void {
    allowed = now;
    clearFactTimer();
    clearBlink();
    if (allowed) {
      host.classList.add('bobbing');
      scheduleFactTimer();
      scheduleBlink();
      window.addEventListener('mousemove', onPointerMove);
    } else {
      host.classList.remove('bobbing');
      window.removeEventListener('mousemove', onPointerMove);
      updateSprite(sprite, { pupil: { x: 0, y: 0 }, blink: false });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/mascot.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev` and open `http://localhost:5173/mamoru-guide/`. Confirm: (1) the mascot appears in the hero with a fact bubble; (2) hovering shows a heart pop; (3) clicking advances the fact and shows a ripple. Then enable system reduced-motion (`System Settings → Accessibility → Display → Reduce motion` on macOS) and reload — confirm the mascot is static with no bobbing or auto-rotation. Ctrl-C the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add src/character/mascot.ts src/character/__tests__/mascot.test.ts
git commit -m "feat: hero mascot with cursor pupils, blink, emote cycle, fact rotator"
```

---

## Task 7: Earthquake scene — `src/character/earthquake-scene.ts`

**Files:**
- Modify: `src/character/earthquake-scene.ts`
- Modify: `src/earthquake-scale.ts` (add `dispatchEvent` line)
- Test: `src/character/__tests__/earthquake-scene.test.ts`

The scene listens for `mamoru:shindo` `CustomEvent`s from `earthquake-scale.ts`. Pose maps per the spec table: 0-2 stand, 3 brace, 4-5 cover, 6 hide, 7 headcover. After 4 s of no events, scroll-progress drives the pose instead.

- [ ] **Step 1: Write the failing test**

File: `src/character/__tests__/earthquake-scene.test.ts`

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <section class="section" id="earthquake">
      <div id="earthquake-scene" class="character-scene"></div>
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

describe('earthquake-scene', () => {
  it('returns early when mount is absent', async () => {
    document.body.innerHTML = '';
    const { initEarthquakeScene } = await import('../earthquake-scene');
    expect(() => initEarthquakeScene()).not.toThrow();
  });

  it('mounts an SVG and a tip bubble', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    expect(document.querySelector('#earthquake-scene svg')).toBeTruthy();
    expect(document.querySelector('#earthquake-scene .tip-bubble')).toBeTruthy();
  });

  it('shindo 4 → cover pose', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 4 } }));
    const svg = document.querySelector('#earthquake-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('cover');
  });

  it('shindo 7 → headcover pose', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 7 } }));
    const svg = document.querySelector('#earthquake-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('headcover');
  });

  it('null shindo → returns to scroll-driven default (stand)', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 6 } }));
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: null } }));
    vi.advanceTimersByTime(4100);
    const svg = document.querySelector('#earthquake-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/earthquake-scene.test.ts`
Expected: FAIL — the stub doesn't mount an SVG or listen.

- [ ] **Step 3: Replace the stub with the full implementation**

File: `src/character/earthquake-scene.ts` (replace stub)

```ts
import { createSprite, updateSprite, type Pose } from './sprite';
import { QUAKE_TIPS } from './tips';
import { motionAllowed, onMotionChange } from './motion';

const SCROLL_CURVE: Pose[] = ['stand', 'brace', 'cover', 'hide', 'headcover'];
const STATE_LOCK_MS = 4000;
const SCROLL_TIP_INTERVAL_MS = 4500;

function shindoToPose(shindo: number): Pose {
  if (shindo <= 2) return 'stand';
  if (shindo === 3) return 'brace';
  if (shindo <= 5) return 'cover';
  if (shindo === 6) return 'hide';
  return 'headcover';
}

export function initEarthquakeScene(): void {
  const host = document.getElementById('earthquake-scene');
  if (!host) return;

  const section = host.closest('section') as HTMLElement | null;
  let allowed = motionAllowed();
  let lockTimer: number | null = null;
  let scrollProgress = 0;
  let tipIdx = 0;
  let tipTimer: number | null = null;
  let stateLocked = false;

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
    const t = QUAKE_TIPS[i % QUAKE_TIPS.length];
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

  function onShindo(e: Event): void {
    const ev = e as CustomEvent<{ shindo: number | null }>;
    if (lockTimer !== null) window.clearTimeout(lockTimer);
    if (ev.detail.shindo === null) {
      stateLocked = false;
      applyScroll();
      return;
    }
    stateLocked = true;
    updateSprite(sprite, { pose: shindoToPose(ev.detail.shindo) });
    showTip(ev.detail.shindo); // shindo 0-7 indexes QUAKE_TIPS (12 entries) safely.
    lockTimer = window.setTimeout(() => {
      stateLocked = false;
      applyScroll();
    }, STATE_LOCK_MS);
  }

  function onIntersect(entries: IntersectionObserverEntry[]): void {
    if (!section) return;
    const e = entries[0];
    if (!e) return;
    const vh = window.innerHeight || 800;
    const top = e.boundingClientRect.top;
    const h = e.boundingClientRect.height;
    // Progress: 0 when section's bottom enters viewport, 1 when top exits.
    const p = Math.max(0, Math.min(1, 1 - (top + h) / (vh + h)));
    scrollProgress = p;
    applyScroll();
  }

  let scrollObserver: IntersectionObserver | null = null;
  function rotateTip(): void {
    if (stateLocked) return;
    tipIdx = (tipIdx + 1) % QUAKE_TIPS.length;
    showTip(tipIdx);
  }

  function applyMotion(now: boolean): void {
    allowed = now;
    if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    document.removeEventListener('mamoru:shindo', onShindo);
    if (allowed && section) {
      scrollObserver = new IntersectionObserver(onIntersect, {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
      });
      scrollObserver.observe(section);
      tipTimer = window.setInterval(rotateTip, SCROLL_TIP_INTERVAL_MS);
      document.addEventListener('mamoru:shindo', onShindo);
    } else {
      stateLocked = false;
      updateSprite(sprite, { pose: 'stand' });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/earthquake-scene.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Add the dispatchEvent line to `src/earthquake-scale.ts`**

Open `src/earthquake-scale.ts`. Inside the `toggleShake` function (around lines 21-34), add a `dispatchEvent` call right after the existing `activeShake = i;` / `activeShake = null;` updates. The function should look like this after modification:

```ts
function toggleShake() {
  if (activeShake === i) {
    row.classList.remove(s.shakeClass);
    activeShake = null;
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: null } }));
    return;
  }
  if (activeShake !== null) {
    const prev = sv!.children[activeShake] as HTMLElement;
    prev.classList.remove(scaleData[activeShake].shakeClass);
  }
  row.classList.add(s.shakeClass);
  activeShake = i;
  document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: i } }));
}
```

(`i` is the loop index 0-9; the scene treats indexes ≥ 7 as headcover via `shindoToPose`'s `return 'headcover'` fallback.)

- [ ] **Step 6: Verify nothing else broke**

Run: `npx vitest run` (full test suite).
Expected: all tests pass — including pre-existing tests for earthquake-scale.

- [ ] **Step 7: Manually verify in the browser**

Run: `npm run dev`. Open the page, scroll to the earthquake section, click each shindo row. Confirm the character sprite changes pose accordingly. Ctrl-C when done.

- [ ] **Step 8: Commit**

```bash
git add src/character/earthquake-scene.ts src/character/__tests__/earthquake-scene.test.ts src/earthquake-scale.ts
git commit -m "feat: earthquake scene character reacts to shindo selection + scroll"
```

---

## Task 8: Bag scene — `src/character/bag-scene.ts`

**Files:**
- Modify: `src/character/bag-scene.ts`
- Modify: `src/bag-game.ts` (emit `mamoru:bag-weight` after `updateBagStats`)
- Test: `src/character/__tests__/bag-scene.test.ts`

Bag scene has NO scroll cycle (per spec) — pose is purely state-driven. `ok` → stand, `over` → tired, `perfect` → peace emote one-shot then back to stand.

- [ ] **Step 1: Write the failing test**

File: `src/character/__tests__/bag-scene.test.ts`

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `<div id="bag-scene" class="character-scene"></div>`;
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
  vi.useFakeTimers();
});

describe('bag-scene', () => {
  it('returns early when mount is absent', async () => {
    document.body.innerHTML = '';
    const { initBagScene } = await import('../bag-scene');
    expect(() => initBagScene()).not.toThrow();
  });

  it('mounts SVG starting in stand', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    const svg = document.querySelector('#bag-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });

  it('over → tired', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    document.dispatchEvent(new CustomEvent('mamoru:bag-weight', { detail: { weight: 12, status: 'over' } }));
    const svg = document.querySelector('#bag-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('tired');
  });

  it('perfect briefly shows peace emote, returns to stand', async () => {
    const { initBagScene } = await import('../bag-scene');
    initBagScene();
    document.dispatchEvent(new CustomEvent('mamoru:bag-weight', { detail: { weight: 9.8, status: 'perfect' } }));
    vi.advanceTimersByTime(800);
    const svg = document.querySelector('#bag-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/bag-scene.test.ts`
Expected: FAIL.

- [ ] **Step 3: Replace the stub with the full implementation**

File: `src/character/bag-scene.ts`

```ts
import { createSprite, updateSprite, type Pose } from './sprite';
import { BAG_TIPS } from './tips';
import { motionAllowed, onMotionChange } from './motion';

const PEACE_HOLD_MS = 700;
const TIP_INTERVAL_MS = 4500;

type Status = 'ok' | 'over' | 'perfect';

export function initBagScene(): void {
  const host = document.getElementById('bag-scene');
  if (!host) return;

  let allowed = motionAllowed();
  let peaceTimer: number | null = null;
  let tipIdx = 0;
  let tipTimer: number | null = null;

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
    const t = BAG_TIPS[i % BAG_TIPS.length];
    en.textContent = t.en;
    ja.textContent = t.ja;
    id.textContent = t.id;
  }
  showTip(0);

  function statusToPose(status: Status): Pose {
    if (status === 'over') return 'tired';
    return 'stand';
  }

  function onWeight(e: Event): void {
    const ev = e as CustomEvent<{ weight: number; status: Status }>;
    if (peaceTimer !== null) window.clearTimeout(peaceTimer);
    if (ev.detail.status === 'perfect') {
      updateSprite(sprite, { pose: 'stand', emote: 'peace' });
      peaceTimer = window.setTimeout(() => {
        updateSprite(sprite, { pose: 'stand', emote: 'idle' });
      }, PEACE_HOLD_MS);
    } else {
      updateSprite(sprite, { pose: statusToPose(ev.detail.status), emote: 'idle' });
    }
  }

  function rotateTip(): void {
    tipIdx = (tipIdx + 1) % BAG_TIPS.length;
    showTip(tipIdx);
  }

  function applyMotion(now: boolean): void {
    allowed = now;
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    document.removeEventListener('mamoru:bag-weight', onWeight);
    if (allowed) {
      tipTimer = window.setInterval(rotateTip, TIP_INTERVAL_MS);
      document.addEventListener('mamoru:bag-weight', onWeight);
    } else {
      updateSprite(sprite, { pose: 'stand' });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/bag-scene.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Emit the event from `src/bag-game.ts`**

Open `src/bag-game.ts`. At the bottom of the `updateBagStats` function (around lines 106-116), append:

```ts
const w = getCurrentWeight();
let status: 'ok' | 'over' | 'perfect' = 'ok';
if (w > MAX_BAG_WEIGHT) status = 'over';
else if (w >= 8 && w <= MAX_BAG_WEIGHT) status = 'perfect';
document.dispatchEvent(new CustomEvent('mamoru:bag-weight', { detail: { weight: w, status } }));
```

(Pick the right return location — `updateBagStats` is called every time the user toggles a bag item.)

- [ ] **Step 6: Verify nothing else broke**

Run: `npx vitest run`. Expected: all tests pass.

- [ ] **Step 7: Manually verify**

Run: `npm run dev`. Open bag section, pack items past 10kg → character goes tired. Reset, pack 8-10kg → peace emote flashes. Ctrl-C when done.

- [ ] **Step 8: Commit**

```bash
git add src/character/bag-scene.ts src/character/__tests__/bag-scene.test.ts src/bag-game.ts
git commit -m "feat: bag scene character reacts to pack weight"
```

---

## Task 9: First-aid scene — `src/character/firstaid-scene.ts`

**Files:**
- Modify: `src/character/firstaid-scene.ts`
- Modify: `src/first-aid.ts` (emit `mamoru:firstaid-step` when a category is opened)
- Test: `src/character/__tests__/firstaid-scene.test.ts`

The actual `first-aid.ts` has eight category IDs: `bleeding`, `burns`, `fractures`, `crush`, `cpr`, `shock`, `smoke`, `psychological`. We use Mamo and map: bleeding/fractures/shock/psychological → `kneel`; burns → `reach`; cpr → `thrust`; crush → `phone`; smoke → `crouch`; null → `stand`.

- [ ] **Step 1: Write the failing test**

File: `src/character/__tests__/firstaid-scene.test.ts`

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <section class="section" id="firstaid">
      <div id="firstaid-scene" class="character-scene"></div>
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

describe('firstaid-scene', () => {
  it('mounts with Mamo (female) in stand', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
    expect(svg.getAttribute('data-gender')).toBe('female');
  });

  it('cpr → thrust', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: 'cpr' } }));
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('thrust');
  });

  it('smoke → crouch', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: 'smoke' } }));
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('crouch');
  });

  it('crush → phone', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: 'crush' } }));
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('phone');
  });

  it('null → stand after lock expires', async () => {
    const { initFirstAidScene } = await import('../firstaid-scene');
    initFirstAidScene();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: 'cpr' } }));
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: null } }));
    vi.advanceTimersByTime(4100);
    const svg = document.querySelector('#firstaid-scene svg')!;
    expect(svg.getAttribute('data-pose')).toBe('stand');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/firstaid-scene.test.ts`
Expected: FAIL.

- [ ] **Step 3: Replace the stub with the full implementation**

File: `src/character/firstaid-scene.ts`

```ts
import { createSprite, updateSprite, type Pose } from './sprite';
import { FIRSTAID_TIPS } from './tips';
import { motionAllowed, onMotionChange } from './motion';

type Step =
  | 'bleeding' | 'burns' | 'fractures' | 'crush'
  | 'cpr' | 'shock' | 'smoke' | 'psychological' | null;

const SCROLL_CURVE: Pose[] = ['stand', 'kneel', 'reach', 'thrust'];
const STATE_LOCK_MS = 4000;
const TIP_INTERVAL_MS = 4500;

function stepToPose(step: Exclude<Step, null>): Pose {
  switch (step) {
    case 'cpr':           return 'thrust';
    case 'crush':         return 'phone';
    case 'smoke':         return 'crouch';
    case 'burns':         return 'reach';
    case 'bleeding':
    case 'fractures':
    case 'shock':
    case 'psychological': return 'kneel';
  }
}

export function initFirstAidScene(): void {
  const host = document.getElementById('firstaid-scene');
  if (!host) return;

  const section = host.closest('section') as HTMLElement | null;
  let allowed = motionAllowed();
  let lockTimer: number | null = null;
  let stateLocked = false;
  let scrollProgress = 0;
  let tipIdx = 0;
  let tipTimer: number | null = null;
  let scrollObserver: IntersectionObserver | null = null;

  const sprite = createSprite({ pose: 'stand', gender: 'female' });
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
    const t = FIRSTAID_TIPS[i % FIRSTAID_TIPS.length];
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
    updateSprite(sprite, { pose: poseFromScroll(), gender: 'female' });
  }

  function onStep(e: Event): void {
    const ev = e as CustomEvent<{ step: Step }>;
    if (lockTimer !== null) window.clearTimeout(lockTimer);
    if (ev.detail.step === null) {
      stateLocked = false;
      applyScroll();
      return;
    }
    stateLocked = true;
    updateSprite(sprite, { pose: stepToPose(ev.detail.step), gender: 'female' });
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
    tipIdx = (tipIdx + 1) % FIRSTAID_TIPS.length;
    showTip(tipIdx);
  }

  function applyMotion(now: boolean): void {
    allowed = now;
    if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    document.removeEventListener('mamoru:firstaid-step', onStep);
    if (allowed && section) {
      scrollObserver = new IntersectionObserver(onIntersect, {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
      });
      scrollObserver.observe(section);
      tipTimer = window.setInterval(rotateTip, TIP_INTERVAL_MS);
      document.addEventListener('mamoru:firstaid-step', onStep);
    } else {
      stateLocked = false;
      updateSprite(sprite, { pose: 'stand', gender: 'female' });
    }
  }

  applyMotion(allowed);
  onMotionChange(applyMotion);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/firstaid-scene.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Emit the event from `src/first-aid.ts`**

Open `src/first-aid.ts`. Find the click handler that sets `currentCategory` (around lines 167-173 in `renderCategories`). Modify the existing block to also emit:

```ts
container.querySelectorAll<HTMLButtonElement>('.firstaid-card').forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = parseInt(btn.dataset.idx!, 10);
    currentStep = 0;
    renderSteps();
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', {
      detail: { step: categories[currentCategory].id },
    }));
  });
});
```

Also find the function that returns the user to the category list (search for `renderCategories()` call inside `renderSteps`'s navigation handlers — usually a "back" button or "Done" button). Add immediately after the call:

```ts
document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: null } }));
```

- [ ] **Step 6: Run the full test suite**

Run: `npx vitest run`. Expected: all tests pass.

- [ ] **Step 7: Manually verify**

Run: `npm run dev`. Open first-aid section, tap each category card — confirm Mamo poses change. Tap back, confirm she returns to stand. Ctrl-C.

- [ ] **Step 8: Commit**

```bash
git add src/character/firstaid-scene.ts src/character/__tests__/firstaid-scene.test.ts src/first-aid.ts
git commit -m "feat: first-aid scene Mamo reacts to category + scroll"
```

---

## Task 10: Typhoon scene — `src/character/typhoon-scene.ts`

**Files:**
- Modify: `src/character/typhoon-scene.ts`
- Modify: `src/typhoon.ts` (add click handler + emit `mamoru:typhoon-level`)
- Test: `src/character/__tests__/typhoon-scene.test.ts`

Typhoon currently has no interactivity (just a passive display). We add click-on-row → emit level index 0-4. Pose mapping: 0 stand, 1 phone, 2 walk, 3 tired, 4 headcover.

- [ ] **Step 1: Write the failing test**

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

  it('level 2 → walk', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 2 } }));
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('walk');
  });

  it('level 4 → headcover', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 4 } }));
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('headcover');
  });

  it('null → stand after lock', async () => {
    const { initTyphoonScene } = await import('../typhoon-scene');
    initTyphoonScene();
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: 3 } }));
    document.dispatchEvent(new CustomEvent('mamoru:typhoon-level', { detail: { level: null } }));
    vi.advanceTimersByTime(4100);
    expect(document.querySelector('#typhoon-scene svg')!.getAttribute('data-pose')).toBe('stand');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/typhoon-scene.test.ts`
Expected: FAIL.

- [ ] **Step 3: Replace the stub with the full implementation**

File: `src/character/typhoon-scene.ts`

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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/typhoon-scene.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Add click interactivity to `src/typhoon.ts`**

Open `src/typhoon.ts`. Inside `typhoonScale.forEach((level, i) => { ... })` (lines 25-40), after `container.appendChild(row);` add:

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

- [ ] **Step 6: Run the full test suite**

Run: `npx vitest run`. Expected: all tests pass.

- [ ] **Step 7: Manually verify**

Run: `npm run dev`. Click typhoon rows; Moru's pose changes from phone → walk → tired → headcover. Click again to deactivate; he returns to stand. Ctrl-C.

- [ ] **Step 8: Commit**

```bash
git add src/character/typhoon-scene.ts src/character/__tests__/typhoon-scene.test.ts src/typhoon.ts
git commit -m "feat: typhoon scene character reacts to level click + scroll"
```

---

## Task 11: Character Bible — `src/character/bible.ts` + CSS + HTML

**Files:**
- Modify: `src/character/bible.ts`
- Create: `css/character-bible.css`
- Modify: `index.html` (add Bible section + nav link + CSS link)
- Test: `src/character/__tests__/bible.test.ts`

The Bible is a single new section showing all 14 poses × 2 genders + anatomy grid + do/don't rules. Casual outfit only.

- [ ] **Step 1: Write the failing test**

File: `src/character/__tests__/bible.test.ts`

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POSES } from '../sprite';

beforeEach(() => {
  document.body.innerHTML = `<section class="section" id="bible"></section>`;
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
});

describe('bible', () => {
  it('renders 28 sprite cells (14 poses × 2 genders)', async () => {
    const { initBible } = await import('../bible');
    initBible();
    const cells = document.querySelectorAll('#bible .bible-pose-cell');
    expect(cells.length).toBe(28);
  });

  it('renders cast, anatomy grid, and do/don't panels', async () => {
    const { initBible } = await import('../bible');
    initBible();
    expect(document.querySelector('#bible .bible-cast')).toBeTruthy();
    expect(document.querySelector('#bible .bible-anatomy')).toBeTruthy();
    expect(document.querySelector('#bible .bible-rules')).toBeTruthy();
  });

  it('each pose cell labels its pose name and JP translation', async () => {
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

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/character/__tests__/bible.test.ts`
Expected: FAIL.

- [ ] **Step 3: Replace the stub with the full implementation**

File: `src/character/bible.ts`

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
  'Keep sprite work inside the 64×96 viewBox at all scales.',
  'Reuse a pose from the library before inventing a new one.',
  'Use persimmon #f5a623 as the sole saturated accent on casual outfit.',
  'Pair every scene with a tip bubble showing English + Japanese + Indonesian.',
  'Animate by switching pose presets on a timer — never tween pixels.',
  'Show closed shoes in any earthquake scene (glass rule).',
];

const RULES_DONT = [
  'Don\'t anti-alias. No shapeRendering="auto".',
  'Don\'t introduce new saturated colors. Persimmon, indigo, ink — that\'s it.',
  'Don\'t tilt the head. Use shoulder/torso tilt instead.',
  'Don\'t make either character panic. Cheeks blush, eyes widen — never tears or shouting.',
  'Don\'t draw new hair styles. Short male / long female with ribbon.',
  'Don\'t put the 守 logo anywhere except the casual tee front.',
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
    ['male', 'Moru 守', 'Curious narrator — drops disaster prep facts'],
    ['female', 'Mamo 護', 'First-aid lead — demonstrates choking + recovery position'],
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
      <tr><td>Head</td><td>22, 22, 20×22</td></tr>
      <tr><td>Hair (M)</td><td>20, 14, 24×12</td></tr>
      <tr><td>Hair (F)</td><td>18, 12, 28×34 + bangs</td></tr>
      <tr><td>Torso</td><td>18, 44, 28×26</td></tr>
      <tr><td>Leg ×2</td><td>22/34, 68, 8×18</td></tr>
      <tr><td>Shoes ×2</td><td>20/32, 84, 12×4</td></tr>
      <tr><td>Arm pivots</td><td>(20, 48) and (44, 48)</td></tr>
      <tr><td>Eyes</td><td>(27, 31) and (35, 31), 2×2</td></tr>
      <tr><td>Mouth</td><td>(30, 38), 4×1</td></tr>
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/character/__tests__/bible.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Add `css/character-bible.css`**

File: `css/character-bible.css`

```css
/* Bible page — layout for cast, pose grid, anatomy, do/don't. */

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

- [ ] **Step 6: Add the Bible section + nav link + stylesheet link to `index.html`**

(a) Add stylesheet link in `<head>` after the existing `character.css` link from Task 4:

```html
<link rel="stylesheet" href="/mamoru-guide/css/character-bible.css">
```

(b) Find the existing top nav (search for the `<nav>` element or hamburger menu — around lines 60-90). Add a new `<a>` link to `#bible` matching the existing nav-link markup pattern. For example, if existing links look like `<a href="#earthquake" data-lang="en">Earthquake</a>`, add:

```html
<a href="#bible"><span data-lang="en">Bible</span><span data-lang="ja">図鑑</span><span data-lang="id">Buku</span></a>
```

(c) Add a new section just before `</main>` (which is around line 1054):

```html
<section class="section" id="bible" aria-label="Character bible"></section>
```

- [ ] **Step 7: Verify the full build**

Run: `npm run build`
Expected: build succeeds, no type errors.

Run: `npx vitest run`. Expected: full suite passes.

- [ ] **Step 8: Manually verify**

Run: `npm run dev`. Open the page; click the new "Bible" nav link; confirm 28 pose cells appear, anatomy table renders, do/don't lists render. Confirm language toggle EN/JA/ID switches the headers. Ctrl-C.

- [ ] **Step 9: Commit**

```bash
git add src/character/bible.ts src/character/__tests__/bible.test.ts css/character-bible.css index.html
git commit -m "feat: Character Bible section with pose grid, anatomy, do/don't"
```

---

## Task 12: Final integration check

**Files:** (verification only — no new code)

- [ ] **Step 1: Full type check + build**

Run: `npm run build`
Expected: `tsc --noEmit && vite build` succeeds with no errors. Note the gzipped size of the new JS bundle and confirm the character system delta is under 15 KB gzipped (compare against pre-task baseline if available).

- [ ] **Step 2: Full test suite**

Run: `npx vitest run`
Expected: every test passes (existing + 7 new test files = 28+ new test cases).

- [ ] **Step 3: Manual smoke test — golden path**

Run: `npm run dev`. Walk through each section:

1. **Hero:** mascot visible, cursor pupils track the mouse, click flips emote + fact, hover shows heart pop.
2. **Earthquake:** scroll into section — Moru appears with stand pose. Click shindo rows 0, 3, 5, 7 — confirm pose changes to stand, brace, cover, headcover. Click again to deactivate; pose returns to scroll-driven default within 4 s.
3. **Bag:** scroll in, sprite present. Pack items past 10 kg — Moru goes tired. Reset; pack 8–10 kg — peace emote flashes.
4. **First-aid:** scroll in, Mamo in stand. Click CPR — thrust. Click smoke — crouch. Click back — returns to stand after 4 s.
5. **Typhoon:** scroll in, Moru in stand. Click each row 0–4 — confirm phone → walk → tired → headcover.
6. **Bible nav link:** click — scroll to Bible. Confirm 28 sprite cells, anatomy table, do/don't lists. Toggle language — headers switch EN/JA/ID.

- [ ] **Step 4: Manual smoke test — reduced motion**

Enable system reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion). Reload. Expected:

- Mascot: static stand, no cursor tracking, no bobbing, no fact rotation.
- Scenes: sprites appear instantly (no fade), stay in rest pose, do not advance on scroll.
- Bag/firstaid/typhoon/earthquake state events: still trigger pose changes via direct interaction; only scroll-driven motion is suppressed.

Toggle off; reload; confirm full motion returns.

- [ ] **Step 5: Manual smoke test — i18n**

Click language toggle EN → JA → ID. Confirm all tip bubbles + Bible headers + nav link switch. No untranslated `data-lang="id"` strings visible.

- [ ] **Step 6: Commit any final tweaks**

If you needed any small adjustments during smoke testing (e.g., CSS spacing fixes, label corrections), commit them here:

```bash
git add <files>
git commit -m "fix: <small adjustment found in smoke test>"
```

If no adjustments were needed, skip this step.

- [ ] **Step 7: Final push and PR**

```bash
git push -u origin feat/aditya/character-system-design-spec
```

Then open a PR from `feat/aditya/character-system-design-spec` → `main` with a summary referencing the spec at `docs/superpowers/specs/2026-05-21-mamoru-character-system-design.md` and the plan at `docs/superpowers/plans/2026-05-21-mamoru-character-system.md`.

---

## Spec coverage check

| Spec section | Implementation task(s) |
|---|---|
| §3 file layout + mount points | Task 5 |
| §3 wire-up in main.ts | Task 5 |
| §3 event bridge from existing modules | Tasks 7, 8, 9, 10 (one emit per module) |
| §4 sprite.ts contract | Task 3 |
| §4 tips.ts (with ID translations) | Task 1 |
| §4 motion.ts (system + storage gate) | Task 2 |
| §5 hero mascot behavior | Task 6 |
| §6 scenes pose-source precedence | Tasks 7, 9, 10 (state lock + scroll fallback); Task 8 (state-only) |
| §6 per-scene pose mappings | Tasks 7, 8, 9, 10 |
| §7 reveal-in via existing .visible class | Task 4 (CSS) |
| §7 scroll-progress IntersectionObserver | Tasks 7, 9, 10 |
| §8 Bible cast, pose grid, anatomy, do/don't | Task 11 |
| §9 testing strategy | Tasks 1, 2, 3, 6, 7, 8, 9, 10, 11 (one test file each) |
| §10 acceptance criteria — build/types/tests | Task 12 |
| §10 acceptance criteria — bundle delta | Task 12 (Step 1) |
| §10 acceptance criteria — reduced motion | Task 12 (Step 4) |
| §10 acceptance criteria — i18n toggle | Task 12 (Step 5) |
| §10 acceptance criteria — zero new deps | Implicit — no `package.json` modifications anywhere in the plan |
