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

/* ---------- Invisible String ----------
   Five lyric lines down one side, the same five songs shuffled down the other, and a thread
   drawn from each line to where it belongs. Five pairs to a page, one point each.

   What this offers that nothing else on the shelf does is ELIMINATION: a player who genuinely
   knows three of the five still finishes the page, because the last two have nowhere else to
   go. Every other game here is five or ten separate all-or-nothings. That is the whole reason
   it exists, and it is why the page is scored per pair rather than per page — an
   all-or-nothing page would throw the elimination away again.

   The bars a page must clear:
     1. UNIQUE     — every line belongs to exactly one song (Name That Song's guard, reused
                     wholesale), or a "wrong" thread is defensibly right.
     2. FIVE SONGS — the five come from five different songs, or two right-hand titles would
                     accept the same line.
     3. NO GIVEAWAY— no line contains its own title, for Name That Song's reason: a line that
                     answers itself is a free pair, and here a free pair is worth more than
                     elsewhere because it also shortens the elimination for everything left.
     4. SPREAD     — at least STRING_MIN_ALBUMS albums are represented, so the page can't be
                     solved as an album quiz and the album tags stay a hint rather than the
                     answer.
     5. SHORT      — the lines are kept short, because they have to sit in a column beside a
                     second column and still be readable on a phone.
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
export const STRING_PAIRS = 5;
const STRING_MIN_ALBUMS = 3;
const STRING_MIN_WORDS = 4;
const STRING_MAX_WORDS = 9;

export function buildStringPuzzle(songs, lineIndex, rng = Math.random, tries = 120, avoid = null) {
  for (let t = 0; t < tries; t++) {
    const pairs = [];
    const used = new Set();
    const albums = new Set();
    // Draw one line from one song at a time. Each draw is cheap and independently guarded, so
    // a page is built by five small decisions rather than one big search.
    for (let guard = 0; guard < STRING_PAIRS * 12 && pairs.length < STRING_PAIRS; guard++) {
      const song = pick(songs, rng);
      if (!song || used.has(song.title)) continue;                        // bar 2
      // Rest a song that has already been on this run's board, while there is catalogue left.
      if (avoid && avoid.has(song.title) && guard < STRING_PAIRS * 8) continue;
      const titleKey = normalizeLyric(song.title);

      const candidates = songLines(song).filter(({ line }) => {
        const n = line.split(/\s+/).filter(Boolean).length;
        if (n < STRING_MIN_WORDS || n > STRING_MAX_WORDS) return false;   // bar 5
        if (contentWords(line).length < 2) return false;
        const key = normalizeLyric(line);
        if (!key) return false;
        const owners = lineIndex.get(key);
        if (!owners || owners.size !== 1) return false;                   // bar 1
        if (titleKey && key.includes(titleKey)) return false;             // bar 3
        return true;
      });
      if (!candidates.length) continue;

      const { line, label } = pick(candidates, rng);
      used.add(song.title);
      albums.add(song.album || "");
      pairs.push({ song, line, label });
    }
    if (pairs.length < STRING_PAIRS) continue;
    if (albums.size < STRING_MIN_ALBUMS) continue;                        // bar 4

    // `order[slot]` is which pair's TITLE sits in that slot on the right. A slot lining up
    // with its own line is left possible on purpose: a shuffle that guarantees nothing is in
    // place is a shuffle a player can read, and this one has to look like nothing at all.
    const order = shuffled(pairs.map((_, i) => i), rng);
    return { pairs, order };
  }
  return null;
}

/* ---------- Only Here ----------
   The shelf's one game with no fail state. It shows you a song and asks for a word that is in
   it; anything genuinely in there scores, and the fewer OTHER songs sing that word, the more
   it scores. A word nothing else in the catalogue sings is the top of the page.

   Everything about it runs off one index — `buildWordIndex`, a word to the set of songs that
   sing it — read twice at judging time: once for "is this word in this song?" and once for
   "how many songs is it in?". That is the whole validation, and it is why the game is generous
   without being loose: the page can't be argued with, because the catalogue answers it.

   The word is matched AS WRITTEN, not stemmed. Every other game here leans on the lenient
   matcher, and this one must not: the score IS the song count of a particular word, so
   accepting "lovers" for "lover" would pay out a number that belongs to a different word. The
   page says so in as many words, and a word that isn't in the song is a soft reject rather
   than a lost page — there is nothing to lose here but the clock.

   The bars a page must clear:
     1. ENOUGH TO SAY — the song has ONLY_MIN_WORDS eligible words, so there is a real search
                        rather than a short list to exhaust. (Two-minute interludes fail this.)
     2. REACHABLE TOP — at least one word is sung nowhere else, so "only here" is always on the
                        table. Ten of 287 songs have no such word; they simply don't come up.
     3. WORTH SHOWING — that word survives the babble filter, so the end card's "you could have
                        played…" is a real word rather than a transcribed hook ("dadadada").
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
export const ONLY_MIN_LETTERS = 3;   // the floor on an answer: no stray letter scores as a word
const ONLY_MIN_WORDS = 20;
// What a word pays, by how many songs in the whole catalogue sing it. 70% of eligible words sit
// in ten songs or more, so the floor is where an unconsidered answer lands and the top three
// tiers are the flex — which is the shape the game wants: always something, rarely much.
const ONLY_TIERS = [[1, 5], [2, 4], [4, 3], [9, 2]];
export function onlyHerePoints(count) {
  for (const [upTo, pts] of ONLY_TIERS) if (count <= upTo) return pts;
  return 1;
}

/* Word -> the set of song titles that sing it. One pass over the catalogue, like the line
   index, and the only thing Only Here needs to be fair. */
export function buildWordIndex(songs) {
  const idx = new Map();
  songs.forEach((song) => {
    lyricTokens(song.lyrics || "").forEach(({ key }) => {
      if (!idx.has(key)) idx.set(key, new Set());
      idx.get(key).add(song.title);
    });
  });
  return idx;
}

// Every token of a lyric blob, keyed and paired with the spelling it was sung in (the first
// one seen, so the reveal writes "wonderstruck" the way the song does).
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
// but nobody would ever write it and being shown it as the word you missed is a joke at the
// player's expense. Two tells, both cheap: a bigram that comes round three times, or a word
// spelled out of three letters or fewer.
function babble(k) {
  const seen = new Map();
  for (let i = 0; i < k.length - 1; i++) {
    const g = k.slice(i, i + 2);
    seen.set(g, (seen.get(g) || 0) + 1);
    if (seen.get(g) >= 3) return true;
  }
  return new Set(k).size <= 3;
}

export function buildOnlyHerePuzzle(songs, wordIndex, rng = Math.random, tries = 120, avoid = null) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    // Rest a song already played this run while there is catalogue left, then stop insisting
    // near the end of the budget rather than fail the page over it (Sing It Back's rule).
    if (avoid && avoid.has(song.title) && t < tries * 0.7) continue;

    // The title is written across the top of the page, so a word out of it is the page reading
    // itself back — barred here and soft-rejected at the input, for the same reason.
    const titleWords = new Set(lyricTokens(song.title).map((x) => x.key));
    const eligible = lyricTokens(song.lyrics || "")
      .filter((x) => x.key.length >= ONLY_MIN_LETTERS && !titleWords.has(x.key));
    if (eligible.length < ONLY_MIN_WORDS) continue;                       // bar 1

    const uniques = eligible.filter((x) => (wordIndex.get(x.key) || { size: 99 }).size === 1);
    if (!uniques.length) continue;                                        // bar 2
    const showable = uniques.filter((x) => !babble(x.key) && !FILLER.has(x.key));
    if (!showable.length) continue;                                       // bar 3

    // The one the end card holds up: the longest of them, drawn from the top few so the same
    // song doesn't always name the same word. Length is a rough proxy for "the word you'd
    // remember the song by", and on this catalogue it is a good one — "wonderstruck",
    // "situationship", "sweatshirt".
    showable.sort((a, b) => b.key.length - a.key.length);
    const best = pick(showable.slice(0, 3), rng);

    return { song, uniques: uniques.length, eligible: eligible.length, best: best.word };
  }
  return null;
}

/* Judging a word written on an Only Here page. Every rejection here is a SOFT one — the page
   is not lost, the clock just keeps running — so each says which of the three things went
   wrong rather than a flat no. */
export function judgeOnlyHere(typed, puzzle, wordIndex) {
  const raw = String(typed).trim();
  if (/\s/.test(raw)) return { ok: false, why: "one word only" };
  const key = wordKey(raw);
  if (!key || key.length < ONLY_MIN_LETTERS) return { ok: false, why: "too short to count" };
  const titleWords = new Set(lyricTokens(puzzle.song.title).map((x) => x.key));
  if (titleWords.has(key)) return { ok: false, why: "that one's in the title" };
  const owners = wordIndex.get(key);
  if (!owners || !owners.has(puzzle.song.title)) return { ok: false, why: "not in this one" };
  return { ok: true, key, count: owners.size, points: onlyHerePoints(owners.size) };
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

/* ---------- Out of Order ----------
   Four consecutive lines of one song, dealt out of order; put them back. It is the only game
   on the shelf you solve by SINGING — the line you are looking for is the one your head plays
   next — so everything here exists to make sure the song really does answer it.

   The song is NAMED on the page, for Sing It Back's reason: the answer has to be pinned by a
   real thing rather than by whatever an arrangement of four lines could plausibly be. Nothing
   is given away by naming it either, since the question is the order and not the song.

   Scored by JOINS rather than by slots: three joins to a page, one point for each line that
   leads into the one it really leads into. That is the unit of the knowledge being tested —
   what you know here is what comes next — and it is the only measure that reads honestly,
   since a permutation of four can never have exactly three slots right.

   The bars a page must clear:
     1. ONE BREATH   — the four lines are consecutive inside ONE section, so the order is the
                       song's own and not an editorial join across a section break.
     2. READABLE     — each line is short enough to sit on a card and has real words in it; a
                       window of "oh oh oh" has no order anybody could recover.
     3. DISTINCT     — no two of the four are the same line, or two arrangements are equally
                       right and one of them gets marked wrong.
     4. SUNG ONE WAY — the song never sings these same four lines in any other order anywhere
                       else, which a chorus that comes back rearranged otherwise does.
     5. A REAL DEAL  — the shuffle it opens on has no line in its own slot AND no join already
                       standing, so the page starts worth nothing and every point is earned.
   Returns null if nothing cleared the bars in `tries` attempts (the caller re-rolls). */
export const ORDER_LINES = 4;
export const ORDER_JOINS = ORDER_LINES - 1;
const ORDER_MIN_WORDS = 3;
const ORDER_MAX_WORDS = 10;
const ORDER_MIN_CONTENT = 6;   // content words across the whole window, so it isn't all filler

function orderLineOk(line) {
  const n = line.split(/\s+/).filter(Boolean).length;
  return n >= ORDER_MIN_WORDS && n <= ORDER_MAX_WORDS && contentWords(line).length >= 1;
}

/* Bar 4. Every consecutive four-line window in the whole song is compared against ours by its
   SET of lines: if the same four turn up anywhere else in a different sequence, the song sings
   them both ways and the page has two honest answers. The flat line list is scanned rather
   than each section on its own, which is the stricter read of "anywhere else". */
function orderSungOneWay(song, keys) {
  const sep = " || ";
  const want = [...keys].sort().join(sep);
  const mine = keys.join(sep);
  const all = songLines(song).map(({ line }) => normalizeLyric(line));
  for (let i = 0; i + ORDER_LINES <= all.length; i++) {
    const win = all.slice(i, i + ORDER_LINES);
    if ([...win].sort().join(sep) !== want) continue;
    if (win.join(sep) !== mine) return false;
  }
  return true;
}

/* Bar 5. A shuffle that leaves a line where it belongs, or a pair already in sequence, hands
   over a point the player never made a decision about. For four items there are plenty of
   arrangements with neither, so this is cheap to insist on. */
function orderDeal(n, rng) {
  for (let t = 0; t < 60; t++) {
    const perm = shuffled([...Array(n).keys()], rng);
    if (perm.some((v, i) => v === i)) continue;
    if (perm.some((v, i) => i > 0 && v === perm[i - 1] + 1)) continue;
    return perm;
  }
  return null;
}

export function buildOrderPuzzle(songs, rng = Math.random, tries = 120, avoid = null) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song || !Array.isArray(song.sections)) continue;
    // Rest a song already played this run while there is catalogue left, then stop insisting
    // near the end of the budget rather than fail the page over it (Sing It Back's rule).
    if (avoid && avoid.has(song.title) && t < tries * 0.7) continue;

    const sections = song.sections.filter((s) => Array.isArray(s.lines) && s.lines.length >= ORDER_LINES);
    if (!sections.length) continue;
    const sec = pick(sections, rng);
    const start = Math.floor(rng() * (sec.lines.length - ORDER_LINES + 1));
    const lines = sec.lines.slice(start, start + ORDER_LINES);          // bar 1

    if (!lines.every(orderLineOk)) continue;                            // bar 2
    if (lines.reduce((n, l) => n + contentWords(l).length, 0) < ORDER_MIN_CONTENT) continue;
    const keys = lines.map(normalizeLyric);
    if (keys.some((k) => !k)) continue;
    if (new Set(keys).size !== ORDER_LINES) continue;                   // bar 3
    if (!orderSungOneWay(song, keys)) continue;                         // bar 4

    const deal = orderDeal(ORDER_LINES, rng);                           // bar 5
    if (!deal) continue;
    return { song, label: sec.label || "", lines, deal };
  }
  return null;
}

/* How many of the three joins an arrangement holds. `slots[s]` is which line is sitting in
   slot s, so a join stands wherever the next slot holds the next line. Pure, so the board,
   the reveal and the dev tools all count it the same way. */
export function orderJoins(slots) {
  let n = 0;
  for (let s = 0; s < slots.length - 1; s++) if (slots[s + 1] === slots[s] + 1) n++;
  return n;
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
   The one real bar is length: a stream has to be long enough that it can run to the title. */
export const RUTHLESS_MIN_WORDS = 30;
export function buildRuthlessPuzzle(songs, rng = Math.random, tries = 120, avoid = null) {
  for (let t = 0; t < tries; t++) {
    const song = pick(songs, rng);
    if (!song) continue;
    if (avoid && avoid.has(song.title)) continue;
    const lines = songLines(song);
    if (!lines.length) continue;
    const stream = [];
    lines.forEach(({ line }, li) => {
      String(line).split(/\s+/).filter(Boolean).forEach((w, wi) => {
        // `br` is "this word opens a new line", which is what lets the page break where the
        // song breaks without the screen having to know anything about sections.
        stream.push({ text: w, br: wi === 0 && li > 0 });
      });
    });
    if (stream.length < RUTHLESS_MIN_WORDS) continue;
    return { song, stream };
  }
  return null;
}
