/* ---------- The bonus shelf's zine covers ----------
   Every game on the shelf is a little hand-bound booklet, and its cover is a collage of
   torn coloured paper. This module draws them. It is pure: nothing in here reads app
   state, and the only thing it is ever handed is a roster entry.

   Why torn paper rather than another set of marks. The shelf used to be a rack of record
   pressings, where a game's whole identity was one colour and one small drawn mark in the
   middle of a label — six objects with the same silhouette, told apart by a glyph the size
   of a fingernail. A cover has no shared silhouette to fight: it is a picture, so the eye
   recognises Only Here's contour map and Redacted's blacked-out page from across the page,
   at any size, without reading anything. That is the whole point of the change, and it is
   why the covers are allowed to be completely unlike one another. Do NOT normalise them
   into a family later: their only shared furniture is the torn title label, and even that
   sits where each composition wants it.

   Three rules the drawing obeys:

   - FLAT COLOUR ONLY. No gradients, no blurs, no filters. Paper is flat, and the notebook's
     art is ink on paper (never shaded objects). Depth comes from one hard-edged shadow copy
     of each layer, offset a unit and a half — which is exactly what a stack of cut paper
     does under a lamp, and it survives being rasterised into a keepsake PNG where a filter
     would not. Texture is made the same way: every bit of it is a flat shape, because the
     only kind of paper grain that survives a rasteriser is grain that is drawn.
   - THE TEXTURE IS TWO THINGS, AND BOTH ARE DRAWN. A sheet gets a FIBRE edge — a paler copy
     of itself underneath, torn harder, so the pale core of the stock shows in a hair along
     the rip the way it does on real cardstock; it is what separates a torn edge from a
     wiggly cut one. Over the finished collage goes GRAIN: a few hundred flecks of near-black
     and near-white at very low alpha, the pulp and the inclusions of the stock everything is
     pasted onto. Keep both subtle. Grain you can pick out fleck by fleck is a texture
     overlay; grain you only notice when you remove it is paper.
   - EVERY EDGE IS UNEVEN AND NO TWO ARE THE SAME. `torn()` walks a shape's outline and
     kicks every few units of it sideways by a seeded random amount, so a cover's sixth
     layer does not trace its fifth and a pair of ridges is never a mirror. The composition
     is hand-authored; only the raggedness is generated, which is the one part no hand would
     get right a hundred times over.
   - NO <use>, NO SPRITE, NO CSS COLOUR FUNCTIONS. A cover has to survive being lifted into
     the keepsake card's rasteriser, which renders in an isolated document that can see
     neither index.html's defs nor the page's custom properties. Everything a cover needs is
     inside its own <svg>, and every colour is a literal. Fonts are named literally too
     ("Caveat"), because that is the family the card embeds. */

/* ---------- the torn-paper workshop ---------- */

// Deterministic noise, so a cover is the same cover every time it is drawn — a shelf whose
// edges reshuffle on every render is a shelf that looks like it is buffering.
function rng(seed) {
  let s = (seed >>> 0) || 0x9e3779b9;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

/* Roughen a closed polygon into a torn edge. Each side is walked in steps of about
   `step` units and every step lands off the true line by up to `amp`, perpendicular to
   it — the fibre-and-fluff of a sheet pulled apart rather than cut.
   The amplitude is deliberately small (about one unit on a 120-wide cover): paper tears
   raggedly at the scale of its fibres, and a big amplitude reads as a badly drawn shape
   instead of a torn one. */
function torn(pts, rand, amp = 1.1, step = 5.5) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const j = (rand() * 2 - 1) * amp;
      out.push([x1 + dx * t + nx * j, y1 + dy * t + ny * j]);
    }
  }
  return out;
}

function pathOf(pts) {
  return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
}

/* A circle as a polygon, so `torn` can chew it like any other outline. `wob` pulls each
   sample's radius about a little before the tearing does its own work, which is what keeps
   a stack of concentric discs from reading as machine-drawn rings. */
function circlePts(cx, cy, r, rand, n = 30, wob = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r + (wob ? (rand() * 2 - 1) * wob : 0);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

// A rounded rectangle as a polygon, for the tunnel of frames Sing It Back falls down.
function roundRectPts(x, y, w, h, r, per = 4) {
  const pts = [];
  const corner = (cx, cy, from) => {
    for (let i = 0; i <= per; i++) {
      const a = from + (i / per) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  corner(x + w - r, y + h - r, 0);
  corner(x + r, y + h - r, Math.PI / 2);
  corner(x + r, y + r, Math.PI);
  corner(x + w - r, y + r, -Math.PI / 2);
  return pts;
}

/* The pale core of a sheet of stock: its colour nudged a fifth of the way to bone, and no
   further. A dyed sheet's core is a shade lighter than its face, not a different colour, and
   the moment the mix gets generous the fibre stops being the same paper and starts being a
   cream rim drawn round the shape — which on a dark ground is the loudest thing on the cover.
   Only hex fills are mixed, because a literal is the only thing a cover is allowed to carry
   (see the no-CSS-colour-functions rule) and anything else is handed back untouched. */
function core(fill, k = 0.22) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(fill).trim());
  if (!m) return null;
  const v = parseInt(m[1], 16);
  const rgb = [16, 8, 0].map((sh) => (v >> sh) & 255);
  /* Dark stock gets less than half of even that. A near-black block lifted by the mid-tone
     amount lands on a grey with no relationship to the sheet it came off, and reads as a
     blurred edge rather than a torn one — which is what an earlier pass did to Redacted's
     three blacked-out strips. */
  const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  const kk = lum < 70 ? k * 0.45 : k;
  const mixTo = [246, 239, 224];
  const out = rgb.map((c, i) => Math.round(c + (mixTo[i] - c) * kk));
  return "#" + out.map((c) => c.toString(16).padStart(2, "0")).join("");
}

/* One layer of paper: its shadow, its torn fibre, then the sheet. The shadow is a translated
   copy in flat near-black at low alpha, laid down FIRST so it only shows where the sheet does
   not cover it — along the bottom and right edges, which is where a raised sheet throws one.
   The fibre is a second copy in the stock's pale core, torn at very nearly the sheet's own
   amplitude but sampled twice as finely, and crucially from its OWN draws on `rand`. That is
   the whole trick: two edges wobbling by the same amount about the same line cross each other
   constantly, so the fibre is buried for most of its length and surfaces as short thin hairs
   where its wobble happens to beat the sheet's. Do not raise the multiplier to make it more
   visible. A fibre that clears the sheet everywhere stops being fluff and becomes an outline
   stroke around every shape, which is exactly what it looked like the first time. */
function sheet(pts, fill, rand, o = {}) {
  const amp = o.amp == null ? 1.1 : o.amp;
  const step = o.step == null ? 5.5 : o.step;
  const d = pathOf(o.crisp ? pts : torn(pts, rand, amp, step));
  const shade = o.shadow === false ? ""
    : `<path d="${d}" fill="rgba(26,18,12,0.22)" transform="translate(${o.sx == null ? 1.2 : o.sx} ${o.sy == null ? 1.8 : o.sy})"/>`;
  const pale = o.crisp || o.fibre === false ? null : core(fill);
  const fibre = pale ? `<path d="${pathOf(torn(pts, rand, amp * 1.12, step * 0.5))}" fill="${pale}"/>` : "";
  return shade + fibre + `<path d="${d}" fill="${fill}"/>`;
}

// A stack of concentric shapes, back to front, each one a sheet in its own colour. The
// workhorse behind three of the seven covers and the reason they took a paragraph each
// rather than a screen of coordinates.
function stack(colours, shapeAt, rand, o = {}) {
  return colours.map((c, i) => sheet(shapeAt(i), c, rand, o)).join("");
}

/* ---------- the grain ----------
   Everything above is pasted onto stock, and stock is not smooth. This scatters flecks of
   near-black and near-white over the finished collage: the darker ones read as inclusions
   pressed into the pulp, the paler ones as the tooth catching the light. They are flat rects
   at very low alpha, emitted as TWO paths rather than five hundred nodes, because a shelf
   draws seven covers twice over and a cover is not allowed to cost a thousand elements.
   It goes on last, over the label as well as the art, because the whole object is one pasted
   sheet and grain that stops at the title strip announces the strip is a separate drawing. */
function grain(rand, n = 420) {
  let dark = "", light = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * 124 - 2, y = rand() * 164 - 2;
    const w = (0.45 + rand() * 1.0).toFixed(2);
    const h = (0.4 + rand() * 0.7).toFixed(2);
    const d = `M${x.toFixed(1)} ${y.toFixed(1)}h${w}v${h}h-${w}Z`;
    if (rand() < 0.55) dark += d; else light += d;
  }
  return `<path d="${dark}" fill="rgba(34,24,14,0.11)"/>` +
         `<path d="${light}" fill="rgba(255,251,240,0.10)"/>`;
}

/* ---------- the covers ----------
   Each one is a function of a seeded random source, returning the collage as markup in a
   120 x 160 field. They are authored, not generated: the shapes below are a composition
   someone chose, and only the edges are random. The whole field is clipped to the cover's
   own rectangle by the caller, so a shape is free to run off the paper and be trimmed
   clean at the fold — which is how the sun sits half off the page on Ruthless without
   anyone drawing a semicircle. */

const COVERS = {
  /* SPOT THE SLIP — the line that throws. A slate page of ruled taupe strips with one
     vermillion impostor kicked out of line, longer than the rest and running off the edge.
     The idea is legible at thumbnail size with no reading at all: five things agree and
     one does not. */
  "spot-the-slip": (r) => {
    let s = sheet([[-6, 18], [126, 14], [126, 132], [-6, 136]], "#2f4858", r, { amp: 1.4 });
    const rows = [30, 46, 62, 86, 102, 118];
    rows.forEach((y, i) => {
      if (i === 3) return;
      const w = [74, 88, 62, 0, 80, 68][i];
      s += sheet([[14, y], [14 + w, y - 1], [14 + w, y + 8], [14, y + 9]], "#cfc3ab", r, { amp: 0.8, step: 4 });
    });
    // the slip: wider, hotter, tilted, and sticking out past the page it was pasted on
    s += sheet([[8, 88], [118, 80], [120, 93], [10, 101]], "#e0553c", r, { amp: 1.3, sy: 2.4, sx: 1.6 });
    return s;
  },

  /* NAME THAT SONG — sound coming out of nowhere. Concentric torn bands radiating from a
     cream disc low on the left, on a midnight ground: a line arrives and you have to say
     where it came from. Drawn as filled discs stacked smallest-last rather than as rings,
     because a torn ring needs two ragged edges that must not touch and a stack of discs
     needs none. */
  "name-that-song": (r) => {
    const cx = 22, cy = 128;
    const bands = ["#1f3f6b", "#2f5d8c", "#4a86b8", "#7fb2cf", "#bcd8e2"];
    let s = stack(bands, (i) => circlePts(cx, cy, 128 - i * 22, r, 40, 1.6), r, { amp: 1.4, step: 7 });
    s += sheet(circlePts(cx, cy, 15, r, 26, 0.9), "#f4ead6", r, { amp: 0.9, step: 4 });
    return s;
  },

  /* SING IT BACK — the gap. Rounded frames of plum falling away into a hole, and the hole
     is the bone of the cover paper itself showing through the whole stack. The one word
     lifted out of a line, drawn as a place where there is nothing. */
  "sing-it-back": (r) => {
    const frames = ["#57203f", "#73304f", "#8d4064", "#a95179", "#c47394", "#dba4b8"];
    let s = stack(frames, (i) => {
      const inset = 4 + i * 8.5;
      return roundRectPts(inset, inset + 8, 120 - inset * 2, 144 - inset * 2, Math.max(3, 16 - i * 2));
    }, r, { amp: 1.0, step: 6 });
    // the gap itself: not a colour, the page under everything
    s += sheet(roundRectPts(51, 63, 18, 34, 5), "#efe3cd", r, { amp: 0.8, step: 4, sx: -1, sy: -1.4 });
    return s;
  },

  /* REDACTED — a page with its telling words taped over. Manila ground, a cream sheet, thin
     olive lines of type and three heavy blocks laid across them. One block is lifted at its
     corner, which is the only thing on the cover that says the blocks come OFF. */
  "redacted": (r) => {
    let s = sheet([[10, 10], [112, 7], [114, 142], [8, 146]], "#f2e9d6", r, { amp: 1.3 });
    const line = (y, x, w) => sheet([[x, y], [x + w, y - 0.6], [x + w, y + 4.6], [x, y + 5.2]],
      "#6a6250", r, { amp: 0.55, step: 3.5 });
    // a page of type, close-set, so the blocks have something to be laid ACROSS
    [[26, 20, 58], [37, 20, 80], [48, 20, 44], [59, 20, 72],
     [78, 20, 66], [89, 20, 82], [100, 20, 50], [111, 20, 76], [122, 20, 38]]
      .forEach(([y, x, w]) => { s += line(y, x, w); });
    const block = (x, y, w) => sheet([[x, y], [x + w, y - 1.2], [x + w, y + 11], [x, y + 12.2]],
      "#191916", r, { amp: 1.0, step: 4.5, sy: 2.4, sx: 1.4 });
    s += block(30, 22, 46) + block(46, 74, 52) + block(20, 96, 34);
    /* the strip being taken off: the same block with its right end folded back on itself,
       and the fold drawn in the tape's pale underside. It is the only thing on the cover
       that says the blocks come OFF, which is the whole game. */
    s += sheet([[52, 118], [96, 116], [96, 122], [80, 129], [52, 130]], "#191916", r, { amp: 0.9, step: 4.5, sy: 2.4 });
    s += sheet([[80, 129], [96, 122], [99, 131], [84, 136]], "#b9b09a", r, { amp: 0.8, step: 4, sx: -1, sy: 1.4 });
    return s;
  },

  /* ONLY HERE — the map. Torn contour islands rising out of a dark sea, with a single
     vermillion pin at the summit: one word that lives in exactly one place. The blob is
     drawn once and scaled about its own centre for each ring, so the island keeps a shape
     while every contour is torn differently. */
  "only-here": (r) => {
    // the sea, full bleed: without it the contours float in the cover's own paper and the
    // map reads as a stain rather than as land with water round it
    let s = sheet([[-6, -6], [126, -6], [126, 166], [-6, 166]], "#0d3a42", r, { shadow: false, crisp: true });
    const base = [[10, 124], [24, 96], [46, 82], [42, 60], [62, 44], [90, 50], [110, 70],
                  [114, 100], [100, 128], [68, 142], [34, 140]];
    const cx = 62, cy = 94;
    const ring = (k) => base.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
    const bands = ["#17585c", "#1c7371", "#2f8f83", "#59ab95", "#8fc5a8", "#c8e0c2"];
    s += stack(bands, (i) => ring(1 - i * 0.155), r, { amp: 1.2, step: 6 });
    // the pin: a drop of red where the contours run out
    s += sheet(circlePts(62, 88, 8, r, 20, 0.7), "#d9432f", r, { amp: 0.7, step: 3.5 });
    return s;
  },

  /* THEN WHAT — the path over the ridge. Layered violet ridges with a pale road climbing
     out of the bottom of the page, over the last crest, and gone. The cover asks the
     game's question without a word on it: you can see where the road goes until you
     cannot. */
  "then-what": (r) => {
    const ridge = (y, f, drop) => sheet(
      [[-6, y + 14], [16, y + drop], [40, y - 4], [62, y + drop * 0.6], [86, y - 8], [126, y + 6], [126, 170], [-6, 170]],
      f, r, { amp: 1.3, step: 7 });
    let s = ridge(52, "#3b3170", 6) + ridge(78, "#4c3f8a", -3) + ridge(104, "#6a5cb0", 8) + ridge(130, "#8878cb", 2);
    /* The road, as stepping stones rather than a ribbon. A continuous pale strip laid over
       four ridges reads as a river or a rip in the paper — which is exactly what it looked
       like — where separate slabs read as something you walk. They shrink as they climb, and
       the last two are simply NOT THERE: the line of them stops halfway up the hill with
       nothing at the end of it, which is the question the game asks, drawn. */
    [[60, 150, 30, 9], [61, 133, 25, 8], [63, 117, 20, 7], [64, 102, 15.5, 6], [66, 90, 11.5, 5]]
      .forEach(([cx, y, w, h]) => {
        s += sheet([[cx - w / 2, y], [cx + w / 2, y - 0.8], [cx + w / 2 - 1, y + h], [cx - w / 2 + 1, y + h + 0.8]],
          "#e8dfc6", r, { amp: 0.7, step: 4, sx: 1.2, sy: 1.4 });
      });
    return s;
  },

  /* RUNNING ORDER, the back of the sleeve. A cream card on a burnt-ochre ground with the
     tracklist ruled down the right of it, and one row struck in vermillion: the track being
     asked about. The big handwritten numeral is what carries the cover at thumbnail size:
     nothing else on the shelf is a NUMBER, so at 24px this one is told apart from six pictures
     without resolving a single shape in it. The digit is drawn twice, a dark copy offset under
     the ink one, because that is the same hard-edged shadow every sheet here throws and the
     only kind of depth this collage is allowed.
     The eight is not a promise that every page is track eight; it is the fan's shorthand for
     the question, the way a contour line stands in for Only Here. */
  "running-order": (r) => {
    let s = sheet([[-6, -6], [126, -6], [126, 166], [-6, 166]], "#7a4f22", r, { shadow: false, crisp: true });
    // the sleeve back, pasted a little off square
    s += sheet([[14, 32], [107, 26], [111, 142], [10, 148]], "#ece0c4", r, { amp: 1.2 });
    // the tracklist: five ruled rows down the right, the third one struck in red because it is
    // the one the page is asking about
    [[48, 38], [64, 31], [80, 41], [96, 26], [112, 35]].forEach(([y, w], i) => {
      s += sheet([[60, y], [60 + w, y - 1], [60 + w, y + 5], [60, y + 6]],
        i === 2 ? "#c4452f" : "#b3a98a", r,
        { amp: 0.7, step: 4, sx: 1, sy: 1.2, fibre: false });
    });
    // the numeral, ink over its own shadow
    s += `<text x="36" y="106" text-anchor="middle" font-family="Caveat, cursive" font-weight="700"` +
         ` font-size="68" fill="#9c6b21">8</text>`;
    s += `<text x="34.4" y="104.2" text-anchor="middle" font-family="Caveat, cursive" font-weight="700"` +
         ` font-size="68" fill="#2b2118">8</text>`;
    return s;
  },

  /* WORD CLOUD — a clump of torn strips at every weight, packed into a ragged lozenge.

     It is told apart from Redacted by SHAPE, not by medium, which is the distinction that
     actually holds. Redacted's blocks are uniform, horizontal, share a left edge and lie on
     ruled lines: it is a PAGE, and it reads as one. This has no page under it, no rules, no
     shared edge and no two strips the same size or angle — it is a MASS, thinning to nothing
     at its edges, which is the one silhouette a word cloud has. The other half of it is
     value: Redacted is dark-on-light only, and this puts strips both lighter AND darker than
     its own ground, so the two never read as the same object even at 24px.

     A cover made of real lettering was tried here and thrown out. It dodged Redacted, but by
     abandoning the torn-paper collage every other cover on this shelf is built from, so it
     read as a slide rather than as something made by hand. */
  "word-cloud": (r) => {
    const GROUND = "#8e9484", DARK = "#2f352c", MID = "#5f6a58", PALE = "#dfe0ce";
    let s = sheet([[-6, -6], [126, -6], [126, 166], [-6, 166]], GROUND, r, { shadow: false, crisp: true });
    /* x, y, width, height, tilt, tone. Hand-placed, and the placement is the whole drawing:
       the bands TAPER, so the mass is widest through its middle and closes to a single short
       strip top and bottom. A first pass spread every band the full width of the field and
       the result was a brick wall — which is the same failure as looking like Redacted,
       arrived at from the other direction. No two strips share a left edge, a length or an
       angle, for the same reason. */
    const strips = [
      [48, 24, 24, 5, -5, PALE],
      [36, 33, 26, 6, 3, MID], [66, 35, 22, 5, -3, PALE],
      [26, 43, 34, 9, -2, DARK], [64, 45, 30, 7, 4, MID],
      [18, 56, 44, 13, 2, DARK], [66, 58, 36, 10, -3, PALE],
      [16, 72, 48, 14, -2, PALE], [68, 74, 34, 9, 3, DARK],
      [24, 89, 38, 9, 3, MID], [66, 90, 26, 7, -4, MID],
      [32, 103, 30, 7, -3, DARK], [66, 104, 20, 5, 4, PALE],
      [44, 114, 24, 4, -5, MID],
    ];
    strips.forEach(([x, y, w, h, rot, fill]) => {
      const strip = sheet([[x, y], [x + w, y - 1], [x + w, y + h], [x, y + h + 1]], fill, r,
        { amp: 0.9, step: 4, sx: 1, sy: 1.3, fibre: false });
      s += `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">${strip}</g>`;
    });
    return s;
  },

  /* RUTHLESS GAME — the sun going down on you. A huge ochre sun half off the page behind
     hot torn rays, with the ridges closing in front of it in the mode's own deep red. The
     one cover that is about a clock without drawing one. */
  "ruthless-game": (r) => {
    let s = sheet(circlePts(60, 74, 46, r, 34, 1.6), "#e8a23a", r, { amp: 1.3, step: 6 });
    const ray = (y, w) => sheet([[-6, y], [126, y - 2], [126, y + w], [-6, y + w + 2]], "#c4562f", r, { amp: 0.9, step: 5 });
    s += ray(46, 5) + ray(64, 7) + ray(86, 6);
    s += sheet([[-6, 96], [30, 86], [66, 100], [126, 88], [126, 170], [-6, 170]], "#7d2b34", r, { amp: 1.3, step: 7 });
    s += sheet([[-6, 122], [44, 112], [90, 126], [126, 116], [126, 170], [-6, 170]], "#4a1620", r, { amp: 1.3, step: 7 });
    return s;
  },
};

/* The unwritten game's cover: a blank sheet of kraft with nothing pasted on it but the
   title label, pencilled rather than printed. It is the test pressing's replacement and it
   does the same job — it has to look like an object that exists and a game that does not,
   so it is deliberately the one cover with no collage on it at all. */
function blankCover(r) {
  return sheet([[6, 8], [114, 5], [116, 152], [4, 155]], "#c2a878", r, { amp: 1.2 }) +
         sheet([[16, 30], [104, 26], [106, 44], [14, 48]], "#b39868", r, { amp: 1.0, step: 5, shadow: false });
}

/* ---------- the title label ----------
   The one piece of shared furniture: a torn strip of near-white pasted across the cover
   with the game's name written on it. It is the cover's only text and the only reason a
   shelf of seven pictures can be read as a shelf of seven names.
   The size is measured off the name rather than fixed, because "Redacted" and "Name That
   Song" are nowhere near the same width in a handwriting face and a fixed size would
   either starve one or spill the other. Caveat runs at roughly 0.40em per character. */
function titleLabel(name, r, box) {
  const { x, y, w, h, rot } = box;
  const size = Math.max(9.5, Math.min(19, (w - 11) / (0.40 * Math.max(1, name.length))));
  const strip = sheet([[x, y], [x + w, y - 1.4], [x + w, y + h], [x, y + h + 1.4]],
    box.fill || "#f7f1e2", r, { amp: 1.0, step: 5, sy: 2.2, sx: 1.4 });
  return `<g transform="rotate(${rot || 0} ${x + w / 2} ${y + h / 2})">${strip}` +
    `<text x="${x + w / 2}" y="${y + h / 2 + size * 0.34}" text-anchor="middle"` +
    ` font-family="Caveat, cursive" font-weight="700" font-size="${size.toFixed(1)}"` +
    ` fill="${box.ink || "#241f1a"}">${esc(name)}</text></g>`;
}

// Where each cover wants its label. Hand-placed: the label goes in the quiet part of its
// own composition, which is a different corner on every one of them, and a shared position
// would put it over the gap on Sing It Back or the pin on Only Here.
const LABELS = {
  "spot-the-slip":  { x: 12, y: 124, w: 96, h: 22, rot: -1.6 },
  "name-that-song": { x: 14, y: 16,  w: 94, h: 24, rot: 1.8 },
  "sing-it-back":   { x: 13, y: 116, w: 94, h: 22, rot: -2.2 },
  "redacted":       { x: 16, y: 120, w: 92, h: 22, rot: 1.4, fill: "#e9e0cb" },
  "only-here":      { x: 12, y: 14,  w: 96, h: 23, rot: -1.2 },
  "then-what":      { x: 14, y: 16,  w: 92, h: 23, rot: 1.6 },
  "running-order":  { x: 13, y: 122, w: 94, h: 21, rot: 1.5 },
  "word-cloud":     { x: 12, y: 126, w: 96, h: 21, rot: -1.3 },
  "ruthless-game":  { x: 12, y: 16,  w: 96, h: 23, rot: -1.8 },
};
const BLANK_LABEL = { x: 16, y: 28, w: 88, h: 20, rot: -1, fill: "#cdb489", ink: "rgba(52,42,30,0.68)" };

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// A seed from the id, so a cover's raggedness is tied to the game rather than to where it
// happens to sit in the roster.
function seedOf(id) {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

/* The paper the collage is pasted onto. Bone unless a cover says otherwise: Redacted wants
   a darker manila so the cream sheet on top of it reads as a separate sheet rather than as
   a margin, which is the difference between a page and a rectangle. */
const GROUNDS = { "redacted": "#cbb794" };

let uid = 0;

/* The cover as standalone markup. `extra` adds classes the way the old disc did, so the
   shelf, the spread, the play screen and the keepsake all draw one object.
   The clip is what makes the paper's four edges crisp while every contour inside it is
   torn: shapes are authored over the edge of the field and cut off at the fold. Its id is
   counted rather than derived from the game, because a shelf draws the same cover twice
   (in the rack and open on the desk) and two nodes cannot share one. */
export function zineCover(g, extra = "") {
  const cls = `zine-cover${extra ? " " + extra : ""}`;
  const r = rng(seedOf(g.id));
  const ready = !!g.ready;
  const art = ready ? (COVERS[g.id] || blankCover)(r) : blankCover(r);
  const label = titleLabel(g.name, r, ready ? (LABELS[g.id] || BLANK_LABEL) : BLANK_LABEL);
  const id = `zc${++uid}`;
  return `<svg class="${cls}" viewBox="0 0 120 160" aria-hidden="true">` +
    `<defs><clipPath id="${id}"><rect x="0" y="0" width="120" height="160" rx="1.5"/></clipPath></defs>` +
    `<g clip-path="url(#${id})">` +
      `<rect x="0" y="0" width="120" height="160" fill="${ready ? (GROUNDS[g.id] || "#efe3cd") : "#b9a074"}"/>` +
      art + label + grain(r) +
    `</g></svg>`;
}

// Is there a collage drawn for this game, or is it getting the blank kraft? The dev board
// reads it, and so does anything that wants to know a new roster entry still needs art.
export function hasCover(id) { return Object.prototype.hasOwnProperty.call(COVERS, id); }
