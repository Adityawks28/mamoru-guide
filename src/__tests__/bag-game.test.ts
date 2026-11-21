import { bagItems, MAX_BAG_WEIGHT } from '../data';
import { formatWeight } from '../bag-game';

describe('emergency bag data', () => {
  it('everything together is too heavy, so packing is a real choice', () => {
    const total = bagItems.reduce((s, i) => s + i.weight, 0);
    expect(total).toBeGreaterThan(MAX_BAG_WEIGHT * 1.3);
  });

  it('uses 10 kg as the game rule', () => {
    expect(MAX_BAG_WEIGHT).toBe(10);
  });

  it('six 500 ml bottles weigh at least the 3 kg of water inside them', () => {
    const water = bagItems.find(i => i.en.startsWith('Water (500 mL × 6)'))!;
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

describe('bag score', () => {
  const RESULT = '<div id="bagResult"><div id="bagFinalScore"></div><div id="bagBestScore"></div><h3 id="bagResultTitle"></h3><p id="bagResultMsg"></p></div>';

  it.each([
    ['en', '⚠ Not Ready'],
    ['ja', '⚠ まだ準備ができていません'],
    ['id', '⚠ Belum Siap'],
  ] as const)('shows the score title and message in %s, and they follow a language change', async (lang, title) => {
    localStorage.clear();
    document.body.innerHTML = RESULT;
    const { setLang } = await import('../lang');
    const { checkBag, resetBag } = await import('../bag-game');
    const { t } = await import('../i18n');
    resetBag();
    setLang(lang);
    checkBag();
    expect(document.getElementById('bagResultTitle')!.textContent).toBe(title);
    expect(document.getElementById('bagResultMsg')!.textContent).toBe(t('bag.result.notReady.msg', lang));
    setLang(lang === 'en' ? 'ja' : 'en');
    expect(document.getElementById('bagResultTitle')!.textContent).toBe(t('bag.result.notReady.title', lang === 'en' ? 'ja' : 'en'));
    setLang('en');
  });
});
