const CACHE_NAME = 'paceforge-v6-natural-korean-cues';
const CORE_ASSETS = [
  '/',
  '/app.js',
  '/manifest.webmanifest',
  '/assets/paceforge-hero.jpg',
  '/og.png',
  '/audio/voice/prep.wav',
  '/audio/voice/rest-010.wav',
  '/audio/voice/rest-015.wav',
  '/audio/voice/rest-020.wav',
  '/audio/voice/rest-030.wav',
  '/audio/voice/rest-045.wav',
  '/audio/voice/rest-060.wav',
  '/audio/voice/rest-090.wav',
  '/audio/voice/rest-120.wav',
  '/audio/voice/rest-180.wav',
  '/audio/voice/rest-300.wav',
  '/audio/voice/set.wav',
  '/audio/voice/interval.wav',
  '/audio/voice/tabata.wav',
  '/audio/voice/custom.wav',
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
