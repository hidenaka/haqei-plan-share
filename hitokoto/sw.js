// ひとこと service worker — push受信と通知タップ + 圏外でもアプリが開けるようにする
const CACHE = 'hitokoto-shell-v1';
const SHELL = ['./', 'index.html', 'talk.html', 'growth.html', 'profile.html', 'dev.html', 'manifest.json', 'portraits/cand-C-01.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // 中継API(別ドメイン)は素通し=常に生データ
  if (/\.mp4$/i.test(url.pathname)) return;          // 動画は重いのでキャッシュしない

  if (req.mode === 'navigate') {
    // 画面: つながっていれば最新、圏外なら前回のものを出す
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  // 画像・manifest等: あればキャッシュ、無ければ取りに行って貯める
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => new Response('', { status: 504 }));
    })
  );
});

self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(data.title || 'ひとこと', {
    body: data.body || '今夜のひとことが届いています',
    icon: 'portraits/cand-C-01.png',
    badge: 'portraits/cand-C-01.png',
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow('talk.html'));
});
