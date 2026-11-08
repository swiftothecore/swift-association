// The floss on the desk, dyed to match the song the beads spill.
//
// index.html draws the bracelet-making flat lay (.di-floss) in its own colours: a rose skein, a
// denim one behind it, a strand of three beads, two folded paper stars. js/beads.js picks the
// day's song and calls dye() with its album, and everything in the lay that is coloured floss,
// glass or paper star is redyed as shades of that album's era colour, so Superman's day is a
// handful of purples and an anniversary wears the record being celebrated. The heart bead in the
// spill already carries the plain era colour; this is the rest of the kit agreeing with it.
//
// HOW IT DYES. Each dyeable part is tagged in the markup with data-dye="<part>", and every hex
// fill, stroke and stop-color on or inside it is moved, not replaced. A part has an anchor (the
// colour it was drawn around) and a target (its shade of the era colour), and each colour keeps
// its own offset from the anchor in OKLCH: a strand that was a touch lighter and greener than
// its skein is still a touch lighter and greener than the new one. That is what keeps the
// hand-picked variation in the strands, the folds and the knot, and it is why the parts are
// tinted from the originals every time (kept in data-dye-*), never from whatever the last
// album left behind. The paper bands, the shadows and the lamp's highlights carry no tag and
// never change.
//
// THE SHADES. One album colour becomes seven: the front skein sits closest to it, the back skein
// a little deeper and turned along the hue, the beads and stars spread lighter and darker either
// side so the lay still reads as several things rather than one stain. Lightness is held inside
// a band first, because reputation's charcoal and Midnights' navy would sink into the wood at
// their own value, and the pale ones would vanish into the paper. folklore and reputation have
// no hue to speak of, and they come out as greys, which is what they are.
//
// No album to name (a dev spelling of a title nobody released) leaves the lay as drawn.

import { ALBUM_COLORS } from "./config.js";

const svg = document.querySelector(".di-floss svg");
const ATTRS = ["fill", "stroke", "stop-color"];
const HEX = /^#[0-9a-f]{6}$/i;

// Each part: the colour it was drawn around, and how its shade sits against the era colour
// [lightness step, chroma scale, hue turn in degrees].
const PARTS = {
  front: { from: "#c87790", shade: [0, 1, 0] },
  back:  { from: "#7190b7", shade: [-0.1, 0.85, -12] },
  bead1: { from: "#d9ab4d", shade: [0.13, 0.8, 12] },
  bead2: { from: "#7d9cc2", shade: [-0.13, 1, -8] },
  bead3: { from: "#cf7f95", shade: [0.04, 1.1, 24] },
  starA: { from: "#d3a64a", shade: [0.14, 0.78, 8] },
  starB: { from: "#d795a1", shade: [-0.04, 0.95, -24] },
};
const L_BAND = [0.52, 0.72];

// Albums the general spread doesn't suit, each fixed by eye on scripts/ui/floss-dye/board.html.
// `base` replaces the banded lightness, `lift` nudges it, `step` and `turn` scale the parts'
// lightness steps and hue turns, `hue` turns the whole set, and `parts` pins a part to its own
// [L, C, h].
// - Red: a red turned either way along the hue is salmon, orange or brown, and lightened it is
//   pink, so its shades stay close to crimson and wine, and its lightest two are pinned to a
//   clear red rather than a dusty rose.
// - reputation: the band lifted its charcoal to a mid grey; it is let down nearly to its own value.
// - Lover: its era colour sits on the purple side of pink, so the set is warmed off it and
//   barely turns, and the back skein, a bead and the small star are the pale blue that is the
//   other half of that record's palette.
// - evermore and Midnights: a touch lighter and a touch darker than the band leaves them.
const TUNE = {
  "Red": { turn: 0.2, step: 0.5, parts: { bead1: [0.6, 0.15, 26], starA: [0.6, 0.16, 27] } },
  "reputation": { base: 0.4 },
  "Lover": { hue: 10, turn: 0.15, parts: { back: [0.8, 0.06, 240], bead2: [0.74, 0.075, 238], starB: [0.82, 0.055, 232] } },
  "evermore": { lift: 0.05 },
  "Midnights": { lift: -0.05 },
};

/* ---------- OKLCH ---------- */

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function toLch(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180) / Math.PI];
}

function rgbOf(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

// Back to hex, giving up chroma (never lightness or hue) until the colour is printable.
export function toHex(L, C, h) {
  L = Math.min(0.98, Math.max(0.05, L));
  let rgb = rgbOf(L, C, h);
  for (let i = 0; i < 24 && rgb.some((v) => v < -1e-4 || v > 1 + 1e-4); i++) rgb = rgbOf(L, (C *= 0.9), h);
  return "#" + rgb.map((v) => Math.round(gam(Math.min(1, Math.max(0, v))) * 255).toString(16).padStart(2, "0")).join("");
}

/* ---------- the dye ---------- */

// The seven shades for an era colour, as [L, C, h] per part.
export function shadesFor(eraHex, tune = {}) {
  const [L, C, h] = toLch(eraHex);
  const base = tune.base ?? Math.min(L_BAND[1], Math.max(L_BAND[0], L)) + (tune.lift || 0);
  const step = tune.step ?? 1, turn = tune.turn ?? 1, hue = h + (tune.hue || 0);
  const out = {};
  for (const [part, { shade: [dl, cs, dh] }] of Object.entries(PARTS))
    out[part] = tune.parts?.[part] || [base + dl * step, C * cs, hue + dh * turn];
  return out;
}

function moved(hex, from, to) {
  const [L, C, h] = toLch(hex);
  const [fL, fC, fh] = toLch(from);
  const [tL, tC, th] = to;
  return toHex(tL + (L - fL), fC > 1e-3 ? tC * (C / fC) : tC, th + (h - fh));
}

// Dye the lay for an album, or put it back as drawn when there is none. `root` is for a board
// that dyes copies of the lay side by side.
export function dye(album, root = svg) {
  if (!root) return;
  const eraHex = ALBUM_COLORS[album];
  const shades = eraHex && HEX.test(eraHex) ? shadesFor(eraHex, TUNE[album]) : null;
  for (const part of root.querySelectorAll("[data-dye]")) {
    const spec = PARTS[part.dataset.dye];
    if (!spec) continue;
    for (const node of [part, ...part.querySelectorAll("*")]) {
      for (const attr of ATTRS) {
        const key = "dye" + attr.replace(/-./, (s) => s[1].toUpperCase()).replace(/^./, (s) => s.toUpperCase());
        const drawn = node.dataset[key] || node.getAttribute(attr);
        if (!drawn || !HEX.test(drawn)) continue;
        node.dataset[key] = drawn;
        node.setAttribute(attr, shades ? moved(drawn, spec.from, shades[part.dataset.dye]) : drawn);
      }
    }
  }
}
