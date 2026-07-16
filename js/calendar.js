// Working desk calendar — a wire-bound flip pad lying flat on the writing side
// of the desk, between the glasses and the mug, open to the REAL current month.
//
// index.html carries only the static paper: the card, its grain and lighting,
// the punch slots, the coil, the red divider rule and the lifted tear corner.
// This module draws everything the date decides, so the pad is never wrong:
//   .cal-title   — MONTH + year
//   .cal-week    — S M T W T F S, weekends in the printer's red
//   .cal-marks   — the days that matter, marked in the app's own milestone
//                  language (see renderMilestoneSticky in app.js)
//   .cal-days    — the grid of dates
//   .cal-strikes — a graphite stroke through each day already crossed off
//   .cal-hl      — one gold highlighter swipe on the 13th (of course)
//   .cal-today   — the red pen loop around today, main stroke plus a lighter
//                  echo pass, like a pen that went around twice
//
// The marked days come from the real tables in config.js rather than a list of
// this module's own: TS_MILESTONES (her birthday, the twelve studio albums and
// the re-records) and TS_LORE_DAYS (the days the songs put a date on). Each
// wears its album's colour, honouring the colour-blind palette setting.
//
// The hand marks use seeded jitter — stable within a day so nothing flickers
// on re-render, but each day's slash gets its own angle, length and bow, and
// the pen loop tilts differently every day. Re-renders just after local
// midnight so a page left open overnight crosses off the day and moves the
// loop. Purely decorative and non-interactive, like every desk prop; if the
// markup isn't there it does nothing.

import { TS_MILESTONES, TS_LORE_DAYS, ALBUM_COLORS, CB_ALBUM_COLORS } from "./config.js";
import { loadSettings } from "./storage.js";

const SVG = "http://www.w3.org/2000/svg";
const svg = document.querySelector(".di-calendar svg");

const el = (name, attrs, text) => {
  const n = document.createElementNS(SVG, name);
  for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  if (text != null) n.textContent = text;
  return n;
};
const clear = (g) => { while (g.firstChild) g.removeChild(g.firstChild); };

// Cheap seeded jitter in [0,1): stable for a given seed, so the pen work
// looks human without changing between renders on the same day.
const jit = (seed) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// --- grid geometry (matches the card drawn in index.html) ---
const COL0 = 46, CW = 26.3;             // centre of first column + pitch
const colX = (c) => COL0 + c * CW;
const WEEK_Y = 133;                     // weekday-initial baseline
const ROW0 = 152, RH = 22;              // first date row baseline + pitch
const rowY = (r) => ROW0 + r * RH;
const NUM_DY = 4.1;                     // optical centring of the numerals
const MARK_DX = 7.8, MARK_DY = 5.6;     // the mark sits off the number's lower right

const MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

// The heart is app.js's milestone-sticky heart, same path, drawn small; the star
// is the desk's own folded paper star (the #flStarG geometry in index.html).
const HEART_D = "M16 27.5C15.4 27.1 4.5 19.6 4.5 11.7c0-3.6 2.7-6.4 6-6.4 2.3 0 4.2 1.3 5.5 3.4 1.3-2.1 3.2-3.4 5.5-3.4 3.3 0 6 2.8 6 6.4 0 7.9-10.9 15.4-11.5 15.8z";
const STAR_D = "M0 -12 L2.94 -4.05 L11.41 -3.71 L4.76 1.55 L7.05 9.71 L0 5 L-7.05 9.71 L-4.76 1.55 L-11.41 -3.71 L-2.94 -4.05 Z";

// One mark per calendar square. Oct 27 is both 1989 and 1989 (Taylor's Version),
// and two hearts will not fit in a 26px cell — so the earlier, original release
// wins the square (they share an album colour anyway, so the day still reads as
// 1989's). Her birthday outranks everything; a lyric day yields to a release.
const RANK = { birthday: 0, album: 1, tv: 2, lore: 3 };
const DAY_MARK = new Map();
for (const m of [...TS_MILESTONES, ...TS_LORE_DAYS]) {
  const held = DAY_MARK.get(m.md);
  if (!held || RANK[m.kind] < RANK[held.kind]) DAY_MARK.set(m.md, m);
}
const mdKey = (m, d) => `${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// A graphite slash through a spent day: its own angle, length, bow and
// offset per date, like strokes made on different mornings.
const strike = (cx, cy, s) => {
  const a = (-22 - jit(s) * 16).toFixed(1);
  const L = 11.5 + jit(s + 7) * 3.5;
  const bow = 0.8 + jit(s + 13) * 1.4;
  const dx = (jit(s + 3) - 0.5) * 2.4, dy = (jit(s + 5) - 0.5) * 2;
  return el("path", {
    d: `M${(-L / 2).toFixed(1)} ${bow.toFixed(1)} Q0 ${(-bow).toFixed(1)} ${(L / 2).toFixed(1)} ${(-bow * 1.6).toFixed(1)}`,
    transform: `translate(${(cx + dx).toFixed(1)} ${(cy + dy).toFixed(1)}) rotate(${a})`
  });
};

// The days that matter, in the app's own milestone language: an album-coloured
// heart for a release (exactly what the milestone sticky shows on the day), and
// the game's gold star for her birthday, which no album colour should stand in
// for. A lyric day gets the same heart hollowed out — a quieter cousin of a
// real release, since the song only named the date, nothing shipped on it.
function drawMark(g, mark, cx, cy, colors, s) {
  const x = (cx + MARK_DX).toFixed(1), y = (cy + MARK_DY).toFixed(1);
  const tilt = (-16 + jit(s) * 32).toFixed(1);
  if (mark.kind === "birthday") {
    g.appendChild(el("path", { d: STAR_D, class: "cal-star",
      transform: `translate(${x} ${y}) rotate(${tilt}) scale(0.4)` }));
    return;
  }
  const hollow = mark.kind === "lore";
  const color = (mark.album && colors[mark.album]) || "#8a7c62";
  g.appendChild(el("path", {
    d: HEART_D,
    fill: hollow ? "none" : color,
    stroke: hollow ? color : "rgba(0,0,0,0.28)",
    "stroke-width": hollow ? 3.2 : 0.9,
    "stroke-linejoin": "round",
    transform: `translate(${x} ${y}) rotate(${tilt}) scale(0.3) translate(-16 -16.4)`
  }));
}

// The red pen loop around today: a fast ellipse that overshoots past a full
// turn, plus a lighter echo pass slightly rotated — a pen going around twice.
function drawToday(g, cx, cy, s) {
  const rot = -8 + jit(s) * 15;
  const rx = 10.8 + jit(s + 2) * 1.2, ry = 8.3 + jit(s + 4) * 0.9;
  const d =
    `M${(cx + rx).toFixed(1)} ${(cy - 1.2).toFixed(1)}` +
    ` C${(cx + rx * 1.02).toFixed(1)} ${(cy - ry).toFixed(1)} ${(cx - rx * 1.04).toFixed(1)} ${(cy - ry * 1.06).toFixed(1)} ${(cx - rx).toFixed(1)} ${(cy - 0.6).toFixed(1)}` +
    ` C${(cx - rx * 0.97).toFixed(1)} ${(cy + ry).toFixed(1)} ${(cx + rx * 0.98).toFixed(1)} ${(cy + ry * 1.04).toFixed(1)} ${(cx + rx * 1.01).toFixed(1)} ${(cy - 0.4).toFixed(1)}` +
    ` C${(cx + rx * 1.02).toFixed(1)} ${(cy - ry * 0.55).toFixed(1)} ${(cx + rx * 0.5).toFixed(1)} ${(cy - ry * 0.98).toFixed(1)} ${(cx - rx * 0.35).toFixed(1)} ${(cy - ry * 0.92).toFixed(1)}`;
  g.appendChild(el("path", { d, transform: `rotate(${rot.toFixed(1)} ${cx} ${cy})` }));
  g.appendChild(el("path", { d, class: "echo", transform: `rotate(${(rot + 2.5).toFixed(1)} ${cx} ${cy}) translate(0.5 0.6)` }));
}

export function render(now) {
  if (!svg) return;
  const title   = svg.querySelector(".cal-title");
  const week    = svg.querySelector(".cal-week");
  const marks   = svg.querySelector(".cal-marks");
  const days    = svg.querySelector(".cal-days");
  const strikes = svg.querySelector(".cal-strikes");
  const hl      = svg.querySelector(".cal-hl");
  const today   = svg.querySelector(".cal-today");
  [week, marks, days, strikes, hl, today].forEach(clear);

  const y = now.getFullYear(), m = now.getMonth(), D = now.getDate();
  const seed = y * 384 + m * 31;
  const colors = loadSettings().colorBlindAlbums ? CB_ALBUM_COLORS : ALBUM_COLORS;

  title.textContent = MONTHS[m].toUpperCase();
  title.appendChild(el("tspan", { class: "cal-year", dx: "6" }, String(y)));

  for (let c = 0; c < 7; c++) {
    week.appendChild(el("text", {
      x: colX(c), y: WEEK_Y, "text-anchor": "middle",
      class: (c === 0 || c === 6) ? "wknd" : null
    }, DOW[c]));
  }

  const firstDay = new Date(y, m, 1).getDay();     // 0 = Sunday
  const daysIn = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= daysIn; d++) {
    const idx = firstDay + d - 1;
    const c = idx % 7, cx = colX(c), cy = rowY(Math.floor(idx / 7));

    if (d === 13) {
      const tilt = (-3.5 + (jit(seed + 99) - 0.5) * 3).toFixed(1);
      hl.appendChild(el("line", {
        x1: (cx - 8.4).toFixed(1), y1: (cy + 1).toFixed(1),
        x2: (cx + 8.4).toFixed(1), y2: (cy - 1.4).toFixed(1),
        transform: `rotate(${tilt} ${cx} ${cy})`
      }));
    }
    const mark = DAY_MARK.get(mdKey(m, d));
    if (mark) drawMark(marks, mark, cx, cy, colors, seed + d * 7);
    days.appendChild(el("text", {
      x: cx, y: (cy + NUM_DY).toFixed(1), "text-anchor": "middle",
      class: (c === 0 || c === 6) ? "wknd" : null
    }, String(d)));
    if (d < D) strikes.appendChild(strike(cx, cy, seed + d));
    if (d === D) drawToday(today, cx, cy, seed + 200 + d);
  }
}

// What day the pad is open to. The app's dev date override (window.__devDate,
// "YYYY-MM-DD", session-only — a reload goes live again) wins, so scrubbing the
// date in the dev panel scrubs the calendar with it.
function currentDate() {
  const dev = typeof window !== "undefined" && window.__devDate;
  if (dev && /^\d{4}-\d{2}-\d{2}$/.test(dev)) {
    const [y, m, d] = dev.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date();
}
export const refresh = () => render(currentDate());

// Re-render just after the next local midnight, then every following
// midnight, so a page left open overnight advances the marks.
function scheduleMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
  setTimeout(() => { refresh(); scheduleMidnight(); }, next - now);
}

if (svg) {
  refresh();
  scheduleMidnight();
  // Dev hook in the spirit of the snowfall toggle. `refresh` is what app.js's
  // date override calls; `render` still takes a Date for console poking, e.g.
  // deskCalendar.render(new Date(2026, 11, 13)) for her birthday.
  window.deskCalendar = { render, refresh };
}
