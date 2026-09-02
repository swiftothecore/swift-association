import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildLyricReveal, revealSections } from "../js/lyric-reveal.mjs";
import { extractLineWithWord, wordRegex } from "../js/match.js";
import { normalizeLyric } from "../js/util.js";

const normalize = (text) => String(text || "")
  .toLowerCase()
  .replace(/[’‘]/g, "'")
  .replace(/[().!?,:;\"'…]/g, "")
  .replace(/ing\b/g, "in")
  .replace(/\s+/g, " ")
  .trim();

test("puts two same-section lines on either side without repeating the anchor", () => {
  const song = {
    sections: [
      { label: "Verse 1", lines: ["outside"] },
      { label: "Bridge", lines: ["one", "two", "the word is here", "four", "five", "six"] },
    ],
  };
  const reveal = buildLyricReveal(song, "the word is here", {
    normalize,
    matchesLine: (line) => /\bword\b/i.test(line),
  });

  assert.equal(reveal.sectionLabel, "Bridge");
  assert.deepEqual(reveal.before.map((line) => line.text), ["one", "two"]);
  assert.deepEqual(reveal.after.map((line) => line.text), ["four", "five"]);
  assert.equal([...reveal.before, ...reveal.after].some((line) => line.text === "the word is here"), false);
  assert.equal(reveal.truncatedBefore, false);
  assert.equal(reveal.truncatedAfter, true);
});

test("prefers the raw displayed occurrence before a looser normalized twin", () => {
  const song = {
    sections: [{
      label: "Bridge",
      lines: ["But you're goin' to", "a line between", "But you're going to", "the line after"],
    }],
  };
  const reveal = buildLyricReveal(song, "But you're going to", {
    normalize,
    matchesLine: (line) => /\bgoing\b|\bgoin'/i.test(line),
  });

  assert.equal(reveal.anchorLineIndex, 2);
  assert.deepEqual(reveal.before.map((line) => line.text), ["But you're goin' to", "a line between"]);
  assert.deepEqual(reveal.after.map((line) => line.text), ["the line after"]);
});

test("keeps repeated matching lines as coordinate-distinct occurrences", () => {
  const song = {
    sections: [
      { label: "Verse 1", lines: ["Break my soul in two", "first tail"] },
      { label: "Verse 2", lines: ["second lead", "Will you forgive my soul", "second tail"] },
    ],
  };
  const matchesLine = (line) => /\bsoul\b/i.test(line);
  const first = buildLyricReveal(song, "Break my soul in two", { normalize, matchesLine });
  const second = buildLyricReveal(song, first.matches[1].text, {
    normalize,
    matchesLine,
    anchor: first.matches[1],
  });

  assert.equal(first.totalMatches, 2);
  assert.equal(first.occurrence, 1);
  assert.equal(second.occurrence, 2);
  assert.equal(second.sectionLabel, "Verse 2");
  assert.equal(second.anchorLineIndex, 1);
});

test("treats a recovered multi-line answer as one span", () => {
  const song = {
    sections: [{ label: "Chorus", lines: ["lead", "line with light", "carried on", "tail"] }],
  };
  const reveal = buildLyricReveal(song, "line with light\ncarried on", {
    normalize,
    matchesLine: (line) => /\blight\b/i.test(line),
  });

  assert.equal(reveal.lineStart, 1);
  assert.equal(reveal.lineEnd, 2);
  assert.deepEqual(reveal.before.map((line) => line.text), ["lead"]);
  assert.deepEqual(reveal.after.map((line) => line.text), ["tail"]);
});

test("falls back to a flat lyrics field when structured sections are absent", () => {
  const song = { lyrics: "before\nfind me\nafter" };
  assert.equal(revealSections(song)[0].label, "");
  const reveal = buildLyricReveal(song, "find me", {
    normalize,
    matchesLine: (line) => /\bfind\b/i.test(line),
  });
  assert.deepEqual(reveal.before.map((line) => line.text), ["before"]);
  assert.deepEqual(reveal.after.map((line) => line.text), ["after"]);
});

const catalogue = JSON.parse(readFileSync(new URL("../data/songs.json", import.meta.url), "utf8"))
  .flatMap(({ album, songs }) => songs.map((song) => ({
    ...song,
    album,
    lyrics: song.sections.flatMap((section) => section.lines || []).join("\n"),
  })));
const playableWords = JSON.parse(readFileSync(new URL("../data/words.json", import.meta.url), "utf8"));

test("real lenient babe reveal stays on the exact displayed Elizabeth Taylor line", () => {
  const song = catalogue.find((candidate) => candidate.title === "Elizabeth Taylor");
  const matchesLine = (line) => wordRegex("babe", false).test(line);
  const displayed = extractLineWithWord(song.lyrics, "babe", false);
  const reveal = buildLyricReveal(song, displayed, { normalize: normalizeLyric, matchesLine });

  assert.match(displayed, /^Babe, I would trade the Cartier/);
  assert.equal(reveal.sectionLabel, "Verse 2");
  assert.equal([...reveal.before, ...reveal.after].some((line) => line.text === displayed), false);
  assert.deepEqual(reveal.after.map((line) => line.text), [
    "We hit the best booth at Musso and Frank's",
    "They say I'm bad news, I just say, \"Thanks\"",
  ]);
});

test("real coney island soul hits remain two navigable occurrences", () => {
  const song = catalogue.find((candidate) => candidate.title === "coney island");
  const matchesLine = (line) => wordRegex("soul", false).test(line);
  const displayed = extractLineWithWord(song.lyrics, "soul", false);
  const reveal = buildLyricReveal(song, displayed, { normalize: normalizeLyric, matchesLine });

  assert.equal(reveal.totalMatches, 2);
  assert.deepEqual(reveal.matches.map((hit) => hit.sectionLabel), ["Verse 1", "Verse 2"]);
});

test("Mary's Song is a title-only proof fixture for the prompt song", () => {
  const song = catalogue.find((candidate) => candidate.title === "Mary's Song (Oh My My My)");
  assert.equal(wordRegex("song", true).test(song.title), true);
  assert.equal(wordRegex("song", false).test(song.lyrics), false);
});

test("every lenient catalogue card maps its displayed lyric back to that raw occurrence", () => {
  let pairs = 0;
  for (const word of playableWords) {
    const matchesLine = (line) => wordRegex(word, false).test(line);
    for (const song of catalogue) {
      if (!matchesLine(song.lyrics)) continue;
      pairs++;
      const displayed = extractLineWithWord(song.lyrics, word, false);
      const reveal = buildLyricReveal(song, displayed, { normalize: normalizeLyric, matchesLine });
      assert.ok(reveal, `${word} / ${song.title} did not map`);
      const section = revealSections(song)[reveal.sectionIndex];
      assert.equal(section.lines[reveal.anchorLineIndex].text, displayed,
        `${word} / ${song.title} moved to a different occurrence`);
      assert.ok(reveal.before.length <= 2 && reveal.after.length <= 2,
        `${word} / ${song.title} exceeded the two-line context radius`);
    }
  }
  assert.ok(pairs > 12000, `expected the full catalogue audit, saw ${pairs} pairs`);
});
