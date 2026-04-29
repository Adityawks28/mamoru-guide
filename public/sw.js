const CACHE_NAME = 'mamoru-guide-v5';
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

// Fetch: cache-first, fallback to network (caches new responses automatically)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          if (response.ok && event.request.method === 'GET') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
      )
      .catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
