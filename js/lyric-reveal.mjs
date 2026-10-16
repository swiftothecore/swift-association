"use strict";

// Pure lyric-reveal geometry. Rendering, censoring and the active word-matching rules stay in
// app.js; this module only maps one displayed lyric span back onto the song's structured
// sections and returns the lines around that exact occurrence. Keeping it state-free makes the
// result-screen behaviour testable without booting the whole notebook.

function defaultNormalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\$/g, "s")
    .replace(/[&+]/g, "and")
    .replace(/[().!?,:;\"'…]/g, "")
    .replace(/[-–—/]/g, " ")
    .replace(/ing\b/g, "in")
    .replace(/\s+/g, " ")
    .trim();
}

export function revealSections(song) {
  const structured = Array.isArray(song && song.sections) && song.sections.length
    ? song.sections
    : [{ label: "", lines: String((song && song.lyrics) || "").split("\n") }];
  return structured.map((section, sectionIndex) => ({
    sectionIndex,
    label: String(section.label || ""),
    lines: (Array.isArray(section.lines) ? section.lines : [])
      .map((text, sourceLineIndex) => ({
        text: String(text || "").trim(),
        sourceLineIndex,
      }))
      .filter((line) => line.text),
  }));
}

// A recovered answer can be sung across a section break (the last line of a pre-chorus and the
// first of the chorus), so the span is looked for in the song read straight through, not inside
// one section. Searching section by section missed those, fell back to one line, and the lines
// "after" it then repeated the rest of the card's own answer.
function exactSpan(flat, parts, normalize) {
  for (let start = 0; start <= flat.length - parts.length; start++) {
    if (parts.every((part, offset) => flat[start + offset].text === part)) {
      return { start, end: start + parts.length - 1 };
    }
  }
  const keys = parts.map(normalize);
  for (let start = 0; start <= flat.length - keys.length; start++) {
    if (keys.every((key, offset) => normalize(flat[start + offset].text) === key)) {
      return { start, end: start + keys.length - 1 };
    }
  }
  return null;
}

function exactLine(flat, parts, normalize, matchesLine) {
  const preferred = matchesLine
    ? [...parts.filter((line) => matchesLine(line)), ...parts.filter((line) => !matchesLine(line))]
    : parts;
  for (const part of preferred) {
    const start = flat.findIndex((line) => line.text === part);
    if (start >= 0) return { start, end: start };
  }
  for (const part of preferred) {
    const key = normalize(part);
    const start = flat.findIndex((line) => normalize(line.text) === key);
    if (start >= 0) return { start, end: start };
  }
  return null;
}

// How much of the song the peek shows: RADIUS lines either side of the line, counted across
// the whole song, so the line always sits in the middle of at most five. Clipping at the
// section edge made the peek lopsided (a line first in its chorus got nothing above it), and
// showing the whole section was worse the other way: an eight-line verse opened as seven lines
// of reading on a verdict that wants a glance, with the dealt line pushed to one end of it. So
// the peek runs past a section edge, and runs straight on: the five lines are sung that way,
// and a blank line or a rule marking the edge was one more thing to read in a glimpse that is
// only about how the line sits among its neighbours (the full sheet labels its sections).
// Nothing marks the cut at either end either: "full lyrics" sits beside the toggle.
export const RADIUS = 2;

// `anchorText` is exactly what the card displays, including a recovered multi-line answer.
// `matchesLine` is supplied by app.js so strict and lenient rounds use the game's real matcher.
export function buildLyricReveal(song, anchorText, options = {}) {
  const normalize = options.normalize || defaultNormalize;
  const matchesLine = typeof options.matchesLine === "function" ? options.matchesLine : null;
  const sections = revealSections(song);
  const parts = String(anchorText || "").split("\n").map((line) => line.trim()).filter(Boolean);
  if (!parts.length) return null;

  const flat = sections.flatMap((candidate) => candidate.lines.map((line, lineIndex) => ({
    text: line.text,
    sourceLineIndex: line.sourceLineIndex,
    sectionIndex: candidate.sectionIndex,
    lineIndex,
  })));

  let span = exactSpan(flat, parts, normalize) || exactLine(flat, parts, normalize, matchesLine);
  if (!span && matchesLine) {
    const start = flat.findIndex((line) => matchesLine(line.text));
    if (start >= 0) span = { start, end: start };
  }
  if (!span) return null;

  const { start, end } = span;
  let anchor = start;
  if (matchesLine) {
    const within = flat.slice(start, end + 1).findIndex((line) => matchesLine(line.text));
    if (within >= 0) anchor = start + within;
  }
  const anchorLine = flat[anchor];
  const from = Math.max(0, start - RADIUS);

  return {
    sectionIndex: anchorLine.sectionIndex,
    sectionLabel: sections[anchorLine.sectionIndex].label,
    lineStart: flat[start].lineIndex,
    lineEnd: flat[end].lineIndex,
    anchorLineIndex: anchorLine.lineIndex,
    anchorSourceLineIndex: anchorLine.sourceLineIndex,
    before: flat.slice(from, start),
    after: flat.slice(end + 1, end + 1 + RADIUS),
  };
}
