import { initStars } from './stars';
import { buildSkyline } from './skyline';
import { initTheme, toggleDayNight } from './theme';
import { initLang, setLang } from './lang';
import { initRouter } from './router';
import { initScrollReveal } from './scroll-reveal';
import { initMobileNav } from './nav';
import { initEmergencyFab } from './emergency-fab';
import { showToast } from './toast';
import { initMascot } from './character/mascot';

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
  showToast,
});

// === MAIN INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  buildSkyline();
  initTheme();
  initLang();
  initRouter();
  initScrollReveal();
  initMobileNav();
  initEmergencyFab();
  initMascot();

  import('./earthquake-scale').then(m => m.initEarthquakeScale());
  import('./vocab').then(m => { m.initVocab(); Object.assign(window, { switchTab: m.switchTab, prevCard: m.prevCard, nextCard: m.nextCard }); });
  import('./bag-game').then(m => { m.renderBagItems(); m.updateBagStats(); Object.assign(window, { checkBag: m.checkBag, resetBag: m.resetBag }); });
  import('./typhoon').then(m => m.initTyphoonScale());
  import('./show-this').then(m => m.initShowThis());
  import('./first-aid').then(m => m.initFirstAid());
  import('./drill').then(m => m.initDrill());
  import('./quiz').then(m => m.initQuiz());
  import('./contacts').then(m => m.initContacts());
  import('./shelter-finder').then(m => m.initShelterFinder());
  import('./emergency-plan').then(m => { m.initEmergencyPlan(); Object.assign(window, { savePlan: m.savePlan, clearPlan: m.clearPlan, printPlan: m.printPlan }); });
  import('./character/earthquake-scene').then(m => m.initEarthquakeScene());
  import('./character/firstaid-scene').then(m => m.initFirstAidScene());
  import('./character/typhoon-scene').then(m => m.initTyphoonScene());
  import('./character/bag-scene').then(m => m.initBagScene());
  import('./character/bible').then(m => m.initBible());
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
