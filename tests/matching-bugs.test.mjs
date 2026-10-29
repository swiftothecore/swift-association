import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { highlightWord, wordRegex } from '../js/match.js';
import { normalizeLyric, normalizeTitle } from '../js/util.js';

test('highlights match source text before HTML escaping', () => {
  const line = 'You & me <forever> "always"';
  for (const [word, expected] of [
    ['&', 'You <mark>&amp;</mark> me &lt;forever&gt; &quot;always&quot;'],
    ['"always"', 'You &amp; me &lt;forever&gt; <mark>&quot;always&quot;</mark>'],
  ]) {
    assert.equal(wordRegex(word, true).test(line), true);
    assert.equal(highlightWord(line, word, true), expected);
  }
  assert.equal(highlightWord('amp & amp', 'amp', true), '<mark>amp</mark> &amp; <mark>amp</mark>');
  assert.equal(highlightWord('She said "quot"', 'quot', true), 'She said &quot;<mark>quot</mark>&quot;');
});

test('escaped highlighting retains exact-first and stem matching rules', () => {
  assert.equal(highlightWord('<golden> & "gold"', 'gold', false),
    '&lt;golden&gt; &amp; &quot;<mark>gold</mark>&quot;');
  assert.equal(highlightWord('<golden> & "golds"', 'gold', false),
    '&lt;<mark>golden</mark>&gt; &amp; &quot;<mark>golds</mark>&quot;');
  assert.equal(highlightWord('She stared at the stars', 'star', false),
    'She stared at the <mark>stars</mark>');
});

test('smart quotes do not change a typed title comparison key', () => {
  for (const title of ['Red', "Don't Blame Me", "Who's Afraid of Little Old Me?"]) {
    assert.equal(normalizeTitle(`“${title}”`), normalizeTitle(title));
    assert.equal(normalizeTitle(title.replaceAll("'", '‘')), normalizeTitle(title));
    assert.equal(normalizeTitle(title.replaceAll("'", '’')), normalizeTitle(title));
  }
});

test('smart quotes preserve the same lyric recall key as straight quotes', () => {
  const albums = JSON.parse(readFileSync(new URL('../data/songs.json', import.meta.url), 'utf8'));
  const line = albums.flatMap((album) => album.songs.flatMap((song) =>
    song.sections.flatMap((section) => section.lines || [])))
    .find((text) => text.includes('And you smile and say,'));
  assert.ok(line);
  assert.equal(normalizeLyric(line), normalizeLyric('And you smile and say, "How are you?"'));
  for (const keepApostrophes of [false, true]) {
    assert.equal(normalizeLyric('“dancing” all night', { keepApostrophes }),
      normalizeLyric('"dancing" all night', { keepApostrophes }));
  }
});
