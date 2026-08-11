"use strict";

// Caveat is the notebook's authored handwriting face. Mark the outer boundary of
// every rendered Caveat run so inherited descendants do not compound the effect.
// A stable DOM-position seed gives repeated elements different ink without making
// them twitch when a screen rerenders.
const HAND_FACE = "caveat";
const VARIANT_COUNT = 7;
const STEADY_SELECTOR = [
  ".ink-steady",
  '[data-ink="steady"]',
  "input",
  "textarea",
  "select",
  "option",
  '[contenteditable]:not([contenteditable="false"])',
  '[role="textbox"]',
  "script",
  "style",
  "template",
  "noscript",
].join(",");

function isHandwritten(element, cache) {
  if (!element || element.namespaceURI === "http://www.w3.org/2000/svg") return false;
  if (cache.has(element)) return cache.get(element);
  const handwritten = getComputedStyle(element).fontFamily.toLowerCase().includes(HAND_FACE);
  cache.set(element, handwritten);
  return handwritten;
}

function siblingIndex(element) {
  let index = 0;
  for (let sibling = element.previousElementSibling; sibling; sibling = sibling.previousElementSibling) index += 1;
  return index;
}

function stableVariant(element) {
  let seed = 0;
  let depth = 1;
  for (let node = element; node && node !== document.documentElement; node = node.parentElement) {
    seed += (siblingIndex(node) + 1) * depth * 11;
    seed += node.tagName.length * (depth + 3);
    depth += 1;
  }
  return String(seed % VARIANT_COUNT);
}

function ownsText(element) {
  return Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  );
}

function hasVariedHandwritingAncestor(element, cache) {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (parent.closest(STEADY_SELECTOR)) return false;
    if (ownsText(parent) && isHandwritten(parent, cache)) return true;
  }
  return false;
}

function clearVariation(element) {
  if (element.classList.contains("ink-varied")) element.classList.remove("ink-varied");
  if (element.hasAttribute("data-ink-variant")) element.removeAttribute("data-ink-variant");
}

function syncElement(element, cache) {
  if (!(element instanceof HTMLElement)) return;
  if (element.closest(STEADY_SELECTOR) || element.closest("svg")) {
    clearVariation(element);
    return;
  }

  const handwritten = isHandwritten(element, cache);
  if (!handwritten || !ownsText(element) || hasVariedHandwritingAncestor(element, cache)) {
    clearVariation(element);
    return;
  }

  if (!element.classList.contains("ink-varied")) element.classList.add("ink-varied");
  const variant = stableVariant(element);
  if (element.dataset.inkVariant !== variant) element.dataset.inkVariant = variant;
}

function syncWithin(root) {
  if (root !== document && !(root instanceof HTMLElement)) return;
  const cache = new WeakMap();
  if (root instanceof HTMLElement) syncElement(root, cache);
  root.querySelectorAll("*").forEach((element) => syncElement(element, cache));
}

function start() {
  syncWithin(document);
  new MutationObserver((changes) => {
    const roots = new Set();
    changes.forEach((change) => {
      if (change.type === "attributes") roots.add(change.target);
      else if (change.type === "characterData") roots.add(change.target.parentElement);
      else roots.add(change.target);
    });
    roots.forEach(syncWithin);
  }).observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "data-ink"],
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
