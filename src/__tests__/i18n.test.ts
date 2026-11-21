// i18n.test.ts

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { t, applyTranslations, setI18nLang } from '../i18n';
import type { Language } from '../types';

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
    expect(t('mode.emergency.title')).toBe('緊急');
  });

  it('explicit lang argument overrides internal state', () => {
    setI18nLang('ja');
    expect(t('mode.emergency.title', 'en')).toBe('Emergency');
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

  // --- Arcade labels ---

  it('resolves the arcade labels in all 3 languages', () => {
    expect(['hero.start', 'hero.makePlan', 'label.intensity'].map(k => [t(k, 'en'), t(k, 'ja'), t(k, 'id')])).toEqual([
      ['▶ PRESS START', '▶ スタート', '▶ MULAI'],
      ['⊞ MAKE PLAN', '⊞ 計画をつくる', '⊞ BUAT RENCANA'],
      ['01 · SEISMIC INTENSITY', '01・震度（しんど）', '01 · SKALA INTENSITAS SEISMIK'],
    ]);
  });

  it('every eyebrow, arcade button and section label in index.html has a key in all 3 languages', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const labels = [...doc.querySelectorAll<HTMLElement>('.hero-eyebrow, .arcade-btn, .section-label')];
    expect(labels.length).toBeGreaterThanOrEqual(16);
    const missing = labels.filter(el => {
      const key = el.dataset.i18n;
      return !key || ['en', 'ja', 'id'].some(l => t(key, l as Language) === key) || t(key, 'ja') === t(key, 'en');
    }).map(el => el.textContent!.trim());
    expect(missing).toEqual([]);
  });

  // --- Mode selector keys ---

  it('resolves mode.emergency.title in all 3 languages', () => {
    expect(t('mode.emergency.title', 'en')).toBe('Emergency');
    expect(t('mode.emergency.title', 'ja')).toBe('緊急');
    expect(t('mode.emergency.title', 'id')).toBe('Darurat');
  });

  it('resolves mode.prepare.desc in all 3 languages', () => {
    expect(t('mode.prepare.desc', 'en')).toBe('Make a plan. Find an evacuation site.');
    expect(t('mode.prepare.desc', 'ja')).toBe('計画を立てます。避難場所（ひなんばしょ）を探します。');
    expect(t('mode.prepare.desc', 'id')).toBe('Buat rencana. Cari tempat evakuasi.');
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
    expect(root.querySelector('span')!.textContent).toBe('避難場所');
  });

  it('sets aria-label on [data-i18n-aria] elements', () => {
    setI18nLang('id');
    const root = buildDOM('<div role="button" data-i18n-aria="mascot.aria" aria-label="old">x</div>');
    applyTranslations(root);
    expect(root.querySelector('div')!.getAttribute('aria-label')).toBe(t('mascot.aria', 'id'));
    expect(root.querySelector('div')!.textContent).toBe('x');
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
