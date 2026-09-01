// The terms of the page, as four marks.
//
// A round enforces rules it never says out loud: whether the notebook offers you titles as
// you type, whether the prompt word is allowed to sit in the answer's own title, whether a
// clock is running, and whether a sung line counts instead of a name. Three of the four are
// invisible until you break them. The title rule is worse than invisible in a CHALLENGE:
// roundAcceptsSong strikes those songs out of the suggestions rather than refusing a pick, so
// nothing is refused and therefore nothing gets explained.
//
// This module is the single place the marks are built, and that is the point of it existing.
// They render in four unrelated places — the round's meta row, the difficulty cards, the
// challenge card and the how-to legend — and four hand-rolled copies is exactly how a
// vocabulary stops being one. State-free on purpose: callers hand over a plain terms object,
// and app.js owns reading the live levers (see currentRuleTerms).
import { escapeHtml } from "./util.js";

// One shared grammar, learned once: a struck mark means "not available to you on this page".
// Every mark is two states and nothing more. The quaver takes its own stroke rather than the
// shared one, for a drawing reason and not a meaning one — a quaver's axis runs bottom-left
// to top-right, the same direction the strike travels, so the shared stroke lays alongside
// the note instead of across it and reads as a stray pen mark. Same angle, same weight,
// nudged onto the note's actual mass. The drawings are in index.html.
export const RULE_MARKS = {
  suggest: {
    symbol: "rule-suggest", strike: "rule-strike",
    on: "suggestions are offered as you type",
    off: "no suggestions — type the full title",
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
  sung: {
    symbol: "rule-sung", strike: "rule-strike-note",
    on: "sing the line the word is in, for a verse bonus",
    off: "the full title, nothing else",
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
export const RULE_ORDER = ["suggest", "title", "clock", "sung"];

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
export function ruleTermsFrom({ dropdown, noTitle, seconds, lyricOnly, titleOnly,
                                typed = true, namesSong = true } = {}) {
  const lyric = !!lyricOnly;
  return {
    // A lyric page never offers suggestions, whatever the mode it borrowed says — matching
    // effectiveDropdown, which short-circuits on exactly this.
    suggest: typed ? (lyric ? false : !!dropdown) : null,
    // Absent, not struck, on a lyric page: a title is not a thing that page HAS, so it has no
    // opinion to state about where the word may sit in one. Absent means the mark is simply
    // not drawn — see RULE_ORDER for why the row closes up rather than reserving the space.
    title: (namesSong && !lyric) ? !noTitle : null,
    clock: (seconds || 0) > 0,
    sung: typed ? (lyric || !titleOnly) : null,
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

// One mark. `on` false draws the strike over it; the caller has already decided which.
export function ruleMarkMarkup(key, on) {
  const m = RULE_MARKS[key];
  if (!m) return "";
  return `<svg class="rule-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">` +
    `<use href="#${m.symbol}"/>` +
    (on ? "" : `<use href="#${m.strike}"/>`) +
    `</svg>`;
}

// The terms of one page as a sentence, for the accessible label and for the how-to legend.
export function ruleTermsSentence(terms) {
  return RULE_ORDER
    .filter((k) => terms && terms[k] != null)
    .map((k) => RULE_MARKS[k][terms[k] ? "on" : "off"])
    .join("; ");
}

// terms: { suggest, title, clock, sung }, each true (plain), false (struck), or null/undefined
// (this page has no opinion — the mark is not drawn at all and its neighbours close up).
//
// The group carries ONE label rather than one per mark. Reading the meta row, a screen reader
// should hear the page's terms as a sentence sitting between the page number and the trinket
// count, not as four separate images to be stepped through every single round.
export function ruleSlotsMarkup(terms, { tips = true } = {}) {
  return RULE_ORDER.map((key) => {
    const v = terms ? terms[key] : null;
    if (v == null) return "";   // nothing to say: the row closes up rather than holding a gap

    const tip = tips ? ` data-tip="${escapeHtml(RULE_MARKS[key][v ? "on" : "off"])}" data-tip-delay="120"` : "";
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
    return `<div class="rule-legend-row">` +
      `<span class="rule-legend-pair" aria-hidden="true">` +
        ruleMarkMarkup(key, true) + ruleMarkMarkup(key, false) +
      `</span>` +
      `<span class="rule-legend-text">` +
        `<span class="rule-legend-on">${escapeHtml(m.on)}</span>` +
        `<span class="rule-legend-off">${escapeHtml(m.off)}</span>` +
      `</span>` +
    `</div>`;
  }).join("") + `</div>`;
}
