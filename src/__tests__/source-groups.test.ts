import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SOURCES, SOURCE_AREAS, type Source, type SourceArea } from '../data/sources';
import { RECORD_SOURCES } from '../data/source-records';
import { visibleSourceIds, groupSources, lastChecked, isSourceArea } from '../data/source-groups';

const specs = resolve(__dirname, '../../docs/superpowers/specs');
const recordText = readdirSync(specs).filter(f => f.endsWith('-verification.md'))
  .map(f => readFileSync(resolve(specs, f), 'utf8')).join('\n');
const cited = (id: string) => new RegExp(`(^|[^a-z0-9-])${id}([^a-z0-9-]|$)`).test(recordText);
const HIDDEN = ['kemenkes-rjp', 'alodokter-crush'];
const src = (area: SourceArea, checked = '2026-11-21'): Source => ({ publisher: 'P', title: 'T', url: 'https://example.org', checked, area });

describe('source areas', () => {
  it('gives every source a known area', () => {
    for (const [id, s] of Object.entries(SOURCES)) expect(SOURCE_AREAS, id).toContain(s.area);
  });
  it('counts the sources in each area', () => {
    const n: Record<string, number> = {};
    for (const s of Object.values(SOURCES)) n[s.area] = (n[s.area] ?? 0) + 1;
    expect(n).toEqual({ terms: 16, medical: 30, history: 14, safety: 46, contacts: 13 });
  });
  it('puts sample sources in their areas', () => {
    expect([SOURCES['who-pfa-ja'].area, SOURCES['fdma-hanshin-final'].area, SOURCES['kantei-keihou'].area,
      SOURCES['keishicho-110'].area, SOURCES['jma-multilingual'].area]).toEqual(['medical', 'history', 'safety', 'contacts', 'terms']);
  });
});

describe('record sources', () => {
  it('lists exactly the source IDs that the verification records cite', () => {
    expect([...RECORD_SOURCES].sort()).toEqual(Object.keys(SOURCES).filter(cited).sort());
  });
});

describe('visible sources', () => {
  it('shows 117 sources and hides the 2 that nothing uses', () => {
    const shown = visibleSourceIds();
    expect(shown).toHaveLength(117);
    expect(Object.keys(SOURCES).filter(id => !shown.includes(id))).toEqual(HIDDEN);
  });
  it('keeps the SOURCES order', () => {
    const shown = visibleSourceIds();
    expect(shown).toEqual(Object.keys(SOURCES).filter(id => shown.includes(id)));
  });
  it('hides a source that only a removed claim uses', () => {
    const use = { sources: { a: src('medical') }, claims: { c: { sources: ['a'], status: 'removed' as const, note: '' } }, glossary: [], records: [] };
    expect(visibleSourceIds(use)).toEqual([]);
  });
  it('shows a source that only the glossary or only a record uses', () => {
    const use = { sources: { g: src('terms'), r: src('history') }, claims: {}, glossary: [{ source: 'g' }], records: ['r'] };
    expect(visibleSourceIds(use)).toEqual(['g', 'r']);
  });
});

describe('groups', () => {
  const fixture = { a: src('safety'), b: src('medical', '2026-01-02'), c: src('safety', '2026-11-30') };
  it('returns areas in SOURCE_AREAS order and drops empty areas', () => {
    expect(groupSources(['a', 'b', 'c'], null, fixture).map(g => [g.area, g.sources.map(s => s.id)]))
      .toEqual([['medical', ['b']], ['safety', ['a', 'c']]]);
  });
  it('returns one group for one area', () => {
    expect(groupSources(['a', 'b', 'c'], 'safety', fixture).map(g => g.area)).toEqual(['safety']);
  });
  it('returns the latest checked date', () => {
    expect(lastChecked(['a', 'b', 'c'], fixture)).toBe('2026-11-30');
    expect(lastChecked([], fixture)).toBe('');
  });
  it('accepts only the five area names', () => {
    expect(['medical', 'terms', 'medic', '', null].map(isSourceArea)).toEqual([true, true, false, false, false]);
  });
});
