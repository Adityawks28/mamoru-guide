import { createActor, type Action } from './actor';
import { FIRSTAID_TIPS } from './tips';
import { onMotionChange } from './motion';
import type { SpriteOptions } from './sprite';

type Step =
  | 'bleeding' | 'burns' | 'fractures' | 'crush'
  | 'cpr' | 'shock' | 'smoke' | 'psychological' | null;

const TIP_INTERVAL_MS = 4500;

// Kneeling behind the patient with both hands on them.
const KNEEL: Partial<SpriteOptions> = { pose: 'kneel', arms: [-40, 40] };

// What Mamo does for each card, and which tip (FIRSTAID_TIPS index) goes with it.
const ACTIONS: Record<Exclude<Step, null>, Action & { tip?: number }> = {
  // Two 270 ms frames: one push every 540 ms, about 110 a minute.
  cpr: { tip: 2, frameMs: 270, props: ['patient'], frames: [{ sprite: KNEEL, dy: 6 }, { sprite: KNEEL, dy: 9 }] },
  bleeding: { tip: 0, frameMs: 600, props: ['patient', 'cloth'], frames: [{ sprite: KNEEL, dy: 7 }, { sprite: KNEEL, dy: 8 }] },
  fractures: { frameMs: 500, props: ['patient', 'splint'], frames: [
    { sprite: KNEEL, dy: 7 }, { sprite: KNEEL, dy: 7 }, { sprite: KNEEL, dy: 7 }, { sprite: { ...KNEEL, blink: true }, dy: 7 },
  ] },
  shock: { tip: 5, frameMs: 400, props: ['patient', 'blanket'], frames: [{ sprite: { ...KNEEL, face: 'talk' }, dy: 7 }, { sprite: KNEEL, dy: 7 }] },
  burns: { tip: 1, frameMs: 250, props: ['tap'], frames: [{ sprite: { arms: [0, -60] } }, { sprite: { arms: [0, -60] } }] },
  crush: { tip: 6, frameMs: 300, props: [], frames: [
    { sprite: { pose: 'phone', hold: 'phone', face: 'talk' } }, { sprite: { pose: 'phone', hold: 'phone' } },
  ] },
  smoke: { tip: 4, frameMs: 400, props: ['smoke'], frames: [
    { sprite: { pose: 'crouch', arms: [-140, 40] } }, { sprite: { pose: 'crouch', arms: [-140, 40], blink: true } },
  ] },
  psychological: { tip: 7, frameMs: 1000, props: [], frames: [{ sprite: { face: 'talk' } }, { sprite: {} }] },
};

export function initFirstAidScene(): void {
  const host = document.getElementById('firstaid-scene');
  if (!host) return;

  const actor = createActor('female');
  let current: Step = null;
  let tipIdx = 0;
  let tipTimer: number | null = null;
  host.replaceChildren(actor.stage);

  const bubble = document.createElement('div');
  bubble.className = 'tip-bubble';
  const en = document.createElement('span'); en.dataset.lang = 'en';
  const ja = document.createElement('span'); ja.dataset.lang = 'ja';
  const id = document.createElement('span'); id.dataset.lang = 'id';
  bubble.append(en, ja, id);
  host.appendChild(bubble);

  function showTip(i: number): void {
    tipIdx = i % FIRSTAID_TIPS.length;
    const t = FIRSTAID_TIPS[tipIdx];
    en.textContent = t.en;
    ja.textContent = t.ja;
    id.textContent = t.id;
  }
  showTip(0);

  // The action loops while its card is open; closing the card ends it.
  function act(step: Step): void {
    current = step;
    if (step === null) { actor.rest(); return; }
    const action = ACTIONS[step];
    actor.play(action);
    if (action.tip !== undefined) showTip(action.tip);
  }

  document.addEventListener('mamoru:firstaid-step', e => act((e as CustomEvent<{ step: Step }>).detail.step));

  function applyMotion(allowed: boolean): void {
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    if (allowed) tipTimer = window.setInterval(() => { if (current === null) showTip(tipIdx + 1); }, TIP_INTERVAL_MS);
    act(current);
  }
  applyMotion(true);
  onMotionChange(applyMotion);
}
