"use strict";
/* Bonus-game puzzle builders — pure and state-free, like js/match.js.
   Nothing here reads app state: every builder takes the song list (plus prebuilt indexes)
   and returns a finished puzzle, so the shelf's games can be reasoned about and re-rolled
   without touching the main game loop.

   All three games work off REAL lyric lines, so all three need the same guarantee: the
   puzzle handed to the player must have exactly one defensible answer. Enforcing that is
   most of what this file does. */
import { normalizeLyric, normalizeTitle, levenshtein, swappedNeighbours } from "./util.js";
import { STUDIO_ALBUMS, ALBUM_TRACKS, TRACK_ALT_TAKES, PRODUCER_ALBUMS,
         PEN_ALBUMS, PEN_GUESTS } from "./config.js";

/* Words never worth swapping or counting as a line's content. Swapping a function word
   ("the" -> "a") is invisible rather than hard, and a line whose only meat is filler makes a
   poor prompt either way. */
const FUNCTION_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "so", "if", "as", "of", "to", "in", "on", "at",
  "by", "for", "with", "from", "into", "up", "out", "off", "down", "over", "than", "then",
  "i", "im", "ive", "id", "ill", "me", "my", "mine", "you", "youre", "youve", "your", "yours",
  "he", "hes", "him", "his", "she", "shes", "her", "hers", "it", "its", "we", "were", "weve",
  "us", "our", "ours", "they", "theyre", "them", "their", "theirs", "that", "thats", "this",
  "these", "those", "who", "what", "when", "where", "why", "how", "is", "was", "are",
  "be", "been", "am", "do", "did", "does", "dont", "didnt", "have", "has", "had", "will",
  "would", "can", "cant", "could", "should", "just", "not", "no", "all", "too", "very",
  "there", "here", "now", "one", "some", "any", "like",
]);
const FILLER = new Set(["oh", "ooh", "ah", "aah", "mmm", "mm", "la", "na", "da", "yeah", "hey",
  "woah", "whoa", "uh", "eh", "ha", "hoo", "ay"]);

const WORD_PARTS = /^([^\p{L}]*)(\p{L}[\p{L}'’]*)([^\p{L}]*)$/u;
function splitWord(w) {
  const m = WORD_PARTS.exec(w);
  return m ? { pre: m[1], core: m[2], post: m[3] } : null;
}
function wordKey(s) { return String(s).toLowerCase().replace(/[^\p{L}]/gu, ""); }
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

/* Every line in a song, tagged with the section it came from. */
export function songLines(song) {
  if (!Array.isArray(song.sections)) return [];
  const out = [];
  song.sections.forEach((sec) => {
    (sec.lines || []).forEach((line) => out.push({ line, label: sec.label || "" }));
  });
  return out;
}

/* An index of every real lyric line: normalized line -> Set of song titles. Built once and
   handed to both builders, where it does double duty:
     • Spot the Slip asks "is my doctored line accidentally a REAL line?" (it must not be)
     • Name That Song asks "does this line belong to exactly one song?" (it must)
   Both are correctness guards. Without them each game can hand out a puzzle whose "wrong"
   answer is in fact right. */
export function buildLineIndex(songs) {
  const idx = new Map();
  songs.forEach((song) => {
    songLines(song).forEach(({ line }) => {
      const key = normalizeLyric(line);
      if (!key) return;
      if (!idx.has(key)) idx.set(key, new Set());
      idx.get(key).add(song.title);
    });
  });
  return idx;
}

function contentWords(line) {
  return line.split(/\s+/).map(splitWord).filter(Boolean)
    .map((p) => wordKey(p.core))
    .filter((k) => k.length > 2 && !FUNCTION_WORDS.has(k) && !FILLER.has(k));
}

/* ---------- Word counts ----------
   How many times each word key is sung across the whole catalogue. Sing It Back and Redacted
   both price a word by it (BLANK_MAX_FREQ), and judgeBlank reads its keys as the vocabulary
   that decides whether a typo is forgiven. Built once at load and reused for every page. */
export function buildWordFreq(songs) {
  const freq = new Map();
  songs.forEach((song) => {
    songLines(song).forEach(({ line }) => {
      line.split(/\s+/).map(splitWord).filter(Boolean).map((p) => wordKey(p.core)).filter(Boolean)
        .forEach((t) => freq.set(t, (freq.get(t) || 0) + 1));
    });
  });
  return { freq };
}

/* ---------- Spot the Slip ----------
   Take a real lyric line, swap exactly one word for an impostor, ask the player to tap it. The
   mechanic is trivial; the swap is the entire game, and that is why the swaps are AUTHORED
   rather than generated (data/slips.json, about six lines a song across all 251).

   The generator they replaced constrained a random swap by corpus bigrams and a word class
   induced at load, and read by hand it was good on about one page in three. A third of the
   pages were broken English, and half were grammatical but meaningless ("the city they saw on
   my collarbone"), so the impostor could be found on sense alone without knowing the song,
   which is exactly the wrong test. No signal a catalogue this size can give closes that gap:
   bigram strength fixed the grammar and left the sense alone, and ranking fakes by
   distributional similarity only learned that "middle", "blink" and "bottle" all sit in
   "the ___ of". A fake has to make sense in its line, and only a reader can judge that.

   Each row is [section, line, word index, real word, fake]. `readSlipSwaps` drops any row the
   lyrics have moved out from under (the line or the word at that index changed), so a lyric
   correction can never deal a stale swap; scripts/bonus/slips/build.mjs is what authors and
   checks them against the rules (foreign to the song, sung somewhere in the catalogue, not an
   inflection of the real word, not a title word, not the line's first or last word). */
export function readSlipSwaps(doc, songs) {
  const byTitle = new Map(songs.map((s) => [s.title, s]));
  const map = new Map();
  const stale = [];
  Object.entries(doc || {}).forEach(([title, rows]) => {
    const song = byTitle.get(title);
    if (!song) { stale.push(`${title}: no such song`); return; }
    const keep = [];
    (rows || []).forEach(([a, b, at, real, fake]) => {
      const line = song.sections?.[a]?.lines?.[b];
      const part = line && splitWord(line.split(/\s+/).filter(Boolean)[at] || "");
      if (!part || wordKey(part.core) !== wordKey(real)) { stale.push(`${title} ${a}.${b}: "${real}" moved`); return; }
      keep.push({ id: `${title}#${a}.${b}`, a, b, at, fake });
    });
    if (keep.length) map.set(title, keep);
  });
  return { map, stale };
}

/* How many songs the slips can deal from, which is what an endless run counts its way through
   before the song ban list is handed back. */
export function slipDealCount(songs, slips) {
  return songs.filter((s) => slips.has(s.title)).length;
}

/* Deal one page. The song is chosen first and uniformly, then one of its lines, so a song with
   eight authored lines is not dealt more often than one with five. `avoidSongs` is the run's
   song ban list, `avoidFakes` a soft preference against an impostor word seen in the last few
   pages, and `dealt` the line ids already shown (a hard bar, so a deep endless run never hands
   back a page it has already answered until every line has been dealt).
   Returns null if nothing is dealable; the caller reshuffles or skips. */
export function buildSlipPuzzle(songs, slips, lineIndex, rng = Math.random, avoidSongs = null,
                                avoidFakes = null, dealt = null) {
  const open = (song) => (slips.get(song.title) || []).filter((r) => !dealt || !dealt.has(r.id));
  const pool = shuffled(songs.filter((s) => !(avoidSongs && avoidSongs.has(s.title)) && open(s).length), rng);
  for (const song of pool) {
    const rows = open(song);
    const fresh = rows.filter((r) => !(avoidFakes && avoidFakes.has(wordKey(r.fake))));
    for (const row of shuffled(fresh.length ? fresh : rows, rng)) {
      const line = song.sections[row.a].lines[row.b];
      const raw = line.split(/\s+/).filter(Boolean);
      const parts = raw.map(splitWord);
      // The fake keeps the case it was written in, so a capital on the original (a "Polaroid",
      // a "Christmas") never leaks onto an ordinary word and marks it out. Only a line sung in
      // capitals passes its case on.
      const core = parts[row.at].core;
      const fake = core.length > 1 && core === core.toUpperCase() ? row.fake.toUpperCase() : row.fake;
      const swapped = raw.map((w, i) => (i === row.at ? parts[i].pre + fake + parts[i].post : w));
      // Belt and braces: the authoring script checks this, but the line index is the catalogue
      // as it stands today, and a doctored line that has since become a real lyric is unfair.
      if (lineIndex.has(normalizeLyric(swapped.join(" ")))) continue;
      return {
        song, id: row.id,
        label: song.sections[row.a].label || "",
        realLine: line,
        realWord: parts[row.at].core,
        fakeWord: fake,
        answer: row.at,
        tokens: swapped.map((text, i) => ({ text, tappable: !!parts[i] })),
      };
    }
  }
  return null;
}

function shuffled(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* NO GIVEAWAY, read loosely. The exact-substring check misses a line that is the title in all
   but spelling: an extra "ever" in the chorus of We Are Never Ever Getting Back Together, the
   "pink cloud" of Pink Clouding, the "grown" of Never Grow Up, a backing vocal in brackets between two of the title's words.
   So a line is also out when it sings EVERY content word of the title, stem-folded and in any
   order. The title's own bracketed tail ("(Taylor's Version)", "(10 Minute Version)") is
   dropped first, or no line could ever sing all of it. A title made only of function words
   ("Mine", "Me!") has no stems and falls back on the substring check alone. */
function titleStems(title) {
  const bare = normalizeLyric(String(title).replace(/\s*[([][^)\]]*[)\]]/g, ""));
  return [...new Set(bare.split(" ").filter((w) => w.length > 2 && !FUNCTION_WORDS.has(w) &&
    !FILLER.has(w)).map(stemOf))];
}
function singsTitle(lineKey, stems) {
  if (!stems.length) return false;
  const sung = lineKey.split(" ").map(stemOf);
  // A long stem also takes a short tail the folding cannot see, so "grown" still sings the
  // "grow" of Never Grow Up. Four letters at least, or "man" would start finding "many".
  return stems.every((w) => sung.some((k) => k === w ||
    (w.length >= 4 && k.startsWith(w) && k.length - w.length <= 2)));
}

/* A line's owners, less the SECOND CUTS (the acoustic, piano and remix versions the shelf never
   deals and the dropdown never offers). The line index reads the whole catalogue on purpose, but
   counting a version nobody can name as a second owner made nearly every line of its original
   look shared: State Of Grace could deal 6 of its 29 lines, Snow On The Beach none at all. The
   original is the only song that can be the answer, so the line is the original's. */
function liveOwners(set) {
  return set ? [...set].filter((t) => RUTHLESS_SKIP_TITLES.get(t) !== "second cut") : [];
}
// The song a version is a version OF: "All Too Well (10 Minute Version)" -> "All Too Well".
function versionFamily(title) { return String(title).replace(/\s*\([^()]*\)\s*$/, "").trim(); }

/* ---------- Name That Song ----------
   Show one real lyric line; the player names the song it came from. Two fairness guards:
     • UNIQUE      — the line must belong to ONE song. A line shared between two different songs
       would mark a correct answer wrong, so it is never dealt. Two versions of one song that
       both deal (All Too Well and its 10 Minute Version, Bad Blood and its remix) are the
       exception: the line is dealt and EITHER title is right, carried in `also`. Hidden second
       cuts are not owners at all (liveOwners).
     • NO GIVEAWAY — a line containing the song's own title answers itself, so those are
       skipped. This is what keeps it a recall test rather than a reading test. */
export function buildNamePuzzle(songs, lineIndex, rng = Math.random, tries = 120, avoid = null) {
  const dealable = new Set(songs.map((s) => s.title));
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    // A Name That Song run is ten distinct songs, not ten chances to recognise the same
    // chorus. Unlike the older builders' soft rests, this is an absolute bar: the catalogue
    // comfortably supplies a full run, and a repeated song would make the answer free.
    // Two versions of one song are one song here: naming one would hand over the other.
    if (avoid && (avoid.has(song.title) ||
        [...avoid].some((t) => versionFamily(t) === versionFamily(song.title)))) continue;
    const titleKey = normalizeLyric(song.title);
    const titleWords = titleStems(song.title);
    const family = versionFamily(song.title);

    const candidates = songLines(song).filter(({ line }) => {
      const n = line.split(/\s+/).filter(Boolean).length;
      if (n < 4 || n > 14) return false;
      if (contentWords(line).length < 3) return false;
      const key = normalizeLyric(line);
      if (!key) return false;
      const owners = liveOwners(lineIndex.get(key));
      if (!owners.length) return false;
      // Every other owner must be a dealable version of this same song, or the line is shared
      // with something the player could name and be wrongly marked down for.
      if (owners.some((o) => o !== song.title &&
          (versionFamily(o) !== family || !dealable.has(o)))) return false;
      if (titleKey && key.includes(titleKey)) return false;
      if (singsTitle(key, titleWords)) return false;
      return true;
    });
    if (!candidates.length) continue;

    const { line, label } = pick(candidates, rng);
    const also = liveOwners(lineIndex.get(normalizeLyric(line))).filter((o) => o !== song.title);
    return { song, label, line, also };
  }
  return null;
}

/* ---------- Sing It Back ----------
   The song is named, one word is lifted out of one of its lines, and the player writes it
   back in. It is Spot the Slip read backwards: there the fake word is on the page and you
   find it, here the real word is missing and you supply it.

   It was originally specified as "recite the whole line from memory", and that version was
   never built on purpose: validating a freely typed lyric line cannot separate "you
   misremembered" from "you typed it differently", and the failure it produces — telling a
   fan they are wrong about a lyric they know by heart — is the worst one this game has to
   offer. Blanking ONE word keeps the same test (do you actually know this line?) and leaves
   exactly one token to judge, which is a promise the code can keep.

   The song title is shown, and that is a fairness decision rather than a kindness: without
   it the missing word has as many defensible answers as the language allows, and the player
   is guessing at a line rather than recalling one. With it, the answer is fixed by a real
   lyric they either know or don't.

   The bars a blank must clear:
     1. WORTH ASKING  — a content word of 4+ letters that the catalogue doesn't lean on. The
                        function-word list alone isn't enough of a filter: "know" (673 uses),
                        "back", "never", "love" and "time" are all content words, and all of
                        them are recovered from the surrounding grammar without knowing the
                        song at all, which is the one thing this game is for. So a blank word
                        also has to sit under BLANK_MAX_FREQ, which aims the gap at whatever
                        makes the line that line.
     2. NOT FREE      — it appears nowhere else in the line, and nowhere in the title we're
                        showing them, so the page never contains its own answer.
     3. RECOVERABLE   — the line keeps 3+ other content words, so there is a line left to
                        recall rather than a fragment to guess at.
     4. SETTLED       — no OTHER line in the same song matches this one but for that slot.
                        "I remember it all too well" against "I remember it all so well" has
                        two honest answers and only one of them would score.
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
const BLANK_MAX_FREQ = 200;
export function buildBlankPuzzle(songs, ctx, rng = Math.random, tries = 120, avoid = null) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    // Don't serve the same song twice in a run while there's still catalogue left to draw
    // from — but stop insisting near the end of the budget rather than fail the page over it.
    if (avoid && avoid.has(song.title) && t < tries * 0.7) continue;

    // Keyed the way the line's own words are (wordKey) as well as the lyric way. normalizeLyric
    // alone folds "getting" to "gettin", so the title's word never matched the line's and a page
    // headed We Are Never Ever Getting Back Together could blank "getting" right under it.
    const titleWords = new Set([
      ...normalizeLyric(song.title).split(/\s+/),
      ...String(song.title).split(/\s+|(?<=\p{L})(?:\.{2,}|…)(?=\p{L})/u).map(wordKey),
    ].filter(Boolean));
    const lines = songLines(song);
    // Every line of this song as a token list, for bar 4.
    const shapes = lines.map(({ line }) =>
      line.split(/\s+/).filter(Boolean).map(splitWord).map((p) => (p ? wordKey(p.core) : "")));

    const candidates = [];
    lines.forEach(({ line, label }, li) => {
      const raw = line.split(/\s+/).filter(Boolean);
      if (raw.length < 5 || raw.length > 14) return;
      const parts = raw.map(splitWord);
      const toks = parts.map((p) => (p ? wordKey(p.core) : ""));
      const meat = toks.filter((k) => k.length > 2 && !FUNCTION_WORDS.has(k) && !FILLER.has(k));
      if (meat.length < 4) return;   // bar 3: 3 left over once one is taken out

      for (let i = 0; i < raw.length; i++) {
        const k = toks[i];
        if (!parts[i] || k.length < 4) continue;                        // bar 1
        if (FUNCTION_WORDS.has(k) || FILLER.has(k)) continue;           // bar 1
        if ((ctx.freq.get(k) || 0) > BLANK_MAX_FREQ) continue;          // bar 1: too well-worn to ask
        if (titleWords.has(k)) continue;                                // bar 2: the title is on show
        if (toks.filter((x) => x === k).length > 1) continue;           // bar 2: repeated in the line
        // bar 4: another line of this song, identical but for this slot, would answer just
        // as honestly. Compare against the full shape rather than the text, so punctuation
        // and capitals don't hide a twin.
        const twin = shapes.some((sh, si) => si !== li && sh.length === toks.length &&
          sh[i] !== k && sh.every((w, j) => j === i || w === toks[j]));
        if (twin) continue;
        candidates.push({ line, label, raw, parts, at: i });
      }
    });
    if (!candidates.length) continue;

    const { line, label, raw, parts, at } = pick(candidates, rng);
    return {
      song, label, line, at,
      answer: parts[at].core,
      // A token with no letters in it (a lone "—", a stray bracket) has no parts; it still has
      // to reach the page, so it travels as its own core with nothing around it.
      tokens: parts.map((p, i) => (p
        ? { pre: p.pre, core: p.core, post: p.post, blank: i === at }
        : { pre: "", core: raw[i], post: "", blank: false })),
    };
  }
  return null;
}

/* Judging a written word. Generous in one direction only: every allowance here exists to
   stop a player who knows the line being told they don't.
     • punctuation and case are already gone (wordKey), so "dont" answers "don't"
     • a shared stem passes, so "wait" answers "waiting" — the player has the line, not the
       tense, and the tense is not what the game asked about
     • a single typo passes — one wrong/missing/extra letter, or two neighbours swapped, which
       is the commonest way a hand gets ahead of itself ("waitign") and is two edits away by
       plain Levenshtein, so it needs saying separately. But typos are only forgiven for a
       string that isn't itself a word Taylor sings: that keeps "teh" for "the" while never
       quietly accepting "night" for "right", which is a different answer rather than a slip.
   `vocab` is a Set of catalogue word keys (buildWordFreq's `freq` map serves).
   The neighbour-swap test itself is shared with the game's typed-title forgiveness and
   lives in util.js. */
/* ---------- Redacted ----------
   A whole verse printed out with its telling words taped over, and the player peels the strips
   off one at a time until they dare name the song. The page opens worth six and every strip
   costs one, so the tension is entirely self-inflicted: nothing here is racing you, you are
   just spending.

   WHICH WORDS GET COVERED is the only judgement the builder makes, and it is Sing It Back's
   judgement read the other way round. That game refuses to blank a function word or a word the
   catalogue leans on (over BLANK_MAX_FREQ uses), because either can be recovered from grammar
   alone; here those same words are exactly what STAYS on the page. Three things follow from it
   and all three are the point:
     • the page reads like a genuine redacted document — the grammar survives, the secrets don't
     • every strip left is worth peeling, so the choice is between good options rather than
       between one good one and five duds
     • a word too common to identify a song can't identify a song, so leaving it visible costs
       the puzzle nothing
   The one addition is that a word from the TITLE is always covered however common it is
   ("love", "time" and "story" are all over the cap), because the page must never print its own
   answer in plain sight.

   The bars a verse must clear:
     1. UNIQUE     — every line in the window is shared by the same one song, so the fully
                     peeled verse has exactly one honest answer.
     2. NO GIVEAWAY— no line contains the title. Name That Song bars these for the same reason,
                     and here it would be worse: one lucky first tap would end the page before
                     anything had happened. The comparison is run on the spaceless forms too,
                     or a run-together title spells itself out in plain sight one word at a
                     time ("but I'm gonna get you back" against imgonnagetyouback).
     3. READABLE   — every line keeps at least one visible word, and the verse as a whole keeps
                     REDACT_MIN_PLAIN of its words, so what is left is a document with holes in
                     it rather than a wall with a few words stuck to it. The window is short
                     enough to sit on the page too.
     4. WORTH SIX  — at least REDACT_MIN_BLOCKS distinct words are covered, or the six-point
                     budget is never really spent and the decision the game is made of never
                     gets asked. DISTINCT is the count that matters, because peeling a strip
                     peels every strip of the same word (see the `key` on each token): a verse
                     that repeats one line back at itself offers half as many choices as it has
                     strips, and would otherwise pass this bar on an echo.
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
// Two or three lines, never five. A five-line verse hands over so much surviving grammar,
// rhyme and shape that the song is often placeable without peeling anything at all — the page
// answers itself and the budget never gets spent. A short window is the scarcity the game runs
// on: it is what makes a strip worth buying.
const REDACT_LINES_MIN = 2;
const REDACT_LINES_MAX = 3;
const REDACT_MIN_BLOCKS = 4;
const REDACT_MIN_PLAIN = 0.38;  // share of the verse's words left uncovered
const REDACT_MAX_WORDS = 11;    // per line, so a verse stays a shape you can read at a glance

export function buildRedactedPuzzle(songs, ctx, lineIndex, rng = Math.random, tries = 120, avoid = null) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song || !Array.isArray(song.sections)) continue;
    // Don't serve the same song twice in a run while there's catalogue left, then stop
    // insisting near the end of the budget rather than fail the page over it (Sing It Back's
    // rule, for the same reason).
    if (avoid && avoid.has(song.title) && t < tries * 0.7) continue;

    const titleKey = normalizeLyric(song.title);
    // Keyed the way each token is (wordKey) as well, splitting on an ellipsis between letters:
    // the lyric key reads "Come Back...Be Here" as "come backbe here", which left "back"
    // uncovered on that song's own page.
    const titleWords = new Set([
      ...titleKey.split(/\s+/),
      ...String(song.title).split(/\s+|(?<=\p{L})(?:\.{2,}|…)(?=\p{L})/u).map(wordKey),
    ].filter(Boolean));

    const secs = song.sections.filter((s) => (s.lines || []).filter((l) => l && l.trim()).length >= REDACT_LINES_MIN);
    if (!secs.length) continue;
    const sec = pick(secs, rng);
    const lines = (sec.lines || []).filter((l) => l && l.trim());
    const want = REDACT_LINES_MIN + Math.floor(rng() * (REDACT_LINES_MAX - REDACT_LINES_MIN + 1));
    const take = Math.min(lines.length, want);
    const start = Math.floor(rng() * (lines.length - take + 1));
    const win = lines.slice(start, start + take);

    // Bars 1 and 2, walked together: intersect the owning songs line by line and drop the
    // window the moment a line names the song out loud.
    const titleFlat = titleKey.replace(/ /g, "");
    let owners = null, bad = false;
    for (const line of win) {
      const key = normalizeLyric(line);
      const set = key ? lineIndex.get(key) : null;
      if (!set) { bad = true; break; }
      if (titleKey && (key.includes(titleKey) || key.replace(/ /g, "").includes(titleFlat))) { bad = true; break; }
      // A hidden second cut is not an owner here either (liveOwners): it never deals and
      // cannot be named, and counting it barred every verse its original shares with it.
      const live = new Set(liveOwners(set));
      owners = owners === null ? live : new Set([...owners].filter((x) => live.has(x)));
    }
    if (bad || !owners || owners.size !== 1) continue;

    const rows = [];
    const covered = new Set();
    let strips = 0, words = 0;
    for (const line of win) {
      const raw = line.split(/\s+/).filter(Boolean);
      if (raw.length > REDACT_MAX_WORDS) { bad = true; break; }
      const toks = raw.map((w) => {
        // A hyphenated compound ("oceans-deep") has punctuation in the middle, so it never
        // splits into pre/core/post — and it is exactly the sort of word worth covering, so it
        // is taken whole rather than left in plain sight. A token with no letters at all (a
        // lone dash, a year) still can't be covered and stays as it is.
        const p = splitWord(w);
        const k = wordKey(p ? p.core : w);
        if (k) words++;
        const hide = k.length >= 3 && !FUNCTION_WORDS.has(k) && !FILLER.has(k) &&
          ((ctx.freq.get(k) || 0) <= BLANK_MAX_FREQ || titleWords.has(k));
        if (hide) { strips++; covered.add(k); }
        return p
          ? { pre: p.pre, core: p.core, post: p.post, key: k, hide }
          : { pre: "", core: w, post: "", key: k, hide };
      });
      if (!toks.some((x) => !x.hide)) { bad = true; break; }              // bar 3
      rows.push(toks);
    }
    if (bad) continue;
    if (!words || (words - strips) / words < REDACT_MIN_PLAIN) continue;  // bar 3
    if (covered.size < REDACT_MIN_BLOCKS) continue;                       // bar 4

    return { song, label: sec.label || "", rows, blocks: covered.size, line: win[0] };
  }
  return null;
}

/* ---------- Only Here ----------
   The shelf's one game with no fail state, and the only one that rewards knowing the CATALOGUE
   rather than one song's lines. A song is named and six of its own words are dealt face up;
   pick the one you think the fewest other songs sing. Every card is real, so every pick scores
   something, and the reveal turns the whole hand over: every word's true song count, your pick
   ticked or crossed, and the rarest in the hand marked in gold.

   The verb used to be FREE RECALL — write a word from this song — and that was the thing wrong
   with it. You cannot search your own memory by attribute ("an unusual word, in this song, not
   in others"), only by cue, so the player stared at a blank line while a clock ran and
   experienced their own mind returning nothing, which reads as personal failure rather than as
   the puzzle beating them. The wager was a fiction too: the printed ladder gave the PRICES but
   never the ODDS, so you typed the one word your brain produced and found out what it happened
   to be worth. Dealing the hand fixes both. The reveal IS the game — everything the old version
   knew and never showed you goes on the page every time, including on a page played badly.

   FAKE WORDS WERE CONSIDERED AND CUT. An earlier design salted the hand with words that are not
   in the song at all, so the weirdest-looking card was also the likeliest trap. It overcomplicates
   it, and the trap survives without fabrication: the hand carries FALSE EXOTICS, real in-song
   words that sound rare and are sung by twenty other songs. That punishes exactly the same
   "sounds like something she'd sing here" instinct using nothing but the truth, and it is the
   main tuning lever this game has.

   Everything runs off one index — `buildWordIndex`, a word to the set of songs that sing it —
   and the count it reports is the whole game, which is why a RE-RECORDING DOES NOT COUNT AS
   ANOTHER SONG. A variant collapses onto its base title whenever that base is in the catalogue,
   so a word sung once and once again on the acoustic cut is still a word sung by one song. That
   distinction is too fine to price a wager on, and without the collapse the game's top tier
   would be quietly unreachable for eight songs that happen to have a second pressing.

   The bars a hand must clear:
     1. ENOUGH TO SAY  — the song has ONLY_MIN_WORDS eligible words, so the hand is a choice out
                         of a real vocabulary. (Two-minute interludes fail this.)
     2. NO STEM TWINS  — "lover" never sits beside "lovers": they pay different amounts for what
                         looks like the same word.
     3. NOTHING SAID TWICE — a word barred once it has been dealt this run, since a run that
                         teaches you a word's count on page 3 and asks about it on page 8 is
                         grading its own answer key.
     4. NOTHING UNREADABLE — title words, transcribed babble and filler stay out, for the
                         reasons they always did.
   The old "the song must have a word nothing else sings" bar is GONE. It existed so a 5 was
   always on the table, and the tick no longer depends on one: a page is cleared by picking the
   rarest word in the hand, whatever it paid. Dropping it puts about ten more songs in the pool
   and buys a good hand shape where nothing is unique and the page is a judgement between a 2
   and a 3.
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
export const ONLY_HAND = 6;
export const ONLY_MIN_LETTERS = 3;   // the floor on a word: no stray letter is dealt as one
const ONLY_MIN_WORDS = 20;
// What a word pays, by how many songs in the whole catalogue sing it. 70% of eligible words sit
// in ten songs or more, so the floor is where an unconsidered answer lands and the top three
// tiers are the flex — which is the shape the game wants: always something, rarely much.
const ONLY_TIERS = [[1, 5], [2, 4], [4, 3], [9, 2]];
export function onlyHerePoints(count) {
  for (const [upTo, pts] of ONLY_TIERS) if (count <= upTo) return pts;
  return 1;
}
// What makes a card a FALSE EXOTIC: long enough to look like a find, sung by enough songs to be
// worth the floor. Length is the only "sounds rare" signal the data has, and on this catalogue
// it is a good one.
const ONLY_EXOTIC_LETTERS = 7;
const ONLY_EXOTIC_COUNT = 10;
function onlyExotic(x) { return x.word.length >= ONLY_EXOTIC_LETTERS && x.count >= ONLY_EXOTIC_COUNT; }

/* A variant's base title, when the base is really in the catalogue. "State Of Grace (Acoustic
   Version)" is a second pressing of a song already here; "Mary's Song (Oh My My My)" is not a
   variant of anything and keeps its own name. */
function baseTitle(title, titles) {
  const cut = String(title).replace(/\s*\([^()]*\)\s*$/, "").trim();
  return cut && cut !== title && titles.has(cut) ? cut : title;
}

/* Word -> the set of SONGS that sing it, counting a re-recording as the song it re-records.
   One pass over the catalogue, like the line index, and the only thing Only Here needs to be
   fair — the number this returns is what a card pays. */
export function buildWordIndex(songs) {
  const titles = new Set(songs.map((s) => s.title));
  const idx = new Map();
  songs.forEach((song) => {
    const owner = baseTitle(song.title, titles);
    lyricTokens(song.lyrics || "").forEach(({ key }) => {
      if (!idx.has(key)) idx.set(key, new Set());
      idx.get(key).add(owner);
    });
  });
  return idx;
}

/* Where the hand's cards were cut from: for each key, the first line of the song that sings it,
   split round the word as that line spells it, with the line's own spacing and punctuation kept
   on either side. The hand deals each card as a scrap cut out of this line, so the words either
   side run off under the tear. "First" is the same first sighting `lyricTokens` takes the card's
   spelling from, so the word on the scrap and the word in the line are always one spelling.
   ONE LINE CAN ONLY BE CUT ONCE. Two cards off the same line ("miss Wicklow sometimes") would
   otherwise each carry the other's word on its edge, which no pair of scissors could produce, so
   a scrap's run stops where a neighbouring card was taken out of the line. Null only for a key
   the song does not sing, which a dealt card never is. */
function firstCut(lines, key) {
  for (let li = 0; li < lines.length; li++) {
    const toks = lines[li].split(/(\s+)/);
    for (let i = 0; i < toks.length; i++) {
      const p = splitWord(toks[i]);
      if (toks[i] && wordKey(p ? p.core : toks[i]) === key) return { li, i, toks, p };
    }
  }
  return null;
}
export function onlyCuts(song, keys) {
  const lines = String(song.lyrics || "").split("\n");
  const found = keys.map((k) => firstCut(lines, k));
  return found.map((f, n) => {
    if (!f) return null;
    let from = 0, to = f.toks.length;
    found.forEach((g, m) => {
      if (!g || m === n || g.li !== f.li) return;
      if (g.i < f.i) from = Math.max(from, g.i + 1);
      else to = Math.min(to, g.i);
    });
    const { toks, i, p } = f;
    return { line: lines[f.li], pre: toks.slice(from, i).join("") + (p ? p.pre : ""),
             core: p ? p.core : toks[i], post: (p ? p.post : "") + toks.slice(i + 1, to).join("") };
  });
}
export function onlyLine(song, key) { return onlyCuts(song, [key])[0]; }

// Does this line sing the card? Keyed exactly as the index keys it, so a line the reveal lights
// is a line the count was taken from, never a looser match the count knows nothing about.
export function lineSingsWord(line, key) {
  return String(line).split(/\s+/).some((w) => {
    const p = splitWord(w);
    return wordKey(p ? p.core : w) === key;
  });
}

// Every token of a lyric blob, keyed and paired with the spelling it was sung in (the first
// one seen, so the hand deals "wonderstruck" the way the song sings it).
function lyricTokens(text) {
  const out = [], seen = new Set();
  text.split(/\s+/).forEach((w) => {
    const p = splitWord(w);
    const key = wordKey(p ? p.core : w);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push({ key, word: p ? p.core : w });
  });
  return out;
}

// A transcribed hook ("dadadada", "mindindind") is unique to its song and looks like a find,
// but nobody would ever call it a word and dealing it as a card is a joke at the player's
// expense. Two tells, both cheap: a bigram that comes round three times, or a word spelled out
// of three letters or fewer.
function babble(k) {
  const seen = new Map();
  for (let i = 0; i < k.length - 1; i++) {
    const g = k.slice(i, i + 2);
    seen.set(g, (seen.get(g) || 0) + 1);
    if (seen.get(g) >= 3) return true;
  }
  return new Set(k).size <= 3;
}

/* Bar 2. Crude on purpose: what it has to catch is a pair the eye reads as one word, and
   "lover"/"lovers"/"loving" all fold to the same root under this. It is never used to judge an
   answer, only to keep two cards from looking like the same card. */
function stemOf(k) {
  const m = /(ings|ing|ies|ied|ed|es|in|s)$/.exec(k);
  return m && k.length - m[1].length >= 3 ? k.slice(0, k.length - m[1].length) : k;
}

/* One hand, assembled to a SHAPE. The shape is the only ramp this game has left, and it is what
   makes a late page feel different from an early one without a single rule changing:
     • WIDE  (early pages) — one clear outlier sitting among words that are obviously common. A
                             clear 5 next to a clear 1, readable on instinct.
     • TIGHT (late pages)  — four or more words bunched in the same one-to-three band, at least
                             two of them plausibly unique, and a false exotic in with them. The
                             late pages should make you choose between two words you would swear
                             were both unique, which is where the reveal has its best surprises.
   Returns null when the song's vocabulary can't fill the shape; the caller records that, since
   a fallback silently makes the last five pages easier than they were designed to be. */
function onlyHand(priced, tight, rng) {
  const take = (pool, n, not) => shuffled(pool.filter((x) => !not.has(x.key)), rng).slice(0, n);
  const exotics = priced.filter(onlyExotic);

  if (tight) {
    // The anchor is the answer, and it is taken from the whole 1-to-3 band rather than only
    // from the unique words: a hand whose best card is worth 3 is one of the good shapes, and
    // a page that is a judgement between a 2 and a 3 is exactly what the late run wants.
    const rare = priced.filter((x) => x.count <= 3);
    if (rare.length < 1) return null;
    const anchor = pick(rare, rng);
    /* Everything else has to be STRICTLY commoner than the anchor. Two cards tied for rarest are
       both right, and the reveal says so — but a tie also means the choice couldn't be lost, so
       ties are left to happen where the vocabulary forces one rather than dealt on purpose. The
       relaxed pool below is where they come from. */
    const above = (min) => priced.filter((x) => x.key !== anchor.key && x.count > min);
    let pool = above(anchor.count);
    if (pool.length < ONLY_HAND - 1) pool = above(anchor.count - 1);
    if (pool.length < ONLY_HAND - 1) return null;
    // The near band is what makes it tight: cards close enough to the anchor to be argued for.
    const near = pool.filter((x) => x.count <= Math.max(6, anchor.count + 3));
    if (near.length < 3) return null;
    const held = new Set([anchor.key]);
    const hand = [anchor];
    take(near, 3, held).forEach((x) => { hand.push(x); held.add(x.key); });
    // The trap: a card that looks like a find and is worth the floor.
    take(exotics.filter((x) => pool.includes(x)), 1, held).forEach((x) => { hand.push(x); held.add(x.key); });
    take(pool, ONLY_HAND - hand.length, held).forEach((x) => { hand.push(x); held.add(x.key); });
    return hand.length === ONLY_HAND ? hand : null;
  }

  // Wide: one word at the bottom of the hand and nothing near it. The outlier is picked from
  // the rarest words the song has; everything else has to be a clear tier above it.
  const sorted = priced.slice().sort((a, b) => a.count - b.count);
  const anchor = pick(sorted.slice(0, 4), rng);
  if (!anchor) return null;
  const far = priced.filter((x) => x.count >= Math.max(5, anchor.count + 3));
  if (far.length < ONLY_HAND - 1) return null;
  const held = new Set([anchor.key]);
  const hand = [anchor];
  // A false exotic even here, so "the long word" is never a free read.
  take(exotics.filter((x) => far.includes(x)), 1, held).forEach((x) => { hand.push(x); held.add(x.key); });
  take(far, ONLY_HAND - hand.length, held).forEach((x) => { hand.push(x); held.add(x.key); });
  return hand.length === ONLY_HAND ? hand : null;
}

export function buildOnlyHerePuzzle(songs, wordIndex, rng = Math.random, tries = 120,
                                    avoid = null, opts = {}) {
  const usedWords = opts.words || null;
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    // Rest a song already played this run while there is catalogue left, then stop insisting
    // near the end of the budget rather than fail the page over it (Sing It Back's rule).
    if (avoid && avoid.has(song.title) && t < tries * 0.7) continue;

    // The title is written across the top of the page, so a card out of it is the page reading
    // itself back.
    const titleWords = new Set(lyricTokens(song.title).map((x) => x.key));
    const stems = new Set();
    const priced = [];
    lyricTokens(song.lyrics || "").forEach((x) => {
      if (x.key.length < ONLY_MIN_LETTERS) return;
      if (titleWords.has(x.key) || babble(x.key) || FILLER.has(x.key)) return;      // bar 4
      if (usedWords && usedWords.has(x.key)) return;                                // bar 3
      const st = stemOf(x.key);
      if (stems.has(st)) return;                                                    // bar 2
      const owners = wordIndex.get(x.key);
      if (!owners) return;
      stems.add(st);
      priced.push({ key: x.key, word: x.word, count: owners.size, points: onlyHerePoints(owners.size) });
    });
    if (priced.length < ONLY_MIN_WORDS) continue;                                   // bar 1

    let fallback = false;
    let hand = onlyHand(priced, !!opts.tight, rng);
    // A song whose vocabulary can't make the shape asked for still deals a page — it deals the
    // other shape and says so, because a page skipped is worse than a page a tier easier.
    if (!hand && opts.tight) { hand = onlyHand(priced, false, rng); fallback = !!hand; }
    if (!hand) continue;

    hand = shuffled(hand, rng);
    const low = Math.min(...hand.map((x) => x.count));
    return {
      song, hand,
      // Ties count as one answer between them. Two words the catalogue sings equally rarely are
      // equally right, and picking a winner between them arbitrarily would be a lie.
      optimal: hand.map((x, i) => (x.count === low ? i : -1)).filter((i) => i >= 0),
      shape: opts.tight && !fallback ? "tight" : "wide",
      fallback, eligible: priced.length,
    };
  }
  return null;
}

// Whether `tail` turns `stem` into one of its own forms rather than into another word: a plural or
// third person, a past tense or participle, a present participle (sung "in'" or written "ing"),
// with the doubled consonant those take ("stop", "stopped"). Comparatives and derivations are
// left out on purpose: "longer" is not "long" in a line, and "should"/"shoulder" is the reason.
function inflects(stem, tail) {
  const last = stem.slice(-1);
  if (tail === "s" || tail === "ed" || tail === "ing" || tail === "in") return true;
  if (tail === "es") return /(s|x|z|ch|sh|o)$/.test(stem);
  if (tail === "d") return last === "e";
  if (tail === "n") return last === "e" || last === "w";
  if (tail === "g") return stem.endsWith("in");                       // gettin -> getting
  if (tail.length === 3 && tail[0] === last && /^[^aeiou]$/.test(last)) return /^(ed|in)$/.test(tail.slice(1));
  return false;
}

export function judgeBlank(typed, puzzle, vocab = null) {
  const got = wordKey(typed);
  if (!got) return false;
  const want = wordKey(puzzle.answer);
  if (!want) return false;
  if (got === want) return true;

  const short = got.length <= want.length ? got : want;
  const long = got.length <= want.length ? want : got;
  // A shared stem: one is the other plus up to three letters. When what was typed is itself a
  // catalogue word, those letters have to be an inflection, or the rule takes a different word
  // for the right one, and some of them are opposites ("could" for "couldn't", "with" for
  // "without", "hear" for "heart"). A string the catalogue never sings keeps the plain prefix
  // rule, since that is a clipped or half-typed word rather than a second answer.
  if (short.length >= 4 && long.startsWith(short) && long.length - short.length <= 3 &&
      (!(vocab && vocab.has(got)) || inflects(short, long.slice(short.length)))) return true;

  if (got.length >= 4 && Math.abs(got.length - want.length) <= 1 &&
      !(vocab && vocab.has(got)) &&
      (levenshtein(got, want) <= 1 || swappedNeighbours(got, want))) return true;
  return false;
}

// The word as written, with nothing forgiven — the answer judgeBlank would take on its
// strictest setting. It lives here rather than at the call site so there is ONE definition of
// what a word is: a copy of wordKey in app.js would drift the first time punctuation or an
// apostrophe form was reconsidered, and then the two would quietly disagree about the same page.
export function blankExact(typed, puzzle) {
  const got = wordKey(typed);
  return !!got && got === wordKey(puzzle.answer);
}

/* ---------- Then What ----------
   One song, one line written out, and three lines that might follow it. Pick the one that
   really does and it locks into the page; four picks and the page is a verse.

   It is the only game on the shelf solved by SINGING — the line you are looking for is the one
   your head plays next — so everything here exists to make sure the song really does answer it,
   and to make sure it does so ONCE.

   The song is NAMED on the page, and the reason is Sing It Back's: the answer has to be pinned
   by a real song rather than by whatever four lines could be argued into. Nothing leaks either,
   since the question was never which song.

   EVERY DECOY IS FROM THIS SAME SONG, on every pick. The page used to open on decoys from other
   songs (pick 1 off another album, pick 2 off the same one) and that was a joke to anyone who
   knows the catalogue: the song is named at the top, so a line from any other song is ruled out
   by recognising it, without remembering a thing about what comes next. Half of every page's
   decoys asked the wrong question. A song too thin to supply its own is not dealt at all, rather
   than quietly falling back to other songs and reopening the same hole.

   And they are not just any line of the song. Each pick's decoys are chosen for being the line
   you could actually confuse with the answer (`chainDecoyRank`), best first:
     • PARALLEL — the line in the same slot of another section of the same kind: verse 2's third
       line when the answer is verse 1's, the bridge's other half, a chorus that changes on its
       last time round. "Is this the first verse or the second?" is the real mistake people make
       singing along, and it is the one thing only knowing the order can settle.
     • ECHO — a line that follows somewhere else a line that sounds like the anchor (they share
       an opening), so the decoy is the right answer to a question that was nearly asked.
     • LOOKALIKE — opens on the answer's first word, or ends on its rhyme.
     • LENGTH — about as long as the answer, so it doesn't stand out as a card.
     • any other line of the song.
   The rank is shuffled within a tier, and no decoy is used twice on one page (a card you have
   already seen proven wrong is a card you can rule out without singing).

   The bars a page must clear:
     1. READABLE     — every line on the page is short enough to sit on a card and has real
                       words in it; "oh oh oh" is not a line anybody can be asked to follow.
     2. DISTINCT     — the five lines of the chain are five different lines, and no candidate
                       repeats another by NORMALIZED text, or one right answer is dealt twice.
     3. ONE TRUE NEXT — every anchor in the chain is followed by the SAME line at every one of
                       its appearances in the song. Choruses come back and hand off elsewhere,
                       and two honest answers is the worst thing this game could ship.
     4. NOT ITSELF   — no line is followed by a copy of itself, or the correct card is the line
                       already sitting directly above it.
     5. NO SECOND WAY — a decoy is barred if it legitimately follows its anchor anywhere in the
                       song, which is bar 3 read from the other end.
     6. NOT A QUIBBLE — a decoy differs from the answer by two words or more (`wordEdits`).
   Across a run the caller asks for a chain kept inside one section for the early pages and lets
   the later ones cross a section boundary (`opts.cross`), which is a harder and more interesting
   question: does the verse hand off to the chorus, the pre-chorus, the bridge? The section is
   noted beside each line, so a boundary is discoverable on the page rather than a gotcha.
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
export const CHAIN_PICKS = 4;
export const CHAIN_CARDS = 3;
/* What each pick pays. Flat, because the picks are: every one is dealt same-song decoys, so
   none is a warm-up for a later one. It used to run 1, 1, 2, 2 to pay for a ramp in where the
   decoys came from, and paying double for the back half of a page with no ramp under it would
   only be noise. The sum is the page's worth and is what the roster entry's `points` has to say. */
export const CHAIN_PAY = [1, 1, 1, 1];
export const CHAIN_PAGE = CHAIN_PAY.reduce((a, b) => a + b, 0);
const CHAIN_MIN_WORDS = 3;
const CHAIN_MAX_WORDS = 11;

function chainLineOk(line) {                                            // bar 1
  const n = String(line).split(/\s+/).filter(Boolean).length;
  return n >= CHAIN_MIN_WORDS && n <= CHAIN_MAX_WORDS && contentWords(line).length >= 1;
}

/* Every line of the song in order, tagged with WHICH section it came from rather than just the
   section's name. Two choruses running back to back share a label but are different sections,
   and "did this chain cross a boundary?" has to mean the boundary and not the wording. */
function chainFlat(song) {
  const out = [];
  (Array.isArray(song.sections) ? song.sections : []).forEach((sec, si) => {
    (sec.lines || []).forEach((line, li) => out.push({ line, label: sec.label || "", si, li }));
  });
  return out;
}

/* "Verse 2" and "Verse 1" are the same KIND of section, which is what makes their third lines
   parallel. The number is dropped and nothing else, so a pre-chorus is never a chorus. */
const sectionKind = (label) => String(label).toLowerCase().replace(/\d+/g, "").trim();
const openingOf = (key, n) => key.split(" ").slice(0, n).join(" ");

/* Every other line of the song, ranked by how easily it could be mistaken for the line at `ai`
   (see the tiers in the comment above). Ties are shuffled so the same song does not deal the
   same trap every time. `from` names the tier, for the dev tools. */
const CHAIN_TIERS = ["parallel", "echo", "lookalike", "length", "song"];
const rhymeOf = (key) => key.slice(key.lastIndexOf(" ") + 1).slice(-3);
function chainDecoyRank(flat, keys, ai, rng) {
  const ans = flat[ai];
  const kind = sectionKind(ans.label);
  const ancKey = keys[ai - 1];
  const ancOpen = openingOf(ancKey, 2);
  const echo = ancOpen.includes(" ");
  const ansFirst = openingOf(keys[ai], 1);
  const ansRhyme = rhymeOf(keys[ai]);
  const ansLen = keys[ai].split(" ").length;
  const ranked = [];
  flat.forEach((f, m) => {
    if (m === ai || !keys[m]) return;
    let t = 4;
    if (f.si !== ans.si && f.li === ans.li && sectionKind(f.label) === kind) t = 0;
    else if (echo && m > 0 && keys[m - 1] !== ancKey && openingOf(keys[m - 1], 2) === ancOpen) t = 1;
    else if (openingOf(keys[m], 1) === ansFirst || rhymeOf(keys[m]) === ansRhyme) t = 2;
    else if (Math.abs(keys[m].split(" ").length - ansLen) <= 1) t = 3;
    ranked.push({ line: f.line, key: keys[m], t, r: rng() });
  });
  return ranked.sort((a, b) => a.t - b.t || a.r - b.r);
}

/* Bar 6, NOT A QUIBBLE: a decoy has to differ from the answer by at least two words. "I almost
   do" against "And I almost do" is the same line to anyone singing it, and a page that marks a
   fan wrong over a conjunction has failed at the one thing this game must never do (Sing It
   Back's rule: telling someone they are wrong about a lyric they know). Counted in words, so a
   comma or an apostrophe never makes two lines different. */
function wordEdits(a, b) {
  const x = a.split(" "), y = b.split(" ");
  let prev = y.map((_, j) => j + 1);
  prev.unshift(0);
  for (let i = 1; i <= x.length; i++) {
    const cur = [i];
    for (let j = 1; j <= y.length; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[y.length];
}

/* Bar 3, precomputed for the whole song: what follows each line EVERY time it is sung. A line
   whose set has more than one entry has more than one honest answer and can never be an anchor;
   the empty string stands for "and once it ended the song", which counts as a second answer for
   exactly the same reason. Read the other way round (bar 5), the same map says whether a decoy
   is a line that legitimately follows the anchor somewhere else. */
function chainSuccessors(keys) {
  const succ = new Map();
  keys.forEach((k, i) => {
    if (!succ.has(k)) succ.set(k, new Set());
    succ.get(k).add(i + 1 < keys.length ? keys[i + 1] : "");
  });
  return succ;
}

/* One pick's three cards: the answer and the two best-ranked lines of the song that are still
   allowed. `used` is the whole page's ledger (the chain itself and every decoy already dealt),
   so a decoy is never a line the page shows, and never a card the player has already seen
   proven wrong. `from` travels with each decoy so the dev tools can see which trap it is, since
   on screen three lines of one song look the same whatever made them a decoy. */
function chainCards(answer, ranked, used, succNext, rng) {
  const cards = [{ text: answer.line, right: true, from: "answer" }];
  const ansKey = normalizeLyric(answer.line);
  for (const c of ranked) {
    if (cards.length === CHAIN_CARDS) break;
    if (used.has(c.key) || !chainLineOk(c.line)) continue;
    if (succNext && succNext.has(c.key)) continue;                       // bar 5
    if (wordEdits(c.key, ansKey) < 2) continue;                          // bar 6
    used.add(c.key);
    cards.push({ text: c.line, right: false, from: CHAIN_TIERS[c.t] });
  }
  return cards.length === CHAIN_CARDS ? shuffled(cards, rng) : null;
}

export function buildChainPuzzle(songs, rng = Math.random, tries = 120, avoid = null, opts = {}) {
  const need = CHAIN_PICKS + 1;
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song || !Array.isArray(song.sections)) continue;
    // Rest a song already played this run while there is catalogue left, then stop insisting
    // near the end of the budget rather than fail the page over it (Sing It Back's rule).
    if (avoid && avoid.has(song.title) && t < tries * 0.7) continue;

    const flat = chainFlat(song);
    if (flat.length < need) continue;
    const keys = flat.map((f) => normalizeLyric(f.line));
    const succ = chainSuccessors(keys);

    const at = Math.floor(rng() * (flat.length - need + 1));
    const win = flat.slice(at, at + need);
    const wk = keys.slice(at, at + need);
    if (wk.some((k) => !k)) continue;
    if (!win.every((f) => chainLineOk(f.line))) continue;                // bar 1
    if (new Set(wk).size !== need) continue;                             // bar 2

    // Bar 3 and bar 4, on every anchor the page will ask about.
    let ok = true;
    for (let j = 0; j < CHAIN_PICKS; j++) {
      const s = succ.get(wk[j]);
      if (!s || s.size !== 1 || !s.has(wk[j + 1])) { ok = false; break; }
      if (wk[j] === wk[j + 1]) { ok = false; break; }                    // bar 4
    }
    if (!ok) continue;

    // Early pages keep the chain inside one section; later ones want it to cross. Asked for
    // rather than demanded, so a run near the end of its retry budget takes what it can get.
    const crossed = new Set(win.map((f) => f.si)).size > 1;
    if (opts.cross && !crossed && t < tries * 0.7) continue;
    if (!opts.cross && crossed) continue;

    // Every decoy off this song. One that can't find two for every pick is not dealt: falling
    // back to other songs would put the easy question back on the page.
    const used = new Set(wk);
    const picks = [];
    for (let j = 0; j < CHAIN_PICKS; j++) {
      const ai = at + j + 1;
      const cards = chainCards(flat[ai], chainDecoyRank(flat, keys, ai, rng), used, succ.get(wk[j]), rng);
      if (!cards) break;
      picks.push({ answer: { text: win[j + 1].line, label: win[j + 1].label, si: win[j + 1].si }, cards });
    }
    if (picks.length !== CHAIN_PICKS) continue;

    return {
      song, label: win[0].label,
      anchor: { text: win[0].line, label: win[0].label, si: win[0].si },
      picks, crossed,
    };
  }
  return null;
}

/* ---------- Ruthless Game ----------
   The whole song laid out as one stream of words, in the order it is sung, starting at its own
   first word. The screen reveals them one a second; this only has to hand over the stream and
   say where the line breaks fall, so the page fills in like a lyric sheet being written rather
   than like a sentence scrolling past.

   The guards here are thinner than any other builder's on the shelf, and that is the design
   rather than an oversight:
     • NO UNIQUE-LINE GUARD. Every other game shows a fragment and has to prove the fragment
       identifies one song. This one shows the song from the top and keeps going until it is
       named, so a shared opening is a hard page, not an unfair one — the stream always
       resolves.
     • NO TITLE GIVEAWAY GUARD, deliberately. The stream WILL eventually spell the title out,
       and that is the promise the game makes: you cannot be stuck forever, you can only be
       slow. Barring songs that say their own name early would cut some of the best-known
       songs in the catalogue out of a game about recognising songs. It does mean pages vary
       wildly in what they cost, which is what the ten-page run averages out.
   The one real bar is length: a stream has to be long enough that it can run to the title.

   What this game does bar, and no other game here has to, is the ENDABLE-PAGE rule. Every other
   game on the shelf shows you a line and lets you place it, so a page you cannot place is just a
   page you lose. This one bills you by the second until you name the thing, and the answer is
   judged on the exact title, so a page whose title cannot be arrived at is not a hard page — it
   is a page with no ending in it except the ninety-second give-up. Three shapes of song fail
   that, and all three stay in the catalogue everywhere else, including as guesses here:
     • NOT HERS TO SING. The Written for Others tracks are hers on paper only, and the
       Collaborations are someone else's record with her on it — the stream can open on a verse
       she has no part in, and the title belongs to a song most of the catalogue's readers have
       never filed under her name at all. Both albums are now barred by the wider rule below
       rather than by this one, and the reasoning is kept here because it is what the wider
       rule grew out of.
     • SECOND CUTS. A re-recording or a remix sings the SAME WORDS as the album version sitting
       beside it, so the stream is another song's stream and the honest answer ("State Of Grace")
       is rejected for missing a parenthesis. There is no play that ends that page except
       guessing at the packaging. A guest verse does not save it: Karma (Remix) opens on one
       ad-lib line and is Karma's stream from the second line on, which is the same trap arriving
       a few seconds later. What DOES save a remix is opening on words the album cut never sings
       and staying there long enough to be placed, which is why the other four remixes stay.
     • UNHEARD. Songs that never got a proper release, or got one nobody saw. Naming them is not
       recall, it is trivia about what leaked.
   Everything else stays, including the songs that never sing their own title: those are slow,
   not impossible, and the give-up is the valve for them. */
export const RUTHLESS_MIN_WORDS = 30;

/* ---------- THE TWELVE ----------
   The bonus shelf deals from the twelve studio albums and nothing else. That is a SCOPE
   decision rather than a fairness guard, and it belongs beside the bars above because it is the
   same judgement widened: Written for Others and Collaborations were already barred for being
   hers on paper only, and Holiday Collection and Songs From Movies are a covers record and a
   soundtrack shelf. Every game here asks you to recognise a song, and a page on Macavity or
   Silent Night tests what you happen to have heard rather than what you know. Before the cut
   each of the six games spent about six pages in a hundred off the twelve, and about ten on
   vault tracks, which is the deep-cut load that was always meant to be there.

   An ALLOWLIST rather than a skip list, on purpose: a pseudo-album added to songs.json later is
   out of the shelf until somebody decides it is in, which is the same reason STUDIO_ALBUMS
   exists at all. The vault tracks live on their albums and are untouched.

   It is barred HERE, in the one question every deal and every audit already asks, so the pool
   the dev tools report and the pool the builders draw from cannot drift apart. That makes it
   shelf-wide rather than this mode's: see bonusSongs in app.js. */
export const RUTHLESS_SKIP_TITLES = new Map([
  ["State Of Grace (Acoustic Version)", "second cut"],
  ["Forever & Always (Piano Version)", "second cut"],
  ["Snow On The Beach (Remix)", "second cut"],
  ["Karma (Remix)", "second cut"],
  ["Need", "unheard"],
  ["I'd Lie", "unheard"],
  ["Beautiful Eyes", "unheard"],
  ["I Heart ?", "unheard"],
]);

/* Why a song cannot be dealt, or null if it can. The builder and the dev tool both ask this one
   question, so what the pool reports and what the pool actually is cannot drift apart. */
export function ruthlessBar(song) {
  if (!song) return "no song";
  if (!STUDIO_ALBUMS.includes(song.album)) return "off the twelve";
  return RUTHLESS_SKIP_TITLES.get(song.title) || null;
}

/* THE LENS: which section the stream OPENS on. Six of them, and they are lenses on the catalogue
   the way Album Focus's albums are, not a difficulty slider — a chorus and a second verse are
   different puzzles rather than the same puzzle at two settings.

   The decision that makes the whole thing work is that a lens moves where the stream STARTS and
   never where it ENDS: it runs on through the rest of the song exactly as it always has. That is
   measured rather than chosen. Only 11 to 18% of verses and bridges ever sing the title inside
   themselves, so a stream fenced into its own section would run dry unnamed on most pages and the
   give-up would stop being a valve and start being the game. Running on puts every lens at 91 to
   97% named, a band tight enough that no lens needs a guard the default does not already have.

   `median` is the measured median words-to-the-title for that lens over the DEALABLE pool, and
   it is here because the give-up has to be priced against it (see `ruthlessGiveUp`). It is the
   one number to re-measure if the catalogue grows, or if the pool is narrowed under it: these
   six were re-stamped off `__dev.ruthless.lenses()` when the shelf went studio-only and four of
   them moved (76→77, 79→80, 22→23, 48→51). The Encore's four tracks moved Bridge again, 68→69.

   OUTRO IS NOT A LENS, and is barred by the endable-page rule above rather than by taste: 181
   songs have one, but only 43% can be named from it and the median stream left behind it is 19
   words, because an outro is at the end and there is nothing after it to run on into. Verse 3
   (45 songs) and everything below it is too thin to deal ten pages from.

   FROM THE TOP carries no `section` at all, and that is what makes it the song's own first word
   rather than a seventh place to drop in. It was called Verse 1 and it should not have been:
   opening on the first section labelled "verse 1" SKIPS THE INTRO, and 51 of 291 songs open on
   something else (39 on an intro, 9 on a chorus, 3 on a refrain or an unnumbered verse). So the
   old lens quietly started Cruel Summer, Getaway Car and Lavender Haze a few lines in, and for
   the other 240 it was the top of the song wearing a name that only happened to be true. Naming
   it for where it starts instead of for what is written there also drops the "no verse 1" bar,
   which is why this lens deals 251 where Verse 1 would deal 248 — the whole endable pool, since
   every song has a first word. It is the lens the shelf's own Ruthless Game used to be, which is why
   that game left the shelf rather than sitting beside its own duplicate. */
export const RUTHLESS_LENSES = [
  { id: "from-the-top", label: "From the Top", section: null,         median: 77 },
  { id: "verse-2",     label: "Verse 2",     section: "verse 2",     median: 80 },
  { id: "chorus",      label: "Chorus",      section: "chorus",      median: 23 },
  { id: "bridge",      label: "Bridge",      section: "bridge",      median: 69 },
  { id: "pre-chorus",  label: "Pre-Chorus",  section: "pre-chorus",  median: 51 },
  { id: "post-chorus", label: "Post-Chorus", section: "post-chorus", median: 39 },
];

export function ruthlessLens(id) {
  return RUTHLESS_LENSES.find((l) => l.id === id) || null;
}

/* Where the lens opens, as an index into `songLines(song)`, or -1 if the song hasn't got that
   section. The FIRST occurrence, always: Chorus appears 758 times over 260 songs and Pre-Chorus
   279 over 139, but the repeats are usually the same words again, so picking among them is fake
   variation that mostly just deals a shorter stream.

   A SECTIONLESS lens (From the Top) opens at word 0, the same answer as no lens at all. That is
   the one case that can never return -1, which is what gives it the full pool. */
function lensOpensAt(song, lens) {
  if (!lens || !lens.section) return 0;
  const want = lens.section;
  return songLines(song).findIndex(({ label }) => String(label).trim().toLowerCase() === want);
}

/* The song flattened into the stream the page writes out, opening at the lens's section. `br` is
   "this word opens a new line", which is what lets the page break where the song breaks without
   the screen having to know anything about sections — and the stream is never labelled with the
   section it has run on into, because announcing the chorus is a tell when the title usually
   lives there. No lens means the whole song from its first word, which is what the From the Top
   lens asks for by carrying no section. */
export function ruthlessStream(song, lens = null) {
  const start = lensOpensAt(song, lens);
  if (start < 0) return [];
  const stream = [];
  songLines(song).slice(start).forEach(({ line }, li) => {
    String(line).split(/\s+/).filter(Boolean).forEach((w, wi) => {
      stream.push({ text: w, br: wi === 0 && li > 0 });
    });
  });
  return stream;
}

/* What giving up costs under this lens. The shelf's numbers (20 words out, +90s) were priced
   against a 73-word median so that quitting at the earliest allowed moment costs about one and a
   half times an honest page, which is what keeps it a valve rather than a shortcut. Six lenses
   whose medians run from 22 to 79 cannot share one pair of constants: on Chorus, 20 words is
   already PAST the median answer and a 90s penalty makes giving up never correct, so the valve
   would be welded shut on the one lens whose pages are meant to be quick. So hold the two RATIOS
   and let each lens price itself off its own median. */
export const RUTHLESS_SKIP_AFTER_RATIO = 0.27; // of the median, before the give-up is offered
export const RUTHLESS_SKIP_TOTAL_RATIO = 1.5;  // of the median, for taking it at that moment
export function ruthlessGiveUp(lens) {
  const median = lens && lens.median ? lens.median : 73;
  const after = Math.max(5, Math.round(median * RUTHLESS_SKIP_AFTER_RATIO));
  return { after, penalty: Math.round(median * RUTHLESS_SKIP_TOTAL_RATIO) - after };
}

/* What counts as naming a page ON SIGHT under this lens — the bar the results strand hangs its
   stopwatch trinket on. Scaled off the lens's own median for the same reason the give-up is, and
   then CLAMPED, which the give-up is not: a snap has to be few words in the plain sense as well
   as few words relative to the lens, and 0.12 of From the Top's 76-word median is nine, which is
   already a line and a half of a song rather than a glance. So the ratio decides the ORDER (the
   easy lens is the tight one, because a chorus hands you the hook in three words and naming a
   song from that is not the same feat as naming one three words into a second verse) and the
   clamp decides the SCALE. Chorus lands at 3, From the Top and Verse 2 at the 8-word ceiling.

   Deliberately NOT the give-up's own `after`, which was the obvious anchor and is wrong: naming
   a page before the valve opened is what a player who knows the catalogue does on most pages, and
   a keepsake most beads wear is not a keepsake. */
export const RUTHLESS_SNAP_RATIO = 0.12;   // of the median, before the clamp
export const RUTHLESS_SNAP_MIN = 3;
export const RUTHLESS_SNAP_MAX = 8;
export function ruthlessSnap(lens) {
  const median = lens && lens.median ? lens.median : 73;
  const words = Math.round(median * RUTHLESS_SNAP_RATIO);
  return Math.max(RUTHLESS_SNAP_MIN, Math.min(RUTHLESS_SNAP_MAX, words));
}

/* Every song the game can deal under this lens, and every song it can't with the reason.
   Dev-facing: it is the only way to see the shape of the pool, since a run of ten pages never
   shows you the bars. A lens adds exactly one bar of its own, "no <section>", and then leans on
   the length bar the whole-song game already had — except From the Top, which carries no section
   and so adds no bar at all and deals the whole endable pool. It adds NO names-itself bar, deliberately and
   for the reason the endable-page rule gives above: a song that never sings its own title is slow,
   not unendable, and the give-up is its valve. */
export function ruthlessPool(songs, lens = null) {
  const deal = [], barred = [];
  (songs || []).forEach((song) => {
    let why = ruthlessBar(song);
    if (!why && lens && lensOpensAt(song, lens) < 0) why = `no ${lens.label.toLowerCase()}`;
    if (!why && ruthlessStream(song, lens).length < RUTHLESS_MIN_WORDS) why = "too short";
    if (why) barred.push({ title: song.title, album: song.album, why });
    else deal.push(song);
  });
  return { deal, barred };
}

/* The word of the stream at which the song has finished spelling its own title out, or null if it
   never does. Not a guard — nothing is barred for failing it — but it is the number the whole lens
   design rests on, so it has to be measurable rather than remembered. Compared on the SPACELESS
   normalized forms, since the stream arrives one word at a time and "imgonnagetyouback" only ever
   matches once the spaces are gone. */
export function ruthlessTitleAt(song, lens = null) {
  const want = normalizeLyric(String(song.title).split("(")[0]).replace(/\s/g, "");
  if (!want) return null;
  const stream = ruthlessStream(song, lens);
  let tail = "";
  for (let i = 0; i < stream.length; i++) {
    tail = (tail + normalizeLyric(stream[i].text).replace(/\s/g, "")).slice(-120);
    if (tail.includes(want)) return i + 1;
  }
  return null;
}

/* Every lens's pool and its real cost, measured over the catalogue in one go. This is the audit
   that matters for the lens design: each lens declares a `median` that prices its give-up, and
   this is what shows that the declared number still matches the catalogue after songs are added.
   `named` is the share of pages that can be ended by the stream alone rather than by the valve —
   it wants to stay in the whole-song game's own 85-to-94% band, and a lens that falls out of it
   is a lens whose give-up is doing too much of the work. */
export function ruthlessLensAudit(songs) {
  return RUTHLESS_LENSES.map((lens) => {
    const { deal, barred } = ruthlessPool(songs, lens);
    const at = deal.map((s) => ruthlessTitleAt(s, lens)).filter((n) => n != null).sort((a, b) => a - b);
    const by = {};
    barred.forEach((b) => { by[b.why] = (by[b.why] || 0) + 1; });
    const { after, penalty } = ruthlessGiveUp(lens);
    return {
      lens: lens.id,
      dealable: deal.length,
      barred: by,
      named: deal.length ? Math.round((at.length / deal.length) * 100) : 0,
      declared: lens.median,
      median: at.length ? at[Math.floor(at.length / 2)] : null,
      p90: at.length ? at[Math.floor(at.length * 0.9)] : null,
      giveUp: `${after}w +${penalty}s`,
    };
  });
}

/* WHERE THE SONG GIVES ITSELF AWAY, and whether it did so outside the lens you chose.

   The stream runs on past its section into the rest of the song (see ruthlessStream), so most
   pages eventually just sing their own title and hand the answer over. That moment is the one
   thing about a Ruthless page the mode never says out loud, and it is worth knowing because
   taking the handout is a different act from naming the song — the sheepish half of the mode,
   and the charm on it is written in that register.

   `at` is the count of words that will be ON the page when the title finishes arriving, which
   is the same number `ruthlessShown` holds, so the two can be compared directly. -1 when the
   song never sings its own title at all (26 of them don't) or when the title's words never line
   up with the lyric's — a title we cannot find simply never fires the charm, which is the safe
   direction for a comparison this one to fail in.

   `outside` asks whether that word fell past the lens's OWN opening section, which is what the
   charm actually means by a handout: you sat through your pre-chorus, the stream wandered into
   the chorus, and the chorus said the name. A sectionless lens (From the Top) opens on the whole
   song, so nothing can be outside it and `outside` is always false there — that lens is
   deliberately excluded rather than special-cased at the fold.

   Matching is per raw token so the index can't drift from the stream's own count, but a token is
   normalized and may expand to several words ("half-moon" -> "half moon"), so the walk keeps a
   word-to-token map rather than assuming the two run in step. */
export const RUTHLESS_HANDOUT_WORDS = 5;   // named within this many words of the title landing
export function ruthlessHandout(song, lens = null) {
  const miss = { at: -1, outside: false };
  if (!song || !song.title) return miss;
  const start = lensOpensAt(song, lens);
  if (start < 0) return miss;
  const lines = songLines(song).slice(start);
  const want = normalizeLyric(String(song.title).replace(/\([^)]*\)/g, " ")).split(" ").filter(Boolean);
  if (!want.length) return miss;

  // The lens's own opening run of lines, measured in the same raw tokens the page counts.
  const open = lens && lens.section ? lens.section : null;
  let lensWords = 0;
  if (open) {
    for (const { line, label } of lines) {
      if (String(label).trim().toLowerCase() !== open) break;
      lensWords += String(line).split(/\s+/).filter(Boolean).length;
    }
  }

  const words = [], owner = [];   // normalized word -> the raw token it came out of
  let tok = 0;
  lines.forEach(({ line }) => {
    String(line).split(/\s+/).filter(Boolean).forEach((w) => {
      tok++;
      normalizeLyric(w).split(" ").filter(Boolean).forEach((n) => { words.push(n); owner.push(tok); });
    });
  });

  for (let i = 0; i + want.length <= words.length; i++) {
    let hit = true;
    for (let j = 0; j < want.length; j++) if (words[i + j] !== want[j]) { hit = false; break; }
    if (!hit) continue;
    const at = owner[i + want.length - 1];
    return { at, outside: open !== null && at > lensWords };
  }
  return miss;
}

export function buildRuthlessPuzzle(songs, rng = Math.random, tries = 120, avoid = null, lens = null) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    if (avoid && avoid.has(song.title)) continue;
    if (ruthlessBar(song)) continue;
    const stream = ruthlessStream(song, lens);
    if (stream.length < RUTHLESS_MIN_WORDS) continue;
    const { at, outside } = ruthlessHandout(song, lens);
    /* Other versions of this song that also deal (All Too Well and its 10 Minute Version). They
       open word for word alike, so for as long as the page has only written words both of them
       sing, naming either is right: the player knows the song, and which pressing it is cannot
       be told from the page yet. Once the stream has run into words only one of them has, the
       page HAS told you, and the other title is a miss like any other. The judge compares
       against ruthlessShared, so each twin carries its own stream and its own handout. */
    const family = versionFamily(song.title);
    const twins = songs
      .filter((s) => s.title !== song.title && versionFamily(s.title) === family && !ruthlessBar(s))
      .map((s) => {
        const h = ruthlessHandout(s, lens);
        return { song: s, stream: ruthlessStream(s, lens), titleAt: h.at, titleOutside: h.outside };
      })
      .filter((tw) => tw.stream.length);
    return { song, stream, lens: lens ? lens.id : null, titleAt: at, titleOutside: outside, twins };
  }
  return null;
}

/* How many of stream A's opening words B sings too, in order: the point where the page would
   start telling the two versions apart. A word or two of difference is NOT that point, because
   versions re-sung years apart pick up small edits (All Too Well's bridge opens "And maybe",
   the 10 Minute Version's "Well, maybe") that nobody reading along could call. So a mismatch
   is forgiven when both streams line back up within RESYNC words on a run of ANCHOR shared
   ones; the split is where they can't, which is where one version runs into a verse, or a
   running order, the other doesn't have. Compared the way lyrics are matched everywhere else. */
const RUTHLESS_RESYNC = 3, RUTHLESS_ANCHOR = 3;
export function ruthlessShared(a, b) {
  const norm = (s) => s.map((w) => normalizeLyric(w.text));
  const A = norm(a), B = norm(b);
  const runs = (i, j) => {
    for (let k = 0; k < RUTHLESS_ANCHOR; k++) {
      if (i + k >= A.length) return true;   // A ends inside the anchor: nothing left to tell them apart
      if (A[i + k] !== B[j + k]) return false;
    }
    return true;
  };
  let i = 0, j = 0;
  while (i < A.length) {
    if (A[i] === B[j]) { i++; j++; continue; }
    let next = null;
    for (let x = 0; x <= RUTHLESS_RESYNC && !next; x++)
      for (let y = 0; y <= RUTHLESS_RESYNC && !next; y++)
        if ((x || y) && j + y < B.length && runs(i + x, j + y)) next = [i + x, j + y];
    if (!next) return i;
    [i, j] = next;
  }
  return A.length;
}


/* ---------- Running Order ----------
   The one game on the shelf that asks nothing about the lyrics: a page is an album and a
   track number, and the answer is the song that sits there.

   THE INDEX IS BUILT OFF THE WHOLE CATALOGUE AND THAT IS LOAD-BEARING, in the same way
   buildLineIndex is. A track number is a fact about the record, so it has to be counted over
   every song the album has, and `bonusSongs()` has already thrown four titles out of the
   twelve for being second cuts or unheard demos. Count the positions on the filtered pool and
   every song after the first gap moves up one, so the game would confidently ask for track 12
   and mark track 13 correct. Hand this allSongs; deal from the filtered pool separately.

   TWO SEPARATE QUESTIONS, AND A TITLE CAN FAIL EITHER ONE. What is NUMBERED is capped by
   ALBUM_TRACKS, the length of the pressing that album is counted against, because past it the
   arrays run on into songs that sit at no fixed number at all. What is ASKED is narrower
   still: a title in TRACK_ALT_TAKES is numbered but never dealt, because it is a second take
   of a song already sitting at another number on the same record and the page would have two
   honest answers. Both tables carry the full reasoning; the shape to hold on to here is that a
   barred title keeps its position, so nothing after it shifts.

   That cap is why high numbers are fair game, PROVIDED THE PAGE SAYS WHICH PRESSING IT MEANS.
   The Anthology runs to 31 and the numbering does not wobble on the way, so its track 31 is
   exactly as answerable as its track 3 — a longer count, not a murkier one. But the count only
   holds against the edition ALBUM_TRACKS measured, which is why every surface that words a page
   names it through TRACK_PRESSINGS: the twentieth song of 1989 is a real thing to be asked for
   and the record called 1989 has thirteen songs on it. */
export function buildTrackIndex(songs) {
  const byAlbum = new Map();
  for (const song of songs) {
    if (!ALBUM_TRACKS[song.album]) continue;
    if (!byAlbum.has(song.album)) byAlbum.set(song.album, []);
    byAlbum.get(song.album).push(song);
  }
  const of = new Map();       // song title -> { album, track, total, alt }
  const ask = new Set();      // the subset of those titles a page may actually ask for
  const albums = [];
  for (const album of STUDIO_ALBUMS) {
    const list = byAlbum.get(album);
    if (!list) continue;
    const total = Math.min(ALBUM_TRACKS[album], list.length);
    for (let i = 0; i < total; i++) {
      const title = list[i].title, alt = TRACK_ALT_TAKES.has(title);
      of.set(title, { album, track: i + 1, total, alt });
      if (!alt) ask.add(title);
    }
    albums.push(album);
  }
  return { of, ask, albums };
}

/* One page: an album, a number, and the song that answers it.

   `avoidAlbums` is a soft preference rather than a bar. Ten pages over twelve albums will
   repeat one and should, but three Midnights pages in a row reads as a broken shuffle. It is
   tried first and dropped if the pool cannot honour it, which is what keeps a run from ever
   failing to deal a page over a cosmetic preference. */
export function buildTrackPuzzle(songs, index, rng = Math.random, tries = 120, avoid = null, avoidAlbums = null) {
  const pool = songs.filter((song) => index.ask.has(song.title));
  if (!pool.length) return null;
  const pick = (fussy) => {
    for (let t = 0; t < tries; t++) {
      const song = pool[Math.floor(rng() * pool.length)];
      if (avoid && avoid.has(song.title)) continue;
      const spot = index.of.get(song.title);
      if (fussy && avoidAlbums && avoidAlbums.has(spot.album)) continue;
      return { song, album: spot.album, track: spot.track, total: spot.total };
    }
    return null;
  };
  return pick(true) || pick(false);
}

/* ---------- The Capitals ----------
   One page: a liner-note secret message, and the song it was printed under. Like Aaron or Jack
   there is no puzzle to construct — the question is AUTHORED DATA (data/secret-messages.json)
   and the builder's whole job is deciding what may be dealt.

   `messages` is a Map of title -> { album, message } and is the only thing that decides an
   answer. A song not in it hid no message and is not dealable, so the pool is the intersection
   of the shelf's own songs with that file: five records out of the twelve, seventy-two pages —
   the file holds seventy-three and `ruthlessBar` bars one of them as a second cut, which is why
   the pool is computed against `bonusSongs()` rather than counted out of the file.

   IT DEALS THE ALBUM AND THE PAGE MUST NOT PRINT IT (see the roster note) — it rides on the
   puzzle because the REVEAL and the back cover's listing both want it, and both happen after
   the page has been answered.

   No fairness guard beyond `avoid`, and none is needed. Every other builder here has to prove
   its page has exactly one honest answer; this one's answer is a sentence somebody printed in a
   booklet under one song's lyrics. The only thing that can go wrong is a title spelled
   differently in the two files, and that is caught at load rather than here (see
   `installSecretMessages`) for the reason the credits are: a page that quietly stops existing
   is the kind of bug nobody ever sees. */
export function buildCapitalsPuzzle(songs, messages, rng = Math.random, tries = 120, avoid = null) {
  const pool = songs.filter((song) => messages.has(song.title));
  if (!pool.length) return null;
  for (let t = 0; t < tries; t++) {
    const song = pool[Math.floor(rng() * pool.length)];
    if (avoid && avoid.has(song.title)) continue;
    const row = messages.get(song.title);
    return { song, album: row.album, message: row.message };
  }
  return null;
}

/* What the pool really is, asked the same way the builder asks it, so `bonusDealCount` and the
   dev tools can never drift from what a page can actually be dealt. */
export function capitalsDealCount(songs, messages) {
  return songs.filter((song) => messages.has(song.title)).length;
}

/* ---------- Aaron or Jack ----------
   One page: a song title, and which of the two produced it. There is no puzzle to construct
   here, so this builder does almost nothing — the whole game is in the DATA (data/producers.json)
   and in which songs are allowed to be dealt, both of which are decided before it is called.

   `credits` is a Map of title -> { by, credit, album } and is the only thing that decides an
   answer. A song not in it has neither man on it and is not dealable, so the builder is a
   filter rather than a search: the pool is the intersection of the shelf's own songs, the four
   PRODUCER_ALBUMS and the credits file, and a page is one of them picked at random.

   IT DEALS THE ALBUM BUT THE PAGE MUST NOT PRINT IT (see the roster note). It is carried on the
   puzzle because the REVEAL wants it, and because the listing on the back cover notes it —
   both of which happen after the page has been answered.

   No fairness guard beyond `avoid`, and none is needed: every other builder on this shelf has
   to prove its page has exactly one honest answer, and this one's answer is a credit somebody
   printed on a record. The one thing that could go wrong is a title the credits file spells
   differently from songs.json, and that is caught at load rather than here (see
   `installProducerCredits`), because a page silently vanishing from the pool is the kind of bug
   that never shows up as a bug. */
export function buildProducerPuzzle(songs, credits, rng = Math.random, tries = 120, avoid = null) {
  const pool = songs.filter((song) => PRODUCER_ALBUMS.includes(song.album) && credits.has(song.title));
  if (!pool.length) return null;
  for (let t = 0; t < tries; t++) {
    const song = pool[Math.floor(rng() * pool.length)];
    if (avoid && avoid.has(song.title)) continue;
    const c = credits.get(song.title);
    return { song, by: c.by, credit: c.credit, album: song.album };
  }
  return null;
}

/* How many songs this game can deal, which is what an endless run's no-repeat list is measured
   against. It asks the builder's own question rather than counting the pool, for Running
   Order's reason: a song on one of the four records that nobody in the pair produced is in
   `bonusSongs()` and is not a page. */
export function producerDealCount(songs, credits) {
  return songs.filter((song) => PRODUCER_ALBUMS.includes(song.album) && credits.has(song.title)).length;
}

/* ---------- Who Held The Pen ----------
   A song title, and how many people wrote it. Like Aaron or Jack there is no puzzle to
   construct — the answer is a fact somebody printed on a sleeve — so what this builder really
   does is DEAL, and the dealing is the whole design.

   `credits` is a Map of title -> { writers, credit, album, bucket }, built at load from
   data/writers.json. `bucket` is one of "solo" (she is the only name), "one" (one co-writer) or
   "room" (three names or more), and it is derived from the length of the credit rather than
   stored, because the file deliberately keeps the names and not a flag.

   THE PAGE PICKS ITS BUCKET FIRST AND ITS SONG SECOND, and that is the fairness rule this game
   turns on. The dealable pool measures 39 solo / 38 one / 21 room, so dealing a song at random
   would put a blind tapper on "solo" at 40% before they had read anything. Dealing a bucket at
   random and then a song out of it floors them at 33%, which is the number three cards ought to
   mean — measured over 2000 pages it runs 34 / 31 / 35. The same move the balanced pool makes
   for the album, made for the answer.

   IT IS THE BUCKET THAT IS CHOSEN AT RANDOM, NOT THE ORDER OF THE THREE. A page is never "the
   one you have not had yet": a run of ten off a three-way rotation is a run whose last pages can
   be counted out, which would be a far bigger leak than the one this fixes.

   AN EMPTY BUCKET IS SKIPPED RATHER THAN WAITED FOR. `avoid` bars every song already dealt this
   run, and the room bucket is the small one — 21 songs against 39 — so a long endless run spends
   it first. When that happens the choice is simply made among the buckets that still have a song
   left, which lets the run carry on off-balance rather than stall. It cannot happen inside a
   ten-page run at all, and by the time it can the reshuffle is close behind. */
export function penEligible(songs, credits) {
  return songs.filter((song) =>
    credits.has(song.title) &&
    (PEN_ALBUMS.includes(song.album) || PEN_GUESTS.includes(song.title)));
}

export function buildPenPuzzle(songs, credits, rng = Math.random, tries = 120, avoid = null) {
  const buckets = { solo: [], one: [], room: [] };
  penEligible(songs, credits).forEach((song) => {
    if (avoid && avoid.has(song.title)) return;
    const c = credits.get(song.title);
    if (buckets[c.bucket]) buckets[c.bucket].push(song);
  });
  const live = Object.keys(buckets).filter((k) => buckets[k].length);
  if (!live.length) return null;
  const bucket = live[Math.floor(rng() * live.length)];
  const pool = buckets[bucket];
  const song = pool[Math.floor(rng() * pool.length)];
  const c = credits.get(song.title);
  return { song, by: bucket, writers: c.writers, credit: c.credit, album: song.album,
           mates: Math.max(0, c.writers.length - 1) };
}

/* How many songs this game can deal, which is what an endless run's no-repeat list is measured
   against. It asks the builder's own question rather than counting the pool, for Aaron or Jack's
   reason: most of the twelve records are in `bonusSongs()` and are not pages here. */
export function penDealCount(songs, credits) {
  return penEligible(songs, credits).length;
}

/* ---------- Nashville ----------
   A title on the page and three doors: hers, not hers, or pass. The first game on the shelf that
   deals NOTHING FROM THE CATALOGUE — Aaron or Jack and Who Held The Pen ask a question about a
   song from `bonusSongs()`, where this one's pages are songs she never released and songs by
   other people entirely, so its whole pool is data/nashville.json and `songs` is never consulted.
   That is also why it takes its own ban list rather than leaning on `bonusRecentSongs`, which is
   keyed on catalogue titles that mean nothing here.

   THE SIDE IS PICKED FIRST AND THE TITLE SECOND, which is buildPenPuzzle's rule for
   buildPenPuzzle's reason, and on a two-door page it does more work than it does there. The
   pools are 58 and 64; dealing one title at random from the 122 would put "not hers" at 52.5%
   before the player had read a word, and every title barred from a long endless run would move
   that number again as the run went on. Choosing the SIDE first pins a blind guess at exactly
   half whatever the pools are doing, and it keeps doing so on page three hundred. The counts
   still matter for variety — a side that is running short repeats sooner — but they no longer
   have to be kept level to keep the game honest.

   NO DIFFICULTY RAMP, and the constant that used to promise one is gone. It was specified as
   "the easy end of both pools first, then both sides tighten" and there is no such end in the
   data: which of her titles are fan-famous and which of the decoys sit slightly off her register
   are both judgements nobody has written down, and inventing a `hard: true` flag by feel would
   be the era-tell coming back in as a field. Who Held The Pen has no ramp either and balances
   its deal instead, which is what this does. */
export function buildNashvillePuzzle(pool, rng = Math.random, avoid = null) {
  const live = [["hers", pool.hers], ["decoy", pool.decoys]]
    .map(([side, list]) => [side, avoid ? list.filter((e) => !avoid.has(e.title)) : list])
    .filter(([, list]) => list.length);
  if (!live.length) return null;
  const [side, list] = live[Math.floor(rng() * live.length)];
  const pick = list[Math.floor(rng() * list.length)];
  /* `song` is the shelf's own shape and is not a pretence: the page's subject IS a song, it is
     simply not one in songs.json — half of them are other people's records. Carrying it means
     the repeat bar and the back cover's listing read this game with no branch of their own,
     which is the trap this file keeps setting (see bonusBansRepeats). `album` is null on her
     side because there is no record, which is the whole answer. */
  return { song: { title: pick.title, album: pick.album || null },
           title: pick.title, side, hers: side === "hers",
           artist: pick.artist || null, album: pick.album || null, year: pick.year || null };
}

// Every title the game can deal, which is what an endless run's no-repeat list is measured
// against. Both sides, because either can be dealt on any page.
export function nashvilleDealCount(pool) {
  return pool ? pool.hers.length + pool.decoys.length : 0;
}

/* ---------- Track by Track ----------
   One album, its whole running order, and a clock that does not stop until the last blank is
   filled. The run IS the time and LOW WINS, which is the Ruthless Game's scoring rather than
   the shelf's, and it is why nothing here is worth points: a track is not right or wrong, it is
   early or late.

   WHY IT IS NOT RUNNING ORDER SAID TWICE. That game asks a lookup — track eight on Fearless,
   in isolation, against ten seconds. This one asks for the chain. Nobody recalls a tracklist as
   a table; they recall it as a thing that plays, which is why "what is track nine on 1989" is
   hard and reciting 1989 from the top is not. Random access and sequential recall are different
   memories, so the two games sit at opposite ends of the shelf's ramp on purpose.

   THERE IS NO DROPDOWN, AND THIS IS THE ONLY TITLE GAME ON THE SHELF WITHOUT ONE. Every other
   one has it, Ruthless included, and the reason it is right there and wrong here is what the
   list can tell you. On a Ruthless page the stream has either given the song away or it has
   not; a list of titles cannot answer that, so the dropdown is a transcription aid and nothing
   more. Here the question IS "what comes next on 1989", and a list of titles answers it
   directly: you would scan for the one you recognise, which turns recall into recognition and
   dissolves the game. Wrong guesses being free makes it worse, since walking the alphabet costs
   only seconds and seconds are all a wrong guess ever costs.

   WHAT REPLACES IT IS LENIENCE, NOT ASSISTANCE, and the distinction is the whole design. Take
   the dropdown away from a game scored purely in seconds and the clock quietly starts measuring
   TYPING: "The Last Great American Dynasty" is thirty characters, and across sixteen tracks the
   run would be as much about transcription as about the record. So a guess does not have to be
   the title, it has to be enough of it — any run of the title's own words, the last of them
   half-typed if you like. "dynasty" lands. "last great" lands. That is a thing you can only
   produce if you already know the answer, which a list of candidates is not, so the recall test
   survives intact and the transcription tax does not.

   FRAGMENTS RESOLVE AGAINST THE ASKABLE TITLES ONLY. The alt takes (see TRACK_ALT_TAKES) are
   printed onto the sheet rather than asked, so they must also be invisible to the matcher —
   otherwise "all too well" is ambiguous with the ten-minute version sitting ten slots below it,
   and the one title on Red everybody can produce becomes the one the game will not take. */

// A guess and a title are compared on normalizeTitle's key, which is the game's own idea of
// what two titles being the same means, so the shelf cannot drift from the main game over a
// curly apostrophe or a spelled-out numeral.
const trackKey = (s) => normalizeTitle(String(s == null ? "" : s));

/* A fragment must be this long before it counts, which is a probe guard rather than a fairness
   one: a single letter prefix-matches a word on nearly every album, and on the odd album where
   it matches exactly one it would hand over a track for one keystroke. An EXACT title is exempt
   and has to be, or "22" could never be typed on Red. */
const TRACK_FRAGMENT_MIN = 3;

/* One album's sheet: every slot the pressing has, in running order, alt takes marked. Built off
   buildTrackIndex rather than off the song list so the numbering is the same numbering Running
   Order asks its questions from — two games disagreeing about which song is track twelve would
   be the worst kind of bug here, silent and only visible to somebody who plays both. */
export function buildAlbumSheet(album, index) {
  const slots = [];
  for (const [title, spot] of index.of) {
    if (spot.album !== album) continue;
    slots.push({ n: spot.track, title, alt: spot.alt });
  }
  if (!slots.length) return null;
  slots.sort((a, b) => a.n - b.n);
  return { album, total: slots.length, slots, asked: slots.filter((s) => !s.alt).length };
}

// The candidate set a guess resolves against, normalized once per run rather than per keystroke.
export function trackCandidates(sheet) {
  return sheet.slots.filter((s) => !s.alt).map((s) => {
    const key = trackKey(s.title);
    return { title: s.title, key, tokens: key.split(" ") };
  });
}

// Does the guess appear as a run of consecutive words in the title, with the last word allowed
// to be half-typed? The prefix is on the LAST token only, because that is the one the player is
// still in the middle of; allowing it anywhere would let "e" stand in for "everything".
function tokenRun(tokens, want) {
  if (!want.length || want.length > tokens.length) return false;
  for (let i = 0; i + want.length <= tokens.length; i++) {
    let ok = true;
    for (let j = 0; j < want.length; j++) {
      const have = tokens[i + j], typed = want[j];
      if (j === want.length - 1 ? !have.startsWith(typed) : have !== typed) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

/* One slipped key, forgiven. The clock is the score here, so a run should never be decided by a
   transposed letter — but the forgiveness is deliberately narrower than judgeBlank's, because a
   near-miss that lands on a DIFFERENT track is a free slot rather than a kindness. Five
   characters minimum and one edit, against the whole title or against a single word of it. */
function nearTitle(cand, got, typed) {
  if (got.length >= 5 && Math.abs(got.length - cand.key.length) <= 1 &&
      (levenshtein(got, cand.key) <= 1 || swappedNeighbours(got, cand.key))) return true;
  if (typed.length !== 1 || got.length < 5) return false;
  return cand.tokens.some((t) => t.length >= 5 && Math.abs(t.length - got.length) <= 1 &&
    (levenshtein(t, got) <= 1 || swappedNeighbours(t, got)));
}

/* What a typed string resolves to, on this album and nothing else.

   `why` is for the dev tools and for nothing the player sees. THE PLAYER IS TOLD NOTHING BUT
   "not that": a reject never says whether the title is on this record, never says it belongs
   further down, and never says a fragment was ambiguous. All three are real information about
   the running order, which is the one thing the game is asking for, and "that one is on this
   album, just not here" would be the single biggest hint the page could give. */
export function resolveTrackGuess(typed, cands) {
  const got = trackKey(typed);
  if (!got) return { hit: null, why: "empty" };
  const words = got.split(" ");

  // The whole title as written always wins, and has to be checked first: a title that happens
  // to sit inside a longer one on the same record would otherwise come back ambiguous when it
  // was typed out in full and meant exactly.
  const exact = cands.filter((c) => c.key === got);
  if (exact.length) return { hit: exact[0].title, why: "exact" };

  // The same title with its spaces in other places: "im gonna get you back" is imgonnagetyouback
  // written out, not a near miss on some other track, so it is the title as written. Only when
  // exactly one track on the record squeezes to it, like the answer box's own spaceless rule.
  const squeezed = got.replace(/ /g, "");
  const spaced = cands.filter((c) => c.key.replace(/ /g, "") === squeezed);
  if (spaced.length === 1) return { hit: spaced[0].title, why: "spaces" };

  if (got.length >= TRACK_FRAGMENT_MIN) {
    const frag = cands.filter((c) => tokenRun(c.tokens, words));
    if (frag.length === 1) return { hit: frag[0].title, why: "fragment" };
    if (frag.length > 1) return { hit: null, why: "several" };
  }

  const near = cands.filter((c) => nearTitle(c, got, words));
  if (near.length === 1) return { hit: near[0].title, why: "typo" };
  if (near.length > 1) return { hit: null, why: "several" };
  return { hit: null, why: "unknown" };
}

// The judge. `want` is the title in the slot the sheet is currently open at, and nothing else
// clears it: a title from later on the same record is as wrong as one from another album,
// because the order is the question rather than the scenery.
export function judgeTrack(typed, cands, want) {
  const res = resolveTrackGuess(typed, cands);
  return { ...res, correct: !!res.hit && res.hit === want };
}

/* ---------- Word Cloud ----------
   A song's own words, scattered across the page at the size the song sings them, and nothing
   else. It is the only game on the shelf that strips word ORDER out: Name That Song, Redacted
   and Ruthless all hand over real lines, and a real line can be sung, which is most of how a
   player answers them. A cloud cannot be sung. What it asks is whether you know what a song's
   VOCABULARY is, which is a different thing to know and nothing else here tests it.

   TWO SEPARATE DECISIONS, AND THEY DO NOT USE THE SAME SIGNAL. That is the whole design and
   it is worth stating plainly, because collapsing them is the obvious "simplification" and it
   breaks the game in one of two ways depending on which one you keep:

     WHICH WORDS ARE ON THE PAGE is decided by RARITY. A word sung by more than CLOUD_DF_MAX
     of the songs in the catalogue never appears, however often this song sings it.
     HOW BIG EACH ONE IS drawn is decided by FREQUENCY — how many times THIS song sings it.

   Size by rarity instead and the page is over on sight: a one-of-one word like "Maserati"
   comes out at seventy-odd points and the cloud has printed its own answer. Select by
   frequency instead and the top of the page is "like", "never", "know", "back" — words every
   record sings, taking the type sizes that carry the most weight, with the song's own words
   shrunk into the tail underneath them. Measured on this catalogue before the bar was set:
   the words a song can genuinely lean on come in under forty songs ("give" 38, "stay" 39,
   "heard" 34, "people" 29) and the ones that identify nothing sit well above it ("first" 46,
   "said" 91, "never" 146, "when" 175, "like" 210). One number does what a stopword list would
   need a hand-maintained entry per word to do, including for the words nobody would think to
   write down.

   The rarity question is asked of `buildWordIndex`, the same index Only Here prices a card
   with, so a word's rarity means exactly one thing on this shelf. Like Only Here's, it counts
   over the WHOLE catalogue rather than the dealable pool: whether a word is unusual is a fact
   about Taylor's songs, not about which of them this shelf happens to deal.

   TITLE WORDS COME OUT FIRST, on their stems, before any of the above is weighed. A chorus
   repeats the title more than anything else in the song, so a cloud that keeps them is a
   cloud whose biggest word is the answer. */

// Words never shown, however this song leans on them: over this many songs sing them.
// See the measurements above — this is the number the whole game turns on.
const CLOUD_DF_MAX = 40;
// A page that cannot fill this many is not a page: re-roll rather than deal a thin cloud.
// Interludes and the two-minute sketches are what this throws out.
const CLOUD_MIN_WORDS = 12;

/* Which of a song's words go on its page, in the order they would be dealt. Exported for the
   dev panel, which wants to see the whole ranked list rather than the slice a page took. */
export function cloudWords(song, wordIndex, want = 25) {
  const titleStems = new Set(lyricTokens(song.title || "").map(({ key }) => stemOf(key)));
  const counts = new Map(), spelling = cloudSpellings(song);
  for (const w of String(song.lyrics || "").split(/\s+/)) {
    const p = splitWord(w);
    const k = wordKey(p ? p.core : w);
    if (!k) continue;
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const eligible = [];
  for (const [k, n] of counts) {
    if (k.length < 3 || FUNCTION_WORDS.has(k) || FILLER.has(k)) continue;
    if (titleStems.has(stemOf(k)) || babble(k)) continue;
    const idx = wordIndex.get(k);
    if (!idx || idx.size > CLOUD_DF_MAX) continue;
    eligible.push({ word: spelling.get(k) || k, key: k, count: n });
  }
  // Commonest in the song first, and never two words off one stem: "loved" beside "loving"
  // reads as one word written twice and spends two of the page's slots saying it.
  eligible.sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
  const out = [], stems = new Set();
  for (const e of eligible) {
    const s = stemOf(e.key);
    if (stems.has(s)) continue;
    stems.add(s);
    out.push(e);
    if (out.length >= want) break;
  }
  return out;
}

/* How each word is written on the page. A word keeps its capital only where the song
   capitalises it AWAY FROM THE START OF A LINE and does so more often than not — the one
   signal in the data that separates a proper noun from a sentence opening, with the "more
   often than not" there because quoted speech capitalises mid-line too ("I said, 'Stop'").
   Everything else is inked lowercase, so a cloud never hands over a tell purely from where a
   word happened to sit in a line. */
function cloudSpellings(song) {
  const mid = new Map(), cap = new Map(), first = new Map();
  for (const { line } of songLines(song)) {
    const words = String(line).split(/\s+/);
    words.forEach((w, i) => {
      const p = splitWord(w);
      const core = p ? p.core : w;
      const k = wordKey(core);
      if (!k) return;
      if (!first.has(k)) first.set(k, core);
      if (i === 0) return;
      mid.set(k, (mid.get(k) || 0) + 1);
      if (core[0] === core[0].toUpperCase()) cap.set(k, (cap.get(k) || 0) + 1);
    });
  }
  const out = new Map();
  for (const [k, core] of first) {
    const c = cap.get(k) || 0;
    out.set(k, c && c * 2 >= (mid.get(k) || 0) ? core : core.toLowerCase());
  }
  return out;
}

/* One page: a song, and the words its cloud is built from.

   `opts.words` is how wide the page is dealt, and it is the run's only ramp — the early pages
   hand over a generous cloud and the late ones a spare one, so a run gets harder without a
   single rule changing under the player. The ramp lives in the caller (see CLOUD_WIDE_PAGES)
   because it is a property of the RUN, not of the song. */
export function buildCloudPuzzle(songs, wordIndex, rng = Math.random, tries = 120, avoid = null, opts = {}) {
  const want = Math.max(CLOUD_MIN_WORDS, opts.words || 25);
  const pickSong = (fussy) => {
    for (let t = 0; t < tries; t++) {
      const song = songs[Math.floor(rng() * songs.length)];
      if (fussy && avoid && avoid.has(song.title)) continue;
      const words = cloudWords(song, wordIndex, want);
      if (words.length < CLOUD_MIN_WORDS) continue;
      return { song, words, label: "" };
    }
    return null;
  };
  return pickSong(true) || pickSong(false);
}
