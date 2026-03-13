// PWA Install Prompt
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Check if user dismissed recently (7 day cooldown)
  const dismissed = localStorage.getItem('mamoru-install-dismissed');
  if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;
  // Show banner after 30s
  setTimeout(() => {
    const banner = document.getElementById('installBanner');
    if (banner && deferredPrompt) banner.classList.add('show');
  }, 30000);
});

async function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    showToast('App installed!');
  }
  deferredPrompt = null;
  document.getElementById('installBanner')?.classList.remove('show');
}

function dismissInstall() {
  document.getElementById('installBanner')?.classList.remove('show');
  localStorage.setItem('mamoru-install-dismissed', Date.now().toString());
  deferredPrompt = null;
}

window.addEventListener('appinstalled', () => {
  document.getElementById('installBanner')?.classList.remove('show');
  deferredPrompt = null;
});

// === SHARE ===
async function shareGuide() {
  const shareData = {
    title: 'MAMORU GUIDE 守る',
    text: 'Disaster preparedness guide for international students in Japan',
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!');
    }
  }
}

// === MAIN INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  buildSkyline();
  initTheme();
  initLang();
  initEarthquakeScale();
  initVocab();
  renderBagItems();
  updateBagStats();
  initScrollReveal();
  initMobileNav();
  initEmergencyPlan();
});
