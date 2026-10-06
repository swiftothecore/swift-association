import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { versionFamilies } from '../js/util.js';
import { wordRegex } from '../js/match.js';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const flatten = (grouped) => grouped.flatMap(({ album, songs }) => songs.map((s) => ({
  title: s.title, album, lyrics: s.sections.flatMap((x) => x.lines || []).join('\n'),
})));
const merges = (songs) => {
  const heads = versionFamilies(songs);
  return songs.filter((s) => heads.get(s) !== s).map((s) => `${s.title} -> ${heads.get(s).title}`);
};

const taylor = flatten(read('../data/songs.json'));

// Pinned on purpose. A new song or guest that folds a pressing in, or folds something it should
// not, fails here and gets looked at rather than quietly changing what every word counts as.
test('Taylor folds exactly her six second pressings', () => {
  assert.deepEqual(merges(taylor).sort(), [
    'All Too Well (10 Minute Version) -> All Too Well',
    'Bad Blood (Remix) -> Bad Blood',
    'Forever & Always (Piano Version) -> Forever & Always',
    'Karma (Remix) -> Karma',
    'Snow On The Beach (Remix) -> Snow On The Beach',
    'State Of Grace (Acoustic Version) -> State Of Grace',
  ]);
});

test('guest catalogues fold only same-album pressings', () => {
  const found = {};
  for (const file of readdirSync(new URL('../data/guests/', import.meta.url))) {
    if (!file.endsWith('.json')) continue;
    const m = merges(flatten(read(`../data/guests/${file}`).albums));
    if (m.length) found[file] = m;
  }
  // Ariana's three intros sit on three records; only the eternal sunshine cut is one song twice.
  assert.deepEqual(found, {
    'ariana-grande.json': ['intro (end of the world) [extended] -> intro (end of the world)'],
  });
});

test('a bracketed title with no base on its album stays its own song', () => {
  const heads = versionFamilies(taylor);
  for (const title of ["Mary's Song (Oh My My My)", 'Gasoline (Remix)', 'I Can Fix Him (No Really I Can)']) {
    const song = taylor.find((s) => s.title === title);
    assert.ok(song, title);
    assert.equal(heads.get(song), song, title);
  }
});

test('a word in both pressings of one song counts that song once', () => {
  const heads = versionFamilies(taylor);
  const ultraCount = (w) => {
    const rx = wordRegex(w, true);
    return new Set(taylor.filter((s) => rx.test(s.lyrics) && !rx.test(s.title)).map((s) => heads.get(s))).size;
  };
  for (const w of ['awful', 'saint', 'thunder', 'traffic', 'Tuesday']) assert.equal(ultraCount(w), 3, w);
  assert.equal(ultraCount('vibe'), 1);
});
