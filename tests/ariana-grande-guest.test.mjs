import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { GUESTS } from '../js/config.js';
import { normalizeTitle } from '../js/util.js';

const catalogue = JSON.parse(fs.readFileSync(
  new URL('../data/guests/ariana-grande.json', import.meta.url),
  'utf8',
));
const songs = catalogue.albums.flatMap(({ songs }) => songs);

test('Ariana Grande catalogue has its records and three loose shelves, every song once', () => {
  assert.deepEqual(
    catalogue.albums.map(({ album, songs }) => [album, songs.length]),
    [
      ['Yours Truly', 12],
      ['My Everything', 17],
      ['Dangerous Woman', 19],
      ['Sweetener', 15],
      ['thank u, next', 12],
      ['Positions', 18],
      ['eternal sunshine', 19],
      ['petal', 12],
      ['Christmas Songs', 11],
      ['Soundtracks', 3],
      ['Collaborations', 17],
      ['Singles', 4],
    ],
  );
  // The pass quotes the count, so it has to move with the file.
  assert.equal(GUESTS.find(({ id }) => id === 'ariana-grande').songCount, songs.length);
  assert.equal(new Set(songs.map(({ title }) => title.toLocaleLowerCase())).size, songs.length);
  assert.ok(songs.every(({ sections }) =>
    sections.length > 0 && sections.every(({ label, lines }) =>
      label && lines.length > 0 && lines.every((line) => typeof line === 'string' && line.length > 0))));
  // Scrape residue: a section label that swallowed a bracket out of the page title.
  assert.equal(songs.some(({ sections }) => sections.some(({ label }) => /[[\]]|lyrics/i.test(label))), false);
  assert.equal(new Set(catalogue.words).size, catalogue.words.length);
  assert.deepEqual(Object.keys(catalogue.palette.colors), catalogue.albums.map(({ album }) => album));
});

test('the loose shelves carry no Genius page suffixes and no Italian-only song', () => {
  // Genius files several of these under a longer page title; the game names the song.
  const titles = new Set(songs.map(({ title }) => title));
  for (const title of ["Don't Call Me Angel", 'Oh Santa!']) assert.ok(titles.has(title), title);
  // Covers stay off the loose shelves: a word only they hold points at the song's writer.
  for (const title of ['Zero to Hero', 'Beauty and the Beast', 'Somewhere Over the Rainbow']) {
    assert.equal(titles.has(title), false, title);
  }
  assert.equal(songs.some(({ title }) => /\(from |charlie's angels\)|live from/i.test(title)), false);
  // E più ti penso is sung entirely in Italian: an English prompt word cannot land in it, and
  // "come" would credit it through the Italian "Come non son' stato mai".
  assert.equal(songs.some(({ title }) => /ti penso/i.test(title)), false);
});

test('no two Ariana titles fold to the same key', () => {
  const byKey = new Map();
  for (const { title } of songs) {
    const key = normalizeTitle(title);
    byKey.set(key, [...(byKey.get(key) || []), title]);
  }
  assert.deepEqual([...byKey.values()].filter((titles) => titles.length > 1), []);
});
