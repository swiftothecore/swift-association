/* Filling in a printed shape with a ballpoint: the lozenges on Form 13 and the hearts for lives.

   Nobody fills in two bubbles the same way, but nobody fills them in at random either. A hand has
   a HABIT (the way it usually goes about it) and lapses from it now and then, and every fill also
   varies in the continuous things: how hard the pen pressed, how tight the passes are, whether a
   sliver of paper was left at one end, how far it ran over the printed edge and where the pen
   flicked off when it lifted. So the fill is two draws:

     1. the technique, from a weighted set in which the hand's habit counts several times over;
     2. the parameters, each its own seeded number.

   Five techniques, all things people actually do on answer sheets:
     zig    up-and-down strokes marching along the long side
     rows   back-and-forth passes along the long side, three or four of them
     diag   the zig laid over at a slant
     spiral round and round, working inwards
     ring   the edge traced first, then the middle scribbled in

   Everything is seeded, so a bubble is drawn the same way every time the form is rendered. The
   seed for a fill is the lever and value it marks, so changing an answer gives a new fill, and
   changing it back gives the old one back. */

export function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return () => { h = (h + 0x6D2B79F5) >>> 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const f1 = (n) => n.toFixed(2).replace(/\.?0+$/, "");

export const TECHNIQUES = ["zig", "rows", "diag", "spiral", "ring"];
// how likely each technique is as a lapse (and so how common each habit looks across hands)
const BASE_WEIGHT = { zig: 3, rows: 3, diag: 2, spiral: 1.4, ring: 1 };
// how often a hand does it its usual way; the rest of the time it lapses into another
const HABIT_SHARE = 0.68;

// A hand: which technique it reaches for, and its own baseline pressure and neatness.
export function handFrom(seed) {
  const r = rng("hand:" + seed);
  const habit = TECHNIQUES[Math.floor(r() * TECHNIQUES.length)];
  return { habit, pressure: 0.85 + r() * 0.35, neat: 0.35 + r() * 0.6 };
}

function pickTechnique(hand, r) {
  if (r() < HABIT_SHARE) return hand.habit;
  const others = TECHNIQUES.filter((t) => t !== hand.habit);
  let x = r() * others.reduce((a, t) => a + BASE_WEIGHT[t], 0);
  for (const t of others) { x -= BASE_WEIGHT[t]; if (x <= 0) return t; }
  return others[0];
}

/* fill(box, hand, seed) -> { technique, d (clipped scribble), tail (unclipped flick), width }
   box: { x, y, w, h } of the printed shape in its own viewBox units. */
export function fill(box, hand, seed, force) {
  const r = rng("fill:" + seed);
  const j = (a) => (r() - 0.5) * a;
  const technique = force || pickTechnique(hand, r);
  const { x, y, w, h } = box;
  const sloppy = 1 - hand.neat;                       // 0 neat .. ~0.65 careless
  const width = (1.75 + r() * 0.6) * hand.pressure * Math.min(1.2, Math.max(0.75, h / 11));
  // a sliver left unfilled at one end, sometimes; more often by a careless hand
  const sliver = r() < 0.18 + sloppy * 0.35 ? 1.5 + r() * 2.5 : 0;
  const sliverAtStart = r() < 0.5;
  const over = 0.4 + r() * (0.8 + sloppy * 1.6);      // how far strokes run past the print
  const pts = [];
  const P = (px, py) => pts.push([px, py]);

  if (technique === "zig" || technique === "diag") {
    // passes mostly overlap, but a careless or quick hand leaves slivers of paper between them
    const pitch = width * (0.6 + r() * 0.38) * (1 + sloppy * 0.28);
    const slant = technique === "diag" ? (2.2 + r() * 2.6) * (r() < 0.75 ? 1 : -1) * (h / 11) : j(0.8);
    let px = x + 0.3 + (sliverAtStart ? sliver : 0) - Math.max(0, slant);
    const end = x + w - 0.3 - (sliverAtStart ? 0 : sliver) - Math.min(0, slant);
    let down = r() < 0.5;
    P(px, down ? y - over * 0.5 : y + h + over * 0.5);
    while (px < end) {
      px += pitch + j(pitch * 0.35);
      const top = y - over + j(over * 0.8), bot = y + h + over + j(over * 0.8);
      P(px + (down ? slant : 0), down ? bot : top);
      down = !down;
    }
  } else if (technique === "rows") {
    const n = Math.max(3, Math.round(h / (width * 0.92)) + (r() < 0.35 ? 1 : 0));
    let ltr = r() < 0.75;
    for (let i = 0; i < n; i++) {
      const py = y + 0.6 + ((h - 1.2) * (i + 0.5)) / n + j(0.9);
      const a = x - over + j(over) + (ltr && i === 0 && sliverAtStart ? sliver : 0);
      const b = x + w + over + j(over) - (!ltr && i === 0 && !sliverAtStart ? sliver : 0);
      if (ltr) { P(a, py + j(0.6)); P(x + w * 0.5 + j(2), py + j(0.9)); P(b, py + j(0.6)); }
      else { P(b, py + j(0.6)); P(x + w * 0.5 + j(2), py + j(0.9)); P(a, py + j(0.6)); }
      ltr = !ltr;
    }
  } else if (technique === "spiral") {
    const cx = x + w / 2 + j(w * 0.08), cy = y + h / 2 + j(h * 0.08);
    // enough turns that the rings overlap: the spacing between them stays under the nib's width
    const turns = (Math.min(w, h) / 2 / (width * 0.62)) * (0.95 + r() * 0.3), steps = Math.round(turns * 16);
    const rx0 = w / 2 + over * 0.6, ry0 = h / 2 + over * 0.6;
    const start = r() * Math.PI * 2, dir = r() < 0.7 ? 1 : -1;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, a = start + dir * t * turns * Math.PI * 2;
      const k = 1 - t * (0.86 + r() * 0.05);
      P(cx + Math.cos(a) * rx0 * k + j(0.5), cy + Math.sin(a) * ry0 * k + j(0.5));
    }
  } else { // ring: trace the edge, then scribble the middle
    const cx = x + w / 2, cy = y + h / 2;
    const rx = w / 2 - width * 0.35, ry = h / 2 - width * 0.35;
    const start = -2.4 + j(0.8), sweep = Math.PI * 2 + 0.3 + r() * 0.5;
    for (let i = 0; i <= 22; i++) {
      const a = start + (sweep * i) / 22, sq = Math.abs(Math.cos(a)) ** 0.6 * Math.sign(Math.cos(a));
      P(cx + sq * rx + j(0.4), cy + Math.sin(a) * ry + j(0.4));
    }
    // then the middle, quick passes laid close enough to meet the ring; a careless hand lets
    // a thread of paper show here and there, but the bubble always reads as filled
    const inset = width * (0.3 + sloppy * 0.35);
    let ltr = r() < 0.5;
    const rows = Math.max(2, Math.ceil((h - 2 * inset) / (width * 0.8)));
    for (let i = 0; i < rows; i++) {
      const py = y + inset + ((h - 2 * inset) * (i + 0.5)) / rows + j(0.6);
      const a = x + inset + j(1), b = x + w - inset + j(1);
      P(ltr ? a : b, py); P(ltr ? b : a, py + j(0.8));
      ltr = !ltr;
    }
  }

  // The path. Back-and-forth fills are straight passes with small rounded turns: a pen turning
  // at the end of a pass reaches the edge before it turns, which a curve smoothed through the
  // turning points never does (it only gets halfway, and leaves a scalloped gap at each edge).
  // Spirals and rings are dense enough to smooth through.
  const turnR = technique === "rows" ? 1.3 : 0.7;
  let d;
  if (technique === "spiral" || technique === "ring") {
    d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += ` Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(mx)} ${f1(my)}`;
    }
    d += ` L${f1(pts[pts.length - 1][0])} ${f1(pts[pts.length - 1][1])}`;
  } else {
    d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i], [ax, ay] = pts[i - 1], [bx, by] = pts[i + 1];
      const la = Math.hypot(px - ax, py - ay) || 1, lb = Math.hypot(bx - px, by - py) || 1;
      const ra = Math.min(turnR, la / 2), rb = Math.min(turnR, lb / 2);
      d += ` L${f1(px - ((px - ax) / la) * ra)} ${f1(py - ((py - ay) / la) * ra)} Q${f1(px)} ${f1(py)} ${f1(px + ((bx - px) / lb) * rb)} ${f1(py + ((by - py) / lb) * rb)}`;
    }
    d += ` L${f1(pts[pts.length - 1][0])} ${f1(pts[pts.length - 1][1])}`;
  }
  // The lift. It leaves from the last point the ink actually shows at (pulled back inside the
  // shape's bleed), so the flick is always attached to the fill and never floats off on its own.
  const bleedOf = 0.9 + sloppy * 1.3, lim = bleedOf * 0.45;
  const clampX = (v) => Math.max(x - lim, Math.min(x + w + lim, v)), clampY = (v) => Math.max(y - lim, Math.min(y + h + lim, v));
  const raw = pts[pts.length - 1], prev = pts[pts.length - 2] || raw;
  const dx = raw[0] - prev[0], dy = raw[1] - prev[1], len = Math.hypot(dx, dy) || 1;
  // start a unit back along the last pass, so the flick overlaps the ink it comes off
  const last = [clampX(raw[0]) - (dx / len) * 1, clampY(raw[1]) - (dy / len) * 1];
  const flick = 0.8 + r() * (1.6 + sloppy * 2.2);
  const tail = `M${f1(last[0])} ${f1(last[1])} Q${f1(last[0] + (dx / len) * flick * 0.6 + j(0.8))} ${f1(last[1] + (dy / len) * flick * 0.6 + j(0.8))} ${f1(last[0] + (dx / len) * flick + j(1))} ${f1(last[1] + (dy / len) * flick + j(1))}`;
  // how far past the printed edge the ink may show: strokes that overrun by less keep their own
  // rounded ends, and only a wild one is trimmed, so the edge of the fill is never one clean line
  const bleed = bleedOf;
  return { technique, d, tail, width, bleed };
}

/* A filled-in shape must read as FILLED: a thread or a sliver of paper is fine, a stripe of it
   is not. So every fill is rasterised once and the paper left inside the printed shape is
   measured. A fill that leaves more than COVER_MIN's worth is drawn again with the same
   technique (so the hand's habit is untouched) and fresh pressure, spacing and slivers, from a
   seed derived from the first, so the redraw is as repeatable as the original. If no try
   passes, the best-covered one is kept. */
export const COVER_MIN = 0.93;
const TRIES = 12;
const coverCache = new Map();
let cv = null;
export function coverage(shape, box, f) {
  if (typeof document === "undefined") return 1;
  const S = 6, W = Math.ceil((box.x + box.w + 2) * S), H = Math.ceil((box.y + box.h + 2) * S);
  cv = cv || document.createElement("canvas");
  cv.width = W; cv.height = H;
  const c = cv.getContext("2d", { willReadFrequently: true });
  c.setTransform(S, 0, 0, S, 0, 0);
  const sp = new Path2D(shape);
  c.fillStyle = "#f00"; c.fill(sp);
  c.save(); c.clip(sp);
  c.strokeStyle = "#0f0"; c.lineWidth = f.width; c.lineCap = "round"; c.lineJoin = "round";
  c.stroke(new Path2D(f.d)); c.restore();
  const px = c.getImageData(0, 0, W, H).data;
  let inside = 0, inked = 0;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] < 128) continue;
    inside++;
    if (px[i + 1] > px[i]) inked++;
  }
  return inside ? inked / inside : 1;
}
export function filledIn(shape, box, hand, seed, force) {
  const key = shape.length + "|" + JSON.stringify(hand) + "|" + seed + "|" + (force || "");
  if (coverCache.has(key)) return coverCache.get(key);
  let best = fill(box, hand, seed, force), bestCov = coverage(shape, box, best);
  for (let n = 1; n < TRIES && bestCov < COVER_MIN; n++) {
    const f = fill(box, hand, seed + "#" + n, best.technique), cov = coverage(shape, box, f);
    if (cov > bestCov) { best = f; bestCov = cov; }
  }
  best.coverage = bestCov;
  coverCache.set(key, best);
  return best;
}

// The markup for a filled shape: the scribble masked to the shape plus its bleed, and the flick
// where the pen came off left unmasked. The caller draws the printed outline under it.
let maskN = 0;
export function penFill(shape, box, hand, seed, force) {
  const f = filledIn(shape, box, hand, seed, force), mid = "pf" + (++maskN) + Math.random().toString(36).slice(2, 5);
  return `<mask id="${mid}" maskUnits="userSpaceOnUse" x="${box.x - 6}" y="${box.y - 6}" width="${box.w + 12}" height="${box.h + 12}">` +
    `<path d="${shape}" fill="#fff" stroke="#fff" stroke-width="${f1(f.bleed * 2)}" stroke-linejoin="round"/></mask>` +
    `<path class="fill" data-fill="${f.technique}" pathLength="100" mask="url(#${mid})" stroke-width="${f1(f.width)}" d="${f.d}"/>` +
    `<path class="fill fill-tail" pathLength="100" stroke-width="${f1(f.width * 0.62)}" d="${f.tail}"/>`;
}
export const LOZENGE = { shape: "M6 1 H16 A5 5 0 0 1 16 11 H6 A5 5 0 0 1 6 1 Z", box: { x: 1, y: 1, w: 20, h: 10 }, viewBox: "0 0 22 12" };
export const HEART = { shape: "M14 24 C6.6 18.6 2.6 14.4 3.1 9.6 C3.5 5.9 6.9 3.6 10 4.3 C11.9 4.7 13.2 6 14 7.6 C14.8 5.9 16.4 4.6 18.5 4.3 C21.8 3.9 25.1 6.2 24.9 9.9 C24.7 14.4 21 18.6 14 24 Z", box: { x: 3, y: 4, w: 22, h: 20 }, viewBox: "0 0 28 26" };
