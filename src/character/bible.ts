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
  { id: 'cower',     name: 'COWER',      jp: '縮こまる', note: 'fear / shelter' },
];

function metaFor(pose: Pose): PoseMeta {
  return POSE_META.find(m => m.id === pose) ?? { id: pose, name: pose.toUpperCase(), jp: '', note: '' };
}

const RULES_DO = [
  'Use shapeRendering="crispEdges" on every sprite SVG.',
  'Keep sprite work inside the 64x96 viewBox at all scales.',
  'Reuse a pose from the library before inventing a new one.',
  'Use persimmon #f5a623 as the sole saturated accent on casual outfit.',
  'Pair every scene with a tip bubble showing English + Japanese + Indonesian.',
  'Animate by switching pose presets on a timer -- never tween pixels.',
  'Show closed shoes in any earthquake scene (glass rule).',
];

const RULES_DONT = [
  'Don\'t anti-alias. No shapeRendering="auto".',
  'Don\'t introduce new saturated colors. Persimmon, indigo, ink -- that\'s it.',
  'Don\'t tilt the head. Use shoulder/torso tilt instead.',
  'Don\'t make either character panic. Cheeks blush, eyes widen -- never tears or shouting.',
  'Don\'t draw new hair styles. Short male / long female with ribbon.',
  'Don\'t put the logo anywhere except the casual tee front.',
];

function buildPoseGrid(host: HTMLElement): void {
  const grid = document.createElement('div');
  grid.className = 'bible-pose-grid';
  for (const gender of ['male', 'female'] as Gender[]) {
    for (const pose of POSES) {
      const meta = metaFor(pose);
      const cell = document.createElement('div');
      cell.className = 'bible-pose-cell';
      cell.dataset.pose = pose;
      cell.dataset.gender = gender;
      const sprite = createSprite({ pose, gender });
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
    ['male', 'Moru', 'Curious narrator -- drops disaster prep facts'],
    ['female', 'Mamo', 'First-aid lead -- demonstrates choking + recovery position'],
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
      <tr><td>Head</td><td>22, 22, 20x22</td></tr>
      <tr><td>Hair (M)</td><td>20, 14, 24x12</td></tr>
      <tr><td>Hair (F)</td><td>18, 12, 28x34 + bangs</td></tr>
      <tr><td>Torso</td><td>18, 44, 28x26</td></tr>
      <tr><td>Leg x2</td><td>22/34, 68, 8x18</td></tr>
      <tr><td>Shoes x2</td><td>20/32, 84, 12x4</td></tr>
      <tr><td>Arm pivots</td><td>(20, 48) and (44, 48)</td></tr>
      <tr><td>Eyes</td><td>(27, 31) and (35, 31), 2x2</td></tr>
      <tr><td>Mouth</td><td>(30, 38), 4x1</td></tr>
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
