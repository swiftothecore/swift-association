// Cover choices occupy stable sticker anchors. Removing one leaves its spot empty;
// adding another fills that spot, without moving the stickers still on the cover.
import { STICKERS } from "./stickers.js";
import { COVER_STICKER_LIMIT } from "./config.js";

export function coverStickerSlots(earned, preference, limit = COVER_STICKER_LIMIT, roster = STICKERS) {
  const known = new Set(roster.map((s) => s.id));
  const mine = roster.filter((s) => earned[s.id]);
  mine.sort((a, b) => String(earned[a.id]).localeCompare(String(earned[b.id]))
    || roster.indexOf(a) - roster.indexOf(b));
  // Until the sixteenth unlock, there is no selection UI and the original earn order wins.
  const custom = mine.length > COVER_STICKER_LIMIT && Array.isArray(preference);
  const slots = [], anchors = new Set(), occupants = new Set();
  if (custom) {
    for (const entry of preference) {
      if (slots.length >= limit) break;
      if (!entry || !known.has(entry.anchor) || anchors.has(entry.anchor)) continue;
      const id = known.has(entry.id) && earned[entry.id] && !occupants.has(entry.id) ? entry.id : null;
      slots.push({ anchor: entry.anchor, id });
      anchors.add(entry.anchor);
      if (id) occupants.add(id);
    }
  } else {
    for (const s of mine.slice(0, limit)) {
      slots.push({ anchor: s.id, id: s.id });
      anchors.add(s.id);
    }
  }
  // Keep empty anchors, including when every sticker is taken off. New art fills the
  // first vacancy rather than re-running the cover's packer with a different roster.
  for (const s of roster) {
    if (slots.length >= limit) break;
    if (!anchors.has(s.id)) { slots.push({ anchor: s.id, id: null }); anchors.add(s.id); }
  }
  return slots;
}

export function toggleCoverSticker(earned, preference, id) {
  const slots = coverStickerSlots(earned, preference);
  if (!earned[id] || !STICKERS.some((s) => s.id === id)) return slots;
  const present = slots.find((s) => s.id === id);
  if (present) present.id = null;
  else {
    const empty = slots.find((s) => !s.id);
    if (empty) empty.id = id;
  }
  return slots;
}
