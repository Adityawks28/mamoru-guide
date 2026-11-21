import type { Language } from './types';

// "Last updated" in the About section shows the build date (Japan time).
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
