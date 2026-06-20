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
  const mobileToggle = document.getElementById('mobileThemeToggle');
  if (mobileToggle) mobileToggle.textContent = isDayMode ? '🌙 Night Mode' : '☀️ Day Mode';
  localStorage.setItem('mamoru-theme', isDayMode ? 'day' : 'night');
}

export function initTheme(): void {
  const saved = localStorage.getItem('mamoru-theme');
  let shouldBeDay = false;

  if (saved === 'day') {
    shouldBeDay = true;
  } else if (saved === 'night') {
    shouldBeDay = false;
  } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    shouldBeDay = true;
  }

  if (shouldBeDay) {
    isDayMode = true;
    document.body.classList.add('day-mode');
    const hero = document.getElementById('hero');
    if (hero) {
      hero.classList.remove('night-sky');
      hero.classList.add('day-sky');
    }
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) modeToggle.textContent = '🌙';
    const mobileToggle = document.getElementById('mobileThemeToggle');
    if (mobileToggle) mobileToggle.textContent = '🌙 Night Mode';
  }
}
