import { t } from './i18n';
import type { RouteDetail } from './router';

export interface SourcesModule { showSources(param: string | null): void }

// The sources data is large, so it loads only when a route needs it.
export function initSourcesLoader(
  load: () => Promise<SourcesModule> = () => import('./sources-page'),
): () => void {
  let pending: Promise<SourcesModule> | null = null;

  const showError = (): void => {
    const p = document.createElement('p');
    p.dataset.i18n = 'sources.loadError';
    p.textContent = t('sources.loadError');
    document.getElementById('sourcesList')?.replaceChildren(p);
  };

  const onRoute = (e: Event): void => {
    const { route, param } = (e as CustomEvent<RouteDetail>).detail;
    if (route !== 'learn' && route !== 'sources') return;
    pending ??= load();
    pending
      .then(mod => mod.showSources(param))
      .catch(() => { pending = null; showError(); });
  };

  document.addEventListener('mamoru:route', onRoute);
  return () => document.removeEventListener('mamoru:route', onRoute);
}
