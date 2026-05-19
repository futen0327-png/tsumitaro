const CACHE_NAME = 'tsumitaro-v1';
const ASSETS = [
  './index.html',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// インストール時：主要ファイルをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 有効化時：古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ時：キャッシュ優先、なければネット
self.addEventListener('fetch', event => {
  // Firebase・外部CDNはキャッシュしない
  if (event.request.url.includes('firebase') ||
      event.request.url.includes('cdn') ||
      event.request.url.includes('gstatic')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
