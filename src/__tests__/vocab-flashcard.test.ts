import { describe, it, expect, beforeEach } from 'vitest';
import { initVocab, nextCard, prevCard } from '../vocab';
import { vocabData } from '../data';

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
