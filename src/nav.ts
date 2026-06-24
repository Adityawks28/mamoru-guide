import { trapFocus, type TrapHandle } from './focus-trap';

let trap: TrapHandle | null = null;

export function initMobileNav(): void {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const open = (): void => {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    trap = trapFocus(mobileMenu, close);
  };

  const close = (): void => {
    if (!mobileMenu.classList.contains('open')) return;
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    trap?.release();
    trap = null;
  };

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) close();
    else open();
  });

  // Navigation links close the menu; theme/lang buttons leave it open.
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close when tapping outside the menu (and not on the hamburger).
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target as Node) &&
      !hamburger.contains(e.target as Node)
    ) {
      close();
    }
  });
}
