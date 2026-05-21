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
