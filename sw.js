/* Service worker for Swift To The Song Association (static, GitHub Pages).
 *
 * Strategy:
 *  - same-origin FONTS → CACHE-FIRST. A .woff2 here is immutable: the filename
 *    changes when the face does, so there is nothing to revalidate. Sending them
 *    down the network-first path cost a round trip on EVERY load (`cache: "reload"`
 *    below deliberately bypasses the HTTP cache), which is a real problem for a
 *    font: a slow face means a flash of the fallback. Serve from the precache.
 *  - other same-origin → NETWORK-FIRST (always latest when online; fall back to
 *    cache offline, and to the cached index.html for navigations). This deliberately
 *    avoids the "my deploy isn't showing up" stale-code trap — no need to bump
 *    CACHE on every change; bump it only to evict stale precached entries.
 *  - cross-origin → CACHE-FIRST (kept as a safety net; the fonts are now
 *    self-hosted same-origin, so in practice nothing hits this branch).
 *
 * Paths are relative so the worker works at the site root (swiftassociation.com)
 * and under any project subpath, without hardcoding the origin.
 */
const CACHE = "stta-v15";
const ASSETS = [
  "./",
  "index.html",
  "styles.css",
  // Self-hosted fonts (latin subset). Precached so first offline load has the
  // real faces; declared via @font-face in styles.css / search.css.
  "fonts/caveat-latin.woff2",
  "fonts/courierprime-400-latin.woff2",
  "fonts/courierprime-700-latin.woff2",
  "fonts/courierprime-italic-latin.woff2",
  "js/app.js",
  "js/util.js",
  "js/config.js",
  "js/match.js",
  "js/bracelet.js",
  "js/braceletcard.js",
  "js/storage.js",
  "js/sound.js",
  // Share/copy plumbing — imported by both the game and the searcher.
  "js/share.js",
  // The desk calendar draws every date itself; index.html only holds its blank
  // card. Precached so a fresh offline install can't render a dateless pad.
  "js/calendar.js",
  // The sound palette (opt-in sfx; see js/sound.js for sources + licences).
  "sounds/correct.mp3",
  "sounds/wrong.mp3",
  "sounds/page.mp3",
  "sounds/unlock.mp3",
  "songs.json",
  "words.json",
  // Swift To The Lyric searcher — precached (incl. the "search/" navigate path) so it
  // works offline on a fresh install, not just after a runtime-cached visit.
  "search/",
  "search/index.html",
  "search/search.css",
  "search/search.js",
  "search/manifest.webmanifest",
  "icons/favicon.svg",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png",
  "icons/apple-touch-icon.png",
  // Swift To The Lyric PWA / Apple-touch assets.
  "icons/favicon-search.svg",
  "icons/icon-search-192.png",
  "icons/icon-search-512.png",
  "icons/icon-search-512-maskable.png",
  "icons/apple-touch-icon-search.png",
  "icons/og-image-search.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isFont = url.origin === location.origin && url.pathname.endsWith(".woff2");

  if (isFont) {
    // Immutable + latency-critical: hand over the precached copy, and only touch
    // the network for a face this cache has never seen (then keep it).
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          })
      )
    );
  } else if (url.origin === location.origin) {
    // network-first, fall back to cache (and to index.html for navigations).
    // `cache: "reload"` makes the SW's own fetch BYPASS the browser HTTP cache —
    // without it, GitHub Pages' max-age means fetch() can return a stale file and
    // "network-first" silently behaves like "HTTP-cache-first" after a deploy.
    e.respondWith(
      fetch(req, { cache: "reload" })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then((hit) => hit || (req.mode === "navigate" ? caches.match("index.html") : Response.error()))
        )
    );
  } else {
    // cross-origin (fonts): cache-first, revalidate in the background
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req)
            .then((res) => {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
              return res;
            })
            .catch(() => hit)
      )
    );
  }
});
