/* ---------- The generated favicon ----------
   Pure and state-free: hand it an ink hex, get back the tab icon drawn in it.

   The tile is the notebook page — cream paper, red margin rule, two feint lines — with the "13"
   inked over a highlighter blob and a star in the corner. Two of those take the Album Focus ink:

   - the highlighter blob, DILUTED. A highlighter is a translucent ink, and the "13" strokes on
     top of it are near-black, so a blob painted at full strength in reputation's black or
     midnights' navy would swallow them. `highlighterTint` waters the ink toward the paper until
     the blob AS COMPOSITED (the fill over cream, at the alpha it is drawn with) clears a
     luminance floor, which is exactly what watering a marker down does. It keeps the hue, which
     at 16px is the only thing telling reputation's blob from folklore's.
   - the star, at FULL strength. It carries its own near-black outline, so it stays visible at
     any value, and it is the one element that shows the ink undiluted. That is also why it is
     the element the perfect tier gilds: PERFECT the album and a leaf rim is laid AROUND the star,
     which reads at 16px as the mark growing a gold edge. The rim rather than a gold fill, because
     the star is the one place the ink is shown at full strength and gilding the fill spent it.
     Fearless is the one ink where the gild is nearly invisible, since champagne is already a gold;
     that is accepted, not a bug.

   The artwork lives here and nowhere else. icons/favicon.svg is the no-JS/social fallback and is
   this same drawing with no ink; if you change a path here, reprint it with __dev.ink.favicon()
   and paste the result into that file, or the two will drift.

   Colours are NOT duplicated from the palette: app.js reads the computed --mast-ink-day off the
   body and passes it in. Day, not night: the tile is cream whatever the page theme is wearing. */

// The house gold, worn when no ink is chosen. These two are the only hexes in this file that are
// not read from CSS, and they are the fallback pair rather than a copy of anything in the palette.
export const FAVICON_BLOB = "#f2c33d";
export const FAVICON_STAR = "#e0a32f";
// The gold leaf the perfect tier lays around the star. The day value, always: this star is on the
// cream tile, not on the night masthead, so it does not take the --leaf pair's other half.
export const FAVICON_LEAF = "#e0b23c";

// The paper the blob is laid on, and the alpha it is laid at. Both are read back out of the
// drawing below; the alpha is the denser of the two blob passes, since that is the patch the "1"
// sits on and so the one that decides legibility.
const PAPER = [245, 239, 225];
const BLOB_ALPHA = 0.8;
// How light the composited blob has to end up before the near-black "13" reads over it. The
// house gold composites to 0.65, so this is a long way below "as light as the icon has always
// been" and only the dark half of the palette is moved at all.
const HL_FLOOR = 0.3;

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex(rgb) {
  return "#" + rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("");
}
function relLuminance(rgb) {
  const lin = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
// What the eye actually gets: the fill laid over the paper at the blob's alpha.
function onPaper(rgb) {
  return rgb.map((v, i) => v * BLOB_ALPHA + PAPER[i] * (1 - BLOB_ALPHA));
}

// Water the ink down toward the paper until the composited blob clears the floor. Luminance
// rises monotonically with the mix, so a short bisection lands on the LEAST dilution that works:
// the pale half of the palette comes back untouched and only the dark end actually moves.
export function highlighterTint(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return FAVICON_BLOB;
  if (relLuminance(onPaper(rgb)) >= HL_FLOOR) return rgbToHex(rgb);
  let lo = 0, hi = 1;
  for (let i = 0; i < 14; i++) {
    const t = (lo + hi) / 2;
    const mixed = rgb.map((v, j) => v + (PAPER[j] - v) * t);
    if (relLuminance(onPaper(mixed)) >= HL_FLOOR) hi = t; else lo = t;
  }
  return rgbToHex(rgb.map((v, j) => v + (PAPER[j] - v) * hi));
}

// The star in the corner, drawn once and stroked twice when it is gilded: a wide leaf pass first,
// then the inked star with its own near-black outline on top of it, which leaves the leaf showing
// as a rim outside the outline. The black line stays in both states because it is what holds the
// mark together at 16px, and it is the reason the favicon's gild is a rim OUTSIDE an outline
// while the masthead's is the outline itself.
const STAR_D = "M54.5,8.8 L55.56,11.54 L58.49,11.7 L56.21,13.56 L56.97,16.4 L54.5,14.8 L52.03,16.4 L52.79,13.56 L50.51,11.7 L53.44,11.54 Z";

/* The tile. `ink` is a hex or "" for the house gold; `gild` rims the star in leaf (the perfect tier). */
export function faviconSVG(ink, gild) {
  const blob = ink ? highlighterTint(ink) : FAVICON_BLOB;
  // The star's body is the ink itself, undiluted, gild or no gild. The perfect tier lays the leaf
  // AROUND it instead of over it (see the rim below), the same way round as the masthead's star,
  // so the tab icon and the title can never disagree about what a gilded ink looks like.
  const star = ink || FAVICON_STAR;
  // The gild only means anything over an ink. With no ink the star is already the house gold, so
  // a leaf rim on it would be gold on gold and say nothing.
  const rim = ink && gild;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <title>Swift To The Song Association</title>
  <clipPath id="tile"><rect x="2" y="2" width="60" height="60" rx="14"/></clipPath>
  <rect x="2" y="2" width="60" height="60" rx="14" fill="#f5efe1" stroke="#e0d6bf" stroke-width="1"/>
  <line x1="20" y1="12" x2="46" y2="12" stroke="#2b2722" stroke-opacity="0.10" stroke-width="1"/>
  <line x1="20" y1="54" x2="48" y2="54" stroke="#2b2722" stroke-opacity="0.10" stroke-width="1"/>
  <line x1="13" y1="8" x2="13" y2="56" stroke="#b23a3a" stroke-opacity="0.85" stroke-width="2.5" stroke-linecap="round"/>
  <g clip-path="url(#tile)"><g transform="rotate(-2.5 37 33)">
    <path d="M14.5,26.8 Q28,24.6 42,24.2 Q54,23.8 66,24.6 L66,40 Q46,41.4 32,42.2 Q22,42.8 15.4,42.2 Q13.6,37.6 14,32.8 Q14.2,29.4 14.5,26.8 Z" fill="${blob}" opacity="0.72"/>
    <path d="M14.5,27.5 L34,26 L34.5,42 L15,43 Z" fill="${blob}" opacity="0.28"/>
  </g></g>
  <g transform="rotate(-2 37 32)">
    <path d="M21.5,23.8 Q25.5,20.5 29.5,16 Q30.2,33 28.8,48.8" fill="none" stroke="#2b2722" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M37.5,18.2 Q47,14 49.3,21 Q50.3,26.8 45,30.4" fill="none" stroke="#2b2722" stroke-width="5.8" stroke-linecap="round"/>
    <path d="M45,30.4 Q52.6,32 52.9,39.8 Q53.2,47.8 45,49.3 Q39.8,50.1 36.8,46.8" fill="none" stroke="#2b2722" stroke-width="5.8" stroke-linecap="round"/>
  </g>
  <g transform="rotate(-10 54.5 13)">
    ${rim ? `<path d="${STAR_D}" fill="none" stroke="${FAVICON_LEAF}" stroke-width="5" stroke-linejoin="round"/>` : ""}
    <path d="${STAR_D}" fill="${star}" stroke="#2b2722" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
</svg>`;
}

/* How the icon reaches the <link>. Either form sidesteps the service worker's cached copy of
   icons/favicon.svg entirely, so the tab never shows a stale ink; that file stays as the no-JS
   and social fallback.

   A BLOB url, not a data url, and this is not a style preference. WebKit does not fetch a
   `data:` href on link[rel=icon] at all: it does not error, it just keeps whatever icon it
   already loaded, which is the un-inked icons/favicon.svg. So on Safari the ink silently never
   arrived. A blob url is a real fetch against this origin and WebKit takes it, as do the others,
   which is why there is no branch here. The percent-encoded data url survives as the fallback
   for an environment with no URL.createObjectURL, and nothing else reaches for it.

   The caller owns the handle: a blob url pins its blob until URL.revokeObjectURL is called, and
   the tile is redrawn on every ink change, so leaving them unrevoked leaks one per repaint. */
function faviconDataUrl(ink, gild) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(faviconSVG(ink, gild));
}
export function faviconBlobUrl(ink, gild) {
  if (typeof URL === "undefined" || !URL.createObjectURL) return faviconDataUrl(ink, gild);
  return URL.createObjectURL(new Blob([faviconSVG(ink, gild)], { type: "image/svg+xml" }));
}
