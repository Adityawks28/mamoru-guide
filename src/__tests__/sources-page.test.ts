import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { applyTranslations, setI18nLang } from '../i18n';
import { SOURCES, SOURCE_AREAS } from '../data/sources';
import { renderSourceList, showSources } from '../sources-page';

const read = (f: string) => readFileSync(resolve(process.cwd(), f), 'utf8');

const titles = () => [...document.querySelectorAll<HTMLElement>('.sources-group-title')];
const item = (id: string) => [...document.querySelectorAll('.source-item')]
  .find(li => li.querySelector('a')!.getAttribute('href') === SOURCES[id].url)!;

describe('sources page', () => {
  beforeEach(() => {
    document.body.innerHTML = '<time id="sourcesLastCheck"></time><div id="sourcesFilters"></div><div id="sourcesList"></div>';
    setI18nLang('en');
    window.location.hash = '#/learn';
  });

  it('shows five groups in area order', () => {
    showSources(null);
    expect(titles().map(h => h.dataset.i18n)).toEqual(SOURCE_AREAS.map(a => `sources.area.${a}`));
  });
  it('shows 113 sources with publisher, title link and checked date', () => {
    showSources(null);
    expect(document.querySelectorAll('.source-item')).toHaveLength(113);
    const li = document.querySelector('.source-item')!;
    expect(li.querySelector('.source-publisher')!.textContent).toBe(SOURCES['fdma-385-cpr-2025'].publisher);
    expect(li.querySelector('a.source-title')!.textContent).toBe(SOURCES['fdma-385-cpr-2025'].title);
    expect(li.querySelector('time')!.getAttribute('datetime')).toBe('2026-11-21');
  });
  it('opens every title in a new tab with rel noopener noreferrer', () => {
    showSources(null);
    for (const a of document.querySelectorAll('a.source-title')) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
      expect(a.getAttribute('href')).toMatch(/^https:\/\//);
    }
  });
  it('adds no element that loads on its own', () => {
    showSources(null);
    expect(document.querySelectorAll('img, script, iframe, link, object, embed, source, video, audio')).toHaveLength(0);
  });
  it('has no network call in its code', () => {
    for (const f of ['src/sources-page.ts', 'src/data/source-groups.ts'])
      expect(read(f)).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon|new Image|WebSocket|EventSource/);
  });
  it('marks Japanese text lang=ja', () => {
    showSources(null);
    expect(item('kantei-keihou').querySelector('a')!.getAttribute('lang')).toBe('ja');
    expect(item('jma-multilingual-page').querySelector('a')!.hasAttribute('lang')).toBe(false);
  });
  it('filters to the area in the param and presses its button', () => {
    showSources('medical');
    expect(titles().map(h => h.dataset.i18n)).toEqual(['sources.area.medical']);
    expect(document.querySelector('[data-area="medical"]')!.getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('[data-area="all"]')!.getAttribute('aria-pressed')).toBe('false');
  });
  it('shows all areas for an unknown param', () => {
    showSources('medic');
    expect(titles()).toHaveLength(5);
    expect(document.querySelector('[data-area="all"]')!.getAttribute('aria-pressed')).toBe('true');
  });
  it('changes the list from a filter button and leaves the hash alone', () => {
    showSources(null);
    document.querySelector<HTMLButtonElement>('[data-area="history"]')!.click();
    expect(titles().map(h => h.dataset.i18n)).toEqual(['sources.area.history']);
    expect(window.location.hash).toBe('#/learn');
  });
  it('builds the filter buttons once', () => {
    showSources(null); showSources('medical');
    expect(document.querySelectorAll('#sourcesFilters button')).toHaveLength(6);
  });
  it('translates labels on a language switch and keeps titles as they are', () => {
    showSources('medical');
    setI18nLang('ja'); applyTranslations();
    expect(titles()[0].textContent).toBe('医療（いりょう）');
    expect(document.querySelector('.source-checked [data-i18n]')!.textContent).toBe('確認した日');
    expect(document.querySelector('a.source-title')!.textContent).toBe(SOURCES['fdma-385-cpr-2025'].title);
  });
  it('writes the latest check date', () => {
    showSources(null);
    const time = document.getElementById('sourcesLastCheck')!;
    expect([time.textContent, time.getAttribute('datetime')]).toEqual(['2026-11-21', '2026-11-21']);
  });
  it('renders data as text, not markup', () => {
    const list = document.createElement('div');
    renderSourceList(list, [{ area: 'medical', sources: [{ id: 'x', publisher: '<b>P</b>', title: '<img src=x>', url: 'https://example.org', checked: '2026-01-01', area: 'medical' }] }]);
    expect(list.querySelector('img, b')).toBeNull();
    expect(list.textContent).toContain('<img src=x>');
  });
});
