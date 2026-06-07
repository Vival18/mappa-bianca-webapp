const CACHE_NAME = 'mappa-bianca-cache-v3';
const urlsToCache = [
  '/mappa-bianca-webapp/',
  '/mappa-bianca-webapp/index.html',
  '/mappa-bianca-webapp/markers.json',
  '/mappa-bianca-webapp/libs/leaflet.css',
  '/mappa-bianca-webapp/libs/leaflet.js',
  '/mappa-bianca-webapp/libs/MarkerCluster.css',
  '/mappa-bianca-webapp/libs/MarkerCluster.Default.css',
  '/mappa-bianca-webapp/libs/leaflet.markercluster.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Errore cache addAll:', err))
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
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});