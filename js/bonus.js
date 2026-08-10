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
export function buildNamePuzzle(songs, lineIndex, rng = Math.random, tries = 120, avoid = null) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    // A Name That Song run is ten distinct songs, not ten chances to recognise the same
    // chorus. Unlike the older builders' soft rests, this is an absolute bar: the catalogue
    // comfortably supplies a full run, and a repeated song would make the answer free.
    if (avoid && avoid.has(song.title)) continue;
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
    const titleWords = new Set(titleKey.split(/\s+/).filter(Boolean));

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
      owners = owners === null ? new Set(set) : new Set([...owners].filter((x) => set.has(x)));
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

/* ---------- Then What ----------
   One song, one line written out, and three lines that might follow it. Pick the one that
   really does and it locks into the page; four picks and the page is a verse.

   It is the only game on the shelf solved by SINGING — the line you are looking for is the one
   your head plays next — so everything here exists to make sure the song really does answer it,
   and to make sure it does so ONCE.

   The song is NAMED on the page, and the reason is Sing It Back's: the answer has to be pinned
   by a real song rather than by whatever four lines could be argued into. Nothing leaks either,
   since the question was never which song.

   The picks get harder as the page goes on, and the whole ramp lives in WHERE THE DECOYS COME
   FROM, so the rules never change and the crescendo is felt rather than announced:
     • pick 1  — other songs, other albums. A warm-up, often placeable on tone alone.
     • pick 2  — other songs, same album. The era stops helping.
     • picks 3 and 4 — THIS SAME SONG, lines the page hasn't shown. Vocabulary, voice, era and
       mood all match, so vibe-matching stops working and only knowing the order gets you there.
   A song too thin to supply its own decoys falls back to the album, and `fallbacks` counts how
   often that happened so an audit can say how much of the ramp is quietly not ramping.

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
   Across a run the caller asks for a chain kept inside one section for the early pages and lets
   the later ones cross a section boundary (`opts.cross`), which is a harder and more interesting
   question: does the verse hand off to the chorus, the pre-chorus, the bridge? The section is
   noted beside each line, so a boundary is discoverable on the page rather than a gotcha.
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
export const CHAIN_PICKS = 4;
export const CHAIN_CARDS = 3;
/* What each pick pays. It escalates because the picks genuinely get harder, and a ramp the
   player is asked to survive but never paid for reads as the game turning mean. The sum is the
   page's worth and is what the roster entry's `points` has to say. */
export const CHAIN_PAY = [1, 1, 2, 2];
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
    (sec.lines || []).forEach((line) => out.push({ line, label: sec.label || "", si }));
  });
  return out;
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

/* One pick's three cards. `from` travels with each decoy so the dev tools can see whether the
   ramp actually ramped — the difference between a page's easy pick and its hard one is invisible
   on screen by design, which means it is also invisible to anyone checking the design. */
function chainCards(answer, taken, pool, rng) {
  const cards = [{ text: answer.line, right: true, from: "answer" }];
  const seen = new Set(taken);
  for (let guard = 0; guard < 200 && cards.length < CHAIN_CARDS; guard++) {
    const cand = pool();
    if (!cand || !chainLineOk(cand.line)) continue;
    const k = normalizeLyric(cand.line);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    cards.push({ text: cand.line, right: false, from: cand.from });
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

    // The three decoy pools. Same-song lines are the hard ones and must be lines the page has
    // not shown and will not show — a decoy that turns up later as the true answer teaches the
    // player something false — and bar 5 keeps out anything that really does follow the anchor.
    const inChain = new Set(wk);
    const mine = flat.filter((f, i) => !inChain.has(keys[i]) && chainLineOk(f.line));
    const sameAlbum = songs.filter((s) => s !== song && s.album === song.album);
    const farAlbum = songs.filter((s) => s.album !== song.album);
    const fromSong = (anchorKey) => {
      const f = mine.length ? pick(mine, rng) : null;
      if (!f) return null;
      const s = succ.get(anchorKey);
      if (s && s.has(normalizeLyric(f.line))) return null;               // bar 5
      return { line: f.line, from: "song" };
    };
    const fromSongs = (pool, tag) => () => {
      const other = pool.length ? pick(pool, rng) : null;
      if (!other) return null;
      const lines = chainFlat(other);
      if (!lines.length) return null;
      return { line: pick(lines, rng).line, from: tag };
    };
    const fromAlbum = fromSongs(sameAlbum, "album");
    const fromFar = fromSongs(farAlbum, "far");

    // `hard` deals same-song decoys from pick 1, which is the shape a dev tool wants and no
    // page ever opens on.
    const wants = opts.hard ? ["song", "song", "song", "song"] : ["far", "album", "song", "song"];
    const picks = [];
    let fallbacks = 0;
    for (let j = 0; j < CHAIN_PICKS; j++) {
      const anchorKey = wk[j];
      const want = wants[j];
      let cards = null;
      if (want === "song") {
        cards = chainCards(win[j + 1], [anchorKey], () => fromSong(anchorKey), rng);
        // A song with too few spare lines can't supply its own decoys. The album stands in, and
        // the page says so in the only place it can: the count an audit reads.
        if (!cards) { cards = chainCards(win[j + 1], [anchorKey], fromAlbum, rng); if (cards) fallbacks++; }
      } else if (want === "album") {
        cards = chainCards(win[j + 1], [anchorKey], fromAlbum, rng);
        if (!cards) { cards = chainCards(win[j + 1], [anchorKey], fromFar, rng); if (cards) fallbacks++; }
      } else {
        cards = chainCards(win[j + 1], [anchorKey], fromFar, rng);
      }
      if (!cards) break;
      picks.push({ answer: { text: win[j + 1].line, label: win[j + 1].label, si: win[j + 1].si }, cards });
    }
    if (picks.length !== CHAIN_PICKS) continue;

    return {
      song, label: win[0].label,
      anchor: { text: win[0].line, label: win[0].label, si: win[0].si },
      picks, crossed, fallbacks,
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
       never filed under her name at all.
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
export const RUTHLESS_SKIP_ALBUMS = new Map([
  ["Written for Others", "not hers to sing"],
  ["Collaborations", "not hers to sing"],
]);
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
  return RUTHLESS_SKIP_ALBUMS.get(song.album) || RUTHLESS_SKIP_TITLES.get(song.title) || null;
}

/* THE LENS: which section the stream OPENS on. Six of them, and they are lenses on the catalogue
   the way Album Focus's albums are, not a difficulty slider — a chorus and a second verse are
   different puzzles rather than the same puzzle at two settings.

   The decision that makes the whole thing work is that a lens moves where the stream STARTS and
   never where it ENDS: it runs on through the rest of the song exactly as it always has. That is
   measured rather than chosen. Only 11 to 18% of verses and bridges ever sing the title inside
   themselves, so a stream fenced into its own section would run dry unnamed on most pages and the
   give-up would stop being a valve and start being the game. Running on puts every lens at 85 to
   94% named, which is the same band as the whole-song game's own 91%, so no lens needs a guard
   that the default does not already have.

   `median` is the measured median words-to-the-title for that lens over the catalogue, and it is
   here because the give-up has to be priced against it (see `ruthlessGiveUp`). It is the one
   number to re-measure if the catalogue grows.

   OUTRO IS NOT A LENS, and is barred by the endable-page rule above rather than by taste: 181
   songs have one, but only 43% can be named from it and the median stream left behind it is 19
   words, because an outro is at the end and there is nothing after it to run on into. Verse 3
   (45 songs) and everything below it is too thin to deal ten pages from.

   FROM THE TOP carries no `section` at all, and that is what makes it the song's own first word
   rather than a seventh place to drop in. It was called Verse 1 and it should not have been:
   opening on the first section labelled "verse 1" SKIPS THE INTRO, and 50 of 287 songs open on
   something else (39 on an intro, 8 on a chorus, 3 on a refrain or an unnumbered verse). So the
   old lens quietly started Cruel Summer, Getaway Car and Lavender Haze a few lines in, and for
   the other 237 it was the top of the song wearing a name that only happened to be true. Naming
   it for where it starts instead of for what is written there also drops the "no verse 1" bar,
   which is why this lens deals 263 where Verse 1 dealt 260 — the whole endable pool, since every
   song has a first word. It is the lens the shelf's own Ruthless Game used to be, which is why
   that game left the shelf rather than sitting beside its own duplicate. */
export const RUTHLESS_LENSES = [
  { id: "from-the-top", label: "From the Top", section: null,         median: 76 },
  { id: "verse-2",     label: "Verse 2",     section: "verse 2",     median: 79 },
  { id: "chorus",      label: "Chorus",      section: "chorus",      median: 22 },
  { id: "bridge",      label: "Bridge",      section: "bridge",      median: 68 },
  { id: "pre-chorus",  label: "Pre-Chorus",  section: "pre-chorus",  median: 48 },
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

export function buildRuthlessPuzzle(songs, rng = Math.random, tries = 120, avoid = null, lens = null) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    if (avoid && avoid.has(song.title)) continue;
    if (ruthlessBar(song)) continue;
    const stream = ruthlessStream(song, lens);
    if (stream.length < RUTHLESS_MIN_WORDS) continue;
    return { song, stream, lens: lens ? lens.id : null };
  }
  return null;
}
