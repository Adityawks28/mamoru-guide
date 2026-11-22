import { describe, it, expect, beforeEach } from 'vitest';
import { initQuiz, questions } from '../quiz';

describe('quiz question count', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<p><span data-quiz-count>12</span></p><button id="quizStartBtn"></button><div id="quizContainer"></div>';
  });

  it('fills every count placeholder from questions.length', () => {
    document.querySelector('[data-quiz-count]')!.textContent = '0';
    initQuiz();
    expect(document.querySelector('[data-quiz-count]')!.textContent).toBe(String(questions.length));
  });

  it('shows questions.length in the intro of index.html', async () => {
    const { readFileSync } = await import('node:fs');
    const html = readFileSync('index.html', 'utf8');
    const spans = html.match(/<span data-quiz-count>(\d+)<\/span>/g) ?? [];
    expect(spans).toHaveLength(3);
    for (const s of spans) expect(s).toContain(`>${questions.length}<`);
    expect(html).not.toMatch(/Answer 10 questions|10問|Jawab 10 pertanyaan/);
  });
});
