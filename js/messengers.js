// The messenger flock — the six little carriers that fly the daily result off the
// page when the share stub is torn away (see renderShareButton in js/app.js).
//
// Why these six and not platform logos: the button hands the result to the OS share
// sheet or the clipboard, and nothing else. It cannot post to anything. A row of
// social glyphs would promise a destination we never touch, so the flock is drawn
// from the things that have actually carried a message: a folded plane, a carrier
// pigeon, a bottle, a stamp, a tin-can phone, an airmail envelope. The bottle is
// already an egg in this game (see js/app.js surfaceBottle), so the family holds.
//
// Drawing rules, the same ones the desk props follow (js/deskprops.js):
//   - real objects, lit from the upper left, with a shaded side and a warm palette
//     taken from the paper. Nothing here is flat line-art.
//   - each entry is the INNER markup of its own viewBox; the launcher wraps it,
//     sizes it and flies it, so nothing below sets position, transform or filter.
//   - they read at ~34px on the wing, so every detail has to survive that. Detail
//     that only works at 300px is noise here and has been left out.
//
// The flock exists for about a second and a half, once, on a deliberate press. It
// never idles on the results page: a permanent drift would turn a page that is
// already budgeted to one screen into an aquarium.

// A perforated stamp edge, built rather than hand-drawn so the teeth stay even.
// Walks the rectangle punching `n` half-circle bites out of each side; the arcs
// sweep INTO the stamp, which is what makes the tooth silhouette read.
function perfPath(w, h, teethX, teethY, r) {
  const seg = [];
  const stepX = (w - r * 2) / teethX;
  const stepY = (h - r * 2) / teethY;
  seg.push(`M${r} ${r}`);
  for (let i = 0; i < teethX; i++) {
    seg.push(`l${(stepX - r * 2) / 2} 0`, `a${r} ${r} 0 0 0 ${r * 2} 0`, `l${(stepX - r * 2) / 2} 0`);
  }
  for (let i = 0; i < teethY; i++) {
    seg.push(`l0 ${(stepY - r * 2) / 2}`, `a${r} ${r} 0 0 0 0 ${r * 2}`, `l0 ${(stepY - r * 2) / 2}`);
  }
  for (let i = 0; i < teethX; i++) {
    seg.push(`l${-(stepX - r * 2) / 2} 0`, `a${r} ${r} 0 0 0 ${-r * 2} 0`, `l${-(stepX - r * 2) / 2} 0`);
  }
  for (let i = 0; i < teethY; i++) {
    seg.push(`l0 ${-(stepY - r * 2) / 2}`, `a${r} ${r} 0 0 0 0 ${-r * 2}`, `l0 ${-(stepY - r * 2) / 2}`);
  }
  return seg.join(" ") + " Z";
}

// Shared ink. One outline colour across the flock keeps six separately drawn
// objects looking like one set rather than six clip-arts.
const INK = "#2b2722";

export const MESSENGERS = [
  {
    // A folded dart, seen from behind and slightly above. Three surfaces, not two:
    // the far wing, the near wing, and the KEEL between them. Drawing the keel as
    // its own narrow face is what gives the fold a thickness — with a single hard
    // line down the middle it flattens into a paper aeroplane-shaped triangle.
    // Trailing edges bow inward, because folded paper never holds a straight line.
    id: "plane", w: 124, h: 88,
    svg: `
      <path d="M116 18 L60 68 Q34 74 12 79 Q5 80 10 74 Z" fill="#ded2b6" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M116 18 Q54 36 8 51 Q3 53 8 56 L60 68 Z" fill="#fdfaf1" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M116 18 L60 68" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M60 68 Q40 66 22 62" fill="none" stroke="#c3b79b" stroke-width="1.2"/>
      <path d="M88 33 Q52 44 20 54" fill="none" stroke="#e4dac2" stroke-width="1.2"/>
      <path d="M110 21 Q86 30 70 37" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.9"/>`,
  },
  {
    // A carrier pigeon mid-beat, with a rolled note banded to its leg in red thread
    // — the detail that makes it a messenger and not a bird. Everything here serves
    // the 34px silhouette: ONE big raised wing well clear of the back, a fanned
    // tail, a head that sits proud of the shoulder. The earlier draft kept the wing
    // tucked against the body and the whole bird read as a blob with ears.
    // The neck carries the iridescent patch pigeons actually have, in the
    // notebook's own lavender, so it never looks like a stock dove.
    id: "pigeon", w: 138, h: 100,
    svg: `
      <path d="M40 56 q-20 5 -33 18 q-3 3 2 4 q22 0 37 -12 Z" fill="#dbd2bd" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M12 74 q19 -1 32 -11 M15 78 q18 -1 30 -11" fill="none" stroke="#b6ab90" stroke-width="1"/>
      <path d="M36 56 q1 -19 23 -26 q23 -8 42 0 q15 6 12 19 q-4 16 -30 20 q-33 5 -47 -13 Z" fill="#f4eee0" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="M56 68 q26 5 42 -8 q7 -6 5 -14 q9 11 0 21 q-15 12 -47 1 Z" fill="#dcd2ba" opacity="0.7"/>
      <path d="M92 34 q13 -5 19 3 q5 6 1 13 q-6 -11 -21 -8 Z" fill="#b79ada" opacity="0.55"/>
      <path d="M94 38 q-7 -15 6 -23 q15 -9 25 2 q7 9 -2 16 q-10 8 -23 5 Z" fill="#f8f3e6" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M122 30 l13 4 -12 6 Z" fill="#c9a06a" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>
      <circle cx="114" cy="27" r="2.4" fill="${INK}"/>
      <circle cx="114.9" cy="26" r="0.8" fill="#fffdf6"/>
      <path d="M56 44 q-9 -30 12 -42 q18 12 23 30 q3 9 -3 13 q-6 4 -12 -1 q-4 7 -11 6 q-7 -1 -9 -6 Z" fill="#e9e0cb" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M66 43 q-6 -23 3 -37 M77 45 q-5 -20 2 -31" fill="none" stroke="#b9ae93" stroke-width="1.2"/>
      <path d="M70 74 l-3 9 M83 72 l-1 9" fill="none" stroke="#b8676b" stroke-width="1.8" stroke-linecap="round"/>
      <g transform="rotate(10 76 88)">
        <rect x="66" y="81" width="20" height="13" rx="3" fill="#fbf7ec" stroke="${INK}" stroke-width="1.4"/>
        <path d="M70 81 v13 M82 81 v13" fill="none" stroke="#cabfa4" stroke-width="1"/>
        <path d="M76 79 v17" fill="none" stroke="#a8322e" stroke-width="1.8"/>
      </g>`,
  },
  {
    // The bottle from the egg, corked and sealed, with the note rolled inside. The
    // glass is two tints and one specular streak: any more and it stops being glass
    // and starts being a green bottle-shaped sticker.
    id: "bottle", w: 62, h: 118,
    svg: `
      <path d="M23 16 h16 v12 q13 9 13 22 v52 a10 10 0 0 1 -10 10 h-22 a10 10 0 0 1 -10 -10 v-52 q0 -13 13 -22 Z"
            fill="#cfe0d2" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="M31 28 q13 9 13 22 v52 a10 10 0 0 1 -10 10 h-3 Z" fill="#a9c6b4" opacity="0.55"/>
      <path d="M20 42 q-4 8 -4 20 v30" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.55" stroke-linecap="round"/>
      <path d="M15 92 q16 6 32 0 v10 a10 10 0 0 1 -10 10 h-12 a10 10 0 0 1 -10 -10 Z" fill="#8fb39c" opacity="0.5"/>
      <rect x="21" y="52" width="20" height="34" rx="4" fill="#f6efdd" stroke="#9c9077" stroke-width="1.2"/>
      <path d="M25 58 h12 M25 66 h12 M25 74 h8" fill="none" stroke="#c0b393" stroke-width="1.3"/>
      <path d="M21 60 q4 3 0 6 M41 74 q-4 3 0 6" fill="none" stroke="#9c9077" stroke-width="1"/>
      <path d="M25 68 h12" fill="none" stroke="#a8322e" stroke-width="1.6" opacity="0.8"/>
      <rect x="22" y="4" width="18" height="16" rx="2.5" fill="#c39a63" stroke="${INK}" stroke-width="1.5"/>
      <path d="M26 6 v13 M33 5 v14" fill="none" stroke="#a67f4c" stroke-width="1.1"/>`,
  },
  {
    // A postage stamp, part-cancelled: perforated edge built by perfPath, a printed
    // vignette in the era's own accent, a thirteen for the denomination, and two
    // strokes of the postmark running off the corner.
    id: "stamp", w: 86, h: 98,
    svg: `
      <path d="${perfPath(80, 92, 6, 7, 3.4)}" transform="translate(3,3)" fill="#fbf7ec" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>
      <rect x="13" y="13" width="60" height="61" fill="#ece4ee" stroke="#6d5aa6" stroke-width="1.3"/>
      <g stroke="#c3b2dd" stroke-width="1">
        <path d="M13 24 h60 M13 34 h60 M13 44 h60 M13 54 h60 M13 64 h60"/>
      </g>
      <rect x="17" y="17" width="52" height="53" fill="none" stroke="#6d5aa6" stroke-width="0.9"/>
      <path d="M43 22 l8 16.5 18 2.4 -13.4 12.4 3.6 18 -16.2 -9 -16.2 9 3.6 -18 -13.4 -12.4 18 -2.4 Z"
            fill="#8b73c9" stroke="#5a4a8c" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M43 22 l8 16.5 18 2.4 -13.4 12.4 3.6 18 -8 -4.4 Z" fill="#6d5aa6" opacity="0.45"/>
      <text x="43" y="88" text-anchor="middle" font-family="Courier Prime, monospace" font-size="14" letter-spacing="1" fill="${INK}">13</text>
      <g stroke="#a8322e" stroke-width="2.6" opacity="0.5" stroke-linecap="round" fill="none">
        <path d="M46 6 q26 12 34 34"/><path d="M38 8 q28 12 36 36"/>
        <path d="M62 14 a22 22 0 0 1 14 24"/>
      </g>`,
  },
  {
    // ONE tin, big, with the string knotted through its punched base and running
    // off to a partner that isn't in frame. The first draft drew both cans and at
    // flying size they were two indistinct pips on a hair; a single lit cylinder
    // with a taut line leaving it reads as the toy from across the room. Drawn in
    // 3/4 so the rim is an ellipse — a straight-on can is just a rectangle.
    id: "tincan", w: 118, h: 82,
    svg: `
      <path d="M40 66 q26 12 48 -2 q16 -10 28 -14" fill="none" stroke="#8a7f68" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M14 20 v41 q16 9 36 0 v-41 Z" fill="#ded4bb" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="M36 20 v45 q8 -1 14 -4 v-41 Z" fill="#b9ae90" opacity="0.75"/>
      <path d="M17 22 q6 4 14 4" fill="none" stroke="#ffffff" stroke-width="2.4" opacity="0.5" stroke-linecap="round"/>
      <ellipse cx="32" cy="20" rx="18" ry="7.4" fill="#f2ecdc" stroke="${INK}" stroke-width="1.6"/>
      <ellipse cx="32" cy="20" rx="13" ry="5" fill="none" stroke="#b2a78a" stroke-width="1.2"/>
      <path d="M15 34 q17 8 34 0 M16 44 q16 8 32 0" fill="none" stroke="#a89c80" stroke-width="1.2"/>
      <path d="M18 62 q14 7 28 0" fill="none" stroke="#9b8f72" stroke-width="1.2"/>
      <circle cx="33" cy="63" r="2.2" fill="${INK}"/>
      <path d="M33 63 q-7 3 -12 1 q6 4 12 2" fill="none" stroke="#8a7f68" stroke-width="1.7" stroke-linecap="round"/>`,
  },
  {
    // Airmail: the barber-stripe border is the whole point of the drawing, so it is
    // laid as alternating red and blue teeth rather than a dashed stroke, which
    // would flicker at flying size. The flap sits a little open.
    id: "envelope", w: 116, h: 80,
    svg: `
      <rect x="5" y="8" width="106" height="64" rx="2.5" fill="#fbf7ec" stroke="${INK}" stroke-width="1.6"/>
      <g>
        <path d="M5 8 h12 l-6 8 h-6 Z M17 8 h12 l-6 8 h-12 Z" fill="#8ca8c4"/>
        <path d="M29 8 h12 l-6 8 h-12 Z M53 8 h12 l-6 8 h-12 Z M77 8 h12 l-6 8 h-12 Z" fill="#b8676b"/>
        <path d="M41 8 h12 l-6 8 h-12 Z M65 8 h12 l-6 8 h-12 Z M89 8 h12 l-6 8 h-12 Z" fill="#8ca8c4"/>
      </g>
      <g>
        <path d="M5 64 h12 l-6 8 h-6 Z M29 64 h12 l-6 8 h-12 Z M53 64 h12 l-6 8 h-12 Z M77 64 h12 l-6 8 h-12 Z" fill="#8ca8c4"/>
        <path d="M17 64 h12 l-6 8 h-12 Z M41 64 h12 l-6 8 h-12 Z M65 64 h12 l-6 8 h-12 Z M89 64 h12 l-6 8 h-12 Z M101 64 h10 v8 h-16 Z" fill="#b8676b"/>
      </g>
      <path d="M5 8 L58 47 L111 8" fill="#f4eddc" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M58 47 L111 8 L111 12 L60 50 Z" fill="#ddd2b7" opacity="0.6"/>
      <path d="M5 70 L45 40 M111 70 L71 40" fill="none" stroke="#cabfa4" stroke-width="1.2"/>
      <path d="M51 45 q7 -5 14 -1 q6 4 3 10 q-4 6 -11 5 q-8 -1 -9 -7 q-1 -4 3 -7 Z" fill="#a8322e" stroke="#7d2320" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M53 46 q5 -3 10 -1" fill="none" stroke="#c9605c" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M55 53 q4 3 8 0" fill="none" stroke="#7d2320" stroke-width="1.1" stroke-linecap="round"/>`,
  },
];

// Markup for one messenger at a given pixel width (height follows the drawing's
// own ratio, so nothing in the set is ever squashed).
export function messengerSVG(m, px) {
  const h = Math.round((px * m.h) / m.w);
  return `<svg viewBox="0 0 ${m.w} ${m.h}" width="${px}" height="${h}" aria-hidden="true" focusable="false">${m.svg}</svg>`;
}

/* Fly the flock away from `originEl`.

   The caller has already put the payload on the clipboard — this is pure
   theatre and deliberately owns nothing but its own layer, which it removes when
   the last messenger is off-screen. Returns a promise that settles when the layer
   is gone, so a caller can restore its button afterwards.

   `reduced` skips the whole thing (no layer, no timers) and resolves at once. */
export function launchFlock(originEl, { reduced = false, seed = Math.random() } = {}) {
  if (reduced || !originEl || typeof document === "undefined") return Promise.resolve();
  const box = originEl.getBoundingClientRect();
  if (!box.width) return Promise.resolve();

  const layer = document.createElement("div");
  layer.className = "flock-layer";
  layer.setAttribute("aria-hidden", "true");

  // A cheap deterministic wobble so a replay in dev tools can be repeated, and so
  // no two messengers ever share a path.
  let s = seed * 10000;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

  const order = MESSENGERS.slice().sort(() => rnd() - 0.5);
  order.forEach((m, i) => {
    // Smaller on a phone: at full size six objects blot out the stub they came from.
    const px = Math.round((30 + rnd() * 16) * Math.min(1, window.innerWidth / 460));
    const el = document.createElement("span");
    el.className = "flock-obj";
    // Everyone leaves from under the stub and heads up and out, fanning wider the
    // later they go, so the flock reads as a departure rather than an explosion.
    const spread = (i - (order.length - 1) / 2) / order.length;
    el.style.left = `${box.left + box.width * (0.5 + spread * 0.7) + (rnd() - 0.5) * 40}px`;
    el.style.top = `${box.top + box.height * (0.2 + rnd() * 0.7)}px`;
    // Biased right, because the stub tore away up and to the right: the flock has to
    // look like it followed something, not like it burst.
    el.style.setProperty("--fdx", `${60 + spread * 300 + (rnd() - 0.5) * 90}px`);
    el.style.setProperty("--fdy", `${-(box.top + 160 + rnd() * 120)}px`);
    el.style.setProperty("--frot", `${(rnd() - 0.5) * 46}deg`);
    el.style.setProperty("--fdur", `${1.0 + rnd() * 0.5}s`);
    el.style.setProperty("--fdel", `${0.05 + i * 0.055}s`);
    el.innerHTML = messengerSVG(m, px);
    layer.appendChild(el);
  });

  document.body.appendChild(layer);
  return new Promise((resolve) => {
    setTimeout(() => { layer.remove(); resolve(); }, 1900);
  });
}
