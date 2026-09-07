// The daily streak paper slip on the desk, below the calendar.
//
// index.html carries the stationery drawing and fixed "DAILY STREAK" line.
// This module writes the count and decides whether the keepsake is on the desk.
//
// The streak is the daily challenge's, the same number the Daily Challenge
// button and the Stats page show, so app.js hands it in rather than reading
// storage here: the daily's notion of "today" depends on the player's chosen
// time zone and on the dev date override, and there should only ever be one
// answer to that question.
//
// A streak of nothing gets no slip. A written zero would be a standing
// reproach on the desk, and bare wood is what's there today anyway.
// Purely decorative and non-interactive, like every desk prop; if the markup
// isn't there it does nothing.

const SVG_NS = "http://www.w3.org/2000/svg";
const root = document.querySelector(".di-placard");
const count = root ? root.querySelector(".plc-l2") : null;

// `streak` is an effectiveDailyStreak() record, or null to take the plaque off
// the desk outright (used while the streak surfaces are unknown).
export function renderStreakPlacard(streak) {
  if (!root) return;
  const days = streak && streak.current > 0 ? streak.current : 0;
  if (!days) { root.hidden = true; return; }
  // The numeral is handwritten and the unit is printed small, so the two are
  // separate spans rather than one string: at 128 a single hand-sized "128 days"
  // would run into the flame.
  count.textContent = "";
  const num = document.createElementNS(SVG_NS, "tspan");
  num.setAttribute("class", "plc-num");
  num.textContent = String(days);
  const unit = document.createElementNS(SVG_NS, "tspan");
  unit.setAttribute("class", "plc-unit");
  unit.setAttribute("dx", "5");
  unit.textContent = days === 1 ? "day" : "days";
  count.append(num, unit);
  root.hidden = false;
}
