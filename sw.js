const CACHE_NAME = 'mamoru-guide-v2';
const ASSETS = [
  './',
  './index.html',
  './404.html',
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/hero.css',
  './css/earthquake-scale.css',
  './css/components.css',
  './css/vocab.css',
  './css/bag-game.css',
  './css/responsive.css',
  './css/print.css',
  './js/data.js',
  './js/toast.js',
  './js/lang.js',
  './js/theme.js',
  './js/stars.js',
  './js/skyline.js',
  './js/earthquake-scale.js',
  './js/vocab.js',
  './js/bag-game.js',
  './js/scroll-reveal.js',
  './js/nav.js',
  './js/emergency-plan.js',
  './js/app.js',
  './img/favicon.svg',
  './manifest.json',
  './sitemap.xml'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
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

// Fetch: cache-first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          // Cache successful network responses for future offline use
          if (response.ok && event.request.method === 'GET') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
      )
      .catch(() => {
        // If both cache and network fail, return offline page
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
