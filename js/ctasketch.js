/* The start button, sketched in charcoal: the Mastery page's start-button words (labelTape in
   js/rewardboard.js) are each drawn as the button itself, roughed out on the page with no colour.
   Pure and state-free like passport.js: a label in, an SVG string out, seeded off its slot so a
   redraw never re-sketches it. Designed on scripts/mastery/words-board.html (option E).

   Three strokes and no more: one loop round the button whose ends just cross, then the drop
   shadow pressed in as a single heavy edge along the bottom and up the right. More passes were
   tried (a second line per side overshooting the corners, a hurried extra touch, construction
   lines running off the ends, a curved grey shading sweep) and every one of them read as mess,
   so do not add them back. Fewer, fatter lines are what read as a sketch.

   The grain is streaked ALONG each stroke, the way a dry stick drags, which one turbulence cannot
   do in two directions: so the segments are sorted by which way they run and drawn under one of
   two filters (#ctaSkH, #ctaSkV, with #ctaSkText for the words, in index.html's shared defs).

   Geometry is the real button's, scaled by `scale`: 18px side padding, 17px bold type with 1px
   tracking, 51px tall, a 3px offset shadow. The width is sized to the words, as the real button
   would be without its 280px minimum. Courier Prime is monospaced at 0.6em an advance, which is
   what lets the width be worked out here without measuring the type on a canvas. */
import { CTA_MARKS } from "./config.js";

const f = (v) => +v.toFixed(2);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// mulberry32: a fixed sequence per seed
const rng = (seed) => () => {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const seg = (bin, p, q, w) => bin[Math.abs(q[0] - p[0]) >= Math.abs(q[1] - p[1]) ? "h" : "v"]
  .push(`<path d="M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}" stroke-width="${f(w)}"/>`);

// One tapered stroke from a to b, bowed a little, laid down as short round-capped segments whose
// width swells in the middle and lifts off at both ends, with pressure that wanders.
function stroke(R, bin, a, b, base, bow) {
  const n = 16;
  const nx = -(b[1] - a[1]), ny = b[0] - a[0], len = Math.hypot(nx, ny) || 1;
  const bend = (R() * 2 - 1) * bow, wob = R() * 6;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, s = Math.sin(Math.PI * t) * bend + Math.sin(t * 9 + wob) * .3;
    return [a[0] + (b[0] - a[0]) * t + nx / len * s, a[1] + (b[1] - a[1]) * t + ny / len * s];
  });
  const lift = .25 + R() * .4;
  for (let i = 0; i < n; i++) {
    const t = (i + .5) / n;
    seg(bin, pts[i], pts[i + 1], base * (lift + (1 - lift) * Math.pow(Math.sin(Math.PI * t), .5)) * (.75 + R() * .5));
  }
}
// The outline: one loop without lifting, from partway along the top, a little more than once
// round so the ends cross, corners eased by the wrist, pressing harder on the shadow side.
function loop(R, bin, x0, y0, x1, y1, base) {
  const r = 4.5, W = x1 - x0, H = y1 - y0, per = 2 * (W + H);
  const at = (d) => {
    d = ((d % per) + per) % per;
    if (d < W) return [x0 + d, y0];
    if (d < W + H) return [x1, y0 + d - W];
    if (d < 2 * W + H) return [x1 - (d - W - H), y1];
    return [x0, y1 - (d - 2 * W - H)];
  };
  const start = W * (.15 + R() * .5), span = per * (1.02 + R() * .02), n = 120;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const d = start + span * i / n, p = at(d), pa = at(d - r), pb = at(d + r), drift = (i / n) * .7;
    pts.push([(p[0] + pa[0] + pb[0]) / 3 + Math.sin(i * .37) * .3 + drift * .3, (p[1] + pa[1] + pb[1]) / 3 + Math.cos(i * .29) * .3 + drift]);
  }
  for (let i = 0; i < n; i++) {
    const t = (i + .5) / n, [px, py] = pts[i];
    const side = (py > y1 - 2 || px > x1 - 2) ? 1.35 : 1;
    const taper = Math.min(1, t / .06, (1 - t) / .1);
    seg(bin, pts[i], pts[i + 1], base * side * (.35 + .65 * taper) * (.8 + R() * .4));
  }
}

// `label` is { text, mark } (mark a CTA_MARKS id, or "" for none); `k` its slot, which seeds it.
// `blank` draws the outline with no words in it, for words still owed.
export function ctaSketch(label, k, { scale = .66, blank = false } = {}) {
  const R = rng(k * 7919 + 13);
  const fs = 17 * scale, track = scale;
  const mw = label.mark ? 28 * scale : 0, tw = label.text.length * (fs * .6 + track);
  const W = mw + tw + 36 * scale, H = 51 * scale, M = 8, S = 3 * scale;
  const x0 = M, y0 = M, x1 = M + W, y1 = M + H;
  const bin = { h: [], v: [] };
  loop(R, bin, x0, y0, x1, y1, 2.8);
  stroke(R, bin, [x0 + S + 4, y1 + S + .3], [x1 + S + (2 + R() * 4) * .4, y1 + S], 3.4, .6);
  stroke(R, bin, [x1 + S + .3, y0 + S + 4], [x1 + S, y1 + S], 3.1, .4);
  const gx = x0 + W / 2 - (mw + tw) / 2;
  const words = blank ? "" : `<g filter="url(#ctaSkText)">` +
    (label.mark ? `<svg class="ls-mk" x="${f(gx - 2 * scale)}" y="${f(y0 + H / 2 - 12 * scale)}" width="${f(24 * scale)}" height="${f(24 * scale)}" viewBox="0 0 24 24">${(CTA_MARKS[label.mark] || "").replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>` : "") +
    `<text class="ls-tx" x="${f(gx + mw)}" y="${f(y0 + H / 2 + 5.6 * scale)}" font-size="${f(fs)}" letter-spacing="${f(track)}">${esc(label.text)}</text></g>`;
  const vw = W + 2 * M + S, vh = H + 2 * M + S;
  return `<svg class="ls-sk" viewBox="0 0 ${f(vw)} ${f(vh)}" width="${f(vw)}" height="${f(vh)}" aria-hidden="true">` +
    `<rect class="ls-face" x="${x0}" y="${y0}" width="${f(W)}" height="${f(H)}"/>` +
    `<g class="ls-ln" filter="url(#ctaSkH)">${bin.h.join("")}</g><g class="ls-ln" filter="url(#ctaSkV)">${bin.v.join("")}</g>${words}</svg>`;
}
