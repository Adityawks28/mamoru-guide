import { initStars } from './stars';
import { buildSkyline } from './skyline';
import { initTheme, toggleDayNight } from './theme';
import { initLang, setLang, currentLang } from './lang';
import { initRouter } from './router';
import { initScrollReveal } from './scroll-reveal';
import { initMobileNav } from './nav';
import { initEmergencyFab } from './emergency-fab';
import { showToast } from './toast';
import { initMascot } from './character/mascot';
import { initEarthquakeNow, showEarthquakeNow } from './earthquake-now';
import type { Language } from './types';

function lang3(en: string, ja: string, id: string): string {
  return currentLang === 'ja' ? ja : currentLang === 'id' ? id : en;
}

// === LAST UPDATED (build date) ===
const MONTHS: Record<'en' | 'id', string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  id: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
};

export function formatBuildDate(iso: string, lang: Language): string {
  const [y, m, d] = iso.split('-').map(Number);
  return lang === 'ja' ? `${y}年${m}月${d}日` : `${d} ${MONTHS[lang][m - 1]} ${y}`;
}

// Fills each hidden .build-date slot in the About section. Without a valid
// date (tests, or a build without the define) the slots stay hidden.
export function renderBuildDate(root: ParentNode, iso: string | undefined): void {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
  root.querySelectorAll<HTMLElement>('.build-date').forEach((slot) => {
    const lang = slot.closest<HTMLElement>('[data-lang]')?.dataset.lang;
    const time = slot.querySelector('time');
    if (!time || (lang !== 'en' && lang !== 'ja' && lang !== 'id')) return;
    time.dateTime = iso;
    time.textContent = formatBuildDate(iso, lang);
    slot.hidden = false;
  });
}

// === SHARE ===
async function shareGuide(): Promise<void> {
  const shareData = {
    title: 'MAMORU GUIDE 守る',
    text: 'Disaster preparedness guide for international students in Japan',
    url: window.location.href
  };
  const copied = (): void =>
    showToast(lang3('Link copied', 'リンクをコピーしました', 'Tautan disalin'), 'success');
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      copied();
    }
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      await navigator.clipboard.writeText(window.location.href);
      copied();
    }
  }
}

// Expose functions for inline onclick handlers in HTML
Object.assign(window, {
  setLang,
  toggleDayNight,
  shareGuide,
  showToast,
  showEarthquakeNow,
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
  initEarthquakeNow();
  renderBuildDate(document, typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : undefined);

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
});

// === SERVICE WORKER ===
// Production only: in dev, Vite's module URLs aren't content-hashed, so the
// worker's cache-first JS would keep serving the first copy it saw.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
  navigator.serviceWorker.addEventListener('message', (e: MessageEvent) => {
    if (e.data && e.data.type === 'SW_UPDATED') {
      showToast(lang3(
        'A new version is available. Reload the page to update.',
        '新しいバージョンがあります。ページを再読み込みしてください。',
        'Versi baru tersedia. Muat ulang halaman untuk memperbarui.',
      ), 'info');
    }
  });
}
