"use strict";
/* The word cloud's layout — pure, state-free, and the only place in the project that
   measures text before drawing it.

   A cloud is packed from the middle out: the biggest word lands at the centre, and every
   word after it walks an Archimedean spiral outwards until it finds a gap it fits in. The
   spiral is stretched on x, so the finished cloud is a wide block rather than a disc, which
   is the shape a notebook page wants.

   WHAT IS COLLIDED IS INK, NOT BOXES. Each word is rasterised to a 1-bit mask of the pixels
   its letters actually cover, and a candidate spot is rejected only where ink would touch
   ink. That is what lets a word nest into the hollow under another word's descender instead
   of being held off by the empty corner of its bounding box, and it is the whole difference
   between a cloud that reads as packed and one that reads as a grid with the lines rubbed
   out. It costs a canvas and about eighty lines; the alternative was a 300KB dependency on
   d3 and d3-cloud, which this project has never had an equivalent of and does not need one
   game to start.

   Two cheap things keep it fast enough to lay out a page on a keypress: a bounding-box
   pre-check that accepts the common case (nothing placed is anywhere near) without reading a
   single pixel, and the fact that the spiral houses most words within a few hundred steps.
   A ten-page run lays out in a few milliseconds a page.

   Sizing is the SQUARE ROOT of the weight. A word is read by the area of its ink, so a
   linear ramp makes a word sung six times look six times heavier than one sung once, which
   is a lie about the song. */

const BOARD_W = 1800, BOARD_H = 1000;   // the plane the spiral walks, in layout pixels
// Ink kept this far apart, by dilating every mask. At 2 the packing is tighter but
// neighbouring words start reading as one word, which costs more than the density buys.
const GAP = 4;
const STEP = 0.25, GROWTH = 1.1, ASPECT = 1.9;
/* THE TYPE SCALE IS DERIVED FROM THE BOX, not fixed. A cloud is packed at whatever sizes it
   is given and then fitted to the width it has, so a fixed scale means the fit is doing all
   the work — and the fit is the wrong tool for it. A page whose words are mostly at the floor
   packs into a small block, which the fit then blows up, and the two biggest words come out
   enormous while everything else stays tiny. Sizing off the box keeps the same cloud at every
   width and leaves the fit to do the small correction it is for.
   The ratio is measured rather than chosen: 0.13 of the width is about as big as the top word
   can be before a long one ("should've", "disappointments") is wider than the page on its own. */
const TOP_OF_BOX = 0.13, FLOOR_RATIO = 0.3;
const PT_CEILING = 82, PT_FLOOR = 11;
const DESIGN_W = 880;
const MAX_TILT = 3.5;                   // degrees; a hand-written page is never quite square
const SPIRAL_STEPS = 30000;

// One canvas for the whole module: it is resized per word, read, and thrown away. Nothing
// is ever drawn to the screen from it.
let ctx = null;
function scratch() {
  if (!ctx) ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  return ctx;
}

function font(pt) { return `600 ${pt}px Caveat, cursive`; }

/* Is the handwriting face actually here yet? Measuring against a fallback would pack the
   page to the wrong widths, and the gaps that opens are exactly the ones the masks exist to
   close. The caller re-packs when this turns true. */
export function cloudFontReady() {
  try { return document.fonts.check(font(40)); } catch { return true; }
}

function sizes(words, width) {
  const max = Math.min(PT_CEILING, width * TOP_OF_BOX);
  const min = Math.max(PT_FLOOR, max * FLOOR_RATIO);
  const hi = Math.sqrt(words[0].count), lo = Math.sqrt(words[words.length - 1].count);
  const span = (hi - lo) || 1;
  return words.map((w) => {
    const t = (Math.sqrt(w.count) - lo) / span;
    return { ...w, t, pt: min + (max - min) * t };
  });
}

/* One word, rasterised to the pixels it inks. The ink is centred in its own little canvas so
   the caller only ever has to think about where the middle of a word goes. */
function sprite(word, pt, rot) {
  const c = scratch();
  c.font = font(pt);
  const m = c.measureText(word);
  const L = m.actualBoundingBoxLeft, R = m.actualBoundingBoxRight;
  const A = m.actualBoundingBoxAscent, D = m.actualBoundingBoxDescent;
  const rad = rot * Math.PI / 180, co = Math.abs(Math.cos(rad)), si = Math.abs(Math.sin(rad));
  const w = Math.ceil((L + R) * co + (A + D) * si) + GAP * 2 + 2;
  const h = Math.ceil((L + R) * si + (A + D) * co) + GAP * 2 + 2;
  c.canvas.width = w;
  c.canvas.height = h;
  c.font = font(pt);            // resizing a canvas resets its context
  c.fillStyle = "#000";
  c.save();
  c.translate(w / 2, h / 2);
  c.rotate(rad);
  c.fillText(word, -(R - L) / 2, -(D - A) / 2);
  c.restore();
  const px = c.getImageData(0, 0, w, h).data;
  const raw = new Uint8Array(w * h);
  for (let i = 0, n = w * h; i < n; i++) if (px[i * 4 + 3] > 24) raw[i] = 1;
  return { mask: dilate(raw, w, h, GAP), w, h };
}

// Fatten a mask by r pixels all round, which is how the GAP between two words is kept
// without any of the placement code knowing about it.
function dilate(mask, w, h, r) {
  if (!r) return mask;
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -r; dy <= r; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -r; dx <= r; dx++) {
          const xx = x + dx;
          if (xx >= 0 && xx < w) out[yy * w + xx] = 1;
        }
      }
    }
  }
  return out;
}

function fits(board, boxes, sp, x, y) {
  let near = false;
  for (const b of boxes) {
    if (x < b[2] && b[0] < x + sp.w && y < b[3] && b[1] < y + sp.h) { near = true; break; }
  }
  if (!near) return true;      // nothing placed is even close; the pixels cannot disagree
  for (let dy = 0; dy < sp.h; dy++) {
    const row = (y + dy) * BOARD_W + x, mrow = dy * sp.w;
    for (let dx = 0; dx < sp.w; dx++) {
      if (sp.mask[mrow + dx] && board[row + dx]) return false;
    }
  }
  return true;
}

function pack(items, rng) {
  const board = new Uint8Array(BOARD_W * BOARD_H), boxes = [], out = [];
  const cx = BOARD_W / 2, cy = BOARD_H / 2;
  for (const it of items) {
    const rot = (rng() * 2 - 1) * MAX_TILT;
    const sp = sprite(it.word, it.pt, rot);
    for (let i = 0; i < SPIRAL_STEPS; i++) {
      const a = i * STEP, r = GROWTH * STEP * i;
      const x = Math.round(cx + Math.cos(a) * r * ASPECT - sp.w / 2);
      const y = Math.round(cy + Math.sin(a) * r - sp.h / 2);
      if (x < 1 || y < 1 || x + sp.w >= BOARD_W || y + sp.h >= BOARD_H) continue;
      if (!fits(board, boxes, sp, x, y)) continue;
      for (let dy = 0; dy < sp.h; dy++) {
        const row = (y + dy) * BOARD_W + x, mrow = dy * sp.w;
        for (let dx = 0; dx < sp.w; dx++) if (sp.mask[mrow + dx]) board[row + dx] = 1;
      }
      boxes.push([x, y, x + sp.w, y + sp.h]);
      out.push({ ...it, rot, cx: x + sp.w / 2, cy: y + sp.h / 2, sw: sp.w, sh: sp.h });
      break;
    }
  }
  return out;
}

/* Where to hang a <span> so its INK lands where the sprite put it. A span's box is not its
   ink: it is as wide as the advance and as tall as the font size, and the baseline sits
   wherever the font's own metrics put it. Both offsets fall out of the metrics, and without
   them every word drifts a few pixels off its packed position — which is exactly enough to
   reopen the gaps the masks just closed. */
function inkOffset(word, pt) {
  const c = scratch();
  c.font = font(pt);
  const m = c.measureText(word);
  return {
    x: (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2 - m.width / 2,
    y: (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2
       + (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2,
  };
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* The whole page: words in, absolutely-positioned spans out, already fitted to `width`.

   Scaling is allowed to go UP as well as down. A fifteen-word cloud packs into a small
   block, and left at its natural size it sits marooned in the middle of a wide sheet, which
   reads as an accident rather than as a composition. Capped so a thin page is not a
   billboard. */
export function cloudMarkup(words, opts = {}) {
  const width = Math.max(240, opts.width || DESIGN_W);
  const rng = opts.rng || Math.random;
  if (!words || !words.length) return { html: "", height: 0 };
  const placed = pack(sizes(words, width), rng);
  if (!placed.length) return { html: "", height: 0 };

  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of placed) {
    x0 = Math.min(x0, p.cx - p.sw / 2); x1 = Math.max(x1, p.cx + p.sw / 2);
    y0 = Math.min(y0, p.cy - p.sh / 2); y1 = Math.max(y1, p.cy + p.sh / 2);
  }
  const cw = x1 - x0, ch = y1 - y0;
  // A small correction only, now that the type is sized off the box: the packing cannot know
  // in advance how a particular set of words will tessellate, and this takes up the slack.
  const scale = Math.max(0.55, Math.min(1.15, width / cw));

  const html = placed.map((p) => {
    const off = inkOffset(p.word, p.pt);
    const left = ((p.cx - x0 - off.x) * scale).toFixed(1);
    const top = ((p.cy - y0 - off.y) * scale).toFixed(1);
    // The tail of the cloud is lighter than its head, which is the second reading of the
    // same number the size already says. It never goes far enough to be unreadable.
    const ink = (0.55 + 0.45 * p.t).toFixed(2);
    return `<span class="bg-cloud-word" style="left:${left}px;top:${top}px;` +
      `font-size:${(p.pt * scale).toFixed(1)}px;` +
      `transform:translate(-50%,-50%) rotate(${p.rot.toFixed(1)}deg);opacity:${ink}">` +
      `${esc(p.word)}</span>`;
  }).join("");

  return { html, height: Math.round(ch * scale), width: Math.round(cw * scale) };
}
