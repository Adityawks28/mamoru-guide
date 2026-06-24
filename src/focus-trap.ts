// Shared focus management for overlays/dialogs/menus.
// Traps Tab within `container`, closes on Escape, and restores focus to
// whatever was focused before the overlay opened.

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface TrapHandle {
  release(): void;
}

export function trapFocus(container: HTMLElement, onEscape: () => void): TrapHandle {
  const previous = document.activeElement as HTMLElement | null;

  const visibleFocusable = (): HTMLElement[] =>
    Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
    );

  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onEscape();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = visibleFocusable();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Capture phase so Escape works even if inner handlers stop propagation.
  document.addEventListener('keydown', onKeydown, true);

  const items = visibleFocusable();
  (items[0] ?? container).focus();

  return {
    release(): void {
      document.removeEventListener('keydown', onKeydown, true);
      if (previous && typeof previous.focus === 'function') previous.focus();
    },
  };
}
