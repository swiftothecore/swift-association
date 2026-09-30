/* The Mastery page's passport and the five skill stamp cards. Pure and state-free: app.js reads
   the ledger and hands these plain numbers, and gets markup back.

   THE PASSPORT. Mastery's thirteen levels are thirteen pages of stamps. A level you have
   reached is a rubber stamp pressed in the ink of the reward tile it opens on the bento below
   (MASTERY_TILE_MARKS, so the hero and the bento share one set of hues), and it carries the
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
import { MASTERY_ICONS, MASTERY_TILE_MARKS } from "./config.js";
import { skillMarkHTML } from "./skillmarks.js";

/* One entry per level. `glyph` is ["mi", key] for a MASTERY_ICONS mark or ["rw", key] for one
   of the bento's #reward-* drawings (index.html); `tile` names the MASTERY_TILE_MARKS hue. */
const STAMPS = {
  1: { shape: "circle", glyph: ["mi", "fountainpen"], top: "FOUNTAIN PEN", tile: "pens", caption: "Fountain pen" },
  2: { shape: "oval", glyph: ["mi", "feather"], top: "FEATHER QUILL", tile: "pens", caption: "Feather quill" },
  3: { shape: "rect", glyph: ["mi", "gelpen"], top: "GEL PEN", tile: "pens", caption: "Gel pen" },
  4: { shape: "notch", glyph: ["rw", "paper"], top: "PAPER", tile: "paper", caption: "Paper stocks" },
  5: { shape: "scallop", glyph: ["rw", "trinket"], top: "TRINKETS", tile: "trinket", caption: "Trinkets" },
  6: { shape: "shield", glyph: ["mi", "swords"], top: "SUPER-HARD", tile: "hard", caption: "Super-hard" },
  7: { shape: "circle", glyph: ["mi", "laurel"], top: "CERTIFIED POET", tile: "title", caption: "Certified Poet" },
  8: { shape: "rect", glyph: ["rw", "button"], top: "FINISHES", tile: "button", caption: "Button finishes" },
  // level 9 opens two things, so it is two stamps pressed over each other
  9: { shape: "double", glyph: ["mi", "sticker"], top: "STICKERS", tile: "stick", glyph2: ["mi", "bridge"], top2: "BRIDGE BUILDER", tile2: "title", caption: "Stickers + titles" },
  10: { shape: "hex", glyph: ["mi", "key"], top: "SECRETS", tile: "hint", caption: "Secret hints" },
  11: { shape: "circle", glyph: ["mi", "chair"], top: "THE CHAIRMAN", tile: "title", caption: "The Chairman" },
  12: { shape: "oval", glyph: ["rw", "cta"], top: "WORDS", tile: "cta", caption: "Button words" },
  13: { shape: "banner", glyph: ["mi", "plumes"], top: "ULTIMATE SHOWGIRL", tile: "button", caption: "Ultimate Showgirl" },
};
export const PASSPORT_LEVELS = Object.keys(STAMPS).length;

// A fixed wobble per level, so a stamp lands at the same angle every time the page is drawn.
const settle = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const pad = (n) => String(n).padStart(2, "0");
const inner = (svg) => (svg || "").replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

function glyph([src, key], size, dx = 0, dy = 0) {
  if (src === "mi") {
    const s = size / 24;
    return `<g class="mpp-gl" transform="translate(${dx - 12 * s} ${dy - 12 * s}) scale(${s})">${inner(MASTERY_ICONS[key])}</g>`;
  }
  // The bento marks are normalised to a 13.4-unit extent (see scale_reward_glyphs.py), so they
  // are brought up to the rest here. Stroke and fill reach the symbol by inheritance. The
  // <use> needs its size stated: without one a symbol fills the whole stamp.
  const s = size / 24 * 1.45;
  return `<g class="mpp-gl mpp-rw" transform="translate(${dx - 12 * s} ${dy - 12 * s}) scale(${s})"><use href="#reward-${key}" width="24" height="24"/></g>`;
}
const text = (x, y, str, size) =>
  `<text class="mpp-tx" x="${x}" y="${y}" font-size="${size}" text-anchor="middle" letter-spacing="${(size * .1).toFixed(2)}">${str}</text>`;

function stampBody(L, sp, date, uid) {
  const lv = `LVL ${pad(L)}`;
  const when = date || lv;
  switch (sp.shape) {
    case "circle": return `<circle class="mpp-fr" r="36.5" stroke-width="4"/><circle class="mpp-fr" r="29.6" stroke-width="1.5"/>` +
      `<path id="${uid}t" d="M-31.6 0 A31.6 31.6 0 0 1 31.6 0" fill="none"/><path id="${uid}b" d="M-35.2 0 A35.2 35.2 0 0 0 35.2 0" fill="none"/>` +
      `<text class="mpp-tx" font-size="5.6" letter-spacing=".7"><textPath href="#${uid}t" startOffset="50%" text-anchor="middle">${sp.top} · ${lv}</textPath></text>` +
      `<text class="mpp-tx" font-size="5.4" letter-spacing="1"><textPath href="#${uid}b" startOffset="50%" text-anchor="middle">${when}</textPath></text>` +
      glyph(sp.glyph, 30);
    case "oval": return `<ellipse class="mpp-fr" rx="38" ry="28" stroke-width="4"/><ellipse class="mpp-fr" rx="33" ry="23" stroke-width="1.5"/>` +
      text(0, -12.6, sp.top, 5.6) + glyph(sp.glyph, 20, 0, .6) + text(0, 17.6, when, 5.2);
    case "rect": return `<rect class="mpp-fr" x="-38" y="-25" width="76" height="50" rx="4" stroke-width="4"/><rect class="mpp-fr" x="-33.5" y="-20.5" width="67" height="41" rx="2" stroke-width="1.5"/>` +
      glyph(sp.glyph, 25, -17, 0) + `<line class="mpp-fr" x1="-3.5" y1="-15" x2="-3.5" y2="15" stroke-width="1"/>` +
      `<text class="mpp-tx" x="1" y="-7" font-size="6.6" letter-spacing=".5">${sp.top}</text><text class="mpp-tx" x="1" y="3.6" font-size="6" letter-spacing=".8">${lv}</text>` +
      (date ? `<text class="mpp-tx" x="1" y="13" font-size="5.2" letter-spacing=".5">${date}</text>` : "");
    case "notch": {
      const d = "M-30 -27 H30 A7 7 0 0 0 37 -20 V20 A7 7 0 0 0 30 27 H-30 A7 7 0 0 0 -37 20 V-20 A7 7 0 0 0 -30 -27 Z";
      return `<path class="mpp-fr" d="${d}" stroke-width="4"/><path class="mpp-fr" d="${d}" transform="scale(.86)" stroke-width="1.5"/>` +
        text(0, -13.2, `${sp.top} · ${lv}`, 5.4) + glyph(sp.glyph, 22, 0, 1.4) + (date ? text(0, 19, date, 5) : "");
    }
    case "scallop": {
      let d = "";
      const nb = 20;
      for (let i = 0; i < nb; i++) {
        const a0 = i / nb * 2 * Math.PI, a1 = (i + 1) / nb * 2 * Math.PI, am = (a0 + a1) / 2;
        const p0 = [34 * Math.cos(a0), 34 * Math.sin(a0)], p1 = [34 * Math.cos(a1), 34 * Math.sin(a1)], pc = [40.5 * Math.cos(am), 40.5 * Math.sin(am)];
        d += (i === 0 ? `M${p0[0].toFixed(2)} ${p0[1].toFixed(2)}` : "") + ` Q${pc[0].toFixed(2)} ${pc[1].toFixed(2)} ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
      }
      return `<path class="mpp-fr" d="${d} Z" stroke-width="3.6"/><circle class="mpp-fr" r="28.4" stroke-width="1.5"/>` +
        text(0, -15.4, sp.top, 5.4) + glyph(sp.glyph, 24, 0, .6) + text(0, 20.6, date ? date : lv, date ? 5 : 5.4);
    }
    case "shield": {
      const d = "M0 -37 C10 -32.6 20 -30.6 31 -30 C32 -8 26 14 0 37 C-26 14 -32 -8 -31 -30 C-20 -30.6 -10 -32.6 0 -37 Z";
      return `<path class="mpp-fr" d="${d}" stroke-width="4"/><path class="mpp-fr" d="${d}" transform="scale(.84)" stroke-width="1.5"/>` +
        text(0, -17.6, sp.top, 5.4) + glyph(sp.glyph, 24, 0, 0) + text(0, 19.2, lv, 5.4);
    }
    case "hex": {
      const pts = (r) => [...Array(6)].map((_, i) => { const a = i / 6 * 2 * Math.PI; return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a) * .92).toFixed(2)}`; }).join(" ");
      return `<polygon class="mpp-fr" points="${pts(38.5)}" stroke-width="4" stroke-linejoin="round"/><polygon class="mpp-fr" points="${pts(33)}" stroke-width="1.5" stroke-linejoin="round"/>` +
        text(0, -15.8, sp.top, 5.6) + glyph(sp.glyph, 23, 0, .4) + text(0, 21, when, 5);
    }
    case "banner": return `<rect class="mpp-fr" x="-76" y="-27" width="152" height="54" rx="6" stroke-width="4.4"/><rect class="mpp-fr" x="-71" y="-22" width="142" height="44" rx="3.5" stroke-width="1.2"/>` +
      glyph(sp.glyph, 34, -47, 0) + `<line class="mpp-fr" x1="-27" y1="-15" x2="-27" y2="15" stroke-width="1.5"/>` +
      `<text class="mpp-tx" x="-20" y="-6" font-size="9.6" letter-spacing="1.1">ULTIMATE</text><text class="mpp-tx" x="-20" y="6.4" font-size="9.6" letter-spacing="1.1">SHOWGIRL</text>` +
      `<text class="mpp-tx" x="-20" y="16.4" font-size="5.6" letter-spacing=".9">${lv}${date ? ` · ${date}` : ""}</text>` +
      `<path class="mpp-tx" d="M60 -12 l1.6 3.8 3.8 1.6 -3.8 1.6 -1.6 3.8 -1.6 -3.8 -3.8 -1.6 3.8 -1.6 Z"/><path class="mpp-tx" d="M55 8 l1 2.3 2.3 1 -2.3 1 -1 2.3 -1 -2.3 -2.3 -1 2.3 -1 Z"/>`;
  }
  return "";
}

const tileInk = (tile) => MASTERY_TILE_MARKS[tile] || MASTERY_TILE_MARKS.title;

function stampSVG(L, date) {
  const sp = STAMPS[L], uid = `mpp${L}`, wide = sp.shape === "banner";
  const vb = wide ? "-80 -40 160 80" : "-41 -41 82 82";
  const rot = settle(L) * 22 - 11;
  if (sp.shape === "double") {
    const a = { ...sp, shape: "oval" }, b = { shape: "circle", glyph: sp.glyph2, top: sp.top2 };
    return `<svg class="mpp-stamp" viewBox="${vb}" aria-hidden="true" focusable="false"><g filter="url(#stampInk1)">` +
      `<g class="mpp-inked" style="--mpp-ink:${tileInk(sp.tile)}" transform="translate(-9 -9) rotate(-14) scale(.68)">${stampBody(L, a, date, uid + "a")}</g>` +
      `<g class="mpp-inked" style="--mpp-ink:${tileInk(sp.tile2)}" transform="translate(10 11) rotate(9) scale(.64)">${stampBody(L, b, date, uid + "b")}</g></g></svg>`;
  }
  return `<svg class="mpp-stamp" viewBox="${vb}" aria-hidden="true" focusable="false"><g class="mpp-inked" filter="url(#stampInk${L % 3})" style="--mpp-ink:${tileInk(sp.tile)}" ` +
    `transform="rotate(${(wide ? rot / 3 : rot).toFixed(1)})">${stampBody(L, sp, date, uid)}</g></svg>`;
}

function ghostFrame(shape) {
  const a = `class="mpp-ghost-fr"`;
  switch (shape) {
    case "oval": case "double": return `<ellipse rx="37" ry="27" ${a}/>`;
    case "rect": case "notch": return `<rect x="-37" y="-25" width="74" height="50" rx="5" ${a}/>`;
    case "banner": return `<rect x="-75" y="-26" width="150" height="52" rx="6" ${a}/>`;
    case "shield": return `<path d="M0 -36 C10 -32 20 -30 30 -29.4 C31 -8 25 14 0 36 C-25 14 -31 -8 -30 -29.4 C-20 -30 -10 -32 0 -36 Z" ${a}/>`;
    default: return `<circle r="36" ${a}/>`;
  }
}
// Where a stamp will go: its outline pencilled in, the level number, and, on the one you're
// working toward, the ink still owed as a small red bar.
function ghostSVG(L, frac) {
  const sp = STAMPS[L], wide = sp.shape === "banner";
  const vb = wide ? "-80 -40 160 80" : "-41 -41 82 82";
  return `<svg class="mpp-stamp mpp-ghost" viewBox="${vb}" aria-hidden="true" focusable="false"><g transform="rotate(${(settle(L) * 22 - 11).toFixed(1)})">${ghostFrame(sp.shape)}</g>` +
    `<text class="mpp-ghost-n" x="0" y="${wide ? 7 : 5}" text-anchor="middle" font-size="${wide ? 22 : 17}">${L}</text>` +
    (frac != null ? `<g transform="translate(0 30)"><rect x="-20" y="-3" width="40" height="6" rx="3" class="mpp-owed-bg"/><rect x="-20" y="-3" width="${(40 * frac).toFixed(1)}" height="6" rx="3" class="mpp-owed"/></g>` : "") +
    `</svg>`;
}

const fmt = (n) => Math.round(n).toLocaleString("en-GB");

/* d: { issued, total, gate, level, inCur, span, frac, complete, step, sheen,
        dates: { [level]: "14 AUG 26" }, tips: { [level]: "Level 4 · paper stocks" } } */
export function passportHTML(d) {
  const state = (L) => !d.issued ? "locked" : L <= d.level ? "done" : L === d.level + 1 ? "now" : "todo";
  let slots = "";
  for (let L = 1; L <= PASSPORT_LEVELS; L++) {
    const s = state(L);
    const date = d.dates[L] || "";
    const body = s === "done" ? stampSVG(L, date) : ghostSVG(L, s === "now" ? d.frac : null);
    const tip = (d.tips[L] || `Level ${L}`) + (s === "done" && date ? ` · stamped ${date.toLowerCase()}` : "");
    slots += `<div class="mpp-slot ${s}${L === PASSPORT_LEVELS ? " cap" : ""}" data-tip="${tip}" data-tip-delay="200">` +
      `<span class="mpp-no">${pad(L)}</span>${body}<div class="mpp-ct">${STAMPS[L].caption}</div></div>`;
  }
  const bar = (pct, foil) => `<div class="mpp-bar${foil ? " foil" : ""}"><i style="width:${pct.toFixed(1)}%">${foil && d.sheen ? `<span class="mpp-sheen"></span>` : ""}</i></div>`;
  let head, foot;
  if (!d.issued) {
    head = `<div><div class="mpp-kick">Mastery · passport</div><div class="mpp-lv">Not yet issued</div></div>` +
      `<div class="mpp-ink">${bar(Math.min(100, d.total / d.gate * 100))}<p><b>${d.total} / ${d.gate}</b> skill levels, then the first stamp</p></div>`;
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
  return `<div class="mpp"><div class="mpp-head">${head}</div><div class="mpp-grid">${slots}${notIssued}</div><div class="mpp-foot">${foot}</div></div>`;
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
