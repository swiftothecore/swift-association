/* ---------- The record sleeves on Track by Track's album board ----------
   Twelve landscape cards, one per studio album, pasted up out of the same torn stock as the
   bonus shelf's zine covers. This module is pure: it reads no app state, and everything it is
   handed is a name, a colour, a track count and (if there is one) a time.

   WHY THE BOARD IS MADE OF PAPER AT ALL. The picker used to be twelve ruled rows with a colour
   chip at the left, which told you everything and showed you nothing: the one screen the player
   passes through before EVERY run was the plainest thing in the notebook, sitting one step in
   from a shelf of hand-bound collages. A record you have written out and one you have never
   opened looked the same from six inches away. These cards fix that with a picture rather than
   with more type.

   WHY LANDSCAPE. The shelf next door is a rack of upright covers. A board of upright cards one
   screen away from it would read as the same rack dealt twice, so these lie on their side: 160
   by 104, wider than they are tall, which is a silhouette nothing else in the notebook uses.
   That is also what keeps them clear of Album Focus's board of twelve squares.

   The drawing rules are the covers' rules, and they are not negotiable here either, because the
   two sit a click apart and any drift shows:
   - FLAT COLOUR ONLY. No gradients, no blurs, no filters. Depth is one hard-edged shadow copy
     of each layer, which is what a stack of cut paper does under a lamp.
   - EVERY EDGE IS TORN, and torn from its own draws on the seeded random source, so no two rips
     trace each other and no pair is ever a mirror.
   - NO <use>, NO SPRITE, NO CSS COLOUR FUNCTIONS. Every colour is a literal and the font is
     named literally ("Caveat"), so a sleeve survives being lifted out of the page.
   The hands themselves (rng, torn, sheet, grain) are imported from js/zine.js rather than
   written again. See the note over the workshop there. */

import { rng, sheet, grain, seedOf } from "./zine.js";
import { escapeHtml } from "./util.js";

/* The field. Nothing outside this module should know these numbers: a sleeve is handed out as
   markup with its own viewBox and is sized entirely by the CSS around it. */
const W = 160, H = 104;

/* ---------- the stock ----------
   One era colour, pushed about into the four weights a collage needs. The album's own hue is
   the mid; the ground is it driven most of the way to soot so a pale shape has something to be
   pale against, and the two lifts are it mixed toward the bone the whole notebook is printed
   on. Nothing here invents a hue, which is what keeps twelve cards in twelve album colours from
   turning into a paint chart: every card is one colour, four times over. */
function stockOf(hex) {
  return {
    ground:  mix(hex, -0.44),
    deepish: mix(hex, -0.18),
    mid:     hex,
    pale:    mix(hex, 0.30),
    palest:  mix(hex, 0.58),
  };
}
function mix(hex, k) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(hex).trim());
  const v = m ? parseInt(m[1], 16) : 0x999999;
  const rgb = [16, 8, 0].map((sh) => (v >> sh) & 255);
  const to = k < 0 ? [26, 20, 14] : [246, 239, 224];
  const t = Math.abs(k);
  return "#" + rgb.map((c, i) => Math.round(c + (to[i] - c) * t).toString(16).padStart(2, "0")).join("");
}

/* An ellipse as a polygon, so `torn` can chew it like any other outline. The wobble pulls each
   sample's radius about before the tearing does its own work, which is what stops a set of
   concentric rings reading as machine-drawn. */
function ellipsePts(cx, cy, rx, ry, rand, n = 30, wob = 1.2) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = wob ? (rand() * 2 - 1) * wob : 0;
    pts.push([cx + Math.cos(a) * (rx + k), cy + Math.sin(a) * (ry + k)]);
  }
  return pts;
}
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

/* ---------- the twelve pictures ----------
   Authored compositions, not generated ones: only the raggedness of each edge comes off the
   random source. They are allowed to be completely unlike one another — that is the whole point
   of a picture over a glyph, and it is why the shelf's covers work at a thumbnail. Do not
   normalise them into a family later.

   WHERE A MOTIF COUNTS, IT COUNTS THE ALBUM. Lover has seven tiles, 1989 five rays, the
   Anthology eleven columns, because those are the seventh, fifth and eleventh records. It is a
   wink for whoever looks twice, NOT a system, and it cannot be made into one: a rule that held
   everywhere would want one ring on the debut, eight frames on folklore and twelve waves on
   Showgirl, none of which is a drawing. So the rule is only this — a motif whose objects fall
   naturally on the album's number takes it, and the rest are composed for the picture. Track
   counts were the other candidate and they are unusable: fourteen to thirty-one objects is not a
   collage, it is a chart.

   EVERY MOTIF LEAVES THE BOTTOM-LEFT AND TOP-RIGHT ALONE. The name label sits at the foot and
   the time label at the head, so a composition that puts its subject dead centre gets cut in
   half by its own title. Compose across the field or into the corners that are left. */
const MOTIFS = {
  // Rings going out from a point off to the left: sound leaving, rather than a target.
  rings: (r, C) => [70, 56, 42, 28, 15].map((rr, i) =>
    sheet(ellipsePts(52, 46, rr * 1.15, rr * 0.92, r), [C.palest, C.pale, C.mid, C.deepish, C.pale][i], r,
      { amp: 1.2, shadow: false })).join(""),

  // A ridge of hills, three ranges deep.
  ridge: (r, C) => [[68, C.palest], [82, C.pale], [96, C.mid]].map(([y, col], k) =>
    sheet([[-8, y], [26, y - 14 - k * 3], [58, y - 2], [92, y - 18], [126, y - 6], [W + 8, y - 14],
           [W + 8, H + 8], [-8, H + 8]], col, r, { amp: 1.3, shadow: false })).join(""),

  // Ruled strips: the notebook's own lines, torn out of colour instead of printed.
  rules: (r, C) => [14, 30, 46, 62, 78].map((y, k) => {
    const w = [120, 92, 134, 76, 110][k];
    return sheet([[12, y], [12 + w, y - 1.5], [12 + w, y + 9], [12, y + 10.5]],
      k % 2 ? C.pale : C.palest, r, { amp: 0.8, step: 4 });
  }).join(""),

  // Slats leaning the whole way across, like light through a blind.
  slats: (r, C) => {
    let s = "";
    for (let k = 0; k < 7; k++) {
      const x = -6 + k * 24;
      s += sheet([[x, H - 4], [x + 14, H - 4], [x + 30, -4], [x + 16, -4]],
        [C.palest, C.pale, C.mid][k % 3], r, { amp: 1.0, shadow: false });
    }
    return s;
  },

  // Rays out of the bottom-left corner. FIVE of them, 1989 being the fifth record (see the note
  // under MOTIFS); the sixth was doing nothing the other five were not.
  rays: (r, C) => {
    let s = "";
    for (let k = 0; k < 5; k++) {
      const a1 = -0.06 - k * 0.2, a2 = a1 - 0.11;
      s += sheet([[-4, H], [Math.cos(a1) * 230 - 4, H + Math.sin(a1) * 230],
                  [Math.cos(a2) * 230 - 4, H + Math.sin(a2) * 230]],
        k % 2 ? C.pale : C.palest, r, { amp: 1.1, shadow: false });
    }
    return s;
  },

  // A disc over a low horizon, sitting high enough to clear the name at the foot.
  horizon: (r, C) => sheet(ellipsePts(114, 32, 24, 24, r, 30, 1.4), C.palest, r, { amp: 1.2, shadow: false }) +
    sheet([[-8, 58], [W + 8, 54], [W + 8, H + 8], [-8, H + 8]], C.pale, r, { amp: 1.3, shadow: false }) +
    sheet([[-8, 78], [W + 8, 74], [W + 8, H + 8], [-8, H + 8]], C.mid, r, { amp: 1.2, shadow: false }),

  // Torn tiles, a paste-up of squares. SEVEN of them, with the bottom-right corner of the grid
  // left empty — Lover is the seventh record (see the note under MOTIFS).
  tiles: (r, C) => {
    let s = "";
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        if (row === 1 && col === 3) continue;
        /* The second row runs UNDER the name label on purpose. Lifting both rows clear of it so
           the seven could be counted was tried and thrown away: it makes the tiles squat and the
           card top-heavy, and the paste-up stops looking pasted. The seven is a wink, and a wink
           does not get to cost the picture — a big tile half behind a label is what a collage
           looks like. */
        const x = 12 + col * 36, y = 10 + row * 40;
        s += sheet([[x, y], [x + 28, y - 1], [x + 29, y + 30], [x + 1, y + 31]],
          (row + col) % 2 ? C.pale : C.palest, r, { amp: 1.0 });
      }
    }
    return s;
  },

  // Frames inside frames, falling away from the edge of the card.
  frames: (r, C) => [[0, C.palest], [1, C.pale], [2, C.mid], [3, C.deepish]].map(([i, col]) =>
    sheet(roundRectPts(16 + i * 17, 8 + i * 11, 128 - i * 34, 84 - i * 22, 7), col, r,
      { amp: 1.1, shadow: false })).join(""),

  // A sash of paper laid across the corner, with a second strip behind it.
  sash: (r, C) => sheet([[-10, 72], [120, -8], [152, -8], [16, H]], C.pale, r, { amp: 1.3 }) +
    sheet([[54, H], [W + 8, 10], [W + 8, 34], [96, H]], C.palest, r, { amp: 1.2 }),

  // Scraps scattered face down: a page torn up and left where it fell.
  scraps: (r, C) => {
    let s = "";
    [[18, 14], [62, 8], [110, 18], [26, 50], [74, 44], [122, 54], [44, 74], [138, 30]]
      .forEach(([x, y], k) => {
        const w = 18 + r() * 16, h = 11 + r() * 9;
        s += sheet([[x, y], [x + w, y - 2], [x + w + 1, y + h], [x + 1, y + h + 2]],
          [C.palest, C.pale, C.mid][k % 3], r, { amp: 1.0, step: 4 });
      });
    return s;
  },

  // Columns standing up off the bottom edge. ELEVEN of them — the Anthology is the eleventh
  // record (see the note under MOTIFS). They are narrower and closer than the ten were, which is
  // if anything truer to the drawing: a skyline is a crowd.
  skyline: (r, C) => {
    let s = "";
    // Nothing shorter than fifty-two: the label covers the foot of this card almost end to end,
    // and the three stubby columns the skyline used to have were hidden behind it, so eleven
    // towers showed up as eight.
    [58, 76, 54, 88, 64, 80, 56, 72, 52, 62, 68].forEach((hh, k) => {
      const x = 3 + k * 14;
      s += sheet([[x, H - hh], [x + 12, H - hh - 2], [x + 12, H + 4], [x, H + 4]],
        k % 2 ? C.palest : C.pale, r, { amp: 0.9 });
    });
    return s;
  },

  // Waves rolling across, four bands deep.
  waves: (r, C) => [[18, C.palest], [40, C.pale], [62, C.mid], [84, C.palest]].map(([y, col]) => {
    const pts = [];
    for (let i = 0; i <= 8; i++) pts.push([-8 + i * 22, y + Math.sin(i * 0.9) * 6]);
    for (let i = 8; i >= 0; i--) pts.push([-8 + i * 22, y + 13 + Math.sin(i * 0.9) * 6]);
    return sheet(pts, col, r, { amp: 1.0, step: 4.5 });
  }).join(""),
};

/* WHICH RECORD GETS WHICH PICTURE, stated by name and never by position.
   Deal these off an index into STUDIO_ALBUMS and the day a thirteenth record is added — or the
   day that list is reordered — every album on the board silently swaps pictures, and a player
   who knows folklore by its nest of frames has to learn the board again for no reason. The
   pairing is a promise, so it is written down. An album with no line here still draws, off its
   own name, rather than coming up blank. */
const ALBUM_MOTIF = {
  "Taylor Swift": "rings",
  "Fearless": "ridge",
  "Speak Now": "rules",
  "Red": "slats",
  "1989": "rays",
  "reputation": "horizon",
  "Lover": "tiles",
  "folklore": "frames",
  "evermore": "sash",
  "Midnights": "scraps",
  "The Tortured Poets Department": "skyline",
  "The Life of a Showgirl": "waves",
};
const MOTIF_NAMES = Object.keys(MOTIFS);

export function motifOf(album) {
  return ALBUM_MOTIF[album] || MOTIF_NAMES[seedOf(String(album)) % MOTIF_NAMES.length];
}

/* Is there a picture spoken for by name, or is this record borrowing one off its own hash? The
   dev board reads it, the same way the shelf's board asks `hasCover`. */
export function hasMotif(album) {
  return Object.prototype.hasOwnProperty.call(ALBUM_MOTIF, album);
}

/* ---------- the labels ----------
   Both are torn paper, not type set on the art: the name at the foot and the time at the head.

   THE STRIP IS MEASURED OFF THE TEXT, NOT COUNTED OFF IT. Sizing a label by `length * size * a
   guessed factor` is what the first pass did, and in a hand face it is wrong for nearly every
   name: "Taylor Swift" and "evermore" and "Red" all came out with a tail of blank paper hanging
   off the right, because the factor has to be generous enough for the widest string it will ever
   meet. A canvas measures the actual run instead, so every strip ends where its writing does.

   The fallback matters as much as the measurement. If Caveat has not arrived yet, `measureText`
   silently answers in whatever face the browser substituted, so the check below refuses to trust
   it until the font is really loaded and goes back to a count in the meantime — a slightly loose
   strip for the first render is nothing; a strip measured for the wrong face is a name that runs
   off its own paper. `renderTrackPicker` draws again when the fonts settle. */
const NAME_SIZES = [20, 17, 15, 13, 11.5];
const NAME_PAD = 10;          // paper before the writing
const NAME_TAIL = 15;         // and after it: enough blank to read the name as flush left
const NAME_ROOM = 146;        // how much of a 160-wide card a label may take

let measurer = null;
function textWidth(text, fs) {
  try {
    if (typeof document === "undefined") return null;
    if (!document.fonts || !document.fonts.check(`${fs}px Caveat`)) return null;
    measurer = measurer || document.createElement("canvas").getContext("2d");
    measurer.font = `${fs}px Caveat, cursive`;
    const w = measurer.measureText(text).width;
    return w > 0 ? w : null;
  } catch (e) { return null; }
}

/* ONE SIZE FOR THE WHOLE BOARD, and it is the largest step every record fits at.
   Sizing each name on its own was the first pass and it is the thing you notice: twelve cards
   in three or four different hands, with the shortest record lettered biggest for no reason a
   player could name. A board is one object, so it gets one size, and the longest name is what
   sets it. It is still computed rather than written down, so a record renamed — or a thirteenth
   one — moves the whole board down a step instead of quietly running off its own paper. */
export function commonNameSize(labels) {
  for (const fs of NAME_SIZES) {
    if (labels.every((l) => nameWidth(l, fs) + NAME_PAD + NAME_TAIL <= NAME_ROOM)) return fs;
  }
  return NAME_SIZES[NAME_SIZES.length - 1];
}
function nameWidth(label, fs) {
  const w = textWidth(label, fs);
  return w == null ? label.length * fs * 0.46 : w;
}

/* The name to letter across a sleeve. The Anthology loses its article, which was costing it a
   whole type size on the longest name on the board. */
const SLEEVE_NAMES = {
  "The Tortured Poets Department": "Tortured Poets",
  "The Life of a Showgirl": "Showgirl",
};
export function sleeveName(album) { return SLEEVE_NAMES[album] || album; }

let uid = 0;

/* ---------- a sleeve ----------
   `album` is the record's real name, `colour` its era colour as the LIVE palette gives it (so
   the colour-blind setting reaches the board like it reaches everything else), and `time` the
   formatted best, or nothing at all. The clip is what keeps the card's four edges crisp while
   every contour inside it is torn: shapes are authored over the edge of the field and cut off
   at the fold. Its id is counted rather than derived from the album, because a board may draw
   the same record twice and two nodes cannot share one. */
export function albumSleeve(album, colour, time, size, extra = "") {
  const r = rng(seedOf("sleeve:" + album));
  const C = stockOf(colour || "#999999");
  const art = (MOTIFS[motifOf(album)] || MOTIFS.rings)(r, C);
  const label = sleeveName(album);
  const fs = size || commonNameSize([label]);
  const lw = nameWidth(label, fs) + NAME_PAD + NAME_TAIL;
  const id = `sl${++uid}`;

  let s = sheet([[-6, -6], [W + 6, -6], [W + 6, H + 6], [-6, H + 6]], C.ground, r, { amp: 1.6, shadow: false });
  s += art;
  s += sheet([[8, 64], [8 + lw, 60], [9 + lw, 94], [9, 98]], "#f2ead8", r, { amp: 1.2, sy: 2, sx: 1.4 });
  s += `<text x="${(8 + NAME_PAD).toFixed(1)}" y="84" font-family="Caveat"` +
       ` font-size="${fs}" fill="#2b2722">${escapeHtml(label)}</text>`;
  if (time) {
    /* The time's label is measured off the time, for the same reason the name's is. A board
       seeded with an hour on it is what found this: "2:41.20" sits comfortably in a fixed strip
       and "12:41.20" does not, and a thirty-one-track record is entirely capable of taking ten
       minutes. The strip grows leftward off its right edge so the head of every card lines up. */
    const tfs = time.length > 8 ? 13 : 16;
    const measured = textWidth(time, tfs);
    const tw = Math.min(88, (measured == null ? time.length * tfs * 0.5 : measured) + 16);
    const x0 = 154 - tw;
    s += sheet([[x0, 6], [154, 3], [155, 28], [x0 + 1, 32]], "#f2ead8", r, { amp: 1.0, sy: 1.8 });
    s += `<text x="${(x0 + tw / 2).toFixed(1)}" y="23" text-anchor="middle" font-family="Caveat"` +
         ` font-size="${tfs}" fill="#2b2722">${escapeHtml(time)}</text>`;
  }
  s += grain(r, 300, W + 6, H + 6);

  return `<svg class="tbt-art${extra ? " " + extra : ""}" viewBox="0 0 ${W} ${H}" aria-hidden="true">` +
    `<defs><clipPath id="${id}"><rect x="0" y="0" width="${W}" height="${H}" rx="1.5"/></clipPath></defs>` +
    `<g clip-path="url(#${id})">${s}</g></svg>`;
}
