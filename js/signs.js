/* So Many Signs' pictures, drawn on the page.

   Every mark is a 24x24 drawing in the charm pen (`.ink` open strokes, `.ink-fill` closed
   outlines, a few `fill="currentColor"` dots) with its colour laid in as coloured-pencil
   hatching: a `.tint` shape names its colour in `data-c`, and the hatch is a pattern from the
   palette below. The palette and the hatch are the ones the marks were drawn and approved in
   (scripts/bonus/marks/sheet.py and marks-board.html), so a mark on the page is the mark that
   was signed off. A per-path width only works as `style="stroke-width:…"`: the class rules
   override a plain attribute, which is why the marks carry it that way.

   The patterns are defined ONCE, in a hidden svg the first time a page needs them, and every
   mark points at them by id. That is fine here and nowhere near the zine covers' rule against
   shared defs: a cover is lifted into the keepsake rasteriser, a picture row never is. */
export const SIGN_PALETTE = {
  red: "#c4343a", blood: "#ac1f2b", maroon: "#7a2136", pink: "#d0669c", rose: "#e89ab8",
  orange: "#e07a2e", gold: "#d6a012", yellow: "#e2b21c", tan: "#c9a06a", brown: "#9a6a3c",
  skin: "#e8b48a", green: "#4c9a52", leaf: "#7fae3f", teal: "#2e9890", sky: "#7fb6e0",
  blue: "#4f82b8", navy: "#2b3a67", lav: "#9a80d8", purple: "#8a5cc0", grey: "#8d867b", black: "#3a3530",
};

export function ensureSignDefs(doc = document) {
  if (doc.getElementById("signHatchDefs")) return;
  const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "signHatchDefs";
  svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.innerHTML = Object.entries(SIGN_PALETTE).map(([k, v]) =>
    `<pattern id="sign-hatch-${k}" patternUnits="userSpaceOnUse" width="1.45" height="1.45" patternTransform="rotate(-38)">` +
    `<rect width="1.45" height="1.45" fill="${v}" opacity=".2"/>` +
    `<line x1="0" y1=".7" x2="1.45" y2=".7" stroke="${v}" stroke-width=".95" opacity=".78"/></pattern>`).join("");
  doc.body.prepend(svg);
  const style = doc.createElement("style");
  style.id = "signHatchStyle";
  style.textContent = Object.entries(SIGN_PALETTE).map(([k, v]) =>
    `.sign-mark .tint[data-c="${k}"]{fill:url(#sign-hatch-${k})}.sign-mark .tint-line[data-c="${k}"]{stroke:${v}}`).join("");
  doc.head.appendChild(style);
}

// One mark, as markup. The wobble is the charms' own filter (#charmWobble in index.html).
export function signMark(svg) {
  return `<svg class="sign-mark" viewBox="0 0 24 24" aria-hidden="true"><g>${svg}</g></svg>`;
}
