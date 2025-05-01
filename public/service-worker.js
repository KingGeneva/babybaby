// Service Worker for BabyBaby App
const CACHE_NAME = 'babybaby-cache-v3';
const TIMESTAMP = new Date().getTime();

// Resources to cache immediately - minimal list to reduce memory usage
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.ico'
];

// Lightweight install handler
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(error => console.error('Precaching failed:', error))
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => cacheNames.filter(cacheName => cacheName !== CACHE_NAME))
      .then(cachesToDelete => Promise.all(
        cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete))
      ))
      .then(() => self.clients.claim())
  );
});

// Ultra-lightweight fetch strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // HTML pages - network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }
  
  // For JS/CSS/Images - stale-while-revalidate
  if (event.request.destination === 'script' || 
      event.request.destination === 'style' ||
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // Return cached response immediately if available
        if (cachedResponse) {
          // Asynchronously update the cache
          fetch(event.request)
            .then(response => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, response));
              }
            })
            .catch(() => {});
          
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            
            return response;
          });
      })
    );
    return;
  }
  
  // For other assets - cache first, network fallback
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))
  );
});

// Handle message from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker loaded - version 3 - memory optimized');
