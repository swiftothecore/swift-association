// The streak placard — the engraved brass plate on the desk, below the calendar.
//
// index.html carries the object itself (walnut, brass, screws, the enamelled
// flame and the fixed "DAILY STREAK" line). This module writes the one line the
// count decides, and decides whether the plaque is on the desk at all.
//
// The streak is the daily challenge's, the same number the Daily Challenge
// button and the Stats page show, so app.js hands it in rather than reading
// storage here: the daily's notion of "today" depends on the player's chosen
// time zone and on the dev date override, and there should only ever be one
// answer to that question.
//
// A streak of nothing gets no plaque. An engraved zero would be a standing
// reproach on the desk, and bare wood is what's there today anyway.
// Purely decorative and non-interactive, like every desk prop; if the markup
// isn't there it does nothing.

const root = document.querySelector(".di-placard");
const count = root ? root.querySelector(".plc-count") : null;
const lines = root ? root.querySelectorAll(".plc-l2") : [];

const PLATE_MID = 100;   // the plate's vertical centreline, in the SVG's own units
const L2_TRACK = 0.6;    // .plc-l2's letter-spacing, which hangs off the last letter

// `streak` is an effectiveDailyStreak() record, or null to take the plaque off
// the desk outright (used while the streak surfaces are unknown).
export function renderStreakPlacard(streak) {
  if (!root) return;
  const days = streak && streak.current > 0 ? streak.current : 0;
  if (!days) { root.hidden = true; return; }
  // Both copies carry the same text: one is the lit far wall of the cut, the
  // other the cut itself, and a mismatch would read as a printing error.
  const text = `${days} ${days === 1 ? "DAY" : "DAYS"}`;
  lines.forEach((l) => { l.textContent = text; });
  // Unhide before measuring — getBBox on a hidden element reports nothing, so
  // a plaque appearing for the first time would centre its count on zero.
  root.hidden = false;
  centreCount();
}

// Slide the flame-and-count line so the pair sits centred on the plate. The
// line's width moves with the digits ("1 DAY" against "365 DAYS"), so this
// can't be done with text-anchor; measuring after the write is the only
// honest way to keep it centred at every length.
function centreCount() {
  if (!count) return;
  count.removeAttribute("transform");
  let box;
  try { box = count.getBBox(); } catch (e) { return; }   // no layout yet (offscreen tab)
  if (!box.width) return;
  // The measured box runs to the end of the last letter's advance, so it is a
  // whole letter-space wider than the ink; half of that comes back off.
  const ink = box.x + (box.width - L2_TRACK) / 2;
  count.setAttribute("transform", `translate(${(PLATE_MID - ink).toFixed(2)} 0)`);
}
