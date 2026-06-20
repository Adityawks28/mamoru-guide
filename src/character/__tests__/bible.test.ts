import { describe, it, expect, beforeEach } from 'vitest';
import { POSES } from '../sprite';

beforeEach(() => {
  document.body.innerHTML = '<section class="section" id="bible"></section>';
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
});

describe('bible', () => {
  it('renders one sprite cell per pose x 2 genders', async () => {
    const { initBible } = await import('../bible');
    initBible();
    const cells = document.querySelectorAll('#bible .bible-pose-cell');
    expect(cells.length).toBe(POSES.length * 2);
  });

  it('renders cast, anatomy grid, and do/don\'t panels', async () => {
    const { initBible } = await import('../bible');
    initBible();
    expect(document.querySelector('#bible .bible-cast')).toBeTruthy();
    expect(document.querySelector('#bible .bible-anatomy')).toBeTruthy();
    expect(document.querySelector('#bible .bible-rules')).toBeTruthy();
  });

  it('each pose cell labels its pose name', async () => {
    const { initBible } = await import('../bible');
    initBible();
    const labels = Array.from(document.querySelectorAll('#bible .bible-pose-cell'))
      .map(c => c.getAttribute('data-pose'));
    POSES.forEach(p => {
      expect(labels).toContain(p);
    });
  });
});
