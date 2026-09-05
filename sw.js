/* Service worker for Swift To The Song Association (static, GitHub Pages).
 *
 * Strategy:
 *  - same-origin FONTS → CACHE-FIRST. A .woff2 here is immutable: the filename
 *    changes when the face does, so there is nothing to revalidate. Sending them
 *    down the network-first path cost a round trip on EVERY load (`cache: "reload"`
 *    below deliberately bypasses the HTTP cache), which is a real problem for a
 *    font: a slow face means a flash of the fallback. Serve from the precache.
 *  - other same-origin → NETWORK-FIRST (always latest when online; fall back to
 *    cache offline). Root and known panel navigations use the cached notebook shell;
 *    other uncached navigations use the cached 404 page. This deliberately
 *    avoids the "my deploy isn't showing up" stale-code trap — no need to bump
 *    CACHE on every change; bump it only to evict stale precached entries.
 *  - cross-origin → CACHE-FIRST (kept as a safety net; the fonts are now
 *    self-hosted same-origin, so in practice nothing hits this branch).
 *
 * Paths are relative so the worker works at the site root (swiftassociation.com)
 * and under any project subpath, without hardcoding the origin.
 */
const CACHE = "stta-v61";
// The game's panel routes. These are sections of index.html, not files, so a navigation to one
// has nothing on the server to fetch: 404.html bounces it back through a ?/slug marker. Once
// this worker is installed we can do better and answer with index.html directly, so a deep link
// (or an offline one) opens the notebook with no bounce at all. Same list as PANEL_ROUTES in
// js/config.js and ROUTES in 404.html — a slug added to one must be added to all three.
const ROUTES = ["records", "charms", "stats", "mastery", "challenges", "bonus", "guests", "songbook",
                "album-focus", "ruthless", "how-to-play"];
const routeSlug = (url) => url.pathname.replace(/^\/+|\/+$/g, "");
const isRoute = (url) => ROUTES.includes(routeSlug(url));
const isAppShellRoute = (url) => routeSlug(url) === "" || isRoute(url);
const ASSETS = [
  "./",
  "index.html",
  "404.html",
  "ink.css",
  // Keep the revision query exact: Cache.match() includes the query string, and
  // index.html deliberately requests this URL to break the browser HTTP cache.
  "styles.css?v=76",
  // Self-hosted fonts (latin subset). Precached so first offline load has the
  // real faces; declared via @font-face in styles.css / search.css.
  "fonts/caveat-latin.woff2",
  "fonts/courierprime-400-latin.woff2",
  "fonts/courierprime-700-latin.woff2",
  "fonts/courierprime-italic-latin.woff2",
  "js/app.js",
  // Imported at module evaluation time by both app.js and search/search.js.
  // Missing it makes either surface fail on its first offline reload.
  "js/credential-guard.js",
  "js/util.js",
  "js/config.js",
  "js/match.js",
  // Structured, state-free result-card context selection.
  "js/lyric-reveal.mjs",
  // Bonus-game puzzle builders (pure; see js/bonus.js).
  "js/bonus.js",
  // The four rule marks (pure; see js/rulemarks.js). app.js imports it at load, so an
  // uncached copy breaks a cold offline start rather than only the marks.
  "js/rulemarks.js",
  // The randomiser's weighting (pure; see js/random.js). app.js imports it at load, so an
  // uncached copy would break a cold offline start rather than just the button.
  "js/random.js",
  "js/bracelet.js",
  "js/braceletcard.js",
  "js/sleevecard.js",
  "js/storage.js",
  "js/sound.js",
  // Share/copy plumbing — imported by both the game and the searcher.
  "js/share.js",
  // The messenger flock that flies the daily result off the page when the share
  // stub is torn (see js/messengers.js). app.js imports it at load.
  "js/messengers.js",
  // The desk calendar draws every date itself; index.html only holds its blank
  // card. Precached so a fresh offline install can't render a dateless pad.
  "js/calendar.js",
  // The cassette's label is a song the date picks, so index.html only holds the
  // shell and the blank card. Precached for the same reason as the calendar.
  "js/cassette.js",
  // The desk placard's engraved count, likewise (see js/placard.js).
  "js/placard.js",
  // The desk below the first screenful: the incident placer and the prop/mark
  // drawings it works from. Precached together, since scatter.js imports
  // deskprops.js and a half-cached pair would throw on an offline load.
  "js/scatter.js",
  "js/deskprops.js",
  // The polaroid and sticker artwork. app.js imports both at load, so an uncached copy
  // breaks a cold offline start rather than just the keepsakes drawer.
  "js/polaroids.js",
  "js/stickers.js",
  // The stickers stuck to the closed notebook cover. Pairs with js/stickers.js above the
  // same way scatter.js pairs with deskprops.js, and it is wanted earlier than either:
  // the cover is the first thing drawn on a cold start, so a missing half of this pair
  // breaks the load screen itself.
  "js/stickercover.js",
  // The sound palette (opt-in sfx; see js/sound.js for sources + licences).
  "sounds/correct.mp3",
  "sounds/wrong.mp3",
  "sounds/page.mp3",
  "sounds/unlock.mp3",
  "sounds/hint.mp3",
  "sounds/tick.mp3",
  "sounds/scratch.mp3",
  "sounds/close.mp3",
  "data/songs.json",
  "data/words.json",
  // Taylor's liner-note secret messages — lazy-loaded when a message-in-a-bottle egg
  // is first caught (see loadSecretMessages in js/app.js).
  "data/secret-messages.json",
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
  // NOT precached, deliberately: data/guests/*.json. songs.json alone is ~1MB, and a player who
  // never opens the guest shelf should never pay for a catalogue they haven't asked for. The
  // network-first branch below still caches a guest file the first time the shelf fetches it,
  // so it works offline from then on. Keep new guests out of this list.
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

  if (url.origin === location.origin && req.mode === "navigate" && isAppShellRoute(url)) {
    // Serve the notebook itself only for its root and known panel URLs. index.html is precached,
    // and `cache: "reload"` keeps the network copy authoritative when there is one.
    e.respondWith(
      fetch("index.html", { cache: "reload" })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("index.html", copy));
          return res;
        })
        .catch(() => caches.match("index.html").then((hit) => hit || Response.error()))
    );
  } else if (isFont) {
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
    // Network-first, then fall back to the exact cached request. An uncached navigation that is
    // not the root or a known panel route gets the real 404 page, never the game shell.
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
            .then((hit) => hit || (req.mode === "navigate" ? caches.match("404.html") : Response.error()))
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
