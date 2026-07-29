// The desk beside the notebook, all the way down the page.
//
// The fixed props in index.html dress the first screenful and scroll away, so
// everything below them used to be bare wood. This module fills it.
//
// THE COMPOSITION RULE, which is the whole file:
//
//   Do not distribute beads. Distribute INCIDENTS.
//
// The first version of this module walked down the page dropping a 1-4 bead
// blob every ~400px, strictly alternating gutters. That reads as a metronome,
// because it is one: every blob the same size, the same shape, the same private
// slice of wood, colours drawn fresh from the full palette each time so no two
// blobs had any relationship. It looked like debris because nothing explained
// where any of it came from.
//
// So instead: each thing on the wood is an incident with a cause and a shape of
// its own. A tin went over and threw a fan of beads down the desk. A part-strung
// strand lies where it was put down. Someone sorted a few by colour. One bead
// rolled a long way and stopped alone. And in between, real empty wood, in
// stretches long enough to notice, because the voids are what make a spill read
// as a spill rather than as wallpaper.
//
// Three layers, painted in this order:
//   marks   — stains and dust (js/deskprops.js DESK_MARKS). Flat, unshadowed,
//             frequent. The desk's history.
//   props   — objects (DESK_PROPS). Lit, shadowed, at most one per screenful.
//   beads   — the incidents below. The bulk of the life on the page.
//
// Everything here is decorative, non-interactive (pointer-events: none) and
// desktop-only, matching the fixed props. The container is document-anchored so
// it scrolls 1:1 with the wood grain: these objects are ON the desk, and a desk
// object does not fade in, drift, or announce itself. It was always there.

import { DESK_MARKS, DESK_PROPS } from "./deskprops.js";

// Same breakpoint the fixed props use: below this the gutters are too thin to
// hold anything without crowding the notebook.
const DESKTOP = window.matchMedia("(min-width: 1120px)");

const HALF = 330;      // half the 660px paper column (centred at 50vw)
const PAPER_GAP = 32;  // keep things off the paper edge (a bead crowding the
                       // page reads as a bug in the layout, not as a bead)
const EDGE = 10;       // keep things off the screen edge
const MIN_BAND = 66;   // a gutter narrower than this gets nothing
const BEAD_CAP = 520;  // hard ceiling, however tall the page

// Bead palette, echoing the floss-station beads and the era accents.
// hi = lit face, lo = shaded edge fill, edge = stroke, hole = threading hole.
const ROUND_COLORS = [
  { hi: "#f2d78f", lo: "#c79a3e", edge: "#9c7527", hole: "#5d4318" }, // gold
  { hi: "#ecaebd", lo: "#c06880", edge: "#964962", hole: "#6e3247" }, // rose
  { hi: "#b3cbe4", lo: "#6c8cb4", edge: "#4c6b91", hole: "#324e6e" }, // denim
  { hi: "#cbbceb", lo: "#8b73c9", edge: "#6d5aa6", hole: "#453a6a" }, // lavender
  { hi: "#a9d6b6", lo: "#5a9e6e", edge: "#3f7d54", hole: "#2c5238" }, // debut green
  { hi: "#f0b795", lo: "#c4703f", edge: "#9c5227", hole: "#633315" }, // rust
];

// Floss colours for the strand thread, keyed loosely to the bead palette so a
// strand's thread never fights the beads strung on it.
const FLOSS = ["#c06880", "#6c8cb4", "#c79a3e", "#8b73c9", "#5a9e6e"];

// What the alphabet discs actually say. A real bracelet spill is not a random
// glyph generator: the letters came off words, so ours do too. Strands and
// sorted rows lay a word out in order and readable; spills and handfuls draw
// from the same pool but scrambled, half of them face-down or edge-on, so what
// survives is a fragment. Look closely and there is something to find.
const WORDS_SHORT = ["LUCKY", "KARMA", "LOVER", "MINE", "OURS", "STAY", "SEVEN",
  "PEACE", "CLEAN", "GOLD", "BETTY", "AUGUST", "WILLOW", "RED", "MIRROR"];
const WORDS_LONG = ["FEARLESS", "EVERMORE", "FOLKLORE", "DAYLIGHT", "DELICATE",
  "STARLIGHT", "ENCHANTED", "LONG LIVE", "THE ARCHER", "INVISIBLE"];
// Loose glyphs for the scrambled incidents: the alphabet a kit actually ships,
// weighted to the letters those words use, plus the number every bracelet has.
const LOOSE_GLYPHS = "LUCKYKARMALOVERSTAYPEACECLEANGOLDAEIORSTLNVW13♥★♥13".split("");

let seed = 0x9e3d71b1;   // fixed default → a stable, curated-looking layout
let densityMult = 1;     // dev knob: <1 denser, >1 sparser
let showProps = true;
let showMarks = true;
let onlyType = "";       // dev: restrict the walk to one incident type
let debugBands = false;

// mulberry32: tiny deterministic PRNG so the layout is stable within a load and
// reproduces its top portion when the page grows taller.
function makeRng(a) {
  let s = a >>> 0;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rangeR = (r, lo, hi) => lo + r() * (hi - lo);
const pick = (r, arr) => arr[(r() * arr.length) | 0];
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const chance = (r, p) => r() < p;
// Loose beads that land outside their gutter are DROPPED, never clamped back to
// the edge. Clamping was quietly the worst artefact in the spill: every bead
// whose roll overshot the gutter piled up on the same x, so a long fan ended in
// a dead-straight column of beads ruled against the window edge. A bead that
// rolls off the visible desk has simply rolled off the visible desk.
const inBand = (band, x, pad = 8) => x > band[0] + pad && x < band[1] - pad;

let container = null;
let stats = { beads: 0, props: 0, marks: 0, incidents: 0 };
// Words already strung on this page. Two strands reading FEARLESS in the same
// screenful is the moment the desk stops being a desk and becomes a generator,
// so a word is spent once it has been used and only comes back when the pool
// runs dry.
let usedWords = new Set();

// Draw a word that has not been strung yet on this page, refilling when the
// list is exhausted (a very long page can outlast the vocabulary).
function takeWord(r, list) {
  const fresh = list.filter((w) => !usedWords.has(w));
  const from = fresh.length ? fresh : (usedWords.clear(), list);
  const w = from[(r() * from.length) | 0];
  usedWords.add(w);
  return w;
}

function ensureContainer() {
  if (container) return container;
  container = document.createElement("div");
  container.className = "desk-scatter";
  container.setAttribute("aria-hidden", "true");
  // Sit behind the notebook (.app is z-index 1); insert before it so the DOM
  // order reads props → scatter → page.
  const app = document.querySelector(".app");
  if (app && app.parentNode) app.parentNode.insertBefore(container, app);
  else document.body.appendChild(container);
  return container;
}

// Full document height measured from the content column, NOT from scrollHeight
// (which would include the container itself and risk a feedback loop).
function pageHeight() {
  const app = document.querySelector(".app");
  if (app) return app.offsetTop + app.offsetHeight + 48;
  return document.documentElement.scrollHeight;
}

// Depth ordering. Everything is on one flat desk, so the only correct rule is
// the painter's one: whatever is LOWER on screen is nearer the viewer and paints
// last. That is what makes a pile of beads read as a pile rather than a pattern,
// and what puts the beads that spilled out of the tin in front of the tin.
// Marks sit below the whole stack, since a stain is the desk surface itself.
const zFor = (bottomY) => 1000 + clamp(Math.round(bottomY / 3), 0, 60000);

// ---------------------------------------------------------------------------
// Beads
// ---------------------------------------------------------------------------

// kind: "round" | "disc" (face up, lettered) | "blank" (face down) | "side"
// (edge-on, showing the threading hole). The edge-on variant is the single
// biggest realism win available: a disc lying on its rim has a completely
// different silhouette, and a spill where every disc landed face-up is a spill
// that never happened.
function makeBead(r, x, y, o = {}) {
  const el = document.createElement("div");
  const size = o.size != null ? o.size : rangeR(r, 17, 25);
  const rot = o.rot != null ? o.rot : rangeR(r, -180, 180);
  const kind = o.kind || rollKind(r, o);

  el.className = "bead-scatter " + (kind === "blank" ? "disc blank" : kind);
  el.style.left = x.toFixed(1) + "px";
  el.style.top = y.toFixed(1) + "px";
  el.style.setProperty("--sz", size.toFixed(1) + "px");
  el.style.setProperty("--rot", rot.toFixed(1) + "deg");
  // Shadow scales with the bead, so a big one sits visibly higher off the wood
  // than a small one. Uniform shadows are what flattened the old scatter into
  // stickers at one depth.
  el.style.setProperty("--sh", (size / 20).toFixed(2));
  el.style.zIndex = zFor(y + size / 2);

  if (kind === "round") {
    const c = o.color || pick(r, ROUND_COLORS);
    el.style.setProperty("--hi", c.hi);
    el.style.setProperty("--lo", c.lo);
    el.style.setProperty("--edge", c.edge);
    el.style.setProperty("--hole", c.hole);
  } else if (kind === "disc") {
    const span = document.createElement("span");
    span.textContent = o.glyph || pick(r, LOOSE_GLYPHS);
    el.appendChild(span);
  }
  stats.beads++;
  return el;
}

// Kind mix, weighted toward the coloured rounds. All three disc states are
// cream, and cream reads far louder against blonde oak than the muted era
// colours do, so an even split by COUNT is nowhere near an even split by
// attention: at 45% discs the wood looked like it had been salted.
function rollKind(r, o) {
  const roll = r();
  if (o.faceUp) return roll < 0.72 ? "disc" : roll < 0.88 ? "round" : "side";
  if (roll < 0.58) return "round";
  if (roll < 0.75) return "disc";
  if (roll < 0.89) return "side";
  return "blank";
}

// One tin of beads is one tin of beads: an incident draws from two or three
// colours, not all six. The old scatter picked uniformly from the whole palette
// every time, which is why every blob looked like every other blob.
function paletteFor(r) {
  const pool = ROUND_COLORS.slice();
  const n = 2 + ((r() * 2) | 0);
  const out = [];
  for (let i = 0; i < n; i++) out.push(pool.splice((r() * pool.length) | 0, 1)[0]);
  return out;
}

// ---------------------------------------------------------------------------
// Incidents. Each places itself into `frag` and returns the vertical extent it
// used, so the walk can advance past it rather than through it.
// ---------------------------------------------------------------------------

// A tin went over. Beads stream from a source point along an axis, densest at
// the mouth and thinning with distance, with a handful of rollers that carried
// much further along the same line. That gradient IS the incident: a spill you
// draw as an even cloud is just a cloud.
function incSpill(frag, r, band, y, opts) {
  const bw = band[1] - band[0];
  const pal = paletteFor(r);
  const outward = band.side === 0 ? -1 : 1; // spill away from the paper
  // Always downward, leaning outward. Kept off the vertical so the fan has a
  // direction to read; kept off the horizontal so it does not run out of gutter.
  const dx = outward * rangeR(r, 0.18, 0.8);
  const dy = rangeR(r, 0.6, 1);
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  const axisDeg = Math.atan2(Math.abs(dx), dy) * 180 / Math.PI;

  // The source sits inboard of where the incident was asked for, so the fan has
  // room to run outward. Reach is capped by the gutter it has to live in.
  const reach = clamp(bw * 0.8, 150, 290);
  const sx = clamp(opts.cx - outward * bw * 0.18, band[0] + 24, band[1] - 24);
  const sy = y + 26;

  // The cause, at the source, mouth pointing down the axis. Without it the
  // beads are unexplained again, which was the original sin.
  let tinH = 0;
  if (opts.allowProp && chance(r, 0.62)) {
    const tin = DESK_PROPS.find((p) => p.id === "tin");
    const scale = clamp(bw / 200, 0.62, 1);
    const w = tin.w * scale, h = tin.h * scale;
    const mirror = outward < 0;
    const tilt = axisDeg - 35;
    const el = propEl(tin, w, h);
    // The tin is drawn pouring down-right; mirroring it serves the left gutter,
    // and the rotate then runs in the mirrored frame, hence the sign flip.
    el.style.left = sx.toFixed(1) + "px";
    el.style.top = (sy - h * 0.34).toFixed(1) + "px";
    el.style.transform = `translate(-50%, -50%) scaleX(${mirror ? -1 : 1}) rotate(${(mirror ? -tilt : tilt).toFixed(1)}deg)`;
    el.style.zIndex = zFor(sy - h * 0.34 + h / 2);
    frag.appendChild(el);
    tinH = h * 0.5;
    stats.props++;
  }

  const n = 15 + ((r() * 13) | 0);
  let maxY = sy;
  for (let i = 0; i < n; i++) {
    // t^1.7 crowds beads toward the mouth; the lateral spread opens with t, so
    // the whole thing is a fan rather than a tube.
    const t = Math.pow(r(), 1.7);
    const d = t * reach;
    const lat = (r() * 2 - 1) * (7 + t * 40);
    const bx = sx + ux * d - uy * lat;
    const by = sy + uy * d + ux * lat * 0.5;
    if (!inBand(band, bx)) continue;
    frag.appendChild(makeBead(r, bx, by, { color: pick(r, pal) }));
    if (by > maxY) maxY = by;
  }
  // The rollers: two to four that kept going. These are what sell a spill,
  // because a bead that stops where its neighbours stopped is a bead someone
  // placed. Same axis, barely any lateral, well past the fan.
  const rollers = 2 + ((r() * 3) | 0);
  for (let i = 0; i < rollers; i++) {
    const d = reach * rangeR(r, 1.15, 2.3);
    const lat = (r() * 2 - 1) * 14;
    const bx = sx + ux * d - uy * lat;
    const by = sy + uy * d + ux * lat * 0.5;
    if (!inBand(band, bx)) continue;
    frag.appendChild(makeBead(r, bx, by, { color: pick(r, pal) }));
    if (by > maxY) maxY = by;
  }
  return Math.max(maxY - y, tinH) + 30;
}

// A part-strung strand, put down mid-bracelet. This is the incident that makes
// every loose bead elsewhere on the page read as bracelet-making rather than
// litter, and a long curved line is also exactly what a narrow gutter wants.
// The beads here are threaded, so they are evenly spaced, square to the cord,
// and they spell something.
function incStrand(frag, r, band, y, opts) {
  const bw = band[1] - band[0];
  const word = takeWord(r, bw > 150 ? WORDS_LONG : WORDS_SHORT).replace(/ /g, "");
  const n = Math.min(word.length, 11);
  const len = rangeR(r, 190, 280);

  // A cubic that leans one way and comes back: floss dropped in a lazy S, never
  // a clean arc.
  const cx = opts.cx;
  const swing = rangeR(r, 40, Math.max(46, Math.min(96, bw * 0.38))) * (chance(r, 0.5) ? 1 : -1);
  const p0 = { x: clamp(cx - swing * 0.7, band[0] + 16, band[1] - 16), y: y + 10 };
  const p3 = { x: clamp(cx + swing * 0.5, band[0] + 16, band[1] - 16), y: y + 10 + len };
  const p1 = { x: clamp(cx + swing, band[0] + 10, band[1] - 10), y: y + 10 + len * 0.3 };
  const p2 = { x: clamp(cx - swing * 0.9, band[0] + 10, band[1] - 10), y: y + 10 + len * 0.72 };

  // The thread. Two strokes: a dark under-pass and the colour on top, so it
  // reads as a round cord and not a drawn line. The bare ends past the last
  // bead are the tag ends every part-strung bracelet has.
  const pad = 30;
  const minX = Math.min(p0.x, p1.x, p2.x, p3.x) - pad;
  const maxX = Math.max(p0.x, p1.x, p2.x, p3.x) + pad;
  const boxH = len + 20 + pad * 2;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "scatter-thread");
  svg.setAttribute("width", (maxX - minX).toFixed(1));
  svg.setAttribute("height", boxH.toFixed(1));
  svg.setAttribute("viewBox", `${minX.toFixed(1)} ${(y - pad).toFixed(1)} ${(maxX - minX).toFixed(1)} ${boxH.toFixed(1)}`);
  svg.style.left = minX.toFixed(1) + "px";
  svg.style.top = (y - pad).toFixed(1) + "px";
  svg.style.zIndex = zFor(y + len * 0.5);
  const d = `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}`;
  const floss = pick(r, FLOSS);
  for (const [stroke, width, op] of [["#5a4a2e", 3.4, 0.35], [floss, 2.2, 0.95]]) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", stroke);
    path.setAttribute("stroke-width", String(width));
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("opacity", String(op));
    svg.appendChild(path);
  }
  frag.appendChild(svg);

  // Beads threaded along the middle of the run, leaving the tag ends bare.
  const t0 = 0.1, t1 = 0.9;
  for (let i = 0; i < n; i++) {
    const t = t0 + (t1 - t0) * (n === 1 ? 0.5 : i / (n - 1));
    const p = bezAt(p0, p1, p2, p3, t);
    const tan = bezTan(p0, p1, p2, p3, t);
    // A threaded disc lies square to the cord, so its rotation follows the
    // tangent rather than spinning freely. That regularity is the tell that
    // these ones are strung and the loose ones are not.
    const rot = Math.atan2(tan.y, tan.x) * 180 / Math.PI - 90 + rangeR(r, -7, 7);
    frag.appendChild(makeBead(r, p.x, p.y, {
      kind: "disc", glyph: word[i], rot, size: rangeR(r, 19, 22),
    }));
  }
  return len + 40;
}

// Sorted by colour while working: four to six of ONE colour lined up, spacing
// irregular because a hand did it. The only incident on the desk with an obvious
// human intention behind it, which is why it needs the messier ones around it.
function incRow(frag, r, band, y, opts) {
  const c = pick(r, ROUND_COLORS);
  const n = 4 + ((r() * 3) | 0);
  const spellIt = chance(r, 0.45);
  const word = spellIt ? takeWord(r, WORDS_SHORT).replace(/ /g, "") : "";
  const tilt = rangeR(r, -26, 26) * Math.PI / 180;
  const step = rangeR(r, 21, 27);
  const runW = Math.abs(Math.cos(tilt)) * step * (n - 1) * 1.24;
  const sx = clamp(opts.cx - runW / 2, band[0] + 14, Math.max(band[0] + 14, band[1] - runW - 14));
  const sy = y + 14;
  let maxY = sy;
  let gap = 0;
  for (let i = 0; i < n; i++) {
    gap += step * rangeR(r, 0.82, 1.24); // hand-laid, not measured
    const bx = sx + Math.cos(tilt) * gap;
    const by = sy + Math.sin(tilt) * gap;
    if (!inBand(band, bx)) continue;
    frag.appendChild(makeBead(r, bx, by, spellIt && word[i]
      ? { kind: "disc", glyph: word[i], rot: rangeR(r, -14, 14) }
      : { kind: "round", color: c }));
    if (by > maxY) maxY = by;
  }
  return maxY - y + 34;
}

// Beads swept together, or set down in a handful. A loose pile: an ellipse at
// some angle (never a circle, which is what made the old blobs read as smudges)
// and packing close enough that beads TOUCH. Real beads rest against each other.
function incHandful(frag, r, band, y, opts) {
  const bw = band[1] - band[0];
  const pal = paletteFor(r);
  const n = 5 + ((r() * 8) | 0);
  const ang = rangeR(r, 0, Math.PI);
  const ra = rangeR(r, 26, Math.max(28, Math.min(52, bw * 0.34)));
  const rb = ra / rangeR(r, 1.5, 2.7);
  const cx = clamp(opts.cx, band[0] + ra + 6, Math.max(band[0] + ra + 6, band[1] - ra - 6));
  const cy = y + ra * 0.7 + 12;

  const placed = [];
  let maxY = cy;
  for (let i = 0; i < n; i++) {
    const size = rangeR(r, 17, 25);
    let bx = cx, by = cy;
    // Rejection-sample for a bit of breathing room, then give up and let it land
    // touching. The giving-up is the point: perfect spacing is the flaw.
    for (let tries = 0; tries < 14; tries++) {
      const u = Math.sqrt(r());
      const a = r() * Math.PI * 2;
      const lx = Math.cos(a) * ra * u, ly = Math.sin(a) * rb * u;
      bx = cx + lx * Math.cos(ang) - ly * Math.sin(ang);
      by = cy + lx * Math.sin(ang) + ly * Math.cos(ang);
      const ok = placed.every((p) => Math.hypot(p.x - bx, p.y - by) > (p.size + size) * 0.5 * 0.66);
      if (ok) break;
    }
    if (!inBand(band, bx)) continue;
    placed.push({ x: bx, y: by, size });
    frag.appendChild(makeBead(r, bx, by, { size, color: pick(r, pal) }));
    if (by > maxY) maxY = by;
  }
  return maxY - y + 30;
}

// One that got away. Alone in a lot of empty wood, sitting a little prouder off
// the desk (a longer, softer shadow) because nothing is crowding it. A single
// bead in a void does more for the illusion than another cluster would.
function incStray(frag, r, band, y, opts) {
  const n = chance(r, 0.72) ? 1 : 2;
  let maxY = y;
  for (let i = 0; i < n; i++) {
    const bx = clamp(opts.cx + rangeR(r, -46, 46), band[0] + 12, band[1] - 12);
    const by = y + 14 + i * rangeR(r, 34, 90);
    const el = makeBead(r, bx, by, { size: rangeR(r, 18, 24) });
    el.classList.add("lonely");
    frag.appendChild(el);
    if (by > maxY) maxY = by;
  }
  return maxY - y + 26;
}

// `lead: false` marks an incident that may not OPEN a group. A stray is one
// bead alone in a void, and it only reads as "this one rolled away" when there
// is something nearby for it to have rolled away FROM. Left free to open a
// group it becomes a speck of grit in the middle of nowhere, which is most of
// what made the old scatter look like dirt on the lens.
const INCIDENTS = {
  spill: { fn: incSpill, weight: 16, minBand: 130 },
  strand: { fn: incStrand, weight: 16, minBand: 110 },
  row: { fn: incRow, weight: 14, minBand: 100 },
  handful: { fn: incHandful, weight: 34, minBand: 90 },
  stray: { fn: incStray, weight: 12, minBand: 66, lead: false },
};

// Cubic bezier point and tangent, for threading beads onto the strand.
function bezAt(p0, p1, p2, p3, t) {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}
function bezTan(p0, p1, p2, p3, t) {
  const u = 1 - t, a = 3 * u * u, b = 6 * u * t, c = 3 * t * t;
  return { x: a * (p1.x - p0.x) + b * (p2.x - p1.x) + c * (p3.x - p2.x),
           y: a * (p1.y - p0.y) + b * (p2.y - p1.y) + c * (p3.y - p2.y) };
}

// ---------------------------------------------------------------------------
// Props and marks
// ---------------------------------------------------------------------------

function propEl(prop, w, h) {
  const el = document.createElement("div");
  el.className = "desk-drop dp-" + prop.id;
  el.style.width = w.toFixed(1) + "px";
  el.style.height = h.toFixed(1) + "px";
  el.innerHTML = `<svg viewBox="0 0 ${prop.w} ${prop.h}" xmlns="http://www.w3.org/2000/svg">${prop.svg}</svg>`;
  return el;
}

// Props are rationed to roughly one per screenful, and drawn from a shuffled bag
// so a page works through the whole set before anything repeats. A gutter that
// shows the same object twice in one scroll stops being a desk.
function placeProp(frag, r, band, y, bag) {
  const bw = band[1] - band[0];
  const usable = bag.filter((p) => bw >= 200 || p.narrow);
  if (!usable.length) return 0;
  const prop = usable[(r() * usable.length) | 0];
  bag.splice(bag.indexOf(prop), 1);

  // Shrink only as far as the gutter demands, then let the rest hang past the
  // screen edge. The fixed props already do this (half a mug off the left edge),
  // and it is what stops the desk looking like it ends at the window.
  const scale = clamp(bw / (prop.w * 1.15), 0.68, 1);
  const w = prop.w * scale, h = prop.h * scale;
  const maxRot = prop.maxRot != null ? prop.maxRot : 20;
  const rot = rangeR(r, -maxRot, maxRot);

  const half = w / 2;
  // Outboard side may overhang the window; the inboard side never touches paper.
  const lo = band.side === 0 ? EDGE - half * 0.42 : band[0] + half - 6;
  const hi = band.side === 0 ? band[1] - half + 6 : band[1] - half + half * 0.42;
  const x = lo >= hi ? (lo + hi) / 2 : rangeR(r, lo, hi);
  const cy = y + h / 2 + 10;

  const el = propEl(prop, w, h);
  el.style.left = x.toFixed(1) + "px";
  el.style.top = cy.toFixed(1) + "px";
  el.style.transform = `translate(-50%, -50%) rotate(${rot.toFixed(1)}deg)`;
  el.style.zIndex = zFor(cy + h / 2);
  frag.appendChild(el);
  stats.props++;
  return h + 26;
}

// Marks walk the page on their own, denser and dumber rhythm. They can and
// should land under incidents: a coffee ring with beads scattered across it is
// two things that happened to the same patch of desk, which is what a desk is.
function placeMarks(frag, r, bands, H, startY) {
  const W = window.innerWidth;
  // Bagged like the props rather than drawn with replacement. Picking freely
  // gave one page four full coffee rings, and the full ring is the largest mark
  // on the desk: the repeat is the first thing the eye finds.
  let mbag = DESK_MARKS.slice();
  let y = startY;
  while (y < H - 40) {
    const band = bands[(r() * bands.length) | 0];
    const bw = band[1] - band[0];
    if (bw > MIN_BAND) {
      if (!mbag.length) mbag = DESK_MARKS.slice();
      const m = mbag.splice((r() * mbag.length) | 0, 1)[0];
      const scale = clamp(bw / (m.w * 1.05), 0.55, 1.1);
      const w = m.w * scale, h = m.h * scale;
      const el = propEl(m, w, h);
      el.className = "desk-mark dm-" + m.id;
      // Marks may run off the screen edge freely; a stain does not care where
      // the window is. They never cross under the paper, though, where they
      // would just be invisible work.
      const x = clamp(rangeR(r, band[0] - w * 0.3, band[1] + w * 0.3),
                      EDGE - w * 0.45, W - EDGE + w * 0.45);
      el.style.left = x.toFixed(1) + "px";
      el.style.top = (y + h / 2).toFixed(1) + "px";
      el.style.transform = `translate(-50%, -50%) rotate(${rangeR(r, -180, 180).toFixed(1)}deg)`;
      el.style.opacity = rangeR(r, 0.5, 0.95).toFixed(2);
      frag.appendChild(el);
      stats.marks++;
    }
    y += rangeR(r, 230, 640) * densityMult;
  }
}

// ---------------------------------------------------------------------------
// The walk
// ---------------------------------------------------------------------------

function chooseIncident(r, bw, canLead) {
  if (onlyType) return INCIDENTS[onlyType] ? onlyType : "handful";
  const pool = Object.keys(INCIDENTS)
    .filter((k) => INCIDENTS[k].minBand <= bw && (canLead || INCIDENTS[k].lead !== false));
  if (!pool.length) return null;
  let total = 0;
  for (const k of pool) total += INCIDENTS[k].weight;
  let roll = r() * total;
  for (const k of pool) { roll -= INCIDENTS[k].weight; if (roll <= 0) return k; }
  return pool[pool.length - 1];
}

function rebuild() {
  const el = ensureContainer();
  stats = { beads: 0, props: 0, marks: 0, incidents: 0 };
  usedWords = new Set();
  if (!DESKTOP.matches) { el.replaceChildren(); el.style.height = "0px"; return; }

  const W = window.innerWidth;
  const H = pageHeight();
  const VH = window.innerHeight;
  el.style.height = H + "px";
  el.classList.toggle("dbg", debugBands);

  const cx = W / 2;
  const leftBand = [EDGE, cx - HALF - PAPER_GAP]; leftBand.side = 0;
  const rightBand = [cx + HALF + PAPER_GAP, W - EDGE]; rightBand.side = 1;
  const bands = [leftBand, rightBand].filter((b) => b[1] - b[0] > MIN_BAND);
  if (!bands.length) { el.replaceChildren(); return; }

  const r = makeRng(seed);
  const frag = document.createDocumentFragment();

  // Start below the first screenful so we never collide with the fixed props.
  const startY = VH * 0.98 + rangeR(r, 30, 120);

  if (debugBands) {
    for (const b of bands) {
      const g = document.createElement("div");
      g.className = "scatter-band";
      g.style.left = b[0] + "px";
      g.style.width = (b[1] - b[0]) + "px";
      g.style.top = startY + "px";
      g.style.height = Math.max(0, H - startY) + "px";
      frag.appendChild(g);
    }
  }

  if (showMarks) placeMarks(frag, r, bands, H, startY + rangeR(r, -180, 120));

  // A bag of props, refilled when it runs dry, so a long page cycles the whole
  // set before repeating anything. The tin is held out of it: the tin is a
  // spill's cause, placed by incSpill at the mouth of the fan, and letting it
  // also turn up on its own made it the one object you saw three times a page.
  let bag = DESK_PROPS.filter((p) => p.id !== "tin");
  // Props are rationed across the WHOLE desk rather than per gutter, so the two
  // walks below cannot each place one at the same height and hand you two
  // objects in one glance.
  const propYs = [];
  const propAllowed = (y) => propYs.every((p) => Math.abs(p - y) > VH * 0.7);

  // Each gutter walks the page on its own. The first version ran one shared walk
  // and alternated sides, which is why it read as a metronome and why a wide
  // gutter got no more life than a narrow one: a single y cursor can only put
  // one thing at a time on a strip of desk that is 450px wide and thousands
  // long. Two independent walks have no rhythm between them to notice, and each
  // one's density can answer to the width it actually has.
  for (const band of bands) {
    const bw = band[1] - band[0];
    // Wide gutter, more per group: the budget follows the area, not the height.
    const roomy = clamp(bw / 260, 0.7, 1.7);
    let y = startY + rangeR(r, 0, 260);

    while (y < H - 90 && stats.beads < BEAD_CAP) {
      // --- one group: a busy patch, a few things from the same moment ---
      const members = Math.max(1, Math.round(rangeR(r, 1.4, 3.6) * roomy));

      for (let i = 0; i < members && y < H - 90; i++) {
        // Spread across the full width of the gutter. Everything used to be laid
        // out around the band's centre line, which quietly turned a 450px strip
        // of desk into a 100px column with empty margins either side of it.
        const cx = rangeR(r, band[0] + 26, band[1] - 26);

        if (showProps && propAllowed(y) && chance(r, 0.42)) {
          if (!bag.length) bag = DESK_PROPS.filter((p) => p.id !== "tin");
          const used = placeProp(frag, r, band, y, bag);
          if (used) {
            propYs.push(y);
            y += used + rangeR(r, 40, 130) * densityMult;
            continue;
          }
        }

        const type = chooseIncident(r, bw, i > 0);
        if (!type) break;
        const used = INCIDENTS[type].fn(frag, r, band, y, { allowProp: showProps, cx });
        stats.incidents++;
        // Short gap inside a group: these things are near each other because
        // they are part of the same moment.
        y += used * rangeR(r, 0.35, 0.8) + rangeR(r, 20, 120) * densityMult;
      }

      // --- then the void. Bare wood is what makes everything above it read as
      // an incident rather than as wallpaper, so it is generous. It is also the
      // number to reach for first if this ever feels too busy or too bare. ---
      y += rangeR(r, 200, 620) * densityMult;
    }
  }

  el.replaceChildren(frag);
}

// ---- lifecycle: rebuild on load, resize, and any content-height change -----
// Debounced with a plain timeout (not rAF, which pauses in throttled/hidden
// tabs) so bursts during screen navigation coalesce into one rebuild.
let debounce = 0;
function schedule() {
  clearTimeout(debounce);
  debounce = setTimeout(rebuild, 90);
}

function start() {
  ensureContainer();
  rebuild();
  window.addEventListener("resize", schedule);
  // The game fires this on every screen change (see showScreen in app.js), the
  // most common page-height change.
  window.addEventListener("deskscatter:refresh", schedule);
  // List growth within a screen (expanding sections, etc.) has no event; watch
  // the content column. Our own mutations only touch the sibling container, so
  // this can't loop.
  const app = document.querySelector(".app");
  if (app && "ResizeObserver" in window) new ResizeObserver(schedule).observe(app);
  if (DESKTOP.addEventListener) DESKTOP.addEventListener("change", schedule);
  else if (DESKTOP.addListener) DESKTOP.addListener(schedule);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

// Dev handle (read by buildDevApi → the ?dev panel). Purely cosmetic controls.
window.__deskScatter = {
  rebuild,
  reseed: (n) => { seed = (n == null ? (Math.random() * 0xffffffff) : n) >>> 0; rebuild(); return seed; },
  density: (m) => { densityMult = clamp(+m || 1, 0.3, 3); rebuild(); return densityMult; },
  count: () => stats.beads,
  stats: () => ({ ...stats }),
  // Restrict the walk to one incident type, to judge it on its own.
  only: (t) => { onlyType = t in INCIDENTS ? t : ""; rebuild(); return onlyType || "all"; },
  types: () => Object.keys(INCIDENTS),
  props: (on) => { showProps = on == null ? !showProps : !!on; rebuild(); return showProps; },
  marks: (on) => { showMarks = on == null ? !showMarks : !!on; rebuild(); return showMarks; },
  // Outlines the gutter bands and tints each layer, so it is obvious whether a
  // bare stretch is a deliberate void or a placement bug.
  debug: (on) => { debugBands = on == null ? !debugBands : !!on; rebuild(); return debugBands; },
  // Every mark, every prop and every incident type once, in order, ignoring the
  // rhythm. The QA view: judge the drawings without the composition in the way.
  showcase: () => {
    const el = ensureContainer();
    const W = window.innerWidth, cx = W / 2;
    const leftBand = [EDGE, cx - HALF - PAPER_GAP]; leftBand.side = 0;
    const rightBand = [cx + HALF + PAPER_GAP, W - EDGE]; rightBand.side = 1;
    const r = makeRng(seed);
    const frag = document.createDocumentFragment();
    stats = { beads: 0, props: 0, marks: 0, incidents: 0 };
    usedWords = new Set();
    let y = window.innerHeight * 0.35, side = 0;
    const put = (node, band, h) => {
      node.style.left = ((band[0] + band[1]) / 2).toFixed(1) + "px";
      node.style.top = (y + h / 2).toFixed(1) + "px";
      node.style.transform = "translate(-50%, -50%)";
      node.style.zIndex = zFor(y + h);
      frag.appendChild(node);
      y += h + 70; side = 1 - side;
    };
    for (const m of DESK_MARKS) {
      const e = propEl(m, m.w, m.h); e.className = "desk-mark dm-" + m.id;
      put(e, side ? rightBand : leftBand, m.h);
      stats.marks++;
    }
    for (const p of DESK_PROPS) {
      put(propEl(p, p.w, p.h), side ? rightBand : leftBand, p.h);
      stats.props++;
    }
    for (const t of Object.keys(INCIDENTS)) {
      const band = side ? rightBand : leftBand;
      y += INCIDENTS[t].fn(frag, r, band, y, { allowProp: true, cx: (band[0] + band[1]) / 2 }) + 80;
      side = 1 - side;
    }
    el.style.height = (y + 240) + "px";
    el.replaceChildren(frag);
    return { ...stats };
  },
};
