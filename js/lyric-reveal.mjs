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

// `anchorText` is exactly what the card displays, including a recovered multi-line answer.
// `matchesLine` is supplied by app.js so strict and lenient rounds use the game's real matcher.
export function buildLyricReveal(song, anchorText, options = {}) {
  const normalize = options.normalize || defaultNormalize;
  const matchesLine = typeof options.matchesLine === "function" ? options.matchesLine : null;
  const radius = Math.max(0, Number.isFinite(options.radius) ? Math.floor(options.radius) : 2);
  const sections = revealSections(song);
  const parts = String(anchorText || "").split("\n").map((line) => line.trim()).filter(Boolean);
  if (!parts.length) return null;

  const requested = options.anchor;
  const requestedSection = requested && sections.find((section) =>
    section.sectionIndex === Number(requested.sectionIndex));
  const requestedLine = requestedSection && Number(requested.lineIndex);
  let span = requestedSection && Number.isInteger(requestedLine) && requestedSection.lines[requestedLine]
    ? { section: requestedSection, start: requestedLine, end: requestedLine }
    : exactSpan(sections, parts, normalize) || exactLine(sections, parts, normalize, matchesLine);
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

  const matching = [];
  const collect = (test) => {
    for (const candidate of sections) {
      candidate.lines.forEach((line, lineIndex) => {
        if (test(line.text)) matching.push({
          sectionIndex: candidate.sectionIndex,
          sectionLabel: candidate.label,
          lineIndex,
          sourceLineIndex: line.sourceLineIndex,
          text: line.text,
        });
      });
    }
  };
  if (matchesLine) collect(matchesLine);
  else {
    const anchorKey = normalize(section.lines[anchorIndex].text);
    collect((text) => normalize(text) === anchorKey);
  }
  const occurrenceIndex = matching.findIndex((hit) =>
    hit.sectionIndex === section.sectionIndex && hit.lineIndex === anchorIndex);

  // Context is measured against the WHOLE song, not the anchor's section. Clipping at the
  // section edge is what made the peek lopsided: a line sitting first in its chorus got nothing
  // above it and two lines below, which reads as a bug rather than as the end of a verse. The
  // song runs on past a section break, so the peek does too, and a line that opens a new
  // section is flagged so the rendering can draw the break instead of pretending it isn't there.
  const flat = [];
  sections.forEach((candidate) => {
    candidate.lines.forEach((line, lineIndex) => {
      flat.push({
        text: line.text,
        sourceLineIndex: line.sourceLineIndex,
        sectionIndex: candidate.sectionIndex,
        sectionLabel: candidate.label,
        lineIndex,
        sectionBreak: flat.length > 0 && flat[flat.length - 1].sectionIndex !== candidate.sectionIndex,
      });
    });
  });
  const flatIndex = (lineIndex) => flat.findIndex((line) =>
    line.sectionIndex === section.sectionIndex && line.lineIndex === lineIndex);
  const spanStart = flatIndex(start);
  const spanEnd = flatIndex(end);
  const beforeStart = Math.max(0, spanStart - radius);
  const afterEnd = Math.min(flat.length, spanEnd + 1 + radius);

  return {
    sectionIndex: section.sectionIndex,
    sectionLabel: section.label,
    lineStart: start,
    lineEnd: end,
    anchorLineIndex: anchorIndex,
    anchorSourceLineIndex: section.lines[anchorIndex].sourceLineIndex,
    before: flat.slice(beforeStart, spanStart),
    after: flat.slice(spanEnd + 1, afterEnd),
    truncatedBefore: beforeStart > 0,
    truncatedAfter: afterEnd < flat.length,
    totalMatches: matching.length,
    occurrence: occurrenceIndex >= 0 ? occurrenceIndex + 1 : 0,
    matches: matching,
  };
}
