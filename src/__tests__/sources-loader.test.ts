// sources-loader.test.ts

import { initSourcesLoader } from '../sources-loader';
import { t } from '../i18n';

let stop: () => void = () => {};

function fire(route: string, param: string | null = null): void {
  document.dispatchEvent(new CustomEvent('mamoru:route', { detail: { route, param } }));
}
const flush = () => new Promise(r => setTimeout(r));

beforeEach(() => { document.body.innerHTML = '<div id="sourcesList"></div>'; });
afterEach(() => stop());

describe('sources loader', () => {
  it('does not load on home or prepare', async () => {
    const load = vi.fn(); stop = initSourcesLoader(load);
    fire('home'); fire('prepare'); await flush();
    expect(load).not.toHaveBeenCalled();
  });
  it('loads once and passes the param on learn and sources', async () => {
    const show = vi.fn(); const load = vi.fn(async () => ({ showSources: show }));
    stop = initSourcesLoader(load);
    fire('learn'); await flush(); fire('sources', 'medical'); await flush();
    expect(load).toHaveBeenCalledTimes(1);
    expect(show.mock.calls).toEqual([[null], ['medical']]);
  });
  it('shows the load error, then tries again on the next route', async () => {
    const show = vi.fn();
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ showSources: show });
    stop = initSourcesLoader(load);
    fire('learn'); await flush();
    expect(document.querySelector('#sourcesList [data-i18n="sources.loadError"]')!.textContent).toBe(t('sources.loadError'));
    fire('learn'); await flush();
    expect(load).toHaveBeenCalledTimes(2);
    expect(show).toHaveBeenCalledWith(null);
  });
  it('shows the load error when showSources throws, then tries again', async () => {
    const show = vi.fn().mockImplementationOnce(() => { throw new Error('boom'); });
    const load = vi.fn(async () => ({ showSources: show }));
    stop = initSourcesLoader(load);
    fire('learn'); await flush();
    expect(document.querySelector('#sourcesList [data-i18n="sources.loadError"]')!.textContent).toBe(t('sources.loadError'));
    fire('learn'); await flush();
    expect(load).toHaveBeenCalledTimes(2);
    expect(show).toHaveBeenCalledTimes(2);
  });
});
