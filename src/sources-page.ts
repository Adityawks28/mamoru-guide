import { t } from './i18n';
import { SOURCE_AREAS } from './data/sources';
import { groupSources, isSourceArea, lastChecked, visibleSourceIds, type SourceGroup } from './data/source-groups';

// Escapes keep the range ends out of the font scan.
const JAPANESE = /[\u3040-\u30ff\u3400-\u9fff]/;

let activeArea: string = 'all';

function translated(el: HTMLElement, key: string): HTMLElement {
  el.dataset.i18n = key;
  el.textContent = t(key);
  return el;
}

function withLang(el: HTMLElement, text: string): HTMLElement {
  if (JAPANESE.test(text)) el.lang = 'ja';
  return el;
}

export function renderSourceList(list: HTMLElement, groups: SourceGroup[]): void {
  list.replaceChildren(...groups.map(group => {
    const section = document.createElement('section');
    section.className = 'sources-group';
    const heading = translated(document.createElement('h3'), `sources.area.${group.area}`);
    heading.className = 'sources-group-title';
    const items = document.createElement('ul');
    items.className = 'sources-items';

    for (const source of group.sources) {
      const li = document.createElement('li');
      li.className = 'source-item';

      const publisher = document.createElement('span');
      publisher.className = 'source-publisher';
      publisher.textContent = source.publisher;
      withLang(publisher, source.publisher);

      const link = document.createElement('a');
      link.className = 'source-title';
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = source.title;
      withLang(link, source.title);

      const checked = document.createElement('span');
      checked.className = 'source-checked';
      const label = translated(document.createElement('span'), 'sources.checked');
      const time = document.createElement('time');
      time.dateTime = source.checked;
      time.textContent = source.checked;
      checked.append(label, ' ', time);

      li.append(publisher, link, checked);
      items.append(li);
    }
    section.append(heading, items);
    return section;
  }));
}

function buildFilters(box: HTMLElement): void {
  if (box.querySelector('button')) return;
  for (const area of ['all', ...SOURCE_AREAS]) {
    const btn = translated(document.createElement('button'), area === 'all' ? 'sources.all' : `sources.area.${area}`);
    btn.className = 'contact-filter-btn';
    btn.setAttribute('type', 'button');
    btn.dataset.area = area;
    btn.setAttribute('aria-pressed', 'false');
    box.append(btn);
  }
  box.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-area]');
    if (!btn) return;
    activeArea = btn.dataset.area!;
    update();
  });
}

function update(): void {
  const list = document.getElementById('sourcesList');
  if (!list) return;
  const ids = visibleSourceIds();
  const area = isSourceArea(activeArea) ? activeArea : null;
  renderSourceList(list, groupSources(ids, area));
  document.querySelectorAll<HTMLElement>('#sourcesFilters button').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.area === (area ?? 'all')));
  });
}

export function showSources(param: string | null): void {
  const list = document.getElementById('sourcesList');
  if (!list) return;
  const filters = document.getElementById('sourcesFilters');
  if (filters) buildFilters(filters);
  activeArea = isSourceArea(param) ? param : 'all';
  const stamp = document.getElementById('sourcesLastCheck');
  if (stamp) {
    const date = lastChecked(visibleSourceIds());
    stamp.textContent = date;
    stamp.setAttribute('datetime', date);
  }
  update();
}
