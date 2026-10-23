const CACHE_NAME = 'mamoru-guide-v12';
const PRECACHE = [
  './',
  './index.html',
  './404.html',
  './manifest.json',
  './img/favicon.svg',
  './img/icons/icon-192.svg',
  './img/icons/icon-512.svg',
];

// Install: cache the whole app on the first visit, so it works offline from
// then on (a disaster may cut the network before a second visit). The build
// lists its hashed JS/CSS in asset-manifest.json (scripts/vite-sw-manifest.ts).
self.addEventListener('install', event => {
  event.waitUntil(
    fetch('./asset-manifest.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(m => [...m.js, ...m.css].map(f => './' + f))
      .catch(() => [])
      .then(assets => caches.open(CACHE_NAME).then(cache => cache.addAll([...PRECACHE, ...assets])))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches + notify clients of update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      const old = keys.filter(k => k !== CACHE_NAME);
      return Promise.all(old.map(k => caches.delete(k))).then(() => {
        if (old.length > 0) {
          self.clients.matchAll().then(clients => {
            clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
          });
        }
      });
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy:
//   - Navigations + CSS use stale-while-revalidate: serve the cached copy fast,
//     but refresh it from the network in the background so a redeploy shows up on
//     the NEXT load — without needing a manual CACHE_NAME bump every time. Falls
//     back to cache (and index.html for navigations) when offline.
//   - Everything else (content-hashed JS bundles, images, fonts) stays
//     cache-first: a new build changes the hashed URL, so it's a cache miss → net.
// ignoreVary: a host that sends `Vary: Origin` would otherwise make the
// precached copies (fetched without Origin) miss for module scripts and
// crossorigin styles, which do send it.
const MATCH = { ignoreVary: true };
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isNav = req.mode === 'navigate';
  const isCss = req.destination === 'style' || new URL(req.url).pathname.endsWith('.css');

  if (isNav || isCss) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req, MATCH).then(cached => {
          const network = fetch(req)
            .then(response => {
              if (response.ok) cache.put(req, response.clone());
              return response;
            })
            .catch(() => cached || (isNav ? cache.match('./index.html', MATCH) : undefined));
          // Cached first for speed; network refreshes the cache for next time.
          return cached || network;
        })
      )
    );
    return;
  }

  // Cache-first for the rest.
  event.respondWith(
    caches.match(req, MATCH)
      .then(cached => cached || fetch(req)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return response;
        })
      )
      .catch(() => {
        if (isNav) return caches.match('./index.html', MATCH);
      })
  );
});
