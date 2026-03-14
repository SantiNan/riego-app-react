const CACHE_NAME = 'riego-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo cachear requests GET de navegación y assets estáticos
  if (request.method !== 'GET') return;

  // No cachear requests a APIs/WebSocket/MQTT
  const url = new URL(request.url);
  if (url.protocol === 'wss:' || url.protocol === 'ws:') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cachear assets estáticos exitosos
        if (response.ok && (request.mode === 'navigate' || url.pathname.match(/\.(js|css|png|svg|ico|woff2?)$/))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline: servir desde cache
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback a index.html para navegación SPA
          if (request.mode === 'navigate') return caches.match('/index.html');
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
