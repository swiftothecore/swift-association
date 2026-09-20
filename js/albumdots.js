/* ---------- The album pictures on the Album Focus board ----------
   Twelve square snapshots, one per studio record, drawn as a HALFTONE: a screen of dots on
   bare paper, one era colour plus its own shadow, printed slightly out of register. This
   module is pure. It reads no app state; it is handed a name, a colour and how far the album
   has been beaten, and it hands back an <svg>.

   WHERE THE PICTURES COME FROM. Each record's shape is a tone map generated from its own
   cover by scripts/albumfocus/covertone.py and kept in js/albumtone.js: 36 by 36 cells, each
   one of four steps, no colour and no line. That is a thousandth of the picture, printed back
   at about twenty dots across in a colour the sleeve does not use — the era colour — so what
   lands on the board is the cover's light and mass and nothing else. The album's OWN colours,
   type, photography and marks are not in the data and cannot be got out of it.

   WHY DOTS. The square used to be a crayon colouring-in, and a crayon can only ever say the
   same thing twelve times in twelve colours. A dot screen says it with a picture and still
   obeys the notebook's one art rule — this is ink on paper, and a halftone is literally how
   ink makes a tone, so nothing here is shaded, blurred or gradiated. Every dot is a flat
   circle of one colour.

   WHY IT IS NOT THE TRACK BY TRACK SHELF. The record sleeves next door are torn paper,
   landscape, and composed by hand; these are printed, square, and taken off the real records.
   The two boards are a click apart and must not read as one board dealt twice.

   HOW THE SCORE IS IN THE DRAWING. The fraction of the screen actually printed is the best
   score over the thirteen pages: a record never played is bare paper inside a pencilled box,
   a record in progress is a sparse ghost of its picture, and a beaten record is the full
   press run. The dots arrive in a seeded dissolve rather than sweeping across, so improving a
   score adds ink to the picture you already had instead of redrawing it. Crucially the
   geometry of EVERY dot is drawn off the random source whether or not it is printed, so the
   picture is stable for that album forever and only gains ink. */

import { ALBUM_TONES, ALBUM_TONE_N } from "./albumtone.js";
import { rng, seedOf } from "./zine.js";

const F = 100;              // the field, square, matching the tile's window
/* The screen's pitch: about twenty-four dots across the square, which is deliberately the
   same count as the tone map is cells wide (ALBUM_TONE_N). A screen finer than its map prints
   the map's own cell edges as steps; a screen coarser than it throws half the picture away. */
const CELL = F / ALBUM_TONE_N;

/* ---------- the ink ----------
   One era colour in three weights, the heaviest of which prints as the shadow plate. Nothing invents a hue: a picture is
   one colour printed at different densities, which is what keeps twelve tiles in twelve
   album colours from turning into a paint chart. */
function stockOf(hex) {
  return {
    mid: hex,
    deep: mix(hex, -0.16),
    shade: mix(hex, -0.38),
  };
}
function mix(hex, k) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(hex).trim());
  const v = m ? parseInt(m[1], 16) : 0x999999;
  const rgb = [16, 8, 0].map((sh) => (v >> sh) & 255);
  const to = k < 0 ? [38, 30, 22] : [246, 239, 224];
  const t = Math.abs(k);
  return "#" + rgb.map((c, i) => Math.round(c + (to[i] - c) * t).toString(16).padStart(2, "0")).join("");
}

/* ---------- the steps ----------
   Four densities and no more. A halftone with twenty tones in it is a photograph; this is a
   poster, and the map it prints from only carries four. Step 0 is bare paper, which is what
   does the drawing: ink is the figure and the stock is the light, so roughly a third of every
   square is never printed at all.

   The heaviest step prints on its own plate in the shadow ink, which is what gives the print
   its out-of-register edge (see `press`). The two middle steps are the era colour at two dot
   sizes, because that is how one ink makes two tones. */
const STEPS = [
  null,
  { d: 0.48, key: "mid" },
  { d: 0.78, key: "mid" },
  { d: 0.99, key: "shade", plate: "shade" },
];

/* One record's row: the tone map, the colour it was generated against, and — when the sleeve
   has one — the supporting ink and the cells that carry it. A record with no row draws nothing
   at all: an empty ruled box, exactly as a record nobody has played draws, rather than
   borrowing another album's picture, which would be a thirteenth record wearing the twelfth's
   cover. `__dev.album.pictures()` names any album in that state, and it is the tell that
   STUDIO_ALBUMS has grown and covertone.py has not been re-run. */
export function hasTone(album) {
  const row = ALBUM_TONES[album];
  return !!row && typeof row.t === "string" && row.t.length === ALBUM_TONE_N * ALBUM_TONE_N;
}
function cellAt(map, x, y) {
  const n = ALBUM_TONE_N;
  const cx = Math.floor((x / F) * n), cy = Math.floor((y / F) * n);
  if (cx < 0 || cy < 0 || cx >= n || cy >= n) return 0;
  return map.charCodeAt(cy * n + cx) - 48;
}

/* THE SUPPORTING INK IS CONDITIONAL, and the condition is the palette. It was chosen against a
   particular era colour — to be the hue that colour is NOT — so on the colour-blind palette,
   where every album wears a different swatch, that reasoning no longer holds and the second
   plate could easily land on top of the hue it was picked to avoid. When the colour handed in
   is not the one the map was generated against, the record simply prints in one ink. */
function secondInk(album, colour) {
  const row = ALBUM_TONES[album];
  if (!row || !row.ink || !row.a) return null;
  if (String(colour).trim().toLowerCase() !== String(row.base).toLowerCase()) return null;
  return { ink: row.ink, map: row.a };
}

/* ---------- the press ----------
   One pass over a screen of dots laid on the diagonal. Three things keep this off being a
   CSS pattern and all three are worth their lines:

   THE SCREEN IS ANGLED, per album, because a halftone ruled square to the paper moires
   against the tile's own edges and reads as graph paper. Every printer angles the screen;
   these are angled differently record to record, so no two squares catch the light the same.

   THE DOTS ARE OFF THE GRID. Each one is nudged a fraction of a cell and its radius varies,
   and about one in twenty-five fails to take at all — the specks a real screen drops. Take
   the jitter out and the picture is immediately a machine's.

   THE SHADOW PLATE IS OUT OF REGISTER, by about a third of a cell, always the same way on
   one square. That misalignment is the single thing that makes this look printed rather than
   rendered, and it is why the dark regions are a separate ink rather than a darker tone.

   Everything is accumulated into ONE PATH PER INK. A tile is four or five paths, not four
   hundred circles: the board draws twelve of these at once, and twelve squares of five
   thousand nodes is a scrolling board that stutters on a phone. */
function press(album, C, r, level, angle, reg, colour) {
  const row = ALBUM_TONES[album];
  const tones = row && row.t;
  const second = secondInk(album, colour);
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const buckets = new Map();
  // How much of the screen actually printed. A single page scored is a thirteenth of the
  // picture, which as bare dots is nothing at all, so any score at all gets a floor — the
  // same floor the crayon square had, for the same reason.
  const lv = Math.max(0, Math.min(1, level));
  const frac = lv <= 0 ? 0 : lv >= 1 ? 1 : 0.24 + 0.76 * lv;
  // A half-printed picture is lighter as well as sparser: the press is not up to pressure.
  const weight = 0.82 + 0.18 * lv;
  const n = Math.ceil((F * 1.5) / CELL);

  for (let j = -n; j <= n; j++) {
    for (let i = -n; i <= n; i++) {
      // The staggered row is what makes this a screen rather than a grid of squares.
      const u = i * CELL + (j & 1 ? CELL / 2 : 0), v = j * CELL;
      const bx = F / 2 + u * cos - v * sin, by = F / 2 + u * sin + v * cos;
      if (bx < -3 || bx > F + 3 || by < -3 || by > F + 3) continue;
      // Every draw happens whether or not the dot prints, so the picture is the same picture
      // at every score and only gains ink. Do not move these inside the checks below.
      const jx = (r() * 2 - 1) * CELL * 0.18, jy = (r() * 2 - 1) * CELL * 0.18;
      const grit = 0.84 + r() * 0.32;
      const agrit = 0.8 + r() * 0.4;               // the second plate's own dot, drawn here for
                                                   // the same reason: see the note above
      const order = r();
      const skip = r() < 0.04;
      const x = bx + jx, y = by + jy;
      if (!tones || skip || order > frac) continue;
      const step = STEPS[cellAt(tones, x, y)];
      /* The second plate. Small, and never in place of the first: a supporting dot sits in the
         gap beside its neighbour rather than on top of it, which is what a spare screen run at
         an offset actually does. It prints on bare cells too — that is where it does the most
         work, since a few specks of a second colour over blank paper is what stops a
         one-colour picture from ending at its own edge. */
      if (second && cellAt(second.map, x, y)) {
        const ar = CELL * 0.31 * agrit * weight;
        const ax = (x + reg[0] * 1.5).toFixed(1), ay = (y - reg[1] * 1.2).toFixed(1);
        const arr = ar.toFixed(2);
        buckets.set(second.ink, (buckets.get(second.ink) || "") +
          `M${ax} ${ay}m-${arr} 0a${arr} ${arr} 0 1 0 ${(ar * 2).toFixed(2)} 0a${arr} ${arr} 0 1 0 -${(ar * 2).toFixed(2)} 0`);
      }
      if (!step) continue;
      const rad = CELL * 0.68 * step.d * grit * weight;
      if (rad < 0.25) continue;
      const dx = step.plate === "shade" ? reg[0] : 0, dy = step.plate === "shade" ? reg[1] : 0;
      const cx = (x + dx).toFixed(1), cy = (y + dy).toFixed(1);
      const rr = rad.toFixed(2);
      const d = `M${cx} ${cy}m-${rr} 0a${rr} ${rr} 0 1 0 ${(rad * 2).toFixed(2)} 0a${rr} ${rr} 0 1 0 -${(rad * 2).toFixed(2)} 0`;
      const ink = C[step.key];
      buckets.set(ink, (buckets.get(ink) || "") + d);
    }
  }
  let out = "";
  buckets.forEach((d, ink) => { out += `<path d="${d}" fill="${ink}"/>`; });
  return out;
}

/* ---------- the pencilled box ----------
   The square somebody ruled before printing in it. It is the whole tile on a record never
   played, so it has to be a drawn line and not a border: four jittered corners joined by
   edges that bow, because nobody rules a square freehand and gets four straight sides. */
function boxPath(r) {
  const f = (v) => Math.round(v * 10) / 10;
  const jit = (n) => (r() * 2 - 1) * n;
  const b = 3.4;
  const pts = [[b + jit(1), b + jit(1)], [F - b + jit(1), b + jit(1)],
               [F - b + jit(1), F - b + jit(1)], [b + jit(1), F - b + jit(1)]];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < 4; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % 4];
    const nx = (y2 - y1) / F, ny = -(x2 - x1) / F, bow = jit(1.6);
    d += ` Q${f((x1 + x2) / 2 + nx * bow)} ${f((y1 + y2) / 2 + ny * bow)} ${f(x2)} ${f(y2)}`;
  }
  return d + " Z";
}

/* A record with no tone map behind it. It is the same empty ruled box a record nobody has
   played draws, which is the honest thing for it to be: a square waiting to be printed. */
function blankSquare(r, extra) {
  return `<svg class="af-pic${extra ? " " + extra : ""}" viewBox="0 0 ${F} ${F}"` +
    ` preserveAspectRatio="none" aria-hidden="true">` +
    `<path class="af-pic-box" d="${boxPath(r)}" fill="none"/></svg>`;
}

let uid = 0;

/* ---------- a snapshot ----------
   `album` is the record's real name, `colour` its era colour as the LIVE palette gives it
   (so the colour-blind setting reaches the board like it reaches everything else), and
   `level` how far it is printed: 0 for never played, the best score over the thirteen pages
   while it is in progress, 1 once it is beaten.

   The clip id is counted rather than derived from the album, because the board and an album's
   own menu can both be showing the same record and two nodes cannot share one id. */
export function albumDots(album, colour, level, extra = "") {
  const r = rng(seedOf("afdots:" + album));
  const C = stockOf(colour || "#999999");
  if (!hasTone(album)) return blankSquare(r, extra);
  // Drawn before the press so the screen angle, the registration and the box are the album's
  // and not a function of how well it has been played.
  const angle = (14 + r() * 26) * (Math.PI / 180);
  const reg = [(r() * 2 - 1) * CELL * 0.34, (0.2 + r() * 0.5) * CELL * 0.6];
  const box = boxPath(r);
  const id = `afd${++uid}`;

  return `<svg class="af-pic${extra ? " " + extra : ""}" viewBox="0 0 ${F} ${F}" preserveAspectRatio="none" aria-hidden="true">` +
    `<defs><clipPath id="${id}"><rect x="0" y="0" width="${F}" height="${F}"/></clipPath></defs>` +
    `<g clip-path="url(#${id})">${press(album, C, r, level, angle, reg, colour)}</g>` +
    `<path class="af-pic-box" d="${box}" fill="none"/>` +
    `</svg>`;
}
