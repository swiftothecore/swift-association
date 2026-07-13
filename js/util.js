// Small pure helpers shared across modules.
export const $ = (id) => document.getElementById(id);

export function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

export function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function chance(p) { return Math.random() < p; }

// Canonical comparison key for a song title (or a typed answer). Lets a player's
// answer match regardless of punctuation, & vs "and", the $ stylisation, bracket
// tags, or numerals-vs-words. Display titles stay canonical — this only feeds the
// match. Verified to produce zero collisions across the catalog. NOTE: the order
// matters (twenty-two before the single-word folds).
export function normalizeTitle(s) {
  return s
    .toLowerCase()
    .replace(/’/g, "'")                 // curly apostrophe -> straight
    .replace(/\$/g, "s")                     // Wi$h Li$t -> wish list
    .replace(/[&+]/g, "and")                 // & / + -> and
    .replace(/[().!?,:;"'…]/g, "")       // drop punctuation + bracket chars (keep content)
    .replace(/[-–—/]/g, " ")        // dashes & slashes -> space
    .replace(/\btwenty[\s-]?two\b/g, "22")
    .replace(/\bten\b/g, "10")
    .replace(/\bone\b/g, "1")
    .replace(/\s+/g, " ")
    .trim();
}

// Comparison key for a typed lyric line vs stored lyrics. Like normalizeTitle for
// casing / apostrophes / & / $ / punctuation / dashes / whitespace, but WITHOUT the
// title-only numeral folds (those would corrupt ordinary lyric text, e.g. "the ONE
// that got away"). Adds one lyric-specific transform: fold word-final "ing" -> "in"
// so "dancing" and "dancin'" match either way (g-dropping is common in TS lyrics).
// Collapses all whitespace (incl. newlines) to single spaces, so a per-song blob is
// one flat string ideal for substring search.
export function normalizeLyric(s) {
  return s
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/\$/g, "s")
    .replace(/[&+]/g, "and")
    .replace(/[().!?,:;"'…]/g, "")
    .replace(/[-–—/]/g, " ")
    .replace(/ing\b/g, "in")        // g-dropping: dancing / dancin' -> dancin
    .replace(/\s+/g, " ")
    .trim();
}

// Standard Levenshtein edit distance (two-row DP).
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  let curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

// Approximate SUBSTRING match: how well `pattern` matches its best-aligned window of
// `text`, in [0,1] (1 = a clean substring; less for typos / partial). The DP's first
// row stays 0 so the pattern may start anywhere in `text`, and leftover `text` past
// the match is free — the score is 1 - min(last row) / pattern.length.
export function fuzzySubstringRatio(pattern, text) {
  if (!pattern.length) return 0;
  if (!text.length) return 0;
  let prev = new Array(text.length + 1).fill(0);
  let curr = new Array(text.length + 1);
  for (let i = 1; i <= pattern.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= text.length; j++) {
      const cost = pattern[i - 1] === text[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  let best = Infinity;
  for (let j = 0; j <= text.length; j++) if (prev[j] < best) best = prev[j];
  return Math.max(0, 1 - best / pattern.length);
}

// Mulberry32 — a fast, small seeded PRNG. Returns a factory that produces
// float values in [0, 1) each call, exactly like Math.random(). The whole state is
// the advancing counter, exposed via .state()/.seek() so a seeded sequence (the daily
// challenge) can be saved mid-run and resumed at the exact same position.
export function mulberry32(seed) {
  let s = seed | 0;
  const rng = function() {
    s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  rng.state = () => s;
  rng.seek = (v) => { s = v | 0; };
  return rng;
}

// Hash a "YYYY-MM-DD" date string to a uint32 seed (djb2-style).
export function dailySeed(dateStr) {
  let h = 5381;
  for (let i = 0; i < dateStr.length; i++)
    h = (Math.imul(h, 33) ^ dateStr.charCodeAt(i)) >>> 0;
  return h;
}

/* ---------- Profanity / slur masking ---------- */
// Mask explicit words wherever lyrics or titles are SHOWN to the player (the stored
// data is untouched — matching still runs on the real words). Two tiers:
//   • SLUR_RE  — the racial slur in one featured song; ALWAYS masked, no opt-out.
//   • SWEAR_RE — general profanity; masked only when the player opts in (the
//                "censor explicit words" setting).
// Mild words ("damn", "hell") are deliberately left alone — "damn" is also a valid
// prompt word, and masking either would over-censor common, non-explicit lines.
const SLUR_RE  = /\bnigg(?:a|er)s?\b/gi;
// Each stem is bounded so we don't bleed into innocent words (e.g. "country" never
// matches "cunt", "Dickinson" never matches "dick"). \w* tails catch inflections
// (fucking, shitty, bitches) without enumerating every form.
const SWEAR_RE = /\b(?:(?:mother)?fuck\w*|shit\w*|bitch\w*|slut\w*|piss\w*|dick(?:s|head|heads)?|whore\w*|cunt\w*|asshole\w*|prick(?:s)?|bastard\w*|pussy\w*|goddamn\w*)\b/gi;

// Keep the first and last letter, star the middle: fuck → f**k, shit → s**t,
// nigga → n***a. Trailing non-letters (an apostrophe in "fuckin'") aren't matched
// by the \w* stems, so they fall outside the mask and read cleanly.
function maskWord(w) {
  if (w.length <= 1) return "*";
  if (w.length === 2) return w[0] + "*";
  return w[0] + "*".repeat(w.length - 2) + w[w.length - 1];
}

// Mask a string for display. Slurs are masked unconditionally; general profanity
// only when `profanity` is true. Pure — returns a new string, leaves data as-is.
export function censorText(text, profanity) {
  if (text == null) return text;
  let out = String(text).replace(SLUR_RE, maskWord);
  if (profanity) out = out.replace(SWEAR_RE, maskWord);
  return out;
}

// "N years today" the readable way (singular guard; year 0 is the release day itself).
function yearsTodayPhrase(n) {
  if (n <= 0) return "out today!";
  return n === 1 ? "1 year today" : `${n} years today`;
}

// Anniversary marginalia for a "YYYY-MM-DD" date key, matched against a TS_MILESTONES
// table (month-day, so it recurs every year). Pure: no DOM, no globals — the milestones
// table is passed in, the year drives the count. Returns null on a quiet day, else a
// structured object the UI turns into a pinned note (home) and a corner sticky (gameplay):
//   { icon, album, eyebrow, headline, headlineRest, note, caption, aria }
// `icon` is "cake" on her birthday, else "heart"; `album` keys the era colour (null on the
// birthday, which wears plain ink). When an original and its Taylor's Version share a day
// (Oct 27: 1989 + 1989 TV) the two collapse into one note rather than fighting for the margin.
// A "songday" hit (a date Taylor sings, e.g. April 29th) returns its own blurb and carries a
// songday:true flag so callers can tell it apart from a real release (see anniversaryAlbumFor).
export function anniversaryNote(dateKey, milestones) {
  if (!dateKey || dateKey.length < 10) return null;
  const md = dateKey.slice(5);
  const year = +dateKey.slice(0, 4);
  const hits = milestones.filter((m) => m.md === md);
  if (!hits.length) return null;

  const birthday = hits.find((m) => m.kind === "birthday");
  if (birthday) {
    const age = year - birthday.year;
    // Dec 13 is also the game's sacred number — lean into the coincidence.
    const born = age > 0
      ? `Born this day ${age} years ago, in ${birthday.year}.`
      : "Born this day.";
    return {
      icon: "cake", album: null,
      eyebrow: "On this day",
      headline: "Happy birthday, Taylor",
      headlineRest: "",
      note: `${born} Today's notebook runs to 13 pages.`,
      caption: "happy birthday!",
      aria: `Happy birthday, Taylor. ${born}`,
    };
  }

  // A date Taylor sings outright (High Infidelity's April 29th, Last Kiss's July 9th):
  // its own blurb + caption, wearing the song's era colour, but flagged songday so the
  // anniversary daily never skews toward it (it's a lyric wink, not a release).
  const songday = hits.find((m) => m.kind === "songday");
  if (songday) {
    return {
      icon: "heart", album: songday.album, songday: true,
      eyebrow: songday.eyebrow || "On this day",
      headline: songday.title,
      headlineRest: "",
      note: songday.blurb || "",
      caption: songday.caption,
      aria: `${songday.eyebrow || songday.title}. ${songday.blurb || ""}`.trim(),
    };
  }

  // Album / re-record day. Sort oldest-first so a combined note reads chronologically.
  const albums = hits.slice().sort((a, b) => a.year - b.year);
  const primary = albums[0];
  const caption = yearsTodayPhrase(year - primary.year);

  if (albums.length > 1) {
    const parts = albums.map((m) => {
      const ago = year - m.year;
      const tail = ago <= 0 ? "out today" : `${ago === 1 ? "1 year" : ago + " years"} ago`;
      const nm = m.kind === "tv" ? "its Taylor's Version" : "the album";
      return `${nm} (${tail})`;
    });
    const note = parts.join(", and ");
    return {
      icon: "heart", album: primary.album,
      eyebrow: "On this day",
      headline: primary.title,
      headlineRest: "twice over",
      note,
      caption,
      aria: `On this day: ${primary.title}, ${note}.`,
    };
  }

  const m = primary;
  const ago = year - m.year;
  const isTV = m.kind === "tv";
  const headlineRest = ago <= 0
    ? "is out today"
    : (ago === 1 ? "turned 1 today" : `turned ${ago} today`);
  let note;
  if (ago <= 0) {
    note = isTV ? "her re-record" : (m.aka || "");
  } else {
    note = isTV
      ? `her re-record, out this day in ${m.year}`
      : (m.aka ? `${m.aka}, out this day in ${m.year}` : `out this day in ${m.year}`);
  }
  return {
    icon: "heart", album: m.album,
    eyebrow: "On this day",
    headline: m.title,
    headlineRest,
    note,
    caption,
    aria: `${m.title} ${headlineRest}.${note ? " " + note + "." : ""}`,
  };
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
// Ordinal day-of-month, e.g. 1 → "1st", 24 → "24th" (11/12/13 are the -th exceptions).
function ordinalDay(n) {
  const t = n % 100;
  const s = t >= 11 && t <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] || "th");
  return `${n}${s}`;
}
function digitSum(n) {
  return String(n).split("").reduce((a, d) => a + Number(d), 0);
}
// A date "adds up to 13" when its day and month reach thirteen, either by digit sum
// (24 Jul → 2+4+7) or the plain day + month (8 May → 8+5). Mirrors the reference rule.
function addsUpTo13(day, month) {
  return digitSum(day) + month === 13 || day + month === 13;
}
// The addends to show in the little equation: the day's digits when the digit-sum path
// is what qualifies (24 → 2, 4), else the whole day. The month is appended by the caller.
function sumAddends(day, month) {
  if (digitSum(day) + month === 13) return String(day).split("").map(Number);
  return [day];
}

// The game's sacred 13, celebrated on the ordinary days the milestone table doesn't already
// claim: the 13th of any month, and dates that "add up to 13" (24 Jul, 8 May …). Returns the
// same note shape as anniversaryNote() so the existing renderers can consume it, but with
// tone:"minor" (the UI keeps it quieter than an album release), icon:"thirteen", and no album
// (plain ink). Pure: date string in, structured note or null out. Milestone days take priority,
// so the caller resolves a real anniversary first and only falls back to this on a quiet day.
export function thirteenNote(dateKey) {
  if (!dateKey || dateKey.length < 10) return null;
  const month = +dateKey.slice(5, 7);
  const day = +dateKey.slice(8, 10);
  if (!month || !day) return null;

  const isThirteenth = day === 13;
  const isSum = addsUpTo13(day, month);
  if (!isThirteenth && !isSum) return null;

  const monthName = MONTH_NAMES[month - 1];
  const sumPhrase = isSum ? [...sumAddends(day, month), month].join(" + ") + " = 13" : "";
  const base = { icon: "thirteen", album: null, tone: "minor", headlineRest: "" };

  // A 13th that also adds up (13 Sep: the date is 13, and 1+3+9 = 13 too).
  if (isThirteenth && isSum) {
    return {
      ...base,
      eyebrow: "The thirteenth",
      headline: "The 13th, twice over",
      note: `It's the 13th, and the date adds up too: ${sumPhrase}.`,
      caption: "lucky 13",
      aria: `It's the 13th of ${monthName}, and the date adds up to 13.`,
    };
  }
  if (isThirteenth) {
    return {
      ...base,
      eyebrow: "The thirteenth",
      headline: "It's the 13th",
      note: "Taylor's lucky number. A good day to play.",
      caption: "the 13th",
      aria: `It's the 13th of ${monthName}, Taylor's lucky number.`,
    };
  }
  return {
    ...base,
    eyebrow: "Lucky math",
    headline: "Today adds up to 13",
    note: `${ordinalDay(day)} of ${monthName}: ${sumPhrase}.`,
    caption: "adds up to 13",
    aria: `Today's date adds up to 13. ${sumPhrase}.`,
  };
}
