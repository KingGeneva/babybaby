
// Service Worker optimisé pour BabyBaby App
const CACHE_NAME = 'babybaby-cache-v3';
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

// Stratégie de cache spéciale pour les images (cache-first pour les performances)
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // Cache-first pour les images
  if (
    event.request.method === 'GET' &&
    event.request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // Mettre à jour le cache en arrière-plan
          fetch(event.request).then(response => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, response);
              });
            }
          }).catch(() => {/* ignorer les erreurs */});
          
          // Retourner immédiatement la réponse en cache
          return cachedResponse;
        }
        
        // Si l'image n'est pas en cache, la récupérer depuis le réseau
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Mettre en cache la nouvelle image
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
    );
    return; // Important pour ne pas exécuter le gestionnaire fetch suivant
  }
});

// Cache spécial pour les articles souvent consultés
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_ARTICLE') {
    const { url, data } = event.data;
    
    caches.open(CACHE_NAME).then(cache => {
      const response = new Response(JSON.stringify(data), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400'
        }
      });
      cache.put(url, response);
      console.log(`Article mis en cache: ${url}`);
    });
  } else if (event.data && event.data.type === 'CLEAR_OLD_CACHES') {
    // Nettoyer les anciens caches sur demande
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name.startsWith('babybaby-cache'))
          .map(name => caches.delete(name))
      );
    }).then(() => {
      console.log('Service Worker: anciens caches nettoyés sur demande');
    });
  }
});

// Préchargement des ressources importantes lors des périodes d'inactivité
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PRECACHE_RESOURCES') {
    const { resources } = event.data;
    if (Array.isArray(resources) && resources.length > 0) {
      caches.open(CACHE_NAME).then(cache => {
        console.log('Préchargement de ressources pendant période d\'inactivité');
        cache.addAll(resources);
      });
    }
  }
});

// Version optimisée
console.log('Service Worker chargé - version optimisée v3 avec cache agressif et stratégies intelligentes');
