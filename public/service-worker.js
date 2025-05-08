
// Service Worker optimisé pour BabyBaby App
const CACHE_NAME = 'babybaby-cache-v2';
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/assets/index-*.js',
  '/assets/index-*.css'
];

// Installation avec mise en cache préventive
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: mise en cache préventive');
        return cache.addAll(RESOURCES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation avec nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => {
      console.log('Service Worker: activé et caches nettoyés');
      return self.clients.claim();
    })
  );
});

// Stratégie de cache: stale-while-revalidate pour la majorité des ressources
self.addEventListener('fetch', event => {
  // Ne pas intercepter les requêtes qui ne sont pas GET
  if (event.request.method !== 'GET') return;
  
  // Ne pas intercepter les requêtes d'API ou externes
  if (event.request.url.includes('/supabase/') || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Cache strategy: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Mise en cache des nouvelles ressources
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('Service Worker: échec de récupération depuis le réseau');
          // Retourne un fallback pour HTML si disponible
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return null;
        });

      // Retourne la réponse en cache pendant que nous mettons à jour le cache
      return cachedResponse || fetchPromise;
    })
  );
});

// Cache spécial pour les articles souvent consultés
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_ARTICLE') {
    const { url, data } = event.data;
    
    caches.open(CACHE_NAME).then(cache => {
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      cache.put(url, response);
    });
  }
});

console.log('Service Worker chargé - version optimisée avec cache agressif');
