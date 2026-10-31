/* The washi tape prints, Mastery levels 1-3: polka dots, gingham and sheet music.

   A print is a PRINTED LAYER on the notebook's one tape, never a new tape. The shared rule in
   styles.css (search "Shared washi-tape surface") keeps its tint, sheen, frosted base and tears,
   and reads one more layer, --tape-print, between the sheen and the tint. applySettings sets the
   worn print's custom properties on <body> from tapeVars(), so every strip on every screen
   inherits it, and each keeps its own colour (the era on a nav card, the bead on a polaroid, the
   accent on a records tile) with the print riding on top. This module is the only copy of the
   tiles: the reward board's rolls are printed from the same layers.

   Every print is a small SVG tile in one of two inks. An image cannot read a custom property, so
   a tile cannot take --tape-color, and the inks are chosen so they don't need to:
     DARK  a neutral overprint MULTIPLIED into the strip (--tape-blend), so it lands as a deeper
           shade of whatever the tint is: deep blue on denim, deep rose on rose. Printed flat, the
           same ink went grey-brown on every colour.
     WHITE white ink on the tint. On the plain strip (a 37% tint over frosted cream) white has
           nothing to stand on, so a white print also deepens its ground with --tape-k/--tape-k2:
           the same colour, more of it, which is what a white-printed roll is.
   Each print has a night tile too. The night rule takes the frosted base down so the dark page
   shows through, and the print comes down with it, as the sheen does: a white ink at day
   strength would be the brightest thing on the night page.

   Motifs are drawn in code from fixed seeds, so nothing reshuffles between visits, and each tile
   wraps its motifs across its own edges so a strip shows no seam. Seven other prints were drawn
   and turned down on scripts/mastery/tape-board.html, whose tape-prints.js holds all ten. */

const DARK = "92, 82, 74";          // multiplied, so this is a darkening, not a colour
const WHITE = "255, 252, 244";

function rng(seed) {             // mulberry32, as the rest of the project seeds itself
  let h = seed >>> 0;
  return () => { h = (h + 0x6D2B79F5) >>> 0; let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const f = (n) => +n.toFixed(2);

// A tile's markup drawn again across each edge it crosses, so a motif cut by the right edge
// reappears at the left.
function wrapped(w, h, draw) {
  let s = "";
  for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) s += `<g transform="translate(${dx} ${dy})">${draw}</g>`;
  return s;
}
const svgTile = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
// Only what a quoted CSS url() cannot hold is escaped.
const uri = (svg) => `url("data:image/svg+xml,${svg.replace(/"/g, "'").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/#/g, "%23")}")`;

// A note head, tipped, and its stem; quavers get a beam drawn by the caller.
function note(x, y, rnd, up = true, len = 5.2) {
  const tilt = -24 + (rnd() - 0.5) * 8;
  const head = `<ellipse transform="translate(${f(x)} ${f(y)}) rotate(${f(tilt)})" rx="1.12" ry="0.8" stroke="none"/>`;
  const sx = up ? x + 0.98 : x - 0.98;
  return head + `<path d="M${f(sx)} ${f(y + (up ? -0.25 : 0.25))} L${f(sx + (rnd() - 0.5) * 0.2)} ${f(y + (up ? -len : len))}" fill="none" stroke-width="0.42"/>`;
}

// One background layer: the tile, and where it sits on the strip. `css` is the layer as the
// shared rule reads it; the rest is for the reward board's rolls, which print it in SVG.
function layer(svg, w, h, pos = "0 0", repeat = "repeat") {
  return { css: `${uri(svg)} ${pos} / ${w}px ${h}px ${repeat}`, svg, w, h, pos, repeat };
}

const MAKE = {
  // White polka dots, offset row on row, each a hair off true as a screen print gives.
  dots: { ink: "white", make: (night) => {
    const rnd = rng(31), a = night ? 0.34 : 0.92;
    const W = 16, H = 14, pts = [[2, 2], [10, 2], [6, 9], [14, 9]];
    const d = pts.map(([x, y]) => `<circle cx="${f(x + (rnd() - 0.5) * 0.4)}" cy="${f(y + (rnd() - 0.5) * 0.4)}" r="${f(1.22 + rnd() * 0.16)}"/>`).join("");
    return [layer(svgTile(W, H, `<g fill="rgba(${WHITE}, ${a})">${wrapped(W, H, d)}</g>`), W, H)];
  } },
  // Gingham: two translucent bands crossing, so the check has its three real tones, the tint
  // alone, one band over it, and both where the threads of both directions are coloured.
  gingham: { ink: "dark", make: (night) => {
    const a = night ? 0.3 : 0.34, c = night ? "0, 0, 0" : DARK, s = 6, b = 3;
    return [layer(svgTile(s, s, `<rect x="0" y="0" width="${b}" height="${s}" fill="rgba(${c}, ${a})"/><rect x="0" y="0" width="${s}" height="${b}" fill="rgba(${c}, ${a})"/>`), s, s)];
  } },
  // Sheet music: a five-line staff along the strip with a phrase on it and a bar line, laid
  // once across the strip's middle (no vertical repeat), so a taller strip gets more paper
  // either side rather than a second staff.
  music: { ink: "dark", make: (night) => {
    const rnd = rng(22), a = night ? 0.85 : 0.72, c = night ? "0, 0, 0" : DARK, W = 44, H = 14;
    const top = 3.6, gap = 1.7;
    const lines = [0, 1, 2, 3, 4].map((i) => `<path d="M0 ${f(top + i * gap)} H${W}" fill="none" stroke-width="0.4"/>`).join("");
    const y = (step) => top + 4 * gap - step * (gap / 2);    // step 0 = bottom line, 8 = top line
    const n1 = note(4.4, y(3), rnd), n4 = note(23.6, y(6), rnd, true, 4.8);
    const q1x = 10.8, q2x = 15.6, q1y = y(4), q2y = y(5), L = 5.2;
    const quavers = note(q1x, q1y, rnd) + note(q2x, q2y, rnd) +
      `<path d="M${f(q1x + 0.98)} ${f(q1y - L)} L${f(q2x + 0.98)} ${f(q2y - L)} L${f(q2x + 0.98)} ${f(q2y - L + 0.8)} L${f(q1x + 0.98)} ${f(q1y - L + 0.8)} Z" stroke="none"/>`;
    const bar = `<path d="M29.4 ${top} V${f(top + 4 * gap)}" fill="none" stroke-width="0.42"/>`;
    const n5 = note(34.4, y(2), rnd) + `<circle cx="36.2" cy="${f(y(2) - 0.2)}" r="0.34" stroke="none"/>`;
    const n6 = note(39.8, y(7), rnd, false, 4.8);
    return [layer(svgTile(W, H, `<g fill="rgba(${c}, ${a})" stroke="rgba(${c}, ${a})">${lines}${n1}${quavers}${n4}${bar}${n5}${n6}</g>`), W, H, "0 50%", "repeat-x")];
  } },
};
// The tint strengths a white ink stands on: [main, lower] by day and by night.
const GROUND = { day: [60, 50], night: [44, 36] };

export const TAPE_PRINTS = Object.fromEntries(Object.entries(MAKE).map(([id, p]) => {
  const layers = p.make(false), nightLayers = p.make(true);
  return [id, { id, ink: p.ink, layers, nightLayers, ground: p.ink === "white" ? GROUND : null }];
}));

const PROPS = ["--tape-print", "--tape-print-n", "--tape-blend", "--tape-k", "--tape-k2", "--tape-kn", "--tape-kn2"];
// The custom properties a print sets on <body>, every one of PROPS (null clears it), so
// switching prints or going back to plain never leaves a stale layer behind.
export function tapeVars(id) {
  const p = TAPE_PRINTS[id];
  const v = Object.fromEntries(PROPS.map((k) => [k, null]));
  if (!p) return v;
  v["--tape-print"] = p.layers.map((l) => l.css).join(", ");
  v["--tape-print-n"] = p.nightLayers.map((l) => l.css).join(", ");
  v["--tape-blend"] = p.layers.map(() => (p.ink === "dark" ? "multiply" : "normal")).join(", ");
  if (p.ground) {
    v["--tape-k"] = p.ground.day[0] + "%"; v["--tape-k2"] = p.ground.day[1] + "%";
    v["--tape-kn"] = p.ground.night[0] + "%"; v["--tape-kn2"] = p.ground.night[1] + "%";
  }
  return v;
}
