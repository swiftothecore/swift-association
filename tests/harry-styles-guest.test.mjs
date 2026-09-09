import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { GUESTS, GUESTS_COMING_SOON } from '../js/config.js';
import { STICKERS } from '../js/stickers.js';

const catalogue = JSON.parse(fs.readFileSync(
  new URL('../data/guests/harry-styles.json', import.meta.url),
  'utf8',
));

test('Harry Styles is a playable guest with his souvenir registered', () => {
  const guest = GUESTS.find(({ id }) => id === 'harry-styles');
  assert.equal(guest?.file, 'data/guests/harry-styles.json');
  assert.equal(GUESTS_COMING_SOON.some(({ id }) => id === 'harry-styles'), false);
  assert.ok(STICKERS.some(({ id }) => id === 'guest-harry-styles'));
});

test('Harry Styles catalogue has the four requested album splits', () => {
  assert.equal(catalogue.id, 'harry-styles');
  assert.deepEqual(
    catalogue.albums.map(({ album, songs }) => [album, songs.length]),
    [
      ['Harry Styles', 10],
      ['Fine Line', 12],
      ["Harry's House", 13],
      ['Kiss All the Time. Disco, Occasionally', 12],
    ],
  );

  const songs = catalogue.albums.flatMap(({ songs }) => songs);
  assert.equal(songs.length, 47);
  assert.equal(new Set(songs.map(({ title }) => title)).size, 47);
  assert.ok(songs.every(({ sections }) =>
    Array.isArray(sections) && sections.length > 0 &&
    sections.every(({ label, lines }) =>
      typeof label === 'string' && Array.isArray(lines) &&
      lines.every((line) => typeof line === 'string'))));

  assert.ok(catalogue.words.length >= 13);
  assert.equal(new Set(catalogue.words).size, catalogue.words.length);
});
