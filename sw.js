// Minimal service worker: caches the launcher shell so the app opens offline to the launcher.
// Paths are relative to this file, so it works at https://<user>.github.io/<repo>/ as well as at a domain root.
const C = "bylgja-ve75-v2";
const FILES = ["./", "manifest.json", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "favicon.ico", "favicon-32.png"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;  // dashboard itself: network only
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
