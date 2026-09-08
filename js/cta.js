// Shared start-button contents and opt-in hover behaviour for the launchpad and Mastery pickers.
// Decorative layers never own the label, take pointer input, or enter the accessible name.
import { CTA_LABELS, CTA_MARKS } from "./config.js";
import { escapeHtml } from "./util.js";

const rain = (count, offset) => Array.from({ length: count }, (_, i) => {
  const x = (i * 37 + offset) % 101;
  return `<i class="cta-drop" style="left:${x}%;--drop-y:${(i * 17) % 57}px;--drop-h:${5 + i % 5 * 2}px;--drop-delay:${(i % 7) * 0.075}s;--drop-duration:${0.42 + i % 4 * 0.075}s"></i>`;
}).join("");
const bolt = `<svg class="cta-lightning" viewBox="0 0 48 60" aria-hidden="true"><path class="cta-bolt-halo" d="M28 -2L24 9L28 15L20 23L24 29L16 39L19 44L10 60M24 29L33 33L35 40L43 44M24 9L15 15L12 22"/><path class="cta-bolt-core" d="M28 -2L24 9L28 15L20 23L24 29L16 39L19 44L10 60"/><path class="cta-bolt-branch" d="M24 29L33 33L35 40L43 44M24 9L15 15L12 22"/></svg>`;
const FLOWER_COLOURS = ["#fff1c7", "#f3a48e", "#e99abd", "#b9a0de", "#95c9e3", "#edc45f", "#d8788d", "#d9c8ef"];
const FLOWER_HEADS = [
  // Daisy, tulip and poppy, sized to stay readable in the little Mastery swatches.
  `<ellipse rx="1.6" ry="4.5"/><ellipse rx="1.6" ry="4.5" transform="rotate(60)"/><ellipse rx="1.6" ry="4.5" transform="rotate(120)"/><circle r="1.6" fill="#d4a63e"/>`,
  `<path d="M-4 -4L-1 -1L0 -5L2 -1L4 -4Q5 4 0 4Q-5 4 -4 -4Z"/><path d="M0 3L0 -1" fill="none"/>`,
  `<path d="M0 -3C-5 -7 -7 0 -3 2C-4 7 3 7 3 3C8 2 5 -5 0 -3Z"/><circle r="1.5" fill="#65504c"/>`,
];
const flower = (x, i) => {
  const y = [10, 14, 9][i % 3];
  return `<g class="cta-flower" style="--flower-delay:${i * 0.07}s;--flower-colour:${FLOWER_COLOURS[i]}"><path d="M${x} 31V${y + 2}M${x} 25q-4 -1 -4 -4M${x} 22q4 -1 4 -4" fill="none" stroke="#47683b" stroke-width="1.3"/><g class="cta-petals" transform="translate(${x} ${y})" stroke="#785e32" stroke-width=".5">${FLOWER_HEADS[i % FLOWER_HEADS.length]}</g></g>`;
};
const garden = `<svg class="cta-garden" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: 55 }, (_, i) => `<path class="cta-blade" d="M${i * 7.5} 30q3 -7 ${i % 2 ? -1 : 1} -${8 + i % 4 * 3}"/>`).join("")}${[22, 48, 78, 325, 354, 379].map(flower).join("")}</svg>`;
const FINISH_ART = {
  "": `<i class="cta-stroke"></i>`,
  ink: `<i class="cta-pool"></i>`,
  rose: `<i class="cta-bloom"></i>`,
  sky: `<i class="cta-storm-clouds"></i><span class="cta-rain cta-rain--far">${rain(15, 11)}</span><span class="cta-rain">${rain(19, 3)}</span>${bolt}`,
  meadow: garden,
  pride: `<i class="cta-ribbon"></i>`,
};

export function ctaContentHTML(labelId = "", finish = "") {
  const opt = labelId ? CTA_LABELS[labelId] : null;
  const mark = opt?.mark ? `<span class="cta-mark" aria-hidden="true">${CTA_MARKS[opt.mark] || ""}</span>` : "";
  const art = FINISH_ART[finish.startsWith("pride-") ? "pride" : finish] ?? FINISH_ART[""];
  return `<span class="cta-fx" aria-hidden="true">${art}</span><span class="cta-label">${mark}${opt ? escapeHtml(opt.text) : "Start writing"}</span>`;
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
    if (cta.dataset.startbtn === "sky") {
      const before = parseFloat(cta.style.getPropertyValue("--cta-bolt-x")) || 0;
      // A fresh position at least one fifth of the usable width from the last strike.
      cta.style.setProperty("--cta-bolt-x", ((before + .2 + Math.random() * .6) % 1).toFixed(4));
    } else if (cta.dataset.startbtn === "meadow") {
      cta.querySelectorAll(".cta-flower").forEach((flower) => {
        const before = flower.style.getPropertyValue("--flower-colour").trim();
        const choices = FLOWER_COLOURS.filter((colour) => colour !== before);
        flower.style.setProperty("--flower-colour", choices[Math.floor(Math.random() * choices.length)]);
      });
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
