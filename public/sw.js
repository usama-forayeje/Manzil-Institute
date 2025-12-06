// Service Worker for Manzil Institute - Performance Optimization
const CACHE_NAME = 'manzil-institute-v1.0.0';
const STATIC_CACHE = 'manzil-static-v1.0.0';
const DYNAMIC_CACHE = 'manzil-dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  // Fonts
  '/fonts/kalpurush.ttf',
  '/fonts/kalpurush ANSI.ttf',
  '/fonts/Bornomala/Bornomala-Regular.ttf',
  '/fonts/Bornomala/Bornomala-Bold.ttf',
  // Critical images
  '/manzil-institute-logo-dark.webp',
  '/manzil-institute-logo-light.webp',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (except Google Fonts)
  if (!url.origin.includes(self.location.origin) && !url.origin.includes('fonts.googleapis.com')) return;

  // Handle different resource types
  if (request.destination === 'document') {
    // HTML pages - Network first, cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else if (request.destination === 'image' || request.destination === 'font') {
    // Images and fonts - Cache first, network fallback
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Cache images and fonts
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
  } else if (request.destination === 'script' || request.destination === 'style') {
    // JS/CSS - Cache first for static assets, network first for dynamic
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Check if it's a static asset (has version/hash in URL)
          if (request.url.includes('.') && !request.url.includes('?')) {
            return cachedResponse;
          }
        }

        return fetch(request).then((response) => {
          // Cache scripts and styles
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
  } else {
    // Other resources - Network first, cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

// Background sync for offline forms (if needed in future)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here if needed
  console.log('Background sync triggered');
}

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/manzil-institute-logo-dark.webp',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});