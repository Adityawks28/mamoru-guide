import { t } from './i18n';

interface ChipDef {
  section: string;
  i18n: string;
}

export const ROUTE_CHIPS: Record<string, ChipDef[]> = {
  // Same order as the sections in index.html, which is also the order their
  // 01/02/03 labels read on screen.
  prepare: [
    { section: 'earthquake', i18n: 'chip.earthquake' },
    { section: 'vocab',      i18n: 'chip.vocab' },
    { section: 'showthis',   i18n: 'chip.showthis' },
    { section: 'bag',        i18n: 'chip.bag' },
    { section: 'alerts',     i18n: 'chip.alerts' },
    { section: 'typhoon',    i18n: 'chip.typhoon' },
    { section: 'firstaid',   i18n: 'chip.firstaid' },
    { section: 'contacts',   i18n: 'chip.contacts' },
  ],
  learn: [
    { section: 'drill', i18n: 'chip.drill' },
    { section: 'quiz',  i18n: 'chip.quiz' },
    { section: 'about', i18n: 'chip.about' },
  ],
};

let scrollSpy: IntersectionObserver | null = null;

function build(route: string): HTMLElement | null {
  const chips = ROUTE_CHIPS[route];
  if (!chips) return null;

  const nav = document.createElement('nav');
  nav.className = 'section-nav';
  nav.setAttribute('aria-label', `${route} sections`);

  const inner = document.createElement('div');
  inner.className = 'section-nav-inner';

  chips.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'section-chip';
    btn.dataset.target = c.section;
    btn.dataset.i18n = c.i18n;
    btn.textContent = t(c.i18n);
    btn.addEventListener('click', () => scrollToSection(c.section, btn));
    inner.appendChild(btn);
  });

  nav.appendChild(inner);
  return nav;
}

function scrollToSection(id: string, chip: HTMLElement): void {
  const el = document.getElementById(id);
  if (!el) return;
  const navOffset = 56 + 56;
  const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
  window.scrollTo({ top, behavior: 'smooth' });
  setActive(chip);
}

function setActive(chip: HTMLElement): void {
  chip.parentElement?.querySelectorAll('.section-chip.active').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function attachScrollSpy(nav: HTMLElement, route: string): void {
  scrollSpy?.disconnect();
  const chips = ROUTE_CHIPS[route];
  if (!chips) return;

  const sectionToChip = new Map<string, HTMLElement>();
  nav.querySelectorAll<HTMLElement>('.section-chip').forEach(chip => {
    const target = chip.dataset.target;
    if (target) sectionToChip.set(target, chip);
  });

  // Ties resolve by page order so scrolling up and scrolling down agree.
  const rank = new Map(chips.map((c, i) => [c.section, i]));

  // The observer reports only the sections whose visibility changed, so keep
  // the last reading of each one and judge them all together.
  const seen = new Map<string, { height: number; visible: boolean }>();

  scrollSpy = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        seen.set(e.target.id, { height: e.intersectionRect.height, visible: e.isIntersecting });
      });

      // Compare how much of the band each section covers in pixels. A ratio
      // would favour short sections: they sit fully inside the band and score
      // 1.0, while a long one only ever crosses part of it.
      let winner: string | null = null;
      let winnerHeight = 0;
      let winnerRank = Number.POSITIVE_INFINITY;

      seen.forEach((state, id) => {
        if (!state.visible || state.height <= 0) return;
        const r = rank.get(id) ?? Number.POSITIVE_INFINITY;
        if (state.height > winnerHeight || (state.height === winnerHeight && r < winnerRank)) {
          winner = id;
          winnerHeight = state.height;
          winnerRank = r;
        }
      });

      if (winner === null) return;
      const chip = sectionToChip.get(winner);
      if (chip && !chip.classList.contains('active')) {
        nav.querySelectorAll('.section-chip.active').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      }
    },
    { rootMargin: '-120px 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  chips.forEach(c => {
    const el = document.getElementById(c.section);
    if (el) scrollSpy!.observe(el);
  });
}

export function mountSectionNav(route: string): void {
  document.querySelectorAll('.section-nav').forEach(n => n.remove());
  scrollSpy?.disconnect();
  scrollSpy = null;

  const nav = build(route);
  if (!nav) return;

  const navbar = document.querySelector('.navbar');
  navbar?.parentNode?.insertBefore(nav, navbar.nextSibling);
  attachScrollSpy(nav, route);
}
