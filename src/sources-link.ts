// sources-link.ts: "See the sources" link row.
// Type-only import: the first load must not pull in the sources data.

import type { SourceArea } from './data/sources';
import { t } from './i18n';

export function sourcesLinkHtml(area?: SourceArea): string {
  const href = area ? `#/sources/${area}` : '#/sources';
  return `<p class="sources-link-row"><a class="sources-link" href="${href}" data-i18n="sources.link">${t('sources.link')}</a></p>`;
}
