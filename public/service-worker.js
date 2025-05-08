
// Service Worker optimisé pour BabyBaby App avec support FlipBook amélioré
const CACHE_NAME = 'babybaby-cache-v5';
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/assets/index-*.js',
  '/assets/index-*.css',
  '/flowpaper/js/jquery.min.js',
  '/flowpaper/js/flowpaper.js'
];

// Installation avec mise en cache préventive
self.addEventListener('install', event => {
  console.log('Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: mise en cache préventive');
        return cache.addAll(RESOURCES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch(error => console.error('Erreur installation service worker:', error))
  );
});

// Activation avec nettoyage des anciens caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name.startsWith('babybaby-cache'))
          .map(name => {
            console.log('Service Worker: Suppression ancien cache', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('Service Worker: activé et caches nettoyés');
      return self.clients.claim();
    })
    .catch(error => console.error('Erreur activation service worker:', error))
  );
});

// Gestion spécifique des requêtes PDF avec gestion d'erreur améliorée
self.addEventListener('fetch', event => {
  // Ne pas intercepter les requêtes non-GET
  if (event.request.method !== 'GET') return;
  
  const requestUrl = new URL(event.request.url);
  
  // Cache-first pour les PDF et les ressources FlowPaper
  if (event.request.url.endsWith('.pdf') || 
      requestUrl.pathname.includes('/flowpaper/') || 
      requestUrl.searchParams.has('token')) {
    
    console.log('Service Worker: Interception PDF/FlowPaper', event.request.url);
    
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('Service Worker: Utilisation cache pour', event.request.url);
            return cachedResponse;
          }
          
          console.log('Service Worker: PDF/FlowPaper non trouvé en cache, fetch réseau');
          return fetch(event.request)
            .then(networkResponse => {
              // Ne mettre en cache que les réponses valides
              if (!networkResponse || networkResponse.status !== 200) {
                console.log('Service Worker: Réponse réseau non valide pour', event.request.url);
                return networkResponse;
              }
              
              console.log('Service Worker: Mise en cache de', event.request.url);
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
              
              return networkResponse;
            })
            .catch(error => {
              console.error('Service Worker: Erreur fetch réseau pour PDF/FlowPaper', error);
              
              // Fallback pour PDF - page d'erreur personnalisée
              if (event.request.url.endsWith('.pdf')) {
                return new Response(
                  `<!DOCTYPE html>
                  <html>
                    <head><title>Erreur de chargement PDF</title></head>
                    <body>
                      <h1>Erreur de chargement</h1>
                      <p>Impossible de charger le PDF. Vérifiez votre connexion ou réessayez plus tard.</p>
                    </body>
                  </html>`,
                  { 
                    status: 503,
                    headers: { 'Content-Type': 'text/html' }
                  }
                );
              }
              
              // Pas de fallback pour autres requêtes
              throw error;
            });
        })
    );
    return;
  }
  
  // Stratégie standard pour autres requêtes
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request)
        .then(response => {
          // Ne pas mettre en cache les erreurs
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Mettre en cache la réponse
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // Fallback pour HTML si disponible
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return null;
        });
    })
  );
});

// Gestionnaire de messages amélioré
self.addEventListener('message', event => {
  console.log('Service Worker: Message reçu', event.data?.type);
  
  if (!event.data) return;
  
  switch (event.data.type) {
    case 'CACHE_PDF':
      const { url, pdfBlob } = event.data;
      if (url && pdfBlob) {
        caches.open(CACHE_NAME).then(cache => {
          const response = new Response(pdfBlob, {
            headers: { 
              'Content-Type': 'application/pdf',
              'Cache-Control': 'public, max-age=86400' // 1 jour
            }
          });
          cache.put(url, response);
          console.log(`Service Worker: PDF mis en cache: ${url}`);
        });
      }
      break;
      
    case 'CACHE_EBOOK':
      const { url, data } = event.data;
      if (url && data) {
        caches.open(CACHE_NAME).then(cache => {
          const response = new Response(JSON.stringify(data), {
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=86400'
            }
          });
          cache.put(url, response);
          console.log(`Service Worker: Ebook mis en cache: ${url}`);
        });
      }
      break;
      
    case 'CLEAR_CACHE':
      caches.delete(CACHE_NAME).then(() => {
        console.log('Service Worker: Cache effacé sur demande');
      });
      break;
      
    case 'PING':
      // Répondre aux pings pour vérifier que le service worker est actif
      if (event.source) {
        event.source.postMessage({
          type: 'PONG',
          version: 'v5'
        });
      }
      break;
  }
});

// Version optimisée
console.log('Service Worker chargé - version v5 avec support FlowPaper et cache PDF améliorés');
