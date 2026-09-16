// section-nav.test.ts

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROUTE_CHIPS, mountSectionNav } from '../section-nav';

function documentOrderFromIndexHtml(): string[] {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  return [...html.matchAll(/<section class="section" id="([\w-]+)"/g)].map(m => m[1]);
}

describe('chip order', () => {
  // The chips are a map of the page. If they disagree with the page, the
  // highlight jumps backwards as you scroll and the numbered sections
  // (01, 02, ...) stop matching the strip.
  Object.keys(ROUTE_CHIPS).forEach(route => {
    it(`${route}: follows the order the sections appear in index.html`, () => {
      const chipOrder = ROUTE_CHIPS[route].map(c => c.section);
      const expected = documentOrderFromIndexHtml().filter(id => chipOrder.includes(id));

      expect(chipOrder).toEqual(expected);
    });
  });
});

interface FakeEntry {
  target: { id: string };
  isIntersecting: boolean;
  intersectionRatio: number;
  intersectionRect: { height: number };
}

let capturedCallback: ((entries: FakeEntry[]) => void) | null = null;

class CapturingObserver {
  constructor(cb: (entries: FakeEntry[]) => void) {
    capturedCallback = cb;
  }
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): [] { return []; }
  root = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [];
}

function buildDOM(): void {
  capturedCallback = null;
  document.body.innerHTML = '<div class="navbar"></div>';
  ROUTE_CHIPS.prepare.forEach(c => {
    const section = document.createElement('section');
    section.id = c.section;
    document.body.appendChild(section);
  });
}

function activeChip(): string | undefined {
  return document.querySelector<HTMLElement>('.section-chip.active')?.dataset.target;
}

function entry(id: string, height: number, ratio: number, isIntersecting = true): FakeEntry {
  return { target: { id }, isIntersecting, intersectionRatio: ratio, intersectionRect: { height } };
}

describe('scroll spy', () => {
  beforeEach(() => {
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = CapturingObserver;
    buildDOM();
    mountSectionNav('prepare');
  });

  it('activates the section covering most of the activation band', () => {
    // A long section only ever crosses part of the band, so its ratio stays
    // low while a short one sitting fully inside scores 1.0.
    capturedCallback!([
      entry('vocab', 300, 0.3),
      entry('showthis', 80, 1),
    ]);

    expect(activeChip()).toBe('vocab');
  });

  it('holds the active section when a later callback omits it', () => {
    // The observer reports only what changed, so a section that is still on
    // screen can be missing from the next batch entirely.
    capturedCallback!([
      entry('vocab', 300, 0.3),
      entry('showthis', 80, 1),
    ]);
    capturedCallback!([
      entry('showthis', 40, 0.5),
    ]);

    expect(activeChip()).toBe('vocab');
  });

  it('moves on once the next section takes over the band', () => {
    capturedCallback!([entry('vocab', 300, 0.3)]);
    capturedCallback!([
      entry('vocab', 20, 0.02),
      entry('showthis', 260, 1),
    ]);

    expect(activeChip()).toBe('showthis');
  });

  it('ignores sections that have left the band', () => {
    capturedCallback!([entry('vocab', 300, 0.3)]);
    capturedCallback!([
      entry('vocab', 0, 0, false),
      entry('showthis', 120, 0.9),
    ]);

    expect(activeChip()).toBe('showthis');
  });
});
