export function initEmergencyFab(): void {
  const fab = document.getElementById('emergencyFab');
  const panel = document.getElementById('emergencyFabPanel');
  if (!fab || !panel) return;

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.toggle('open');
    fab.classList.toggle('active', isOpen);
    fab.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target as Node) && !fab.contains(e.target as Node)) {
      panel.classList.remove('open');
      fab.classList.remove('active');
      fab.setAttribute('aria-expanded', 'false');
    }
  });

  // Close panel links after click (for section links)
  panel.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      panel.classList.remove('open');
      fab.classList.remove('active');
      fab.setAttribute('aria-expanded', 'false');
    });
  });
}
