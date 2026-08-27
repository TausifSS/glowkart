/* GlowKart Service Worker v2.0.0 */

const CACHE_NAME = 'glowkart-v2.0.0';
const ASSETS = [
  './',
  './index.html',
  './admin.html',
  './css/variables.css',
  './css/main.css',
  './css/components.css',
  './js/data.js',
  './js/store.js',
  './js/whatsapp.js',
  './js/app.js',
  './js/admin.js',
  './manifest.json',
  './assets/logo.png',
  './assets/logo_badge.png',
  './assets/mascot_glowgirl.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          return caches.delete(key); // Force delete all previous caches
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
