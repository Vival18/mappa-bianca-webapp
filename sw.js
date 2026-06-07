const CACHE_NAME = 'mappa-bianca-cache-v1';
// Nella cache iniziale mettiamo SOLO i file locali che sono sicuri
const urlsToCache = [
  '/mappa-bianca-webapp/',
  '/mappa-bianca-webapp/index.html',
  '/mappa-bianca-webapp/markers.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      // Il .catch() evita che un errore blocchi l'installazione
      .catch(err => console.warn('Cache iniziale fallita per qualche file', err))
  );
  self.skipWaiting(); // Forza l'attivazione immediata
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        // Se non è in cache, prova a prenderlo dalla rete
        return fetch(event.request).then(networkResponse => {
          // Se è una risorsa statica (GET) e valida, la mettiamo in cache
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Se siamo offline e la risorsa non è in cache
          return new Response('Contenuto non disponibile offline', { status: 404 });
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Cancellata cache obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Prende il controllo delle pagine aperte
);