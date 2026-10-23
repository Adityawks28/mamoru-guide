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
    const rectCount = svg.querySelectorAll('rect').length;
    expect(rectCount).toBeGreaterThan(10);
  });

  it('a partial update keeps the running emote, arms and face', () => {
    // The hero mascot sends { pupil } on every mousemove; that used to wipe
    // data-emote and cut the tap animation off mid-way.
    const svg = createSprite({ pose: 'stand', gender: 'male' });
    updateSprite(svg, { emote: 'jump', arms: [150, -150], face: 'happy' });
    const before = svg.innerHTML;
    updateSprite(svg, { pupil: { x: 0, y: 0 } });
    expect(svg.dataset.emote).toBe('jump');
    expect(svg.innerHTML).toBe(before);
  });

  it('moves the eyes one pixel toward the pointer', () => {
    const eyeXs = (svg: SVGSVGElement) => Array.from(svg.querySelectorAll('rect'))
      .filter(r => r.getAttribute('fill') === '#1a1a1a' && r.getAttribute('width') === '2' && r.getAttribute('height') === '2')
      .map(r => Number(r.getAttribute('x')));
    const svg = createSprite({ pose: 'stand', gender: 'male' });
    expect(eyeXs(svg)).toEqual([27, 35]);
    updateSprite(svg, { pupil: { x: 1.4, y: 0 } });
    expect(eyeXs(svg)).toEqual([28, 36]);
  });

  it('draws one pixel-art sweat drop per level of effort', () => {
    const drops = (svg: SVGSVGElement) => svg.querySelectorAll('rect[fill="#8fd3ff"]').length;
    expect(drops(createSprite({ pose: 'stand', gender: 'male' }))).toBe(0);
    expect(drops(createSprite({ pose: 'tired', gender: 'male', sweat: 2 }))).toBe(2);
  });

  it('can gasp (open mouth) even in the tired pose', () => {
    const svg = createSprite({ pose: 'tired', gender: 'male', face: 'gasp' });
    const mouth = Array.from(svg.querySelectorAll('rect')).filter(r =>
      r.getAttribute('fill') === '#1a1a1a' && r.getAttribute('y') === '37' && r.getAttribute('height') === '3');
    expect(mouth.length).toBe(1);
  });

  it('persimmon (#f5a623) appears as the only saturated accent on casual male', () => {
    const svg = createSprite({ pose: 'stand', gender: 'male' });
    const fills = new Set(
      Array.from(svg.querySelectorAll('rect'))
        .map(r => r.getAttribute('fill')?.toLowerCase() ?? '')
    );
    expect(fills.has('#c43818')).toBe(false);
    expect(fills.has('#7a4818')).toBe(false);
    expect(fills.has('#1a3a6a')).toBe(false);
  });
});
