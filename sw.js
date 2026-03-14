// Service Worker — Ruta Interactiva
const CACHE_NAME = 'ruta-interactiva-v1';

// Core assets to cache on install
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pois.json',
  '/assets/route.gpx',
];

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE).catch(() => {}))
  );
});

// ── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch — Cache-first for tiles and assets, network-first for HTML ───────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Always try network for navigation (HTML) — fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/index.html')
      )
    );
    return;
  }

  // Cache-first for map tiles (no-cors) and local assets (plain fetch)
  const isUSGSTile = url.hostname === 'basemap.nationalmap.gov';
  const isLocalAsset = url.pathname.startsWith('/assets/') && url.origin === self.location.origin;

  if (isUSGSTile || isLocalAsset) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        const fetchOpts = isUSGSTile ? { mode: 'no-cors' } : {};
        return fetch(event.request, fetchOpts).then(resp => {
          if (resp && (resp.status === 200 || resp.type === 'opaque')) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return resp;
        }).catch(() => new Response('', { status: 503 }));
      })
    );
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// ── Message handler ────────────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_DONE') {
    console.log('[SW] Offline cache complete');
  }
});
