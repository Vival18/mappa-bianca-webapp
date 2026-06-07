const CACHE_NAME = 'mappa-bianca-v2';
const urlsToCache = [
  '/mappa-bianca-webapp/',
  '/mappa-bianca-webapp/index.html',
  '/mappa-bianca-webapp/markers.json',
  '/mappa-bianca-webapp/manifest.json',
  '/mappa-bianca-webapp/icon-192.png',
  '/mappa-bianca-webapp/icon-512.png',
  '/mappa-bianca-webapp/libs/leaflet.css',
  '/mappa-bianca-webapp/libs/leaflet.js',
  '/mappa-bianca-webapp/libs/MarkerCluster.css',
  '/mappa-bianca-webapp/libs/MarkerCluster.Default.css',
  '/mappa-bianca-webapp/libs/leaflet.markercluster.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.warn('Cache fallita per qualche risorsa', err))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});