// Composites the finished bracelet SVG onto a torn-out notebook page and rasterises
// it to a PNG the player can keep or share. Pure of app state: the caller hands over
// the already-rendered strand markup, the run's stat chips, and the live colour
// tokens; this module frames it, embeds the notebook's own fonts, and downloads it.
//
// Why the fonts are inlined as base64: an SVG drawn through an <img> onto a canvas
// renders in an isolated context that will NOT reach out for @font-face files, even
// same-origin ones. So Caveat and Courier Prime are fetched once, base64'd, and
// written straight into the card's <style> — otherwise the typewriter/handwriting
// text silently falls back to a system font in the exported PNG.

const FONT_FILES = [
  { family: "Caveat",        weight: "400 700", style: "normal", file: "fonts/caveat-latin.woff2" },
  { family: "Courier Prime", weight: "400",     style: "normal", file: "fonts/courierprime-400-latin.woff2" },
  { family: "Courier Prime", weight: "700",     style: "normal", file: "fonts/courierprime-700-latin.woff2" },
];

let fontCssPromise = null;

function bytesToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;   // chunk the spread so a big font file doesn't blow the call stack
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

// Fetch + base64 the notebook's fonts once, memoised as a promise. A failed fetch
// clears the cache so a later export can retry rather than being poisoned forever.
export function fontFaceCss() {
  if (fontCssPromise) return fontCssPromise;
  fontCssPromise = Promise.all(FONT_FILES.map(async (f) => {
    const res = await fetch(f.file);
    if (!res.ok) throw new Error("font fetch failed: " + f.file);
    const b64 = bytesToBase64(await res.arrayBuffer());
    return `@font-face{font-family:"${f.family}";font-style:${f.style};font-weight:${f.weight};` +
           `src:url(data:font/woff2;base64,${b64}) format("woff2");}`;
  })).then((faces) => faces.join(""))
     .catch((e) => { fontCssPromise = null; throw e; });
  return fontCssPromise;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Build the full keepsake-card SVG string. `fontCss` is the inlined @font-face block.
// The bracelet keeps its class-based styling (.b-bead etc.); the card re-declares
// those classes against the live colour tokens (passed in meta.vars) and sets the
// same CSS custom properties the page uses, so per-bead album tints (carried on each
// bead as an inline `--bead`) still resolve exactly as they do on screen.
// Measure a string in a given CSS font (the page's real Caveat/Courier are loaded),
// so a heart can sit flush against the signature without guessing its width.
function measureText(str, font) {
  try {
    const ctx = measureText._c || (measureText._c = document.createElement("canvas").getContext("2d"));
    ctx.font = font;
    return ctx.measureText(str).width;
  } catch (e) { return String(str).length * 17; }
}

// The heart-hands emblem (the game's own HEART_HANDS_SVG, passed in via meta so the
// keepsake reuses the exact glyph from the notebook signature / settings). Re-tinted to
// `fill` and placed at (x,y) with the given box, dropping the page-only class.
function heartHandsMark(markup, x, y, w, h, fill) {
  if (!markup) return "";
  return markup
    .replace('class="np-hands" ', "")
    .replace('width="52"', `width="${w}"`)
    .replace('height="42"', `height="${h}"`)
    .replace('fill="currentColor"', `fill="${fill}"`)
    .replace("<svg ", `<svg x="${x}" y="${y}" `);
}

// One strip of frosted washi tape with hand-torn edges, matching the app's real tape
// (see styles.css .nav-tape): a warm translucent kraft strip that lifts off the page —
// torn silhouette, translucent fill, a diagonal sheen, faint fibre grain, soft shadow.
// Positioned by its top-left corner; `idx` disambiguates the per-strip clip id.
const TORN_TAPE = [[5,0],[96,0],[91,20],[97,40],[88,60],[96,80],[90,100],[8,100],[4,80],[10,60],[3,40],[7,20]];
function washiTape(x, y, w, h, rot, idx) {
  const poly = TORN_TAPE.map(([px, py]) => `${(px / 100 * w).toFixed(1)},${(py / 100 * h).toFixed(1)}`).join(" ");
  const clip = `tapeClip${idx}`;
  return `<g transform="translate(${x} ${y}) rotate(${rot})" filter="url(#tapeShadow)">` +
    `<clipPath id="${clip}"><polygon points="${poly}"/></clipPath>` +
    `<polygon points="${poly}" fill="rgba(252,248,238,0.72)"/>` +
    `<polygon points="${poly}" fill="rgba(201,178,122,0.42)"/>` +
    `<rect width="${w}" height="${h}" fill="url(#tapeFibre)" clip-path="url(#${clip})"/>` +
    `<rect width="${w}" height="${h}" fill="url(#tapeSheen)" clip-path="url(#${clip})"/>` +
  `</g>`;
}

export function buildCardSVG(meta, fontCss) {
  const v = meta.vars;
  const W = 760, H = 430;
  const marginX = 54;                       // the red margin rule
  const contentL = 74, contentR = W - 48;   // text column, right of the margin
  const contentW = contentR - contentL;

  // faint ruled feint across the page
  let rules = "";
  for (let y = 132; y < H - 20; y += 30) {
    rules += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${v.rule}" stroke-width="1"/>`;
  }

  // the finished strand, nested and scaled into place (its own viewBox is 520x64)
  const bx = 62, by = 158, bw = W - bx - 46, bh = +(bw * 64 / 520).toFixed(1);
  const strand = meta.braceletMarkup.replace(
    "<svg ",
    `<svg x="${bx}" y="${by}" width="${bw}" height="${bh}" preserveAspectRatio="xMidYMid meet" `
  );

  // stat chips, spread evenly under the strand
  const stats = (meta.stats || []).slice(0, 4);
  const sy = by + bh + 66;
  const colW = stats.length ? contentW / stats.length : contentW;
  let statSvg = "";
  stats.forEach((s, i) => {
    const cx = +(contentL + colW * (i + 0.5)).toFixed(1);
    statSvg +=
      `<text x="${cx}" y="${sy}" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="40" fill="${v.inkAccent}">${esc(s.v)}</text>` +
      `<text x="${cx}" y="${sy + 22}" text-anchor="middle" font-family="Courier Prime" font-size="11.5" letter-spacing="1.6" fill="${v.inkSoft}">${esc(String(s.l).toUpperCase())}</text>`;
  });
  const divY = sy - 42;
  const divider = stats.length
    ? `<line x1="${contentL}" y1="${divY}" x2="${contentR}" y2="${divY}" stroke="${v.inkSoft}" stroke-dasharray="4 5" stroke-width="1" opacity="0.45"/>`
    : "";

  // Signature + footer along the bottom. The signature is always inked in the house
  // gold (with the heart-hands emblem), a fixed brand mark — the stats above wear the
  // era's accent, but the name stays gold in every era.
  const GOLD = "#a9791f";
  const sigY = H - 46;
  let sig = "";
  if (meta.signature) {
    const nameW = measureText(meta.signature, "700 34px Caveat");
    const hw = 46, hh = 37;
    sig = `<g transform="rotate(-3 ${contentL} ${sigY})">` +
      `<text x="${contentL}" y="${sigY}" font-family="Caveat" font-weight="700" font-size="34" fill="${GOLD}">${esc(meta.signature)}</text>` +
      heartHandsMark(meta.heartHands, contentL + nameW + 14, sigY - 30, hw, hh, GOLD) +
    `</g>`;
  }
  const footer = `<text x="${contentR}" y="${sigY}" text-anchor="end" font-family="Courier Prime" font-size="12" letter-spacing="0.4" fill="${v.inkSoft}">${esc(meta.footer)}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<defs><style>${fontCss}` +
      `svg{--ink:${v.ink};--ink-soft:${v.inkSoft};--bead:${v.bead};--paper:${v.paper};--paper-edge:${v.paperEdge}}` +
      `.b-thread{fill:none;stroke:var(--ink-soft);stroke-linecap:round}` +
      `.b-knot{fill:none;stroke:var(--ink-soft);stroke-linecap:round}` +
      `.b-seed{fill:var(--bead);opacity:.45}` +
      `.b-future{fill:var(--paper);stroke:var(--ink-soft);opacity:.5}` +
      `.b-letter{fill:#fffdf6;stroke:var(--ink-soft)}` +
      `.b-letter-text{fill:var(--ink-soft);font-family:"Courier Prime",monospace;font-weight:700}` +
      `.b-miss{fill:var(--paper-edge);stroke:var(--ink-soft)}` +
      `.b-miss-dot{fill:var(--ink-soft);opacity:.7}` +
      `.b-bead{fill:var(--bead);stroke:var(--ink)}` +
      `.b-gloss{fill:#fff;opacity:.55}` +
      `.b-nib-hole{fill:var(--paper)}` +
      `.b-nib-slit{fill:none;stroke:var(--ink);opacity:.7;stroke-linecap:round}` +
      `.b-hint-h{fill:#fffdf6;font-family:"Courier Prime",monospace;font-weight:700}` +
    `</style>` +
    // washi-tape surface bits, mirroring styles.css .nav-tape (sheen + fibre + torn-edge shadow)
    `<filter id="tapeShadow" x="-25%" y="-45%" width="150%" height="190%">` +
      `<feDropShadow dx="0" dy="1" stdDeviation="1.1" flood-color="#2b2722" flood-opacity="0.30"/>` +
    `</filter>` +
    `<linearGradient id="tapeSheen" x1="0" y1="0" x2="1" y2="0.18">` +
      `<stop offset="26%" stop-color="#fff" stop-opacity="0"/>` +
      `<stop offset="40%" stop-color="#fff" stop-opacity="0.30"/>` +
      `<stop offset="52%" stop-color="#fff" stop-opacity="0"/>` +
      `<stop offset="66%" stop-color="#2b2722" stop-opacity="0.05"/>` +
      `<stop offset="78%" stop-color="#fff" stop-opacity="0.14"/>` +
      `<stop offset="90%" stop-color="#fff" stop-opacity="0"/>` +
    `</linearGradient>` +
    `<pattern id="tapeFibre" width="3" height="10" patternUnits="userSpaceOnUse">` +
      `<rect width="1" height="10" fill="rgba(74,62,42,0.06)"/>` +
    `</pattern></defs>` +
    `<rect width="${W}" height="${H}" fill="${v.paper}"/>` +
    rules +
    `<line x1="${marginX}" y1="0" x2="${marginX}" y2="${H}" stroke="${v.margin}" stroke-width="2"/>` +
    `<text x="${contentL}" y="54" font-family="Courier Prime" font-weight="700" font-size="12" letter-spacing="2.6" fill="${v.inkSoft}">${esc(String(meta.kicker).toUpperCase())}</text>` +
    `<text x="${contentL}" y="112" font-family="Caveat" font-weight="700" font-size="46" fill="${v.ink}">${esc(meta.title)}</text>` +
    strand + divider + statSvg + sig + footer +
    washiTape(80, -9, 104, 30, -4, 0) + washiTape(W - 190, -9, 104, 30, 3, 1) +
  `</svg>`;
}

// Rasterise the card to a PNG blob (2x for a crisp file). Rejects on any font/render
// failure so callers can surface it. Shared by the download and copy paths.
export async function renderCardPng(meta) {
  const fontCss = await fontFaceCss();
  const svg = buildCardSVG(meta, fontCss);
  const scale = 2;
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("card SVG failed to render"));
      img.src = svgUrl;
    });
    const w = img.naturalWidth || 760, h = img.naturalHeight || 430;
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);
    return await new Promise((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"));
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

// Download the keepsake as a PNG file.
export async function exportBraceletCard(meta) {
  const blob = await renderCardPng(meta);
  const dl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = dl;
  a.download = meta.filename || "bracelet.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(dl), 4000);
  return true;
}

// Copy the keepsake PNG to the clipboard. Throws if the browser can't write images
// to the clipboard (older Firefox), letting the caller fall back to a download. The
// blob is handed to ClipboardItem as a promise so the write stays inside the user
// gesture even while the fonts + raster resolve (required by Safari).
export async function copyBraceletCard(meta) {
  if (!navigator.clipboard || typeof window.ClipboardItem !== "function") {
    throw new Error("clipboard image write unsupported");
  }
  const item = new window.ClipboardItem({ "image/png": renderCardPng(meta) });
  await navigator.clipboard.write([item]);
  return true;
}
