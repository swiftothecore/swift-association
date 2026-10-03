import { escapeHtml, fuzzySubstringRatio, swappedNeighbours } from "../../js/util.js";
import { boundedWordBody, canonicalMatchText, exactWordBody, wordRegex, variantBody } from "../../js/match.js";
const FUZZY_MIN = 0.78, FUZZY_FOUR_MIN = 0.75, FUZZY_SWAP_MIN_LENGTH = 4;
const state = {section: "any", pos: "any"};

// Uncached search oracle retained to check complete hits and highlighting.
function sectionName(label) { return label && label.trim() ? label : "(intro)"; }
// The bare section TYPE (drop the trailing number): "Verse 1" -> "Verse", "" -> "(intro)".
function sectionType(label) {
  const t = (label || "").replace(/\s*\d+\s*$/, "").trim();
  return t || "(intro)";
}

// Per-section display labels, disambiguating repeats ("Chorus (2)") so a hit's
// location is unambiguous when a section type recurs in a song.
function sectionDisplays(song) {
  const totals = {};
  for (const sec of song.sections) { const n = sectionName(sec.label); totals[n] = (totals[n] || 0) + 1; }
  const seen = {};
  return song.sections.map((sec) => {
    const n = sectionName(sec.label);
    seen[n] = (seen[n] || 0) + 1;
    return totals[n] > 1 ? `${n} ${seen[n]}` : n;
  });
}

function makeHit(sec, si, li, label, html) {
  const lines = sec.lines || [];
  return {
    sectionLabel: label,
    sectionIndex: si,
    lineNo: li + 1,                                  // per-section, 1-based
    html,
    prev: li > 0 ? lines[li - 1] : null,
    next: li < lines.length - 1 ? lines[li + 1] : null,
  };
}

// Wrap a set of match ranges in <mark> (used by fuzzy, which locates its tokens by
// similarity rather than regex). Ranges may arrive unsorted or overlapping.
function markRanges(line, ranges) {
  const sorted = ranges.filter((r) => r.start >= 0).sort((a, b) => a.start - b.start);
  let html = "", pos = 0;
  for (const r of sorted) {
    if (r.start < pos) continue;   // overlaps an earlier mark — skip
    html += escapeHtml(line.slice(pos, r.start)) + "<mark>" +
      escapeHtml(line.slice(r.start, r.start + r.len)) + "</mark>";
    pos = r.start + r.len;
  }
  return html + escapeHtml(line.slice(pos));
}

// Highlight every occurrence of every term in one pass (stem/exact). Mirrors the game's
// highlightWord: prefer the exact word when the line holds it, else the stem variants, so
// "babe" never circles "baby". One combined global regex marks all the terms at once.
function termBody(line, term, strict) {
  if (strict) return exactWordBody(term);
  const exactRx = new RegExp(boundedWordBody(exactWordBody(term)), "iu");
  return exactRx.test(line) ? exactWordBody(term) : variantBody(term);
}
function highlightTerms(line, terms, strict) {
  const body = terms.map((t) => termBody(line, t, strict)).join("|");
  return escapeHtml(line).replace(new RegExp(boundedWordBody("(" + body + ")"), "giu"), "<mark>$1</mark>");
}

const WORD_TOKEN_RE = /[\p{L}\p{M}]+(?:['’‘][\p{L}\p{M}]+)*/gu;
const comparableToken = (text) => canonicalMatchText(text).toLowerCase();

// Every fuzzy token range for one term in a line. Four-letter words explicitly allow
// one edit, while three-letter words keep the normal bar so fuzzy mode does not turn a
// short prompt into most of the dictionary. Adjacent swaps are handled as one typo.
function fuzzyTermRanges(line, term) {
  const ql = comparableToken(term);
  const min = ql.length === 4 ? FUZZY_FOUR_MIN : FUZZY_MIN;
  const ranges = [];
  for (const m of line.matchAll(WORD_TOKEN_RE)) {
    const tok = m[0];
    if (tok.length < 2 || Math.abs(tok.length - ql.length) > 2) continue;   // cheap length prefilter
    const tl = comparableToken(tok);
    const swapped = ql.length >= FUZZY_SWAP_MIN_LENGTH && swappedNeighbours(ql, tl);
    const score = swapped ? 1 : fuzzySubstringRatio(ql, tl);
    if (score >= min) ranges.push({ start: m.index, len: tok.length, score });
  }
  return ranges;
}

// Substring ("letters inside a word") match: the query letters appearing consecutively
// anywhere inside a single word — test in pro⟨test⟩ed. This is deliberately NOT a game-valid
// match (the game only counts whole words and their forms), so it's a wordplay/curiosity
// tool and the UI labels it as such. Scoped to one token so it never runs across a space,
// and it returns just the matched letters' range (not the whole word) so the mark is tight.
function containsTermRanges(line, term) {
  const ql = comparableToken(term);
  const ranges = [];
  for (const m of line.matchAll(WORD_TOKEN_RE)) {
    const token = comparableToken(m[0]);
    let from = 0;
    while (from <= token.length - ql.length) {
      const idx = token.indexOf(ql, from);
      if (idx < 0) break;
      ranges.push({ start: m.index + idx, len: ql.length, score: 1 });
      from = idx + 1;
    }
  }
  return ranges;
}

// Position filter against a single range ("starts the line" / "ends the line" = only
// non-letters before / after it). With several terms it judges the first term's match.
function passesPosition(line, range) {
  if (state.pos === "start") return /^[^\p{L}\p{M}\p{N}]*$/u.test(line.slice(0, range.start));
  if (state.pos === "end") return /^[^\p{L}\p{M}\p{N}]*$/u.test(line.slice(range.start + range.len));
  return true;
}

function regexTermRanges(line, term, strict) {
  const rx = wordRegex(term, strict);
  const global = new RegExp(rx.source, rx.flags.includes("g") ? rx.flags : rx.flags + "g");
  return [...line.matchAll(global)].map((m) => ({ start: m.index, len: m[0].length, score: 1 }));
}

function termRanges(line, term, mode, strict) {
  if (mode === "fuzzy") return fuzzyTermRanges(line, term);
  if (mode === "contains") return containsTermRanges(line, term);
  return regexTermRanges(line, term, strict);
}

// Prefer the strongest match, but apply the structural position filter to all possible
// occurrences of the first term before choosing one. This lets "love is love" qualify
// for an end-of-line search even though its first occurrence is in the middle.
function chooseRange(line, candidates, enforcePosition) {
  const eligible = enforcePosition ? candidates.filter((r) => passesPosition(line, r)) : candidates;
  return eligible.reduce((best, r) => !best || r.score > best.score ? r : best, null);
}

// One song's hits for an AND-list of terms: a line counts only if EVERY term matches it
// (each per the active mode). Section filter is applied once per section; the position
// filter against the first term's match.
function searchSong(song, terms, mode) {
  const hits = [];
  const disp = sectionDisplays(song);
  const strict = mode === "exact";
  song.sections.forEach((sec, si) => {
    if (state.section !== "any" && sectionType(sec.label) !== state.section) return;
    (sec.lines || []).forEach((line, li) => {
      let ranges = [];
      for (let i = 0; i < terms.length; i++) {
        const candidates = termRanges(line, terms[i], mode, strict);
        const range = chooseRange(line, candidates, i === 0 && state.pos !== "any");
        if (!range) { ranges = null; break; }
        ranges.push(range);
      }
      if (!ranges) return;
      const html = mode === "fuzzy" || mode === "contains"
        ? markRanges(line, ranges) : highlightTerms(line, terms, strict);
      hits.push(makeHit(sec, si, li, disp[si], html));
    });
  });
  return hits;
}


export function referenceSearch(song, terms, mode, filters = {}) {
  Object.assign(state, {section: "any", pos: "any"}, filters);
  return searchSong(song, terms, mode);
}
