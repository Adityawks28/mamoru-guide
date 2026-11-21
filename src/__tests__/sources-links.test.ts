// sources-links.test.ts

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { initFirstAid } from '../first-aid';
import { setI18nLang } from '../i18n';
import { sourcesLinkHtml } from '../sources-link';
import { SOURCE_AREAS } from '../data/sources';

const read = (f: string) => readFileSync(join(__dirname, '..', '..', f), 'utf8');
const doc = new DOMParser().parseFromString(read('index.html'), 'text/html');
const hrefIn = (sel: string) => doc.querySelector(`${sel} a.sources-link`)?.getAttribute('href');

afterEach(() => setI18nLang('en'));

describe('sources links', () => {
  it('links alerts, typhoon, contacts and About to their area', () => {
    expect(['#alerts', '#typhoon', '#contacts', '#about'].map(hrefIn))
      .toEqual(['#/sources/safety', '#/sources/safety', '#/sources/contacts', '#/sources']);
  });
  it('names only known areas and opens no new tab', () => {
    const ok = new RegExp(`^#/sources(/(${SOURCE_AREAS.join('|')}))?$`);
    const links = [...doc.querySelectorAll('a.sources-link')];
    expect(links.length).toBe(4);
    for (const a of links) { expect(a.getAttribute('href')).toMatch(ok); expect(a.hasAttribute('target')).toBe(false); }
  });
  it('matches the static markup to the generated markup', () => {
    const row = doc.querySelector('#about p.sources-link-row')!;
    expect(row.outerHTML).toBe(sourcesLinkHtml());
  });
  it('shows the medical link on the first aid grid and on an open card', () => {
    document.body.innerHTML = '<div id="firstAidContainer"></div>';
    initFirstAid();
    expect(document.querySelector('a.sources-link')!.getAttribute('href')).toBe('#/sources/medical');
    document.querySelector<HTMLButtonElement>('.firstaid-card')!.click();
    expect(document.querySelector('a.sources-link')!.getAttribute('href')).toBe('#/sources/medical');
  });
  it('writes the link in the current language', () => {
    setI18nLang('id');
    expect(sourcesLinkHtml('medical')).toContain('Lihat sumbernya');
  });
});
