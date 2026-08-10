"use strict";

// This site never collects credentials. Tell the major password managers that every
// editable field is game/search content, including fields rendered after page load.
// Managers run in the user's browser and may choose to ignore these opt-out markers.
const selector = 'input:not([type="file"]):not([type="hidden"]), textarea';
const attributes = {
  autocomplete: "off",
  "data-1p-ignore": "true",
  "data-lpignore": "true",
  "data-bwignore": "true",
  "data-protonpass-ignore": "true",
  "data-dashlane-ignore": "true",
  "data-form-type": "other",
};

function mark(field) {
  Object.entries(attributes).forEach(([name, value]) => field.setAttribute(name, value));
}

function markWithin(root) {
  if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
  if (root.matches?.(selector)) mark(root);
  root.querySelectorAll?.(selector).forEach(mark);
}

function start() {
  markWithin(document);
  new MutationObserver((changes) => {
    changes.forEach((change) => change.addedNodes.forEach(markWithin));
  }).observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
