/* Stickers on the closed notebook cover (see scripts/stickers/STICKERS.md, "Where a sticker
   lives"). The cover is the one large empty object in the game and the thing a real notebook
   actually accumulates stickers on, so the earned set gets stuck to the open kraft field.

   The property everything else here serves: A STICKER NEVER MOVES. Not between sessions, not
   when you earn another one, not when one is taken off. Nothing is stored as coordinates
   either. Both at once come from placing all FIFTEEN every time, in the fixed STICKERS order,
   from a stream seeded by the sticker's own id, and only then drawing the subset the player
   has actually earned. Unlock state cannot reach the layout, because the layout never sees it.

   Two consequences worth knowing before changing anything:
   - Adding a sticker to the END of STICKERS is free. Inserting one in the middle, renaming an
     id, or reordering the array re-deals every sticker after it. Append only.
   - The layout is measured from the live cover, so it is relative to the field, not absolute.
     Same window size gives the same picture forever; a different window size re-deals, the
     way any responsive layout does.

   Nothing here animates, on load or on hover. These are vinyl stuck to board.

   Loaded as its own module from index.html rather than through app.js: the cover is on screen
   before app.js has finished booting, and this has no business waiting for game data. */

import { STICKERS } from "./stickers.js";
import { loadStickers } from "./storage.js";
import { mulberry32, fnv1a } from "./util.js";

/* ---------- The numbers ---------- */

// The density ceiling: how many of the earned set the cover will carry. Fifteen, which is
// the whole drawn set today, so on a desktop cover every sticker a player has earned is on
// the notebook and this number is not currently taking anything away.
//
// It is not simply absent, and it must not be removed, for two reasons. The cover is not one
// size: at 375px the field only holds eleven of the fifteen slots at the 64px floor, so a
// ceiling is already biting there and the oldest-first rule below is already deciding what
// shows. And the set is going to grow past fifteen when the coincidence stickers land (see
// STICKERS.md), at which point this starts governing the desktop cover too.
//
// What was measured, since it is the thing nobody should have to re-derive: on the desktop
// cover the composition breaks between eight and twelve. At twelve the strip above the title
// plate closes into a row and crowds the plate, which is the most important thing on that
// surface; at fifteen the kraft has stopped being the subject and the cover reads as a sticker
// sheet rather than as a notebook somebody owns. Corey looked at all five densities on
// scripts/stickers/sticker-density.html and chose the full set anyway, which is a taste call
// about wanting the collection visible, not an oversight. If the cover ever feels loud, eight
// is the number this was measured at and six is the quiet one.
//
// The count was never the only thing holding it up. The packer spreads all fifteen slots over
// the whole field (see the best-candidate sampling below), so an arbitrary handful lands
// scattered rather than rafted. That work is what keeps a partial set looking right, and it
// matters more, not less, now that the ceiling is not doing any trimming on desktop.
let COVER_MAX = 15;

// Never below 44 (that size belongs to the margin doodles, a family these must not converge
// with) and 64 is the real floor: below it the crowded drawings stop being their object and
// become "an object with detail". The cover has room, so we sit well clear of both.
const SIZE_MIN = 64;
const SIZE_MAX = 96;
const SIZE_OF_FIELD = 0.15;   // of the usable field's width, before the per-sticker jitter

const GAP = 9;                // clear kraft between two die cuts, px
const EDGE = 14;              // clear kraft between a die cut and anything it must avoid
const TRIES = 160;            // candidate positions sampled per sticker

// Clustering. A minority of stickers go on beside one that is already there, so the set
// arrives partly in twos rather than evenly spaced. Raising this much above a third starts
// chaining them: each new cluster becomes a neighbour the next one can hang off, and the
// chain ends up as a raft along the bottom of the field.
const CLUSTER_ODDS = 0.3;
const CLUSTER_NEAR = 1.05;    // as a multiple of the two radii + GAP
const CLUSTER_FAR = 2.3;

const ROT = 15;               // degrees either side of straight
const MIRROR_GUARD = 2.2;     // two stickers may not sit at +n and -n degrees (see below)

/* ---------- Geometry ---------- */

// Rect helpers. Everything is in cover-relative px.
const rect = (x, y, w, h) => ({ x, y, w, h });
const grow = (r, by) => rect(r.x - by, r.y - by, r.w + by * 2, r.h + by * 2);
function hits(r, cx, cy, rad) {
  // circle/rect overlap: nearest point on the rect to the centre
  const nx = Math.max(r.x, Math.min(cx, r.x + r.w));
  const ny = Math.max(r.y, Math.min(cy, r.y + r.h));
  const dx = cx - nx, dy = cy - ny;
  return dx * dx + dy * dy < rad * rad;
}

// The no-go mask, measured off the cover the player is actually looking at rather than
// hardcoded from styles.css, so it cannot drift out of step with the cover's own CSS.
// Everything with a silhouette out there is in here: the taped title plate, the bookcloth
// spine, both leather corner protectors, the elastic strap and the ribbon. The board's own
// inset is the outer bound, so nothing hangs off the cut edge.
function readCover(cov) {
  const cw = cov.offsetWidth, ch = cov.offsetHeight;
  if (cw < 40 || ch < 40) return null;                 // laid out but collapsed: not ready
  // Measured off offsetLeft/offsetTop rather than getBoundingClientRect on purpose: a rect is
  // reported through any transform on an ancestor, and the cover IS put inside a scaled box
  // (the page-turn sheet, the density comparison board). Layout offsets ignore transforms, so
  // a scaled cover is still measured in its own untransformed pixels, which is the space the
  // stickers are positioned in. Every child here is absolutely positioned or relative inside
  // .nb-cover, so the walk up the offsetParent chain is one step in practice.
  const R = (sel) => {
    const el = cov.querySelector(sel);
    if (!el) return null;
    let x = 0, y = 0;
    for (let n = el; n && n !== cov; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return rect(x, y, el.offsetWidth, el.offsetHeight);
  };
  const board = R(".nb-cover-board") || rect(0, 0, cw, ch);
  const mask = [];
  for (const sel of [".nb-cover-plate", ".nb-cover-spine", ".nb-cover-elastic",
                     ".nb-cover-ribbon", ".nb-cover-corner--tr", ".nb-cover-corner--br"]) {
    const r = R(sel);
    if (r) mask.push(grow(r, EDGE));
  }
  // The strap runs the full height of the board and cuts a strip off the fore-edge that is
  // too narrow to hold a sticker at the size floor. Rather than let the packer discover that
  // strip and drop one lonely sticker into it, the field simply ends at the strap.
  const strap = R(".nb-cover-elastic");
  const right = strap ? Math.min(board.x + board.w, strap.x) : board.x + board.w;
  const field = rect(board.x + EDGE, board.y + EDGE,
                     right - board.x - EDGE * 2, board.h - EDGE * 2);
  return { box: rect(0, 0, cw, ch), field, mask };
}

/* ---------- The layout ---------- */

// Place all fifteen, in array order, each from its own seeded stream. Returns a map of
// id -> { x, y, size, rot } in cover-relative px. Called with the full list every time,
// whatever the player has earned, which is what makes a placement permanent.
function layout(geo) {
  const { field, mask } = geo;
  const base = Math.max(SIZE_MIN, Math.min(SIZE_MAX, field.w * SIZE_OF_FIELD));
  const placed = [];
  const out = {};

  for (const st of STICKERS) {
    const rng = mulberry32(fnv1a("stickercover:" + st.id));
    const size = Math.max(SIZE_MIN, base * (0.9 + rng() * 0.22));
    const rad = size / 2;

    // Rotation first, so it costs the same draw whether or not a slot is found. The mirror
    // guard is the ornament house rule: a pair at +9 and -9 degrees reads as a deliberate
    // arrangement, which is the one thing hand-placed must not look like. On a clash the
    // angle is walked, not redrawn, so it stays a function of the id.
    let rot = (rng() * 2 - 1) * ROT;
    for (let n = 0; n < 24; n++) {
      if (!placed.some((p) => Math.abs(p.rot + rot) < MIRROR_GUARD)) break;
      rot += rot >= 0 ? MIRROR_GUARD : -MIRROR_GUARD;
      if (Math.abs(rot) > ROT) rot = -rot / 2;
    }

    // Two ways a sticker finds its spot, and the mix is the composition.
    //
    // Most of them go on by BEST CANDIDATE: sample valid positions and keep the one furthest
    // from everything already stuck down. That spreads the fifteen slots over the whole field
    // instead of letting a greedy first-fit chain them into a raft along the bottom, and it is
    // what makes an arbitrary handful of them look scattered. Which handful shows depends on
    // the order the player earned them, so every subset has to hold up, not just the full set.
    //
    // The rest go on by CLUSTER PULL: hang off something already there. Without these the
    // field reads as evenly salted, which is the desk-scatter failure mode: perfectly spaced
    // is a metronome, and a couple of deliberate pairs are what make the gaps read as gaps.
    const cluster = placed.length > 1 && rng() < CLUSTER_ODDS;
    let spot = null, spotScore = -1, curRad = rad;

    // A short viewport (a laptop with little vertical room, not a phone-width field) can leave
    // less room than fifteen random draws expect, and a spot that never turns up would mean an
    // earned sticker just never appears on the cover — the exact bug this shrink loop exists to
    // rule out. So a candidate scan that comes up empty is not the end: the radius is shrunk
    // and the field re-scanned, same seed, so a sticker that has to give ground always gives
    // the same ground at a given field size rather than flickering between sizes on a reload.
    for (let shrink = 0; shrink < 9 && !spot; shrink++) {
      if (shrink > 0) curRad *= 0.82;
      const useCluster = cluster && shrink === 0;
      spotScore = -1;
      for (let t = 0; t < TRIES; t++) {
        let cx, cy;
        if (useCluster) {
          const near = placed[(rng() * placed.length) | 0];
          const reach = near.rad + curRad + GAP;
          const d = reach * (CLUSTER_NEAR + rng() * (CLUSTER_FAR - CLUSTER_NEAR));
          const a = rng() * Math.PI * 2;
          cx = near.cx + Math.cos(a) * d;
          cy = near.cy + Math.sin(a) * d;
        } else {
          cx = field.x + curRad + rng() * Math.max(0, field.w - curRad * 2);
          cy = field.y + curRad + rng() * Math.max(0, field.h - curRad * 2);
        }
        if (cx - curRad < field.x || cx + curRad > field.x + field.w) continue;
        if (cy - curRad < field.y || cy + curRad > field.y + field.h) continue;
        if (mask.some((m) => hits(m, cx, cy, curRad))) continue;
        // Distance to the nearest neighbour's EDGE. Negative means they overlap.
        let near = Infinity;
        for (const p of placed) {
          const dx = p.cx - cx, dy = p.cy - cy;
          near = Math.min(near, Math.sqrt(dx * dx + dy * dy) - p.rad - curRad);
        }
        // The floor attempt (shrink === 8) asks only to not overlap, GAP included, because by
        // then the point is to still land the sticker somewhere rather than hold a margin.
        if (near < (shrink < 8 ? GAP : 0)) continue;
        // A cluster wants the FIRST spot that fits, not the roomiest one, or it stops clustering.
        if (useCluster) { spot = { cx, cy }; break; }
        if (near > spotScore) { spotScore = near; spot = { cx, cy }; }
      }
    }
    if (!spot) continue;
    placed.push({ cx: spot.cx, cy: spot.cy, rad: curRad, rot });
    out[st.id] = { x: spot.cx - curRad, y: spot.cy - curRad, size: curRad * 2, rot };
  }
  return out;
}

/* ---------- Which ones are on the cover ---------- */

// What the player has earned: { [stickerId]: isoDate }, the same store the keepsakes drawer
// reads. The dev override stands in front of it so a density can be tried without touching
// the notebook's real record.
function earnedMap() {
  return devPick || loadStickers();
}

// The ceiling picks by EARN ORDER, oldest first: the cover is the handful you stuck on as you
// got them, and once it is full it stops changing. Picking the newest instead would take an
// earned sticker off the cover every time another one landed, which is the same broken promise
// as moving one. Ties and missing dates fall back to the array's own order.
function coverSet(earned, max) {
  const mine = STICKERS.filter((s) => earned[s.id]);
  mine.sort((a, b) => String(earned[a.id]).localeCompare(String(earned[b.id]))
                      || STICKERS.indexOf(a) - STICKERS.indexOf(b));
  return mine.slice(0, max);
}

// A stand-in earned map for a list of ids, dated in list order. Used by the dev tools and by
// the density comparison board, both of which need "pretend these N are earned, in this order".
export function fakeEarned(ids) {
  const out = {};
  ids.forEach((id, i) => { out[id] = new Date(Date.UTC(2026, 0, 1 + i)).toISOString(); });
  return out;
}

/* ---------- Rendering ---------- */

// The die cut, injected once. The filter dilates the artwork's own alpha, hardens the soft
// edge back to a line, floods it cream and drops it behind, so every sticker gets the same
// vinyl border whatever its shape. Guarded because the drawer's copy of this feature adds the
// same def to index.html: whichever arrives first wins and the other is a no-op.
const CUT_ID = "stickCut";
function ensureDieCut() {
  if (document.getElementById(CUT_ID)) return;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  svg.innerHTML =
    `<filter id="${CUT_ID}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">` +
    `<feMorphology in="SourceAlpha" operator="dilate" radius="2.6" result="fat"/>` +
    `<feGaussianBlur in="fat" stdDeviation="1.5" result="soft"/>` +
    `<feComponentTransfer in="soft" result="mask"><feFuncA type="linear" slope="16" intercept="-4.6"/></feComponentTransfer>` +
    `<feFlood flood-color="#fbf6e9" result="paper"/>` +
    `<feComposite in="paper" in2="mask" operator="in" result="cut"/>` +
    `<feDropShadow in="cut" dx="0.7" dy="1.6" stdDeviation="1.2" flood-color="#2b2722" flood-opacity="0.3" result="lift"/>` +
    `<feMerge><feMergeNode in="lift"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  document.body.appendChild(svg);
}

let devPick = null;      // dev override for the earned map; null = read the real store
let devMask = false;     // dev: draw the no-go mask

// Stick the earned set to the cover. Idempotent: it clears its own layer and redraws, so it
// can be called on resize, on an unlock, or from the dev panel without accumulating anything.
export function placeCoverStickers(cov, opts) {
  cov = cov || document.querySelector("#loading .nb-cover");
  if (!cov) return 0;
  const max = opts && typeof opts.max === "number" ? opts.max : COVER_MAX;
  const old = cov.querySelector(".cover-stickers");
  if (old) old.remove();

  const geo = readCover(cov);
  if (!geo) return 0;
  ensureDieCut();

  const spots = layout(geo);
  const set = coverSet((opts && opts.earned) || earnedMap(), max).filter((s) => spots[s.id]);

  const layer = document.createElement("div");
  layer.className = "cover-stickers";
  layer.setAttribute("aria-hidden", "true");

  if (devMask) {
    for (const m of geo.mask) layer.appendChild(devBox(m, "#c0392f"));
    layer.appendChild(devBox(geo.field, "#4a8c87"));
  }

  for (const st of set) {
    const p = spots[st.id];
    const cell = document.createElement("span");
    cell.className = "cover-sticker";
    cell.style.cssText =
      `left:${p.x.toFixed(1)}px;top:${p.y.toFixed(1)}px;` +
      `width:${p.size.toFixed(1)}px;height:${p.size.toFixed(1)}px;` +
      `--rot:${p.rot.toFixed(2)}deg`;
    cell.innerHTML = st.art;
    layer.appendChild(cell);
  }
  cov.appendChild(layer);
  return set.length;
}

function devBox(r, colour) {
  const d = document.createElement("span");
  d.style.cssText = `position:absolute;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;` +
    `outline:1px dashed ${colour};background:${colour}22;pointer-events:none`;
  return d;
}

/* ---------- Boot ---------- */

// The cover is in the markup, so it can be dressed the moment the DOM is parsed: the stickers
// are on the board before the player's first look at it, never applied to a cover already on
// screen. revealNotebook() deep-clones the cover into the page-turn sheet, so they ride the
// notebook open with no involvement from this module.
function boot() {
  const loading = document.getElementById("loading");
  if (!loading) return;

  // Getting the timing right here is most of the work. At DOMContentLoaded the start screen
  // has not been activated yet, so the cover is display:none and cannot be measured; it
  // becomes measurable a beat later, and revealNotebook opens it again as soon as the song
  // data has loaded. The stickers have to be on the board inside that window, because that is
  // both when the player sees the closed cover AND when revealNotebook deep-clones it into the
  // page-turn sheet. Miss it and they neither show nor ride the notebook open.
  //
  // So: poll until it measures, then place once. A ResizeObserver alone is not enough. It
  // coalesces, so on a warm load the whole activate-then-open sequence can finish before its
  // first delivery and leave one final observation of a cover that is already hidden.
  let lastSize = "";
  const attempt = () => {
    const cov = loading.querySelector(".nb-cover");
    if (!cov || cov.offsetWidth < 40) return false;         // hidden, or not laid out yet
    const size = cov.offsetWidth + "x" + cov.offsetHeight;
    if (size !== lastSize) { lastSize = size; placeCoverStickers(); }
    return true;
  };
  // The trigger is the start screen being ACTIVATED, watched with a MutationObserver. That is
  // the moment the cover stops being display:none and becomes measurable, and a MutationObserver
  // runs on the microtask checkpoint rather than on the rendering loop, so unlike rAF and
  // ResizeObserver it still fires in a hidden tab. It also lands well inside the window: the
  // screen is activated during boot, while revealNotebook is still waiting on the song data,
  // and a fetch can never settle in the same task.
  const card = document.getElementById("screen-start");
  if (card) {
    const mo = new MutationObserver(() => { if (attempt()) mo.disconnect(); });
    mo.observe(card, { attributes: true, attributeFilter: ["class"] });
  }
  // Backstop, in case the screen is already active by the time this module runs.
  let waited = 0;
  const STEP = 32, LIMIT = 4000;
  const chase = () => { if (attempt()) return; waited += STEP; if (waited < LIMIT) setTimeout(chase, STEP); };
  chase();
  // Once more when the webfonts land. The title plate is sized by its own text, so measuring
  // it against the fallback face gives a plate of the wrong height and a no-go mask that is
  // wrong with it: on the density board, placing before the fonts settled cost the fullest
  // cover two of its fifteen slots. Re-placing is free and invisible, since the layout is a
  // pure function of the geometry, so an unchanged plate re-deals exactly what was there.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { lastSize = ""; attempt(); });
  }
  // A resize while the cover is still up re-measures the field. The layer is rebuilt, not
  // transitioned, so this stays true: nothing here animates.
  if (typeof ResizeObserver === "function") new ResizeObserver(attempt).observe(loading);
  holdForDev();
}

// Dev only: ?cover=N holds the notebook closed with the first N stickers stuck to it. The
// cover is otherwise on screen for exactly as long as the data takes to load, which is not
// long enough to judge anything, and revealNotebook opens it out from under you. Re-asserted
// on a short timer because the open happens whenever loadData finishes, not at a fixed moment.
function holdForDev() {
  const n = new URLSearchParams(location.search).get("cover");
  if (n === null) return;
  const count = n === "" ? STICKERS.length : Math.max(0, parseInt(n, 10) || 0);
  COVER_MAX = Math.max(COVER_MAX, count);
  devPick = fakeEarned(STICKERS.slice(0, count).map((s) => s.id));
  api.show();
  const until = Date.now() + 4000;
  const t = setInterval(() => { api.show(); if (Date.now() > until) clearInterval(t); }, 200);
}


/* ---------- Dev tools ---------- */
// Reachable as window.__stickerCover, and through the "stickers" section of the ?dev panel.
// `show()` earns its place: the closed cover is only on screen while the data loads, so
// without it the surface this whole module draws on cannot be looked at a second time.
const api = {
  // Force the first n of the fifteen on, ignoring the store. The density comparison runs on this.
  density(n) { devPick = fakeEarned(STICKERS.slice(0, n).map((s) => s.id)); return placeCoverStickers(); },
  all() { return api.density(STICKERS.length); },
  none() { devPick = {}; return placeCoverStickers(); },
  only(ids) { devPick = fakeEarned(Array.isArray(ids) ? ids : [ids]); return placeCoverStickers(); },
  real() { devPick = null; return placeCoverStickers(); },   // back to the actual store
  mask(on) { devMask = on !== false; return placeCoverStickers(); },
  // Put the closed notebook back on screen so the cover can be looked at after boot.
  show() {
    const card = document.getElementById("screen-start");
    const loading = document.getElementById("loading");
    const content = document.getElementById("startContent");
    if (!card || !loading) return "no cover";
    card.classList.add("is-booting");
    if (content) content.style.display = "none";
    loading.style.display = "";
    return placeCoverStickers();
  },
  hide() {
    const card = document.getElementById("screen-start");
    const loading = document.getElementById("loading");
    const content = document.getElementById("startContent");
    if (card) card.classList.remove("is-booting");
    if (loading) loading.style.display = "none";
    if (content) content.style.display = "";
    return "hidden";
  },
  place: placeCoverStickers,
  // What the packer decided, for checking a placement without eyeballing it.
  spots() {
    const cov = document.querySelector("#loading .nb-cover");
    const geo = cov && readCover(cov);
    return geo ? layout(geo) : null;
  },
  // Read the ceiling, or move it for a look. Not persisted: the shipped number is the
  // constant at the top of this file, and this only exists so a density can be compared.
  ceiling(n) { if (typeof n === "number") { COVER_MAX = n; placeCoverStickers(); } return COVER_MAX; },
};
window.__stickerCover = api;

// Boot last, after the dev api it leans on exists. The module is loaded at the end of body,
// so in practice the DOM is already parsed and this runs on the spot.
if (document.readyState === "loading") addEventListener("DOMContentLoaded", boot);
else boot();
