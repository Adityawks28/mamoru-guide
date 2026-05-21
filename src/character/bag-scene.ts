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
