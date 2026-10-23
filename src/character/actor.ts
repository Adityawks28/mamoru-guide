import { createSprite, updateSprite, type Gender, type SpriteOptions } from './sprite';
import { motionAllowed } from './motion';

// A small pixel stage (128×96) with the sprite in the middle and props around
// it. Actions play like an old console game: a few frames on a fixed beat,
// each held, then snapped to the next. Idle is standing still with a blink.

export type Prop =
  | 'patient' | 'cloth' | 'splint' | 'blanket'
  | 'tap' | 'smoke' | 'window' | 'tapeA' | 'tapeB'
  | 'wind' | 'dark' | 'beam' | 'house' | 'rain';

export interface Frame {
  sprite?: Partial<SpriteOptions>;
  /** Whole pixels down, e.g. the push of a chest compression. */
  dy?: number;
  /** Props shown only on this frame, on top of the action's props. */
  props?: Prop[];
}

export interface Action {
  frames: Frame[];
  frameMs: number;
  props: Prop[];
}

const SPRITE_X = 32;
const BLINK_EVERY_MS = 3200;
const BLINK_MS = 160;
const NS = 'http://www.w3.org/2000/svg';

const BASE: Partial<SpriteOptions> = {
  pose: 'stand', arms: undefined, face: undefined, blink: false,
  tilt: 0, flip: false, hold: undefined, pupil: undefined, sweat: 0,
};

function px(x: number, y: number, w: number, h: number, fill: string, opacity?: number): SVGRectElement {
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('x', String(x));
  r.setAttribute('y', String(y));
  r.setAttribute('width', String(w));
  r.setAttribute('height', String(h));
  r.setAttribute('fill', fill);
  if (opacity !== undefined) r.setAttribute('opacity', String(opacity));
  return r;
}

// A diagonal pixel line, 2×2 per step: how the window tape is drawn.
function diagonal(x: number, y: number, steps: number, dx: number, fill: string): SVGRectElement[] {
  return Array.from({ length: steps }, (_, i) => px(x + i * 2 * dx, y + i * 2, 2, 2, fill));
}

// Each prop: whether it stands in front of the actor, and its pixels for a
// given tick (props that move use the tick to pick their frame).
const PROPS: Record<Prop, { front?: boolean; tag?: string; draw(tick: number): SVGElement[] }> = {
  // Lying on the floor in front of the actor; the floor band hides her feet.
  patient: { front: true, draw: () => [
    px(16, 88, 96, 8, '#1c2747'), px(16, 88, 96, 1, '#2c3a62'),
    px(38, 82, 4, 6, '#2a1a08'),
    px(42, 80, 9, 8, '#f5d5a8'), px(44, 83, 2, 1, '#1a1a1a'), px(47, 83, 2, 1, '#1a1a1a'),
    px(51, 81, 26, 7, '#7a9a5a'), px(51, 81, 26, 1, '#9aba7a'),
    px(77, 82, 20, 6, '#3a3a5a'),
    px(97, 80, 4, 8, '#1a1a1a'),
  ] },
  cloth: { front: true, draw: () => [px(58, 80, 12, 4, '#f6f4ef'), px(62, 81, 4, 2, '#d03030')] },
  splint: { front: true, draw: () => [px(76, 80, 22, 1, '#a0703a'), px(76, 87, 22, 1, '#a0703a'), px(82, 80, 2, 8, '#f6f4ef'), px(90, 80, 2, 8, '#f6f4ef')] },
  blanket: { front: true, draw: () => [px(52, 79, 46, 9, '#c0603a'), px(52, 79, 46, 2, '#e08050'), px(64, 79, 2, 9, '#a04a2a'), px(80, 79, 2, 9, '#a04a2a')] },
  // Water runs onto the hand held under it, and drips off below.
  tap: { draw: tick => [
    px(88, 30, 16, 4, '#9aa0aa'), px(88, 30, 4, 10, '#9aa0aa'), px(87, 28, 6, 2, '#c0c6d0'),
    px(89, 41 + (tick % 2) * 3, 2, 3, '#8fd3ff'),
    ...[0, 1, 2].map(i => px(89 + (i % 2), 60 + i * 4 + (tick % 2) * 2, 2, 2, '#8fd3ff')),
  ] },
  // Puffs along the ceiling, drifting 2px between frames.
  smoke: { draw: tick => [0, 1, 2, 3, 4].flatMap(i => {
    const x = 4 + i * 26 + (tick % 2 ? 2 : 0), y = 6 + (i % 2) * 6;
    return [px(x + 4, y, 14, 3, '#6a6a76', 0.85), px(x, y + 3, 22, 7, '#5a5a66', 0.85)];
  }) },
  window: { draw: () => [px(96, 22, 28, 30, '#a07a4a'), px(98, 24, 24, 26, '#9fd0f0'), px(98, 24, 24, 3, '#c8e8ff'), px(109, 24, 2, 26, '#a07a4a')] },
  tapeA: { tag: 'tape', draw: () => diagonal(98, 24, 12, 1, '#f5d58a') },
  tapeB: { tag: 'tape', draw: () => diagonal(120, 24, 12, -1, '#f5d58a') },
  wind: { draw: tick => [0, 1, 2, 3].map(i =>
    px(((tick * 12 + i * 37) % 120), 20 + i * 14, 10, 1, '#dfefff', 0.8)) },
  dark: { draw: () => [px(0, 0, 128, 96, '#05081a', 0.55)] },
  beam: { draw: tick => [0, 1, 2, 3, 4].map(i =>
    px(96 + i * 6, 53 - i, 6, 6 + i * 2, '#ffe08a', tick % 4 === 3 ? 0.45 : 0.7)) },
  house: { draw: () => [
    px(20, 16, 88, 4, '#7a3a2a'), px(28, 12, 72, 4, '#7a3a2a'), px(40, 8, 48, 4, '#7a3a2a'),
    px(22, 20, 4, 68, '#c8b89a'), px(102, 20, 4, 68, '#c8b89a'), px(20, 88, 88, 2, '#8a7a5a'),
  ] },
  rain: { draw: tick => [0, 1, 2, 3, 4, 5].flatMap(i => [
    px(4 + (i % 3) * 5, ((tick * 8 + i * 15) % 80) + 8, 1, 4, '#8fd3ff'),
    px(110 + (i % 3) * 6, ((tick * 8 + i * 15 + 7) % 80) + 8, 1, 4, '#8fd3ff'),
  ]) },
};

export interface Actor {
  stage: SVGSVGElement;
  sprite: SVGSVGElement;
  play(action: Action): void;
  rest(): void;
}

export function createActor(gender: Gender): Actor {
  const stage = document.createElementNS(NS, 'svg') as SVGSVGElement;
  stage.setAttribute('viewBox', '0 0 128 96');
  stage.setAttribute('shape-rendering', 'crispEdges');
  stage.setAttribute('aria-hidden', 'true');
  stage.classList.add('actor-stage');
  const back = document.createElementNS(NS, 'g');
  const front = document.createElementNS(NS, 'g');
  const sprite = createSprite({ pose: 'stand', gender });
  sprite.setAttribute('x', String(SPRITE_X));
  sprite.setAttribute('y', '0');
  stage.append(back, sprite, front);

  let timers: number[] = [];
  const clear = () => { timers.forEach(t => { window.clearInterval(t); window.clearTimeout(t); }); timers = []; };

  function drawProps(props: Prop[], tick: number): void {
    back.replaceChildren();
    front.replaceChildren();
    for (const name of props) {
      const p = PROPS[name];
      const g = document.createElementNS(NS, 'g');
      g.dataset.prop = p.tag ?? name;
      g.append(...p.draw(tick));
      (p.front ? front : back).appendChild(g);
    }
  }

  function show(frame: Frame, props: Prop[], tick: number): void {
    updateSprite(sprite, { ...BASE, gender, ...frame.sprite });
    sprite.setAttribute('y', String(frame.dy ?? 0));
    drawProps([...props, ...(frame.props ?? [])], tick);
  }

  function rest(): void {
    clear();
    show({}, [], 0);
    if (!motionAllowed()) return;
    timers.push(window.setInterval(() => {
      updateSprite(sprite, { blink: true });
      window.setTimeout(() => updateSprite(sprite, { blink: false }), BLINK_MS);
    }, BLINK_EVERY_MS));
  }

  function play(action: Action): void {
    clear();
    let tick = 0;
    show(action.frames[0], action.props, tick);
    if (!motionAllowed()) return;
    timers.push(window.setInterval(() => {
      tick++;
      show(action.frames[tick % action.frames.length], action.props, tick);
    }, action.frameMs));
  }

  rest();
  return { stage, sprite, play, rest };
}
