// Shared start-button contents and opt-in hover behaviour for the launchpad and Mastery pickers.
// Decorative layers never own the label, take pointer input, or enter the accessible name.
import { CTA_LABELS, CTA_MARKS } from "./config.js";
import { escapeHtml } from "./util.js";

// mulberry32: fixed draws from load to load, so hand-scattered art never re-deals on reload,
// without the lockstep patterns an index formula leaves between one property and the next.
const seededRandom = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// Rain in two depths, laid out from the seeded generator rather than index arithmetic, so no
// run of drops repeats a spacing, start height or pace.
const rain = (count, seed) => {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, () => `<i class="cta-drop" style="left:${(rand() * 100).toFixed(1)}%;` +
    `--drop-y:${Math.round(rand() * 56)}px;--drop-h:${(6 + rand() * 9).toFixed(1)}px;` +
    `--drop-delay:${(rand() * .5).toFixed(2)}s;--drop-duration:${(.42 + rand() * .24).toFixed(2)}s"></i>`).join("");
};
// Fair-weather clouds, each its own shape and none repeated, kept to the top edge (some cut
// off by it, as clouds are by a window frame) and two small ones low at the corners, so the
// label's band stays clear sky. The strip is cropped, never stretched. [x, y, width, opacity]
const cloudPuff = (x, y, w, rand) => {
  // Bumps sit ON a flat base at y and rise from it, the middle one tallest.
  const n = 3 + Math.floor(rand() * 2), step = w / (n + 1), mid = (n - 1) / 2;
  const bumps = Array.from({ length: n }, (_, i) => {
    const r = step * (.62 + rand() * .3) * (Math.abs(i - mid) < 1 ? 1.25 : 1);
    return `<circle cx="${(x + step * (i + 1)).toFixed(1)}" cy="${(y - r * .85).toFixed(1)}" r="${r.toFixed(1)}"/>`;
  }).join("");
  return `${bumps}<rect x="${(x + step * .35).toFixed(1)}" y="${(y - step * .75).toFixed(1)}" width="${(w - step * .7).toFixed(1)}" height="${(step * .75).toFixed(1)}" rx="${(step * .37).toFixed(1)}"/>`;
};
const DAY_CLOUDS = [[8, 15, 46, .85], [118, 12, 30, .55], [206, 16, 58, .8], [318, 12.5, 34, .6], [402, 16, 52, .82], [500, 11, 28, .5], [548, 15, 44, .78], [70, 60, 26, .45], [476, 61, 30, .5]];
const dayClouds = (() => {
  const rand = seededRandom(1989);
  return `<svg class="cta-day-clouds" viewBox="0 0 600 60" preserveAspectRatio="xMidYMid slice">${DAY_CLOUDS.map(([x, y, w, o]) => `<g opacity="${o}">${cloudPuff(x, y, w, rand)}</g>`).join("")}</svg>`;
})();
// The storm front is its own bank, heavier and lower than the fair-weather clouds and never
// the same shapes darkened: a pale back row of billows under a dark front row, drawn along
// the top so it rolls in over the sky rather than being a grey copy of it.
const stormBank = (() => {
  // Each row is ragged in height as well as spacing, so the underside of the storm is torn
  // rather than a scalloped valance.
  const rand = seededRandom(2012), row = (y, spread, rMin, rMax, gapMin, gapMax, cls) => {
    let out = "";
    for (let x = -30 + rand() * 20; x < 640; x += gapMin + rand() * (gapMax - gapMin)) out += `<circle cx="${x.toFixed(1)}" cy="${(y + rand() * spread).toFixed(1)}" r="${(rMin + rand() * (rMax - rMin)).toFixed(1)}"/>`;
    return `<g class="${cls}">${out}</g>`;
  };
  return `<svg class="cta-storm-clouds" viewBox="0 0 600 40" preserveAspectRatio="xMidYMin slice">${row(6, 14, 10, 24, 14, 34, "cta-storm-back")}${row(-4, 12, 8, 20, 12, 30, "cta-storm-front")}</svg>`;
})();
const bolt = `<svg class="cta-lightning" viewBox="0 0 48 60" aria-hidden="true"><path class="cta-bolt-halo" d="M28 -2L24 9L28 15L20 23L24 29L16 39L19 44L10 60M24 29L33 33L35 40L43 44M24 9L15 15L12 22"/><path class="cta-bolt-core" d="M28 -2L24 9L28 15L20 23L24 29L16 39L19 44L10 60"/><path class="cta-bolt-branch" d="M24 29L33 33L35 40L43 44M24 9L15 15L12 22"/></svg>`;
const FLOWER_COLOURS = ["#fff1c7", "#f3a48e", "#e99abd", "#b9a0de", "#95c9e3", "#edc45f", "#d8788d", "#d9c8ef"];
const FLOWER_HEADS = [
  // Daisy, tulip and poppy, sized to stay readable in the little Mastery swatches.
  `<ellipse rx="1.6" ry="4.5"/><ellipse rx="1.6" ry="4.5" transform="rotate(60)"/><ellipse rx="1.6" ry="4.5" transform="rotate(120)"/><circle r="1.6" fill="#d4a63e"/>`,
  `<path d="M-4 -4L-1 -1L0 -5L2 -1L4 -4Q5 4 0 4Q-5 4 -4 -4Z"/><path d="M0 3L0 -1" fill="none"/>`,
  `<path d="M0 -3C-5 -7 -7 0 -3 2C-4 7 3 7 3 3C8 2 5 -5 0 -3Z"/><circle r="1.5" fill="#65504c"/>`,
];
// Each flower is its own little drawing at its real size, placed by percentage, so no button
// width can stretch a head out of shape. The spots are deliberately uneven and reach into the
// middle, but only the outer flowers stand tall: on a phone the label wraps across nearly the
// whole face, so everything inward of the edges stays low in the grass to pass under it.
// [left %, head height, head scale, head kind]. The breeze delay follows the left edge, so the wind crosses the strip.
const MEADOW_FLOWERS = [[3, 17, 1.35, 0], [10.5, 12, 1.2, 2], [24, 8, 1.05, 1], [41, 7, 1, 0], [60, 7.5, 1, 2], [79, 8, 1.05, 1], [93.5, 12.5, 1.3, 0]];
const flower = ([left, h, scale, kind], i) => `<svg class="cta-flower" viewBox="-9 -27 18 27" style="left:calc(${left}% - 9px);--flower-delay:${(i * 0.07).toFixed(2)}s;--wind-delay:${(left / 100 * 0.6).toFixed(2)}s;--flower-colour:${FLOWER_COLOURS[i]}"><g class="cta-flower-sway"><path d="M0 0C${i % 2 ? 1 : -1} ${-h / 2} 0 ${-h * .7} 0 ${-h}M0 ${-h * .35}q${i % 2 ? 4 : -4} -1 ${i % 2 ? 4 : -4} -4" class="cta-flower-stem"/><g class="cta-petals" transform="translate(0 ${-h}) scale(${scale})" stroke="#785e32" stroke-width=".5">${FLOWER_HEADS[kind]}</g></g></svg>`;
// A 600-unit strip drawn at 1:1 and cropped from the middle, never stretched. Blades scatter
// in height, lean, curl, weight and spacing, in two greens for depth, and cluster into tufts;
// each carries a delay from its position so the breeze travels across instead of the whole
// strip shearing at once.
const grassBlades = (() => {
  const rand = seededRandom(1310), blades = [];
  for (let x = 1; x < 600;) {
    const tuft = 1 + Math.floor(rand() * 4);
    for (let t = 0; t < tuft; t++) {
      const bx = x + t * (1.2 + rand() * 2.2), h = 6 + rand() * 12, lean = rand() * 7 - 3, curl = rand() * 6 - 3;
      blades.push(`<path class="cta-blade${rand() < .35 ? " cta-blade--back" : ""}" style="--wind-delay:${(bx / 600 * 0.6).toFixed(2)}s;stroke-width:${(1 + rand() * .8).toFixed(2)}" d="M${bx.toFixed(1)} 31q${curl.toFixed(1)} ${(-h * .55).toFixed(1)} ${lean.toFixed(1)} ${(-h).toFixed(1)}"/>`);
    }
    x += 5 + rand() * 9;
  }
  return blades.join("");
})();
const garden = `<svg class="cta-garden" viewBox="0 0 600 30" preserveAspectRatio="xMidYMax slice">${grassBlades}</svg>${MEADOW_FLOWERS.map(flower).join("")}`;
// The drift is drawn once at its real size and cropped, never stretched, so a phone button
// shows a narrower stretch of the same sill instead of the whole drift squeezed into steep
// lumps. Its humps are deliberately uneven. The flakes fall inside a layer that stops at the
// drift's lowest trough and draw behind the drift, so they land in the snow, not through it.
// Every flake gets its own size, sway and start, so the first second is not a row of dots.
const SNOW_DRIFT = "M0 12.8C22 10.4 41 16.4 66 14S112 6.8 146 9.2S190 16.4 228 15.2S268 8 298 9.2S344 16.4 376 14S424 5.6 458 8S512 15.2 544 14S584 8 600 10.4V22H0Z";
const snowflakes = Array.from({ length: 26 }, (_, i) => {
  const next = seededRandom(1213 + i * 97), draws = Array.from({ length: 6 }, next);
  const r = (n) => draws[n - 1];
  return `<i class="cta-snowflake" style="left:${(r(1) * 98 + 1).toFixed(1)}%;--snow-size:${(1.6 + r(2) * 2.4).toFixed(1)}px;` +
    `--snow-time:${(2.3 + r(3) * 1.9).toFixed(2)}s;--snow-delay:${(r(4) * 2.2).toFixed(2)}s;` +
    `--sway-a:${(r(5) * 16 - 7).toFixed(1)}px;--sway-b:${(r(6) * 12 - 6).toFixed(1)}px"></i>`;
}).join("");
const snow = `<span class="cta-snowfall">${snowflakes}</span><svg class="cta-snowdrift" viewBox="0 0 600 22" preserveAspectRatio="xMidYMax slice"><path class="cta-drift" d="${SNOW_DRIFT}"/><path class="cta-drift-shade" d="M0 19.4C40 18.2 76 20 118 18.8S196 18.3 240 19.5S330 20 372 18.8S468 18.3 512 19.5S578 19.5 600 18.8"/></svg>`;
// Two separately drawn vines, never one vine flipped: each is rooted in its own bottom corner
// (the stem's first point, which is also its hover pivot) and the right one is shorter and
// sparser, so the pair reads as grown rather than printed. Leaves are [x, y, rotate, scale].
const IVY_VINES = {
  left: { w: 110, h: 74, root: [4, 68],
    stem: "M4 68C30 54 9 31 31 15S75 20 104 3M26 24Q52 27 66 44M34 14Q48 3 72 4",
    leaves: [[10,57,-35,1],[20,43,30,1],[19,28,-50,1],[32,16,25,1],[45,13,-25,1],[62,16,35,1],[80,11,-35,1],[97,5,40,1],[46,29,-20,1],[61,40,20,1],[60,4,-30,1]] },
  right: { w: 96, h: 70, root: [92, 64],
    stem: "M92 64C68 59 87 40 67 27S38 23 13 10M71 33Q55 37 49 50M57 24Q50 12 33 12",
    leaves: [[86,55,40,1.05],[77,44,-20,.9],[81,31,55,1],[66,24,-15,1.1],[51,20,30,.95],[36,17,-30,.9],[21,12,20,.85],[53,41,-25,1],[47,49,15,.8],[35,11,-45,.9]] },
};
const IVY_GREENS = ["#45643d", "#63834c", "#78905a"];
const ivyVine = (side) => {
  const { w, h, root, stem, leaves } = IVY_VINES[side];
  const shade = side === "left" ? 0 : 1;
  return `<svg class="cta-ivy cta-ivy--${side}" viewBox="0 0 ${w} ${h}" style="aspect-ratio:${w}/${h}"><g class="cta-ivy-stem" style="transform-origin:${root[0]}px ${root[1]}px"><path d="${stem}" fill="none" stroke="#425332" stroke-width="2"/>${leaves.map(([x, y, r, s], i) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g class="cta-ivy-leaf" style="--ivy-delay:${(i * .037).toFixed(3)}s;--ivy-turn:${-7 - (i + shade) % 3 * 4}deg"><path d="M0 10C-3 5 -10 4 -9 -2L-5 -1L-3 -9L1 -6L6 -10L7 -3L12 -1C10 6 4 5 0 10Z" fill="${IVY_GREENS[(i + shade) % 3]}" stroke="#344d31" stroke-width=".65"/><path d="M0 9L1 -5M0 4L-5 0M0 3L7 -1" fill="none" stroke="#b5c38a" stroke-width=".6" opacity=".7"/></g></g>`).join("")}</g></svg>`;
};
const ivy = ivyVine("left") + ivyVine("right");
const FINISH_ART = {
  "": `<i class="cta-stroke"></i>`,
  ink: `<i class="cta-pool"></i>`,
  rose: `<i class="cta-bloom"></i>`,
  sky: `${dayClouds}${stormBank}<span class="cta-rain cta-rain--far">${rain(18, 1311)}</span><span class="cta-rain">${rain(24, 1989)}</span>${bolt}`,
  meadow: garden,
  snow,
  ivy,
  pride: `<i class="cta-ribbon"></i>`,
};

export function ctaContentHTML(labelId = "", finish = "") {
  const opt = labelId ? CTA_LABELS[labelId] : null;
  const mark = opt?.mark ? `<span class="cta-mark" aria-hidden="true">${CTA_MARKS[opt.mark] || ""}</span>` : "";
  const art = FINISH_ART[finish.startsWith("pride-") ? "pride" : finish] ?? FINISH_ART[""];
  return `<span class="cta-fx" aria-hidden="true">${art}</span><span class="cta-label">${mark}${opt ? escapeHtml(opt.text) : "Start writing"}</span>`;
}


// Lightning strikes only in the clear sky either side of the lettering, never through it: a
// white bolt behind cream text blinds the label at the one moment the player is looking. The
// label is measured as it sits (the ✎ is a pseudo-element outside .cta-label, so its width is
// added by hand), and the bolt narrows to fit a thin gutter. When neither side has room for
// even a narrow bolt, as with a long label on a phone, the storm simply comes without one.
// Each strike also lands well away from the last.
const BOLT_W = 43, BOLT_MIN_W = 22, BOLT_PAD = 8, PENCIL_W = 28;
function placeStrike(cta) {
  const box = cta.getBoundingClientRect(), label = cta.querySelector(".cta-label")?.getBoundingClientRect();
  if (!label || !box.width || !cta.offsetWidth) return;
  const k = cta.offsetWidth / box.width; // undo a preview's scale: work in the button's own pixels
  const width = cta.offsetWidth;
  const left = (label.left - box.left) * k - (cta.classList.contains("cta-mk") ? 0 : PENCIL_W) - BOLT_PAD;
  const right = (label.right - box.left) * k + BOLT_PAD;
  const bolt = Math.min(BOLT_W, Math.max(left, width - right));
  if (bolt < BOLT_MIN_W) { cta.classList.add("cta-no-bolt"); return; }
  cta.classList.remove("cta-no-bolt");
  const spots = [];
  if (left >= bolt) spots.push([0, left - bolt]);
  if (width - right >= bolt) spots.push([right, width - bolt]);
  const span = spots.reduce((sum, [a, b]) => sum + b - a, 0);
  const before = parseFloat(cta.style.getPropertyValue("--cta-bolt-left"));
  let x = 0;
  for (let tries = 0; tries < 12; tries++) {
    let pick = Math.random() * span;
    for (const [a, b] of spots) { if (pick <= b - a) { x = a + pick; break; } pick -= b - a; }
    if (Number.isNaN(before) || Math.abs(x - before) >= width / 5) break;
  }
  cta.style.setProperty("--cta-bolt-left", `${x.toFixed(1)}px`);
  cta.style.setProperty("--cta-bolt-w", `${bolt.toFixed(1)}px`);
}

// Delegate to the actual clickable control, including a preview's enclosing picker row.
// Crossing a label, icon or empty patch inside it must not deal a second set of colours.
// Nothing persists: a hover changes only this rendered button's decorative CSS properties.
const boundRoots = new WeakSet();
export function initCtaInteractions(root = document) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);
  const controlFor = (target) => target instanceof Element
    ? target.closest("button.play-cta, .rb-sw-col, .rb-row") : null;
  const refresh = (control) => {
    const cta = control.matches(".play-cta") ? control : control.querySelector(".play-cta");
    if (!cta) return;
    if (cta.dataset.startbtn === "sky") placeStrike(cta); else if (cta.dataset.startbtn === "meadow") {
      // One hand of colours per hover: no two flowers share one, and none keeps its last.
      const flowers = [...cta.querySelectorAll(".cta-flower")];
      const before = flowers.map((flower) => flower.style.getPropertyValue("--flower-colour").trim());
      let deal = [];
      for (let tries = 0; tries < 30; tries++) {
        deal = [...FLOWER_COLOURS].sort(() => Math.random() - .5).slice(0, flowers.length);
        if (deal.every((colour, i) => colour !== before[i])) break;
      }
      if (deal.some((colour, i) => colour === before[i])) {
        const at = (colour) => FLOWER_COLOURS.indexOf(colour);
        deal = before.map((colour) => FLOWER_COLOURS[(at(colour) + 1) % FLOWER_COLOURS.length]);
      }
      flowers.forEach((flower, i) => flower.style.setProperty("--flower-colour", deal[i]));
    }
  };
  root.addEventListener("pointerover", (event) => {
    if (event.pointerType === "touch") return;
    const control = controlFor(event.target);
    if (control && control !== controlFor(event.relatedTarget)) refresh(control);
  });
  root.addEventListener("focusin", (event) => {
    const control = controlFor(event.target);
    // Pointer focus follows pointerover; only keyboard focus should make a second deal.
    if (control?.matches(":focus-visible")) refresh(control);
  });
}
