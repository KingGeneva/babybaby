
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first strategy with cache fallback
self.addEventListener('fetch', event => {
  // Add timestamp to GET requests for CSS, JS, and images to prevent caching
  if (event.request.method === 'GET' && 
      (event.request.url.endsWith('.css') || 
       event.request.url.endsWith('.js') || 
       event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/))) {
    
    const url = new URL(event.request.url);
    url.searchParams.set('v', TIMESTAMP);
    
    event.respondWith(
      fetch(new Request(url.href), { cache: 'no-store' })
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
        .catch(() => caches.match(event.request))
    );
  }
});

// Listen for updates from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
