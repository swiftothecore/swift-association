/* The Mastery page's reward board: every reward family drawn as the object it would come in.
   Pure and state-free, like passport.js: app.js reads the ledger and settings, hands this module
   one plain object `D` (see buildRewardBoard in app.js), and gets markup back. Nothing here
   reads storage, and every choice is wired by app.js through the attributes it already owns:
   data-reward (+ data-variant), data-reward-reset, data-reward-random, data-open-set-picker,
   and the three doors (data-open-brutal, data-open-sticker-shelf, data-open-secret-charms).

   One rule ties the objects to the passport above them: each reward wears the stamp that opened
   it. A single-level object carries the passport's real stamp beside its name (passportStamp), a
   member of a ladder (a pen, a title rank) carries that stamp's outline and number (passportGhost,
   inked), and anything still owed carries the pencil tracing exactly as its passport slot does.
   What the player is wearing is marked in the object's own material, never by a mark laid over
   it: the pen's pocket is satin-stitched in the roll's gold, the bead compartment is lined in
   felt, and the label strips not in use go pale. The paper fan and the button card still wear
   the editor's red loop until theirs are chosen.

   Objects with a material of their own (denim, a cassette, leather, label tape, card stock) keep
   its colours at night, the way the start-button finishes do; only what is ink on the page
   follows the theme. The styles are the REWARD BOARD block in styles.css. */
import { MASTERY_REWARDS, MASTERY_TILE_MARKS, MASTERY_ICONS, MASTERY_TITLES, MASTERY_TIER_ICONS, CTA_LABELS, CTA_MARKS } from "./config.js";
import { passportStamp, passportGhost, passportTracing, passportStampInk, passportBadge } from "./passport.js";
import { trinketPreviewSVG } from "./bracelet.js";
import { stickerArt } from "./stickers.js";

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
// The editor's red pen, looped round whatever is being worn. Drawn per item from a seed, so no
// two loops are the same ellipse, and the tail overshoots the start the way a hand does.
function loop(seed = 1) {
  const pts = [], n = 56, a0 = -2.5 + settle(seed) * 1.2, sweep = Math.PI * 2 + 0.5 + settle(seed + 3) * 0.4;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + sweep * t;
    const r = 45.5 + Math.sin(a * 2 + seed) * 1.6 + Math.sin(a * 3 + seed * 1.7) * 1.1 + t * 3.4;
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`);
  }
  return `<svg class="rw-loop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M${pts.join(" L")}" vector-effect="non-scaling-stroke"/></svg>`;
}
// The randomiser, as a die you shake. Toggles, since while it is worn nothing else is "in use".
function dieControl(kind, active, label) {
  return `<button type="button" class="rw-die${active ? " on" : ""}" data-reward-random="${kind}" aria-pressed="${active}" title="${esc(label)}" aria-label="${esc(label)}">` +
    `<span class="rw-die-ic">${MASTERY_ICONS.die}</span><span class="rw-die-tx">${active ? "shaken" : "shake"}</span></button>`;
}
function head(name, what, stampHTML = "") {
  return `<header class="rw-cap"><div class="rw-cap-tx"><h3 class="rw-nm">${esc(name)}</h3><p class="rw-what">${what}</p></div>${stampHTML}</header>`;
}
const pick = (attr, worn, label) => `${attr} aria-pressed="${worn}" aria-label="${esc(label)}"`;

/* ================================================================
   PENS: the roll
   ================================================================ */
/* The four pens, drawn for the roll at the size they show, one unit a pixel, tip up. Not PEN_SVG
   scaled: those are 22px glyphs for the answer line and turn to stubs blown up. Each keeps its
   glyph's identity (a yellow pencil, a gold nib, a feather, a glitter barrel). If a pen's glyph
   is ever redrawn, redraw it here too. Colours are the object's, so they hold at night. */
const PEN_ART = {
  "": `<svg viewBox="0 0 28 184" class="pn"><path class="pn-wood" d="M11.9 13 L16.1 13 L20.5 33 L7.5 33 Z"/><path class="pn-lead" d="M14 4.2 L16.1 13 L11.9 13 Z"/>` +
    `<path class="pn-yellow" d="M7.5 33 Q9.6 36.6 11.8 33.5 Q14 37.2 16.2 33.5 Q18.4 36.6 20.5 33 L20.5 151 L7.5 151 Z"/>` +
    `<path class="pn-facet" d="M11.8 35.5 V151 M16.2 35.5 V151"/><rect class="pn-ferrule" x="7" y="151" width="14" height="13" rx="1"/>` +
    `<path class="pn-ridge" d="M7.4 154.6 H20.6 M7.4 158.2 H20.6 M7.4 161.6 H20.6"/><path class="pn-eraser" d="M7.6 164 H20.4 V173.5 Q20.4 179.6 14 179.6 Q7.6 179.6 7.6 173.5 Z"/></svg>`,
  fountain: `<svg viewBox="0 0 28 184" class="pn"><path class="pn-nib" d="M14 17 C15.8 21.4 18 27 18.3 34 L18.3 40.4 L9.7 40.4 L9.7 34 C10 27 12.2 21.4 14 17 Z"/>` +
    `<path class="pn-slit" d="M14 20 V32.4"/><circle class="pn-hole" cx="14" cy="33.6" r="1.5"/><path class="pn-slit" d="M10.3 37.4 H17.7"/>` +
    `<path class="pn-grip" d="M9.6 40.4 H18.4 L19.1 57 H8.9 Z"/><rect class="pn-gold" x="8.4" y="57" width="11.2" height="3.6" rx=".8"/>` +
    `<path class="pn-lacquer" d="M8.3 60.6 H19.7 V167 Q19.7 176.4 14 176.4 Q8.3 176.4 8.3 167 Z"/><rect class="pn-gold" x="8.3" y="148" width="11.4" height="3.2"/>` +
    `<path class="pn-shine" d="M11.2 66 V140"/></svg>`,
  quill: `<svg viewBox="0 0 28 184" class="pn"><path class="pn-calamus" d="M14.4 182 C14.3 160 14.1 138 13.8 118"/>` +
    `<path class="pn-vane" d="M12.3 24 C8.2 36 5.6 57 6 80 C6.3 95 8.8 107 13.5 118 L13.4 80 C13.1 57 12.8 40 12.3 24 Z"/>` +
    `<path class="pn-vane" d="M9.4 5 C16.8 13 22.6 30 22.7 54 C22.8 78 19.8 100 15 121 L13.8 121 C13.6 86 13.2 57 12.6 33 C12.2 21 11 12.6 9.4 5 Z"/>` +
    `<path class="pn-barb" d="M13 39 L20.4 31.4 M13.2 55 L21.6 48 M13.4 72 L21 66 M13.6 90 L19.4 85 M12.9 47 L7.4 55.4 M13.1 64 L6.6 72.4 M13.3 84 L8 91.6"/>` +
    `<path class="pn-split" d="M22.6 61 L19.8 59.6 M6.1 69 L8.6 67.6 M21.2 88 L18.6 87"/><path class="pn-rachis" d="M13.8 121 C13.5 86 13.1 57 12.5 33 C12.1 20.6 11 12.4 9.4 5"/></svg>`,
  glitter: `<svg viewBox="0 0 28 184" class="pn"><path class="pn-metal" d="M14 25.6 L16.1 32 L16.7 40.4 L11.3 40.4 L11.9 32 Z"/><circle class="pn-ball" cx="14" cy="26.2" r="1"/>` +
    `<path class="pn-rubber" d="M11 40.4 H17 L18.5 66 H9.5 Z"/><path class="pn-grain" d="M10.5 46 H17.5 M10.3 50.5 H17.7 M10.1 55 H17.9 M9.9 59.5 H18.1"/>` +
    `<rect class="pn-clear" x="9.4" y="66" width="9.2" height="98"/><path class="pn-refill" d="M14 66 V162"/>` +
    `<path class="pn-rubber" d="M9.4 164 H18.6 V170.4 Q18.6 176.4 14 176.4 Q9.4 176.4 9.4 170.4 Z"/></svg>`,
};
const PEN_SHORT = { fountain: "fountain", quill: "quill", glitter: "gel pen" };

// Indigo denim laid open, a stitched pocket a pen, gold thread throughout. The pen you write with
// stands proud of its pocket; a pocket still owed holds nothing but its level, sewn in the dashes
// the passport uses for a stamp not yet pressed.
function pensRoll(D) {
  const slots = [{ id: "", name: "Pencil", short: "pencil", L: 0 }, ...ofKind("pen").map((r) => ({ id: r.payload.pen, name: r.name, short: PEN_SHORT[r.payload.pen] || r.name, L: r.level, rid: r.id }))];
  const pockets = slots.map((p, i) => {
    const open = !p.rid || D.has(p.rid);
    const worn = open && D.wear.pen === p.id;
    // each pocket wears its passport stamp's outline and mark, sewn; the pencil's is its own
    const badge = `<span class="pr-tagc ${!p.L || reached(D, p.L) ? "on" : "owed"}">${passportBadge(p.L)}</span>`;
    const face = `<span class="pr-face"><span class="pr-badge">${badge}</span><span class="pr-nm">${esc(p.short)}</span></span>`;
    if (!open) return `<div class="pr-pk empty">${face}</div>`;
    const attr = p.rid ? `data-reward="${p.rid}"` : `data-reward-reset="pen"`;
    return `<button type="button" class="pr-pk${worn ? " worn" : ""}" data-pen="${p.id}" ${pick(attr, worn, p.name)}>` +
      `<span class="pr-pen">${PEN_ART[p.id] || PEN_ART[""]}</span>${face}</button>`;
  }).join("");
  return `<section class="rw-obj rw-pens" style="--o:${T.pens}">` +
    head("Pens", "the one resting by your answer line") +
    `<div class="pr"><div class="pr-roll"><div class="pr-flap"></div><div class="pr-row">${pockets}</div></div>` +
    `<span class="pr-end"></span><svg class="pr-tie" viewBox="0 0 44 120" aria-hidden="true">` +
    `<path class="pr-strap" d="M-1 50.4 C6 49.6 14 49.8 24 50.6 V61.6 C14 62.2 6 62.4 -1 61.6 Z"/>` +
    `<path class="pr-tail" d="M22.6 60 C26.4 70 27.6 84 25.6 101 L22 100.6 C23.6 85 22.6 72.4 19.6 62.8 Z"/>` +
    `<path class="pr-tail" d="M25 58.4 C31.4 66 33.2 78 31.6 92 L28.4 91.4 C29.4 79 27.8 69 22.6 61.4 Z"/><rect class="pr-knot" x="19" y="49.4" width="8.4" height="14.6" rx="3"/></svg></div></section>`;
}

/* ================================================================
   PAPER: the fan deck
   ================================================================ */
// Angles spaced by hand, not divided evenly: a fan opened by a thumb.
const FAN_AT = [-9, 5.6, 19.6, 34.1, 48.3, 62.8];
const PAPER_LABEL = { default: "Plain", manila: "Manila", parchment: "Parchment", blush: "Blush", slate: "Slate", sage: "Sage" };

// Six strips of the real stock (the game's .paper-chip) on one brass rivet. Shut and banded until
// the set is earned, with the plain sheet you already own on top; open, the stock you write on is
// fanned to the front (a riveted strip cannot slide out) and looped.
function paperFan(D) {
  const slots = [{ id: "", paper: "default", name: "Plain" }, ...ofKind("paper").map((r) => ({ id: r.payload.paper, paper: r.payload.paper, name: r.name, rid: r.id }))];
  const open = slots.length > 1 && D.has(slots[1].rid);
  const n = slots.length;
  const strips = slots.map((p, i) => {
    const a = open ? FAN_AT[i] ?? (-9 + i * 14) : 38 + i * 0.9;
    const worn = open && D.wear.paper === p.id;
    const inner = `<span class="pf-name">${esc(PAPER_LABEL[p.paper] || p.name)}</span><span class="pf-hole"></span>`;
    const z = !open ? n - i : worn ? 20 : i + 1;
    const st = `style="--a:${a.toFixed(1)}deg;z-index:${z}"`;
    if (!open && i > 0) return `<span class="pf-strip paper-chip shut" data-paper="${p.paper}" ${st}>${inner}</span>`;
    const attr = p.rid ? `data-reward="${p.rid}"` : `data-reward-reset="paper"`;
    return `<button type="button" class="pf-strip paper-chip${worn ? " worn" : ""}" data-paper="${p.paper}" ${st} ${pick(attr, worn, p.name)}>${inner}${worn ? loop(5 + i) : ""}</button>`;
  }).join("");
  const level = slots[1] ? MASTERY_REWARDS.find((r) => r.id === slots[1].rid).level : 4;
  const band = open ? "" : `<span class="pf-arm" style="--a:${(38 + (n - 1) * 0.9).toFixed(1)}deg"><span class="pf-band"><b>${n - 1} more stocks</b><i>banded till Mastery ${level}</i></span></span>`;
  return `<section class="rw-obj rw-paper" style="--o:${T.paper}">` +
    head("Paper stock", "what the whole page is written on", stamp(D, level)) +
    `<div class="pf${open ? " open" : " shut"}"><div class="pf-fan">${strips}${band}` +
    `<svg class="pf-rivet" viewBox="0 0 24 24" aria-hidden="true"><circle class="pf-rv-o" cx="12" cy="12" r="8.6"/><circle class="pf-rv-i" cx="12" cy="12" r="4.4"/><circle class="pf-rv-h" cx="12" cy="12" r="1.5"/></svg></div></div></section>`;
}

/* ================================================================
   TRINKETS: the bead box
   ================================================================ */
// A little heap of six in each compartment, settled to the bottom the way loose charms settle.
// Seeded per compartment, so it is the same every time and never the same in two compartments.
const HEAP = [[19, 73], [40, 77], [62, 75], [83, 71], [29, 56], [53, 59], [74, 52]];
function loose(t, i) {
  const skip = Math.floor(settle(i * 13 + 5) * HEAP.length);
  return HEAP.filter((_, k) => k !== skip).map(([x0, y0], k) => {
    const s = i * 11 + k * 3 + 1;
    const x = x0 + jit(s, 4), y = y0 + jit(s + 1, 4), r = jit(s + 2, 48), sc = 0.66 + settle(s + 3) * 0.3;
    return `<span class="tb-bit" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--r:${r.toFixed(0)}deg;--s:${sc.toFixed(2)};z-index:${y0 > 64 ? 2 : 1}">${trinketPreviewSVG(t)}</span>`;
  }).join("");
}
// The bead organiser every friendship-bracelet table is built round. Nine compartments for nine
// trinkets; until the set is earned only the star's has anything in it. Its label is a strip of the
// notebook's shared washi tape (the "Shared washi-tape surface" block in styles.css).
function trinketBox(D) {
  const slots = [{ id: "", t: "star", name: "Star" }, ...ofKind("trinket").map((r) => ({ id: r.payload.trinket, t: r.payload.trinket, name: r.name.replace(/ trinket$/, ""), rid: r.id }))];
  const open = slots.length > 1 && D.has(slots[1].rid);
  const rnd = D.wear.trinket === D.RANDOM;
  const level = slots[1] ? MASTERY_REWARDS.find((r) => r.id === slots[1].rid).level : 5;
  const cells = slots.map((p, i) => {
    const avail = !p.rid || open;
    const worn = avail && !rnd && D.wear.trinket === p.id;
    if (!avail) return `<span class="tb-cell empty"></span>`;
    const attr = p.rid ? `data-reward="${p.rid}"` : `data-reward-reset="trinket"`;
    return `<button type="button" class="tb-cell${worn ? " worn" : ""}" ${pick(attr, worn, p.name)}>` +
      `${loose(p.t, i)}<span class="tb-nm">${esc(p.name.toLowerCase())}</span></button>`;
  }).join("");
  return `<section class="rw-obj rw-trinket" style="--o:${T.trinket}">` +
    head("Trinkets", rnd ? "every bead deals its own, out of the whole box" : "what hangs from every bead you earn", stamp(D, level)) +
    `<div class="tb${rnd ? " shaken" : ""}"><div class="tb-lid"><span class="tb-tape">trinkets</span>${open ? dieControl("trinket", rnd, "Give every bead its own trinket") : ""}</div>` +
    `<div class="tb-box">${cells}</div>` +
    (open ? "" : `<p class="rw-owe">eight more compartments fill at Mastery ${level}</p>`) + `</div></section>`;
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
    `<span class="bc-nm">${esc(name)}</span>${note ? `<span class="bc-note">${note}</span>` : ""}${worn ? loop(41 + i) : ""}</button>`;
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
   START BUTTON WORDS: label-maker tape
   ================================================================ */
// Rewriting a label is a label maker's job, so every set of words is a strip of the notebook's own
// label-maker tape (.stp-dy in styles.css), in the words' teal. Above them, the
// real start button wearing the words and finish chosen.
function labelTape(D) {
  const labels = ofKind("label");
  const slots = [{ id: "", text: "Start writing", mark: "pencil" }, ...labels.map((r) => ({ id: r.payload.label, text: CTA_LABELS[r.payload.label].text, mark: CTA_LABELS[r.payload.label].mark, rid: r.id }))];
  const open = labels.length > 0 && D.has(labels[0].id);
  const level = labels.length ? labels[0].level : 12;
  const rnd = D.wear.label === D.RANDOM;
  const strips = slots.map((p, i) => {
    if (p.rid && !open) return "";
    const worn = !rnd && D.wear.label === p.id;
    const mk = p.mark ? `<span class="lt-mk">${CTA_MARKS[p.mark]}</span>` : "";
    const attr = p.rid ? `data-reward="${p.rid}"` : `data-reward-reset="label"`;
    return `<button type="button" class="lt-pick${worn ? " worn" : ""}" ${pick(attr, worn, p.text)}>` +
      `<span class="stp-dy lt-strip" style="--r:${jit(i + 60, 1.6).toFixed(2)}deg">${mk}${esc(p.text)}</span></button>`;
  }).join("");
  const coil = open ? "" : `<div class="lt-coil"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34"/><circle cx="40" cy="40" r="27"/><circle cx="40" cy="40" r="20.5"/><circle cx="40" cy="40" r="12" class="lt-core"/><path d="M40 6 H80"/></svg>` +
    `<span><b>${labels.length} more labels</b> wait on the roll till Mastery ${level}</span></div>`;
  return `<section class="rw-obj rw-words" style="--o:${T.cta}">` +
    head("Start button words", rnd ? "different words punched out every visit" : "what the front-page button says", stamp(D, level)) +
    `<div class="lt"><div class="rw-now"><span class="rw-now-k">on your page</span><span class="rw-now-btn">${D.nowButton()}</span></div>` +
    `<div class="lt-strips${rnd ? "" : " picked"}">${strips}${coil}</div>` +
    (open ? `<div class="lt-foot">${dieControl("label", rnd, "Different words every visit")}<span>${rnd ? "a new strip every visit" : "or let the button pick its own words"}</span></div>` : "") + `</div></section>`;
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
  const foot = !open ? `<p class="rw-owe">the key comes at Mastery ${D.secretLevel}</p>`
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
const ARW_L = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.8 5.2 C12.6 7.4 10.4 9.6 8.3 12.1 C10.4 14.3 12.7 16.6 15.1 18.9"/></svg>`;
const ARW_R = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.1 5 C11.4 7.2 13.6 9.5 15.8 11.9 C13.5 14.2 11.3 16.6 9 18.8"/></svg>`;

// The section shell; app.js's renderTitleStepper fills #titleStepper with titleFileHTML, so
// browsing redraws only the file and never the rest of the page.
function titlesShell() {
  return `<section class="rw-obj rw-title" style="--o:${T.title}">` +
    head("Prestige titles", "four ranks, fourteen titles, one engraved on your records signature") +
    `<div id="titleStepper" class="tt tf"></div></section>`;
}

/* Fourteen title cards in a box, filed behind four dividers, one a rank. The divider tabs stand up
   behind the card in view, each carrying its stamp's outline and level; every rank is cut from a
   finer stock than the one before: plain card, deckle edge, gilt edge, black card with gold.
   T: { view, worn, picked, has(id), level, issued }. Wired by data-title-view / data-title-wear. */
export function titleFileHTML(F) {
  const reachedL = (L) => F.issued && F.level >= L;
  const v = F.view, t = MASTERY_TITLES[v];
  const open = F.has(t.id), isWorn = t.payload.title === F.worn, k = TIER_LEVELS.indexOf(t.level);
  const inTier = MASTERY_TITLES.filter((x) => x.level === t.level), pos = inTier.indexOf(t) + 1;
  const tabs = TIER_LEVELS.map((L, i) => {
    const on = reachedL(L), here = i === k;
    const first = MASTERY_TITLES.findIndex((x) => x.level === L);
    return `<button type="button" class="tf-tab tier${i}${on ? " on" : ""}${here ? " here" : ""}" style="--i:${i}" data-title-view="${first}" aria-label="Rank ${TIER_ROMAN[i]}, ${TIER_NAMES[i]}">` +
      `${tag(F, L, "tf-tag")}<span class="tf-tab-tx"><i>${TIER_ROMAN[i]}</i><b>${TIER_NAMES[i]}</b></span></button>`;
  }).join("");
  const card = `<div class="tf-card tier${k}${open ? "" : " lk"}"><span class="tf-corner"><span class="rw-mk">${MASTERY_ICONS[MASTERY_TIER_ICONS[k]] || ""}</span></span>` +
    `<span class="tc-kick">${t.isDefault ? "the default" : "an alternate"} · rank ${TIER_ROMAN[k]}</span>` +
    `<span class="tc-title">${esc(t.name)}</span><span class="tc-desc">${esc(t.desc)}</span></div>`;
  const last = MASTERY_TITLES.length - 1;
  const box = `<div class="tf-box"><button type="button" class="tf-arw" data-title-view="${v - 1}"${v === 0 ? " disabled" : ""} aria-label="previous title">${ARW_L}</button>` +
    `<span class="tf-plate"><b>titles</b><i>card ${pos} of ${inTier.length} · Mastery ${t.level}</i></span>` +
    `<button type="button" class="tf-arw" data-title-view="${v + 1}"${v === last ? " disabled" : ""} aria-label="next title">${ARW_R}</button></div>`;
  let act;
  if (!reachedL(TIER_LEVELS[0])) act = `<span class="tt-act lock">your first title comes at Mastery ${TIER_LEVELS[0]}</span>`;
  else if (!open) { const n = Math.max(1, t.level - F.level); act = `<span class="tt-act lock">${n} level${n === 1 ? "" : "s"} to go</span>`; }
  else if (isWorn) act = `<span class="tt-act worn">engraved on your signature</span>`;
  else act = `<button type="button" class="tt-act wear" data-title-wear="${t.payload.title}">wear this title</button>`;
  const reset = F.picked ? `<button type="button" class="tt-reset" data-title-wear="">back to following your mastery</button>`
    : reachedL(TIER_LEVELS[0]) ? `<span class="tt-reset muted">following your mastery</span>` : "";
  return `<div class="tf-file"><div class="tf-tabs">${tabs}</div>${card}${box}</div><div class="tt-foot">${act}${reset}</div>`;
}

/* ================================================================
   the board
   ================================================================ */
/* D: { issued, level, dates, has(id), wear: { pen, paper, trinket, button, label }, RANDOM,
        superHard, superHardLevel, brutal: [{ name, beaten }], stickerHints, stickerLevel,
        stickersLeft: [sticker], stickerTotal, secretHints, secretLevel, secretsLeft,
        earned, total, miniButton(finish), nowButton(), arrow } */
export function rewardBoardHTML(D) {
  D.uid = 0;
  const cells = [["pens", pensRoll], ["paper", paperFan], ["trinket", trinketBox], ["hard", cassette], ["button", buttonCard],
    ["words", labelTape], ["stick", stickerSheet], ["hint", diary], ["title", titlesShell]]
    .map(([area, fn]) => `<div class="rw-cell" style="grid-area:${area}">${fn(D)}</div>`).join("");
  return `<div class="rw"><div class="rw-head"><span class="mpp-kick">Rewards</span><span class="msc-note">what each stamp opened <i>· ${D.earned} of ${D.total} in hand</i></span></div>` +
    `<div class="rw-grid">${cells}</div></div>`;
}
