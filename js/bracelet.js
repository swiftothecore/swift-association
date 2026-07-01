// The hand-strung friendship-bracelet keepsake, rendered as SVG.
// Pure: given the per-round results (and the picked albums), returns markup.
// Classic runs draw 13 beads with a white "13" letter bead; infinite runs pass
// { total: <rounds>, letterBead: false } so the strand grows and the beads
// shrink to fit (shrink-to-fit; no fixed cap).
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

// ---- Dangling charms (Mastery level-5 reward) ----
// Each draws a charm centred at (cx,cy) with "radius" r, in the bracelet's bead
// style (fill via .b-bead → var(--bead); the caller wraps the charm in a group
// carrying the album --bead tint). `sw` is the ink stroke width. "star" is the
// default keepsake; "nib" is reserved for word-perfect verse rounds; the rest are
// player-selectable via settings.masteryCharm.
function cFill(d, sw) { return `<path d="${d}" class="b-bead" stroke-width="${sw}" stroke-linejoin="round"/>`; }
function cEllipse(cx, cy, rx, ry, rot, sw) {
  return `<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(2)} ${cy.toFixed(2)})" class="b-bead" stroke-width="${sw}"/>`;
}
function cCircle(cx, cy, rr, sw) { return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${rr.toFixed(2)}" class="b-bead" stroke-width="${sw}"/>`; }
function cGloss(cx, cy, rr) { return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${rr.toFixed(2)}" class="b-gloss"/>`; }

export const CHARMS = {
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
  nib(cx, cy, r, sw) {
    const h = 1.108 * r, w = 0.649 * r;
    const d = `M${cx},${cy - h} L${cx + w},${cy - h * 0.15} L${cx},${cy + h} L${cx - w},${cy - h * 0.15} Z`;
    return cFill(d, sw) +
      `<circle cx="${cx}" cy="${(cy - h * 0.2).toFixed(2)}" r="${(0.176 * r).toFixed(2)}" class="b-nib-hole"/>` +
      `<path d="M${cx},${(cy - h * 0.05).toFixed(2)} L${cx},${(cy + h * 0.82).toFixed(2)}" class="b-nib-slit" stroke-width="1"/>`;
  },
};

// A standalone charm glyph for the Mastery picker (no bead or thread). `tint` sets
// the --bead fill; omit to inherit the current era tint.
export function charmPreviewSVG(id, tint) {
  const fn = CHARMS[id] || CHARMS.star;
  const r = 6.8, sw = Math.max(0.7, r * 0.15).toFixed(2);
  const style = tint ? ` style="--bead:${tint}"` : "";
  return `<svg viewBox="0 0 24 24" class="charm-preview" aria-hidden="true"><g${style} transform="translate(12 12.5)">${fn(0, 0, r, sw)}</g></svg>`;
}

export function buildBraceletSVG(results, activeRound, freshIndex, albums, opts) {
  const total = (opts && opts.total) || TOTAL_ROUNDS;
  const letterBead = !opts || opts.letterBead !== false;
  // Album→colour map; callers pass the active palette (colour-blind variant when
  // that setting is on), defaulting to the standard album colours.
  const colors = (opts && opts.colors) || ALBUM_COLORS;
  // per-round flags: was a hint taken that round? marks the charm with a small "H".
  const hinted = (opts && opts.hinted) || [];
  // per-round verse tier ("perfect"/"verse"): a word-perfect recall hangs a pen-nib
  // charm instead of the usual star — a keepsake of writing the line from memory.
  const verseTiers = (opts && opts.verseTiers) || [];
  // opts.charm: the Mastery-chosen dangling charm id (see CHARMS); default "star".
  const W = 520, H = 64, xL = 26, xR = W - 26;
  // the thread sags between its tied ends like a real bracelet laid on the page
  const yAt = (x) => 20 + 10 * Math.sin(Math.PI * ((x - xL) / (xR - xL)));
  const tx0 = xL - 16, tx1 = xR + 16;

  // Beads shrink as the strand grows, so a long infinite run still fits the
  // viewBox. Scale is the gap between mains relative to the classic 13-bead gap.
  const classicStep = (xR - xL) / (TOTAL_ROUNDS - 1);
  const step = total > 1 ? (xR - xL) / (total - 1) : classicStep;
  const scale = Math.max(0.45, Math.min(1, step / classicStep));
  const s = (v) => +(v * scale).toFixed(2);
  // single bead sits centred; otherwise spread evenly between the tied ends
  const beadX = (i) => total > 1
    ? +(xL + ((xR - xL) * i) / (total - 1)).toFixed(1)
    : +((xL + xR) / 2).toFixed(1);

  let d = "";
  for (let k = 0; k <= 48; k++) {
    const x = tx0 + ((tx1 - tx0) * k) / 48;
    d += (k ? "L" : "M") + x.toFixed(1) + "," + yAt(x).toFixed(1);
  }
  // two offset strands read as twisted floss
  let svg = `<path class="b-thread" d="${d}" stroke-width="1.7" opacity="0.55"/>` +
            `<path class="b-thread" d="${d}" stroke-width="1" opacity="0.35" stroke-dasharray="6 4" transform="translate(0 1.3)"/>`;

  const knot = (x, y, dir) =>
    `<path class="b-knot" stroke-width="1.3" opacity="0.65" d="M${x},${y} q${5 * dir},-7 ${2 * dir},-11 M${x},${y} q${7 * dir},1 ${11 * dir},-4"/>` +
    `<circle cx="${x}" cy="${y}" r="2.2" fill="var(--ink-soft)" opacity="0.7"/>`;
  svg += knot(tx0, yAt(tx0), -1) + knot(tx1, yAt(tx1), 1);

  // tiny seed beads strung between the main beads
  for (let i = 0; i < total - 1; i++) {
    const x = xL + ((xR - xL) * (i + 0.5)) / (total - 1);
    svg += `<circle class="b-seed" cx="${x.toFixed(1)}" cy="${yAt(x).toFixed(1)}" r="${s(1.9)}"/>`;
  }

  for (let i = 0; i < total; i++) {
    const x = beadX(i);
    const y = +yAt(x).toFixed(1);
    const answered = results[i];
    // colour this bead by the album of the song picked that round (final bracelet)
    const albumCol = (albums && albums[i]) ? (colors[albums[i]] || null) : null;
    const beadStyle = albumCol ? ` style="--bead:${albumCol}"` : "";

    if (answered === true) {
      // a small bead on the thread, with a star charm dangling from a jump ring.
      // a hinted round is flagged: the bead grows a touch and is stamped with an "H".
      const wasHinted = !!hinted[i];
      const beadR = wasHinted ? s(5.2) : s(4.1);
      svg += `<circle cx="${x}" cy="${y}" r="${beadR}" class="b-bead" stroke-width="1"${beadStyle}/>`;
      if (wasHinted) {
        svg += `<text x="${x}" y="${y + s(2.3)}" text-anchor="middle" font-size="${s(6.4)}" class="b-hint-h">H</text>`;
      }
      const fresh = i === freshIndex;
      const delay = fresh ? "" : ` style="animation-delay:${(-(i * 0.9) % 5.5).toFixed(2)}s"`;
      // Word-perfect verse rounds always hang the reserved pen-nib; otherwise the
      // player's chosen charm (default star), drawn by the shared CHARMS renderer.
      const isNib = verseTiers[i] === "perfect" || verseTiers[i] === "verse";
      const chosen = (opts && opts.charm && CHARMS[opts.charm]) ? opts.charm : "star";
      const charmId = isNib ? "nib" : chosen;
      const cr = s(7.4), csw = Math.max(0.7, cr * 0.15).toFixed(2);
      const charm = `<g${beadStyle}>${CHARMS[charmId](x, y + s(15.5), cr, csw)}</g>`;
      svg += `<g class="charm-dangle${fresh ? " fresh" : ""}"${delay}>` +
        `<circle cx="${x}" cy="${y + s(5.4)}" r="${s(2.3)}" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.7"/>` +
        charm +
        `</g>`;
    } else if (answered === false) {
      // a quiet matte spacer bead — tinted to the picked album, kept muted
      const missStyle = albumCol ? ` style="fill:${albumCol}" fill-opacity="0.5"` : "";
      svg += `<circle cx="${x}" cy="${y}" r="${s(4.9)}" class="b-miss" stroke-width="1"${missStyle}/>` +
             `<circle cx="${x}" cy="${y}" r="${s(1.1)}" class="b-miss-dot"/>`;
    } else if (i + 1 === activeRound) {
      // the bead being strung right now: bigger, glossy, with a soft halo pulse
      svg += `<circle cx="${x}" cy="${y}" r="${s(9)}" class="b-halo" stroke-width="2"/>` +
             `<circle cx="${x}" cy="${y}" r="${s(8.4)}" class="b-bead" stroke-width="1.4"/>` +
             `<ellipse cx="${x - s(2.6)}" cy="${y - s(3.1)}" rx="${s(3)}" ry="${s(1.8)}" class="b-gloss" transform="rotate(-20 ${x - s(2.6)} ${y - s(3.1)})"/>`;
    } else if (letterBead && i === total - 1) {
      // the finale slot is a classic white letter bead (classic mode only)
      const h = s(7);
      svg += `<g transform="rotate(6 ${x} ${y})">` +
        `<rect x="${x - h}" y="${y - h}" width="${s(14)}" height="${s(14)}" rx="${s(3.5)}" class="b-letter" stroke-width="1.1" opacity="0.8"/>` +
        `<text x="${x}" y="${y + s(2.6)}" text-anchor="middle" font-size="${s(7.5)}" class="b-letter-text">13</text>` +
        `</g>`;
    } else {
      svg += `<circle cx="${x}" cy="${y}" r="${s(5.6)}" class="b-future" stroke-width="1.1"/>`;
    }
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${svg}</svg>`;
}
