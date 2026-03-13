// === DAY/NIGHT ===
let isDayMode = false;

function toggleDayNight(){
  isDayMode = !isDayMode;
  document.body.classList.toggle('day-mode', isDayMode);
  const hero = document.getElementById('hero');
  hero.classList.toggle('night-sky', !isDayMode);
  hero.classList.toggle('day-sky', isDayMode);
  document.getElementById('modeToggle').textContent = isDayMode ? '🌙' : '☀️';
  localStorage.setItem('mamoru-theme', isDayMode ? 'day' : 'night');
}

function initTheme() {
  const saved = localStorage.getItem('mamoru-theme');
  if (saved === 'day') {
    isDayMode = false; // toggleDayNight will flip to true
    toggleDayNight();
  }
}
