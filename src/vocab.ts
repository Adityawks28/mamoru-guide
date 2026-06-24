import { vocabData } from './data';
import type { VocabCategory } from './types';

const cardIndex: Record<VocabCategory, number> = {
  danger: 0,
  action: 0,
  places: 0,
  help: 0,
  medical: 0,
};

function renderFlashcard(cat: VocabCategory): void {
  const items = vocabData[cat];
  const idx = cardIndex[cat];
  const v = items[idx];
  const container = document.getElementById('vocabFlashcard' + cap(cat));
  const counter   = document.getElementById('fcCounter' + cap(cat));
  if (!container || !v) return;

  if (counter) counter.textContent = `${idx + 1} / ${items.length}`;

  // Re-trigger animation by swapping class
  container.className = `flashcard-card cat-${cat}`;
  container.innerHTML = `
    <div class="flashcard-jp">${v.jp}</div>
    <div class="flashcard-romaji">${v.rom}</div>
    <hr class="flashcard-divider">
    <div class="flashcard-translations">
      <div class="flashcard-translation"><span class="flag">🇬🇧</span>${v.en}</div>
      <div class="flashcard-translation"><span class="flag">🇮🇩</span>${v.id}</div>
    </div>`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function prevCard(cat: VocabCategory): void {
  const items = vocabData[cat];
  cardIndex[cat] = (cardIndex[cat] - 1 + items.length) % items.length;
  renderFlashcard(cat);
}

export function nextCard(cat: VocabCategory): void {
  const items = vocabData[cat];
  cardIndex[cat] = (cardIndex[cat] + 1) % items.length;
  renderFlashcard(cat);
}

export function switchTab(tabId: string, group: string): void {
  document.querySelectorAll(`.tab-content[data-group="${group}"]`).forEach(t => t.classList.remove('active'));
  const target = document.querySelector(`.tab-content[data-tab="${tabId}"][data-group="${group}"]`);
  if (target) target.classList.add('active');

  const section = target ? target.closest('.section') : null;
  if (section) {
    section.querySelectorAll('.tab-btn').forEach(b => {
      const btnTab = b.getAttribute('data-tab');
      const isActive = btnTab === tabId;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      b.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  // Reset to first card when switching vocab tabs
  if (group === 'vocab') {
    cardIndex[tabId as VocabCategory] = 0;
    renderFlashcard(tabId as VocabCategory);
  }
}

export function initVocab(): void {
  const cats: VocabCategory[] = ['danger', 'action', 'places', 'help', 'medical'];
  cats.forEach(cat => renderFlashcard(cat));

  // Roving-tabindex arrow navigation between the vocab category tabs.
  const tabBar = document.querySelector<HTMLElement>('#vocab .tab-bar');
  tabBar?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const tabs = Array.from(tabBar.querySelectorAll<HTMLElement>('.tab-btn'));
    const current = tabs.findIndex(t => t === document.activeElement);
    if (current === -1) return;
    e.preventDefault();
    e.stopPropagation();
    let next = current;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    const cat = tabs[next].getAttribute('data-tab');
    if (cat) { switchTab(cat, 'vocab'); tabs[next].focus(); }
  });

  // Keyboard navigation for flashcards
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const activeTab = document.querySelector('#vocab .tab-btn.active');
    if (!activeTab) return;
    const cat = activeTab.getAttribute('data-tab') as VocabCategory;
    if (!cat) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); nextCard(cat); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prevCard(cat); }
  });
}
