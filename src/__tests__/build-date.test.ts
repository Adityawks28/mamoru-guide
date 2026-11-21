import { describe, it, expect, beforeEach } from 'vitest';
import { formatBuildDate, renderBuildDate } from '../build-date';

const CARD = `
  <p>
    <span data-lang="en"><span class="build-date" hidden><time></time>. </span>We update this guide regularly.</span>
    <span data-lang="ja"><span class="build-date" hidden><time></time>。</span>このガイドは定期的に更新しています。</span>
    <span data-lang="id"><span class="build-date" hidden><time></time>. </span>Kami memperbarui panduan ini secara berkala.</span>
  </p>`;

describe('build date', () => {
  beforeEach(() => { document.body.innerHTML = CARD; });

  it('formats the date in each language', () => {
    expect(formatBuildDate('2026-11-21', 'en')).toBe('21 November 2026');
    expect(formatBuildDate('2026-11-21', 'ja')).toBe('2026年11月21日');
    expect(formatBuildDate('2026-03-05', 'id')).toBe('5 Maret 2026');
  });

  it('shows the build date in all three languages', () => {
    renderBuildDate(document, '2026-11-21');
    const wraps = [...document.querySelectorAll<HTMLElement>('.build-date')];
    expect(wraps.map(w => w.hidden)).toEqual([false, false, false]);
    expect(wraps.map(w => w.querySelector('time')!.getAttribute('datetime'))).toEqual(['2026-11-21', '2026-11-21', '2026-11-21']);
    expect(wraps.map(w => w.textContent)).toEqual(['21 November 2026. ', '2026年11月21日。', '21 November 2026. ']);
  });

  it('keeps the date hidden when the build date is missing or malformed', () => {
    renderBuildDate(document, undefined);
    renderBuildDate(document, 'March 2026');
    const wraps = [...document.querySelectorAll<HTMLElement>('.build-date')];
    expect(wraps.map(w => w.hidden)).toEqual([true, true, true]);
    expect(wraps.map(w => w.querySelector('time')!.textContent)).toEqual(['', '', '']);
  });

  it('index.html has one hidden build-date slot per language and no fixed date', async () => {
    const { readFileSync } = await import('node:fs');
    const html = readFileSync('index.html', 'utf8');
    expect(html.match(/class="build-date" hidden/g)).toHaveLength(3);
    expect(html).not.toMatch(/datetime="2026-03"/);
  });
});
