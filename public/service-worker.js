
// Service Worker for BabyBaby App
const CACHE_NAME = 'babybaby-cache-v1';
const TIMESTAMP = new Date().getTime();

// Resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.ico'
];

// Install event - precache resources
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
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        console.log('Deleting outdated cache:', cacheToDelete);
        return caches.delete(cacheToDelete);
      }));
    }).then(() => {
      console.log('Service Worker activated and claiming clients');
      return self.clients.claim();
    }).catch(error => console.error('Cache cleanup failed:', error))
  );
});

// Fetch event - network first strategy with cache fallback
self.addEventListener('fetch', event => {
  // Special handling for HTML requests - always go to network
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       event.request.headers.get('accept').includes('text/html'))) {
    
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // Add timestamp to GET requests for CSS, JS, and images to prevent caching
  if (event.request.method === 'GET' && 
      (event.request.url.endsWith('.css') || 
       event.request.url.endsWith('.js') || 
       event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/))) {
    
    const url = new URL(event.request.url);
    url.searchParams.set('v', TIMESTAMP);
    
    event.respondWith(
      fetch(new Request(url.href), { cache: 'no-store' })
        .then(response => {
          // Cache the fresh response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // For other requests, try network first, then cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Listen for updates from main thread
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
            cacheNames.map(cacheName => {
              console.log('Clearing cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
        })
      );
    }
  }
});

// Handle service worker errors
self.addEventListener('error', event => {
  console.error('Service Worker error:', event.message);
});

console.log('Service Worker loaded');
