/**
 * ひらめきクエスト！ Service Worker
 * 【共通ハーネスルール 4. PWAキャッシュクリーン】
 * GitHub Pages等のコード更新をスマホ側が即座に検知し、古いキャッシュを破棄して
 * アプリを最新状態に自動リロード（強制クリーン更新）するロジック
 */

const CACHE_VERSION = 'hirameki-quest-v2.0.0'; // バージョンを更新して旧キャッシュを強制パージ
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// インストール時は待機せず直ちに新しいSWを有効化
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Pre-cache warning:', err);
      });
    })
  );
});

// アクティベーション時に古いバージョンのキャッシュを全削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            console.log('[SW] Purging old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // 直ちにすべてのクライアントを新SWの制御下に置く
      return self.clients.claim();
    }).then(() => {
      // 稼働中の全クライアントにキャッシュ更新完了を通知し自動リロードを促す
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_FORCE_CLEAN_RELOAD', version: CACHE_VERSION });
        });
      });
    })
  );
});

// フェッチ処理：開発用ファイルやスクリプトは常にNetwork-firstで最新を取得
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // HTMLおよび開発用TypeScript/JavaScript/CSSリソースは常にネットワーク優先で最新版を取得
  const isCodeResource =
    event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    url.pathname.includes('/src/') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.js') ||
    url.pathname.includes('@vite') ||
    url.pathname.includes('@fs');

  if (isCodeResource) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && url.origin === location.origin) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((res) => res || caches.match('/index.html')))
    );
    return;
  }

  // その他静的アセット（画像・フォント等）：Network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && url.origin === location.origin) {
          const clone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
