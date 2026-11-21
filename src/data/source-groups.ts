import { CLAIMS, SOURCES, SOURCE_AREAS, type Claim, type Source, type SourceArea, type SourceId } from './sources';
import { GLOSSARY } from './glossary';
import { RECORD_SOURCES } from './source-records';

export interface SourceUse {
  sources: Record<SourceId, Source>;
  claims: Record<string, Claim>;
  glossary: ReadonlyArray<{ source: SourceId }>;
  records: ReadonlyArray<SourceId>;
}

const REAL_USE: SourceUse = { sources: SOURCES, claims: CLAIMS, glossary: GLOSSARY, records: RECORD_SOURCES };

/** Sources that a live claim, a glossary term or a verification record uses, in SOURCES order. */
export function visibleSourceIds(use: SourceUse = REAL_USE): SourceId[] {
  const used = new Set<SourceId>(use.records);
  for (const claim of Object.values(use.claims)) {
    if (claim.status !== 'removed') claim.sources.forEach(id => used.add(id));
  }
  for (const term of use.glossary) used.add(term.source);
  return Object.keys(use.sources).filter(id => used.has(id));
}

export interface SourceEntry extends Source {
  id: SourceId;
}

export interface SourceGroup {
  area: SourceArea;
  sources: SourceEntry[];
}

export function groupSources(ids: SourceId[], area: SourceArea | null, sources: Record<SourceId, Source> = SOURCES): SourceGroup[] {
  return SOURCE_AREAS.filter(a => area === null || a === area)
    .map(a => ({
      area: a,
      sources: ids.filter(id => sources[id].area === a).map(id => ({ id, ...sources[id] })),
    }))
    .filter(g => g.sources.length > 0);
}

/** The latest `checked` date (YYYY-MM-DD), or '' for no sources. */
export function lastChecked(ids: SourceId[], sources: Record<SourceId, Source> = SOURCES): string {
  return ids.reduce((latest, id) => (sources[id].checked > latest ? sources[id].checked : latest), '');
}

export function isSourceArea(x: string | null): x is SourceArea {
  return SOURCE_AREAS.some(a => a === x);
}
