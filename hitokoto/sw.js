// ひとこと service worker — push受信と通知タップ
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
  e.waitUntil(clients.openWindow('.'));
});
