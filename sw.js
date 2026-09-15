/* Service worker for Swift To The Song Association (static, GitHub Pages).
 *
 * Strategy:
 *  - HTML NAVIGATIONS → NETWORK-FIRST, always. The shell is the one thing that must never be
 *    stale, because it is what points at everything else. Root and known panel navigations are
 *    answered with index.html; the searcher and any other page fetches itself; an uncached
 *    navigation that is neither falls back to the real 404 page, never the game shell.
 *  - PRECACHED ASSETS (the ASSETS list) → CACHE-FIRST, served straight from the versioned
 *    cache with no network round trip at all. This is the whole point of the worker: the
 *    notebook is ~1.3MB gzipped across forty-odd files, and paying for every byte of it on
 *    every single visit was the single biggest thing between opening the site and playing it.
 *  - other same-origin (guest catalogues, anything not precached) → NETWORK-FIRST, cached as
 *    it goes, so it works offline from the second visit.
 *  - cross-origin → CACHE-FIRST (kept as a safety net; the fonts are now self-hosted
 *    same-origin, so in practice nothing hits this branch).
 *
 * BUMP `CACHE` ON EVERY DEPLOY THAT TOUCHES A PRECACHED FILE. This is not the old advice and
 * the difference matters: the worker used to fetch everything with `cache: "reload"`, so the
 * code on screen was always the code on the server and the version string only evicted dead
 * entries. Cache-first removes that safety net. The version string IS the deploy now, and a
 * push that edits js/app.js without bumping it ships nothing to anyone who has been here
 * before. Bumping costs a background re-download and nothing else, so when in doubt, bump.
 *
 * What still updates on its own: the browser revalidates sw.js itself on every navigation, so
 * a bumped worker installs without anyone clearing anything, and `skipWaiting` + `claim` below
 * hand the new cache to the next navigation. And because install fetches with `cache: "reload"`
 * (see below), a bump is guaranteed to precache what is actually on the server rather than
 * whatever GitHub Pages' max-age left sitting in the HTTP cache.
 *
 * Paths are relative so the worker works at the site root (swiftassociation.com)
 * and under any project subpath, without hardcoding the origin.
 */
const CACHE = "stta-v93";
// The game's panel routes. These are sections of index.html, not files, so a navigation to one
// has nothing on the server to fetch: 404.html bounces it back through a ?/slug marker. Once
// this worker is installed we can do better and answer with index.html directly, so a deep link
// (or an offline one) opens the notebook with no bounce at all. Same list as PANEL_ROUTES in
// js/config.js and ROUTES in 404.html — a slug added to one must be added to all three.
const ROUTES = ["records", "charms", "stats", "mastery", "challenges", "bonus", "guests", "songbook",
                "album-focus", "ruthless", "how-to-play", "glossary"];
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
  "styles.css?v=80",
  "textures/oak-surface.svg",
  "textures/oak-figure.svg",
  // Self-hosted fonts (latin subset). Precached so first offline load has the
  // real faces; declared via @font-face in styles.css / search.css.
  "fonts/caveat-latin.woff2",
  "fonts/courierprime-400-latin.woff2",
  "fonts/courierprime-700-latin.woff2",
  "fonts/courierprime-italic-latin.woff2",
  "js/app.js",
  "js/cta.js",   // Shared start-button contents and decorative finish layers.
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
  "js/backcard.js",
  // The bonus shelf's torn-paper zine covers (pure; see js/zine.js). app.js imports it at
  // load, so a stale copy of one and a fresh copy of the other is a broken shelf.
  "js/zine.js",
  // Word Cloud's ink-mask packing (pure; see js/cloud.js). app.js imports it at load.
  "js/cloud.js",
  // The lineup's goal deck: what the cards say, what a hand of them costs, the line art on
  // the face, and the pure judge that says whether a card is still alive. app.js imports
  // them all at load, so an uncached copy breaks a cold offline start, not just the felt.
  "js/lineupdeck.js",
  "js/lineuphand.js",
  "js/lineupcards.js",
  "js/lineupgoals.js",
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
  "js/tumblr.js",
  // The stickers stuck to the closed notebook cover. Pairs with js/stickers.js above the
  // same way scatter.js pairs with deskprops.js, and it is wanted earlier than either:
  // the cover is the first thing drawn on a cold start, so a missing half of this pair
  // breaks the load screen itself.
  "js/stickercover.js",
  "js/stickerselection.js",
  // The generated tab icon, drawn in the Album Focus ink. Wanted on a cold start for the same
  // reason as the cover: applySettings swaps the <link> on the first paint, and without this the
  // tab would sit on the static gold tile until the network came back.
  "js/favicon.js",
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

/* The same list as absolute URLs, for the cache-first branch below to test a request against.
   Resolved against the worker's own location so the relative paths keep working under a project
   subpath. The href includes the query string, which is what makes "styles.css?v=80" match the
   exact URL index.html asks for and nothing else. */
const PRECACHED = new Set(ASSETS.map((path) => new URL(path, self.location).href));

/* Precache every asset, bypassing the HTTP cache on the way.
   cache.addAll() would be shorter, but it fetches through the browser's HTTP cache, and GitHub
   Pages serves these files with a max-age. A worker installing inside that window would happily
   precache the copies the previous deploy left behind and then serve them cache-first forever,
   which is the exact failure this whole strategy has to be immune to. Fetching each file with
   `cache: "reload"` guarantees the precache holds what is really on the server.
   Atomic like addAll: a single missing or non-ok file rejects the install and leaves the old
   worker (and its complete cache) in charge, rather than claiming clients with half a site. */
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        Promise.all(
          ASSETS.map((path) =>
            fetch(new Request(path, { cache: "reload" })).then((res) => {
              if (!res.ok) throw new Error(`precache failed: ${path} (${res.status})`);
              return c.put(path, res);
            })
          )
        )
      )
      .then(() => self.skipWaiting())
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
  // A precached asset is a same-origin subresource on the ASSETS list. Navigations are excluded
  // on purpose even when the page is on the list (index.html, 404.html, search/): an HTML
  // document is the one thing that has to come from the network while there is a network, since
  // it is what decides which version of everything else gets asked for. Fonts land here too,
  // which is what they always wanted: a .woff2 is immutable, and a round trip for one means a
  // flash of the fallback face.
  const isPrecachedAsset =
    url.origin === location.origin && req.mode !== "navigate" && PRECACHED.has(url.href);

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
  } else if (isPrecachedAsset) {
    // The fast path, and the reason this worker exists. Everything in ASSETS was fetched fresh
    // at install time and is keyed to this CACHE version, so there is nothing to revalidate:
    // hand it straight over. No network, no round trip, no waiting on GitHub Pages before the
    // notebook can be drawn. Freshness is the version string's job, not this branch's.
    // The network fallback covers the gap between a worker claiming a client and its install
    // finishing, and any entry evicted by storage pressure; it refills the cache as it goes.
    // Scoped to this version's cache rather than caches.match()'s search across all of them:
    // the previous version's cache is still on disk until activate finishes deleting it, and an
    // unscoped match can answer an early fetch out of it.
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(req).then(
          (hit) =>
            hit ||
            fetch(req).then((res) => {
              c.put(req, res.clone());
              return res;
            })
        )
      )
    );
  } else if (url.origin === location.origin) {
    // Everything not precached: guest catalogues, and any HTML page that fetches itself. Network
    // first, then fall back to the exact cached request. An uncached navigation that is not the
    // root or a known panel route gets the real 404 page, never the game shell.
    // `cache: "reload"` makes the SW's own fetch BYPASS the browser HTTP cache: without it,
    // GitHub Pages' max-age means fetch() can return a stale file and "network-first" silently
    // behaves like "HTTP-cache-first" after a deploy.
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
