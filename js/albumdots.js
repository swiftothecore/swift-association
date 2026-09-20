/* ---------- The album pictures on the Album Focus board ----------
   Twelve square snapshots, one per studio record, drawn as a HALFTONE: a screen of dots on
   bare paper, one era colour plus its own shadow, printed slightly out of register. This
   module is pure. It reads no app state; it is handed a name, a colour and how far the
   album has been beaten, and it hands back an <svg>.

   WHY DOTS. The square used to be a crayon colouring-in, and a crayon can only ever say the
   same thing twelve times in twelve colours. A dot screen says it with a PICTURE and still
   obeys the notebook's one art rule — this is ink on paper, and a halftone is literally how
   ink makes a tone, so nothing here is shaded, blurred or gradiated. Every dot is a flat
   circle of one colour.

   WHY IT IS NOT THE TRACK BY TRACK SHELF. The record sleeves next door are torn paper,
   landscape, and made of collage; these are printed, square, and made of light. The two
   boards are a click apart and they must not read as one board dealt twice, which is also
   why an album's sleeve motif and its scene here are allowed to be completely different
   pictures of the same record.

   HOW THE SCORE IS IN THE DRAWING. The fraction of the screen actually printed is the best
   score over the thirteen pages: a record never played is bare paper inside a pencilled box,
   a record in progress is a sparse ghost of its picture, and a beaten record is the full
   press run. The dots arrive in a seeded dissolve rather than sweeping across, so improving
   a score adds ink to the picture you already had instead of redrawing it. Crucially the
   geometry of EVERY dot is drawn off the random source whether or not it is printed, so the
   picture is stable for that album forever and only gains ink.

   Colour and mood only. There is no album artwork here and there never will be: what tells
   the records apart is the composition and the era colour, the same rule the rest of the
   notebook keeps. */

import { rng, seedOf } from "./zine.js";

const F = 100;              // the field, square, matching the tile's window
const CELL = 4.7;           // the screen's pitch — about 21 dots across a 100-unit field

/* ---------- the ink ----------
   One era colour in four weights, plus the shadow plate. Nothing invents a hue: a picture is
   one colour printed at different densities, which is what keeps twelve tiles in twelve
   album colours from turning into a paint chart. */
function stockOf(hex) {
  return {
    pale: mix(hex, 0.34),
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

/* ---------- what a region is ----------
   A scene is a list of flat regions, back to front, each one an area of the field printed at
   one tone in one ink. The last region covering a dot wins, so a shape laid on top simply
   prints over what is under it, exactly as a second pass of the press would. */
function poly(pts) {
  return (x, y) => {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
}
function disc(cx, cy, r) {
  return (x, y) => (x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r;
}
function ring(cx, cy, r, w) {
  const inner = (r - w) * (r - w), outer = r * r;
  return (x, y) => {
    const d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return d <= outer && d >= inner;
  };
}
// A parallelogram: a rectangle sheared sideways, which is the whole vocabulary a flat plane
// seen at an angle needs.
function par(x, y, w, h, skew) {
  return poly([[x, y], [x + w, y - skew], [x + w, y - skew + h], [x, y + h]]);
}
// A diamond standing on its point.
function dia(cx, cy, rx, ry) {
  return poly([[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]]);
}

/* The densities a scene may print at. They are steps, not a scale: a halftone with twenty
   tones in it is a photograph, and this is a poster. CUT is the important one — a region at
   CUT prints nothing at all, so a shape laid over another in CUT takes a bite of bare paper
   out of it, which is how the moon gets its crescent and the rug its middle. */
const CUT = 0, LIGHT = 0.5, MID = 0.74, HEAVY = 0.92, SOLID = 1;

/* ---------- the twelve scenes ----------
   Authored compositions, not generated ones. They are rooms reduced until only the light is
   left: a plane, the wall it leans on, and one object — which is where the dot screen came
   from in the first place, and what stops twelve abstract squares reading as twelve
   patterns. They are allowed to be completely unlike each other.

   THREE RULES EVERY SCENE KEEPS, all three learned by drawing the wrong thing first.
   - THE PAPER IS THE LIGHT. Ink is the figure and bare stock is everything the light falls
     on, so nothing is ever printed pale over the whole field to mean "bright". The first pass
     did exactly that — a light screen of the era colour standing in for a lit wall — and on
     cream paper a pale dot at forty percent is invisible, so all twelve squares came out as
     an even rash of colour with no picture in them. Roughly half the field stays bare.
   - BIG SHAPES ONLY. A tile is 120 pixels wide on a phone and the screen's pitch is five of
     them, so a shape narrower than about twelve units resolves to a line of four dots and
     reads as dirt. Nothing here is small except a deliberate scatter.
   - TONE CARRIES THE COMPOSITION, not outline. Two regions that touch are a full step apart
     or more, or the picture goes flat the moment the print is only half in.
   Where a count falls naturally on the record's number it takes it — Lover's seven spots,
   1989's five bars — which is a wink and not a system. See the same note in js/sleeves.js. */
const SCENES = {
  // The sun coming up over a floor: one disc high on the wall and the light lying in bands
  // across the boards under it. The debut gets the plainest room on the board.
  corner: (C) => [
    { in: disc(62, 30, 23), tone: HEAVY, ink: C.deep },
    { in: poly([[-4, 60], [104, 52], [104, 78], [-4, 86]]), tone: MID, ink: C.mid },
    { in: poly([[-4, 90], [104, 82], [104, 104], [-4, 104]]), tone: HEAVY, ink: C.shade, plate: "shade" },
  ],

  // Light through a blind: bars of shadow leaning across the whole square with the lit paper
  // left standing between them.
  blind: (C) => {
    const out = [];
    for (let k = 0; k < 4; k++) {
      const x = -18 + k * 31;
      out.push({ in: poly([[x, 104], [x + 17, 104], [x + 41, -4], [x + 24, -4]]),
        tone: k % 2 ? MID : HEAVY, ink: k % 2 ? C.mid : C.deep });
    }
    return out;
  },

  // Three steps climbing out of the bottom-left corner, each block a weight lighter than the
  // one below it: going up, into the light. The treads are cut well apart by bare paper,
  // because blocks that touch are one diagonal smear and not a stair — and there are three
  // rather than four because at this pitch a narrower tread stops being a block at all.
  steps: (C) => [
    { in: par(0, 66, 30, 42, 8), tone: HEAVY, ink: C.deep },
    { in: par(38, 46, 30, 42, 8), tone: HEAVY, ink: C.mid },
    { in: par(76, 26, 30, 42, 8), tone: MID, ink: C.mid },
  ],

  // A table seen end-on: one long plane across the room and one block standing on it, with a
  // gap of lit paper between the two so the block is a block and not a bruise on the table.
  slab: (C) => [
    { in: par(20, 18, 36, 32, 9), tone: HEAVY, ink: C.deep },
    { in: poly([[-4, 66], [104, 58], [104, 82], [-4, 90]]), tone: MID, ink: C.mid },
    { in: poly([[-4, 92], [104, 84], [104, 104], [-4, 104]]), tone: HEAVY, ink: C.shade, plate: "shade" },
  ],

  // A dark wall with FIVE bars of light thrown down it and across the floor, widening as
  // they fall. 1989 is the fifth record (see the note over SCENES). The light is cut out of
  // the ink rather than printed: five narrow bars of colour would be five lines of four
  // dots, which at this pitch is dirt, and the same five as holes are unmistakable.
  window: (C) => {
    const out = [{ in: poly([[-4, -4], [104, -4], [104, 104], [-4, 104]]), tone: HEAVY, ink: C.deep }];
    for (let k = 0; k < 5; k++) {
      const top = 12 + k * 15, bot = -6 + k * 22;
      out.push({ in: poly([[top, -4], [top + 11, -4], [bot + 19, 104], [bot, 104]]), tone: CUT });
    }
    out.push({ in: poly([[-4, 84], [104, 78], [104, 104], [-4, 104]]), tone: MID, ink: C.shade, plate: "shade" });
    return out;
  },

  // A dark room with one door open in it. The only card on the board that is mostly ink, and
  // the only one where the light is a hole rather than a shape.
  doorway: (C) => [
    { in: poly([[-4, -4], [104, -4], [104, 104], [-4, 104]]), tone: HEAVY, ink: C.deep },
    { in: poly([[38, 10], [66, 14], [66, 94], [38, 98]]), tone: CUT },
    { in: poly([[38, 98], [66, 94], [96, 104], [18, 104]]), tone: LIGHT, ink: C.mid },
  ],

  // A rug thrown down on a floor, diamond inside diamond, with SEVEN spots scattered round
  // it — Lover being the seventh record.
  rug: (C) => {
    const out = [
      { in: dia(50, 56, 46, 36), tone: MID, ink: C.mid },
      { in: dia(50, 56, 30, 23), tone: CUT },
      { in: dia(50, 56, 17, 13), tone: HEAVY, ink: C.deep },
    ];
    [[13, 15], [35, 8], [60, 12], [84, 9], [92, 30], [8, 34], [76, 26]].forEach(([x, y]) =>
      out.push({ in: disc(x, y, 5.5), tone: HEAVY, ink: C.shade, plate: "shade" }));
    return out;
  },

  // Trunks standing in a wood, near ones darker than far. Flat verticals and no branches: an
  // outline would be a drawing of a tree, and this is a drawing of standing in one.
  wood: (C) => {
    const out = [];
    [[3, 14, MID, C.mid], [24, 16, HEAVY, C.deep], [48, 13, MID, C.mid],
     [66, 17, HEAVY, C.deep], [89, 12, MID, C.mid]].forEach(([x, w, tone, ink]) => {
      out.push({ in: poly([[x, -4], [x + w, -4], [x + w - 2, 104], [x - 2, 104]]), tone, ink });
    });
    out.push({ in: poly([[-4, 92], [104, 86], [104, 104], [-4, 104]]), tone: MID, ink: C.shade, plate: "shade" });
    return out;
  },

  // A sheet of paper folded once and stood on the desk. Only the far plane is printed: the
  // near one is bare stock, which is the face the light is on, and the crease between them is
  // the gap rather than a drawn line — the only kind of edge this press can make.
  fold: (C) => [
    { in: poly([[54, 10], [90, 34], [90, 86], [54, 80]]), tone: HEAVY, ink: C.deep },
    { in: poly([[12, 30], [46, 10], [46, 78], [12, 90]]), tone: MID, ink: C.mid },
    { in: poly([[46, 84], [94, 90], [104, 102], [26, 102]]), tone: MID, ink: C.shade, plate: "shade" },
  ],

  // A moon over a low floor with the small hours scattered round it. The crescent is bitten
  // out of the disc rather than drawn, which is the only way a moon works in one ink.
  moon: (C) => {
    const out = [
      { in: disc(58, 36, 27), tone: HEAVY, ink: C.deep },
      { in: disc(44, 30, 22), tone: CUT },
      { in: poly([[-4, 82], [104, 74], [104, 104], [-4, 104]]), tone: MID, ink: C.mid },
    ];
    [[14, 14], [30, 48], [10, 62], [88, 12], [92, 54], [40, 6]].forEach(([x, y]) =>
      out.push({ in: disc(x, y, 4.6), tone: HEAVY, ink: C.shade, plate: "shade" }));
    return out;
  },

  // A desk under a lamp at two in the morning: the room in shadow either side, the cone of
  // light bare paper straight down the middle, and one page lying in it.
  desk: (C) => [
    { in: poly([[-4, -4], [104, -4], [104, 104], [-4, 104]]), tone: HEAVY, ink: C.deep },
    { in: poly([[36, -4], [60, -4], [96, 78], [6, 78]]), tone: CUT },
    { in: poly([[-4, 78], [104, 70], [104, 104], [-4, 104]]), tone: MID, ink: C.mid },
    { in: par(38, 54, 30, 20, 7), tone: SOLID, ink: C.shade, plate: "shade" },
  ],

  // A stage: the arc a spotlight throws across the boards, and the dark beyond the edge of
  // it. The Life of a Showgirl.
  arc: (C) => [
    { in: ring(50, 104, 62, 20), tone: MID, ink: C.mid },
    { in: ring(50, 104, 36, 16), tone: HEAVY, ink: C.deep },
    { in: poly([[-4, -4], [104, -4], [104, 26], [-4, 32]]), tone: HEAVY, ink: C.shade, plate: "shade" },
  ],
};

/* WHICH RECORD GETS WHICH SCENE, stated by name and never by position — the same promise the
   sleeves make, for the same reason: dealt off an index into STUDIO_ALBUMS, a thirteenth
   record would silently swap every picture on the board. An album with no line here still
   draws, off its own name, rather than coming up blank. */
const ALBUM_SCENE = {
  "Taylor Swift": "corner",
  "Fearless": "blind",
  "Speak Now": "steps",
  "Red": "slab",
  "1989": "window",
  "reputation": "doorway",
  "Lover": "rug",
  "folklore": "wood",
  "evermore": "fold",
  "Midnights": "moon",
  "The Tortured Poets Department": "desk",
  "The Life of a Showgirl": "arc",
};
const SCENE_NAMES = Object.keys(SCENES);

export function sceneOf(album) {
  return ALBUM_SCENE[album] || SCENE_NAMES[seedOf(String(album)) % SCENE_NAMES.length];
}
// Is there a picture spoken for by name, or is this record borrowing one off its own hash?
// The dev board asks, the way it asks the sleeves whether a cover is authored.
export function hasScene(album) {
  return Object.prototype.hasOwnProperty.call(ALBUM_SCENE, album);
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
function press(regions, r, level, angle, reg) {
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
      const order = r();
      const skip = r() < 0.04;
      const x = bx + jx, y = by + jy;
      let hit = null;
      for (let k = regions.length - 1; k >= 0; k--) {
        if (regions[k].in(x, y)) { hit = regions[k]; break; }
      }
      if (!hit || hit.tone <= 0 || skip) continue;
      if (order > frac) continue;
      const rad = CELL * 0.68 * hit.tone * grit * weight;
      if (rad < 0.25) continue;
      const dx = hit.plate === "shade" ? reg[0] : 0, dy = hit.plate === "shade" ? reg[1] : 0;
      const cx = (x + dx).toFixed(1), cy = (y + dy).toFixed(1);
      const rr = rad.toFixed(2);
      const d = `M${cx} ${cy}m-${rr} 0a${rr} ${rr} 0 1 0 ${(rad * 2).toFixed(2)} 0a${rr} ${rr} 0 1 0 -${(rad * 2).toFixed(2)} 0`;
      buckets.set(hit.ink, (buckets.get(hit.ink) || "") + d);
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
  const scene = (SCENES[sceneOf(album)] || SCENES.corner)(C);
  // Drawn before the press so the screen angle, the registration and the box are the album's
  // and not a function of how well it has been played.
  const angle = (14 + r() * 26) * (Math.PI / 180);
  const reg = [(r() * 2 - 1) * CELL * 0.34, (0.2 + r() * 0.5) * CELL * 0.6];
  const box = boxPath(r);
  const id = `afd${++uid}`;

  return `<svg class="af-pic${extra ? " " + extra : ""}" viewBox="0 0 ${F} ${F}" preserveAspectRatio="none" aria-hidden="true">` +
    `<defs><clipPath id="${id}"><rect x="0" y="0" width="${F}" height="${F}"/></clipPath></defs>` +
    `<g clip-path="url(#${id})">${press(scene, r, level, angle, reg)}</g>` +
    `<path class="af-pic-box" d="${box}" fill="none"/>` +
    `</svg>`;
}
