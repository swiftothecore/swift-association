// The bonus shelf's keepsake: the back of the record sleeve, taped to a notebook page and
// rasterised to a PNG. It is the exact object the end card already shows on screen — the
// pressing, the score, the one-line remark, the ten tracks with a tick or a cross in the
// margin — because a bonus run has no bracelet and no records board by design, and that
// track listing IS the run's only souvenir.
//
// Pure of app state, like braceletcard.js: the caller hands over the already-rendered disc
// markup, the sprite pieces it points at, the log and the live colour tokens. Everything
// else — fonts, measuring, tape, rasterising, the two ways out — is borrowed from the
// bracelet's workshop rather than copied.

import {
  fontFaceCss, esc, measureText, fitText, washiTape, TAPE_DEFS,
  rasterisePng, downloadPng, copyPng,
} from "./braceletcard.js";

const W = 760, H = 514;
const SX = 70, SY = 74, SW = 620;         // the sleeve on the page
const SL = SX + 26, SR = SX + SW - 26;    // its writing column
const COL_GAP = 24, COL_W = (SR - SL - COL_GAP) / 2;
const ROW_TOP = 226, ROW_H = 30, ROWS = 5;
const SB = 422;                           // the sleeve's bottom edge

const RED = "rgba(160,62,46,0.82)";
const GOLD = "#a9791f";

// Mix a hex tint toward the ink, the way the on-screen kicker does with color-mix() —
// which is a CSS function an <img>-rasterised SVG will not evaluate, so it is done in
// arithmetic here instead. Falls back to the tint untouched if it isn't a plain hex.
function towardInk(hex, amount) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mixed = [16, 8, 0].map((s, i) => {
    const c = (n >> s) & 255;
    const ink = [0x2b, 0x27, 0x22][i];
    return Math.round(c * amount + ink * (1 - amount));
  });
  return "#" + mixed.map((c) => c.toString(16).padStart(2, "0")).join("");
}

// The same tint as a translucent wash, for the strip of tape pinning the sleeve down:
// the tape is a colour laid OVER the kraft, so it has to keep its alpha.
function tintWash(hex, alpha) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return `rgba(201,178,122,${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

// The disc, nested and scaled into place (its own viewBox is 140x140). Its class is
// dropped: the card re-declares what little of it matters in its own <style>.
function discMark(markup, x, y, size) {
  if (!markup) return "";
  return markup.replace("<svg ", `<svg x="${x}" y="${y}" width="${size}" height="${size}" `);
}

// The heart-hands emblem, re-tinted and placed — the bracelet card's own trick, kept here
// rather than exported because the two cards want different boxes.
function heartHandsMark(markup, x, y, w, h, fill) {
  if (!markup) return "";
  return markup
    .replace('class="np-hands" ', "")
    .replace('width="52"', `width="${w}"`)
    .replace('height="42"', `height="${h}"`)
    .replace('fill="currentColor"', `fill="${fill}"`)
    .replace("<svg ", `<svg x="${x}" y="${y}" `);
}

// The rubber stamp pressed across the sleeve's corner ("clean sweep" / "new best"). Sized
// off the measured text so a two-word stamp and a three-word one both sit in their box.
// The tilt turns about the box's CENTRE, the way the on-screen .bg-stamp's CSS rotate()
// does. An SVG rotate() with no centre given turns about the local origin, which after the
// translate is the box's top-left corner, so the far end of the stamp was swung up by the
// box's own width — clear of the sleeve on a wide stamp, less so on a narrow one, which is
// how the same rule produced two different-looking stamps.
function stamp(text, rightX, topY) {
  const font = '700 9.5px "Courier Prime", monospace';
  const tw = measureText(text.toUpperCase(), font) + text.length * 2.2;   // + letter-spacing
  const bw = tw + 16, bh = 20;
  return `<g transform="translate(${(rightX - bw).toFixed(1)} ${topY}) rotate(-7 ${(bw / 2).toFixed(1)} ${bh / 2})">` +
    `<rect width="${bw.toFixed(1)}" height="${bh}" rx="2" fill="none" stroke="rgba(160,62,46,0.6)" stroke-width="1.4"/>` +
    `<text x="${(bw / 2).toFixed(1)}" y="13.6" text-anchor="middle" font-family="Courier Prime" font-weight="700"` +
    ` font-size="9.5" letter-spacing="2.2" fill="rgba(160,62,46,0.74)">${esc(text.toUpperCase())}</text>` +
  `</g>`;
}

const TICK = `<path d="M3 8.6 L6.4 12 L13 4.6" fill="none" stroke="#c7951f" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>`;
const CROSS = `<path d="M4 4 L12 12 M12 4 L4 12" fill="none" stroke="#b23a3f" stroke-width="2" stroke-linecap="round"/>`;

// One line of the track listing, laid out right to left: the mark holds the margin, the
// note takes what it needs, and the TITLE gives way last — a clipped song name is worse
// than a clipped one-word note, which is the same call the on-screen sleeve makes in CSS.
function track(t, x, baseline, v) {
  const noteFont = '9.5px "Courier Prime", monospace';
  // The note is trimmed FIRST and then measured, letter-spacing included, so the width the
  // title is asked to keep clear is the width actually drawn. Reserving the untrimmed
  // measurement instead let a clipped note eat its own gap and touch the song title.
  const note = t.note ? fitText(String(t.note).toUpperCase(), noteFont, 80) : "";
  const noteW = note ? measureText(note, noteFont) + note.length * 0.7 : 0;
  const markX = x + COL_W - 15;
  const noteX = markX - 8;
  const titleX = x + 24;
  const titleMax = Math.max(40, noteX - (noteW ? noteW + 12 : 0) - titleX);
  const titleFont = '18px Caveat, cursive';
  return `<text x="${x}" y="${baseline}" font-family="Courier Prime" font-size="10" fill="${v.inkSoft}">${esc(t.n)}</text>` +
    `<text x="${titleX}" y="${baseline}" font-family="Caveat" font-size="18" fill="${t.ok ? v.ink : v.inkSoft}">` +
      `${esc(fitText(t.title, titleFont, titleMax))}</text>` +
    (note
      ? `<text x="${noteX.toFixed(1)}" y="${baseline - 1}" text-anchor="end" font-family="Courier Prime" font-size="9.5"` +
        ` letter-spacing="0.7" fill="${t.ok ? v.inkSoft : RED}">${esc(note)}</text>`
      : "") +
    `<svg x="${markX}" y="${baseline - 13}" width="15" height="15" viewBox="0 0 16 16">${t.ok ? TICK : CROSS}</svg>` +
    `<line x1="${x}" y1="${baseline + 6}" x2="${x + COL_W}" y2="${baseline + 6}"` +
      ` stroke="${v.inkSoft}" stroke-width="1" stroke-dasharray="1 3" opacity="0.5"/>`;
}

export function buildSleeveSVG(meta, fontCss) {
  const v = meta.vars;
  const tint = meta.tint || "#4a8c87";

  // faint ruled feint across the page, under everything
  let rules = "";
  for (let y = 44; y < H - 20; y += 30) {
    rules += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${v.rule}" stroke-width="1"/>`;
  }

  // ---- the sleeve's head: pressing, titles, and the run's number
  const headTop = SY + 26;
  const titleX = SL + 78 + 18;
  const scoreFont = '700 52px Caveat, cursive';
  const scoreW = measureText(meta.score, scoreFont) + (meta.scoreSub ? measureText(meta.scoreSub, '700 22px Caveat, cursive') : 0);
  const titleMax = Math.max(120, SR - scoreW - 22 - titleX);

  const head =
    discMark(meta.disc, SL, headTop, 78) +
    `<text x="${titleX}" y="${headTop + 12}" font-family="Courier Prime" font-weight="700" font-size="10.5"` +
      ` letter-spacing="2" fill="${towardInk(tint, 0.78)}">${esc(String(meta.kicker).toUpperCase())}</text>` +
    `<text x="${titleX}" y="${headTop + 44}" font-family="Caveat" font-weight="700" font-size="32" fill="${v.ink}">` +
      `${esc(fitText(meta.name, '700 32px Caveat, cursive', titleMax))}</text>` +
    `<text x="${titleX}" y="${headTop + 62}" font-family="Courier Prime" font-size="12" fill="${v.inkSoft}">` +
      `${esc(fitText(meta.remark, '12px "Courier Prime", monospace', titleMax))}</text>` +
    (meta.aside
      ? `<text x="${titleX}" y="${headTop + 78}" font-family="Courier Prime" font-size="9.5" letter-spacing="1.4"` +
        ` fill="${v.inkSoft}" opacity="0.75">${esc(String(meta.aside).toUpperCase())}</text>` : "") +
    `<text x="${SR}" y="${headTop + 56}" text-anchor="end" font-family="Caveat" font-weight="700" font-size="52" fill="${v.ink}">` +
      `${esc(meta.score)}${meta.scoreSub ? `<tspan font-size="22" fill="${v.inkSoft}">${esc(meta.scoreSub)}</tspan>` : ""}</text>` +
    `<line x1="${SL}" y1="${SY + 120}" x2="${SR}" y2="${SY + 120}" stroke="rgba(43,39,34,0.16)" stroke-width="1.5"/>`;

  // ---- the track listing: two columns of five, read down then across, as on screen
  const tracks = (meta.tracks || []).slice(0, ROWS * 2).map((t, i) => {
    const col = i < ROWS ? 0 : 1;
    const x = SL + col * (COL_W + COL_GAP);
    const baseline = ROW_TOP + ROW_H * (i % ROWS) + 19;
    return track(t, x, baseline, v);
  }).join("");
  const lastRow = ROW_TOP + ROW_H * (ROWS - 1) + 19;

  // ---- signature and footer, on the page below the sleeve (the bracelet card's bottom row)
  const sigY = H - 46;
  let sig = "";
  if (meta.signature) {
    const nameW = measureText(meta.signature, "700 34px Caveat");
    sig = `<g transform="rotate(-3 74 ${sigY})">` +
      `<text x="74" y="${sigY}" font-family="Caveat" font-weight="700" font-size="34" fill="${GOLD}">${esc(meta.signature)}</text>` +
      heartHandsMark(meta.heartHands, 74 + nameW + 14, sigY - 30, 46, 37, GOLD) +
    `</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<defs><style>${fontCss}` +
      `.bd-pencil{font-family:Caveat,cursive;fill:#4a4238}` +
      `.bd-stamp-type{font-family:"Courier Prime",monospace}` +
    `</style>` + TAPE_DEFS + meta.discDefs + `</defs>` +
    `<rect width="${W}" height="${H}" fill="${v.paper}"/>` +
    rules +
    `<line x1="54" y1="0" x2="54" y2="${H}" stroke="${v.margin}" stroke-width="2"/>` +
    `<text x="74" y="46" font-family="Courier Prime" font-weight="700" font-size="12" letter-spacing="2.6" fill="${v.inkSoft}">` +
      `${esc(String(meta.eyebrow).toUpperCase())}</text>` +
    // the sleeve itself, taped to the page in the game's own colour
    `<rect x="${SX}" y="${SY}" width="${SW}" height="${SB - SY}" rx="3" fill="rgba(251,247,234,0.94)"` +
      ` stroke="rgba(43,39,34,0.18)" stroke-width="1"/>` +
    head +
    `<text x="${SL}" y="${ROW_TOP - 12}" font-family="Courier Prime" font-size="9.5" letter-spacing="1.8"` +
      ` fill="${v.inkSoft}">THE RUN, TRACK BY TRACK</text>` +
    tracks +
    `<text x="${(SL + SR) / 2}" y="${lastRow + 30}" text-anchor="middle" font-family="Courier Prime" font-size="10"` +
      ` letter-spacing="0.9" fill="${v.inkSoft}">${esc(meta.foot)}</text>` +
    (meta.stamp ? stamp(meta.stamp, SX + SW - 6, SY - 12) : "") +
    washiTape(W / 2 - 44, SY - 13, 88, 26, -2.4, 0, tintWash(tint, 0.4)) +
    sig +
    `<text x="${SX + SW - 4}" y="${sigY}" text-anchor="end" font-family="Courier Prime" font-size="12"` +
      ` letter-spacing="0.4" fill="${v.inkSoft}">${esc(meta.footer)}</text>` +
  `</svg>`;
}

export async function renderSleevePng(meta) {
  return rasterisePng(buildSleeveSVG(meta, await fontFaceCss()), W, H);
}

export function exportSleeveCard(meta) { return downloadPng(() => renderSleevePng(meta), meta.filename || "sleeve.png"); }
export function copySleeveCard(meta)   { return copyPng(() => renderSleevePng(meta)); }
