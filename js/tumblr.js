// Tumblr messages — the collectible post set (see PLAN "Tumblr messages").
//
// The third family in the keepsakes drawer, and deliberately not a third polaroid. A polaroid
// develops over thirteen real minutes; a sticker arrives printed and finished; a tumblr message
// is a SCREENSHOT of something she actually posted, so it arrives finished too but it is not an
// object of hers, it is a picture of her talking. That is the whole reason the family exists:
// the other two shelves are things from the notebook, this one is her voice on a screen.
//
// Each entry: { id, blog, name, sub, how, text }.
//   id   — kebab-case handle, matches the unlock trigger and the TUMBLR store key.
//   blog — the url the post came from, printed in the card's header row.
//   name — the card's own lowercase caption (main line); also the toast subject.
//   sub  — the second caption line, fainter and smaller: what the post IS, not what it says.
//   how  — what you did to find it, in the achievement descs' voice, shown on the unlock toast
//          and an earned card's hover tip. Left unset until the post has a real trigger: an
//          empty `how` prints nothing, which is honest, where a written-ahead one would be a
//          promise about a trigger that does not exist yet.
//   text — the post, verbatim. These are real posts, quoted the way data/songs.json quotes real
//          lyrics. Nothing here is written in her voice and nothing is paraphrased: if a post
//          cannot be sourced word for word it does not go in the file.
//
// The card is drawn by tumblrPostMarkup in app.js off these fields alone — there is no per-post
// art, which is what keeps the set cheap to grow. Appending is safe: unlike STICKERS, nothing
// here is seeded off array order.

export const TUMBLR_POSTS = [
  {
    id: "figure-out-my-tumblr",
    blog: "taylorswift",
    name: "i am FOCUSED",
    sub: "the day she took the site on",
    how: "",
    text: "Taylor here. I'm locking myself in my room and not leaving until I figure out how to use my Tumblr. Well, I might leave for a second to get a snack or something but that is IT. I am FOCUSED. I have lots of questions, help me.",
  },
];

export const TUMBLR_BY_ID = Object.fromEntries(TUMBLR_POSTS.map((p) => [p.id, p]));

// A locked post is blacked out rather than hidden, so the shelf still shows you the SHAPE of
// what you have not found: how long it is, how it breaks, where it runs short at the end. The
// bars are measured off the real text — this walks the actual words and wraps them at `cpl`
// characters the way the card will — so a two-line post never masquerades as a paragraph.
// Pure and deterministic: same text in, same ragged block out, every render.
// Characters per line in the card's column, measured against the real thing rather than
// calculated: 40ch on .tpost (styles.css) minus its padding wraps bold sans at about forty
// characters. The two numbers only mean anything together — if the card's measure moves, this
// moves with it, or a locked post stops being the shape of the post underneath it. The check
// is a post's bar count against the line count of the same post found.
//
// That match is exact wherever the card gets its full measure, which is everywhere but a phone:
// below about 400px the viewport caps the card first and a long post blacks out a line short.
// Left alone deliberately. Sizing the bars off the live column would mean measuring the DOM
// from what is currently a pure function, and the thing being promised is the SHAPE of the post
// — how long it runs, where it breaks, how short it ends — which survives a line either way.
export const TUMBLR_WRAP = 40;

export function redactionRows(text, cpl = TUMBLR_WRAP) {
  const rows = [];
  for (const para of String(text || "").split(/\n+/)) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      if (line && (line.length + 1 + word.length) > cpl) { rows.push(line.length); line = word; }
      else line = line ? line + " " + word : word;
    }
    if (line) rows.push(line.length);
  }
  // As a fraction of a full line, floored so a one-word last row is still a visible bar.
  return rows.map((n) => Math.max(0.12, Math.min(1, n / cpl)));
}
