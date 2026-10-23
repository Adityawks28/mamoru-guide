import { bagItems, MAX_BAG_WEIGHT } from '../data';
import { formatWeight } from '../bag-game';

describe('emergency bag data', () => {
  it('everything together is too heavy, so packing is a real choice', () => {
    const total = bagItems.reduce((s, i) => s + i.weight, 0);
    expect(total).toBeGreaterThan(MAX_BAG_WEIGHT * 1.3);
  });

  it('uses the 10 kg city guidance as the limit', () => {
    expect(MAX_BAG_WEIGHT).toBe(10);
  });

  it('six 500 ml bottles weigh at least the 3 kg of water inside them', () => {
    const water = bagItems.find(i => i.en.startsWith('Water (500ml × 6)'))!;
    expect(water.weight).toBeGreaterThanOrEqual(3);
  });

  it('a foil blanket weighs grams, not kilograms', () => {
    const blanket = bagItems.find(i => /blanket/i.test(i.en))!;
    expect(blanket.weight).toBeLessThan(0.2);
  });
});

describe('formatWeight', () => {
  it('shows grams under a kilo and kilos above', () => {
    expect(formatWeight(0.01)).toBe('10 g');
    expect(formatWeight(0.25)).toBe('250 g');
    expect(formatWeight(3.1)).toBe('3.1 kg');
    expect(formatWeight(2)).toBe('2.0 kg');
  });
});
