// The hand-strung friendship-bracelet keepsake, rendered as SVG.
// Pure: given the per-round results (and the picked albums), returns markup.
// Classic runs draw 13 beads with white "13" tie cubes. Longer runs keep the
// same readable bead size: live play turns over to a fresh 13-page section, and
// finished strands coil through up to three rows with an earlier-pages marker.
import { TOTAL_ROUNDS, ALBUM_COLORS } from "./config.js";

export function starPath(cx, cy, rOut, rIn) {
  let d = "";
  for (let k = 0; k < 10; k++) {
    const r = k % 2 === 0 ? rOut : rIn;
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    d += (k ? "L" : "M") + (cx + r * Math.cos(a)).toFixed(2) + "," + (cy + r * Math.sin(a)).toFixed(2);
  }
  return d + "Z";
}

// ---- Dangling trinkets (Mastery level-5 reward) ----
// Each draws a trinket centred at (cx,cy) with "radius" r, in the bracelet's bead
// style (fill via .b-bead → var(--bead); the caller wraps the trinket in a group
// carrying the album --bead tint). `sw` is the ink stroke width. "star" is the
// default keepsake; "nib" is reserved for word-perfect verse rounds and "stopwatch"
// for a Ruthless page named on sight; the rest are player-selectable via
// settings.masteryTrinket.
function cFill(d, sw) { return `<path d="${d}" class="b-bead" stroke-width="${sw}" stroke-linejoin="round"/>`; }
function cEllipse(cx, cy, rx, ry, rot, sw) {
  return `<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(2)} ${cy.toFixed(2)})" class="b-bead" stroke-width="${sw}"/>`;
}
function cCircle(cx, cy, rr, sw) { return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${rr.toFixed(2)}" class="b-bead" stroke-width="${sw}"/>`; }
function cGloss(cx, cy, rr) { return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${rr.toFixed(2)}" class="b-gloss"/>`; }

export const TRINKETS = {
  star(cx, cy, r, sw) {
    return cFill(starPath(cx, cy, r, r * 0.419), sw) + cGloss(cx - 0.257 * r, cy - 0.392 * r, 0.162 * r);
  },
  heart(cx, cy, r, sw) {
    const d = `M${cx},${cy + 0.90 * r} C${cx - 1.35 * r},${cy - 0.15 * r} ${cx - 0.70 * r},${cy - 1.05 * r} ${cx},${cy - 0.40 * r} C${cx + 0.70 * r},${cy - 1.05 * r} ${cx + 1.35 * r},${cy - 0.15 * r} ${cx},${cy + 0.90 * r} Z`;
    return cFill(d, sw) + cGloss(cx - 0.48 * r, cy - 0.42 * r, r * 0.13);
  },
  moon(cx, cy, r, sw) {
    const pt = (px, py) => `${(cx + px * r).toFixed(2)},${(cy + py * r).toFixed(2)}`;
    const lune = `M${pt(0.26, 0.9656)} A${r} ${r} 0 1 1 ${pt(0.26, -0.9656)} A${r} ${r} 0 0 0 ${pt(0.26, 0.9656)} Z`;
    return `<g transform="rotate(-20 ${cx} ${cy}) translate(${(0.37 * r).toFixed(2)} 0)">${cFill(lune, sw)}${cGloss(cx - 0.52 * r, cy - 0.24 * r, r * 0.12)}</g>`;
  },
  daisy(cx, cy, r, sw) {
    let s = ""; const off = 0.58 * r;
    for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 3; s += cEllipse(cx + off * Math.cos(a), cy + off * Math.sin(a), 0.50 * r, 0.30 * r, (a * 180) / Math.PI, sw); }
    return s + cCircle(cx, cy, 0.34 * r, sw) + cGloss(cx, cy, r * 0.18);
  },
  bow(cx, cy, r, sw) {
    const L = `M${cx},${cy} Q${cx - 0.72 * r},${cy - 0.98 * r} ${cx - 1.18 * r},${cy - 0.66 * r} Q${cx - 1.34 * r},${cy} ${cx - 1.18 * r},${cy + 0.66 * r} Q${cx - 0.72 * r},${cy + 0.98 * r} ${cx},${cy} Z`;
    const R = `M${cx},${cy} Q${cx + 0.72 * r},${cy - 0.98 * r} ${cx + 1.18 * r},${cy - 0.66 * r} Q${cx + 1.34 * r},${cy} ${cx + 1.18 * r},${cy + 0.66 * r} Q${cx + 0.72 * r},${cy + 0.98 * r} ${cx},${cy} Z`;
    const tails = `M${cx - 0.18 * r},${cy + 0.20 * r} L${cx - 0.62 * r},${cy + 1.22 * r} L${cx - 0.16 * r},${cy + 0.95 * r} L${cx + 0.16 * r},${cy + 0.95 * r} L${cx + 0.62 * r},${cy + 1.22 * r} L${cx + 0.18 * r},${cy + 0.20 * r} Z`;
    return cFill(tails, sw) + cFill(L, sw) + cFill(R, sw) + cCircle(cx, cy, 0.30 * r, sw);
  },
  pick(cx, cy, r, sw) {
    const d = `M${cx - 0.86 * r},${cy - 0.48 * r} C${cx - 0.86 * r},${cy - 1.02 * r} ${cx + 0.86 * r},${cy - 1.02 * r} ${cx + 0.86 * r},${cy - 0.48 * r} C${cx + 0.86 * r},${cy + 0.12 * r} ${cx + 0.34 * r},${cy + 0.74 * r} ${cx},${cy + 0.98 * r} C${cx - 0.34 * r},${cy + 0.74 * r} ${cx - 0.86 * r},${cy + 0.12 * r} ${cx - 0.86 * r},${cy - 0.48 * r} Z`;
    return cFill(d, sw) + cGloss(cx - 0.40 * r, cy - 0.50 * r, r * 0.13);
  },
  note(cx, cy, r, sw) {
    const pt = (px, py) => `${(cx + px * r).toFixed(2)},${(cy + py * r).toFixed(2)}`;
    const SL = -0.08, SR = 0.12, TY = -0.96;
    const stemflag = `M${pt(SL, TY)} L${pt(SL, 0.62)} L${pt(SR, 0.62)} L${pt(SR, -0.50)} C${pt(0.72, -0.34)} ${pt(0.82, -0.72)} ${pt(0.56, -0.95)} C${pt(0.38, -1.10)} ${pt(0.22, -1.03)} ${pt(SR, -0.96)} Z`;
    const hx = cx - 0.26 * r, hy = cy + 0.60 * r;
    const head = `<ellipse cx="${hx.toFixed(2)}" cy="${hy.toFixed(2)}" rx="${(0.46 * r).toFixed(2)}" ry="${(0.34 * r).toFixed(2)}" transform="rotate(-20 ${hx.toFixed(2)} ${hy.toFixed(2)})" class="b-bead" stroke-width="${sw}"/>`;
    return cFill(stemflag, sw) + head;
  },
  lightning(cx, cy, r, sw) {
    const d = `M${cx + 0.46 * r},${cy - 1.12 * r} L${cx - 0.66 * r},${cy + 0.20 * r} L${cx - 0.07 * r},${cy + 0.14 * r} L${cx - 0.46 * r},${cy + 1.12 * r} L${cx + 0.66 * r},${cy - 0.27 * r} L${cx + 0.05 * r},${cy - 0.20 * r} Z`;
    return cFill(d, sw) + cGloss(cx + 0.02 * r, cy - 0.46 * r, r * 0.13);
  },
  snake(cx, cy, r, sw) {
    const pt = (px, py) => `${(cx + px * r).toFixed(2)},${(cy + py * r).toFixed(2)}`;
    const cl = `M${pt(0.08, -0.56)} C${pt(0.56, -0.44)} ${pt(0.50, 0.02)} ${pt(0.02, 0.10)} C${pt(-0.42, 0.17)} ${pt(-0.46, 0.54)} ${pt(0.00, 0.62)} C${pt(0.26, 0.67)} ${pt(0.30, 0.48)} ${pt(0.13, 0.47)}`;
    const bw = 0.30 * r, out = Number(sw);
    const behind = `<path d="${cl}" fill="none" stroke="var(--ink)" stroke-width="${(bw + 2 * out).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const front = `<path d="${cl}" fill="none" stroke="var(--bead)" stroke-width="${bw.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const hx = cx + 0.11 * r, hy = cy - 0.58 * r;
    const head = `<ellipse cx="${hx.toFixed(2)}" cy="${hy.toFixed(2)}" rx="${(0.30 * r).toFixed(2)}" ry="${(0.22 * r).toFixed(2)}" transform="rotate(-38 ${hx.toFixed(2)} ${hy.toFixed(2)})" class="b-bead" stroke-width="${sw}"/>`;
    const eye = `<circle cx="${(cx + 0.19 * r).toFixed(2)}" cy="${(cy - 0.64 * r).toFixed(2)}" r="${(0.062 * r).toFixed(2)}" fill="var(--paper)"/>`;
    const tongue = `<path d="M${pt(0.25, -0.67)} L${pt(0.45, -0.89)}" stroke="var(--ink)" stroke-width="${(out * 0.9).toFixed(2)}" fill="none" stroke-linecap="round"/><path d="M${pt(0.45, -0.89)} L${pt(0.54, -0.88)} M${pt(0.45, -0.89)} L${pt(0.46, -0.98)}" stroke="var(--ink)" stroke-width="${(out * 0.8).toFixed(2)}" fill="none" stroke-linecap="round"/>`;
    return behind + front + head + eye + tongue;
  },
  // A small horned devil face — the keepsake for a caught Impostor. Not player-
  // selectable; hung automatically on beads that flagged a fake (see impostorCaught).
  devil(cx, cy, r, sw) {
    const pt = (px, py) => `${(cx + px * r).toFixed(2)},${(cy + py * r).toFixed(2)}`;
    const X = (px) => (cx + px * r).toFixed(2), Y = (py) => (cy + py * r).toFixed(2);
    const hornL = `M${pt(-0.70, -0.44)} L${pt(-1.00, -1.12)} L${pt(-0.28, -0.66)} Z`;
    const hornR = `M${pt(0.70, -0.44)} L${pt(1.00, -1.12)} L${pt(0.28, -0.66)} Z`;
    const face = cCircle(cx, cy + 0.10 * r, 0.82 * r, sw);
    const brow = Math.max(Number(sw) * 1.05, r * 0.14).toFixed(2);
    const feat = Math.max(Number(sw) * 0.95, r * 0.11).toFixed(2);
    const pupil = (0.09 * r).toFixed(2);
    // angry V-shaped brows + dot eyes beneath, then a wide grin
    const eyes =
      `<path d="M${pt(-0.48, -0.18)} L${pt(-0.14, 0.00)}" stroke="var(--ink)" stroke-width="${brow}" fill="none" stroke-linecap="round"/>` +
      `<path d="M${pt(0.48, -0.18)} L${pt(0.14, 0.00)}" stroke="var(--ink)" stroke-width="${brow}" fill="none" stroke-linecap="round"/>` +
      `<circle cx="${X(-0.29)}" cy="${Y(0.16)}" r="${pupil}" fill="var(--ink)"/>` +
      `<circle cx="${X(0.29)}" cy="${Y(0.16)}" r="${pupil}" fill="var(--ink)"/>`;
    const mouth = `<path d="M${pt(-0.36, 0.44)} Q${pt(0, 0.72)} ${pt(0.36, 0.44)}" stroke="var(--ink)" stroke-width="${feat}" fill="none" stroke-linecap="round"/>`;
    return cFill(hornL, sw) + cFill(hornR, sw) + face + eyes + mouth;
  },
  // A horseshoe, open end down, three nails punched through the band — the keepsake for a
  // bead won at stake in the risk challenges. Not player-selectable; hung automatically on
  // the pages where a bet actually paid (see riskWon). Built from segments rather than arcs
  // so the band stays even at any bead scale.
  horseshoe(cx, cy, r, sw) {
    const Ro = 1.0 * r, Ri = 0.60 * r, Rm = (Ro + Ri) / 2;
    const A0 = 200, A1 = -20;                 // sweeps over the top, so the shoe hangs mouth-down
    const P = (R, deg) => {
      const a = (deg * Math.PI) / 180;
      return `${(cx + R * Math.cos(a)).toFixed(2)},${(cy - R * Math.sin(a)).toFixed(2)}`;
    };
    const N = 20;
    let d = "M" + P(Ro, A0);
    for (let k = 1; k <= N; k++) d += "L" + P(Ro, A0 + ((A1 - A0) * k) / N);
    d += "L" + P(Ri, A1);
    for (let k = 1; k <= N; k++) d += "L" + P(Ri, A1 + ((A0 - A1) * k) / N);
    const holes = [155, 90, 25].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return `<circle cx="${(cx + Rm * Math.cos(a)).toFixed(2)}" cy="${(cy - Rm * Math.sin(a)).toFixed(2)}" ` +
        `r="${(0.11 * r).toFixed(2)}" fill="var(--paper)"/>`;
    }).join("");
    return cFill(d + "Z", sw) + holes + cGloss(cx - 0.62 * r, cy - 0.42 * r, r * 0.12);
  },
  // A pocket stopwatch, crown up, hands at a few seconds past twelve — the keepsake for a
  // Ruthless page named on sight (see snapPage / ruthlessSnap). Not player-selectable: it is an
  // earned mark like the nib and the horseshoe, which is why it is out of RANDOM_TRINKET_IDS.
  // The case sits low in the trinket's box so the crown has room without the whole thing reading
  // small, and the hands are drawn short and stubby, because at a bead's scale a fine minute
  // hand is one grey pixel.
  stopwatch(cx, cy, r, sw) {
    const X = (p) => (cx + p * r).toFixed(2), Y = (p) => (cy + p * r).toFixed(2);
    const crown = `M${X(-0.20)},${Y(-1.14)} L${X(0.20)},${Y(-1.14)} L${X(0.20)},${Y(-0.80)} L${X(-0.20)},${Y(-0.80)} Z`;
    const case_ = cCircle(cx, cy + 0.14 * r, 0.86 * r, sw);
    const hand = Math.max(Number(sw) * 1.05, r * 0.13).toFixed(2);
    const hands =
      `<path d="M${X(0)},${Y(0.14)} L${X(0)},${Y(-0.50)}" stroke="var(--ink)" stroke-width="${hand}" fill="none" stroke-linecap="round"/>` +
      `<path d="M${X(0)},${Y(0.14)} L${X(0.42)},${Y(0.36)}" stroke="var(--ink)" stroke-width="${hand}" fill="none" stroke-linecap="round"/>`;
    return cFill(crown, sw) + case_ + hands + cGloss(cx - 0.42 * r, cy - 0.22 * r, r * 0.13);
  },
  nib(cx, cy, r, sw) {
    const h = 1.108 * r, w = 0.649 * r;
    const d = `M${cx},${cy - h} L${cx + w},${cy - h * 0.15} L${cx},${cy + h} L${cx - w},${cy - h * 0.15} Z`;
    return cFill(d, sw) +
      `<circle cx="${cx}" cy="${(cy - h * 0.2).toFixed(2)}" r="${(0.176 * r).toFixed(2)}" class="b-nib-hole"/>` +
      `<path d="M${cx},${(cy - h * 0.05).toFixed(2)} L${cx},${(cy + h * 0.82).toFixed(2)}" class="b-nib-slit" stroke-width="1"/>`;
  },
};

// ---- Random strands ----
// What a "random" strand draws from: the eight player-unlockable trinkets plus the star. The
// star is in the pool deliberately, so it isn't the one trinket random can never hand you.
// The automatic keepsakes (nib, devil, horseshoe, stopwatch) are NOT here and never will be:
// those are earned marks, and a random strand must never counterfeit one.
export const RANDOM_TRINKET_IDS = ["star", "heart", "moon", "daisy", "bow", "pick", "note", "lightning", "snake"];

// Which trinket a given bead wears on a random strand. Deterministic in (seed, index) and
// nothing else, because the bracelet re-renders on EVERY page turn: anything reaching for
// Math.random() here would reshuffle the whole strand in front of the player between pages.
// The seed moves once a run (see resetRunState in app.js), which is what keeps this a
// surprise rather than a fixed pattern where bead 3 is a moon on every bracelet forever.
export function randomTrinketForBead(seed, i) {
  let h = ((seed >>> 0) ^ Math.imul(i + 1, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return RANDOM_TRINKET_IDS[h % RANDOM_TRINKET_IDS.length];
}

// One source of truth for the finish and dangle meanings. The renderer and the
// results-page text recap both read these helpers, so the visual strand cannot
// quietly acquire a meaning that its accessible explanation does not know.
export function braceletFinish(result, i, opts = {}) {
  if (opts.sealed) return "sealed";
  if (result === true) {
    const tier = (opts.verseTiers || [])[i];
    return tier === "perfect" ? "pearl" : (opts.hinted || [])[i] ? "matte" : "gloss";
  }
  if (result === false) {
    if ((opts.skullMiss || [])[i]) return "skull";
    // Insurance: a page a shield took the miss for. Still a miss — it is strung on the frosted
    // body, not a coloured one — but a miss that was paid for, so it wears the patch.
    if ((opts.shieldSaved || [])[i]) return "shielded";
    return "clear";
  }
  return "empty";
}

export function braceletTrinketId(i, opts = {}) {
  if (opts.sealed) return null;
  const tier = (opts.verseTiers || [])[i];
  if ((opts.impostorCaught || [])[i]) return "devil";
  if ((opts.riskWon || [])[i]) return "horseshoe";
  if ((opts.snapPage || [])[i]) return "stopwatch";
  if (tier === "perfect" || tier === "verse") return "nib";
  if (opts.trinket === "random") return randomTrinketForBead(opts.trinketSeed || 0, i);
  return opts.trinket && TRINKETS[opts.trinket] ? opts.trinket : "star";
}

export const BRACELET_ROW_CAP = 13;
export const BRACELET_RESULT_ROWS = 3;

// Pure geometry model for both the SVG and the developer audit. A live long run
// shows the current 13-page section. A completed long run shows at most the most
// recent 39 pages, wrapped like one bracelet laid in a loose serpentine coil.
export function braceletLayout(totalValue, activeRound = 0, filledValue = 0, compact = false) {
  const parsedTotal = Number(totalValue);
  const total = Math.max(1, Math.floor(Number.isFinite(parsedTotal) ? parsedTotal : TOTAL_ROUNDS));
  const parsedFilled = Number(filledValue);
  const filled = Math.max(0, Math.min(total,
    Math.floor(Number.isFinite(parsedFilled) ? parsedFilled : 0)));
  const live = Number(activeRound) > 0;
  const active = Math.max(1, Math.min(total, Math.floor(Number(activeRound) || 1)));
  const maxFinished = BRACELET_ROW_CAP * BRACELET_RESULT_ROWS;

  let visibleStart = 0;
  let visibleCount;
  if (live) {
    visibleStart = total > BRACELET_ROW_CAP
      ? Math.floor((active - 1) / BRACELET_ROW_CAP) * BRACELET_ROW_CAP
      : 0;
    visibleCount = Math.min(BRACELET_ROW_CAP, total - visibleStart);
  } else {
    const made = Math.max(1, filled);
    visibleStart = Math.max(0, made - maxFinished);
    visibleCount = made - visibleStart;
  }

  const rowCount = live ? 1 : Math.max(1, Math.ceil(visibleCount / BRACELET_ROW_CAP));
  const lengths = [];
  if (live) {
    lengths.push(visibleCount);
  } else {
    const base = Math.floor(visibleCount / rowCount);
    const extra = visibleCount % rowCount;
    for (let r = 0; r < rowCount; r++) lengths.push(base + (r < extra ? 1 : 0));
  }

  const W = 520, CENTRE = 220, PITCH = 29;
  const prefixOffset = visibleStart > 0 ? 22 : 0;
  const rowStep = 112;
  const rows = [];
  const slots = [];
  let cursor = 0;
  for (let r = 0; r < rowCount; r++) {
    const length = Math.max(1, lengths[r]);
    const span = (length - 1) * PITCH;
    const left = live ? 46 : CENTRE - span / 2;
    // The last row always runs left to right so its numbered tie can finish at
    // the ordinary right-hand side. Rows above it alternate to make one coil.
    const dir = live ? 1 : ((rowCount - 1 - r) % 2 === 0 ? 1 : -1);
    const right = left + span;
    const y = prefixOffset + (compact ? 38 : 44) + r * rowStep;
    const row = {
      index: r, length, dir, left, right, y,
      startX: dir > 0 ? left : right,
      endX: dir > 0 ? right : left,
    };
    rows.push(row);
    for (let c = 0; c < length; c++) {
      slots.push({
        index: visibleStart + cursor + c,
        row: r,
        col: c,
        dir,
        x: dir > 0 ? left + c * PITCH : right - c * PITCH,
        y,
      });
    }
    cursor += length;
  }

  const height = live
    ? prefixOffset + (compact ? 88 : 132)
    : prefixOffset + (rowCount - 1) * rowStep + 132;
  return {
    width: W, height, total, filled, live, compact,
    visibleStart, visibleCount, omitted: visibleStart,
    rows, slots, pitch: PITCH,
  };
}

// The bone bead. Not a dangling trinket but a BEAD: it replaces the matte spacer on the one
// page a sudden-death run actually died on (Insurance's uninsured miss), so the strand says
// where it ended without a caption. Drawn in the miss bead's own muted paper, since it is
// still a page that was lost — the shape does the talking, not the colour.
export function skullBead(cx, cy, r, sw) {
  const X = (p) => (cx + p * r).toFixed(2), Y = (p) => (cy + p * r).toFixed(2);
  const w = Number(sw);
  // cranium + a jaw block tucked under it, drawn as one silhouette
  const jaw = `<rect x="${X(-0.52)}" y="${Y(0.34)}" width="${(1.04 * r).toFixed(2)}" height="${(0.66 * r).toFixed(2)}" ` +
    `rx="${(0.16 * r).toFixed(2)}" class="b-skull" stroke-width="${sw}"/>`;
  const cranium = `<circle cx="${X(0)}" cy="${Y(-0.12)}" r="${(0.96 * r).toFixed(2)}" class="b-skull" stroke-width="${sw}"/>`;
  const socket = (dx) => `<ellipse cx="${X(dx)}" cy="${Y(-0.16)}" rx="${(0.27 * r).toFixed(2)}" ry="${(0.31 * r).toFixed(2)}" class="b-skull-hole"/>`;
  const nose = `<path d="M${X(0)},${Y(0.08)} L${X(-0.13)},${Y(0.32)} L${X(0.13)},${Y(0.32)} Z" class="b-skull-hole"/>`;
  // two gaps in the teeth, kept clear of the nose above them so the jaw doesn't read as one block
  const teeth = [-0.21, 0.21].map((dx) =>
    `<path d="M${X(dx)},${Y(0.50)} L${X(dx)},${Y(0.90)}" class="b-skull-line" stroke-width="${Math.max(0.6, w * 0.8).toFixed(2)}"/>`).join("");
  return jaw + cranium + socket(-0.40) + socket(0.40) + nose + teeth;
}

// A standalone trinket glyph for the Mastery picker (no bead or thread). `tint` sets
// the --bead fill; omit to inherit the current era tint.
export function trinketPreviewSVG(id, tint) {
  const fn = TRINKETS[id] || TRINKETS.star;
  const r = 6.8, sw = Math.max(0.7, r * 0.15).toFixed(2);
  const style = tint ? ` style="--bead:${tint}"` : "";
  return `<svg viewBox="0 0 24 24" class="trinket-preview" aria-hidden="true"><g${style} transform="translate(12 12.5)">${fn(0, 0, r, sw)}</g></svg>`;
}

// ---- The strand's materials ----
// PEN is deliberately not var(--ink). A white bead is a white OBJECT, not ink on paper: in
// dark mode var(--ink) becomes a warm paper-white, and every near-white piece here — the
// alphabet cubes and their lettering, the pearls, the frosted misses, the spacer discs —
// would lose both its outline and its letters against its own body. Coloured beads keep
// var(--ink), where the theme-aware pen line still reads.
const PEN = "#2b2722";
const CORD = "#c8b28c", CORD_HI = "#efe6d2", DISC = "#efe6d2", CUBE = "#fffdf6";
// the knot is the cord seen bunched, so it is shaded as a body rather than a flat disc
const CORD_DK = "#7a6743", CORD_LT = "#fffcf0";
// The margin red, for the one mark on the strand that is a REPAIR rather than a result: the
// patch over a miss an Insurance shield took. Fixed rather than var(--ink) for the same reason
// PEN is: it has to hold its meaning on the night page as well as the cream one.
const MEND = "#9c3b2e";

const n = (v) => (+v).toFixed(2);

// Stable per-bead wobble. Seeded from the bead's index and nothing else, because the strand
// is rebuilt on EVERY page turn: anything random here would reshuffle every bead's tilt in
// front of the player between pages.
function jitter(i, salt, amp) {
  let h = (Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0xc2b2ae35) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return ((h & 0xffff) / 0xffff - 0.5) * amp;
}

// Ids have to be unique across the DOCUMENT, not just within one <svg> — the results screen
// can hold a strand while another is still mounted, and the keepsake card nests a third.
let BR_UID = 0;

// The light on the beads is colour-agnostic on purpose: one white overlay and one graphite
// overlay, reused by every bead whatever colour it is. That means a bead can be filled with
// var(--bead) — a CSS variable no arithmetic could interpolate — and still be lit exactly
// like the album-coloured ones beside it.
function beadDefs(u) {
  return `<linearGradient id="${u}lit" x1="0.12" y1="0" x2="0.72" y2="0.9">` +
      `<stop offset="0" stop-color="#fff" stop-opacity="0.44"/>` +
      `<stop offset="0.42" stop-color="#fff" stop-opacity="0.07"/>` +
      `<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="${u}dim" x1="0.28" y1="0.12" x2="0.92" y2="1">` +
      `<stop offset="0" stop-color="${PEN}" stop-opacity="0"/>` +
      `<stop offset="0.55" stop-color="${PEN}" stop-opacity="0.07"/>` +
      `<stop offset="1" stop-color="${PEN}" stop-opacity="0.34"/></linearGradient>` +
    // Nacre: the pearl's whole surface, not a shape sitting on it. Every attempt to give the
    // pearl a coloured AREA inside an ivory body failed the same way, whether the area had a
    // hard edge or a soft one — a shape inside a bead reads as something printed on the bead.
    // So the pearl is now covered in album colour like every other finish, and what marks it
    // out is TEXTURE, the way matte's is. Mother-of-pearl's texture is banding: bands of
    // lustre sweeping the surface at an angle, catching the light unevenly. One diagonal
    // gradient of alternating white gives all of it, at any colour, with no geometry of its
    // own to go stale at strand size.
    // The bands alternate LIGHT AND DARK, not light and nothing. All-white banding averages
    // to a veil: it drains the album colour until a pearl sits as pale as the frosted miss
    // two beads along, which is the one thing this finish must never do. Alternating keeps
    // the mean where the album colour is and spends the contrast on the layering instead.
    `<linearGradient id="${u}nacre" x1="0.02" y1="0.06" x2="0.98" y2="0.98">` +
      `<stop offset="0" stop-color="#fff" stop-opacity="0.46"/>` +
      `<stop offset="0.1" stop-color="${PEN}" stop-opacity="0.12"/>` +
      `<stop offset="0.2" stop-color="#fff" stop-opacity="0.34"/>` +
      `<stop offset="0.3" stop-color="${PEN}" stop-opacity="0.14"/>` +
      `<stop offset="0.41" stop-color="#fff" stop-opacity="0.30"/>` +
      `<stop offset="0.52" stop-color="${PEN}" stop-opacity="0.16"/>` +
      `<stop offset="0.63" stop-color="#fff" stop-opacity="0.30"/>` +
      `<stop offset="0.74" stop-color="${PEN}" stop-opacity="0.13"/>` +
      `<stop offset="0.85" stop-color="#fff" stop-opacity="0.34"/>` +
      `<stop offset="0.94" stop-color="${PEN}" stop-opacity="0.10"/>` +
      `<stop offset="1" stop-color="#fff" stop-opacity="0.42"/></linearGradient>` +
    // The cross-band, at the opposite angle and much weaker. Nacre is not corduroy: one set of
    // parallel stripes reads as a machined ridge, and the interference between two sets at
    // different angles is what makes the surface look layered rather than combed.
    `<linearGradient id="${u}nacre2" x1="0.96" y1="0.1" x2="0.1" y2="0.9">` +
      `<stop offset="0" stop-color="#fff" stop-opacity="0.20"/>` +
      `<stop offset="0.4" stop-color="#fff" stop-opacity="0"/>` +
      `<stop offset="0.72" stop-color="#fff" stop-opacity="0.17"/>` +
      `<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
}

// ---- One pony bead ----
// A 9x6mm barrel reads TALLER THAN IT IS WIDE on a cord — a short fat cylinder, not a
// lozenge lying down. `finish` is the strand's second channel, on top of album colour:
//   gloss  a page you named        matte    a page where a hint was taken (sanded, so it
//   pearl  a line written from     |        still reads on the albums that are already grey)
//   |      memory, word-perfect    clear    a page you missed
//                                  shielded a miss an Insurance shield took for you
function ponyBead(x, y, fill, sc, rot, finish, u, idx) {
  const w = 24 * sc, h = 28 * sc, rx = 7.6 * sc;
  const box = `x="${n(x - w / 2)}" y="${n(y - h / 2)}" width="${n(w)}" height="${n(h)}" rx="${n(rx)}"`;
  const lit = `<rect ${box} fill="url(#${u}lit)"/>`;
  const dim = `<rect ${box} fill="url(#${u}dim)"/>`;
  // light coming back up through the bottom of the plastic off the paper
  const bounce = `<path d="M${n(x - w * 0.30)},${n(y + h * 0.36)} q${n(w * 0.30)},${n(h * 0.14)} ${n(w * 0.60)},0" ` +
    `fill="none" stroke="#fff" stroke-width="${n(2.6 * sc)}" stroke-linecap="round" opacity="0.34"/>`;
  const spec = `<rect x="${n(x - w * 0.33)}" y="${n(y - h * 0.34)}" width="${n(w * 0.30)}" height="${n(h * 0.24)}" ` +
      `rx="${n(3.4 * sc)}" fill="#fff" opacity="0.30"/>` +
    `<circle cx="${n(x - w * 0.25)}" cy="${n(y - h * 0.27)}" r="${n(1.7 * sc)}" fill="#fff" opacity="0.82"/>`;
  const bore = `<ellipse cx="${n(x - w / 2 + 2.2 * sc)}" cy="${n(y)}" rx="${n(2.1 * sc)}" ry="${n(h * 0.19)}" fill="${PEN}" opacity="0.30"/>` +
    `<ellipse cx="${n(x + w / 2 - 2.2 * sc)}" cy="${n(y)}" rx="${n(2.1 * sc)}" ry="${n(h * 0.19)}" fill="${PEN}" opacity="0.22"/>`;
  // packed beads shade each other along the touching edge; without it a row of barrels
  // reads as one flat printed strip rather than as separate objects
  const contact = `<rect x="${n(x - w / 2)}" y="${n(y - h / 2)}" width="${n(w * 0.26)}" height="${n(h)}" ` +
    `rx="${n(rx * 0.9)}" fill="${PEN}" opacity="0.10"/>`;

  let body;
  if (finish === "sealed") {
    // A hidden Daily result is not merely covered with CSS. The real finishes
    // never enter the DOM until reveal, so the strand cannot leak through an
    // export, accessibility text, dev inspection, or a failed overlay.
    body = `<rect ${box} fill="var(--paper-edge)" stroke="var(--ink-soft)" stroke-width="${n(1.15 * sc)}" opacity="0.92"/>` +
      `<path d="M${n(x - w * 0.34)},${n(y - h * 0.22)} L${n(x + w * 0.34)},${n(y + h * 0.22)} ` +
        `M${n(x - w * 0.34)},${n(y + h * 0.22)} L${n(x + w * 0.34)},${n(y - h * 0.22)}" ` +
        `fill="none" stroke="var(--ink-soft)" stroke-width="${n(0.8 * sc)}" opacity="0.22"/>` + lit;
  } else if (finish === "clear") {
    // The tint is the album of the song the player actually NAMED on this page, which the run
    // records even for a wrong answer. It is deliberately faint and must stay that way: the
    // strand's colour language is that colour means a page you landed, and a miss carrying its
    // album at any real strength makes a bad run read as a full bracelet at a glance, on the
    // keepsake card most of all. 0.13 was too faint to see at all, which is the bead lying by
    // omission about something it is already holding; at 0.22 you can pick the album out of a
    // bead you are looking at, while the strand still reads plainly frosted from across the
    // page. Not every miss has one — a timeout names no song — so this can only ever be a
    // detail found on a single bead, never a signal read along the strand.
    body = `<rect ${box} fill="#fff" fill-opacity="0.34" stroke="${PEN}" stroke-opacity="0.55" stroke-width="${n(1.25 * sc)}"/>` +
      `<rect ${box} fill="${fill}" fill-opacity="0.22"/>` +
      `<rect x="${n(x - w / 2 + 3 * sc)}" y="${n(y - h / 2 + 3 * sc)}" width="${n(w - 6 * sc)}" height="${n(h - 6 * sc)}" ` +
        `rx="${n(rx * 0.6)}" fill="none" stroke="#fff" stroke-width="${n(1.6 * sc)}" opacity="0.7"/>` + lit + spec;
  } else if (finish === "shielded") {
    // The frosted miss, patched. Insurance's whole decision is whether to spend a shield, and
    // a rescued page used to string the same bead a plain miss gets — so the strand said
    // nothing about the only choice the challenge asks for. It is built ON the frosted body
    // rather than beside it, because it IS a miss and must never read along the strand as a
    // page landed: the album tint stays at the frosted 0.22 and the colour language holds.
    // What is added is a repair. A red-inked patch stitched across the bead, corner to corner,
    // with the stitches drawn rather than dashed so it reads as something done by hand to a
    // bead that had already gone wrong — the same margin red the shield button is inked in,
    // which is what ties the mark back to the thing that was spent for it.
    const px = x - w * 0.30, py = y - h * 0.20, pw = w * 0.60, ph = h * 0.40;
    const stitch = [0.18, 0.5, 0.82].map((t) =>
      `<path d="M${n(px + pw * t)},${n(py - 1.4 * sc)} L${n(px + pw * t)},${n(py + ph + 1.4 * sc)}" ` +
        `stroke="${MEND}" stroke-width="${n(1.0 * sc)}" stroke-linecap="round" opacity="0.72" ` +
        `stroke-dasharray="${n(2.1 * sc)} ${n(2.4 * sc)}"/>`).join("");
    body = `<rect ${box} fill="#fff" fill-opacity="0.34" stroke="${PEN}" stroke-opacity="0.55" stroke-width="${n(1.25 * sc)}"/>` +
      `<rect ${box} fill="${fill}" fill-opacity="0.22"/>` +
      `<rect x="${n(px)}" y="${n(py)}" width="${n(pw)}" height="${n(ph)}" rx="${n(2.2 * sc)}" ` +
        `fill="${MEND}" fill-opacity="0.18" stroke="${MEND}" stroke-width="${n(1.25 * sc)}" ` +
        `stroke-opacity="0.85" transform="rotate(-7 ${n(x)} ${n(y)})"/>` +
      `<g transform="rotate(-7 ${n(x)} ${n(y)})">${stitch}</g>` + lit;
  } else if (finish === "matte") {
    // Sanded, not merely flat. Three albums are already grey or near-grey, so a matte bead
    // that differed from a gloss one by hue alone would be invisible on exactly the pages
    // where it matters most. The texture is what carries it, at any colour.
    body = `<rect ${box} fill="${fill}" stroke="var(--ink)" stroke-width="${n(1.3 * sc)}"/>` +
      `<rect ${box} fill="#fff" opacity="0.13"/>` +
      `<rect x="${n(x - w * 0.32)}" y="${n(y - h * 0.34)}" width="${n(w * 0.28)}" height="${n(h * 0.20)}" rx="${n(3 * sc)}" fill="#fff" opacity="0.15"/>`;
    for (let k = 0; k < 16; k++) {
      const gx = x + jitter(idx, k * 2 + 1, w * 0.74), gy = y + jitter(idx, k * 2 + 2, h * 0.72);
      body += `<circle cx="${n(gx)}" cy="${n(gy)}" r="${n((0.55 + Math.abs(jitter(idx, k + 40, 0.9))) * sc)}" ` +
        `fill="${k % 2 ? "#fff" : PEN}" opacity="0.18"/>`;
    }
  } else if (finish === "pearl") {
    // Album colour edge to edge, then the lustre laid over the whole of it. The bead still has
    // to stay clearly the BEST bead on the strand rather than the palest, so the two things
    // holding it apart from its neighbours are both surface: it is lustrous where a gloss bead
    // is merely lit, and it is layered where a matte bead is dusty. Nothing bounds the lustre.
    // An inset rim was tried to keep the bands from running off the edges and it put a visible
    // frame around them, which is the sticker read arriving by another door.
    body = `<rect ${box} fill="${fill}" stroke="${PEN}" stroke-width="${n(1.3 * sc)}"/>` +
      `<rect ${box} fill="url(#${u}nacre)"/>` +
      `<rect ${box} fill="url(#${u}nacre2)"/>` +
      `<path d="M${n(x - w * 0.30)},${n(y - h * 0.30)} q${n(w * 0.30)},${n(-h * 0.06)} ${n(w * 0.58)},${n(h * 0.04)}" ` +
        `fill="none" stroke="#fff" stroke-width="${n(3.4 * sc)}" stroke-linecap="round" opacity="0.9"/>` +
      `<circle cx="${n(x - w * 0.25)}" cy="${n(y - h * 0.30)}" r="${n(1.7 * sc)}" fill="#fff" opacity="0.95"/>`;
  } else {
    body = `<rect ${box} fill="${fill}" stroke="var(--ink)" stroke-width="${n(1.3 * sc)}"/>` + lit + dim + bounce + spec;
  }
  return `<g transform="rotate(${n(rot)} ${n(x)} ${n(y)})">${body}${contact}${bore}</g>`;
}

// A flat pearl disc: the spacer that stops thirteen barrels reading as one long tube.
function heishi(x, y, sc, rot) {
  const w = 4.6 * sc, h = 16 * sc;
  return `<g transform="rotate(${n(rot)} ${n(x)} ${n(y)})">` +
    `<rect x="${n(x - w / 2)}" y="${n(y - h / 2)}" width="${n(w)}" height="${n(h)}" rx="${n(1.8 * sc)}" fill="${DISC}" stroke="${PEN}" stroke-width="${n(sc)}"/>` +
    `<path d="M${n(x - w * 0.18)},${n(y - h * 0.28)} L${n(x - w * 0.18)},${n(y + h * 0.24)}" stroke="#fff" stroke-width="${n(1.1 * sc)}" opacity="0.75" stroke-linecap="round"/></g>`;
}

// An alphabet cube: square, white, letter cut in typewriter caps.
function alphaCube(x, y, ch, sc, rot) {
  const s = 25 * sc;
  return `<g transform="rotate(${n(rot)} ${n(x)} ${n(y)})">` +
    `<rect x="${n(x - s / 2)}" y="${n(y - s / 2)}" width="${n(s)}" height="${n(s)}" rx="${n(4.4 * sc)}" fill="${CUBE}" stroke="${PEN}" stroke-width="${n(1.3 * sc)}"/>` +
    `<rect x="${n(x - s * 0.30)}" y="${n(y - s * 0.36)}" width="${n(s * 0.44)}" height="${n(s * 0.15)}" rx="${n(2 * sc)}" fill="#fff" opacity="0.95"/>` +
    `<text x="${n(x)}" y="${n(y + s * 0.21)}" text-anchor="middle" font-size="${n(s * 0.62)}" fill="${PEN}" class="b-cube-text">${ch}</text>` +
    `<ellipse cx="${n(x - s / 2 + 2.2 * sc)}" cy="${n(y)}" rx="${n(2 * sc)}" ry="${n(s * 0.16)}" fill="${PEN}" opacity="0.22"/></g>`;
}

// The elastic itself. One path drawn five times: a soft dark rim sunk under the cord, the
// waxed body, a lifted mid tone and a narrow specular along the top, then the faint banding
// of the twist crossing all of it. Five cheap strokes are the difference between a strung
// cord and a flat grey noodle, and every strand and knot tail on the page goes through here.
function cordStack(d, w = 3.6) {
  const up = (v) => ` transform="translate(0 ${n(-v)})"`;
  return `<path class="b-cord-under" d="${d}" stroke-width="${n(w + 1.1)}" transform="translate(0 ${n(w * 0.16)})"/>` +
    `<path class="b-cord" d="${d}" stroke-width="${n(w)}"/>` +
    `<path class="b-cord-mid" d="${d}" stroke-width="${n(w * 0.6)}"${up(w * 0.17)}/>` +
    `<path class="b-cord-hi" d="${d}" stroke-width="${n(Math.max(0.7, w * 0.24))}"${up(w * 0.31)}/>` +
    `<path class="b-cord-twist" d="${d}" stroke-width="${n(w * 0.94)}" ` +
      `stroke-dasharray="${n(w * 0.42)} ${n(w * 0.66)}"/>`;
}

// The knot the strand is tied off with, plus the tail nobody trimmed. `dir` is which way
// the tail falls away from the beads. Two crossed lobes rather than one ellipse: an overhand
// knot is a bundle of cord passing over itself, and a single flat oval reads as one more
// bead. The back lobe is darkened because it is the pass underneath.
function tieKnot(x, y, dir) {
  const tail = `M${n(x + dir * 3)},${n(y + 2)} c${dir * 6},7 ${dir * 12},8 ${dir * 18},7`;
  const lobe = (rot, fill, stroke) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="5.4" ry="3.1" fill="${fill}"` +
    (stroke ? ` stroke="${stroke}" stroke-width="0.9"` : "") +
    ` transform="rotate(${rot} ${n(x)} ${n(y)})"/>`;
  return cordStack(tail, 2.6) +
    `<g transform="rotate(${dir * 9} ${n(x)} ${n(y)})">` +
      lobe(-31, "#a8905f", "") +
      lobe(27, CORD, CORD_DK) +
      `<g transform="rotate(27 ${n(x)} ${n(y)})">` +
        `<path d="M${n(x - 3.4)},${n(y - 1.1)} c1.6,-1.5 4,-1.7 5.6,-0.8" fill="none" ` +
          `stroke="${CORD_LT}" stroke-width="1.1" opacity="0.7" stroke-linecap="round"/>` +
        `<path d="M${n(x - 3.6)},${n(y + 1.5)} c1.8,1.1 4.2,1 5.8,0.1" fill="none" ` +
          `stroke="${CORD_DK}" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/>` +
      `</g>` +
    `</g>`;
}

// The beading needle a strand is still on mid-run, at `ang` degrees off flat with its eye
// where the elastic runs out. Steel tapered to a point, with a real slotted eye the cord
// passes through: the old two-line sketch read as a stray pencil mark lying on the desk.
function beadingNeedle(x, y, ang) {
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(ang)})">` +
    `<path d="M2,-2 L10,-1.55 L30,-1.15 L45,0 L30,1.15 L10,1.55 L2,2 A2.15 2.15 0 0 1 2,-2 Z" ` +
      `fill="#9aa3aa" stroke="#4d565e" stroke-width="0.5" stroke-linejoin="round"/>` +
    `<path d="M4.4,-1.2 L30,-0.62 L42,-0.12" fill="none" stroke="#f2f6f8" stroke-width="0.75" ` +
      `opacity="0.9" stroke-linecap="round"/>` +
    `<path d="M6,1.18 L30,0.74" fill="none" stroke="#4d565e" stroke-width="0.6" opacity="0.45" stroke-linecap="round"/>` +
    `<path d="M17,-0.92 L24,-0.5" fill="none" stroke="#ffffff" stroke-width="1.05" opacity="0.85" stroke-linecap="round"/>` +
    `<rect x="3.1" y="-0.9" width="5.6" height="1.8" rx="0.9" fill="var(--paper)" stroke="#5c666e" stroke-width="0.45"/>` +
    `<path class="b-cord" d="M3.3,0.2 L8.4,-0.1" stroke-width="1.4"/>` +
    `<path class="b-cord-hi" d="M3.6,-0.3 L8.1,-0.55" stroke-width="0.5"/>` +
  `</g>`;
}

function buildSingleRowBraceletSVG(results, activeRound, freshIndex, albums, opts) {
  const total = (opts && opts.total) || TOTAL_ROUNDS;
  // `tieText` is the explicit contract. `letterBead` remains only as a compatibility fallback
  // for an older caller or saved fixture that has not moved to a numbered tie yet.
  const letterBead = !opts || opts.letterBead !== false;
  // Album→colour map; callers pass the active palette (colour-blind variant when
  // that setting is on), defaulting to the standard album colours.
  const colors = (opts && opts.colors) || ALBUM_COLORS;
  // Per-bead colour overrides, for the rules where the page has no album to be coloured by
  // (see beadTints in app.js). A literal colour, never a token: the keepsake PNG rasterises
  // this markup outside the page's own CSS, so a var() here would export as black.
  const tints = (opts && opts.beadTints) || [];
  // per-round flags: was a hint taken that round? the bead is strung sanded rather than glossy.
  const hinted = (opts && opts.hinted) || [];
  // per-round verse tier ("perfect"/"verse"): both hang the reserved pen-nib trinket, and a
  // word-perfect one is additionally strung as a pearl — the two tiers used to look identical.
  const verseTiers = (opts && opts.verseTiers) || [];
  // per-round flag (Impostor challenge): this bead flagged a fake, so it dangles a devil.
  const impostorCaught = (opts && opts.impostorCaught) || [];
  // per-round flag (the risk challenges): this bead was won at stake, so it dangles a
  // horseshoe. The strand stays one bead per page whatever a bet paid — the trinket is how
  // a high-stakes page shows what it was worth.
  const riskWon = (opts && opts.riskWon) || [];
  // per-round flag (Insurance): the uninsured miss that ended the run — this page's bead is
  // a skull rather than a frosted spacer. At most one page a run ever carries it.
  const skullMiss = (opts && opts.skullMiss) || [];
  // Insurance: the pages a shield took the miss for (see braceletFinish "shielded").
  const shieldSaved = (opts && opts.shieldSaved) || [];
  // per-round flag (Ruthless): this page was named inside its lens's snap window, so it dangles
  // a stopwatch.
  const snapPage = (opts && opts.snapPage) || [];
  // compact: the in-run strip, where gameplay has to stay visually dominant. Same beads,
  // charms tucked up close, no tie beads yet.
  const compact = !!(opts && opts.compact);
  // opts.trinket: the Mastery-chosen dangling trinket id (see TRINKETS); default "star". The
  // special value "random" gives every bead its own trinket instead of the whole strand
  // wearing one, shuffled per run by opts.trinketSeed. Either way this only supplies a bead's
  // DEFAULT trinket: the earned overrides below (nib, devil, horseshoe, stopwatch) still win.
  const wantRandom = !!(opts && opts.trinket === "random");
  const trinketSeed = (opts && opts.trinketSeed) || 0;
  const pickedTrinket = (opts && opts.trinket && TRINKETS[opts.trinket]) ? opts.trinket : "star";
  const defaultTrinket = wantRandom ? (i) => randomTrinketForBead(trinketSeed, i) : () => pickedTrinket;

  const u = "br" + (++BR_UID);
  const W = 520, X0 = 46, XEND = 494;
  const BH = compact ? 88 : 132;
  const yMid = compact ? 38 : 44;
  // This path only draws thirteen pages or fewer. The scale still lets a non-standard short
  // run leave enough room for its tie without changing the familiar thirteen-page strand.
  const sc = Math.max(0.28, Math.min(1, 386 / (total * 29)));
  const PITCH = 29 * sc;
  const yAt = (x) => yMid + 5 * Math.sin(Math.PI * ((x - 14) / (XEND - 14)));
  const slotX = (i) => X0 + PITCH * i;

  const live = activeRound > 0;
  // how far the strung part reaches, so the bare elastic can start there
  const filled = results.reduce((m, v, i) => (v == null ? m : i + 1), 0);
  const lastX = slotX(Math.max(1, filled, live ? activeRound : 0) - 1);
  const tie = live ? null
    : (opts && opts.tie) || (opts && opts.tieText != null
      ? String(opts.tieText).split("")
      : (letterBead ? ["1", "3"] : String(total).split("")));

  // ---- the elastic ----
  // On a live run the bare end lies in a loose curl rather than running dead straight off the
  // edge: elastic just cut off the reel does not lie flat, and the curl is what stops an
  // unfinished bracelet reading as an empty progress track. The curl is a fixed hand's length,
  // never stretched to fill the strip, and shortens rather than backing up under the beads
  // once the strand has nearly filled the page.
  const curlAt = Math.min(XEND - 44, lastX + PITCH * 0.95);
  const curlW = Math.min(128, XEND - 8 - curlAt);
  let tieX = 0, knotX = 0;
  if (tie) {
    tieX = lastX + PITCH * 0.9;
    knotX = tieX + (tie.length - 1) * 27 * sc + 30;
  }
  const elEnd = live ? curlAt : knotX + 4;
  let el = "";
  for (let k = 0; k <= 50; k++) {
    const x = 14 + ((elEnd - 14) * k) / 50;
    el += (k ? "L" : "M") + n(x) + "," + n(yAt(x));
  }
  let tipX = curlAt + curlW, tipY = yAt(curlAt) + 3;
  if (live) {
    const y = yAt(curlAt), r = curlW;
    el += ` C${n(curlAt + r * 0.26)},${n(y - 7)} ${n(curlAt + r * 0.40)},${n(y + 13)} ${n(curlAt + r * 0.56)},${n(y + 14)}` +
      ` C${n(curlAt + r * 0.73)},${n(y + 15)} ${n(curlAt + r * 0.81)},${n(y + 1)} ${n(curlAt + r * 0.66)},${n(y - 3)}` +
      ` C${n(curlAt + r * 0.53)},${n(y - 7)} ${n(curlAt + r * 0.49)},${n(y + 8)} ${n(curlAt + r * 0.64)},${n(y + 12)}` +
      ` C${n(curlAt + r * 0.82)},${n(y + 17)} ${n(curlAt + r * 0.95)},${n(y + 9)} ${n(curlAt + r)},${n(y + 3)}`;
    tipY = y + 3;
  }
  let svg = cordStack(el, 3.6);

  // the knot the whole thing is strung off
  svg += tieKnot(X0 - 22, yAt(X0 - 22), -1);

  // ---- the beads ----
  for (let i = 0; i < total; i++) {
    const x = slotX(i), y = yAt(x);
    const answered = results[i];
    const albumCol = tints[i] || ((albums && albums[i]) ? (colors[albums[i]] || null) : null);
    const fill = albumCol || "var(--bead)";
    // The trinket takes its tint from an inherited --bead, so the override may only be written
    // when there IS an album colour: `--bead:var(--bead)` is a self-reference, which makes the
    // whole property guaranteed-invalid and drops the trinket to black. A bead without an album
    // (an unplayed slot, a page whose song was never picked) must simply inherit the era's.
    const tint = albumCol ? ` style="--bead:${albumCol}"` : "";
    const rot = jitter(i, 1, 9);
    // the spacer disc that sits in the gap before this bead
    const gx = x - PITCH * 0.5;
    if (i && (answered != null || i + 1 === activeRound)) svg += heishi(gx, yAt(gx), sc, jitter(i, 2, 10));

    if (answered === true) {
      const tier = verseTiers[i];
      const finish = tier === "perfect" ? "pearl" : hinted[i] ? "matte" : "gloss";
      svg += ponyBead(x, y, fill, sc, rot, finish, u, i);
      const fresh = i === freshIndex;
      const delay = fresh ? "" : ` style="animation-delay:${(-(i * 0.9) % 5.5).toFixed(2)}s"`;
      // Verse rounds always hang the reserved pen-nib; otherwise the player's chosen trinket
      // (default star), drawn by the shared TRINKETS renderer.
      const isNib = tier === "perfect" || tier === "verse";
      const id = impostorCaught[i] ? "devil" : riskWon[i] ? "horseshoe"
        : snapPage[i] ? "stopwatch" : (isNib ? "nib" : defaultTrinket(i));
      const drop = (compact ? 18 : 32) * Math.max(sc, 0.55) + (i % 2 ? 8 * sc : 0);
      const cr = Math.max(4.4, (compact ? 7 : 10.2) * Math.max(sc, 0.62));
      const csw = Math.max(0.7, cr * 0.15).toFixed(2);
      const hy = y + 14 * sc;
      svg += `<g class="trinket-dangle${fresh ? " fresh" : ""}"${delay}>` +
        `<circle cx="${n(x)}" cy="${n(hy + 3.2)}" r="${n(2.5 * Math.max(sc, 0.7))}" fill="none" stroke="var(--ink)" stroke-width="1.1" opacity="0.75"/>` +
        `<path d="M${n(x)},${n(hy + 3.2)} L${n(x)},${n(hy + drop - cr)}" stroke="var(--ink)" stroke-width="0.9" opacity="0.45"/>` +
        `<g${tint}>${TRINKETS[id](x, hy + drop, cr, csw)}</g></g>`;
    } else if (answered === false && skullMiss[i]) {
      // the page the run died on: a bone bead in place of the frosted one. Sized and nudged
      // to fill a bead's slot — skullBead hangs its jaw below the centre it is given, so a
      // skull placed on the bead's own centre floats high and reads as a charm, not a bead.
      svg += `<g class="b-skull-bead">${skullBead(x, y - 1.8 * sc, 13.4 * sc, 1)}</g>`;
    } else if (answered === false) {
      svg += ponyBead(x, y, fill, sc, rot, shieldSaved[i] ? "shielded" : "clear", u, i);
    } else if (i + 1 === activeRound) {
      svg += `<rect class="b-halo" x="${n(x - 19 * sc)}" y="${n(y - 21 * sc)}" width="${n(38 * sc)}" height="${n(42 * sc)}" ` +
        `rx="${n(13 * sc)}" stroke-width="2"/>` +
        ponyBead(x, y, "var(--bead)", sc * 1.06, rot, "gloss", u, i);
    }
  }

  // ---- the tie beads ----
  // They only exist once the run is over: the bracelet is unfinished until the run is.
  if (tie) {
    const sx = tieX - PITCH * 0.42;
    svg += heishi(sx, yAt(sx), sc, 5);
    tie.forEach((ch, k) => {
      const x = tieX + k * 27 * sc;
      svg += alphaCube(x, yAt(x), ch, sc, k % 2 ? 5.5 : -6);
    });
    const ex = tieX + (tie.length - 1) * 27 * sc + 17 * sc;
    svg += heishi(ex, yAt(ex), sc, -4) + tieKnot(knotX, yAt(knotX), 1);
  } else {
    // still on the needle: the beading needle, threaded, waiting for the next page
    svg += beadingNeedle(tipX - 2, tipY + 0.5, -12);
  }

  return `<svg viewBox="0 0 ${W} ${BH}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
    `<defs>${beadDefs(u)}<filter id="${u}drop" x="-10%" y="-30%" width="120%" height="185%">` +
    `<feDropShadow dx="1.4" dy="3.4" stdDeviation="2.2" flood-color="${PEN}" flood-opacity="0.28"/></filter></defs>` +
    `<g filter="url(#${u}drop)"><g class="b-strand">${svg}</g></g></svg>`;
}

// Long and sealed strands use the readable geometry model above. The ordinary
// 13-page strand keeps its established drawing untouched; this path only takes
// over when the old single row would have to shrink or expose a sealed Daily.
function buildCoiledBraceletSVG(results, activeRound, freshIndex, albums, opts = {}) {
  const total = Math.max(1, Math.floor(Number(opts.total) || TOTAL_ROUNDS));
  const colors = opts.colors || ALBUM_COLORS;
  const tints = opts.beadTints || [];   // see the note on the single-row builder above
  const compact = !!opts.compact;
  const sealed = !!opts.sealed;
  const live = activeRound > 0;
  const filled = sealed ? total : results.reduce((m, v, i) => (v == null ? m : i + 1), 0);
  const layout = braceletLayout(total, activeRound, filled, compact);
  const u = "br" + (++BR_UID);
  const XEND = 494;
  const yAt = (x, row) => row.y + 5 * Math.sin(Math.PI * ((x - 14) / (XEND - 14)));
  const slotAt = (index) => layout.slots.find((s) => s.index === index) || layout.slots[layout.slots.length - 1];
  const lastSlot = slotAt(live ? Math.max(0, activeRound - 1) : Math.max(0, filled - 1));
  const lastRow = layout.rows[lastSlot.row];

  const tie = live ? null : (Array.isArray(opts.tie)
    ? opts.tie.map(String)
    : String(opts.tieText != null ? opts.tieText
      : opts.letterBead === false ? total : TOTAL_ROUNDS).split(""));
  const tieSc = tie ? Math.max(0.58, Math.min(1, 2.6 / Math.max(1, tie.length))) : 1;
  const tiePitch = 27 * tieSc;
  const tieX = tie ? lastSlot.x + layout.pitch * 0.9 : 0;
  const knotX = tie ? tieX + (tie.length - 1) * tiePitch + 30 * tieSc : 0;

  let prefix = "";
  if (layout.omitted > 0) {
    const pages = `${layout.omitted} earlier page${layout.omitted === 1 ? "" : "s"}`;
    prefix = `<g class="b-prefix-mark">` +
      cordStack("M18 14 C25 5 38 5 43 13 C48 21 36 24 29 18 C23 13 31 8 37 12", 2.5) +
      `<text x="52" y="18" class="b-prefix">${pages} already strung</text></g>`;
  }

  let cord = "";
  let tipX = 0, tipY = 0;
  const firstRow = layout.rows[0];
  const startKnotX = firstRow.startX - firstRow.dir * 22;
  const startKnotY = yAt(startKnotX, firstRow);

  if (live) {
    const curlAt = Math.min(XEND - 44, lastSlot.x + layout.pitch * 0.95);
    const curlW = Math.max(0, Math.min(128, XEND - 8 - curlAt));
    cord = `M${n(startKnotX)},${n(startKnotY)}`;
    for (let k = 1; k <= 40; k++) {
      const x = startKnotX + ((curlAt - startKnotX) * k) / 40;
      cord += `L${n(x)},${n(yAt(x, firstRow))}`;
    }
    const y = yAt(curlAt, firstRow), r = curlW;
    cord += ` C${n(curlAt + r * 0.26)},${n(y - 7)} ${n(curlAt + r * 0.40)},${n(y + 13)} ${n(curlAt + r * 0.56)},${n(y + 14)}` +
      ` C${n(curlAt + r * 0.73)},${n(y + 15)} ${n(curlAt + r * 0.81)},${n(y + 1)} ${n(curlAt + r * 0.66)},${n(y - 3)}` +
      ` C${n(curlAt + r * 0.53)},${n(y - 7)} ${n(curlAt + r * 0.49)},${n(y + 8)} ${n(curlAt + r * 0.64)},${n(y + 12)}` +
      ` C${n(curlAt + r * 0.82)},${n(y + 17)} ${n(curlAt + r * 0.95)},${n(y + 9)} ${n(curlAt + r)},${n(y + 3)}`;
    tipX = curlAt + curlW;
    tipY = y + 3;
  } else {
    cord = `M${n(startKnotX)},${n(startKnotY)}`;
    layout.rows.forEach((row, r) => {
      const fromX = row.startX - row.dir * 22;
      const final = r === layout.rows.length - 1;
      const toX = final ? knotX + 4 : row.endX + row.dir * 22;
      for (let k = 1; k <= 28; k++) {
        const x = fromX + ((toX - fromX) * k) / 28;
        cord += `L${n(x)},${n(yAt(x, row))}`;
      }
      if (!final) {
        const next = layout.rows[r + 1];
        const nextX = next.startX - next.dir * 22;
        const y1 = yAt(toX, row), y2 = yAt(nextX, next);
        cord += `C${n(toX + row.dir * 18)},${n(y1 + 30)} ` +
          `${n(nextX + row.dir * 18)},${n(y2 - 30)} ${n(nextX)},${n(y2)}`;
      }
    });
  }

  let svg = cordStack(cord, 3.6) +
    tieKnot(startKnotX, startKnotY, -firstRow.dir);

  for (const slot of layout.slots) {
    const i = slot.index, x = slot.x, row = layout.rows[slot.row], y = yAt(x, row);
    const answered = sealed ? "sealed" : results[i];
    const albumCol = sealed ? null
      : (tints[i] || (albums && albums[i] ? (colors[albums[i]] || null) : null));
    const fill = sealed ? "var(--paper-edge)" : (albumCol || "var(--bead)");
    const tint = albumCol ? ` style="--bead:${albumCol}"` : "";
    const rot = jitter(i, 1, 9);
    const gx = x - slot.dir * layout.pitch * 0.5;
    if (slot.col > 0 && (sealed || answered != null || i + 1 === activeRound)) {
      svg += heishi(gx, yAt(gx, row), 1, jitter(i, 2, 10));
    }

    const finish = braceletFinish(answered, i, opts);
    if (finish === "sealed") {
      svg += ponyBead(x, y, fill, 1, rot, finish, u, i);
    } else if (answered === true) {
      svg += ponyBead(x, y, fill, 1, rot, finish, u, i);
      const fresh = i === freshIndex;
      const delay = fresh ? "" : ` style="animation-delay:${(-(i * 0.9) % 5.5).toFixed(2)}s"`;
      const id = braceletTrinketId(i, opts);
      const drop = (compact ? 18 : 32) + (i % 2 ? 8 : 0);
      const cr = compact ? 7 : 10.2;
      const csw = Math.max(0.7, cr * 0.15).toFixed(2);
      const hy = y + 14;
      svg += `<g class="trinket-dangle${fresh ? " fresh" : ""}"${delay}>` +
        `<circle cx="${n(x)}" cy="${n(hy + 3.2)}" r="2.5" fill="none" stroke="var(--ink)" stroke-width="1.1" opacity="0.75"/>` +
        `<path d="M${n(x)},${n(hy + 3.2)} L${n(x)},${n(hy + drop - cr)}" stroke="var(--ink)" stroke-width="0.9" opacity="0.45"/>` +
        `<g${tint}>${TRINKETS[id](x, hy + drop, cr, csw)}</g></g>`;
    } else if (finish === "skull") {
      svg += `<g class="b-skull-bead">${skullBead(x, y - 1.8, 13.4, 1)}</g>`;
    } else if (finish === "clear" || finish === "shielded") {
      svg += ponyBead(x, y, fill, 1, rot, finish, u, i);
    } else if (i + 1 === activeRound) {
      svg += `<rect class="b-halo" x="${n(x - 19)}" y="${n(y - 21)}" width="38" height="42" ` +
        `rx="13" stroke-width="2"/>` + ponyBead(x, y, "var(--bead)", 1.06, rot, "gloss", u, i);
    }
  }

  if (tie) {
    const sx = tieX - layout.pitch * 0.42;
    svg += heishi(sx, yAt(sx, lastRow), 1, 5);
    tie.forEach((ch, k) => {
      const x = tieX + k * tiePitch;
      svg += alphaCube(x, yAt(x, lastRow), ch, tieSc, k % 2 ? 5.5 : -6);
    });
    const ex = tieX + (tie.length - 1) * tiePitch + 17 * tieSc;
    svg += heishi(ex, yAt(ex, lastRow), tieSc, -4) + tieKnot(knotX, yAt(knotX, lastRow), 1);
  } else {
    svg += beadingNeedle(tipX - 2, tipY + 0.5, -12);
  }

  return `<svg viewBox="0 0 ${layout.width} ${layout.height}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" ` +
    `data-bracelet-layout="${layout.rows.length > 1 ? "coil" : "section"}" data-bracelet-total="${total}" ` +
    `data-visible-start="${layout.visibleStart}" data-visible-count="${layout.visibleCount}">` +
    `<defs>${beadDefs(u)}<filter id="${u}drop" x="-15%" y="-18%" width="130%" height="145%">` +
    `<feDropShadow dx="1.4" dy="3.4" stdDeviation="2.2" flood-color="${PEN}" flood-opacity="0.28"/></filter></defs>` +
    `<g filter="url(#${u}drop)">${prefix}<g class="b-strand">${svg}</g></g></svg>`;
}

// A finished strand is drawn from a fixed layout centre, but what lands on the paper is
// the cord between its two knots, and the tie beads that carry the page count hang off the
// right-hand knot. That leaves the drawing sitting left of the middle of its own box by
// however long the tie is (about nine pixels on a thirteen-page strand), which is enough to
// read as crooked under a tally that is centred to the pixel. So the strand is centred on
// what it actually drew rather than on the numbers it was drawn from. Measured rather than
// computed: a coiled strand's turn-arounds bulge past its knots by a curve's worth, and the
// bulge depends on the row count. The left-aligned "N earlier pages" note sits outside the
// measured group on purpose: it is a caption, not part of the strand.
// Only ever called on a FINISHED strand. A live one grows to the right from a fixed start
// and must stay anchored there, or the beads already strung would slide as pages are added.
export function centreStrand(host) {
  const g = host && host.querySelector("g.b-strand");
  const svg = g && g.ownerSVGElement;
  if (!g || !svg) return 0;
  g.removeAttribute("transform");
  let box;
  try { box = g.getBBox(); } catch { return 0; }          // not laid out (hidden screen)
  if (!box || !box.width) return 0;
  const dx = svg.viewBox.baseVal.width / 2 - (box.x + box.width / 2);
  if (Math.abs(dx) >= 0.25) g.setAttribute("transform", `translate(${dx.toFixed(2)} 0)`);
  return dx;
}

export function buildBraceletSVG(results, activeRound, freshIndex, albums, opts = {}) {
  const total = Math.max(1, Math.floor(Number(opts.total) || TOTAL_ROUNDS));
  if (!opts.sealed && total <= BRACELET_ROW_CAP) {
    return buildSingleRowBraceletSVG(results, activeRound, freshIndex, albums, { ...opts, total });
  }
  return buildCoiledBraceletSVG(results, activeRound, freshIndex, albums, { ...opts, total });
}
