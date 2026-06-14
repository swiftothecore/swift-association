// Small pure helpers shared across modules.
export const $ = (id) => document.getElementById(id);

export function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

export function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function chance(p) { return Math.random() < p; }

// Canonical comparison key for a song title (or a typed answer). Lets a player's
// answer match regardless of punctuation, & vs "and", the $ stylisation, bracket
// tags, or numerals-vs-words. Display titles stay canonical — this only feeds the
// match. Verified to produce zero collisions across the catalog. NOTE: the order
// matters (twenty-two before the single-word folds).
export function normalizeTitle(s) {
  return s
    .toLowerCase()
    .replace(/’/g, "'")                 // curly apostrophe -> straight
    .replace(/\$/g, "s")                     // Wi$h Li$t -> wish list
    .replace(/[&+]/g, "and")                 // & / + -> and
    .replace(/[().!?,:;"'…]/g, "")       // drop punctuation + bracket chars (keep content)
    .replace(/[-–—/]/g, " ")        // dashes & slashes -> space
    .replace(/\btwenty[\s-]?two\b/g, "22")
    .replace(/\bten\b/g, "10")
    .replace(/\bone\b/g, "1")
    .replace(/\s+/g, " ")
    .trim();
}
