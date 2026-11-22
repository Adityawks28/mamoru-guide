import { describe, it, expect, beforeEach } from 'vitest';
import { initVocab, nextCard, prevCard, switchTab } from '../vocab';
import { vocabData } from '../data';
import { WARNING_WORDS } from '../data/warning-words';
import { GLOSSARY } from '../data/glossary';

beforeEach(() => {
  document.body.innerHTML = `
    <span id="fcCounterDanger"></span>
    <div id="vocabFlashcardDanger"></div>
  `;
  initVocab();
});

const card = () => document.getElementById('vocabFlashcardDanger')!;

describe('vocab flashcard', () => {
  it('shows the first card', () => {
    expect(card().className).toBe('flashcard-card cat-danger');
    expect(card().querySelector('.flashcard-jp')!.textContent).toBe(vocabData.danger[0].jp);
  });

  // The slide-in is a CSS animation on the card box. A browser plays it again
  // only for a new box: setting the same class name again does nothing.
  it.each([
    ['next', nextCard],
    ['previous', prevCard],
  ] as const)('the %s card is a new box, so its slide-in plays again', (_name, move) => {
    const before = card();
    move('danger');
    expect(card()).not.toBe(before);
    expect(before.isConnected).toBe(false);
    expect(card().className).toBe('flashcard-card cat-danger');
    expect(card().querySelector('.flashcard-jp')!.textContent).not.toBe(before.querySelector('.flashcard-jp')!.textContent);
  });
});

describe('warnings flashcard', () => {
  const CATS = ['danger', 'action', 'places', 'help', 'medical', 'warnings'];
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const card = (cat: string) => document.getElementById('vocabFlashcard' + cat)!;
  let tabBar: HTMLElement;
  let tabs: HTMLElement[];

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="vocab" class="section">
        <div class="tab-bar">
          ${CATS.map(c => `<button class="tab-btn" data-tab="${c}"></button>`).join('')}
        </div>
        ${CATS.map(c => `<div class="tab-content" id="vocabPanel${cap(c)}" data-tab="${c}" data-group="vocab"></div>`).join('')}
        <span id="fcCounterDanger"></span><div id="vocabFlashcardDanger"></div>
        <span id="fcCounterWarnings"></span><div id="vocabFlashcardWarnings"></div>
      </section>`;
    initVocab();
    switchTab('danger', 'vocab');
    tabBar = document.querySelector<HTMLElement>('#vocab .tab-bar')!;
    tabs = Array.from(tabBar.querySelectorAll<HTMLElement>('.tab-btn'));
  });

  it('shows the first warning word with its reading, terms and what to do', () => {
    switchTab('warnings', 'vocab');
    const w = WARNING_WORDS[0];
    const g = GLOSSARY.find(t => t.ja === w.term)!;
    const c = document.getElementById('vocabFlashcardWarnings')!;
    expect(c.className).toBe('flashcard-card cat-warnings');
    expect(c.querySelector('.flashcard-jp')!.textContent).toBe(w.term);
    expect(c.querySelector('.flashcard-reading')!.textContent).toBe(g.reading);
    expect(c.querySelector('.flashcard-reading')!.getAttribute('lang')).toBe('ja');
    expect(c.querySelector('.flashcard-romaji')!.textContent).toBe(w.rom);
    expect(c.textContent).toContain(g.en);
    expect(c.textContent).toContain(g.id);
    for (const l of ['en', 'ja', 'id'] as const)
      expect(c.querySelector(`.flashcard-instruction [data-lang="${l}"]`)!.textContent).toBe(w[`instruction_${l}`]);
    expect(document.getElementById('fcCounterWarnings')!.textContent).toBe(`1 / ${WARNING_WORDS.length}`);
  });
  it('Previous on the first warning word shows the last one', () => {
    switchTab('warnings', 'vocab');
    prevCard('warnings');
    expect(card('Warnings').querySelector('.flashcard-jp')!.textContent).toBe(WARNING_WORDS[WARNING_WORDS.length - 1].term);
  });
  it('End on the tab bar opens the Warnings tab', () => {
    tabs[0].focus();
    tabBar.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement!.getAttribute('data-tab')).toBe('warnings');
    expect(document.getElementById('vocabPanelWarnings')!.classList.contains('active')).toBe(true);
  });
  it('a card from another tab has no reading or instruction row', () => {
    expect(card('Danger').querySelector('.flashcard-reading, .flashcard-instruction')).toBeNull();
  });
});
