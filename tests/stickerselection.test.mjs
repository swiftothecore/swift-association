import test from 'node:test';
import assert from 'node:assert/strict';
import { STICKERS, stickerArt } from '../js/stickers.js';
import { coverStickerSlots, toggleCoverSticker } from '../js/stickerselection.js';
import { COVER_STICKER_LIMIT, STICKER_TOTAL } from '../js/config.js';
const earned = Object.fromEntries(STICKERS.map((s, i) => [s.id, new Date(2026, 0, i + 1).toISOString()]));
const chosen = (slots) => slots.filter((s) => s.id);

test('default cover keeps the first fifteen earned and ignores unknown IDs', () => {
  const slots = coverStickerSlots({ ...earned, 'not-a-sticker': '2000' }, null);
  assert.deepEqual(chosen(slots).map((s) => s.id), STICKERS.slice(0, 15).map((s) => s.id));
  assert.ok(slots.every((s) => s.id === s.anchor));
  assert.equal(STICKER_TOTAL, STICKERS.length);
  assert.equal(STICKERS.some((s) => s.id === 'koi-fish-guitar'), false);
});

test('removing a sticker frees its anchor and a replacement leaves every other anchor intact', () => {
  const before = coverStickerSlots(earned, null);
  const removed = toggleCoverSticker(earned, null, before[3].id);
  assert.equal(chosen(removed).length, 14);
  assert.equal(removed[3].id, null);
  const replaced = toggleCoverSticker(earned, removed, 'boots');
  assert.deepEqual(replaced[3], { anchor: before[3].anchor, id: 'boots' });
  for (let i = 0; i < 15; i++) if (i !== 3) assert.deepEqual(replaced[i], before[i]);
  assert.deepEqual(coverStickerSlots(earned, JSON.parse(JSON.stringify(replaced))), replaced);
});

test('a full cover rejects additions and locked or unknown stickers never enter it', () => {
  const full = coverStickerSlots(earned, null);
  assert.deepEqual(toggleCoverSticker(earned, null, 'pegacorn'), full);
  const empty = toggleCoverSticker(earned, null, full[0].id);
  assert.deepEqual(toggleCoverSticker(earned, empty, 'nonexistent'), empty);
  const withoutBoots = { ...earned }; delete withoutBoots.boots;
  assert.deepEqual(toggleCoverSticker(withoutBoots, empty, 'boots'), empty);
});

test('empty selections stay empty and new unlocks do not displace chosen stickers', () => {
  const empty = coverStickerSlots(earned, []);
  assert.equal(chosen(empty).length, 0);
  const sixteen = Object.fromEntries(Object.entries(earned).slice(0, 16));
  const selection = toggleCoverSticker(sixteen, null, STICKERS[0].id);
  assert.deepEqual(coverStickerSlots(earned, selection), selection);
});

test('at fifteen or fewer unlocks, hidden preferences cannot hide earned stickers', () => {
  for (const count of [0, 1, 15]) {
    const subset = Object.fromEntries(Object.entries(earned).slice(0, count));
    assert.equal(chosen(coverStickerSlots(subset, [])).length, count);
  }
});

test('imported preferences cannot duplicate occupants or anchors or exceed the cover limit', () => {
  const preference = [null, {}, { anchor: 'missing', id: 'boots' },
    { anchor: STICKERS[0].id, id: 'boots' },
    { anchor: STICKERS[0].id, id: 'pegacorn' },
    { anchor: STICKERS[1].id, id: 'boots' },
    ...STICKERS.map((s) => ({ anchor: s.id, id: s.id }))];
  const slots = coverStickerSlots(earned, preference);
  assert.equal(slots.length, COVER_STICKER_LIMIT);
  assert.equal(new Set(slots.map((s) => s.anchor)).size, slots.length);
  assert.equal(new Set(chosen(slots).map((s) => s.id)).size, chosen(slots).length);
});

test('simultaneous artwork copies have distinct clip IDs and matching references', () => {
  const st = STICKERS.find((s) => s.id === 'pegacorn');
  const a = stickerArt(st), b = stickerArt(st);
  const ids = (svg) => [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ids(a).length > 0);
  assert.ok(ids(a).every((id) => !ids(b).includes(id)));
  for (const match of a.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids(a).includes(match[1]));
});
