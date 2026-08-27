/* GlowKart PWA Service Worker */

const CACHE_NAME = 'glowkart-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './css/variables.css',
  './css/main.css',
  './css/components.css',
  './css/admin.css',
  './js/data.js',
  './js/store.js',
  './js/whatsapp.js',
  './js/app.js',
  './js/admin.js',
  './assets/logo.png',
  './assets/logo_badge.png',
  './assets/mascot_glowgirl.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
