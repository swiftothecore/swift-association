// Pure start-button contents, shared by the launchpad and both Mastery preview pickers.
// Decorative layers never own the label, take pointer input, or enter the accessible name.
import { CTA_LABELS, CTA_MARKS } from "./config.js";
import { escapeHtml } from "./util.js";

const rain = (count, offset) => Array.from({ length: count }, (_, i) => {
  const x = (i * 37 + offset) % 101;
  return `<i class="cta-drop" style="left:${x}%;--drop-y:${(i * 17) % 57}px;--drop-h:${5 + i % 5 * 2}px;--drop-delay:${(i % 7) * 0.075}s;--drop-duration:${0.42 + i % 4 * 0.075}s"></i>`;
}).join("");
const bolt = `<svg class="cta-lightning" viewBox="0 0 48 60" aria-hidden="true"><path class="cta-bolt-halo" d="M28 -2L24 9L28 15L20 23L24 29L16 39L19 44L10 60M24 29L33 33L35 40L43 44M24 9L15 15L12 22"/><path class="cta-bolt-core" d="M28 -2L24 9L28 15L20 23L24 29L16 39L19 44L10 60"/><path class="cta-bolt-branch" d="M24 29L33 33L35 40L43 44M24 9L15 15L12 22"/></svg>`;
const flower = (x, i) => `<g class="cta-flower" style="--flower-delay:${i * 0.07}s"><path d="M${x} 31V12" fill="none" stroke="#47683b" stroke-width="1.3"/><g transform="translate(${x} 11)" fill="#faf0cc" stroke="#785e32" stroke-width=".5"><ellipse rx="2" ry="4"/><ellipse rx="2" ry="4" transform="rotate(60)"/><ellipse rx="2" ry="4" transform="rotate(120)"/><circle r="1.7" fill="#d4a63e"/></g></g>`;
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
