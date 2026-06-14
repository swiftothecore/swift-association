// The hand-strung friendship-bracelet keepsake, rendered as SVG.
// Pure: given the per-round results (and the picked albums), returns markup.
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

export function buildBraceletSVG(results, activeRound, freshIndex, albums) {
  const W = 520, H = 64, xL = 26, xR = W - 26;
  // the thread sags between its tied ends like a real bracelet laid on the page
  const yAt = (x) => 20 + 10 * Math.sin(Math.PI * ((x - xL) / (xR - xL)));
  const tx0 = xL - 16, tx1 = xR + 16;

  let d = "";
  for (let s = 0; s <= 48; s++) {
    const x = tx0 + ((tx1 - tx0) * s) / 48;
    d += (s ? "L" : "M") + x.toFixed(1) + "," + yAt(x).toFixed(1);
  }
  // two offset strands read as twisted floss
  let svg = `<path class="b-thread" d="${d}" stroke-width="1.7" opacity="0.55"/>` +
            `<path class="b-thread" d="${d}" stroke-width="1" opacity="0.35" stroke-dasharray="6 4" transform="translate(0 1.3)"/>`;

  const knot = (x, y, dir) =>
    `<path class="b-knot" stroke-width="1.3" opacity="0.65" d="M${x},${y} q${5 * dir},-7 ${2 * dir},-11 M${x},${y} q${7 * dir},1 ${11 * dir},-4"/>` +
    `<circle cx="${x}" cy="${y}" r="2.2" fill="var(--ink-soft)" opacity="0.7"/>`;
  svg += knot(tx0, yAt(tx0), -1) + knot(tx1, yAt(tx1), 1);

  // tiny seed beads strung between the main beads
  for (let i = 0; i < TOTAL_ROUNDS - 1; i++) {
    const x = xL + ((xR - xL) * (i + 0.5)) / (TOTAL_ROUNDS - 1);
    svg += `<circle class="b-seed" cx="${x.toFixed(1)}" cy="${yAt(x).toFixed(1)}" r="1.9"/>`;
  }

  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const x = +(xL + ((xR - xL) * i) / (TOTAL_ROUNDS - 1)).toFixed(1);
    const y = +yAt(x).toFixed(1);
    const answered = results[i];
    // colour this bead by the album of the song picked that round (final bracelet)
    const albumCol = (albums && albums[i]) ? (ALBUM_COLORS[albums[i]] || null) : null;
    const beadStyle = albumCol ? ` style="--bead:${albumCol}"` : "";

    if (answered === true) {
      // a small bead on the thread, with a star charm dangling from a jump ring
      svg += `<circle cx="${x}" cy="${y}" r="4.1" class="b-bead" stroke-width="1"${beadStyle}/>`;
      const fresh = i === freshIndex;
      const delay = fresh ? "" : ` style="animation-delay:${(-(i * 0.9) % 5.5).toFixed(2)}s"`;
      svg += `<g class="charm-dangle${fresh ? " fresh" : ""}"${delay}>` +
        `<circle cx="${x}" cy="${y + 5.4}" r="2.3" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.7"/>` +
        `<path d="${starPath(x, y + 15.5, 7.4, 3.1)}" class="b-bead" stroke-width="1.1" stroke-linejoin="round"${beadStyle}/>` +
        `<circle cx="${x - 1.9}" cy="${y + 12.6}" r="1.2" class="b-gloss"/>` +
        `</g>`;
    } else if (answered === false) {
      // a quiet matte spacer bead — tinted to the picked album, kept muted
      const missStyle = albumCol ? ` style="fill:${albumCol}" fill-opacity="0.5"` : "";
      svg += `<circle cx="${x}" cy="${y}" r="4.9" class="b-miss" stroke-width="1"${missStyle}/>` +
             `<circle cx="${x}" cy="${y}" r="1.1" class="b-miss-dot"/>`;
    } else if (i + 1 === activeRound) {
      // the bead being strung right now: bigger, glossy, with a soft halo pulse
      svg += `<circle cx="${x}" cy="${y}" r="9" class="b-halo" stroke-width="2"/>` +
             `<circle cx="${x}" cy="${y}" r="8.4" class="b-bead" stroke-width="1.4"/>` +
             `<ellipse cx="${x - 2.6}" cy="${y - 3.1}" rx="3" ry="1.8" class="b-gloss" transform="rotate(-20 ${x - 2.6} ${y - 3.1})"/>`;
    } else if (i === TOTAL_ROUNDS - 1) {
      // the finale slot is a classic white letter bead
      svg += `<g transform="rotate(6 ${x} ${y})">` +
        `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" rx="3.5" class="b-letter" stroke-width="1.1" opacity="0.8"/>` +
        `<text x="${x}" y="${y + 2.6}" text-anchor="middle" font-size="7.5" class="b-letter-text">13</text>` +
        `</g>`;
    } else {
      svg += `<circle cx="${x}" cy="${y}" r="5.6" class="b-future" stroke-width="1.1"/>`;
    }
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${svg}</svg>`;
}
