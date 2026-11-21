// router.test.ts

import { readFileSync } from 'node:fs';
import { activateRoute, resolveRoute, ROUTE_SECTIONS, type RouteDetail } from '../router';
import { initEmergencyFab } from '../emergency-fab';

const read = (f: string): string => readFileSync(f, 'utf8');

// jsdom doesn't implement window.scrollTo, silence the warning
beforeAll(() => { window.scrollTo = () => {}; });

// all section IDs the router manages
const ALL_IDS = [
  'hero',
  'emergency-mode',
  'earthquake', 'alerts', 'typhoon', 'vocab', 'showthis', 'bag', 'firstaid', 'contacts',
  'drill', 'quiz', 'about', 'sources',
  'myplan',
  'shelter',
];

function buildDOM(): void {
  document.body.innerHTML = '';
  document.body.removeAttribute('data-route');

  ALL_IDS.forEach(id => {
    const section = document.createElement('section');
    section.id = id;
    section.classList.add('route-hidden');
    document.body.appendChild(section);
  });

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <a data-nav-route="#/" href="#/">Home</a>
    <a data-nav-route="#/emergency" href="#/emergency">Emergency</a>
    <a data-nav-route="#/prepare"   href="#/prepare">Prepare</a>
    <a data-nav-route="#/learn"     href="#/learn">Learn</a>
    <a data-nav-route="#/plan"      href="#/plan">Plan</a>
    <a data-nav-route="#/shelter"   href="#/shelter">Shelter</a>
  `;
  document.body.appendChild(nav);
}

function visibleSections(): string[] {
  return ALL_IDS.filter(id => {
    const el = document.getElementById(id);
    return el && !el.classList.contains('route-hidden');
  });
}

function activeNavLink(): string | null {
  const link = document.querySelector<HTMLAnchorElement>('[data-nav-route][aria-current="page"]');
  return link?.dataset.navRoute ?? null;
}


describe('activateRoute()', () => {

  beforeEach(() => {
    buildDOM();
    // Reset window.location.hash before each test
    window.location.hash = '';
  });

  // --- Landing page ---

  it('shows only the hero on #/', () => {
    activateRoute('#/');
    expect(visibleSections()).toEqual(['hero']);
  });

  it('sets body data-route to "home" on #/', () => {
    activateRoute('#/');
    expect(document.body.dataset.route).toBe('home');
  });

  // --- Emergency ---

  it('shows only emergency-mode on #/emergency', () => {
    activateRoute('#/emergency');
    expect(visibleSections()).toEqual(['emergency-mode']);
  });

  it('sets body data-route to "emergency" on #/emergency', () => {
    activateRoute('#/emergency');
    expect(document.body.dataset.route).toBe('emergency');
  });

  // --- Prepare ---

  it('shows prepare sections on #/prepare', () => {
    activateRoute('#/prepare');
    expect(visibleSections()).toEqual(
      ['earthquake', 'alerts', 'typhoon', 'vocab', 'showthis', 'bag', 'firstaid', 'contacts']
    );
  });

  // --- Learn ---

  it('shows learn sections on #/learn', () => {
    activateRoute('#/learn');
    expect(visibleSections()).toEqual(['drill', 'quiz', 'about', 'sources']);
  });

  it('shows only sources on #/sources and #/sources/medical', () => {
    for (const h of ['#/sources', '#/sources/medical']) {
      activateRoute(h);
      expect(visibleSections()).toEqual(['sources']);
      expect(document.body.dataset.route).toBe('sources');
    }
  });
  it('falls back to landing for a sub-route of a route that takes no param', () => {
    activateRoute('#/prepare/medical');
    expect(visibleSections()).toEqual(['hero']);
  });
  it('tells listeners the route name and its param', () => {
    const seen: RouteDetail[] = [];
    const on = (e: Event) => seen.push((e as CustomEvent<RouteDetail>).detail);
    document.addEventListener('mamoru:route', on);
    activateRoute('#/sources/medical'); activateRoute('#/learn');
    document.removeEventListener('mamoru:route', on);
    expect(seen).toEqual([{ route: 'sources', param: 'medical' }, { route: 'learn', param: null }]);
  });
  it('resolves a param only for a param route', () => {
    expect(['#/sources/medical', '#/sources', '#/sources/', '#/learn/x'].map(resolveRoute)).toEqual([
      { route: '#/sources', param: 'medical' }, { route: '#/sources', param: null },
      { route: '#/', param: null }, { route: '#/', param: null }]);
  });

  // --- Plan ---

  it('shows only myplan on #/plan', () => {
    activateRoute('#/plan');
    expect(visibleSections()).toEqual(['myplan']);
  });

  // --- Shelter ---

  it('shows only shelter on #/shelter', () => {
    activateRoute('#/shelter');
    expect(visibleSections()).toEqual(['shelter']);
  });

  // --- Show / Alerts (emergency mode targets) ---

  it('shows only showthis on #/show', () => {
    activateRoute('#/show');
    expect(visibleSections()).toEqual(['showthis']);
  });

  it('shows only alerts on #/alerts', () => {
    activateRoute('#/alerts');
    expect(visibleSections()).toEqual(['alerts']);
  });

  // --- Unknown hash → fallback to landing ---

  it('falls back to landing for an unknown hash', () => {
    activateRoute('#/unknown-route');
    expect(visibleSections()).toEqual(['hero']);
  });

  it('falls back to landing for an empty hash', () => {
    activateRoute('');
    expect(visibleSections()).toEqual(['hero']);
  });

  // --- Section isolation ---

  it('hides all sections from the previous route when route changes', () => {
    activateRoute('#/prepare');
    // Prepare sections are visible
    expect(visibleSections()).toContain('earthquake');

    activateRoute('#/learn');
    // Prepare sections must now be hidden
    expect(visibleSections()).not.toContain('earthquake');
    expect(visibleSections()).toEqual(['drill', 'quiz', 'about', 'sources']);
  });

  it('does not show sections from multiple routes at once', () => {
    activateRoute('#/shelter');
    const visible = visibleSections();
    // Only shelter should be visible, nothing from other routes
    expect(visible).toEqual(['shelter']);
    expect(visible).not.toContain('myplan');
    expect(visible).not.toContain('earthquake');
  });

  // --- aria-current ---

  it('sets aria-current="page" on the matching nav link', () => {
    activateRoute('#/prepare');
    expect(activeNavLink()).toBe('#/prepare');
  });

  it('removes aria-current="page" from the old link when route changes', () => {
    activateRoute('#/prepare');
    activateRoute('#/learn');
    expect(activeNavLink()).toBe('#/learn');
  });

  it('removes aria-current from all non-active nav links', () => {
    activateRoute('#/shelter');
    const withFalse = document.querySelectorAll('[data-nav-route][aria-current="false"]');
    expect(withFalse.length).toBe(0);
    const withCurrent = document.querySelectorAll('[data-nav-route][aria-current]');
    // only the active link(s) should carry aria-current
    withCurrent.forEach(el => expect(el.getAttribute('aria-current')).toBe('page'));
  });

  // --- data-route attribute ---

  it('sets correct data-route for each route', () => {
    const cases: [string, string][] = [
      ['#/',          'home'],
      ['#/emergency', 'emergency'],
      ['#/prepare',   'prepare'],
      ['#/learn',     'learn'],
      ['#/plan',      'plan'],
      ['#/shelter',   'shelter'],
    ];
    cases.forEach(([hash, expected]) => {
      activateRoute(hash);
      expect(document.body.dataset.route).toBe(expected);
    });
  });
});


describe('legacy redirects', () => {
  beforeEach(() => {
    buildDOM();
    window.location.hash = '';
  });

  it('redirects #shelter to #/shelter via window.location.hash', () => {
    activateRoute('#shelter');
    expect(window.location.hash).toBe('#/shelter');
  });

  it('redirects #myplan to #/plan', () => {
    activateRoute('#myplan');
    expect(window.location.hash).toBe('#/plan');
  });

  it('redirects #vocab to #/prepare', () => {
    activateRoute('#vocab');
    expect(window.location.hash).toBe('#/prepare');
  });

  it('redirects #drill to #/learn', () => {
    activateRoute('#drill');
    expect(window.location.hash).toBe('#/learn');
  });

  it('redirects #earthquake to #/prepare', () => {
    activateRoute('#earthquake');
    expect(window.location.hash).toBe('#/prepare');
  });

  it('redirects #firstaid to #/firstaid', () => {
    activateRoute('#firstaid');
    expect(window.location.hash).toBe('#/firstaid');
  });

  it('redirects #showthis to #/show', () => {
    activateRoute('#showthis');
    expect(window.location.hash).toBe('#/show');
  });
});


describe('emergency buttons', () => {
  const TARGET: Record<string, string> = { '#/firstaid': 'firstaid', '#/shelter': 'shelter', '#/show': 'showthis' };
  beforeEach(() => { document.body.innerHTML = new DOMParser().parseFromString(read('index.html'), 'text/html').body.innerHTML; });
  it('link only to routes, never to legacy anchors', () => {
    const hrefs = [...document.querySelectorAll('#emergencyFabPanel a[href^="#"]')].map(a => a.getAttribute('href')!);
    expect(hrefs).toEqual(Object.keys(TARGET));
    hrefs.forEach(h => expect(Object.keys(ROUTE_SECTIONS)).toContain(h));
  });
  it.each(Object.entries(TARGET))('%s shows section #%s and only that section', (href, id) => {
    activateRoute(href);
    expect(document.getElementById(id)!.classList.contains('route-hidden')).toBe(false);
    expect(ROUTE_SECTIONS[href]).toEqual([id]);
  });
  it('a tap on the button for the route already open scrolls to the section again', () => {
    window.location.hash = '#/firstaid'; activateRoute('#/firstaid');
    const scroll = vi.spyOn(window, 'scrollTo'); initEmergencyFab();
    document.querySelector<HTMLAnchorElement>('#emergencyFabPanel a[href="#/firstaid"]')!.click();
    expect(scroll).toHaveBeenCalled();
  });
});
