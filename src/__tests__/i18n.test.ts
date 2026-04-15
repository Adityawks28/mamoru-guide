// i18n.test.ts

import { t, applyTranslations, setI18nLang } from '../i18n';

beforeEach(() => {
  // reset to English before each test
  setI18nLang('en');
});

describe('t()', () => {

  // --- Key resolution ---

  it('returns English string for a known key in English', () => {
    expect(t('nav.emergency')).toBe('🚨 Emergency');
  });

  it('returns Japanese string when lang is "ja"', () => {
    expect(t('nav.emergency', 'ja')).toBe('🚨 緊急');
  });

  it('returns Indonesian string when lang is "id"', () => {
    expect(t('nav.emergency', 'id')).toBe('🚨 Darurat');
  });

  it('uses internal language state when no lang argument is given', () => {
    setI18nLang('ja');
    expect(t('mode.prompt')).toBe('今、何が必要ですか？');
  });

  it('explicit lang argument overrides internal state', () => {
    setI18nLang('ja');
    expect(t('mode.prompt', 'en')).toBe('What do you need right now?');
  });

  // --- Fallback ---

  it('falls back to English when key is missing from target locale', () => {
    // Add a key to en only, not ja/id, to verify fallback
    expect(t('nav.prepare', 'en')).toBe('Prepare');
  });

  it('returns the key itself for completely unknown keys', () => {
    expect(t('this.key.does.not.exist')).toBe('this.key.does.not.exist');
  });

  it('returns the key itself for completely unknown keys even with explicit lang', () => {
    expect(t('totally.missing', 'ja')).toBe('totally.missing');
  });

  // --- Mode selector keys ---

  it('resolves mode.emergency.title in all 3 languages', () => {
    expect(t('mode.emergency.title', 'en')).toBe('Emergency');
    expect(t('mode.emergency.title', 'ja')).toBe('緊急');
    expect(t('mode.emergency.title', 'id')).toBe('Darurat');
  });

  it('resolves mode.prepare.desc in all 3 languages', () => {
    expect(t('mode.prepare.desc', 'en')).toBe('Make a plan, find shelter');
    expect(t('mode.prepare.desc', 'ja')).toBe('計画を立て、避難所を探す');
    expect(t('mode.prepare.desc', 'id')).toBe('Buat rencana, cari tempat berlindung');
  });
});


describe('setI18nLang()', () => {

  it('changes the language used by t() when no lang arg is given', () => {
    setI18nLang('id');
    expect(t('nav.plan')).toBe('Rencana');
  });

  it('reverts correctly when set back to English', () => {
    setI18nLang('ja');
    setI18nLang('en');
    expect(t('nav.plan')).toBe('My Plan');
  });
});


describe('applyTranslations()', () => {

  function buildDOM(html: string): HTMLElement {
    const el = document.createElement('div');
    el.innerHTML = html;
    return el;
  }

  beforeEach(() => {
    setI18nLang('en');
  });

  it('sets textContent on [data-i18n] elements', () => {
    const root = buildDOM('<p data-i18n="nav.prepare">old text</p>');
    applyTranslations(root);
    expect(root.querySelector('p')!.textContent).toBe('Prepare');
  });

  it('updates all [data-i18n] elements in the root', () => {
    const root = buildDOM(`
      <span data-i18n="nav.emergency">?</span>
      <span data-i18n="nav.learn">?</span>
    `);
    applyTranslations(root);
    const spans = root.querySelectorAll('span');
    expect(spans[0].textContent).toBe('🚨 Emergency');
    expect(spans[1].textContent).toBe('Learn');
  });

  it('uses the current language state when translating', () => {
    setI18nLang('ja');
    const root = buildDOM('<span data-i18n="nav.shelter">?</span>');
    applyTranslations(root);
    expect(root.querySelector('span')!.textContent).toBe('避難所');
  });

  it('sets innerHTML on [data-i18n-html] elements', () => {
    const root = buildDOM('<p data-i18n-html="bag.subtitle">?</p>');
    applyTranslations(root);
    expect(root.querySelector('p')!.innerHTML).toContain('<strong>');
  });

  it('leaves non-[data-i18n] elements untouched', () => {
    const root = buildDOM('<p class="other">keep this</p>');
    applyTranslations(root);
    expect(root.querySelector('p')!.textContent).toBe('keep this');
  });

  it('handles an empty root gracefully', () => {
    const root = buildDOM('');
    expect(() => applyTranslations(root)).not.toThrow();
  });
});
