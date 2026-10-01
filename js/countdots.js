/* ---------- The count's dots ----------
   "twenty-one songs do", and then the twenty-one songs: one dot per song that holds the page's
   word, in discography order, in its album's colour. Pure: it is handed the songs, the whole
   corpus in order, a colour for a song and the width it may take, and hands back an <svg>.
   The board this was picked from is scripts/ui/song-count-dots.html (option A), and the
   overflow from scripts/ui/song-count-dots-overflow.html (option 4).

   TWO SHAPES, ONE RULE. While the dots fit on the label's line they are a STRIP, each one as
   big as its song is long (lyric word count; the corpus carries no runtimes), with area rather
   than diameter carrying the length. A word like "love" holds well over a hundred songs, and a
   strip of those either wraps into a wall or shrinks to dust, so past one line the drawing
   turns into TRACKLISTS: every album that holds the word prints its whole running order as a
   block of faint rings, and inks the songs that sing it. The size gives way to the proportion,
   which is the true thing at that count ("nearly all of Red"), and the block can never be
   wider than the catalogue, so it is laid out to the width it is given (more rows when the
   page is narrow) instead of hoping it fits. Discography order holds in both shapes.

   Every dot is a flat circle of one colour, nudged a hair off the grid by a seeded hand so a
   row reads as placed ink rather than a chart, and the same word always draws the same way. */

import { mulberry32, fnv1a } from "./util.js";

const GAP = 2;              // between strip dots
const R_LO = 1.8, R_HI = 5.2;
const STRIP_H = 2 * R_HI + 1;
const TL_R = 1.7;           // a tracklist cell's dot
const TL_P = 4.3;           // its pitch
const TL_ALBUM_GAP = 4;     // between one album's block and the next
const TL_ROWS_MIN = 3, TL_ROWS_MAX = 12;

const words = (s) => (s.lyrics.match(/\S+/g) || []).length;

function hand(seed) {
  const r = mulberry32(fnv1a(seed));
  return (amp) => (r() - 0.5) * amp;
}

function circle(cx, cy, r, fill, j, title) {
  return `<circle cx="${(cx + j(0.6)).toFixed(2)}" cy="${(cy + j(0.8)).toFixed(2)}"` +
    ` r="${(r * (1 + j(0.12))).toFixed(2)}" fill="${fill}"><title>${title}</title></circle>`;
}

// Group a corpus into its albums, keeping both the album order and each running order.
function albumsOf(corpus) {
  const groups = [], at = new Map();
  for (const s of corpus) {
    if (!at.has(s.album)) { at.set(s.album, groups.length); groups.push({ album: s.album, songs: [] }); }
    groups[at.get(s.album)].songs.push(s);
  }
  return groups;
}

const tracklistWidth = (groups, rows) =>
  groups.reduce((w, g) => w + Math.ceil(g.songs.length / rows) * TL_P + TL_ALBUM_GAP, -TL_ALBUM_GAP);

/* Lay the dots for `hits` out in `width` px, or as narrowly as they go. `fallbackWidth` is the
   room on a line of their own, for when even the tallest tracklist won't fit beside the label.
   Returns { svg, below }: `below` says the drawing wants its own line under the label. */
export function countDots(hits, corpus, { width, fallbackWidth, colour, title, seed }) {
  if (!hits.length || !corpus.length) return { svg: "", below: false };
  const order = new Map(corpus.map((s, i) => [s, i]));
  const sorted = hits.filter((s) => order.has(s)).sort((a, b) => order.get(a) - order.get(b));
  const j = hand(seed);

  const lens = corpus.map(words);
  const lo = Math.min(...lens), span = Math.max(1, Math.max(...lens) - lo);
  const radius = (s) => R_LO + (R_HI - R_LO) * Math.sqrt((words(s) - lo) / span);
  const radii = sorted.map(radius);
  const stripW = radii.reduce((w, r) => w + 2 * r + GAP, -GAP);

  if (stripW <= width) {
    let x = 0, out = "";
    sorted.forEach((s, i) => {
      const r = radii[i];
      out += circle(x + r, STRIP_H / 2, r, colour(s), j, title(s));
      x += 2 * r + GAP;
    });
    return { svg: wrap(Math.ceil(stripW + 1), STRIP_H, out), below: false };
  }

  const held = new Set(sorted);
  const groups = albumsOf(corpus).filter((g) => g.songs.some((s) => held.has(s)));
  let rows = TL_ROWS_MIN, below = false;
  while (rows < TL_ROWS_MAX && tracklistWidth(groups, rows) > width) rows++;
  if (tracklistWidth(groups, rows) > width) {
    below = true;
    rows = TL_ROWS_MIN;
    while (rows < TL_ROWS_MAX && tracklistWidth(groups, rows) > fallbackWidth) rows++;
  }
  let x = 0, out = "";
  for (const g of groups) {
    g.songs.forEach((s, i) => {
      const cx = x + Math.floor(i / rows) * TL_P + TL_R + 0.5;
      const cy = (i % rows) * TL_P + TL_R + 0.5;
      out += held.has(s)
        ? circle(cx, cy, TL_R, colour(s), j, title(s))
        : `<circle class="cd-rest" cx="${cx}" cy="${cy}" r="${TL_R - 0.4}" stroke="${colour(s)}"/>`;
    });
    x += Math.ceil(g.songs.length / rows) * TL_P + TL_ALBUM_GAP;
  }
  return { svg: wrap(Math.ceil(x - TL_ALBUM_GAP + 1), rows * TL_P + 1, out), below };
}

function wrap(w, h, inner) {
  return `<svg class="count-dots" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${inner}</svg>`;
}
