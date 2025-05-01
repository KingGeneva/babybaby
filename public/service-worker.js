
// Service Worker for BabyBaby App
const CACHE_NAME = 'babybaby-cache-v2'; // Increased version
const TIMESTAMP = new Date().getTime();

// Resources to cache immediately - minimal list to reduce memory usage
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.ico'
];

// Install event - minimal precaching to reduce initial load
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(error => console.error('Precaching failed:', error))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName)))
      .then(cachesToDelete => Promise.all(
        cachesToDelete.map(cacheToDelete => {
          console.log('Deleting outdated cache:', cacheToDelete);
          return caches.delete(cacheToDelete);
        })
      ))
      .then(() => self.clients.claim())
      .catch(error => console.error('Cache cleanup failed:', error))
  );
});

// Optimized fetch strategy to avoid memory issues
self.addEventListener('fetch', event => {
  // Skip cross-origin requests to reduce complexity
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Special handling for HTML requests - always go to network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  
  // For assets like JS and CSS, use stale-while-revalidate strategy
  if (event.request.destination === 'script' || 
      event.request.destination === 'style' ||
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(response => {
            // Don't cache responses with status !== 200
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            
            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // Return nothing - fallback to cache
          });
        
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
  
  // For other requests, just try network with cache fallback
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

// Handle updates from main thread
self.addEventListener('message', event => {
  if (event.data) {
    console.log('Service Worker received message:', event.data);
    if (event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        })
      );
    }
  }
});

console.log('Service Worker loaded - version 2');
