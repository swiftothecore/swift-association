// Sharing — the one place that knows how to get something out of the notebook and into
// someone else's hands. Shared by the game's daily result and the searcher's deep link.
//
// Two paths, in order of preference:
//  1. navigator.share() — hands the payload to the OS share sheet (Messages, WhatsApp,
//     AirDrop…). Mobile Safari/Chrome and desktop Chrome/Edge have it; desktop Firefox
//     does not, which is why the clipboard path below is a peer and not a legacy relic.
//  2. the clipboard — what we always did, kept intact for everywhere the sheet isn't.
//
// Callers ask canShare() at render time to word their button honestly ("Share" vs "Copy"),
// then call shareOrCopy() and switch on the outcome. Nobody calls navigator.share directly.

// The canonical public address. Deliberately NOT location.origin: a result shared from
// localhost or a Pages preview should still send people somewhere real.
export const SITE_URL = "https://swiftassociation.com";

// Does this browser really have the sheet?
const hasNativeShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

// Dev override (see __dev.share) — null tells the truth, true/false force a branch. The
// sheet is invisible on a desktop dev machine, so without this the "Share"-worded half
// of every label can only be seen on a phone.
let simulated = null;
export function simulateShare(v) { simulated = (v == null ? null : !!v); return simulated; }

// Is the OS share sheet available at all? Cheap and synchronous, so it's safe to call
// while building markup.
export function canShare() {
  return simulated === null ? hasNativeShare() : simulated;
}

// Copy text to the clipboard, preferring the async Clipboard API and falling back to a
// hidden-textarea execCommand for older browsers / non-secure contexts. Returns success.
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* fall through to the legacy path */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) { return false; }
}

// Share `{title, text, url}` via the OS sheet, falling back to copying `copyText`
// (default: text and url on separate lines; pass it explicitly when the clipboard
// wants something different from the sheet — e.g. a bare link).
//
// Returns one of:
//   "shared"    — handed off to the share sheet
//   "copied"    — no sheet (or it declined the payload); the clipboard has it
//   "cancelled" — the user dismissed the sheet without picking a target
//   "failed"    — neither path worked
//
// "cancelled" is the important one: dismissing the sheet is a normal, frequent outcome
// that rejects with AbortError, and a caller that lumps it in with success will cheerfully
// claim "Shared!" when nothing was sent. Every caller must handle it separately.
//
// MUST be called directly from a user gesture — browsers reject share() otherwise, so
// don't await anything slow between the click and this call.
export async function shareOrCopy({ title, text, url, copyText } = {}) {
  const payload = {};
  if (title) payload.title = title;
  if (text) payload.text = text;
  if (url) payload.url = url;

  // Dev: a simulated sheet on a machine that has none. Print what would have gone out
  // and report success, so the "shared" label path is reachable off a phone.
  if (simulated === true && !hasNativeShare()) {
    console.log("[share] simulated sheet — payload:", payload);
    return "shared";
  }

  // canShare(data) is the payload-level check (a browser can have share() but refuse
  // these fields); when it's absent, the try/catch below is the safety net.
  const shareable = canShare() && hasNativeShare()
    && (!navigator.canShare || navigator.canShare(payload));
  if (shareable) {
    try {
      await navigator.share(payload);
      return "shared";
    } catch (e) {
      if (e && e.name === "AbortError") return "cancelled";
      // Anything else (permission, an unsupported target, a platform quirk) is a real
      // failure of the sheet, not of sharing — the clipboard can still do the job.
    }
  }

  const fallback = copyText != null ? copyText : [text, url].filter(Boolean).join("\n");
  return (await copyToClipboard(fallback)) ? "copied" : "failed";
}
