// The guest shelf's go button: a rubber stamp reading ADMIT ONE, with the guest's own mark cut
// into the rubber beside the words. Every other way into a run off a detail panel (Album Focus,
// Challenges) is the gold .chall-go sticker, which is the house's own launch and so Taylor's.
// A guest is someone else's catalogue, so it gets a different object, not the sticker recoloured:
// the venue's hand stamp at the door, which is what the backstage pass above it is for. It pairs
// with the "admitted" frank the stub earns on a perfect run: one stamp lets you in for a visit,
// the other marks the residency.
//
// It is the dark-side briefing's stamp (briefStampHTML in app.js, the .brief-go stock and the
// shared #stampInk0 filter), widened on the left for the mark. The ink is the pass's pen by day
// and its stampNight by night. The words never change: a guest's own lyric is kept for its
// birthday finish on the front page, so the shelf does not spend it every day.
import { escapeHtml } from "./util.js";

const WORDS = "ADMIT ONE";

export function guestStampHTML(g) {
  const lead = 54, w = Math.round(70 + WORDS.length * 17 + lead);
  const mark = g.mark
    ? `<g transform="translate(20 18) scale(2.4)" stroke-width="1.7">${g.mark}</g>` : "";
  return `<button type="button" class="brief-go guest-go" data-play="${escapeHtml(g.id)}"` +
    ` style="--guest-ink:${g.ink.pen};--guest-ink-night:${g.stampNight || g.ink.accent}"` +
    ` aria-label="${escapeHtml(`Admit one: play ${g.name}`)}">` +
    `<svg viewBox="0 0 ${w} 84" style="width:${(w * 0.62).toFixed(0)}px" aria-hidden="true"><g filter="url(#stampInk0)">` +
    `<rect x="4" y="4" width="${w - 8}" height="76" rx="7" fill="none" stroke="currentColor" stroke-width="4"/>` +
    `<rect x="12" y="12" width="${w - 24}" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/>` +
    mark +
    `<text x="${(w + lead) / 2}" y="52" text-anchor="middle" textLength="${w - 64 - lead}" lengthAdjust="spacing" fill="currentColor">${WORDS}</text>` +
    `</g></svg></button>`;
}
