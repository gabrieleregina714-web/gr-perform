// GR Perform - Service Worker v1.4
const CACHE_NAME = 'gr-perform-v7';
const STATIC_CACHE = 'gr-perform-static-v7';
const DYNAMIC_CACHE = 'gr-perform-dynamic-v7';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/app-dashboard.html',
  '/app-chat.html',
  '/app-profile.html',
  '/app-progress.html',
  '/app-wearables.html',
  '/workout-session.html',
  '/login.html',
  '/css/style.css',
  '/js/supabase-client.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch(err => console.log('[SW] Cache failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Supabase API calls (always fetch fresh)
  if (url.hostname.includes('supabase')) {
    return;
  }
  
  // Cache-first strategy for static assets
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  
  // Network-first strategy for HTML pages
  event.respondWith(networkFirst(event.request));
});

// Check if request is for a static asset
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline fallback if available
    return caches.match('/offline.html');
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const url = new URL(request.url);
    const isSameOrigin = url.origin === self.location.origin;
    const accept = request.headers.get('accept') || '';
    const isHtml = request.mode === 'navigate' || request.destination === 'document' || accept.includes('text/html');

    // Important: for same-origin HTML, bypass HTTP cache to avoid 304 responses.
    // 304 would prevent updating our dynamic cache and can keep old HTML around on mobile/PWA.
    const fetchRequest = (isSameOrigin && isHtml)
      ? new Request(request, { cache: 'no-store' })
      : request;

    const networkResponse = await fetch(fetchRequest);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Handle push notifications
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'Hai una nuova notifica',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/app-dashboard.html'
    },
    actions: [
      { action: 'open', title: 'Apri' },
      { action: 'close', title: 'Chiudi' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'GR Perform', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'close') return;

  const url = event.notification.data?.url || '/app-dashboard.html';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-workout') {
    event.waitUntil(syncWorkoutData());
  }
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncWorkoutData() {
  // Get pending workout data from IndexedDB and sync to server
  console.log('[SW] Syncing workout data...');
}

async function syncMessages() {
  // Get pending messages and sync to server
  console.log('[SW] Syncing messages...');
}
