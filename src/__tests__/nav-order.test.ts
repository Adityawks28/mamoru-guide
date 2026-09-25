// nav-order.test.ts

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROUTE_SECTIONS } from '../router';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const doc = new DOMParser().parseFromString(html, 'text/html');
const idsInOrder = [...doc.querySelectorAll('[id]')].map(el => el.id);

// A page starts where its earliest section sits in index.html, which is also
// the order the numbered section labels (01, 02, ...) read.
function pagePosition(route: string): number {
  const positions = ROUTE_SECTIONS[route].map(id => idsInOrder.indexOf(id)).filter(i => i >= 0);
  return Math.min(...positions);
}

describe('page menu order', () => {
  ['.nav-links', '#mobileMenu'].forEach(menu => {
    it(`${menu}: lists pages in the order their sections appear`, () => {
      const routes = [...doc.querySelectorAll<HTMLAnchorElement>(`${menu} a[data-nav-route]`)]
        .map(a => a.dataset.navRoute!);
      const expected = [...routes].sort((a, b) => pagePosition(a) - pagePosition(b));

      expect(routes.length).toBeGreaterThan(0);
      expect(routes).toEqual(expected);
    });
  });
});
