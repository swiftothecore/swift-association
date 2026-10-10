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

function exactSpan(sections, parts, normalize) {
  for (const section of sections) {
    for (let start = 0; start <= section.lines.length - parts.length; start++) {
      if (parts.every((part, offset) => section.lines[start + offset].text === part)) {
        return { section, start, end: start + parts.length - 1 };
      }
    }
  }
  const keys = parts.map(normalize);
  for (const section of sections) {
    for (let start = 0; start <= section.lines.length - keys.length; start++) {
      if (keys.every((key, offset) => normalize(section.lines[start + offset].text) === key)) {
        return { section, start, end: start + keys.length - 1 };
      }
    }
  }
  return null;
}

function exactLine(sections, parts, normalize, matchesLine) {
  const preferred = matchesLine
    ? [...parts.filter((line) => matchesLine(line)), ...parts.filter((line) => !matchesLine(line))]
    : parts;
  for (const part of preferred) {
    for (const section of sections) {
      const start = section.lines.findIndex((line) => line.text === part);
      if (start >= 0) return { section, start, end: start };
    }
  }
  for (const part of preferred) {
    const key = normalize(part);
    for (const section of sections) {
      const start = section.lines.findIndex((line) => normalize(line.text) === key);
      if (start >= 0) return { section, start, end: start };
    }
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

  let span = exactSpan(sections, parts, normalize) || exactLine(sections, parts, normalize, matchesLine);
  if (!span && matchesLine) {
    for (const section of sections) {
      const start = section.lines.findIndex((line) => matchesLine(line.text));
      if (start >= 0) { span = { section, start, end: start }; break; }
    }
  }
  if (!span) return null;

  const { section, start, end } = span;
  let anchorIndex = start;
  if (matchesLine) {
    const within = section.lines.slice(start, end + 1).findIndex((line) => matchesLine(line.text));
    if (within >= 0) anchorIndex = start + within;
  }

  const flat = sections.flatMap((candidate) => candidate.lines.map((line, lineIndex) => ({
    text: line.text,
    sourceLineIndex: line.sourceLineIndex,
    sectionIndex: candidate.sectionIndex,
    lineIndex,
  })));
  const at = (lineIndex) => flat.findIndex((line) =>
    line.sectionIndex === section.sectionIndex && line.lineIndex === lineIndex);
  const shown = flat.slice(Math.max(0, at(start) - RADIUS), at(end) + 1 + RADIUS);

  const spanStart = shown.findIndex((line) => line.sectionIndex === section.sectionIndex && line.lineIndex === start);
  const spanEnd = shown.findIndex((line) => line.sectionIndex === section.sectionIndex && line.lineIndex === end);

  return {
    sectionIndex: section.sectionIndex,
    sectionLabel: section.label,
    lineStart: start,
    lineEnd: end,
    anchorLineIndex: anchorIndex,
    anchorSourceLineIndex: section.lines[anchorIndex].sourceLineIndex,
    before: shown.slice(0, spanStart),
    after: shown.slice(spanEnd + 1),
  };
}
