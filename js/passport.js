/* The Mastery page's passport and the five skill stamp cards. Pure and state-free: app.js reads
   the ledger and hands these plain numbers, and gets markup back.

   THE PASSPORT. Mastery's thirteen levels are thirteen pages of stamps. A level you have
   reached is a rubber stamp pressed in the ink of the reward it opens on the reward board below
   (MASTERY_TILE_MARKS, so the passport and the board share one set of hues), and it carries the
   DAY it was earned, read from the ledger (m.unlocked holds an ISO timestamp per reward). The
   level you are working toward is a dotted ghost of its stamp with the ink still owed; the
   rest are ghosts. Locked, the page is overprinted NOT YET ISSUED.

   THE STAMP CARDS. One loyalty card per skill in its own ink: ten slots, one stamp a level,
   the next slot ringed as it fills. A full card is stamped MASTERED across the whole of it,
   and everything under that stamp steps back, because nothing under it still needs reading.
   The sixth cell is a postmark: the count in the ring, one cancellation wave per skill running
   as long as that card is full.

   The stamps are pressed with the stampInk filters in index.html; the skill marks on the cards
   come from skillmarks.js. */
import { MASTERY_ICONS, MASTERY_TILE_MARKS, MASTERY_REWARD_BY_ID, MASTERY_TIER_ICONS } from "./config.js";
import { skillMarkHTML } from "./skillmarks.js";

/* One entry per level. `glyph` is ["mi", key] for a MASTERY_ICONS mark or ["rw", key] for one
   of the #reward-* drawings (index.html); `tile` names the MASTERY_TILE_MARKS hue.
   Where a reward or a title tier already owns a mark, the stamp takes it FROM there rather than
   naming it again, so a stamp and the tile it points at cannot drift apart.

   A stamp carries two pieces of type and no more: `word`, what it opened, and the date. The
   level number already sits over the slot and the caption names the reward in full, so neither
   is repeated in rubber, and what is left is set big enough to read at the stamp's real size.
   `short` is the caption while the stamp is still owed, cut to fit one line of its slot. */
const rewardMark = (id) => ["mi", MASTERY_REWARD_BY_ID[id].icon];
const tierMark = (i) => ["mi", MASTERY_TIER_ICONS[i]];
const STAMPS = {
  1: { shape: "circle", glyph: rewardMark("pen-fountain"), word: "FOUNTAIN PEN", tile: "pens", caption: "Fountain pen" },
  2: { shape: "oval", glyph: rewardMark("pen-quill"), word: "QUILL", tile: "pens", caption: "Feather quill", short: "Quill" },
  3: { shape: "rect", glyph: rewardMark("pen-glitter"), word: "GEL PEN", tile: "pens", caption: "Gel pen" },
  4: { shape: "notch", glyph: ["rw", "paper"], word: "PAPER", tile: "paper", caption: "Paper stocks" },
  5: { shape: "scallop", glyph: ["rw", "trinket"], word: "TRINKETS", tile: "trinket", caption: "Trinkets" },
  6: { shape: "shield", glyph: rewardMark("hardmode-unlock"), word: "SUPER-HARD", tile: "hard", caption: "Super-hard" },
  7: { shape: "circle", glyph: tierMark(0), word: "CERTIFIED POET", tile: "title", caption: "Certified Poet", short: "Poet" },
  8: { shape: "rect", glyph: ["rw", "button"], word: "FINISHES", tile: "button", caption: "Button finishes", short: "Finishes" },
  // level 9 opens two things, so it is two stamps pressed over each other: the sticker one
  // carries the word, the title one the date
  9: { shape: "double", glyph: rewardMark("sticker-hints"), word: "STICKERS", tile: "stick", glyph2: tierMark(1), tile2: "title", caption: "Stickers + titles", short: "Stickers" },
  10: { shape: "hex", glyph: rewardMark("reveal-hints"), word: "SECRETS", tile: "hint", caption: "Secret hints" },
  11: { shape: "circle", glyph: tierMark(2), word: "THE CHAIRMAN", tile: "title", caption: "The Chairman" },
  12: { shape: "oval", glyph: ["rw", "cta"], word: "WORDS", tile: "cta", caption: "Button words" },
  13: { shape: "banner", glyph: tierMark(3), word: "ULTIMATE SHOWGIRL", tile: "button", caption: "Ultimate Showgirl" },
};
export const PASSPORT_LEVELS = Object.keys(STAMPS).length;

// A fixed wobble per level, so a stamp lands at the same angle every time the page is drawn.
const settle = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const tilt = (L) => settle(L) * 22 - 11;
const pad = (n) => String(n).padStart(2, "0");
const inner = (svg) => (svg || "").replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

function glyph([src, key], size, dx = 0, dy = 0) {
  if (src === "mi") {
    const s = size / 24;
    return `<g class="mpp-gl" transform="translate(${dx - 12 * s} ${dy - 12 * s}) scale(${s})">${inner(MASTERY_ICONS[key])}</g>`;
  }
  // The reward drawings are normalised to a 13.4-unit extent (see scale_reward_glyphs.py), so they
  // are brought up to the rest here. Stroke and fill reach the symbol by inheritance. The
  // <use> needs its size stated: without one a symbol fills the whole stamp.
  const s = size / 24 * 1.45;
  return `<g class="mpp-gl mpp-rw" transform="translate(${dx - 12 * s} ${dy - 12 * s}) scale(${s})"><use href="#reward-${key}" width="24" height="24"/></g>`;
}

/* Type is fitted, not guessed: the biggest size up to `max` at which `str` spans no more than
   `room` units. Courier Prime advances .6em a character, and the tracking is .08em. */
const fit = (str, room, max) => Math.min(max, room / (str.length * 0.6 + (str.length - 1) * 0.08));
const tx = (x, y, str, room, max) => {
  const s = fit(str, room, max);
  return `<text class="mpp-tx" x="${x}" y="${y}" font-size="${s.toFixed(2)}" text-anchor="middle" letter-spacing="${(s * .08).toFixed(2)}">${str}</text>`;
};
// Type round an arc. `d` runs left to right; the text is centred on it.
const arcTx = (id, d, str, room, max) => {
  const s = fit(str, room, max);
  return `<path id="${id}" d="${d}" fill="none"/><text class="mpp-tx" font-size="${s.toFixed(2)}" letter-spacing="${(s * .08).toFixed(2)}">` +
    `<textPath href="#${id}" startOffset="50%" text-anchor="middle">${str}</textPath></text>`;
};
// the top of a ring reads outward, the bottom reads upright from inside
const overArc = (rx, ry = rx) => `M${-rx} 0 A${rx} ${ry} 0 0 1 ${rx} 0`;
const underArc = (rx, ry = rx) => `M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0`;

function scallopPath() {
  let d = "";
  const nb = 20;
  for (let i = 0; i < nb; i++) {
    const a0 = i / nb * 2 * Math.PI, a1 = (i + 1) / nb * 2 * Math.PI, am = (a0 + a1) / 2;
    const p0 = [34 * Math.cos(a0), 34 * Math.sin(a0)], p1 = [34 * Math.cos(a1), 34 * Math.sin(a1)], pc = [40.5 * Math.cos(am), 40.5 * Math.sin(am)];
    d += (i === 0 ? `M${p0[0].toFixed(2)} ${p0[1].toFixed(2)}` : "") + ` Q${pc[0].toFixed(2)} ${pc[1].toFixed(2)} ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
  }
  return d + " Z";
}
const hexPts = (r) => [...Array(6)].map((_, i) => { const a = i / 6 * 2 * Math.PI; return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a) * .92).toFixed(2)}`; }).join(" ");
const NOTCH = "M-30 -29 H30 A7 7 0 0 0 37 -22 V22 A7 7 0 0 0 30 29 H-30 A7 7 0 0 0 -37 22 V-22 A7 7 0 0 0 -30 -29 Z";
const SHIELD = "M0 -37 C11 -33 23 -32 36 -31.5 C37 -6 28 17 0 38 C-28 17 -37 -6 -36 -31.5 C-23 -32 -11 -33 0 -37 Z";

/* The outer edge of each stamp. The stamp presses it heavy and the ghost pencils the very same
   line in dashes, so the outline waiting in a slot is the stamp that will land there. */
function outline(shape, a) {
  switch (shape) {
    case "oval": return `<ellipse rx="38.5" ry="29.5" ${a}/>`;
    case "rect": return `<rect x="-37" y="-30" width="74" height="60" rx="4" ${a}/>`;
    case "notch": return `<path d="${NOTCH}" ${a}/>`;
    case "scallop": return `<path d="${scallopPath()}" ${a}/>`;
    case "shield": return `<path d="${SHIELD}" ${a}/>`;
    case "hex": return `<polygon points="${hexPts(38.5)}" stroke-linejoin="round" ${a}/>`;
    case "banner": return `<rect x="-76" y="-27" width="152" height="54" rx="6" ${a}/>`;
    default: return `<circle r="37" ${a}/>`;
  }
}
const heavy = (sw = 4) => `class="mpp-fr" stroke-width="${sw}"`;
const fine = `class="mpp-fr" stroke-width="1.4"`;

/* One stamp, in two layers: `ink` (the frame and the mark, pressed with the full speckle) and
   `type` (pressed lighter, so the speckle cannot eat a letter). */
function stampBody(L, sp, date, uid) {
  const when = date || `LVL ${pad(L)}`;
  switch (sp.shape) {
    case "circle": return {
      ink: outline("circle", heavy()) + `<circle r="25.5" ${fine}/>` + glyph(sp.glyph, 27),
      type: arcTx(uid + "t", overArc(27.4), sp.word, 76, 8.6) + arcTx(uid + "b", underArc(33.6), when, 62, 8),
    };
    case "oval": return {
      ink: outline("oval", heavy()) + `<ellipse rx="28" ry="19.5" ${fine}/>` + glyph(sp.glyph, 22),
      type: arcTx(uid + "t", overArc(30, 21.2), sp.word, 66, 8.6) + arcTx(uid + "b", underArc(34.6, 25.9), when, 58, 8),
    };
    case "rect": return {
      ink: outline("rect", heavy()) + `<rect x="-32.5" y="-25.5" width="65" height="51" rx="2" ${fine}/>` +
        `<line x1="-25" y1="-9.4" x2="25" y2="-9.4" class="mpp-fr" stroke-width="1"/>` + glyph(sp.glyph, 19, 0, 3),
      type: tx(0, -13.6, sp.word, 58, 8.6) + tx(0, 21.2, when, 56, 8),
    };
    case "notch": return {
      ink: outline("notch", heavy()) + `<path d="${NOTCH}" transform="scale(.86)" ${fine}/>` + glyph(sp.glyph, 18, 0, 2.4),
      type: tx(0, -12.6, sp.word, 52, 8.6) + tx(0, 20.2, when, 50, 8),
    };
    case "scallop": return {
      ink: outline("scallop", heavy(3.6)) + `<circle r="22.5" ${fine}/>` + glyph(sp.glyph, 22),
      type: arcTx(uid + "t", overArc(24.6), sp.word, 64, 8.4) + arcTx(uid + "b", underArc(30.6), when, 56, 7.8),
    };
    case "shield": return {
      ink: outline("shield", heavy()) + `<path d="${SHIELD}" transform="scale(.85)" ${fine}/>` + glyph(sp.glyph, 16, 0, 11.6),
      type: tx(0, -15.6, sp.word, 50, 8.4) + tx(0, -3.2, when, 50, 8),
    };
    case "hex": return {
      ink: outline("hex", heavy()) + `<polygon points="${hexPts(32.5)}" stroke-linejoin="round" ${fine}/>` + glyph(sp.glyph, 15, 0, 1.6),
      type: tx(0, -11.2, sp.word, 42, 8.6) + tx(0, 17.4, when, 38, 7.8),
    };
    case "banner": return {
      ink: outline("banner", heavy(4.4)) + `<rect x="-71" y="-22" width="142" height="44" rx="3.5" class="mpp-fr" stroke-width="1.2"/>` +
        glyph(sp.glyph, 32, -48, 0) + `<line class="mpp-fr" x1="-28" y1="-15" x2="-28" y2="15" stroke-width="1.5"/>` +
        `<path class="mpp-tx" d="M60 -12 l1.6 3.8 3.8 1.6 -3.8 1.6 -1.6 3.8 -1.6 -3.8 -3.8 -1.6 3.8 -1.6 Z"/><path class="mpp-tx" d="M55 8 l1 2.3 2.3 1 -2.3 1 -1 2.3 -1 -2.3 -2.3 -1 2.3 -1 Z"/>`,
      type: `<text class="mpp-tx" x="-21" y="-5.4" font-size="10" letter-spacing=".8">ULTIMATE</text><text class="mpp-tx" x="-21" y="6.6" font-size="10" letter-spacing=".8">SHOWGIRL</text>` +
        `<text class="mpp-tx" x="-21" y="17.2" font-size="7" letter-spacing=".56">${when}</text>`,
    };
  }
  return { ink: "", type: "" };
}

/* Level 9's pair. Each is drawn at full size and pressed at two thirds, so each carries ONE
   piece of type, set bigger to land the same size as the rest: the word on the sticker stamp,
   the date on the title stamp. */
const DOUBLE = [{ at: "translate(-12 -14) rotate(-12) scale(.66)" }, { at: "translate(14 14) rotate(9) scale(.64)" }];
function doubleBody(L, sp, date, uid) {
  const a = {
    ink: outline("oval", heavy()) + `<ellipse rx="32" ry="23" ${fine}/>` + glyph(sp.glyph, 18, 0, 9),
    type: tx(0, -5, sp.word, 56, 12),
  };
  const b = {
    ink: outline("circle", heavy()) + `<circle r="22.5" ${fine}/>` + glyph(sp.glyph2, 24),
    type: arcTx(uid + "b", underArc(32.6), date || `LVL ${pad(L)}`, 78, 11),
  };
  return [a, b];
}

const tileInk = (tile) => MASTERY_TILE_MARKS[tile] || MASTERY_TILE_MARKS.title;
const pressed = (body, ink, filt, at) =>
  `<g class="mpp-inked" style="--mpp-ink:${ink}" transform="${at}"><g filter="url(#stampInk${filt})">${body.ink}</g><g filter="url(#stampType)">${body.type}</g></g>`;

/* `pre` prefixes the ids the arc lettering hangs on. The results screen draws these same stamps
   while the Mastery page sits hidden in the document holding its own, and a textPath pointing
   into a display:none subtree draws nothing, so the two must never share an id. */
function stampSVG(L, date, pre = "mpp") {
  const sp = STAMPS[L], uid = `${pre}${L}`, wide = sp.shape === "banner";
  const vb = wide ? "-80 -40 160 80" : "-41 -41 82 82";
  if (sp.shape === "double") {
    const [a, b] = doubleBody(L, sp, date, uid);
    return `<svg class="mpp-stamp" viewBox="${vb}" aria-hidden="true" focusable="false">` +
      pressed(a, tileInk(sp.tile), 1, DOUBLE[0].at) + pressed(b, tileInk(sp.tile2), 2, DOUBLE[1].at) + `</svg>`;
  }
  return `<svg class="mpp-stamp" viewBox="${vb}" aria-hidden="true" focusable="false">` +
    pressed(stampBody(L, sp, date, uid), tileInk(sp.tile), L % 3, `rotate(${(wide ? tilt(L) / 3 : tilt(L)).toFixed(1)})`) + `</svg>`;
}

// Where a stamp will go: its own outline pencilled in at the angle it will land, the level
// number, and, on the one you're working toward, the ink still owed as a small red bar. The
// dashes are stated per outline so the two shrunken halves of level 9 dash like the rest.
const ghostLine = (k = 1) => `class="mpp-ghost-fr" stroke-width="${(1.3 / k).toFixed(2)}" stroke-dasharray="${(2.5 / k).toFixed(2)} ${(3.2 / k).toFixed(2)}"`;
function ghostSVG(L, frac) {
  const sp = STAMPS[L], wide = sp.shape === "banner";
  const vb = wide ? "-80 -40 160 80" : "-41 -41 82 82";
  const frame = sp.shape === "double"
    ? `<g transform="${DOUBLE[0].at}">${outline("oval", ghostLine(.66))}</g><g transform="${DOUBLE[1].at}">${outline("circle", ghostLine(.66))}</g>`
    : `<g transform="rotate(${(wide ? tilt(L) / 3 : tilt(L)).toFixed(1)})">${outline(sp.shape, ghostLine())}</g>`;
  return `<svg class="mpp-stamp mpp-ghost" viewBox="${vb}" aria-hidden="true" focusable="false">${frame}` +
    `<text class="mpp-ghost-n" x="0" y="${wide ? 7 : 5}" text-anchor="middle" font-size="${wide ? 22 : 17}">${L}</text>` +
    (frac != null ? `<g transform="translate(0 ${wide ? 18 : 17})"><rect x="-20" y="-3" width="40" height="6" rx="3" class="mpp-owed-bg"/><rect x="-20" y="-3" width="${(40 * frac).toFixed(1)}" height="6" rx="3" class="mpp-owed"/></g>` : "") +
    `</svg>`;
}

const fmt = (n) => Math.round(n).toLocaleString("en-GB");

/* d: { issued, total, gate, level, inCur, span, frac, complete, step, sheen,
        dates: { [level]: "14 AUG 26" }, tips: { [level]: "Level 4 · paper stocks" } } */
/* The results screen's level-up spread (celebrateMastery) prints single stamps and slots off
   the same table, so the stamp you are shown at the end of a run is the one on the page. */
export const passportStamp = (L, date, pre = "lvu") => stampSVG(L, date, pre);
export const passportGhost = (L, frac = null) => ghostSVG(L, frac);
export const passportCaption = (L) => STAMPS[L] ? STAMPS[L].caption : "";
export const passportStampInk = (L) => STAMPS[L] ? tileInk(STAMPS[L].tile) : tileInk("title");

/* A ladder member's stamp cut down to a badge: the stamp's own outline at the angle it lands
   and its mark in the middle, with no rubber type, for a pocket too small to letter. Level 0 is
   the pencil every notebook starts with, which no stamp opened, so it borrows the fountain pen's
   ring. Drawn in currentColor; the caller says whether it is sewn solid or still owed. */
const BADGE_PENCIL = { shape: "circle", glyph: ["mi", "hbpencil"] };
export function passportBadge(L) {
  const sp = L ? STAMPS[L] : BADGE_PENCIL;
  const at = `rotate(${tilt(L || 7).toFixed(1)})`;
  return `<svg class="mpp-stamp mpp-badge" viewBox="-41 -41 82 82" aria-hidden="true" focusable="false"><g transform="${at}">` +
    outline(sp.shape, `class="mpp-badge-fr"`) + glyph(sp.glyph, 44) + `</g></svg>`;
}

/* ISSUED, pressed the way NOT YET ISSUED is (one office, two verdicts), in the laurel green of the
   title tile, for the one level-up spread that has no stamp of its own yet: the unlock. */
export const issuedStampSVG = (date) => `<svg class="mpp-stamp" viewBox="-62 -31 124 62" aria-hidden="true" focusable="false"><g class="mpp-inked" style="--mpp-ink:${tileInk("title")}" transform="rotate(-7)">` +
  `<g filter="url(#stampInk1)"><rect x="-56" y="-25" width="112" height="50" rx="6" class="mpp-fr" stroke-width="3.6"/><rect x="-50" y="-19" width="100" height="38" rx="3" class="mpp-fr" stroke-width="1.2"/></g>` +
  `<g filter="url(#stampType)"><text class="mpp-tx" y="3" text-anchor="middle" font-size="19" letter-spacing="3">ISSUED</text><text class="mpp-tx" y="14.6" text-anchor="middle" font-size="7.4" letter-spacing="1.2">${date}</text></g></g></svg>`;

export function passportHTML(d) {
  const state = (L) => !d.issued ? "locked" : L <= d.level ? "done" : L === d.level + 1 ? "now" : "todo";
  let slots = "";
  for (let L = 1; L <= PASSPORT_LEVELS; L++) {
    const s = state(L);
    const date = d.dates[L] || "";
    const body = s === "done" ? stampSVG(L, date) : ghostSVG(L, s === "now" ? d.frac : null);
    const tip = (d.tips[L] || `Level ${L}`) + (s === "done" && date ? ` · stamped ${date.toLowerCase()}` : "");
    slots += `<div class="mpp-slot ${s}${L === PASSPORT_LEVELS ? " cap" : ""}" data-tip="${tip}" data-tip-delay="200">` +
      `<span class="mpp-no">${pad(L)}</span>${body}<div class="mpp-ct">${s === "done" ? STAMPS[L].caption : STAMPS[L].short || STAMPS[L].caption}</div></div>`;
  }
  const bar = (pct, foil) => `<div class="mpp-bar${foil ? " foil" : ""}"><i style="width:${pct.toFixed(1)}%">${foil && d.sheen ? `<span class="mpp-sheen"></span>` : ""}</i></div>`;
  let head, foot;
  if (!d.issued) {
    head = `<div><div class="mpp-kick">Mastery · passport</div><div class="mpp-lv">Not yet issued</div></div>` +
      `<div class="mpp-ink">${bar(Math.min(100, d.total / d.gate * 100))}<p><b>${d.total} / ${d.gate}</b> skill levels to issue</p></div>`;
    foot = `Collect ${d.gate} stamps across the five skill cards below and the passport is issued.`;
  } else if (d.complete) {
    head = `<div><div class="mpp-kick">Mastery · passport</div><div class="mpp-lv">Level ${d.level} <small>every page stamped</small></div></div>` +
      `<div class="mpp-ink">${bar(100, true)}<p><b>${d.level} / ${d.level}</b> stamps · the whole climb, dated</p></div>`;
    foot = `Every stamp carries the day you earned it.`;
  } else {
    head = `<div><div class="mpp-kick">Mastery · passport</div><div class="mpp-lv">${d.level ? `Level ${d.level} <small>of ${PASSPORT_LEVELS}</small>` : `Freshly issued`}</div></div>` +
      `<div class="mpp-ink">${bar(d.frac * 100)}<p><b>${fmt(d.inCur)} / ${fmt(d.span)}</b> ink to the next stamp</p></div>`;
    foot = `Each stamp is dated the day you earned it, in the ink of the reward it opens below · every level asks ${d.step} more ink than the last`;
  }
  const notIssued = d.issued ? "" :
    `<svg class="mpp-void" viewBox="-110 -30 220 60" aria-hidden="true" focusable="false"><g filter="url(#stampInk2)"><rect x="-104" y="-25" width="208" height="50" rx="6" fill="none" stroke="currentColor" stroke-width="3.4"/>` +
    `<text x="0" y="-2" text-anchor="middle" font-size="17" letter-spacing="3" fill="currentColor">NOT YET ISSUED</text>` +
    `<text x="0" y="15" text-anchor="middle" font-size="8.4" letter-spacing="1.6" fill="currentColor">${d.total} OF ${d.gate} SKILL LEVELS</text></g></svg>`;
  return `<div class="mpp${d.issued ? "" : " unissued"}"><div class="mpp-head">${head}</div><div class="mpp-grid">${slots}${notIssued}</div><div class="mpp-foot">${foot}</div></div>`;
}

function slotRing(frac) {
  const r = 14, c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="${r}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="${(c * frac).toFixed(2)} ${c.toFixed(2)}"/></svg>`;
}
const MASTERED_TILT = [-7, -2.5, -9, 1.5, -5];
function masteredStamp(i) {
  return `<svg class="msc-mastered" viewBox="-150 -34 300 68" style="--r:${MASTERED_TILT[i % 5]}deg" aria-hidden="true" focusable="false"><g filter="url(#stampInk${i % 3})">` +
    `<rect x="-145" y="-29" width="290" height="58" rx="9" fill="none" stroke="currentColor" stroke-width="4.6"/><rect x="-137" y="-21" width="274" height="42" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/>` +
    `<text y="12" text-anchor="middle" font-size="33" letter-spacing="10" fill="currentColor">MASTERED</text></g></svg>`;
}

/* The postmark: the count in the ring and one wave per skill, each as long as its card is full. */
function postmark(d) {
  const open = d.total >= d.gate;
  const waves = d.skills.map((s, i) => {
    const n = Math.max(1, Math.round(s.lvl / d.maxLevel * 17)), y = -30 + i * 15;
    let path = `M54 ${y}`;
    for (let j = 0; j < n; j++) path += " q2.4 -4.6 4.8 0 t4.8 0";
    return `<path d="${path}" fill="none" stroke="${s.ink}" stroke-width="3.4" stroke-linecap="round"/>` +
      (s.maxed ? "" : `<text x="${(54 + n * 9.6 + 6).toFixed(1)}" y="${y + 3.8}" font-size="10.5" fill="${s.ink}">${s.lvl}</text>`);
  }).join("");
  return `<div class="msc msc-post" style="--t:var(--ink-soft)" data-tip="${d.total} of ${d.max} skill levels · Mastery opens at ${d.gate}" data-tip-delay="200">` +
    `<svg viewBox="-47 -47 285 94" aria-hidden="true" focusable="false"><g filter="url(#stampInk1)" transform="rotate(-4)" class="msc-post-ring">` +
    `<circle r="44" fill="none" stroke="currentColor" stroke-width="3.4"/><circle r="33" fill="none" stroke="currentColor" stroke-width="1.3"/>` +
    `<path id="mscPostT" d="M-37 0 A37 37 0 0 1 37 0" fill="none"/><path id="mscPostB" d="M-40.6 0 A40.6 40.6 0 0 0 40.6 0" fill="none"/>` +
    `<text font-size="7.6" letter-spacing="1.6" fill="currentColor"><textPath href="#mscPostT" startOffset="50%" text-anchor="middle">SKILL STAMPS</textPath></text>` +
    `<text font-size="6.6" letter-spacing="1.1" fill="currentColor"><textPath href="#mscPostB" startOffset="50%" text-anchor="middle">${open ? `MASTERY OPEN AT ${d.gate}` : `${d.gate} OPENS MASTERY`}</textPath></text>` +
    `<text class="msc-post-n" y="9" text-anchor="middle" font-size="36" fill="currentColor">${d.total}</text>` +
    `<text y="21" text-anchor="middle" font-size="7.4" letter-spacing="1.2" fill="currentColor">OF ${d.max}</text></g>` +
    `<g filter="url(#stampInk2)" class="msc-post-waves">${waves}</g></svg></div>`;
}

/* d: { skills: [{ id, name, blurb, lvl, frac, maxed, toNext, ink }], total, gate, max, maxLevel }
   `ink` is the skill's colour as a CSS value; it reaches every part of the card as --t. */
export function stampCardsHTML(d) {
  const cards = d.skills.map((s, i) => {
    let slots = "";
    for (let k = 1; k <= d.maxLevel; k++) {
      if (k <= s.lvl) slots += `<span class="msc-s on" style="--r:${(settle(k * 7 + i) * 24 - 12).toFixed(0)}deg">${k}</span>`;
      else if (k === s.lvl + 1 && s.frac > 0) slots += `<span class="msc-s part">${slotRing(s.frac)}<b>${k}</b></span>`;
      else slots += `<span class="msc-s off">${k}</span>`;
    }
    return `<div class="msc${s.maxed ? " maxed" : ""}" style="--t:${s.ink}" data-tip="${s.blurb}" data-tip-delay="400">` +
      `<div class="msc-top"><span class="msc-mark">${skillMarkHTML(s.id)}</span><span class="msc-name">${s.name}</span>` +
      `<span class="msc-lv">${s.lvl}<small>/${d.maxLevel}</small></span></div><div class="msc-slots">${slots}</div>` +
      `<div class="msc-foot"><span class="msc-blurb">${s.blurb}</span><span class="msc-next">${s.maxed ? "" : `${fmt(s.toNext)} ink to ${s.lvl + 1}`}</span></div>` +
      (s.maxed ? masteredStamp(i) : "") + `</div>`;
  }).join("");
  return `<div class="msc-head"><span class="mpp-kick">Skills</span><span class="msc-note">one stamp a level</span></div>` +
    `<div class="msc-grid">${cards}${postmark(d)}</div>`;
}
