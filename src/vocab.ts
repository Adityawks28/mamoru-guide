import { vocabData } from './data';
import type { VocabCategory } from './types';

export function renderVocab(cat: VocabCategory, containerId: string): void {
  const c = document.getElementById(containerId);
  if (!c) return;
  vocabData[cat].forEach(v => {
    const d = document.createElement('div');
    d.className = `vocab-card cat-${cat}`;
    d.innerHTML = `<div class="vocab-jp">${v.jp}</div>
      <div class="vocab-romaji">${v.rom}</div>
      <div class="vocab-meaning"><span class="flag">🇬🇧</span>${v.en}</div>
      <div class="vocab-meaning"><span class="flag">🇮🇩</span>${v.id}</div>`;
    c.appendChild(d);
  });
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
    });
  }
}

export function initVocab(): void {
  renderVocab('danger', 'vocabDanger');
  renderVocab('action', 'vocabAction');
  renderVocab('places', 'vocabPlaces');
  renderVocab('help', 'vocabHelp');
}
