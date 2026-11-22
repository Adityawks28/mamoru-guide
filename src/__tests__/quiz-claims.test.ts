import { describe, it, expect } from 'vitest';
import { CLAIMS } from '../data/sources';
import { WARNING_WORDS } from '../data/warning-words';
import { questions } from '../quiz';

describe('quiz warning word questions', () => {
  const sourced = questions.filter((q) => q.claimId);

  it('has 2 or 3 sourced warning-word questions', () => {
    expect(sourced.length).toBeGreaterThanOrEqual(2);
    expect(sourced.length).toBeLessThanOrEqual(3);
    for (const q of sourced) expect(['verified', 'changed']).toContain(CLAIMS[q.claimId!].status);
  });

  it('the correct answer repeats the claim line from WARNING_WORDS', () => {
    for (const q of sourced) {
      const w = WARNING_WORDS.find((x) => x.claimId === q.claimId)!;
      expect(w, q.claimId).toBeDefined();
      const right = q.options[q.correct];
      expect(right.en).toBe(w.instruction_en);
      expect(right.ja).toBe(w.instruction_ja);
      expect(right.id).toBe(w.instruction_id);
      expect(q.explain_en).toContain(w.instruction_en);
      expect(q.explain_ja).toContain(w.instruction_ja);
      expect(q.explain_id).toContain(w.instruction_id);
    }
  });
});
