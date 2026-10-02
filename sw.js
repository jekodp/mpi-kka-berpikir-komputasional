// Service worker sederhana: dibutuhkan sebagian browser (Chrome Android) agar website
// bisa dipasang sebagai aplikasi. Tidak menyimpan cache, jadi isi selalu yang terbaru.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
