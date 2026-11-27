import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { GUESTS, GUESTS_COMING_SOON, GUEST_DAYS, LINEUP_INKS } from '../js/config.js';
import { STICKERS } from '../js/stickers.js';
import { normalizeTitle } from '../js/util.js';

const catalogue = JSON.parse(fs.readFileSync(
  new URL('../data/guests/miley-cyrus.json', import.meta.url),
  'utf8',
));
const songs = catalogue.albums.flatMap(({ songs }) => songs);

test('Miley Cyrus is a playable guest under her full name, souvenir appended last', () => {
  const guest = GUESTS.find(({ id }) => id === 'miley-cyrus');
  assert.equal(guest?.name, 'Miley Cyrus');
  assert.equal(guest.file, 'data/guests/miley-cyrus.json');
  assert.equal(GUESTS_COMING_SOON.some(({ id }) => id === 'miley-cyrus'), false);
  // The lineup keys its inks by the artist's display name, so the rename has to reach it.
  assert.ok(LINEUP_INKS['Miley Cyrus']);
  const day = GUEST_DAYS.find(({ guest }) => guest === 'miley-cyrus');
  assert.equal(day.name, 'Miley Cyrus');
  assert.equal(day.soon, undefined);
  // STICKERS is append-only: her souvenir arrives after Beyoncé's.
  const at = (id) => STICKERS.findIndex((s) => s.id === id);
  assert.ok(at('guest-miley-cyrus') > at('guest-beyonce'));
});

test('Miley Cyrus catalogue has its records, every song once and every line sung', () => {
  assert.deepEqual(
    catalogue.albums.map(({ album, songs }) => [album, songs.length]),
    [
      ['Meet Miley Cyrus', 10],
      ['Breakout', 12],
      ['The Time of Our Lives', 7],
      ["Can't Be Tamed", 12],
      ['Bangerz', 15],
      ['Miley Cyrus & Her Dead Petz', 22],
      ['Younger Now', 11],
      ['SHE IS COMING', 6],
      ['Plastic Hearts', 12],
      ['Endless Summer Vacation', 12],
      ['Something Beautiful', 13],
      ['Bass Persuades', 10],
      ['Soundtracks', 7],
      ['Collaborations', 13],
      ['Standalone & Rarities', 2],
    ],
  );
  assert.equal(new Set(songs.map(({ title }) => title.toLocaleLowerCase())).size, songs.length);
  assert.ok(songs.every(({ sections }) =>
    sections.length > 0 && sections.every(({ label, lines }) =>
      label && lines.length > 0 && lines.every((line) => typeof line === 'string' && line.length > 0))));
  // The instrumentals carry a placeholder sentence rather than lyrics, and would deal "song"
  // and "instrumental" as if she sang them.
  assert.equal(songs.some(({ sections }) =>
    sections.some(({ lines }) => lines.some((line) => /this song is an instrumental/i.test(line)))), false);
  assert.equal(new Set(catalogue.words).size, catalogue.words.length);
  assert.ok(Object.keys(catalogue.palette.colors).length === catalogue.albums.length);
});

// Her 2009 "Dream" folded to the same key as "D.R.E.A.M." until it was cut as a cover. Pinned
// empty so a new pair is noticed and checked against pageTwin.
test('no two Miley titles fold to the same key', () => {
  const byKey = new Map();
  for (const { title } of songs) {
    const key = normalizeTitle(title);
    byKey.set(key, [...(byKey.get(key) || []), title]);
  }
  const clashes = [...byKey.values()].filter((titles) => titles.length > 1);
  assert.deepEqual(clashes, []);
});
