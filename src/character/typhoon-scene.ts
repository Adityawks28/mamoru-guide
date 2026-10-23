import { createActor, type Action } from './actor';
import { TYPHOON_TIPS } from './tips';
import { onMotionChange } from './motion';

const TIP_INTERVAL_MS = 4500;

// One action per row of the typhoon scale, matching TYPHOON_TIPS[level].
const ACTIONS: Action[] = [
  // Tropical storm: check the forecast.
  { frameMs: 700, props: [], frames: [
    { sprite: { arms: [0, 110], hold: 'phone-front', pupil: { x: 0, y: 1 } } },
    { sprite: { arms: [0, 110], hold: 'phone-front', pupil: { x: 0, y: 1 } } },
    { sprite: { arms: [0, 110], hold: 'phone-front', blink: true } },
  ] },
  // Severe tropical storm: tape an X on the window, one strip at a time.
  { frameMs: 700, props: ['window'], frames: [
    { sprite: { arms: [0, -130] } },
    { sprite: { arms: [0, -130] }, props: ['tapeA'] },
    { sprite: { arms: [0, -120] }, props: ['tapeA', 'tapeB'] },
    { sprite: { arms: [0, -120], face: 'happy' }, props: ['tapeA', 'tapeB'] },
  ] },
  // Typhoon: walk to the shelter early. Feet step in turn ('walk' lifts the
  // left, 'run' the right) and the opposite arm swings out a little.
  { frameMs: 250, props: ['wind'], frames: [{ sprite: { pose: 'walk', arms: [0, -8] } }, { sprite: { pose: 'run', arms: [8, 0] } }] },
  // Very strong: the power is out, the torch is ready.
  { frameMs: 300, props: ['dark', 'beam'], frames: [{ sprite: { arms: [0, -40], hold: 'torch' } }] },
  // Violent: stay inside, away from the storm.
  { frameMs: 200, props: ['house', 'rain'], frames: [
    { sprite: {} }, { sprite: {} }, { sprite: {} }, { sprite: {} }, { sprite: {} }, { sprite: { blink: true } },
  ] },
];

export function initTyphoonScene(): void {
  const host = document.getElementById('typhoon-scene');
  if (!host) return;

  const actor = createActor('male');
  let current: number | null = null;
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
    tipIdx = i % TYPHOON_TIPS.length;
    const t = TYPHOON_TIPS[tipIdx];
    en.textContent = t.en;
    ja.textContent = t.ja;
    id.textContent = t.id;
  }
  showTip(0);

  // The action loops while its row is open; closing the row ends it.
  function act(level: number | null): void {
    current = level === null ? null : Math.max(0, Math.min(ACTIONS.length - 1, level));
    if (current === null) { actor.rest(); return; }
    actor.play(ACTIONS[current]);
    showTip(current);
  }

  document.addEventListener('mamoru:typhoon-level', e => act((e as CustomEvent<{ level: number | null }>).detail.level));

  function applyMotion(allowed: boolean): void {
    if (tipTimer !== null) { window.clearInterval(tipTimer); tipTimer = null; }
    if (allowed) tipTimer = window.setInterval(() => { if (current === null) showTip(tipIdx + 1); }, TIP_INTERVAL_MS);
    act(current);
  }
  applyMotion(true);
  onMotionChange(applyMotion);
}
