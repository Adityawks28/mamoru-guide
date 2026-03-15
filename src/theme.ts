let isDayMode = false;

export function toggleDayNight(): void {
  isDayMode = !isDayMode;
  document.body.classList.toggle('day-mode', isDayMode);
  const hero = document.getElementById('hero');
  if (hero) {
    hero.classList.toggle('night-sky', !isDayMode);
    hero.classList.toggle('day-sky', isDayMode);
  }
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) modeToggle.textContent = isDayMode ? '🌙' : '☀️';
  localStorage.setItem('mamoru-theme', isDayMode ? 'day' : 'night');
}

export function initTheme(): void {
  const saved = localStorage.getItem('mamoru-theme');
  if (saved === 'day') {
    isDayMode = false;
    toggleDayNight();
  }
}
