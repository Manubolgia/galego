// Galego Service Worker — Cache-first strategy
const CACHE_NAME = 'galego-v2.1.0';

const PRECACHE_URLS = [
  './index.html',
  './manifest.json',
  './css/design-system.css',
  './css/layout.css',
  './css/components.css',
  './css/exercises.css',
  './js/app.js',
  './js/state.js',
  './js/exercises.js',
  './js/audio.js',
  './js/data/course.js',
  './js/data/vocabulary.js',
  './js/data/exercises.js',
  './js/data/exercises_u1u2.js',
  './js/data/exercises_u3u4.js',
  './js/data/exercises_u5u6.js',
  './js/data/exercises_u7u8.js',
  './js/data/exercises_u9u10.js',
  './js/data/exercises_u11u12.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS.map(url => {
        // For Google Fonts, just try to cache; don't fail install if it doesn't work
        return new Request(url, { mode: 'cors' });
      })).catch(() => {
        // Retry without cross-origin fonts if it fails
        const localUrls = PRECACHE_URLS.filter(u => !u.startsWith('http'));
        return cache.addAll(localUrls);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Don't intercept POST/PUT requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only cache same-origin requests and Google Fonts
  // Everything else (Firebase API, etc.) goes straight to network
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFonts = url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com');

  if (!isSameOrigin && !isGoogleFonts) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
