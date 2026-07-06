// Scattered friendship beads down the desk gutters beside the notebook.
//
// The fixed desk props (js/desk in index.html + .desk-items) only occupy the
// first screenful of desk, so once you scroll a long screen (charms, stats,
// records) the wood beside the page reads as barren. This module fills that
// wood with a light, believable spill of friendship beads — the same bracelet
// beads the game is themed around.
//
// Composition rule (see the homepage design notes): curated clusters with
// seeded jitter, confined to the wood margins OUTSIDE the paper column, never
// RNG confetti sprayed across the whole desk. Beads are purely decorative,
// non-interactive (pointer-events: none) and desktop-only, matching the props.
//
// The container is document-anchored (absolute, spanning the full scroll
// height) so the beads scroll 1:1 with the wood grain, exactly like the props.
// It regenerates when the page height changes (screen navigation, list
// expansion) or the viewport resizes, so it always fills whatever is on screen.

(() => {
  "use strict";

  // Same breakpoint the props use: below this the gutters are too thin to hold
  // beads without crowding the notebook.
  const DESKTOP = window.matchMedia("(min-width: 1120px)");

  const HALF = 330;        // half the 660px paper column (centred at 50vw)
  const PAPER_GAP = 22;    // keep beads off the paper edge
  const EDGE = 16;         // keep beads off the screen edge
  const MIN_BAND = 66;     // a gutter narrower than this gets no beads
  const CLUSTER_CAP = 130; // hard ceiling on total beads, however tall the page

  // Friendship-bead palette, echoing the floss-station beads and the era
  // accents (gold / rose / denim / lavender / debut green). hi = lit face,
  // lo = shaded edge fill, edge = stroke, hole = threading-hole shadow.
  const ROUND_COLORS = [
    { hi: "#f2d78f", lo: "#c79a3e", edge: "#9c7527", hole: "#5d4318" }, // gold
    { hi: "#ecaebd", lo: "#c06880", edge: "#964962", hole: "#6e3247" }, // rose
    { hi: "#b3cbe4", lo: "#6c8cb4", edge: "#4c6b91", hole: "#324e6e" }, // denim
    { hi: "#cbbceb", lo: "#8b73c9", edge: "#6d5aa6", hole: "#453a6a" }, // lavender
    { hi: "#a9d6b6", lo: "#5a9e6e", edge: "#3f7d54", hole: "#2c5238" }, // debut green
  ];
  // Cream alphabet-disc letters: mostly letters (a few spell nothing in
  // particular, like a real spill), with the odd heart/star charm bead.
  const DISC_GLYPHS = "AEILMORSTVWYN".split("").concat(["♥", "★", "♥"]);

  let seed = 0x9e3d71b1;    // fixed default → a stable, curated-looking layout
  let densityMult = 1;      // dev knob: <1 denser, >1 sparser

  // mulberry32: tiny deterministic PRNG so the scatter is stable within a load
  // and reproduces the same top portion when the page grows taller.
  function makeRng(a) {
    let s = a >>> 0;
    return () => {
      s |= 0; s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rangeR = (r, lo, hi) => lo + r() * (hi - lo);
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  let container = null;
  let lastCount = 0;

  function ensureContainer() {
    if (container) return container;
    container = document.createElement("div");
    container.className = "desk-scatter";
    container.setAttribute("aria-hidden", "true");
    // Sit behind the notebook (.app is z-index 1); insert before it so the DOM
    // order reads props → scatter → page.
    const app = document.querySelector(".app");
    if (app && app.parentNode) app.parentNode.insertBefore(container, app);
    else document.body.appendChild(container);
    return container;
  }

  // Full document height measured from the content column, NOT from scrollHeight
  // (which would include the container itself and risk a feedback loop).
  function pageHeight() {
    const app = document.querySelector(".app");
    if (app) return app.offsetTop + app.offsetHeight + 48;
    return document.documentElement.scrollHeight;
  }

  function makeBead(r, x, y) {
    const el = document.createElement("div");
    const size = Math.round(rangeR(r, 16, 24));
    const rot = Math.round(rangeR(r, -40, 40));
    el.style.left = x.toFixed(1) + "px";
    el.style.top = y.toFixed(1) + "px";
    el.style.setProperty("--sz", size + "px");
    el.style.setProperty("--rot", rot + "deg");
    // ~45% cream alphabet discs, ~55% coloured rounds
    if (r() < 0.45) {
      el.className = "bead-scatter disc";
      const g = DISC_GLYPHS[(r() * DISC_GLYPHS.length) | 0];
      const span = document.createElement("span");
      span.textContent = g;
      el.appendChild(span);
    } else {
      el.className = "bead-scatter round";
      const c = ROUND_COLORS[(r() * ROUND_COLORS.length) | 0];
      el.style.setProperty("--hi", c.hi);
      el.style.setProperty("--lo", c.lo);
      el.style.setProperty("--edge", c.edge);
      el.style.setProperty("--hole", c.hole);
    }
    return el;
  }

  // A small pool of beads around a centre, with jitter so no two clusters match
  // but each still reads as an arranged little spill rather than scattered noise.
  function placeCluster(frag, r, band, y) {
    const bw = band[1] - band[0];
    // centre biased toward the middle of the gutter (avg of two uniforms ≈
    // triangular), so beads hug neither the screen edge nor the paper.
    const t = (r() + r()) / 2;
    const cx = band[0] + 18 + t * (bw - 36);
    // 1–4 beads, weighted toward 2–3
    const roll = r();
    const n = roll < 0.15 ? 1 : roll < 0.55 ? 2 : roll < 0.85 ? 3 : 4;
    const spread = 13 + r() * 16;
    let placed = 0;
    for (let i = 0; i < n; i++) {
      const ang = r() * Math.PI * 2;
      const dist = i === 0 ? 0 : (0.4 + r() * 0.9) * spread;
      const bx = clamp(cx + Math.cos(ang) * dist, band[0] + 8, band[1] - 8);
      const by = y + Math.sin(ang) * dist * 0.7;
      frag.appendChild(makeBead(r, bx, by));
      placed++;
    }
    return placed;
  }

  function rebuild() {
    const el = ensureContainer();
    if (!DESKTOP.matches) { el.replaceChildren(); el.style.height = "0px"; lastCount = 0; return; }

    const W = window.innerWidth;
    const H = pageHeight();
    el.style.height = H + "px";

    const cx = W / 2;
    const leftBand = [EDGE, cx - HALF - PAPER_GAP];
    const rightBand = [cx + HALF + PAPER_GAP, W - EDGE];

    const r = makeRng(seed);
    const frag = document.createDocumentFragment();
    let count = 0;

    // Start below the first screenful so we never collide with the fixed props.
    let y = window.innerHeight * 0.98 + rangeR(r, 30, 150);
    let side = r() < 0.5 ? 0 : 1;
    const gapLo = 300 * densityMult;
    const gapHi = 540 * densityMult;

    while (y < H - 80 && count < CLUSTER_CAP) {
      const band = side ? rightBand : leftBand;
      if (band[1] - band[0] > MIN_BAND) count += placeCluster(frag, r, band, y);
      y += rangeR(r, gapLo, gapHi);
      // strictly alternate gutters so both margins stay evenly populated (both
      // are visible at once on a wide screen); the jitter within each cluster
      // keeps it from looking metronomic
      side = 1 - side;
    }

    el.replaceChildren(frag);
    lastCount = count;
  }

  // ---- lifecycle: rebuild on load, resize, and any content-height change -----
  // Debounced with a plain timeout (not rAF, which pauses in throttled/hidden
  // tabs) so bursts during screen navigation coalesce into one rebuild.
  let debounce = 0;
  function schedule() {
    clearTimeout(debounce);
    debounce = setTimeout(rebuild, 90);
  }

  function start() {
    ensureContainer();
    rebuild();
    window.addEventListener("resize", schedule);
    // The game fires this on every screen change (see showScreen in app.js), the
    // most common page-height change.
    window.addEventListener("deskscatter:refresh", schedule);
    // List growth within a screen (expanding sections, etc.) has no event; watch
    // the content column. Our own mutations only touch the sibling container, so
    // this can't loop.
    const app = document.querySelector(".app");
    if (app && "ResizeObserver" in window) {
      new ResizeObserver(schedule).observe(app);
    }
    if (DESKTOP.addEventListener) DESKTOP.addEventListener("change", schedule);
    else if (DESKTOP.addListener) DESKTOP.addListener(schedule);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  // Dev handle (read by buildDevApi → the ?dev panel). Purely cosmetic controls.
  window.__deskScatter = {
    rebuild,
    reseed: (n) => { seed = (n == null ? (Math.random() * 0xffffffff) : n) >>> 0; rebuild(); return seed; },
    density: (m) => { densityMult = Math.max(0.3, Math.min(3, +m || 1)); rebuild(); return densityMult; },
    count: () => lastCount,
  };
})();
