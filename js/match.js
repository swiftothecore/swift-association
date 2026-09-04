"use strict";
// Shared lyric-matching core. Pure, state-free, and reused by BOTH the game
// (js/app.js) and the lyrics searcher (/search) so they always agree on what a word
// "matches". Nothing here reads game state: every function takes an explicit `strict`
// boolean and does no censoring. The game's defaulting + censoring wrappers live in
// app.js (they resolve effectiveStrict()/censor() and then delegate here).
import { escapeRegExp, escapeHtml } from "./util.js";

// JavaScript's `\b` only understands ASCII word characters, so it treats the edge
// before an accented letter as a word boundary and the edge after one as no boundary
// at all. Lyrics also use typographic apostrophes while player-entered prompts use the
// straight form. Keep both details in one shared pattern layer so the game and searcher
// agree on exact matches, stem matches, and highlighting.
const WORD_CHAR = "\\p{L}\\p{M}\\p{N}_";
const APOSTROPHE_PATTERN = "['’‘]";

export function canonicalMatchText(text) {
  return String(text).replace(/[’‘]/g, "'");
}

export function exactWordBody(word) {
  return escapeRegExp(canonicalMatchText(word)).replace(/'/g, APOSTROPHE_PATTERN);
}

export function boundedWordBody(body) {
  return `(?<![${WORD_CHAR}])(?:${body})(?![${WORD_CHAR}])`;
}

// Prefix-stem match: the word as the start of a token, plus a suffix, so "gold"
// matches "golden", "dream" matches "dreamer". The leading boundary keeps it safe (e.g.
// "love" won't match "glove"/"clover"; "rain" won't match "train").
//
// The tail is a BOUNDED suffix set, never [a-z']*. An open tail reads as harmless
// until you count it: on the real catalogue it made "start/started/starting" answer
// the word "star" (80 of star's 83 songs held no "star" at all), "since/sing" answer
// "sin", "tears/teach" answer "tea", "earned" answer "ear". Over a hundred playable
// words had a MAJORITY of their valid songs be words unrelated to the prompt. Bounding
// the tail costs ~7% of matches, leaves every word still playable, and keeps the honest
// derivations (gold→golden, dream→dreamer, slow→slowly, blood→bloody).
// Deliberately absent: a bare "d". It would buy die→died but also car→card, men→mend,
// ten→tend; the silent-e rule below buys the same three-letter past tenses cleanly.
export const STEM_TAIL =
  "(?:s|es|ed|ing|in|ings|er|ers|est|y|ies|ied|ier|iest|able|en|ly|less|ness|ful|'s|'d|'ll|'re|'ve)?";
// These are the common inflections that CHANGE the stem first and so slip past even an
// open tail: silent-e drop (love→loving), consonant+y→i (city→cities), and final-consonant
// doubling (run→running). Each mutated stem is followed by its own bounded suffix set, so
// time→timing matches but "timber" never does.
// Bare "in" (not "in'") so it still matches before a trailing apostrophe. A closing
// boundary after the apostrophe cannot work, but the boundary after the "n" can
// backtrack onto the "n" inside "lovin'". Covers g-dropped forms either way.
export const INFLECT = "(?:ing|in|ings|ed|er|ers|es|y|ies|ied|ier|iest|able)";
export function wordVariants(word) {
  const w = canonicalMatchText(word).toLowerCase();
  const alts = [exactWordBody(w) + STEM_TAIL];   // base: word + one bounded suffix
  if (w.length >= 5 && w.endsWith("ing")) alts.push(exactWordBody(w.slice(0, -1)) + APOSTROPHE_PATTERN + "?");
  // Length 3, not 4: the three-letter -e words are exactly the ones the missing bare "d"
  // would otherwise strand (die→died, lie→lied, eye→eyed, ice→icy), and shortening it here
  // adds nothing else on the catalogue.
  if (w.length >= 3 && w.endsWith("e")) alts.push(exactWordBody(w.slice(0, -1)) + INFLECT);
  if (w.length >= 3 && /[^aeiou]y$/.test(w)) alts.push(exactWordBody(w.slice(0, -1) + "i") + INFLECT);
  if (w.length >= 3 && /[^aeiou][aeiou][^aeiouwxy]$/.test(w)) alts.push(exactWordBody(w + w.slice(-1)) + INFLECT);
  return alts;
}

// A handful of prompt words have an UNRELATED word sitting one silent "e" away, and English
// spells that other word's inflections as the prompt word plus an ordinary suffix: star + ed
// and stare + d are the same five letters, so "he stared at me" answered the word "star".
// No rule separates these — the consonant-doubling rule that wrongly gives car→carry is the
// same one that rightly gives star→starry — so the collisions are named instead.
// Each list is the OTHER word's family, never the prompt word's own: scar keeps scarred,
// scarring and scars, it only loses the forms that belong to "scare".
// Not listed, deliberately: breath/breathe, which are one family (breathed is a form of the
// prompt word, not a false friend), and mad/made, bar/bare-as-a-noun and suit/suite, which
// can't collide because the tail has no bare "e" to reach the other word's base form.
export const FALSE_FRIENDS = {
  bar:  ["bared", "bares", "baring", "barer", "barest"],                        // bare
  car:  ["cared", "cares", "caring", "carer", "carers",                         // care
         "carry", "carried", "carries", "carrier"],                             // carry
  plan: ["planed", "planes", "planing"],                                        // plane
  scar: ["scared", "scares", "scaring", "scary", "scarier", "scariest"],        // scare
  spin: ["spines"],                                                             // spine
  star: ["stared", "stares", "staring", "starin"],                              // stare
};
// A zero-width veto to sit just inside the leading boundary, so a false friend can never be the
// token the alternation lands on. Empty for the ~727 words with nothing to disown.
export function falseFriendGuard(word) {
  const bad = FALSE_FRIENDS[canonicalMatchText(word).toLowerCase()];
  return bad ? "(?!(?:" + bad.map(exactWordBody).join("|") + ")(?![" + WORD_CHAR + "]))" : "";
}
// The same lenient alternation WITHOUT the veto, or null for the ~727 words that have
// nothing to disown. It lets a caller tell "the veto refused this token" apart from "this
// token has nothing to do with the word", which is a distinction worth saying out loud:
// "he stared at me" on a page for "star" is a rejection a player will argue with, and the
// game's near-miss nudge answers it. Never use this to MATCH — the veto exists because
// these forms belong to another word entirely.
export function falseFriendRegex(word) {
  if (!FALSE_FRIENDS[canonicalMatchText(word).toLowerCase()]) return null;
  return new RegExp(boundedWordBody("(?:" + wordVariants(word).join("|") + ")"), "iu");
}
// The lenient alternation, guarded, ready to drop inside a group. Every caller that builds
// its own regex out of wordVariants should use this instead, so a form the matcher refuses
// can never still be the one a card highlights.
export function variantBody(word) {
  return falseFriendGuard(word) + "(?:" + wordVariants(word).join("|") + ")";
}

// Built regexes, memoised by word. Compiling one is cheap; compiling the same one six
// hundred thousand times is not. Matching a typed answer against the playable list builds
// one per word, 733 of them, and indexPlayableWords asks for another 1,466 before the
// notebook opens. Sharing the object is safe precisely because nothing here is global- or
// sticky-flagged: every caller only ever runs `.test` or `.exec` on it, and an "i" regex
// carries no lastIndex between calls, so two callers can hold the same one at once.
//
// The cache is capped and cleared wholesale on overflow rather than evicted one at a time.
// Player-typed answers reach wordRegex too, so the key space is not just the 733 playable
// words and must not be allowed to grow without limit; a plain wipe keeps the bookkeeping
// free, and the words that matter are re-compiled the next time they are asked for.
const RX_CACHE = new Map();
const RX_CACHE_MAX = 4000;

// Lenient (strict falsy) also matches the inflected forms above (cheat→cheats);
// strict requires the exact word. `strict` is an explicit boolean here — the game
// wrapper resolves its default from effectiveStrict() before calling.
export function wordRegex(word, strict) {
  const canonical = canonicalMatchText(word);
  const key = (strict ? "s\u0000" : "l\u0000") + canonical;
  const hit = RX_CACHE.get(key);
  if (hit) return hit;
  const body = strict ? exactWordBody(canonical) : variantBody(canonical);
  const rx = new RegExp(boundedWordBody(body), "iu");
  if (RX_CACHE.size >= RX_CACHE_MAX) RX_CACHE.clear();
  RX_CACHE.set(key, rx);
  return rx;
}

// The ADD-ONLY half of the lenient match: the word kept whole, with letters only ever added to
// the end of it. "haze" reaches "hazes", "hazed" and "hazing"; it does not reach "hazy", because
// getting there means taking the "e" off first. Two of the four alternations above survive the
// cut — the bounded suffix tail, and the doubled final consonant (admit → admitted, run →
// running, which really is only letters added) — and the two that mutate the stem are dropped:
// the silent-e drop and the consonant+y→i swap both REPLACE a letter before they add any, and
// the g-dropped "lovin'" alternate takes one away.
//
// This is not a general tightening of the game and must not become one: the ordinary lenient
// match is what makes a page winnable from a half-remembered lyric, and every mode still uses
// it. This exists for Common Thread, where the answer IS a word rather than a song. There, one
// word has to run through every line on the page, and "close enough to another form of it" makes
// the puzzle unreadable — you can see what the lines share or you cannot, and a rule that quietly
// accepts a word you can't see in front of you is a rule nobody can play to.
export function addedVariants(word) {
  const w = canonicalMatchText(word).toLowerCase();
  const alts = [exactWordBody(w) + STEM_TAIL];
  // A word that already ends in "e" spells its past and agent forms by adding a single letter to
  // the whole word — haze → hazed, love → loved, haze → hazer — and STEM_TAIL cannot reach them,
  // because it deliberately carries no bare "d" (it would buy car → card and ten → tend). The
  // lenient matcher gets there through the silent-e alternate instead, which is exactly the
  // alternate dropped above. Gating the bare tail on that final "e" is what keeps it honest: an
  // "e" is what makes the added letter a real inflection rather than the start of another word.
  if (w.length >= 3 && w.endsWith("e")) alts.push(exactWordBody(w) + "(?:d|rs?)");
  if (w.length >= 3 && /[^aeiou][aeiou][^aeiouwxy]$/.test(w)) alts.push(exactWordBody(w + w.slice(-1)) + INFLECT);
  return alts;
}
// Memoised beside wordRegex's cache, under its own key prefix, and carrying the same false-friend
// veto: "stared" is star + ed and so passes the add-only test on spelling alone, while still
// belonging to another word entirely.
export function addedLettersRegex(word) {
  const canonical = canonicalMatchText(word);
  const key = "a " + canonical;
  const hit = RX_CACHE.get(key);
  if (hit) return hit;
  const body = falseFriendGuard(canonical) + "(?:" + addedVariants(canonical).join("|") + ")";
  const rx = new RegExp(boundedWordBody(body), "iu");
  if (RX_CACHE.size >= RX_CACHE_MAX) RX_CACHE.clear();
  RX_CACHE.set(key, rx);
  return rx;
}

// The first lyric line bearing the word (trimmed). Prioritise a line with the *exact*
// prompt word over a looser stem variant (e.g. "babe" shouldn't surface a line whose
// only match is "baby"). Only the lenient path falls back; a strict caller already
// wants exact-only. Falls back to the first line if nothing matches.
export function extractLineWithWord(lyrics, word, strict) {
  const lines = lyrics.split("\n");
  if (!strict) {
    const exactRx = wordRegex(word, true);
    const exactLine = lines.find((l) => exactRx.test(l));
    if (exactLine) return exactLine.trim();
  }
  const rx = wordRegex(word, strict);
  const line = lines.find((l) => rx.test(l)) || lines[0] || "";
  return line.trim();
}

// Wrap the matched word in <mark> for display. The line must already be censored by
// the caller (censoring is a game concern, not a matching one). Mark the real word
// when the line actually contains it; only fall back to the looser stem variants when
// it doesn't, so "babe" never highlights "baby".
export function highlightWord(line, word, strict) {
  let body;
  if (strict) body = exactWordBody(word);
  else {
    const exactRx = wordRegex(word, true);   // same expression, so it shares the cache
    body = exactRx.test(line) ? exactWordBody(word) : variantBody(word);
  }
  const rx = new RegExp(boundedWordBody("(" + body + ")"), "giu");
  return escapeHtml(line).replace(rx, "<mark>$1</mark>");
}
