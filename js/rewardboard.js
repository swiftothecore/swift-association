/* The Mastery page's reward board: every reward family drawn as the object it would come in.
   Pure and state-free, like passport.js: app.js reads the ledger and settings, hands this module
   one plain object `D` (see buildRewardBoard in app.js), and gets markup back. Nothing here
   reads storage, and every choice is wired by app.js through the attributes it already owns:
   data-reward (+ data-variant), data-reward-reset, data-reward-random, data-open-set-picker,
   and the three doors (data-open-brutal, data-open-sticker-shelf, data-open-secret-charms).

   One rule ties the objects to the passport above them: each reward wears the stamp that opened
   it. A single-level object carries the passport's real stamp beside its name (passportStamp), a
   member of a ladder (a tape roll, a title rank) carries that stamp's outline and number (passportGhost,
   inked), and anything still owed carries the pencil tracing exactly as its passport slot does.
   What the player is wearing is marked by the object itself, never by a mark laid over it: the
   tape in use has its end pulled off the roll and hanging, the stock you write on keeps its place in the
   fan and the others swing back off it on the rivet, the charm you wear hangs from a bead on its safety pin, the button is sewn over a square of
   gingham, and the words in use are the one real button among charcoal sketches. (It used to be the editor's red pen looped
   round each one, and a page of red rings read as corrections rather than choices.)

   Objects with a material of their own (denim, a cassette, leather, card stock) keep
   its colours at night, the way the start-button finishes do; only what is ink on the page
   follows the theme. The styles are the REWARD BOARD block in styles.css. */
import { MASTERY_REWARDS, MASTERY_TILE_MARKS, MASTERY_ICONS, MASTERY_TITLES, MASTERY_TIER_ICONS, CTA_LABELS } from "./config.js";
import { passportStamp, passportGhost, passportTracing, passportStampInk } from "./passport.js";
import { TAPE_PRINTS } from "./tapeprints.js";
import { beadPreviewSVG } from "./bracelet.js";
import { hangTrinket, trinketHoleY } from "./trinkets.js";
import { stickerArt } from "./stickers.js";
import { ctaSketch } from "./ctasketch.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const T = MASTERY_TILE_MARKS;
const ofKind = (k) => MASTERY_REWARDS.filter((r) => r.kind === k);
// A fixed wobble per seed, so nothing reshuffles when the page redraws.
const settle = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const jit = (k, span) => (settle(k) * 2 - 1) * span;
const reached = (D, L) => D.issued && D.level >= L;

/* ---------------- shared pieces ---------------- */
// The stamp that opened a reward, beside the object's name: the real one once reached, the
// passport's own pencil tracing while it is owed. The id prefix is per instance, because the
// passport above holds the same stamps and a textPath must never point at another copy.
function stamp(D, L) {
  const on = reached(D, L);
  const svg = on ? passportStamp(L, D.dates[L] || "", `rw${++D.uid}x`) : passportTracing(L, null, `rw${++D.uid}x`);
  return `<span class="rw-stamp ${on ? "on" : "owed"}" aria-hidden="true">${svg}</span>`;
}
// A ladder member's stamp in short: the same outline at the same tilt with its level in it,
// inked in the stamp's colour. Built from passportGhost so the shape can never drift.
function tag(D, L, cls = "") {
  const on = reached(D, L);
  return `<span class="rw-tag ${on ? "on" : "owed"}${L === 13 ? " wide" : ""} ${cls}" style="--si:${passportStampInk(L)}" aria-hidden="true">${passportGhost(L)}</span>`;
}
// The randomiser, as a matchbox of dice you shake. A red safety-match sleeve with the front
// page's two thrown dice (#randomGear in index.html: the front die knocks a hole in the back one)
// printed on its label. While random is worn the kraft tray is slid out of the sleeve's end with
// the dice sitting in it. BOTH states are drawn in the one SVG and `.on` moves between them, so
// slideMatchbox (app.js) can play the change after the page re-renders. Toggles, since while it
// is worn nothing else is "in use". Designed on scripts/mastery/shake-board.html.
const mbDice = (x, y, s, knock) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke="#2b2722" stroke-width="1.8" stroke-linejoin="round">` +
  `<g transform="rotate(-13 8.2 8.6)"><rect x="2" y="2.4" width="12.4" height="12.4" rx="2.8" fill="none"/><circle cx="8.2" cy="8.6" r="1.5" fill="#2b2722" stroke="none"/></g>` +
  `<g transform="rotate(12 15.6 15.4)"><rect x="9.4" y="9.2" width="12.4" height="12.4" rx="2.8" fill="${knock}"/>` +
  `<g fill="#2b2722" stroke="none"><circle cx="12.9" cy="12.7" r="1.35"/><circle cx="15.6" cy="15.4" r="1.35"/><circle cx="18.3" cy="18.1" r="1.35"/></g></g></g>`;
// Sleeve 82 wide, tray showing 24 past its end once out. The tray rides 25 to the left, hidden
// under the sleeve, while the box is shut. Both strings are fixed, so they are built once.
const MATCHBOX_ART = `<svg class="mb" viewBox="0 1.8 108 34.2" aria-hidden="true">` +
  `<g class="mb-tray"><path class="mb-tray-o" d="M52 5.6 L104.6 5.2 Q106 5.2 106 6.6 L106.2 28.4 L52.4 28.8 Z"/>` +
  `<path class="mb-tray-f" d="M55 8.8 L102.6 8.5 L102.8 25.6 L55 25.9 Z"/>` +
  `<path class="mb-tray-s" d="M52.4 28.8 L106.2 28.4 L106.1 32.2 Q106.1 33.2 105 33.2 L52.6 33.6 Z"/>${mbDice(83.8, 7.2, 0.76, "#cfa877")}</g>` +
  `<g class="mb-sleeve"><path class="mb-top" d="M2.4 4.6 Q2.4 3.2 3.9 3.2 L80.4 2.7 Q82 2.7 82 4.2 L82.3 28.6 L2.6 29.2 Z"/>` +
  `<path class="mb-side" d="M2.6 29.2 L82.3 28.6 L82.2 33 Q82.2 34.4 80.8 34.4 L4 34.9 Q2.6 34.9 2.6 33.5 Z"/>` +
  `<path class="mb-grit" d="M8 31.2 h1.2 M16.8 32.3 h1 M25.6 31.2 h1 M31.7 32.3 h1.2 M40.5 31.2 h1 M49.3 32.3 h1 M55.4 31.2 h1.2 M64.3 32.3 h1 M73.1 31.2 h1"/>` +
  `<rect class="mb-lab" x="6.4" y="6.6" width="70.2" height="18.6" rx="1.2"/><rect class="mb-rule" x="8.5" y="8.7" width="66" height="14.4" rx=".6"/>` +
  `${mbDice(10.2, 6.9, 0.74, "#f4ead2")}` +
  `<text class="mb-tx mb-off" x="51.4" y="19.5" text-anchor="middle">SHAKE</text><text class="mb-tx mb-on" x="51.4" y="19.5" text-anchor="middle">SHAKEN</text></g></svg>`;
function dieControl(kind, active, label) {
  return `<button type="button" class="rw-die${active ? " on" : ""}" data-reward-random="${kind}" aria-pressed="${active}" title="${esc(label)}" aria-label="${esc(label)}">${MATCHBOX_ART}</button>`;
}
function head(name, what, stampHTML = "") {
  return `<header class="rw-cap"><div class="rw-cap-tx"><h3 class="rw-nm">${esc(name)}</h3><p class="rw-what">${what}</p></div>${stampHTML}</header>`;
}
const pick = (attr, worn, label) => `${attr} aria-pressed="${worn}" aria-label="${esc(label)}"`;

/* ================================================================
   TAPE: rolls on a pencil
   ================================================================ */
/* One drawing, 300 x 206 units: the board's yellow HB lying across the cell, four rolls of washi
   hung on it, each card core resting its top on the pencil as it would, so the rolls hang below.
   A roll is seen from its left: the near face (the stacked tape's edge, its rings and the card
   core, with the pencil seen through the hole), then the outside of the roll as a band to its
   right, wearing its print. The roll in use has its end pulled out and hanging; a roll still owed
   is its pencil tracing. One SVG draws the pencil, and each roll is its own button laid over it in
   the same units, carrying its own SVG, so a roll can swing on hover while the pencil stays put.
   The rolls are a material (coloured tissue on card), so they keep their colours at night; the
   tail hanging on the page is one layer of tape, so it follows the night rule as a strip does.
   Chosen on scripts/mastery/tape-board.html. */
const TV_W = 300, TV_H = 206;
const PY = 50, PR = 6.5;                 // pencil centre and radius
const RR = 46, RX = 12.4;                // a roll's outer half-height, and its face foreshortened
const HOLE = 0.54, CORE = 0.64;          // card core: hole and outer edge, as fractions of RR
const CY = PY - PR + HOLE * RR;          // the hole's top rests on the pencil
const TW_ROLL = 26;                      // the tape's width on the roll
const TW_STRIP = 16.5;                   // the same width on a page strip: prints scale by their ratio
const ROLL_X = [30, 98, 166, 234];       // each roll's face centre
const ROLL_COL = 68;
const ROLL_TINT = ["#d6c08a", "#d9a2ae", "#9cb8da", "#b3a4dc"];   // the rolls' own tissue
const TAPE_SHORT = { "": "plain", dots: "dots", gingham: "gingham", music: "music" };

const pf2 = (n, d = 2) => +n.toFixed(d);
const ell = (cx, cy, rx, ry, cls, extra = "") => `<ellipse class="${cls}" cx="${pf2(cx)}" cy="${pf2(cy)}" rx="${pf2(rx)}" ry="${pf2(ry)}" ${extra}/>`;
const bandPath = (x0) => `M${x0} ${pf2(CY - RR)} L${x0 + TW_ROLL} ${pf2(CY - RR)} A${RX} ${RR} 0 0 1 ${x0 + TW_ROLL} ${pf2(CY + RR)} L${x0} ${pf2(CY + RR)} A${RX} ${RR} 0 0 0 ${x0} ${pf2(CY - RR)} Z`;
const bandEdge = (x0, cls) => `<path class="${cls}" d="M${x0} ${pf2(CY - RR)} L${x0 + TW_ROLL} ${pf2(CY - RR)} A${RX} ${RR} 0 0 1 ${x0 + TW_ROLL} ${pf2(CY + RR)} L${x0} ${pf2(CY + RR)}"/>`;

// The print laid along a run of tape: `len` along it, the tape's width across, from (x0, top)
// down the page. A quarter turn, not a mirror, so nothing reads backwards. A dark ink is
// multiplied in, exactly as on a page strip.
function printRun(uid, x0, top, len, layers, ink) {
  const s = TW_ROLL / TW_STRIP;
  let defs = "", body = "";
  layers.forEach((l, i) => {
    const id = `${uid}p${i}`;
    const across = /50%$/.test(l.pos) ? (TW_STRIP - l.h) / 2 : 0;   // a "0 50%" layer is centred across the tape
    const once = l.repeat === "repeat-x";
    defs += `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${l.w}" height="${l.h}" y="${pf2(across)}">` +
      `<image href="data:image/svg+xml,${encodeURIComponent(l.svg)}" width="${l.w}" height="${l.h}"/></pattern>`;
    body += `<rect x="0" y="${once ? pf2(across) : 0}" width="${pf2(len / s)}" height="${once ? l.h : TW_STRIP}" fill="url(#${id})"/>`;
  });
  const blend = ink === "dark" ? ` style="mix-blend-mode:multiply"` : "";
  return { defs, body: `<g transform="matrix(0 ${pf2(s)} ${pf2(-s)} 0 ${x0 + TW_ROLL} ${top})"${blend}>${body}</g>` };
}
// The print wrapped round the outside of the roll. Seen from the side, each line across the
// tape sits RX*cos(t) further right than the face's centre line, and the tape's length bunches
// up towards the top and bottom where the roll turns away. So the band is cut into thin slices,
// and each slice gets the run of print that belongs there: shifted along the curve, and squeezed
// by how much tape that slice of the turn holds.
function bandPrint(uid, x0, p) {
  const N = 28;
  const run = printRun(uid, x0, 0, Math.PI * RR, p.layers, p.ink);
  let clips = "", body = "";
  for (let i = 0; i < N; i++) {
    const ta = -Math.PI / 2 + (i * Math.PI) / N, tb = ta + Math.PI / N, tm = (ta + tb) / 2;
    const ya = CY + RR * Math.sin(ta), yb = CY + RR * Math.sin(tb);
    const k = (Math.sin(tb) - Math.sin(ta)) / (tb - ta);
    clips += `<clipPath id="${uid}s${i}"><rect x="${x0 - RX - 2}" y="${pf2(ya - 0.15)}" width="${TW_ROLL + RX * 2 + 4}" height="${pf2(yb - ya + 0.3)}"/></clipPath>`;
    body += `<g clip-path="url(#${uid}s${i})"><g transform="translate(${pf2(RX * Math.cos(tm))} ${pf2(ya)}) scale(1 ${pf2(k, 4)}) translate(0 ${pf2(-RR * (ta + Math.PI / 2))})">${run.body}</g></g>`;
  }
  return { defs: run.defs + clips, body };
}
// The pulled end, hanging from the bottom of the roll and torn off above the label: one
// translucent layer of tape over the page, so the day and night prints are both drawn and the
// theme shows one (.tr-day / .tr-night), as the strips' own night rule would.
function tapeTail(uid, x0, tint, p, seed) {
  const top = CY, bottom = CY + RR + 43;
  const k = (n) => settle(seed * 13 + n);
  const tear = Array.from({ length: 7 }, (_, i) => `${pf2(x0 + (TW_ROLL * i) / 6)} ${pf2(bottom - 1.6 + (k(i) - 0.5) * 4.4 + (i - 3) * 0.55)}`);
  const outline = `M${x0} ${top} L${x0 + TW_ROLL} ${top} L${tear.slice().reverse().join(" L")} Z`;
  const runs = p ? ["day", "night"].map((t) => [t, printRun(`${uid}t${t[0]}`, x0, top, bottom - top + 4, t === "day" ? p.layers : p.nightLayers, p.ink)]) : [];
  const g = p && p.ground;
  const sheet = (cls) => `<rect class="${cls}" x="${x0 - 2}" y="${top}" width="${TW_ROLL + 4}" height="${bottom - top + 6}"`;
  return `<g class="tr-tail" transform="rotate(${pf2(1.6 - k(9) * 2.4)} ${x0 + TW_ROLL / 2} ${pf2(CY + RR)})"><clipPath id="${uid}tc"><path d="${outline}"/></clipPath>` +
    runs.map(([, r]) => r.defs).join("") + `<g clip-path="url(#${uid}tc)" style="isolation:isolate">${sheet("tr-base")}/>` +
    `${sheet("tr-tint")} fill="${tint}" style="--ka:${g ? g.day[0] / 100 : 0.36};--kn:${g ? g.night[0] / 100 : 0.3}"/>` +
    runs.map(([t, r]) => `<g class="tr-${t}">${r.body}</g>`).join("") + `</g>` +
    `<path class="tr-edge" d="M${x0} ${pf2(CY + RR)} L${x0} ${pf2(bottom + 1.4)} M${x0 + TW_ROLL} ${pf2(CY + RR)} L${x0 + TW_ROLL} ${pf2(bottom - 0.6)}"/>` +
    `<path class="tr-end" d="M${tear.join(" L")}"/></g>`;
}
// The shine along the outside of the roll, following its curve.
function rollShine(x0) {
  const xc = x0 + TW_ROLL * 0.36, pts = [];
  for (let t = -1.05; t <= 0.42; t += 0.07) pts.push(`${pf2(xc + RX * Math.cos(t))} ${pf2(CY + RR * Math.sin(t))}`);
  return `<path class="tr-shine" d="M${pts.join(" L")}"/>`;
}
// Where the outer layer ends: a torn line across the outside of a roll not in use.
function rollEnd(x0, at, seed) {
  const y = CY + RR * at, half = RX * Math.sqrt(1 - at * at), pts = [];
  for (let i = 0; i <= 6; i++) pts.push(`${pf2(x0 + half + (TW_ROLL * i) / 6)} ${pf2(y + Math.sin(seed * 7 + i * 2.3) * 0.9 + i * 0.45)}`);
  return `<path class="tr-end" d="M${pts.join(" L")}"/>`;
}
function rollArt(uid, i, p, worn) {
  const x0 = ROLL_X[i], tint = ROLL_TINT[i];
  const run = p ? bandPrint(uid + "b", x0, p) : { defs: "", body: "" };
  const face = ell(x0, CY, RX, RR, "tr-face", `style="--tt:${tint}"`) +
    [0.93, 0.85, 0.77, 0.7].map((k) => ell(x0, CY, RX * k, RR * k, "tr-ring")).join("") +
    ell(x0, CY, RX * CORE, RR * CORE, "tr-core") + ell(x0, CY, RX * HOLE, RR * HOLE, "tr-core-in") +
    `<clipPath id="${uid}h">${ell(x0, CY, RX * HOLE, RR * HOLE, "")}</clipPath>` +
    // the pencil, seen through the core
    `<g class="pn-h" clip-path="url(#${uid}h)"><rect class="pn-body" x="${x0 - RX}" y="${PY - PR}" width="${RX * 2}" height="${PR * 2}"/>` +
    `<path class="pn-facet" d="M${x0 - RX} ${PY - 2.2} H${x0 + RX}"/><path class="pn-line" d="M${x0 - RX} ${PY - PR} H${x0 + RX} M${x0 - RX} ${PY + PR} H${x0 + RX}"/></g>` +
    ell(x0, CY, RX * HOLE, RR * HOLE, "tr-o") + ell(x0, CY, RX * CORE, RR * CORE, "tr-o") + ell(x0, CY, RX, RR, "tr-o");
  const band = `<clipPath id="${uid}bc"><path d="${bandPath(x0)}"/></clipPath>${run.defs}` +
    `<path d="${bandPath(x0)}" fill="${tint}"/><g clip-path="url(#${uid}bc)" style="isolation:isolate"><path d="${bandPath(x0)}" fill="${tint}"/>${run.body}</g>` +
    (worn ? "" : rollEnd(x0, 0.56 + (i % 2) * 0.12, i)) + rollShine(x0) + bandEdge(x0, "tr-o");
  return `<g class="tr-swing">${worn ? tapeTail(uid, x0, tint, p, i * 3 + 1) : ""}${band}${face}</g>`;
}
// An owed roll is its pencil tracing: the same outlines, dashed, nothing filled.
const rollTrace = (i) => { const x0 = ROLL_X[i];
  return `<g filter="url(#pencilLine)">${bandEdge(x0, "tr-trace")}${ell(x0, CY, RX, RR, "tr-trace")}` +
    `${ell(x0, CY, RX * CORE, RR * CORE, "tr-trace-s")}${ell(x0, CY, RX * HOLE, RR * HOLE, "tr-trace-s")}</g>`; };
// The pencil: the board's yellow HB lying flat, eraser left and point right.
const TAPE_PENCIL = `<g class="pn-h">` +
  `<path class="pn-eraser" d="M4.5 ${PY - PR + 1} Q4.5 ${PY - PR} 6.5 ${PY - PR} H16.5 V${PY + PR} H6.5 Q4.5 ${PY + PR} 4.5 ${PY + PR - 1} Z"/>` +
  `<rect class="pn-ferrule" x="16.5" y="${PY - PR - 0.6}" width="12" height="${PR * 2 + 1.2}" rx="1"/>` +
  `<path class="pn-ridge" d="M20.2 ${PY - PR} V${PY + PR} M23.6 ${PY - PR} V${PY + PR}"/>` +
  `<path class="pn-body" d="M28.5 ${PY - PR} H276 Q279.6 ${PY - 4.3} 276.5 ${PY - 2.2} Q280.2 ${PY} 276.5 ${PY + 2.2} Q279.6 ${PY + 4.3} 276 ${PY + PR} H28.5 Z"/>` +
  `<path class="pn-facet" d="M30 ${PY - 2.2} H275.4 M30 ${PY + 2.2} H275.4"/>` +
  `<path class="pn-wood" d="M276 ${PY - PR} L291 ${PY - 1.7} L291 ${PY + 1.7} L276 ${PY + PR} Q279.6 ${PY + 4.3} 276.5 ${PY + 2.2} Q280.2 ${PY} 276.5 ${PY - 2.2} Q279.6 ${PY - 4.3} 276 ${PY - PR} Z"/>` +
  `<path class="pn-lead" d="M291 ${PY - 1.7} L297.5 ${PY} L291 ${PY + 1.7} Z"/></g>`;

function tapeRolls(D) {
  const slots = [{ id: "", L: 0 }, ...ofKind("tape").map((r) => ({ id: r.payload.tape, L: r.level, rid: r.id, name: r.name }))];
  const rolls = slots.map((s, i) => {
    const open = !s.rid || D.has(s.rid);
    const worn = open && D.wear.tape === s.id;
    const uid = `tr${++D.uid}x`;
    const left = ((ROLL_X[i] + TW_ROLL / 2 - ROLL_COL / 2) / TV_W) * 100, width = (ROLL_COL / TV_W) * 100;
    const art = open ? rollArt(uid, i, s.id ? TAPE_PRINTS[s.id] : null, worn) : rollTrace(i);
    const mark = s.L ? tag(D, s.L) : `<span class="tr-plain" aria-hidden="true"></span>`;
    const nm = TAPE_SHORT[s.id] || s.id;
    const attr = s.rid ? `data-reward="${s.rid}"` : `data-reward-reset="tape"`;
    const label = open ? (s.name || "Plain tape") : `${s.name}, opens at Mastery level ${s.L}`;
    const svg = `<svg viewBox="${ROLL_X[i] + TW_ROLL / 2 - ROLL_COL / 2} 0 ${ROLL_COL} ${TV_H}" aria-hidden="true">${art}</svg>`;
    const lab = `<span class="tr-lab">${mark}<span class="tr-nm">${esc(nm)}</span></span>`;
    const pos = `style="left:${pf2(left)}%;width:${pf2(width)}%"`;
    return open
      ? `<button type="button" class="tr-roll${worn ? " worn" : ""}" ${pos} data-tape="${s.id}" ${pick(attr, worn, label)}>${svg}${lab}</button>`
      : `<div class="tr-roll owed" ${pos} role="img" aria-label="${esc(label)}">${svg}${lab}</div>`;
  }).join("");
  return `<section class="rw-obj rw-tape" style="--o:${T.tape}">` +
    head("Washi tape", "the print on the tape that holds the notebook down") +
    `<div class="tr"><svg class="tr-bed" viewBox="0 0 ${TV_W} ${TV_H}" aria-hidden="true">${TAPE_PENCIL}</svg>${rolls}</div></section>`;
}

/* ================================================================
   PAPER: the fan deck
   ================================================================ */
// Angles spaced by hand, not divided evenly: a fan opened by a thumb.
const FAN_AT = [-9, 5.6, 19.6, 34.1, 48.3, 62.8];
// The stock in use keeps its own place, and the others swing back off it by FAN_PUSH on either
// side, so picking a stock never reshuffles the deck. The low side cannot swing far before it
// leaves the cell, so whatever would pass FAN_LO closes up between FAN_LO and its neighbour.
const FAN_PUSH = 10;
const FAN_LO = -14;
function fanAngles(n, w) {
  const at = Array.from({ length: n }, (_, i) => FAN_AT[i] ?? (-9 + i * 14));
  if (w < 0) return at;
  const a = at.map((x, i) => i < w ? x - FAN_PUSH : i > w ? x + FAN_PUSH : x);
  if (w > 0 && a[0] < FAN_LO) {
    const top = a[w - 1];
    const k = top > FAN_LO ? (top - FAN_LO) / (top - a[0]) : 0;
    for (let i = 0; i < w; i++) a[i] = top > FAN_LO ? top - (top - a[i]) * k : FAN_LO;
  }
  return a;
}
const PAPER_LABEL = { default: "Plain", manila: "Manila", parchment: "Parchment", blush: "Blush", slate: "Slate", sage: "Sage" };

// Six strips of the real stock (the game's .paper-chip) on one brass rivet. Shut and banded until
// the set is earned, with the plain sheet you already own on top; open, the stock you write on
// holds its place and the rest swing back off it.
function paperFan(D) {
  const slots = [{ id: "", paper: "default", name: "Plain" }, ...ofKind("paper").map((r) => ({ id: r.payload.paper, paper: r.payload.paper, name: r.name, rid: r.id }))];
  const open = slots.length > 1 && D.has(slots[1].rid);
  const n = slots.length;
  const fan = fanAngles(n, open ? slots.findIndex((p) => p.id === D.wear.paper) : -1);
  const strips = slots.map((p, i) => {
    const worn = open && D.wear.paper === p.id;
    const a = !open ? 38 + i * 0.9 : fan[i];
    const inner = `<span class="pf-name">${esc(PAPER_LABEL[p.paper] || p.name)}</span><span class="pf-hole"></span>`;
    const z = !open ? n - i : worn ? 20 : i + 1;
    const st = `style="--a:${a.toFixed(1)}deg;z-index:${z}"`;
    if (!open && i > 0) return `<span class="pf-strip paper-chip shut" data-paper="${p.paper}" ${st}>${inner}</span>`;
    const attr = p.rid ? `data-reward="${p.rid}"` : `data-reward-reset="paper"`;
    return `<button type="button" class="pf-strip paper-chip${worn ? " worn" : ""}" data-paper="${p.paper}" ${st} ${pick(attr, worn, p.name)}>${inner}</button>`;
  }).join("");
  const level = slots[1] ? MASTERY_REWARDS.find((r) => r.id === slots[1].rid).level : 4;
  const band = open ? "" : `<span class="pf-arm" style="--a:${(38 + (n - 1) * 0.9).toFixed(1)}deg"><span class="pf-band"><b>${n - 1} more stocks</b><i>banded till Mastery ${level}</i></span></span>`;
  return `<section class="rw-obj rw-paper" style="--o:${T.paper}">` +
    head("Paper stock", "what the whole page is written on", stamp(D, level)) +
    `<div class="pf${open ? " open" : " shut"}"><div class="pf-fan">${strips}${band}` +
    `<svg class="pf-rivet" viewBox="0 0 24 24" aria-hidden="true"><circle class="pf-rv-o" cx="12" cy="12" r="8.6"/><circle class="pf-rv-i" cx="12" cy="12" r="4.4"/><circle class="pf-rv-h" cx="12" cy="12" r="1.5"/></svg></div></div></section>`;
}

/* ================================================================
   TRINKETS: two safety pins
   ================================================================ */
/* Two big safety pins pushed through the page, the charms hanging off their bars on jump rings.
   The one you wear hangs from a real pony bead threaded on the bar (beadPreviewSVG, the strand's
   own bead), because that is what the reward is: the charm on every bead you earn. Shaken, every
   charm is on a bead of its own colour, since every one of them is in play. Each pin's point goes
   down through the paper and comes back up, so the middle of its shaft is under the page.
   The pins are one drawing; each charm is its own button laid over it, at the point where it hangs
   off the tilted bar, so a charm hangs plumb whatever angle its pin lies at. Designed on
   scripts/mastery/trinkets-board.html (option B), beside the bead board and the charm machine. */
const PIN_W = 273, PIN_H = 222;
// x0/x1: the coil's outer edge and the head's; yb: the bar; dive: where the point goes down
// through the paper and where it comes back up; at: where each charm hangs, five then four. The
// second pin spreads its four wide on purpose: the names are type and do not shrink with the
// drawing, so "mirrorball" and "champagne" need that room to clear their neighbours in the narrowest
// cell. MASTERY_REWARDS orders the set so no two long names hang side by side.
const PINS = [
  { x0: 12, x1: 260, yb: 40, tilt: -1.4, dive: [58, 206], at: [46, 91, 137, 182, 226] },
  { x0: 22, x1: 256, yb: 152, tilt: 1.1, dive: [80, 196], at: [60, 112, 168, 222] },
];
// The beads a shaken set hangs from, one album apiece, in the active palette (D.albumColors).
const PIN_ALBUMS = ["Lover", "1989", "Fearless", "Speak Now", "folklore", "Red", "Midnights", "Taylor Swift", "evermore"];
const pf = (v) => +(+v).toFixed(2);
// A steel wire: the page's ink round it, the steel, and a glint along its top. Steel is a material,
// so it holds at night; only the edge follows the page.
function pinWire(d, w) {
  return `<path class="sp-w-o" d="${d}" style="stroke-width:${pf(w + 2.6)}"/><path class="sp-w" d="${d}" style="stroke-width:${pf(w)}"/>` +
    `<path class="sp-w-h" d="${d}" style="stroke-width:${pf(w * 0.34)}" transform="translate(0 -${pf(w * 0.28)})"/>`;
}
// One pin, lying flat: the coil a turn and a half (drawn as two passes so the second crosses over
// the first), the bar from the coil to the head, the shaft in two pieces either side of where it
// runs under the paper, and the hooded head its point snaps into.
function pinArt(p, rings) {
  const { x0, x1, yb } = p, yt = yb - 10;
  const rc = 7.4, cx = x0 + rc, cy = yb - 5, k = rc * 0.5523, d2 = 1.9;
  const turn1 = `M${pf(cx + 13)} ${pf(yb)} C${pf(cx + 6)} ${pf(yb + 0.1)} ${pf(cx + 2.6)} ${pf(cy + rc)} ${pf(cx)} ${pf(cy + rc)}` +
    ` C${pf(cx - k)} ${pf(cy + rc)} ${pf(cx - rc)} ${pf(cy + k)} ${pf(cx - rc)} ${pf(cy)}` +
    ` C${pf(cx - rc)} ${pf(cy - k)} ${pf(cx - k)} ${pf(cy - rc)} ${pf(cx)} ${pf(cy - rc)}` +
    ` C${pf(cx + k)} ${pf(cy - rc)} ${pf(cx + rc)} ${pf(cy - k)} ${pf(cx + rc)} ${pf(cy)}` +
    ` C${pf(cx + rc)} ${pf(cy + k)} ${pf(cx + d2 + k)} ${pf(cy + rc + 0.3)} ${pf(cx + d2)} ${pf(cy + rc + 0.3)}`;
  const turn2 = `M${pf(cx + d2)} ${pf(cy + rc + 0.3)} C${pf(cx + d2 - k)} ${pf(cy + rc + 0.3)} ${pf(cx + d2 - rc)} ${pf(cy + k)} ${pf(cx + d2 - rc + 0.2)} ${pf(cy)}` +
    ` C${pf(cx + d2 - rc + 0.4)} ${pf(cy - k)} ${pf(cx + d2 - k)} ${pf(cy - rc + 0.2)} ${pf(cx + d2 + 0.4)} ${pf(cy - rc + 0.2)}` +
    ` C${pf(cx + d2 + 5)} ${pf(cy - rc + 0.2)} ${pf(cx + 9)} ${pf(yt + 0.1)} ${pf(cx + 15)} ${pf(yt)}`;
  const [a, b] = p.dive;
  const hx = x1 - 17;
  const bar = `M${pf(cx + 12)} ${pf(yb)} C${pf(cx + 70)} ${pf(yb + 0.7)} ${pf(hx - 60)} ${pf(yb + 0.5)} ${pf(hx + 3)} ${pf(yb - 0.2)}`;
  const shaftA = `M${pf(cx + 14)} ${pf(yt)} C${pf(cx + 24)} ${pf(yt - 0.2)} ${pf(a - 12)} ${pf(yt + 0.3)} ${pf(a)} ${pf(yt + 0.1)}`;
  const shaftB = `M${pf(b)} ${pf(yt + 0.2)} C${pf(b + 14)} ${pf(yt)} ${pf(hx - 10)} ${pf(yt - 0.3)} ${pf(hx + 4)} ${pf(yt + 0.2)}`;
  // under the page the wire lifts the paper a hair, so there is a ridge, barely
  const ridge = `<path class="sp-ridge" d="M${pf(a + 3)} ${pf(yt + 0.1)} C${pf(a + 40)} ${pf(yt + 0.4)} ${pf(b - 40)} ${pf(yt)} ${pf(b - 3)} ${pf(yt + 0.2)}"/>`;
  // the puncture, with the paper dented in round it
  const hole = (x, s) => `<ellipse class="sp-hole" cx="${pf(x)}" cy="${pf(yt + 0.1)}" rx="1.5" ry="2.8"/>` +
    `<path class="sp-dent" d="M${pf(x + s * 1.2)} ${pf(yt - 3.4)} q${pf(s * 1.8)} -1.2 ${pf(s * 2.6)} -2.6 M${pf(x + s * 1.4)} ${pf(yt + 3.6)} q${pf(s * 1.4)} 1 ${pf(s * 2.2)} 2.4"/>`;
  // the head: a folded steel hood, open on the left where both wires go in
  const ht = yt - 5.6, hb = yb + 4.4, hm = (ht + hb) / 2;
  const head = `M${pf(hx + 1.4)} ${pf(ht)} L${pf(x1 - 5)} ${pf(ht - 0.3)} Q${pf(x1 + 0.4)} ${pf(ht - 0.3)} ${pf(x1 + 0.3)} ${pf(ht + 5)}` +
    ` L${pf(x1 + 0.4)} ${pf(hb - 4.6)} Q${pf(x1 + 0.4)} ${pf(hb + 0.2)} ${pf(x1 - 4.8)} ${pf(hb + 0.2)} L${pf(hx + 1.2)} ${pf(hb)}` +
    ` Q${pf(hx - 1.6)} ${pf(hb)} ${pf(hx - 1.6)} ${pf(hb - 2.8)} L${pf(hx - 1.4)} ${pf(ht + 2.8)} Q${pf(hx - 1.4)} ${pf(ht)} ${pf(hx + 1.4)} ${pf(ht)} Z`;
  const fold = `M${pf(hx + 2.6)} ${pf(hm + 0.6)} C${pf(hx + 8)} ${pf(hm + 0.2)} ${pf(x1 - 6)} ${pf(hm - 0.2)} ${pf(x1 - 1.4)} ${pf(hm + 0.2)}`;
  // the bare rings go down first so the bar runs over their tops, which is what loops them on
  return `<g transform="rotate(${p.tilt} ${pf((x0 + x1) / 2)} ${yb})">${ridge}${rings}` +
    pinWire(shaftA, 2.2) + hole(a, 1) + pinWire(shaftB, 2.2) + hole(b, -1) + pinWire(turn1, 2.3) + pinWire(bar, 2.5) + pinWire(turn2, 2.3) +
    `<path class="sp-head" d="${head}"/><path class="sp-fold" d="${fold}"/><path class="sp-notch" d="M${pf(hx - 1.4)} ${pf(yt - 2.4)} l3.4 0"/></g>`;
}
const PIN_RING = (x, y) => `<ellipse class="sp-ring-o" cx="${pf(x)}" cy="${pf(y)}" rx="3" ry="4.4"/><ellipse class="sp-ring" cx="${pf(x)}" cy="${pf(y)}" rx="3" ry="4.4"/>`;
function trinketPins(D) {
  const slots = [{ id: "", t: "star", name: "Star" }, ...ofKind("trinket").map((r) => ({ id: r.payload.trinket, t: r.payload.trinket, name: r.name.replace(/ trinket$/, ""), rid: r.id }))];
  const open = slots.length > 1 && D.has(slots[1].rid);
  const rnd = open && D.wear.trinket === D.RANDOM;
  const level = slots[1] ? MASTERY_REWARDS.find((r) => r.id === slots[1].rid).level : 5;
  const palette = D.albumColors || {};
  let k = 0, art = "", charms = "";
  for (const p of PINS) {
    let rings = "";
    const rad = (p.tilt * Math.PI) / 180, mx = (p.x0 + p.x1) / 2;
    for (const x of p.at) {
      const i = k++, s = slots[i];
      if (!s) continue;
      const owed = !!s.rid && !open;
      const worn = !owed && !rnd && D.wear.trinket === s.id;
      const strung = worn || (rnd && !owed);
      // where this charm hangs off the tilted bar
      const hx = mx + (x - mx) * Math.cos(rad), hy = p.yb + (x - mx) * Math.sin(rad);
      const col = rnd ? palette[PIN_ALBUMS[i % PIN_ALBUMS.length]] : "";
      const tint = col ? ` style="--bead:${col}"` : "";
      // in the charm's own box the hanging point is (22, 14): a bare charm hangs from its ring on
      // the bar, a strung one from a ring under its bead
      const r = 14, top = 14 + (strung ? 11.6 : 0), ringY = top + 4.3;
      const sway = jit(i * 5 + 3, 6);
      if (!strung) rings += PIN_RING(x, p.yb + 4.3);
      const bead = strung ? beadPreviewSVG("gloss", col || undefined, i).replace("<svg ", `<svg x="9.5" y="0.1" width="25" height="26.6" `) : "";
      // the ring runs through the trinket's punched hole; one still owed is only its pencil trace
      const hung = hangTrinket(s.t, 22, ringY + 3.2 - trinketHoleY(s.t) * r, r, 0, { noCord: true, trace: owed }).svg;
      const body = owed ? `<g class="sp-trace">${hung}</g>` : `<g${tint}>${hung}</g>`;
      const svg = `<svg class="sp-ch-art" viewBox="0 0 44 67" aria-hidden="true">${bead}` +
        `<g class="sp-sw" style="transform-origin:22px ${pf(ringY - 4)}px;--d:${pf(i * 0.05)}s">` +
        `<g transform="rotate(${pf(sway)} 22 ${pf(ringY - 4)})">${strung ? PIN_RING(22, ringY) : ""}${body}</g></g></svg>`;
      const at = `left:${pf(((hx - 22) / PIN_W) * 100)}%;top:${pf(((hy - 14) / PIN_H) * 100)}%`;
      const label = `<span class="sp-nm">${esc(s.name.toLowerCase())}</span>`;
      const cls = `sp-ch${worn ? " worn" : ""}${strung ? " strung" : ""}${owed ? " owed" : ""}`;
      if (owed) { charms += `<span class="${cls}" style="${at}" aria-hidden="true">${svg}${label}</span>`; continue; }
      const attr = s.rid ? `data-reward="${s.rid}"` : `data-reward-reset="trinket"`;
      charms += `<button type="button" class="${cls}" style="${at}" ${pick(attr, worn, s.name)}>${svg}${label}</button>`;
    }
    art += pinArt(p, rings);
  }
  const foot = open ? dieControl("trinket", rnd, "Give every bead its own trinket") : `<p class="rw-owe sp-owe">eight more hang here at Mastery ${level}</p>`;
  return `<section class="rw-obj rw-trinket" style="--o:${T.trinket}">` +
    head("Trinkets", rnd ? "every bead deals its own, off both pins" : "what hangs from every bead you earn", stamp(D, level)) +
    `<div class="sp"><div class="sp-stage"><svg class="sp-art" viewBox="0 0 ${PIN_W} ${PIN_H}" aria-hidden="true">${art}</svg>${charms}</div>` +
    `<div class="sp-foot${open ? "" : " owing"}">${foot}</div></div></section>`;
}

/* ================================================================
   SUPER-HARD: the fourth tape
   ================================================================ */
const TAPE_GLYPH = `<svg viewBox="0 0 24 16" class="cs-tg" aria-hidden="true"><rect x="1" y="1.6" width="22" height="12.8" rx="2.2"/><rect x="5" y="3.3" width="14" height="3.2" rx="0.7"/><circle cx="8.5" cy="10.2" r="2.4"/><circle cx="15.5" cy="10.2" r="2.4"/></svg>`;
const TICK = `<svg class="cs-tick" viewBox="0 0 16 12" role="img" aria-label="beaten"><path d="M1.6 6.8 C3 8 4.4 9.4 5.6 10.6 C8.4 7 11.2 3.8 14.6 1.4"/></svg>`;
// A reel as a cassette shows it: tape wound round a hub whose six teeth face in.
function hub(cx, cy) {
  const teeth = [0, 60, 120, 180, 240, 300].map((a) => `<rect x="-1" y="-5.4" width="2" height="2.2" rx=".5" transform="rotate(${a})"/>`).join("");
  return `<g class="cs-hub" transform="translate(${cx} ${cy})"><circle r="7.6" class="cs-hub-o"/><circle r="3.9" class="cs-hub-i"/>${teeth}</g>`;
}
// Challenges are rated in tapes and brutal is four, so the reward is the fourth tape, banded
// SEALED until its tier opens, with the brutal tier's real tracklist on the J-card. The tape packs
// are honest: everything starts on the left reel, and each brutal challenge beaten winds a little
// more across to the right.
function cassette(D) {
  const open = D.superHard;
  const tracks = D.brutal, done = tracks.filter((c) => c.beaten).length;
  const frac = tracks.length ? done / tracks.length : 0;
  const packL = 8.6 + 14 * (1 - frac), packR = 8.6 + 14 * frac;
  const clip = `rwcs${++D.uid}`;
  const list = tracks.map((c, i) => `<li><b>A${i + 1}</b><span>${esc(c.name)}</span>${c.beaten ? TICK : "<i></i>"}</li>`).join("");
  const svg = `<svg class="cs-tape" viewBox="0 0 260 166" aria-hidden="true"><defs><clipPath id="${clip}"><rect x="70" y="58" width="120" height="38" rx="19"/></clipPath></defs>` +
    `<rect class="cs-shell" x="2" y="2" width="256" height="162" rx="11"/>` +
    [[12, 12], [248, 12], [12, 154], [248, 154], [130, 156]].map(([x, y]) => `<circle class="cs-screw" cx="${x}" cy="${y}" r="3"/><path class="cs-screw-x" d="M${x - 1.6} ${y} H${x + 1.6}"/>`).join("") +
    `<rect class="cs-label" x="18" y="13" width="224" height="98" rx="5"/>` +
    `<path class="cs-band" d="M18 18 a5 5 0 0 1 5 -5 h214 a5 5 0 0 1 5 5 v13 h-224 z"/>` +
    `<text class="cs-side" x="30" y="26.4">A</text><text class="cs-nr" x="230" y="26.4" text-anchor="end">C-13</text>` +
    `<path class="cs-rule" d="M30 51 H232 M30 102 H232"/>` +
    `<rect class="cs-window" x="70" y="58" width="120" height="38" rx="19"/>` +
    `<g clip-path="url(#${clip})"><circle class="cs-pack" cx="96" cy="77" r="${packL.toFixed(1)}"/><circle class="cs-pack" cx="164" cy="77" r="${packR.toFixed(1)}"/></g>` +
    hub(96, 77) + hub(164, 77) + `<rect class="cs-window-rim" x="70" y="58" width="120" height="38" rx="19"/>` +
    `<path class="cs-foot" d="M52 164 L62 130 H198 L208 164"/>` +
    `<circle class="cs-hole" cx="84" cy="150" r="4.6"/><circle class="cs-hole" cx="176" cy="150" r="4.6"/>` +
    `<rect class="cs-hole" x="113" y="144" width="7" height="8" rx="1"/><rect class="cs-hole" x="140" y="144" width="7" height="8" rx="1"/></svg>`;
  const labelText = `<span class="cs-title">Super-hard</span><span class="cs-tapes">${TAPE_GLYPH.repeat(4)}<i>brutal</i></span>`;
  const seal = open ? "" : `<span class="cs-seal"><b>sealed</b><i>break at Mastery ${D.superHardLevel}</i></span>`;
  const act = open ? `<button type="button" class="cs-play" data-open-brutal><span class="cs-tri"></span>take one on</button>` : "";
  return `<section class="rw-obj rw-hard" style="--o:${T.hard}">` +
    head("Super-hard", open ? "a whole tier of brutal challenges, on one tape" : "a tier of brutal challenges, still in the wrapper", stamp(D, D.superHardLevel)) +
    `<div class="cs${open ? " open" : " shut"}"><div class="cs-wrap">${svg}<div class="cs-text">${labelText}</div>${seal}</div>` +
    `<div class="cs-jcard"><span class="cs-spine">super-hard</span><div class="cs-jbody"><span class="cs-jk">side A · ${tracks.length} tracks${open && done ? ` · ${done} beaten` : ""}</span><ol>${list}</ol></div></div>${act}</div></section>`;
}

/* ================================================================
   START BUTTONS: a haberdasher's card
   ================================================================ */
function stitch(seed) {
  const a = jit(seed, 8), b = jit(seed + 1, 8);
  return `<svg class="bc-x" viewBox="0 0 14 14" aria-hidden="true"><circle cx="3" cy="3" r="1.3"/><circle cx="11" cy="3" r="1.3"/><circle cx="3" cy="11" r="1.3"/><circle cx="11" cy="11" r="1.3"/>` +
    `<path d="M3 3 L11 11" transform="rotate(${a.toFixed(1)} 7 7)"/><path d="M11 3 L3 11" transform="rotate(${b.toFixed(1)} 7 7)"/></svg>`;
}
const emptyCell = (name = "&nbsp;") => `<span class="bc-cell empty"><span class="bc-sew"><span class="bc-holes"></span><span class="bc-btn bc-ghost"></span><span class="bc-holes"></span></span><span class="bc-nm">${name}</span></span>`;
// `attr` is the cell's whole wiring: a reward, a reset, or a doorway to a set.
function buttonCell(D, attr, finish, name, worn, i, note = "") {
  return `<button type="button" class="bc-cell${worn ? " worn" : ""}" ${attr} aria-pressed="${worn}" aria-label="${esc(name)}">` +
    `<span class="bc-sew">${stitch(i * 5 + 2)}<span class="bc-btn">${D.miniButton(finish)}</span>${stitch(i * 5 + 4)}</span>` +
    `<span class="bc-nm">${esc(name)}</span>${note ? `<span class="bc-note">${note}</span>` : ""}</button>`;
}
// They are start BUTTONS, so they are sewn onto a card, each real one held by two gold
// cross-stitches. Seasons and Pride stay doorways: each set opens on a refill card tucked under
// the main one (.set-picker, shown and hidden by app.js in the DOM, never re-rendered), and a
// pinned season or worn flag keeps saying which doorway it came from.
function buttonCard(D) {
  const buttons = ofKind("button");
  const open = D.has(buttons[0].id);
  const active = D.wear.button;
  const rnd = active === D.RANDOM;
  const level = buttons[0].level;
  const seasons = buttons.find((r) => r.id === "btn-seasons");
  const door = (id) => `data-open-set-picker="${id}" aria-controls="${id}" aria-expanded="false"`;
  let cells = "", trays = "", i = 0;
  if (seasons) {
    const pinned = seasons.variants.find((v) => v.id === active);
    cells += buttonCell(D, door("seasonPicker"), pinned ? pinned.id : "", pinned ? pinned.name : "Seasons", !rnd && (active === "" || !!pinned), i++,
      pinned ? `pinned all year · +${seasons.variants.length}` : `by the calendar · +${seasons.variants.length}`);
    trays += refill("seasonPicker", seasons.name, "pin one all year",
      buttonCell(D, `data-reward-reset="button"`, "", "By the calendar", active === "", 90) +
      seasons.variants.map((v, k) => open
        ? buttonCell(D, `data-reward="${seasons.id}" data-variant="${v.id}"`, v.id, v.name, active === v.id, 91 + k)
        : emptyCell(`${esc(v.name)} · Mastery ${seasons.level}`)).join(""));
  }
  for (const r of buttons) {
    if (r === seasons) continue;
    if (!open) { cells += emptyCell(); i++; continue; }
    if (r.variants) {
      const id = `setPicker-${r.id}`;
      const worn = r.variants.find((v) => v.id === active);
      cells += buttonCell(D, door(id), worn ? worn.id : r.payload.button, worn ? worn.name : r.name, !rnd && !!worn, i++,
        worn ? `${esc(r.name.split(" ")[0].toLowerCase())} · +${r.variants.length}` : `+${r.variants.length} ${esc(r.name.split(" ").pop().toLowerCase())}`);
      trays += refill(id, r.name, "one at a time", r.variants.map((v, k) =>
        buttonCell(D, `data-reward="${r.id}" data-variant="${v.id}"`, v.id, v.name, active === v.id, 60 + k)).join(""));
    } else {
      cells += buttonCell(D, `data-reward="${r.id}"`, r.payload.button, r.name, !rnd && active === r.payload.button, i++);
    }
  }
  return `<section class="rw-obj rw-button" style="--o:${T.button}">` +
    head("Start buttons", rnd ? "a different one sewn on every time you open the notebook" : "the button on your front page", stamp(D, level)) +
    `<div class="bc"><div class="bc-card"><div class="bc-hd"><span class="bc-no">No. ${level}</span><b>Assorted finishes</b><span class="bc-sub">sewn on by hand · ${buttons.length} to a card</span>` +
    (open ? dieControl("button", rnd, "A different finish every visit") : "") + `</div>` +
    `<div class="bc-grid">${cells}</div>${open ? "" : `<p class="rw-owe bc-owe">${buttons.length - 1} more finishes get sewn on at Mastery ${level}</p>`}</div>${trays}</div></section>`;
}
function refill(id, title, sub, members) {
  return `<div class="bc-refill set-picker" id="${id}" hidden><div class="bc-refill-hd"><b>${esc(title)}</b><span>${sub}</span>` +
    `<button type="button" data-open-set-picker="${id}">back to the card</button></div><div class="bc-grid">${members}</div></div>`;
}

/* ================================================================
   START BUTTON WORDS: the button, sketched
   ================================================================ */
// Every set of words is the start button itself, roughed out in charcoal on the page with no
// colour (js/ctasketch.js). The words being worn are not sketched at all: their slot holds the
// real button, in the finish chosen above, so it is both the choice and the preview, and there
// is no separate "on your page" row. The sketches are sized to their words and wrap, and the
// matchbox rides in the header as it does on the button card. Locked, the eight owed are blank
// outlines, faint, since all eight arrive together and the words are the reward.
// Designed on scripts/mastery/words-board.html (option E).
function labelTape(D) {
  const labels = ofKind("label");
  const slots = [{ id: "", text: "Start writing", mark: "pencil" }, ...labels.map((r) => ({ id: r.payload.label, text: CTA_LABELS[r.payload.label].text, mark: CTA_LABELS[r.payload.label].mark, rid: r.id }))];
  const open = labels.length > 0 && D.has(labels[0].id);
  const level = labels.length ? labels[0].level : 12;
  const rnd = D.wear.label === D.RANDOM;
  const cells = slots.map((p, i) => {
    const r = `--r:${(-.6 + jit(i + 200, .5)).toFixed(2)}deg`;
    if (p.rid && !open) return `<span class="ls-pick owed" style="${r}" aria-hidden="true">${ctaSketch(p, i, { blank: true })}</span>`;
    const worn = !rnd && D.wear.label === p.id;
    const attr = p.rid ? `data-reward="${p.rid}"` : `data-reward-reset="label"`;
    return `<button type="button" class="ls-pick${worn ? " worn" : ""}" style="${r}" ${pick(attr, worn, p.text)}>` +
      (worn ? `<span class="ls-real">${D.nowButton()}</span>` : ctaSketch(p, i)) + `</button>`;
  }).join("");
  return `<section class="rw-obj rw-words" style="--o:${T.cta}">` +
    head("Start button words", rnd ? "different words every visit" : "what the front-page button says",
      (open ? dieControl("label", rnd, "Different words every visit") : "") + stamp(D, level)) +
    `<div class="ls">${cells}</div>` +
    (open ? "" : `<p class="rw-owe ls-owe">${labels.length} more get sketched in at Mastery ${level}</p>`) + `</section>`;
}

/* ================================================================
   STICKER HINTS: a backing sheet under glassine
   ================================================================ */
// The kiss-cut outlines of stickers not yet found, under glassine until the level; earned, each
// shape carries its own hint line. Three states, because the thing it points at can run out: once
// every sticker is stuck down there is nothing left on the sheet and no door.
function stickerSheet(D) {
  const open = D.stickerHints;
  const left = D.stickersLeft;
  const shown = [...left.filter((s) => s.hint), ...left.filter((s) => !s.hint)].slice(0, 4);
  const cells = shown.map((s, i) => `<span class="ss-cell"><span class="ss-cut" style="--r:${jit(i + 120, 9).toFixed(0)}deg">${stickerArt(s)}</span>` +
    `<span class="ss-hint">${open && s.hint ? esc(s.hint) : ""}</span></span>`).join("");
  const empty = shown.length ? "" : `<p class="ss-done">all ${D.stickerTotal} stuck down</p>`;
  const what = !open ? "a nudge for every shape still on the sheet" : left.length ? "every shape still on the sheet says what it wants" : "nothing left on the sheet to hint at";
  return `<section class="rw-obj rw-stick" style="--o:${T.stick}">` +
    head("Sticker hints", what, stamp(D, D.stickerLevel)) +
    `<div class="ss${open ? " open" : " shut"}"><div class="ss-sheet"><div class="ss-hd"><b>stickers</b><span>kiss-cut</span></div><div class="ss-grid">${cells}</div>${empty}` +
    `<div class="ss-glass"><span>glassine · lift at Mastery ${D.stickerLevel}</span></div></div>` +
    (open && left.length ? `<button type="button" class="rw-door" data-open-sticker-shelf><span class="cta-run">open the drawer${D.arrow}</span></button>` : "") + `</div></section>`;
}

/* ================================================================
   SECRET HINTS: the locked diary
   ================================================================ */
const HEART = "M0 13 C-9.6 6.6 -12 -0.6 -8 -4.8 C-5 -7.8 -1.6 -6.4 0 -3.4 C1.6 -6.4 5 -7.8 8 -4.8 C12 -0.6 9.6 6.6 0 13 Z";
const KEYHOLE = `<circle class="dy-kh" cx="0" cy="1" r="2.1"/><path class="dy-kh" d="M-1.1 2 L-1.8 6.6 H1.8 L1.1 2 Z"/>`;
// Shut: the strap comes round from the back cover over the page edges and a heart lock holds it to
// the front. Open: the strap hangs loose off the side, and the lock lies open on the page with its
// key still in it. Three states, like the sticker sheet: once every secret charm is found, the
// diary says so and offers no door.
function diary(D) {
  const open = D.secretHints;
  const clasp = open
    ? `<svg class="dy-clasp open" viewBox="0 0 124 160" aria-hidden="true"><path class="dy-strap" d="M50 18 H60 C68 18 72 24 72.6 34 L74 92 C74.2 97 71 100 66 100 H58 C53 100 50.4 97 50.4 92 Z"/>` +
      `<path class="dy-stitch" d="M55.4 22 H60 C64.8 22 67.6 27 68 34 L69.2 92 C69.2 94.4 67.6 95.6 65.4 95.6 H58.6 C56.4 95.6 55 94.4 55 92"/>` +
      `<rect class="dy-metal" x="54.6" y="86" width="15.6" height="10" rx="2"/>` +
      `<g transform="translate(94 120) rotate(-10) scale(1.12)"><path class="dy-shackle" d="M-6 -4 V-12 a6 6 0 0 1 12 0 V-18"/><path class="dy-heart" d="${HEART}"/>${KEYHOLE}` +
      `<path class="dy-keyshaft" d="M0 3.6 L4 24"/><path class="dy-keybit" d="M3.2 17 l-3.8 .9 M3.9 20.6 l-3.2 .8"/><circle class="dy-keybow" cx="5.2" cy="30.4" r="5.4"/><circle class="dy-keyhole" cx="5.2" cy="30.4" r="1.9"/>` +
      `<path class="dy-ribbon" d="M8.4 34.6 C11 39.4 9.4 43.6 5.6 45 M9.4 33.4 C14.6 34.6 17.4 38.6 16 42"/></g></svg>`
    : `<svg class="dy-clasp" viewBox="0 0 96 80" aria-hidden="true"><path class="dy-strap" d="M74 18 H26 C22 18 20 20 20 24 V38 C20 42 22 44 26 44 H74"/>` +
      `<path class="dy-stitch" d="M74 22.4 H27 C25 22.4 24.4 23.4 24.4 25 V37 C24.4 38.6 25 39.6 27 39.6 H74"/>` +
      `<rect class="dy-metal" x="15.4" y="24" width="15" height="14" rx="2.4"/><path class="dy-shackle" d="M17 44 V34 a6 6 0 0 1 12 0 V44"/>` +
      `<g transform="translate(23 53)"><path class="dy-heart" d="${HEART}"/>${KEYHOLE}</g></svg>`;
  const orn = `<svg class="dy-orn" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">` +
    `<path d="M2 14 V6 Q2 2 6 2 H14 M6 9 Q6 6 9 6"/><path d="M86 2 H94 Q98 2 98 6 V14 M91 6 Q94 6 94 9"/>` +
    `<path d="M98 86 V94 Q98 98 94 98 H86 M94 91 Q94 94 91 94"/><path d="M14 98 H6 Q2 98 2 94 V86 M9 94 Q6 94 6 91"/></svg>`;
  const what = !open ? "what every secret charm wants, kept under lock" : D.secretsLeft ? "what every secret charm wants from you, written down" : "every secret charm found; nothing left to read";
  const foot = !open ? `<p class="rw-owe dy-owe">the key comes at Mastery ${D.secretLevel}</p>`
    : D.secretsLeft ? `<button type="button" class="rw-door" data-open-secret-charms><span class="cta-run">read the hints${D.arrow}</span></button>` : "";
  return `<section class="rw-obj rw-hint" style="--o:${T.hint}">` +
    head("Secret hints", what, stamp(D, D.secretLevel)) +
    `<div class="dy${open ? " open" : " shut"}"><div class="dy-book"><span class="dy-pages"></span><div class="dy-cover">${orn}<span class="dy-title">Secrets</span><span class="dy-sub">do not read</span></div>` +
    `${clasp}</div>${foot}</div></section>`;
}

/* ================================================================
   PRESTIGE TITLES: the card file
   ================================================================ */
const TIER_NAMES = ["Poet", "Bridge", "Chairman", "Showgirl"];
const TIER_ROMAN = ["I", "II", "III", "IV"];
const TIER_LEVELS = [...new Set(MASTERY_TITLES.map((t) => t.level))];
// The worn title's drawing pin: a flat red head in ink, pushed in at a lean. It pins the card you
// wear to the file and sits small on that card's label holder, so what is worn is marked by an
// object, never a pen mark laid over it.
const TITLE_PIN = `<svg class="tf-pin" viewBox="0 0 20 24" aria-hidden="true"><path d="M10.6 13.4 L9.4 22.6" class="tf-pin-n"/>` +
  `<path d="M4.2 8.6 C3.6 4.4 6.6 1.8 10.4 2 C14.2 2.2 16.6 5 15.8 8.8 C15.2 11.6 12.8 13.6 10 13.5 C7 13.4 4.6 11.4 4.2 8.6 Z" class="tf-pin-h"/>` +
  `<path d="M7.4 6.4 C8 5 9.2 4.4 10.4 4.5" class="tf-pin-g"/></svg>`;

// The section shell; app.js's renderTitleStepper fills #titleStepper with titleFileHTML, so
// browsing redraws only the file and never the rest of the page.
function titlesShell() {
  return `<section class="rw-obj rw-title" style="--o:${T.title}">` +
    head("Prestige titles", "four ranks, fifteen titles, one engraved on your records signature") +
    `<div id="titleStepper" class="tt tf"></div></section>`;
}

/* Fifteen title cards in a drawer, filed behind four dividers, one a rank. Designed on
   scripts/mastery/title-file-board.html (option A) after the first file read as a puzzle: it
   never said what you wore or what level you were, its locked ranks wore the richest stock and
   so shouted loudest, and tabs plus arrows were two ways round one box.
   - The signature line on top answers "where am I": the worn title, your level, and whether it
     was picked or follows your newest rank. Nothing else on the file states your level.
   - A tab says reached or not and nothing more. Locked, it drops its stock (a dashed outline on
     the page) and reads "at 11" where the numeral was, so a prize rank can never outshout the
     one you hold. The open tab is the top of its card, one piece with it.
   - The drawer front carries a brass label holder per card in the rank, which is how a real
     card drawer says what is inside. They replace the old arrows and "card 1 of 4" plate; never
     put stepping arrows back beside them.
   Every rank is cut from a finer stock than the one before: plain card, deckle edge, gilt edge,
   black card with gold, and that stock lives on the card and on reached tabs only.
   F: { view, worn, picked, has(id), level, issued }. Wired by data-title-view / data-title-wear. */
export function titleFileHTML(F) {
  const reachedL = (L) => F.issued && F.level >= L;
  const v = F.view, t = MASTERY_TITLES[v];
  const open = F.has(t.id), isWorn = t.payload.title === F.worn, k = TIER_LEVELS.indexOf(t.level);
  const inTier = MASTERY_TITLES.filter((x) => x.level === t.level);
  const wornT = MASTERY_TITLES.find((x) => x.payload.title === F.worn);
  const you = F.issued ? `you're Mastery ${F.level}` : "";
  const sig = wornT
    ? `<div class="tf-sig"><span class="tf-sig-k">engraved on your records</span><span class="tf-sig-nm">${esc(wornT.name)}</span>` +
      `<span class="tf-sig-cap">${you} · ${F.picked ? "your pick" : "follows your newest rank"}</span></div>`
    : `<div class="tf-sig none"><span class="tf-sig-cap">${you ? `${you} · ` : ""}your first title comes at Mastery ${TIER_LEVELS[0]}</span></div>`;
  const tabs = TIER_LEVELS.map((L, i) => {
    const on = reachedL(L), here = i === k;
    const first = MASTERY_TITLES.findIndex((x) => x.level === L);
    return `<button type="button" class="tf-tab tier${i}${on ? " on" : ""}${here ? " here" : ""}" style="--i:${i}" data-title-view="${first}"` +
      ` aria-label="Rank ${TIER_ROMAN[i]}, ${TIER_NAMES[i]}${on ? "" : `, opens at Mastery ${L}`}"${here ? ` aria-current="true"` : ""}>` +
      `${tag(F, L, "tf-tag")}<span class="tf-tab-tx"><i>${on ? TIER_ROMAN[i] : `at ${L}`}</i><b>${TIER_NAMES[i]}</b></span></button>`;
  }).join("");
  const kick = !open ? `opens at Mastery ${t.level}`
    : t.isDefault ? `comes with rank ${TIER_ROMAN[k]}` : `one of rank ${TIER_ROMAN[k]}'s ${["two", "three", "four"][inTier.length - 2] || inTier.length}`;
  const card = `<div class="tf-card tier${k}${open ? "" : " lk"}">${isWorn ? TITLE_PIN : ""}<span class="tf-corner"><span class="rw-mk">${MASTERY_ICONS[MASTERY_TIER_ICONS[k]] || ""}</span></span>` +
    `<span class="tc-kick">${kick}</span><span class="tc-title">${esc(t.name)}</span><span class="tc-desc">${esc(t.desc)}</span></div>`;
  const holders = inTier.map((x) => {
    const here = x === t, w = x.payload.title === F.worn;
    return `<button type="button" class="tf-hold${here ? " here" : ""}${w ? " worn" : ""}" data-title-view="${MASTERY_TITLES.indexOf(x)}"` +
      ` aria-label="${esc(x.name)}${w ? ", worn" : ""}"${here ? ` aria-current="true"` : ""}><span class="tf-lab">${esc(x.name)}</span>${w ? TITLE_PIN : ""}</button>`;
  }).join("");
  let act;
  if (!reachedL(TIER_LEVELS[0])) act = `<span class="tt-act lock">your first title comes at Mastery ${TIER_LEVELS[0]}</span>`;
  else if (!open) { const n = Math.max(1, t.level - F.level); act = `<span class="tt-act lock">${n} level${n === 1 ? "" : "s"} to go</span>`; }
  else if (isWorn) act = `<span class="tt-act worn">engraved on your signature</span>`;
  else act = `<button type="button" class="tt-act wear" data-title-wear="${t.payload.title}">wear this title</button>`;
  const reset = F.picked ? `<button type="button" class="tt-reset" data-title-wear="">always wear my newest rank's title</button>`
    : reachedL(TIER_LEVELS[0]) ? `<span class="tt-reset muted">wearing your newest rank's title</span>` : "";
  return `${sig}<div class="tf-file"><div class="tf-tabs">${tabs}</div>${card}<div class="tf-box">${holders}</div></div><div class="tt-foot">${act}${reset}</div>`;
}

/* ================================================================
   the board
   ================================================================ */
/* D: { issued, level, dates, has(id), wear: { tape, paper, trinket, button, label }, RANDOM, albumColors,
        superHard, superHardLevel, brutal: [{ name, beaten }], stickerHints, stickerLevel,
        stickersLeft: [sticker], stickerTotal, secretHints, secretLevel, secretsLeft,
        earned, total, miniButton(finish), nowButton(), arrow } */
export function rewardBoardHTML(D) {
  D.uid = 0;
  const cells = [["tape", tapeRolls], ["paper", paperFan], ["trinket", trinketPins], ["hard", cassette], ["button", buttonCard],
    ["words", labelTape], ["stick", stickerSheet], ["hint", diary], ["title", titlesShell]]
    .map(([area, fn]) => `<div class="rw-cell" style="grid-area:${area}">${fn(D)}</div>`).join("");
  return `<div class="rw"><div class="rw-head"><span class="mpp-kick">Rewards</span><span class="msc-note">what each stamp opened <i>· ${D.earned} of ${D.total} in hand</i></span></div>` +
    `<div class="rw-grid">${cells}</div></div>`;
}
