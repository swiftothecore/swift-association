// The terms of the page, as five marks.
//
// A round enforces rules it never says out loud: whether the notebook offers you titles as
// you type, whether a clue is there for the asking, whether the prompt word is allowed to sit
// in the answer's own title, whether a clock is running, and whether a sung line counts
// instead of a name. Most of them are invisible until you break them. The title rule is worse than invisible in a CHALLENGE:
// roundAcceptsSong strikes those songs out of the suggestions rather than refusing a pick, so
// nothing is refused and therefore nothing gets explained.
//
// This module is the single place the marks are built, and that is the point of it existing.
// They render in four unrelated places — the round's meta row, the difficulty cards, the
// challenge card and the how-to legend — and four hand-rolled copies is exactly how a
// vocabulary stops being one. State-free on purpose: callers hand over a plain terms object,
// and app.js owns reading the live levers (see currentRuleTerms).
import { escapeHtml } from "./util.js";

// Two pieces of shared grammar, learned once. A struck mark means "not available to you on
// this page"; a circled mark means the opposite corner of the same question — "nothing else
// is". Most marks only ever need the first, so most are two states and nothing more; a mark
// that has a third thing to say declares a `ring` and gets it. The quaver takes its own
// stroke rather than the shared one, for a drawing reason and not a meaning one — a quaver's axis runs bottom-left
// to top-right, the same direction the strike travels, so the shared stroke lays alongside
// the note instead of across it and reads as a stray pen mark. Same angle, same weight,
// nudged onto the note's actual mass. The drawings are in index.html.
export const RULE_MARKS = {
  suggest: {
    symbol: "rule-suggest", strike: "rule-strike",
    on: "suggestions are offered as you type",
    // "in full" rather than "the full title": on a lyric page this mark is struck beside a
    // CIRCLED quaver, and a line telling you to type the full title there contradicts the
    // mark next to it.
    off: "no suggestions — type it out in full",
  },
  hint: {
    symbol: "rule-hint", strike: "rule-strike",
    on: "a hint is there if you want one",
    off: "no hints on this page",
  },
  title: {
    symbol: "rule-title", strike: "rule-strike",
    on: "the word may sit in the song's title",
    off: "not a song with the word in its title",
  },
  clock: {
    symbol: "rule-clock", strike: "rule-strike",
    on: "a clock on every page",
    off: "no clock — take as long as you like",
  },
  // The one mark with three things to say, because "a sung line counts" and "a sung line is
  // the only thing that counts" are a bonus and a whole different game, and until the ring
  // arrived the only thing separating them on the row was the ABSENCE of the title mark
  // beside it — a difference you can only read if you already know both rows by heart.
  sung: {
    symbol: "rule-sung", strike: "rule-strike-note", ring: "rule-ring-note",
    on: "sing the line the word is in, for a verse bonus",
    off: "the full title, nothing else",
    only: "sing the line the word is in — a title won't do",
  },
};

// Fixed order, but only the marks that have something to say are drawn. A term the page has no
// opinion about is DROPPED and the rest close up, so the row never carries a hole.
//
// Reserving the empty slot was tried and cut. It made an absence readable by position, which is
// a real thing to lose: on Lyricist the row is now simply three marks, and "this page has no
// opinion about titles" no longer looks different from "this row happens to carry three marks".
// What still separates it is the pairing — a missing sleeve beside a lit quaver — and that was
// judged the better trade against a visible gap sitting in the middle of the notebook's chrome.
// The slot keeps its fixed WIDTH regardless, so the spacing between the marks that do render
// stays even; it is only the empty one that goes.
export const RULE_ORDER = ["suggest", "hint", "title", "clock", "sung"];

// Derive the four states from a bag of levers. Every caller goes through here — the live
// round, the difficulty cards and the challenge card — so a mode and the page it produces can
// never disagree about what they are claiming.
//
// `typed` and `namesSong` describe the SHAPE of the page rather than its difficulty, and they
// are what turn slots off. A tap grid has no line to type on, and Common Thread's answer is a
// bare word, so on those pages "suggestions" and "a sung line counts" would be describing an
// input that is not there. The title rule can only bite where the answer is a song judged
// against the prompt word, which rules out Common Thread (answers with a word) and Whose
// Line? (has no prompt word at all).
export function ruleTermsFrom({ dropdown, hint, noTitle, seconds, lyricOnly, titleOnly,
                                typed = true, namesSong = true } = {}) {
  const lyric = !!lyricOnly;
  return {
    // A lyric page never offers suggestions, whatever the mode it borrowed says — matching
    // effectiveDropdown, which short-circuits on exactly this.
    suggest: typed ? (lyric ? false : !!dropdown) : null,
    // Absent rather than struck on a lyric page, for the title mark's reason: the ladder's
    // top rung prints the lyric line, which on that page IS the answer, so hintsAllowed
    // retires the whole ladder there. A page with no hint to withhold has no opinion to
    // state about hints.
    hint: typed ? (lyric ? null : !!hint) : null,
    // Absent, not struck, on a lyric page: a title is not a thing that page HAS, so it has no
    // opinion to state about where the word may sit in one. Absent means the mark is simply
    // not drawn — see RULE_ORDER for why the row closes up rather than reserving the space.
    title: (namesSong && !lyric) ? !noTitle : null,
    clock: (seconds || 0) > 0,
    // Three states, and the middle one is the ordinary case: a sung line is worth a verse
    // bonus but a title still wins the page. Circled, it is the only thing the page takes.
    sung: typed ? (lyric ? "only" : !titleOnly) : null,
  };
}

// The two page shapes above, read off a challenge's rule. Kept here beside ruleTermsFrom so a
// new rule that swaps typing for tapping is one edit rather than a hunt.
const GRID_RULES = ["sea", "oddone", "whoseline"];
export function ruleShapeFor(rule) {
  return {
    typed: !GRID_RULES.includes(rule) && rule !== "common",
    namesSong: rule !== "common" && rule !== "whoseline",
  };
}

// A term's value as the key its copy and its overlay are filed under. `false` strikes,
// `"only"` circles, anything else truthy is the plain mark. Kept in one function because a
// caller that reads the raw value gets `"only"` wrong in the most dangerous possible way: it
// is a truthy string, so a bare `terms.sung ? on : off` silently prints the bonus line on a
// page where the bonus is the only way through.
function markState(v) { return v === false ? "off" : v === "only" ? "only" : "on"; }

// One mark. The state decides what is laid over the drawing: the strike, the ring, or
// nothing. A mark asked for a state it has no drawing for falls back to the plain mark
// rather than inventing a meaning.
export function ruleMarkMarkup(key, state) {
  const m = RULE_MARKS[key];
  if (!m) return "";
  const s = markState(state);
  const over = s === "off" ? m.strike : s === "only" ? m.ring : null;
  return `<svg class="rule-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">` +
    `<use href="#${m.symbol}"/>` +
    (over ? `<use href="#${over}"/>` : "") +
    `</svg>`;
}

// The terms of one page as a sentence, for the accessible label and for the how-to legend.
export function ruleTermsSentence(terms) {
  return RULE_ORDER
    .filter((k) => terms && terms[k] != null)
    .map((k) => RULE_MARKS[k][markState(terms[k])] || RULE_MARKS[k].on)
    .join("; ");
}

// terms: { suggest, hint, title, clock, sung }, each true (plain), false (struck), "only"
// (circled — the page takes nothing else), or null/undefined (this page has no opinion, so
// the mark is not drawn at all and its neighbours close up).
//
// The group carries ONE label rather than one per mark. Reading the meta row, a screen reader
// should hear the page's terms as a sentence sitting between the page number and the trinket
// count, not as four separate images to be stepped through every single round.
export function ruleSlotsMarkup(terms, { tips = true } = {}) {
  return RULE_ORDER.map((key) => {
    const v = terms ? terms[key] : null;
    if (v == null) return "";   // nothing to say: the row closes up rather than holding a gap

    const copy = RULE_MARKS[key][markState(v)] || RULE_MARKS[key].on;
    const tip = tips ? ` data-tip="${escapeHtml(copy)}" data-tip-delay="120"` : "";
    return `<span class="rule-slot"${tip}>${ruleMarkMarkup(key, v)}</span>`;
  }).join("");
}

// The label a group of marks should carry. Kept separate from the markup because the round's
// own strip is a long-lived element that gets refilled every page rather than rebuilt, so it
// sets this itself (see renderRuleTerms) instead of being replaced wholesale.
export function ruleTermsLabel(terms) {
  const sentence = ruleTermsSentence(terms);
  return sentence ? "This page: " + sentence : "";
}

export function ruleTermsMarkup(terms, { labelled = true, tips = true, cls = "" } = {}) {
  const label = labelled ? ruleTermsLabel(terms) : "";
  const attrs = label ? ` role="img" aria-label="${escapeHtml(label)}"` : ` aria-hidden="true"`;
  return `<span class="rule-terms${cls ? " " + cls : ""}"${attrs}>` +
    ruleSlotsMarkup(terms, { tips }) + `</span>`;
}

// The legend: every mark in both states with the line that explains it. Used by the how-to
// card, where the marks are being taught rather than recalled — so here each mark DOES get
// its own label, and the strike is shown beside the plain form rather than instead of it.
export function ruleLegendMarkup() {
  return `<div class="rule-legend">` + RULE_ORDER.map((key) => {
    const m = RULE_MARKS[key];
    // A mark with a ring teaches all three at once. Splitting the circled state onto a row
    // of its own would file it as a sixth mark to learn, when the whole point of the ring is
    // that it is the same mark saying something stronger.
    const states = ["on", "off", ...(m.ring && m.only ? ["only"] : [])];
    return `<div class="rule-legend-row">` +
      `<span class="rule-legend-pair" aria-hidden="true">` +
        states.map((st) => ruleMarkMarkup(key, st === "on" ? true : st === "off" ? false : "only")).join("") +
      `</span>` +
      `<span class="rule-legend-text">` +
        states.map((st) => `<span class="rule-legend-${st}">${escapeHtml(m[st])}</span>`).join("") +
      `</span>` +
    `</div>`;
  }).join("") + `</div>`;
}
