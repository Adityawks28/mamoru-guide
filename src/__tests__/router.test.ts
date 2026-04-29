// router.test.ts

import { activateRoute } from '../router';

// jsdom doesn't implement window.scrollTo — silence the warning
beforeAll(() => { window.scrollTo = () => {}; });

// all section IDs the router manages
const ALL_IDS = [
  'hero', 'mode-selector',
  'emergency-mode',
  'earthquake', 'alerts', 'typhoon', 'vocab', 'showthis', 'bag', 'firstaid', 'contacts',
  'drill', 'quiz', 'about',
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

  it('shows hero and mode-selector on #/', () => {
    activateRoute('#/');
    expect(visibleSections()).toEqual(['hero', 'mode-selector']);
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
    expect(visibleSections()).toEqual(['drill', 'quiz', 'about']);
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
    expect(visibleSections()).toEqual(['hero', 'mode-selector']);
  });

  it('falls back to landing for an empty hash', () => {
    activateRoute('');
    expect(visibleSections()).toEqual(['hero', 'mode-selector']);
  });

  // --- Section isolation ---

  it('hides all sections from the previous route when route changes', () => {
    activateRoute('#/prepare');
    // Prepare sections are visible
    expect(visibleSections()).toContain('earthquake');

    activateRoute('#/learn');
    // Prepare sections must now be hidden
    expect(visibleSections()).not.toContain('earthquake');
    expect(visibleSections()).toEqual(['drill', 'quiz', 'about']);
  });

  it('does not show sections from multiple routes at once', () => {
    activateRoute('#/shelter');
    const visible = visibleSections();
    // Only shelter should be visible — nothing from other routes
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

  it('sets aria-current="false" on all non-active nav links', () => {
    activateRoute('#/shelter');
    const inactive = document.querySelectorAll('[data-nav-route][aria-current="false"]');
    // 5 links total, 1 active → 4 should be false
    expect(inactive.length).toBe(5);
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

  it('redirects #firstaid to #/prepare', () => {
    activateRoute('#firstaid');
    expect(window.location.hash).toBe('#/prepare');
  });
});
