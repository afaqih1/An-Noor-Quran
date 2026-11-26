// Friday Surah Guide - Service Worker for Offline Quran, Dua, and Azkar
const CACHE_NAME = 'friday-quran-guide-v2';
const QURAN_API_CACHE = 'friday-quran-api-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/metadata.json'
];

// Install Event - Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Service worker pre-caching non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== QURAN_API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Handle Caching Strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Quran Cloud API calls (api.alquran.cloud)
  if (url.hostname === 'api.alquran.cloud') {
    event.respondWith(
      caches.open(QURAN_API_CACHE).then(async (cache) => {
        try {
          // Network first: try to fetch updated data from network
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (networkError) {
          // If offline or network fails, fall back to cached response
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return a structured fallback response if completely unavailable
          return new Response(
            JSON.stringify({
              code: 503,
              status: 'Offline',
              message: 'This Surah or Juz is not yet cached for offline use. Please connect to the internet to view or download it.',
              data: null
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        }
      })
    );
    return;
  }

  // 2. Google Fonts and CDN Assets (Stale-While-Revalidate)
  if (
    url.hostname.includes('fonts.googleapis.com') || 
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdn.tailwindcss.com') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Same-origin static assets and navigation requests
  if (request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          if (request.mode === 'navigate') {
            return cache.match('/index.html') || cache.match('/');
          }
          throw error;
        }
      })
    );
  }
});
