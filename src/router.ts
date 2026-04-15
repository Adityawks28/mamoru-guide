// router.ts — hash-based view router
// Maps #/route → section IDs to show. Everything else gets route-hidden.


const ROUTE_SECTIONS: Record<string, string[]> = {
  '#/':          ['hero', 'mode-selector'],
  '#/emergency': ['emergency-mode'],
  '#/prepare':   ['earthquake', 'alerts', 'typhoon', 'vocab', 'showthis', 'bag', 'firstaid', 'contacts'],
  '#/learn':     ['drill', 'quiz', 'about'],
  '#/plan':      ['myplan'],
  '#/shelter':   ['shelter'],
};

// Legacy v1 anchors → redirect to new route format
const REDIRECTS: Record<string, string> = {
  '#earthquake': '#/prepare',
  '#vocab':      '#/prepare',
  '#showthis':   '#/prepare',
  '#bag':        '#/prepare',
  '#alerts':     '#/prepare',
  '#firstaid':   '#/prepare',
  '#contacts':   '#/prepare',
  '#typhoon':    '#/prepare',
  '#shelter':    '#/shelter',
  '#drill':      '#/learn',
  '#quiz':       '#/learn',
  '#about':      '#/learn',
  '#myplan':     '#/plan',
};

const ALL_SECTION_IDS: string[] = [
  ...new Set(Object.values(ROUTE_SECTIONS).flat()),
];

export function activateRoute(hash: string): void {
  const redirect = REDIRECTS[hash];
  if (redirect) {
    window.location.hash = redirect;
    return;
  }

  const route = Object.prototype.hasOwnProperty.call(ROUTE_SECTIONS, hash) ? hash : '#/';

  ALL_SECTION_IDS.forEach(id => {
    document.getElementById(id)?.classList.add('route-hidden');
  });

  ROUTE_SECTIONS[route].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('route-hidden');
      // trigger scroll-reveal on newly visible sections
      el.querySelectorAll('.section:not(.visible)').forEach(s => s.classList.add('visible'));
    }
  });

  document.body.dataset.route = route.replace('#/', '') || 'home';

  document.querySelectorAll<HTMLAnchorElement>('[data-nav-route]').forEach(link => {
    link.setAttribute('aria-current', link.dataset.navRoute === route ? 'page' : 'false');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let initialized = false;

export function initRouter(): void {
  if (initialized) return;
  initialized = true;

  window.addEventListener('hashchange', () => {
    activateRoute(window.location.hash);
  });

  activateRoute(window.location.hash || '#/');
}
