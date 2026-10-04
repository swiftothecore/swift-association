/* The results page's way home, struck as a postmark: a circular date stamp beside a slogan run
   between two pairs of wavy cancel lines. It is the third rubber stamp on the page, in
   post-office black, cut a different shape from PLAY AGAIN and ENCORE below it but inked
   through the same kind of filter (#pmInk in index.html's shared defs) and pressed with the
   same .kg-press / .kg-print / .kg-ghost hover. Designed on scripts/ui/turn-back/board-2.html
   (option F).

   Pure and state-free like ctasketch.js: a label and a date in, an svg string out. app.js owns
   deciding what those are (paintPostmark).

   TWO CUTS, like the stamps under it: a wide one with the slogan on one line for the page
   column, and a narrow one with it on two for a phone, where the wide cut scaled down would
   shrink the ring's lettering to specks. The CSS picks which prints.

   THE RING says the game's name, and the middle says when: the time the run ended over its
   day and year. That is the one honest thing a postmark says, so no two runs post the same
   mark. A Daily reopened from the calendar has no finishing time to hand, so its middle line
   reads DAILY over that day's date instead of inventing one.

   The ring's text runs on textPaths, which need ids, so each cut's ids carry the cut's name.
   There is one #againBtn, so they are unique on the page. The page-turn clone duplicates them
   for the length of the turn, which is harmless: the clone's references land on the original's
   identical geometry. The wavy lines are machine cancels and are allowed to be regular; only
   their phase and a breath of amplitude move between them. */

const f = (v) => +v.toFixed(2);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// mulberry32: a fixed sequence per seed, so the cancel lines never re-wave between visits
const rng = (seed) => () => {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const TYPE = "font-family: var(--type); font-weight: 700;";

// The three lines in the middle of the ring: a time (or a word standing in for one) over the
// day and the year. A `word` takes the time's place when there is no time to give.
export function postmarkDate(date, word = "") {
  const d = date instanceof Date ? date : new Date();
  let h = d.getHours();
  const pm = h >= 12;
  h = h % 12 || 12;
  return {
    top: word || `${h}.${String(d.getMinutes()).padStart(2, "0")} ${pm ? "PM" : "AM"}`,
    day: `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`,
    year: String(d.getFullYear()),
  };
}

// One wavy cancel line: a sine with a little hand in its amplitude and phase.
function wave(x0, x1, y, rnd, amp = 2.3, period = 26) {
  const ph = rnd() * Math.PI * 2;
  let d = "";
  for (let x = x0; x <= x1 + 0.01; x += 2) {
    const yy = y + Math.sin((x / period) * Math.PI * 2 + ph) * amp * (0.92 + 0.08 * Math.sin(x / 47));
    d += (x === x0 ? "M" : "L") + f(x) + " " + f(yy) + " ";
  }
  return d;
}

function cut(name, lines, stamp) {
  const wide = name === "wide";
  const W = wide ? 560 : 340, H = wide ? 88 : 98;
  const cx = wide ? 44 : 40, cy = H / 2, R = wide ? 40 : 37, r = wide ? 26.5 : 24.5;
  const tr = (R + r) / 2 - 2.5, btr = tr + 5.3;
  const id = `pm-${name}`;
  const rnd = rng(wide ? 88 : 89);
  const x0 = cx + R + 8, x1 = W - 6, mid = (x0 + x1) / 2;
  const fs = wide ? 22 : 19, track = wide ? 2.4 : 1.6;
  const waves = wide ? [cy - 29, cy - 20.5, cy + 20.5, cy + 29] : [cy - 38, cy - 30, cy + 30, cy + 38];
  const textY = wide ? [cy + 7.6] : [cy - 4, cy + 18];
  const ring = `${TYPE} font-size: ${wide ? 7.5 : 7.2}px; letter-spacing: ${wide ? 0.5 : 0.1}px;`;
  const art =
    `<g id="${id}">` +
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="currentColor" stroke-width="2.9"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.4"/>` +
      // the crown's path runs clockwise and the foot's anticlockwise, so both read upright
      `<path id="${id}-t" d="M${f(cx - tr)} ${cy} A${f(tr)} ${f(tr)} 0 0 1 ${f(cx + tr)} ${cy}" fill="none"/>` +
      `<path id="${id}-b" d="M${f(cx - btr)} ${cy} A${f(btr)} ${f(btr)} 0 0 0 ${f(cx + btr)} ${cy}" fill="none"/>` +
      `<text fill="currentColor" style="${ring}"><textPath href="#${id}-t" startOffset="50%" text-anchor="middle">SWIFT TO THE SONG</textPath></text>` +
      `<text fill="currentColor" style="${ring}"><textPath href="#${id}-b" startOffset="50%" text-anchor="middle">ASSOCIATION</textPath></text>` +
      `<circle cx="${f(cx - (R + r) / 2)}" cy="${cy}" r="1.25" fill="currentColor"/>` +
      `<circle cx="${f(cx + (R + r) / 2)}" cy="${cy}" r="1.25" fill="currentColor"/>` +
      `<text x="${cx}" y="${f(cy - 8.4)}" text-anchor="middle" fill="currentColor" style="${TYPE} font-size: 7.6px; letter-spacing: 0.6px;">${esc(stamp.top)}</text>` +
      `<text x="${cx}" y="${f(cy + 4.6)}" text-anchor="middle" fill="currentColor" style="${TYPE} font-size: 11.4px; letter-spacing: 0.3px;">${esc(stamp.day)}</text>` +
      `<text x="${cx}" y="${f(cy + 15.6)}" text-anchor="middle" fill="currentColor" style="${TYPE} font-size: 9px; letter-spacing: 1.8px;">${esc(stamp.year)}</text>` +
      waves.map((y) => `<path d="${wave(x0, x1, y, rnd)}" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>`).join("") +
      lines.map((t, i) => `<text x="${f(mid)}" y="${f(textY[i])}" text-anchor="middle" fill="currentColor" ` +
        `style="${TYPE} font-size: ${fs}px; letter-spacing: ${track}px;" rotate="-1 1 0 -1 1 0 1 -1">${esc(t)}</text>`).join("") +
    `</g>`;
  // Inside each cut's own svg: the cuts take turns being display:none, and a <use> whose target
  // sits in a hidden svg stops rendering. The filter lives in the always-rendered shared defs.
  return `<svg class="kg-stamp pm-${name}" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">` +
    `<defs>${art}</defs>` +
    `<use class="kg-ghost" href="#${id}" filter="url(#pmInk)"/>` +
    `<use class="kg-print" href="#${id}" filter="url(#pmInk)"/>` +
  `</svg>`;
}

// The slogan as one line for the wide cut and broken where it reads for the narrow one:
// "TURN BACK TO" / "THE FRONT PAGE", "BACK TO" / "YOUR CALENDAR".
export function postmarkSVG(label, stamp) {
  const words = String(label).toUpperCase();
  const at = words.indexOf(" TO ") + 3;
  const narrow = at > 2 ? [words.slice(0, at), words.slice(at + 1)] : [words];
  return cut("wide", [words], stamp) + cut("narrow", narrow, stamp);
}
