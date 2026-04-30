import { t } from './i18n';

interface ChipDef {
  section: string;
  i18n: string;
}

const ROUTE_CHIPS: Record<string, ChipDef[]> = {
  prepare: [
    { section: 'earthquake', i18n: 'chip.earthquake' },
    { section: 'alerts',     i18n: 'chip.alerts' },
    { section: 'typhoon',    i18n: 'chip.typhoon' },
    { section: 'vocab',      i18n: 'chip.vocab' },
    { section: 'showthis',   i18n: 'chip.showthis' },
    { section: 'bag',        i18n: 'chip.bag' },
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
    sectionToChip.set(chip.dataset.target!, chip);
  });

  scrollSpy = new IntersectionObserver(
    entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length === 0) return;
      const chip = sectionToChip.get(visible[0].target.id);
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
