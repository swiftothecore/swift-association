import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { GUESTS } from '../js/config.js';
import { normalizeTitle } from '../js/util.js';

const catalogue = JSON.parse(fs.readFileSync(
  new URL('../data/guests/olivia-rodrigo.json', import.meta.url),
  'utf8',
));
const songs = catalogue.albums.flatMap(({ songs }) => songs);

test('Olivia Rodrigo catalogue has her three records and two loose shelves, every song once', () => {
  assert.deepEqual(
    catalogue.albums.map(({ album, songs }) => [album, songs.length]),
    [
      ['SOUR', 11],
      ['GUTS', 17],
      ['you seem pretty sad for a girl so in love', 14],
      ['Soundtracks', 9],
      ['Singles', 3],
    ],
  );
  // The pass quotes the count, so it has to move with the file.
  assert.equal(GUESTS.find(({ id }) => id === 'olivia-rodrigo').songCount, songs.length);
  assert.equal(new Set(songs.map(({ title }) => title.toLocaleLowerCase())).size, songs.length);
  assert.ok(songs.every(({ sections }) =>
    sections.length > 0 && sections.every(({ label, lines }) =>
      label && lines.length > 0 && lines.every((line) => typeof line === 'string' && line.length > 0))));
  assert.equal(songs.some(({ sections }) => sections.some(({ label }) => /[[\]]|lyrics/i.test(label))), false);
  assert.equal(new Set(catalogue.words).size, catalogue.words.length);
  assert.deepEqual(Object.keys(catalogue.palette.colors), catalogue.albums.map(({ album }) => album));
});

test('her loose shelves keep to the credit rule', () => {
  const titles = new Set(songs.map(({ title }) => title));
  // Originals credited to her, the High School Musical series ones included.
  for (const title of ['All I Want', 'The Rose Song', "Can't Catch Me Now", 'Out of the Old', 'serena joy']) {
    assert.ok(titles.has(title), title);
  }
  // The HSM film songs and River are covers; Even When/The Best Part would repeat The Best Part.
  for (const title of ['Start of Something New', 'Breaking Free', 'River', 'Even When/The Best Part']) {
    assert.equal(titles.has(title), false, title);
  }
});

test('no two Olivia titles fold to the same key', () => {
  const byKey = new Map();
  for (const { title } of songs) {
    const key = normalizeTitle(title);
    byKey.set(key, [...(byKey.get(key) || []), title]);
  }
  assert.deepEqual([...byKey.values()].filter((titles) => titles.length > 1), []);
});
