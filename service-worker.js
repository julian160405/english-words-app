self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open("english-app").then(function(cache) {
      return cache.addAll([
        "index.html",
        "style.css",
        "app.js",
        "words.json",
        "manifest.json"
      ]);
    })
  );
});