import { initStars } from './stars';
import { buildSkyline } from './skyline';
import { initTheme, toggleDayNight } from './theme';
import { initLang, setLang } from './lang';
import { initRouter } from './router';
import { initEarthquakeScale } from './earthquake-scale';
import { initVocab, switchTab, prevCard, nextCard } from './vocab';
import { renderBagItems, updateBagStats, checkBag, resetBag } from './bag-game';
import { initScrollReveal } from './scroll-reveal';
import { initMobileNav } from './nav';
import { initEmergencyPlan, savePlan, clearPlan, printPlan } from './emergency-plan';
import { initContacts } from './contacts';
import { initTyphoonScale } from './typhoon';
import { initShowThis } from './show-this';
import { initEmergencyFab } from './emergency-fab';
import { initFirstAid } from './first-aid';
import { initDrill } from './drill';
import { initShelterFinder } from './shelter-finder';
import { initQuiz } from './quiz';
import { showToast } from './toast';

// === SHARE ===
async function shareGuide(): Promise<void> {
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
    if (err instanceof Error && err.name !== 'AbortError') {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!');
    }
  }
}

// Expose functions for inline onclick handlers in HTML
Object.assign(window, {
  setLang,
  toggleDayNight,
  shareGuide,
  switchTab,
  prevCard,
  nextCard,
  checkBag,
  resetBag,
  savePlan,
  clearPlan,
  printPlan,
  showToast,
});

// === MAIN INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  buildSkyline();
  initTheme();
  initLang();
  initRouter();
  initEarthquakeScale();
  initVocab();
  renderBagItems();
  updateBagStats();
  initTyphoonScale();
  initShowThis();
  initFirstAid();
  initShelterFinder();
  initDrill();
  initQuiz();
  initContacts();
  initScrollReveal();
  initMobileNav();
  initEmergencyPlan();
  initEmergencyFab();
});

// === SERVICE WORKER ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
  navigator.serviceWorker.addEventListener('message', (e: MessageEvent) => {
    if (e.data && e.data.type === 'SW_UPDATED') {
      showToast('New version available — refresh to update');
    }
  });
}
