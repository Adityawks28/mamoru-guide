const CACHE_NAME = 'mamoru-guide-v10';
const PRECACHE = [
  './',
  './index.html',
  './404.html',
  './manifest.json',
  './img/favicon.svg',
];

// Install: pre-cache core assets; JS/CSS get cached on first fetch
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
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
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isNav = req.mode === 'navigate';
  const isCss = req.destination === 'style' || new URL(req.url).pathname.endsWith('.css');

  if (isNav || isCss) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req).then(cached => {
          const network = fetch(req)
            .then(response => {
              if (response.ok) cache.put(req, response.clone());
              return response;
            })
            .catch(() => cached || (isNav ? cache.match('./index.html') : undefined));
          // Cached first for speed; network refreshes the cache for next time.
          return cached || network;
        })
      )
    );
    return;
  }

  // Cache-first for the rest.
  event.respondWith(
    caches.match(req)
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
        if (isNav) return caches.match('./index.html');
      })
  );
});
