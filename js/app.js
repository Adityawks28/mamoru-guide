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
