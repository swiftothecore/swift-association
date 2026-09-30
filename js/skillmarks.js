/* The five skill marks: travel things, each carved out of a hand-cut linocut block printed in
   the skill's own ink.

   Mastery is a passport, so every skill is something you'd pack: a compass (Instinct, you
   know which way), a paper plane (Quick Pen, a note thrown fast), a sealed letter (By Heart,
   words you keep), a train with every carriage coupled (The Long Game, an unbroken run) and
   a suitcase covered in stickers (Discography, every era you've been to).

   Pure and state-free. Three surfaces print these: the stamp cards on the Mastery page, the
   skills half of the results recap, and the level-up toast. Each one says what the block is
   printed ON by setting two custom properties on an ancestor, because the carving is not
   transparent, it is a second ink the colour of the surface:
     --skm-ink  the block (the skill's ink)
     --skm-cut  what shows through the carving (the paper, or a card's own stock)
   The drawings use four classes, in a 24-unit box: .f solid, .st a solid pen stroke (weight
   set per stroke, never in CSS), .h and .hs cut back through to the block. So inside the
   block the roles swap: the drawing is printed in --skm-cut and its cuts in --skm-ink.

   The block's texture is the stampInk filters in index.html, the same speckle and warp the
   passport's stamps are pressed with, so the marks and the stamps read as one set of prints.
   Tilt and filter are fixed per skill, never random: a block that re-rolls on every render
   would shuffle in front of the player each time the page redraws. */

export const SKILL_MARKS = {
  resolve: `<path class="st" stroke-width="1.7" d="M10.3 4.1 C10.2 2.2 13.8 2.2 13.7 4.1"/><circle class="st" stroke-width="2.4" cx="12" cy="13.1" r="8.5"/><path class="st" stroke-width="1.15" d="M12 6.1 V7.2 M19 13.1 H17.9 M12 20.1 V19 M5 13.1 H6.1"/><g transform="rotate(38 12 13.1)"><path class="f" d="M12 6.3 L14.4 13.1 H9.6 Z"/><path class="st" stroke-width="1.3" d="M9.6 13.1 L12 19.9 L14.4 13.1"/></g><circle class="h" cx="12" cy="13.1" r="1"/>`,
  tempo: `<path class="f" d="M22 2.4 L2.2 10.4 L9.8 13.4 Z"/><path class="f" d="M22 2.4 L9.8 13.4 L12.9 21.2 Z"/><path class="hs" stroke-width="1.35" d="M21.3 3.1 L9.8 13.4"/><path class="st" stroke-width="1.5" d="M2 15.4 L5.6 13.9 M2.8 19.6 L7.2 17.2 M6.8 22.6 L9.5 20.7"/>`,
  lyricist: `<rect class="f" x="2" y="5.6" width="20" height="14" rx="1.5"/><path class="hs" stroke-width="1.4" d="M3 6.6 L12 13.4 L21 6.6"/><path class="hs" stroke-width="1" d="M3.2 18.7 L9 12.6 M20.8 18.7 L15 12.6"/><circle class="f" cx="12" cy="13.4" r="3.7" stroke="var(--hole)" stroke-width="1.4" paint-order="stroke"/><path class="h" d="M12 15.6 C10.5 14.6 9.8 13.9 9.8 12.9 C9.8 12.2 10.3 11.7 10.95 11.7 C11.4 11.7 11.8 11.9 12 12.3 C12.2 11.9 12.6 11.7 13.05 11.7 C13.7 11.7 14.2 12.2 14.2 12.9 C14.2 13.9 13.5 14.6 12 15.6 Z"/>`,
  endurance: `<path class="st" stroke-width="1.3" d="M.6 20.6 H23.4"/><rect class="f" x=".7" y="10" width="6.3" height="6.9" rx="1"/><rect class="h" x="1.9" y="11.4" width="1.6" height="2" rx=".3"/><rect class="h" x="4.3" y="11.4" width="1.6" height="2" rx=".3"/><path class="st" stroke-width="1.2" d="M7 15.2 H8.2"/><rect class="f" x="8.2" y="10" width="6.3" height="6.9" rx="1"/><rect class="h" x="9.4" y="11.4" width="1.6" height="2" rx=".3"/><rect class="h" x="11.8" y="11.4" width="1.6" height="2" rx=".3"/><path class="st" stroke-width="1.2" d="M14.5 15.2 H15.5"/><path class="f" d="M15.5 8 H19.3 V11 H22.4 C23 11 23.4 11.4 23.4 12 V16.9 H15.5 Z"/><rect class="f" x="20.5" y="7.8" width="1.7" height="3.4"/><rect class="h" x="16.5" y="9.2" width="1.8" height="2.1" rx=".3"/><g class="f" stroke="var(--hole)" stroke-width="1" paint-order="stroke"><circle cx="2.4" cy="18.4" r="1.5"/><circle cx="5.3" cy="18.4" r="1.5"/><circle cx="9.9" cy="18.4" r="1.5"/><circle cx="12.8" cy="18.4" r="1.5"/><circle cx="17.2" cy="18.4" r="1.5"/><circle cx="21.4" cy="18.4" r="1.5"/></g><circle class="st" stroke-width="1.2" cx="21.6" cy="4.8" r="1.3"/><circle class="st" stroke-width="1.1" cx="19.2" cy="2.8" r=".95"/>`,
  range: `<path class="st" stroke-width="1.9" d="M9 7.4 V5.4 C9 4.5 9.6 3.9 10.5 3.9 H13.5 C14.4 3.9 15 4.5 15 5.4 V7.4"/><rect class="f" x="2" y="7.2" width="20" height="14" rx="2.2"/><circle class="h" cx="7.1" cy="12.5" r="3"/><circle class="f" cx="7.1" cy="12.5" r="1.1"/><rect class="h" x="13.1" y="9.3" width="5.8" height="4.1" rx=".6" transform="rotate(-10 16 11.35)"/><path class="h" d="M13 15.5 l.95 1.95 2.1 .3 -1.5 1.45 .35 2.05 -1.9 -1 -1.9 1 .35 -2.05 -1.5 -1.45 2.1 -.3 Z"/><path class="st" stroke-width="1.4" d="M5.2 21.4 V22.6 M18.8 21.4 V22.6"/>`,
};

// the hand-cut block: no edge ruled straight, and gouge marks left in two corners
const BLOCK = "M-15.5 -18.2 C-6 -18.8 6 -18.4 15.8 -17.6 C17.9 -17.4 18.6 -16 18.4 -14 C18.9 -5 18.7 5 18 15.6 C17.8 17.8 16.4 18.6 14.2 18.4 C5 18.9 -6 18.8 -15.4 18.2 C-17.6 18 -18.4 16.8 -18.2 14.8 C-18.8 5 -18.6 -6 -18 -15.4 C-17.8 -17.4 -17 -18.1 -15.5 -18.2 Z";
const GOUGE = "M-15.2 -12.6 C-13.4 -14.2 -11.3 -15 -9 -15.3 M-15.6 -8.8 C-14.2 -10 -12.8 -10.7 -11.3 -11 M8.8 15.5 C11.2 15.1 13.4 14.2 15.2 12.6 M11.6 11.6 C13.1 11.1 14.4 10.3 15.5 9.2";
const TILT = { resolve: -2.2, tempo: 1.6, lyricist: -1.1, endurance: 2.4, range: -.6 };
const PRESS = { resolve: 0, tempo: 1, lyricist: 2, endurance: 1, range: 0 };

/* One skill's block. `cls` adds classes to the svg; its size comes from the surface's CSS. */
export function skillMarkHTML(id, cls = "") {
  const art = SKILL_MARKS[id];
  if (!art) return "";
  return `<svg class="skm${cls ? " " + cls : ""}" viewBox="-21 -21 42 42" aria-hidden="true" focusable="false">` +
    `<g filter="url(#stampInk${PRESS[id]})" transform="rotate(${TILT[id]})">` +
    `<path class="skm-block" d="${BLOCK}"/><path class="skm-gouge" d="${GOUGE}"/>` +
    `<g class="skm-cut" transform="translate(-12.5 -11.9) scale(1.0417)">${art}</g></g></svg>`;
}
