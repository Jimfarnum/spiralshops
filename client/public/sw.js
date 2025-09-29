self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("spiral-cache").then(cache => {
      return cache.addAll(["/", "/index.html", "/spiral-blue.svg", "/manifest.json"]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});