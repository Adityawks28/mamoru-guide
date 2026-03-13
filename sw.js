const CACHE_NAME = 'mamoru-guide-v1';
const ASSETS = [
  './',
  './index.html',
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
  './js/app.js',
  './img/favicon.svg',
  './manifest.json'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
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
