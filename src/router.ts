// router.ts: hash-based view router
// Maps #/route → section IDs to show. Everything else gets route-hidden.

import { mountSectionNav } from './section-nav';

export const ROUTE_SECTIONS: Record<string, string[]> = {
  '#/':          ['hero'],
  '#/emergency': ['emergency-mode'],
  '#/prepare':   ['earthquake', 'alerts', 'typhoon', 'vocab', 'showthis', 'bag', 'firstaid', 'contacts'],
  '#/learn':     ['drill', 'quiz', 'about', 'sources'],
  '#/sources':   ['sources'],
  '#/plan':      ['myplan'],
  '#/shelter':   ['shelter'],
  '#/firstaid':  ['firstaid'],
  '#/show':      ['showthis'],
  '#/alerts':    ['alerts'],
  '#/voice-check': ['voicecheck'],
};

export interface RouteDetail { route: string; param: string | null }

// Routes that accept one sub-segment, for example #/sources/medical.
export const PARAM_ROUTES: readonly string[] = ['#/sources'];

export function resolveRoute(hash: string): { route: string; param: string | null } {
  const has = (key: string): boolean => Object.prototype.hasOwnProperty.call(ROUTE_SECTIONS, key);
  if (has(hash)) return { route: hash, param: null };
  const m = /^(#\/[a-z]+)\/([a-z]+)$/.exec(hash);
  if (m && PARAM_ROUTES.includes(m[1])) return { route: m[1], param: m[2] };
  return { route: '#/', param: null };
}

// Legacy v1 anchors → redirect to new route format
const REDIRECTS: Record<string, string> = {
  '#earthquake': '#/prepare',
  '#vocab':      '#/prepare',
  '#showthis':   '#/show',
  '#bag':        '#/prepare',
  '#alerts':     '#/prepare',
  '#firstaid':   '#/firstaid',
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

  const { route, param } = resolveRoute(hash);

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

  const routeName = route.replace('#/', '') || 'home';
  document.body.dataset.route = routeName;

  document.querySelectorAll<HTMLAnchorElement>('[data-nav-route]').forEach(link => {
    if (link.dataset.navRoute === route) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  mountSectionNav(routeName);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  const detail: RouteDetail = { route: routeName, param };
  document.dispatchEvent(new CustomEvent<RouteDetail>('mamoru:route', { detail }));
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
