const CACHE_NAME = 'paceforge-v4-bluetooth-audio';
const CORE_ASSETS = [
  '/',
  '/app.js',
  '/manifest.webmanifest',
  '/assets/paceforge-hero.jpg',
  '/og.png',
  '/audio/voice/prep.wav',
  '/audio/voice/rest.wav',
  '/audio/voice/set.wav',
  '/audio/voice/warning.wav',
  '/audio/voice/complete.wav',
  '/audio/voice/output-test.wav',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
  );
});
