// Galego Service Worker — Cache-first strategy
const CACHE_NAME = 'galego-v4.1.5';

// Core files — must all cache successfully for the SW to install
const PRECACHE_CORE = [
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
  './js/tts.js',
  './js/haptics.js',
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
];

// Large/optional assets — cached best-effort; failure does not block SW install
const PRECACHE_OPTIONAL = [
  './vendor/espeak/espeak-ng.js',
  './vendor/espeak/espeak-ng.wasm',
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
];

// ── Install ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Fetch each core file fresh from the network, bypassing the HTTP cache,
      // so a previously-active SW or browser cache can't seed the new cache with
      // stale file contents. cache: 'reload' forces a network round-trip.
      await Promise.all(
        PRECACHE_CORE.map(async (url) => {
          const resp = await fetch(new Request(url, { cache: 'reload' }));
          if (!resp.ok) throw new Error('precache failed: ' + url);
          await cache.put(url, resp);
        })
      );
      // Optional files (large WASM, fonts) are cached best-effort — never block install
      await Promise.allSettled(
        PRECACHE_OPTIONAL.map(async (url) => {
          try {
            const resp = await fetch(new Request(url, { cache: 'reload', mode: 'cors' }));
            if (resp.ok || resp.type === 'opaque') await cache.put(url, resp);
          } catch (_) {}
        })
      );
      self.skipWaiting();
    })
  );
});

// ── Activate — purge old caches ──────────────────────────────
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

// ── Message handler — allow app to force-activate ────────────
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// ── Fetch — cache same-origin + fonts, pass everything else ──
self.addEventListener('fetch', (event) => {
  // Never intercept non-GET requests (PUT/POST/DELETE go to network)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only cache same-origin requests and Google Fonts
  // ALL external API calls (Firebase, etc.) go straight to network untouched
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
