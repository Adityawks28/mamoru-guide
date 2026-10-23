import { createSprite, updateSprite, type SpriteOptions } from './sprite';
import { BAG_TIPS, type Tip } from './tips';
import { motionAllowed, onMotionChange } from './motion';

const TIP_INTERVAL_MS = 4500;
const REJECT_MS = 900;
const REMARK_MS = 6000;

export type Load = 'empty' | 'light' | 'ok' | 'heavy' | 'strain' | 'reject';

export function loadFor(weight: number, max: number): Load {
  const r = weight / max;
  return r <= 0 ? 'empty' : r < 0.4 ? 'light' : r < 0.7 ? 'ok' : r < 0.9 ? 'heavy' : 'strain';
}

// How Mamoru carries each load; the bob/stagger lives in bag-game.css.
const LOOK: Record<Load, Partial<SpriteOptions>> = {
  empty:  { pose: 'stand', face: undefined, sweat: 0 },
  light:  { pose: 'stand', face: 'happy',   sweat: 0 },
  ok:     { pose: 'stand', face: undefined, sweat: 0 },
  heavy:  { pose: 'tired', face: undefined, sweat: 1 },
  strain: { pose: 'tired', face: 'gasp',    sweat: 3 },
  reject: { pose: 'tired', face: 'wow',     sweat: 3 },
};

const REMARK: Record<Load, Tip | null> = {
  empty:  null,
  light:  { en: 'Light as a feather! Room for more essentials.', ja: 'まだ軽い！必需品をもっと入れられる。', id: 'Masih ringan! Masih muat barang penting.' },
  ok:     { en: 'Still easy to walk with. Nice.', ja: 'まだ楽に歩ける。いい感じ。', id: 'Masih nyaman dibawa jalan. Bagus.' },
  heavy:  { en: 'Getting heavy… you may walk an hour to the shelter.', ja: '重くなってきた…避難所まで1時間歩くかも。', id: 'Mulai berat… mungkin jalan 1 jam ke pengungsian.' },
  strain: { en: 'Hah… hah… too heavy to run! Take something out?', ja: 'はぁ…はぁ…重くて走れない！何か出そう。', id: 'Hah… hah… terlalu berat untuk lari! Keluarkan sesuatu?' },
  reject: { en: "Whoa! That won't fit — over 10 kg!", ja: 'うわっ！10kgを超えちゃう！', id: 'Waduh! Tidak muat — lebih dari 10 kg!' },
};

export function initBagScene(): void {
  const host = document.getElementById('bag-scene');
  if (!host) return;

  let tipIdx = 0;
  let tipTimer: number | null = null;
  let rejectTimer: number | null = null;
  let remarkUntil = 0;
  let load: Load = 'empty';

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

  function say(t: Tip): void {
    en.textContent = t.en;
    ja.textContent = t.ja;
    id.textContent = t.id;
  }
  say(BAG_TIPS[0]);

  function show(next: Load): void {
    host!.dataset.load = next;
    updateSprite(sprite, LOOK[next]);
    const remark = REMARK[next];
    if (remark) { say(remark); remarkUntil = Date.now() + REMARK_MS; }
  }
  show('empty');

  function onWeight(e: Event): void {
    const { weight, max, rejected } = (e as CustomEvent<{ weight: number; max: number; rejected?: boolean }>).detail;
    const next = loadFor(weight, max);
    if (rejectTimer !== null) { window.clearTimeout(rejectTimer); rejectTimer = null; }
    if (rejected) {
      show('reject');
      rejectTimer = window.setTimeout(() => { rejectTimer = null; show(load); }, REJECT_MS);
      return;
    }
    if (next !== load) show(next);
    load = next;
  }
  document.addEventListener('mamoru:bag-weight', onWeight);

  function rotateTip(): void {
    if (Date.now() < remarkUntil) return;
    tipIdx = (tipIdx + 1) % BAG_TIPS.length;
    say(BAG_TIPS[tipIdx]);
  }

  function applyMotion(allowed: boolean): void {
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    if (allowed) tipTimer = window.setInterval(rotateTip, TIP_INTERVAL_MS);
  }

  applyMotion(motionAllowed());
  onMotionChange(applyMotion);
}
