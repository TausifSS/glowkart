/* GlowKart Service Worker v1.0.7 */

const CACHE_NAME = 'glowkart-v1.0.7';
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
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
