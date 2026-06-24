import { trapFocus, type TrapHandle } from './focus-trap';
import { showEarthquakeNow } from './earthquake-now';

let trap: TrapHandle | null = null;

export function initEmergencyFab(): void {
  const fab = document.getElementById('emergencyFab');
  const panel = document.getElementById('emergencyFabPanel');
  if (!fab || !panel) return;

  const open = (): void => {
    panel.classList.add('open');
    fab.classList.add('active');
    fab.setAttribute('aria-expanded', 'true');
    trap = trapFocus(panel, close);
  };

  const close = (): void => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    fab.classList.remove('active');
    fab.setAttribute('aria-expanded', 'false');
    trap?.release();
    trap = null;
  };

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.classList.contains('open')) close();
    else open();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target as Node) && !fab.contains(e.target as Node)) {
      close();
    }
  });

  // Navigation links/dial actions close the panel after activation.
  panel.querySelectorAll('a[href]').forEach(item => {
    item.addEventListener('click', close);
  });

  // The EARTHQUAKE NOW button opens a full-screen overlay — close the FAB
  // (releasing its focus trap) first so focus hands off cleanly to the overlay.
  document.getElementById('fabEarthquakeNow')?.addEventListener('click', () => {
    close();
    showEarthquakeNow();
  });
}
