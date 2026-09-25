/* Service worker for Swift To The Song Association (static, GitHub Pages).
 *
 * Strategy:
 *  - EVERYTHING PRECACHED → CACHE-FIRST, the page included, served straight from the versioned
 *    cache with no network round trip at all. This is the whole point of the worker: the
 *    notebook is ~1.3MB gzipped across forty-odd files, and paying for every byte of it on
 *    every single visit was the single biggest thing between opening the site and playing it.
 *    Root and known panel navigations are answered with the precached index.html; the searcher
 *    and the 404 page are precached under their own paths and answered the same way.
 *  - other same-origin (guest catalogues, anything not precached) → NETWORK-FIRST, cached as
 *    it goes, so it works offline from the second visit. An uncached navigation that is not the
 *    root or a known panel route falls back to the real 404 page, never the game shell.
 *  - cross-origin → CACHE-FIRST (kept as a safety net; the fonts are now self-hosted
 *    same-origin, so in practice nothing hits this branch).
 *
 * The page is served from the cache rather than the network ON PURPOSE, and it is the second
 * decision here worth understanding. Serving it network-first sounds strictly safer, and it is
 * not: it hands out the NEW markup to a page that is still controlled by the OLD worker, and so
 * still runs the OLD modules out of the old cache. One visit of new HTML against last deploy's
 * JavaScript is a mismatch that cannot happen at all when both come from the same cache. A
 * client is either wholly on one version or wholly on the next, never straddling two.
 *
 * What makes that safe is that the worker script is not subject to any of this. sw.js is never
 * served through the fetch handler below; the browser revalidates it out of band on navigation,
 * so a new worker is still found, installed and activated even though no navigation has touched
 * the network in weeks. The cost is a one-visit lag: the page you are looking at keeps the
 * worker it was bound to, and the new one takes over from the next navigation.
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
const CACHE = "stta-v208";
// The game's panel routes. These are sections of index.html, not files, so a navigation to one
// has nothing on the server to fetch: 404.html bounces it back through a ?/slug marker. Once
// this worker is installed we can do better and answer with index.html directly, so a deep link
// (or an offline one) opens the notebook with no bounce at all. Same list as PANEL_ROUTES in
// js/config.js and ROUTES in 404.html — a slug added to one must be added to all three.
const ROUTES = ["records", "charms", "stats", "mastery", "challenges", "bonus", "guests", "songbook",
                "album-focus", "ruthless", "how-to-play", "glossary", "graveyard", "credits"];
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
  "styles.css?v=82",
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
  // Track by Track's twelve album sleeves (pure; see js/sleeves.js). They are drawn with the
  // workshop exported from js/zine.js, so the two are one deploy: a stale copy of either is a
  // board pasted up by different hands from the shelf beside it.
  "js/sleeves.js",
  // Album Focus's twelve halftone snapshots (pure; see js/albumdots.js). It shares the seeded
  // random source in js/zine.js, so it deploys with that one for the same reason the sleeves do.
  "js/albumdots.js",
  // ...and the tone maps it prints from, generated from the covers by
  // scripts/albumfocus/covertone.py. Useless without each other, so they cache together.
  "js/albumtone.js",
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
  "data/producers.json",
  "data/writers.json",
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
   subpath. The href includes the query string, which is what makes "styles.css?v=82" match the
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

/* Cache-first against THIS version's cache.
   `key` is what to look up (a request, or a path when the URL asked for is not the file that
   answers it, as with a panel route answered by index.html). Scoped with caches.open(CACHE)
   rather than the unscoped caches.match(), which searches every cache in creation order: the
   previous version's is still on disk until activate finishes deleting it, and an unscoped
   match can quietly answer an early fetch out of it.
   The network fallback covers the gap between a worker claiming a client and its install
   finishing, and any entry evicted by storage pressure; it refills the cache as it goes. */
const cacheFirst = (key, req = key) =>
  caches.open(CACHE).then((c) =>
    c.match(key).then(
      (hit) =>
        hit ||
        fetch(req, { cache: "reload" }).then((res) => {
          if (res.ok) c.put(key, res.clone());
          return res;
        })
    )
  );

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Anything on the ASSETS list, same-origin. Navigations are NOT excluded: the searcher and the
  // 404 page are on the list under their own paths and are answered from the cache like
  // everything else, so a page and the modules it loads always come from one version. Fonts land
  // here too, which is what they always wanted: a .woff2 is immutable, and a round trip for one
  // means a flash of the fallback face.
  const isPrecachedAsset = url.origin === location.origin && PRECACHED.has(url.href);

  if (url.origin === location.origin && req.mode === "navigate" && isAppShellRoute(url)) {
    // The notebook itself, for its root and its known panel URLs. A panel route is a section of
    // index.html rather than a file, so there is nothing at that path to ask for: the precached
    // shell is the answer, and the route only decides which panel app.js opens.
    e.respondWith(cacheFirst("index.html", new Request("index.html")));
  } else if (isPrecachedAsset) {
    // The fast path, and the reason this worker exists. Everything in ASSETS was fetched fresh
    // at install time and is keyed to this CACHE version, so there is nothing to revalidate:
    // hand it straight over. No network, no round trip, no waiting on GitHub Pages before the
    // notebook can be drawn. Freshness is the version string's job, not this branch's.
    e.respondWith(cacheFirst(req));
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
