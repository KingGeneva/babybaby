
// Service Worker minimal pour BabyBaby App
const CACHE_NAME = 'babybaby-cache-v1';

// Installation - version minimaliste
self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('Service Worker installé');
});

// Activation avec nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  console.log('Service Worker activé');
  self.clients.claim();
});

// Stratégie simplifiée: réseau d'abord, cache en secours pour HTML
// Pas de mise en cache proactive pour éviter les problèmes de mémoire
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  // HTML: réseau d'abord, cache en secours
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
  }
});

console.log('Service Worker chargé - version simplifiée');
