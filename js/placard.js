// The daily streak paper slip on the desk, below the calendar.
//
// index.html carries the stationery drawing and fixed "DAILY STREAK" line.
// This module writes the count, draws the bead strand and decides whether the
// keepsake is on the desk.
//
// The streak is the daily challenge's, the same number the Daily Challenge
// button and the Stats page show, so app.js hands it in rather than reading
// storage here: the daily's notion of "today" depends on the player's chosen
// time zone and on the dev date override, and there should only ever be one
// answer to that question. The bead colours arrive the same way, already
// resolved to ink by app.js, so the colour-blind album palette is honoured
// here for free and this file never learns what an album is.
//
// A streak of nothing gets no slip. A written zero would be a standing
// reproach on the desk, and bare wood is what's there today anyway.
// Purely decorative and non-interactive, like every desk prop; if the markup
// isn't there it does nothing.

const SVG_NS = "http://www.w3.org/2000/svg";
const root = document.querySelector(".di-placard");
const count = root ? root.querySelector(".plc-l2") : null;
const strandBox = root ? root.querySelector(".plc-strand") : null;

// Bead geometry on the slip's 190x112 stationery. The strand starts at the red
// margin, where the writing starts, and the cord is drawn one bead at a time so
// it sags between them like waxed thread rather than running dead straight.
const BEAD_X0 = 46, BEAD_PITCH = 15, BEAD_R = 4.8, KNOT_R = 2.4;
// Hand-strung, so no two beads sit at the same height and the pattern never
// repeats across the seven. Anything regular here reads as a printed rule.
const BEAD_YS = [44, 46.1, 43.4, 45.2, 43.6, 45.9, 44.3];
const CORD = "#8a7f6b";

// `beads` is the era ink per day kept, oldest first, capped by the caller; a null
// entry is a day that was played and got nothing right, which is drawn as an
// unstrung bead exactly as the daily ticket draws it. `over` runs the cord off
// the left edge, which is the only thing that says "and more, back there".
function drawStrand(beads, over) {
  while (strandBox.firstChild) strandBox.firstChild.remove();
  if (!beads.length) return;
  const pts = beads.map((ink, i) => ({
    x: BEAD_X0 + i * BEAD_PITCH, y: BEAD_YS[i % BEAD_YS.length], ink,
  }));
  const last = pts[pts.length - 1];
  const knotX = last.x + 9;
  const startX = over ? 8 : BEAD_X0 - 8;
  let d = `M${startX} ${pts[0].y}`;
  pts.forEach((p, i) => {
    const prevX = i === 0 ? startX : pts[i - 1].x;
    const sag = i % 2 ? -3.4 : 3.4;
    d += ` Q${((prevX + p.x) / 2).toFixed(1)} ${(p.y + sag).toFixed(1)} ${p.x} ${p.y}`;
  });
  d += ` Q${(knotX - 5).toFixed(1)} ${(last.y - 3.4).toFixed(1)} ${knotX} ${last.y}`;

  const el = (name, attrs) => {
    const n = document.createElementNS(SVG_NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  strandBox.append(el("path", { class: "plc-cord", d }));
  const beadG = el("g", { class: "plc-bead" });
  pts.forEach((p) => {
    beadG.append(p.ink
      ? el("circle", { cx: p.x, cy: p.y, r: BEAD_R, fill: p.ink })
      // nothing right that day: an unstrung bead, outline only
      : el("circle", { cx: p.x, cy: p.y, r: BEAD_R, fill: "#f7f1e2", "stroke-dasharray": "2.6 2.2" }));
  });
  beadG.append(el("circle", { cx: knotX, cy: last.y, r: KNOT_R, fill: CORD, "stroke-width": 0 }));
  strandBox.append(beadG);
}

// `streak` is an effectiveDailyStreak() record, or null to take the slip off
// the desk outright (used while the streak surfaces are unknown). `beads` is the
// ink list above; an empty one leaves the slip with its label and count alone,
// which is what a streak with no saved days behind it honestly looks like.
export function renderStreakPlacard(streak, beads = []) {
  if (!root) return;
  const days = streak && streak.current > 0 ? streak.current : 0;
  if (!days) { root.hidden = true; return; }
  // The numeral is handwritten and the unit is printed small, so the two are
  // separate spans rather than one string: at 128 a single hand-sized "128 days"
  // would run off the slip.
  count.textContent = "";
  const num = document.createElementNS(SVG_NS, "tspan");
  num.setAttribute("class", "plc-num");
  num.textContent = String(days);
  const unit = document.createElementNS(SVG_NS, "tspan");
  unit.setAttribute("class", "plc-unit");
  unit.setAttribute("dx", "5");
  unit.textContent = days === 1 ? "day" : "days";
  count.append(num, unit);
  if (strandBox) drawStrand(beads.slice(0, BEAD_YS.length), days > beads.length);
  root.hidden = false;
}
