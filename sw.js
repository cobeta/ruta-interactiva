// Service Worker — Ruta Interactiva
const CACHE_NAME = 'ruta-interactiva-v2';

// Core assets to cache on install
const PRECACHE = [
  '/',
  '/index.html',
  '/trail.html',
  '/manifest.json',
  '/routes/hanover/pois.json',
  '/routes/allue-casteriello/pois.json',
  '/routes/allue-san-anton/pois.json',
  '/routes/allue-collata/pois.json',
  '/routes/allue-puyaldo/pois.json',
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

  // Navigation: try cache first (for offline), then network, fallback to index
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // Cache-first for map tiles and local assets
  const isUSGSTile  = url.hostname === 'basemap.nationalmap.gov';
  const isOSMTile   = url.hostname === 'tile.openstreetmap.org' || url.hostname === 'tile.opentopomap.org';
  const isLocalAsset = url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/routes/'));

  if (isUSGSTile || isOSMTile || isLocalAsset) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        const fetchOpts = (isUSGSTile || isOSMTile) ? { mode: 'no-cors' } : {};
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
