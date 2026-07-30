"use strict";
/* Bonus-game puzzle builders — pure and state-free, like js/match.js.
   Nothing here reads app state: every builder takes the song list (plus prebuilt indexes)
   and returns a finished puzzle, so the shelf's games can be reasoned about and re-rolled
   without touching the main game loop.

   All three games work off REAL lyric lines, so all three need the same guarantee: the
   puzzle handed to the player must have exactly one defensible answer. Enforcing that is
   most of what this file does. */
import { normalizeLyric, levenshtein } from "./util.js";

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

/* Probe sets for the distributional word-class induction below. */
const DET = new Set(["the", "a", "an", "my", "your", "his", "her", "its", "our", "their", "this", "that", "these", "those", "of"]);
const VERBISH = new Set(["to", "i", "you", "we", "they", "he", "she", "it",
  "will", "would", "can", "could", "should", "must", "never", "always", "gonna", "wanna", "didnt", "dont", "cant", "wont"]);
const DEGREE = new Set(["so", "very", "too", "really", "more", "most", "such", "how"]);

const WORD_PARTS = /^([^\p{L}]*)(\p{L}[\p{L}'’]*)([^\p{L}]*)$/u;
function splitWord(w) {
  const m = WORD_PARTS.exec(w);
  return m ? { pre: m[1], core: m[2], post: m[3] } : null;
}
function wordKey(s) { return String(s).toLowerCase().replace(/[^\p{L}]/gu, ""); }
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function matchCase(replacement, original) {
  if (original === original.toUpperCase() && original.length > 1) return replacement.toUpperCase();
  if (original[0] === original[0].toUpperCase()) return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement;
}
function bump(map, k, v) {
  let inner = map.get(k);
  if (!inner) { inner = new Map(); map.set(k, inner); }
  inner.set(v, (inner.get(v) || 0) + 1);
}

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

/* ---------- Spot the Slip: the corpus model ----------
   Swapping a word at random produces word salad ("let the games sweet"), which a player
   defeats by spotting bad grammar without knowing a single song — exactly the wrong test.
   So the swap is constrained by two things learned from the catalogue itself:

     • ADJACENCY — `after`/`before` record which words genuinely follow and precede each
       other in real lyrics. A replacement must be attested on BOTH sides of the gap, so the
       local juncture is one Taylor actually wrote.
     • WORD CLASS — `klass` induces a coarse class per word distributionally, from what tends
       to precede it: words after determiners are noun-ish, after "to"/pronouns/modals are
       verb-ish, after "so"/"very" are adjective-ish. A swap must stay inside its class.

   Built once at load (it's a full pass over the catalogue) and reused for every puzzle. */
export function buildSlipContext(songs) {
  const after = new Map(), before = new Map(), prevOf = new Map(), freq = new Map();
  songs.forEach((song) => {
    songLines(song).forEach(({ line }) => {
      const toks = line.split(/\s+/).map(splitWord).filter(Boolean).map((p) => wordKey(p.core)).filter(Boolean);
      toks.forEach((t) => freq.set(t, (freq.get(t) || 0) + 1));
      for (let i = 0; i < toks.length - 1; i++) {
        bump(after, toks[i], toks[i + 1]);
        bump(before, toks[i + 1], toks[i]);
        bump(prevOf, toks[i + 1], toks[i]);
      }
    });
  });
  // Coarse class per word, only where the evidence is clear (>=3 probe hits, >=65% agreement).
  const klass = new Map();
  prevOf.forEach((counts, word) => {
    let n = 0, v = 0, a = 0;
    counts.forEach((c, prev) => {
      if (DET.has(prev)) n += c;
      else if (VERBISH.has(prev)) v += c;
      else if (DEGREE.has(prev)) a += c;
    });
    const total = n + v + a;
    if (total < 3) return;
    const best = Math.max(n, v, a);
    if (best / total < 0.65) return;
    klass.set(word, best === n ? "n" : best === v ? "v" : "a");
  });
  return { after, before, klass, freq };
}

/* Only noun-ish and adjective-ish words are swapped. The verb class is the noisiest to induce
   and produced most of the ungrammatical misfires in testing ("How'd you must it right
   around?"), so it's deliberately left out: a slightly narrower game beats a game you can
   beat on grammar alone. */
const SWAPPABLE = new Set(["n", "a"]);

/* ---------- Spot the Slip ----------
   Take a real lyric line, swap exactly one word for a plausible impostor, ask the player to
   tap it. The mechanic is trivial; authoring a fair swap is the entire game, so a candidate
   must clear five bars:
     1. TEMPTING   — the replacement comes from the game's own vocabulary of real Taylor lyric
                     words, so it reads like something she'd write.
     2. FOREIGN    — it appears nowhere in this song, so a fan who knows the song can rule it
                     out with certainty instead of half-remembering it from a later verse.
     3. GRAMMATICAL— it's attested on both sides of the gap and shares the original's word
                     class, so the line still scans and the puzzle tests memory, not grammar.
     4. NOT A NEAR-MISS — it can't merely inflect the original ("love" -> "loved"), and it has
                     to be a similar length so the line's shape doesn't betray the swap.
     5. UNAMBIGUOUS— the doctored line is checked against every real line in the catalogue. If
                     the swap happened to produce a genuine lyric, it's rejected — the player
                     would be "wrong" for spotting nothing wrong.
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
export function buildSlipPuzzle(songs, vocab, lineIndex, ctx, rng = Math.random, tries = 120, avoid = null) {
  const vocabSet = new Set(vocab.map(wordKey));
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    const songWords = new Set(contentWords(song.lyrics || ""));

    const candidates = songLines(song).filter(({ line }) => {
      const n = line.split(/\s+/).filter(Boolean).length;
      return n >= 5 && n <= 12 && contentWords(line).length >= 2;
    });
    if (!candidates.length) continue;

    const { line, label } = pick(candidates, rng);
    const raw = line.split(/\s+/).filter(Boolean);
    const parts = raw.map(splitWord);
    const toks = parts.map((p) => (p ? wordKey(p.core) : ""));

    // Interior slots only: a word with real words on both sides is the only position where
    // adjacency can be checked in both directions (bar 3).
    const slots = [];
    for (let i = 1; i < raw.length - 1; i++) {
      if (!parts[i] || !parts[i - 1] || !parts[i + 1]) continue;
      const k = toks[i];
      if (k.length < 4 || FUNCTION_WORDS.has(k) || FILLER.has(k)) continue;
      if (!SWAPPABLE.has(ctx.klass.get(k))) continue;
      // Never swap a word the line repeats. Changing one "last" in "this is the last time,
      // this is the last time" leaves the original standing right beside the fake, which both
      // gives the answer away and makes a case for tapping the untouched twin instead.
      if (toks.filter((x) => x === k).length > 1) continue;
      slots.push(i);
    }
    if (!slots.length) continue;

    for (const at of shuffled(slots, rng)) {
      const origKey = toks[at];
      const cls = ctx.klass.get(origKey);
      const prevFollowers = ctx.after.get(toks[at - 1]);
      const nextPreceders = ctx.before.get(toks[at + 1]);
      if (!prevFollowers || !nextPreceders) continue;
      const inLine = new Set(toks.filter(Boolean));

      const fakes = [];
      prevFollowers.forEach((_, w) => {
        if (!nextPreceders.has(w)) return;                              // bar 3: both sides attested
        if (!vocabSet.has(w) || w === origKey || inLine.has(w)) return; // bar 1
        if (Math.abs(w.length - origKey.length) > 3) return;            // bar 4: similar shape
        if (w.slice(0, 3) === origKey.slice(0, 3)) return;              // bar 4: not an inflection
        if (songWords.has(w)) return;                                   // bar 2: foreign to this song
        if (ctx.klass.get(w) !== cls) return;                           // bar 3: same word class
        if ((ctx.freq.get(w) || 0) < 4) return;                         // not a one-off oddity
        fakes.push(w);
      });
      if (!fakes.length) continue;

      // The eligible pool skews toward very common words, which would make the same handful of
      // fakes ("hard", "game") recognisable across runs. Draw from the less common end, and
      // skip anything the caller has seen recently — without that, small pools (everything
      // that fits "the ___ time") hand back the same word several times in one run.
      fakes.sort((a, b) => (ctx.freq.get(a) || 0) - (ctx.freq.get(b) || 0));
      let lean = fakes.slice(0, Math.max(1, Math.ceil(fakes.length * 0.5)));
      if (avoid && avoid.size) {
        const unseen = lean.filter((w) => !avoid.has(w));
        if (unseen.length) lean = unseen;
      }

      const fake = matchCase(pick(lean, rng), parts[at].core);
      const swapped = raw.map((w, i) => (i === at ? parts[i].pre + fake + parts[i].post : w));
      if (lineIndex.has(normalizeLyric(swapped.join(" ")))) continue;   // bar 5

      return {
        song, label,
        realLine: line,
        realWord: parts[at].core,
        fakeWord: fake,
        answer: at,
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

/* ---------- Name That Song ----------
   Show one real lyric line; the player names the song it came from. Two fairness guards:
     • UNIQUE      — the line must belong to exactly one song. Shared lines (repeated hooks,
       re-recordings) would mark a correct answer wrong.
     • NO GIVEAWAY — a line containing the song's own title answers itself, so those are
       skipped. This is what keeps it a recall test rather than a reading test. */
export function buildNamePuzzle(songs, lineIndex, rng = Math.random, tries = 120) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    const titleKey = normalizeLyric(song.title);

    const candidates = songLines(song).filter(({ line }) => {
      const n = line.split(/\s+/).filter(Boolean).length;
      if (n < 4 || n > 14) return false;
      if (contentWords(line).length < 3) return false;
      const key = normalizeLyric(line);
      if (!key) return false;
      const owners = lineIndex.get(key);
      if (!owners || owners.size !== 1) return false;
      if (titleKey && key.includes(titleKey)) return false;
      return true;
    });
    if (!candidates.length) continue;

    const { line, label } = pick(candidates, rng);
    return { song, label, line };
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

    const titleWords = new Set(normalizeLyric(song.title).split(/\s+/).filter(Boolean));
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
   `vocab` is a Set of catalogue word keys (the slip context's `freq` map serves). */
function swappedNeighbours(a, b) {
  if (a.length !== b.length) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (i >= a.length - 1) return false;
  return a[i] === b[i + 1] && a[i + 1] === b[i] &&
         a.slice(i + 2) === b.slice(i + 2);
}
export function judgeBlank(typed, puzzle, vocab = null) {
  const got = wordKey(typed);
  if (!got) return false;
  const want = wordKey(puzzle.answer);
  if (!want) return false;
  if (got === want) return true;

  const short = got.length <= want.length ? got : want;
  const long = got.length <= want.length ? want : got;
  if (short.length >= 4 && long.startsWith(short) && long.length - short.length <= 3) return true;

  if (got.length >= 4 && Math.abs(got.length - want.length) <= 1 &&
      !(vocab && vocab.has(got)) &&
      (levenshtein(got, want) <= 1 || swappedNeighbours(got, want))) return true;
  return false;
}
