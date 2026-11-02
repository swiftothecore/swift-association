/* ---------- The ink edge ----------
   Every glyph sits a little in from the left of its advance box, by a different amount per
   letter. In Caveat it is a lot: a 44px "C" puts its ink 4.5px right of the box, a 48px "Y" 10px,
   while a "J" or "j" hangs its tail LEFT of it. Courier Prime is monospaced, so its narrow glyphs
   sit centred in a wide cell and a typed "1" starts a pixel in. So a handwritten heading over a
   typed line starts visibly further in than the line below it, and a column of song titles looks
   ragged even though every box starts at the same x.

   This pulls the first letter's ink back onto the box edge. It is universal by design: nothing
   opts in. Any block of Caveat or Courier Prime text whose first rendered content is that text
   gets a text-indent
   of minus its first glyph's left sidebearing, in em, so it holds at every text size. Text-indent
   rather than a margin because it moves the ink and leaves the box, the border and the layout
   exactly where they were, and it only ever touches the first line.

   Skipped on purpose: inline elements (text-indent does not apply to them), centred and
   right-aligned text (their edge is not a left edge), and blocks whose first line opens on
   something other than text, such as an icon, an image or a ::before marker.

   THE TABLES. Measured, not eyeballed: for each glyph, canvas measureText(ch).actualBoundingBoxLeft
   on the shipped files in fonts/, at 1000px, so each number is thousandths of an em (positive
   means the ink starts right of the origin). Caveat is variable and its sidebearings move with
   weight ("D" goes 79 to 49 from 400 to 700), so it is measured at the four weights the
   stylesheet uses and interpolated between them. Courier Prime ships three static faces, so it
   is one row per face, picked the way CSS font matching picks them. If a font file is ever
   replaced, remeasure. */

const CHARS = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" +
  "¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ" +
  "‘’“”…–—";
// Caveat 400, 500, 600, 700.
const CAVEAT_ROWS = [
  "65,175,71,55,96,70,165,147,31,188,103,33,103,75,29,138,162,119,143,182,129,117,181,123,208,81,40,123,101,141,144,96,48,81,114,79,80,81,114,79,46,-40,81,101,34,81,114,81,113,79,131,168,122,190,141,53,219,61,56,171,-47,128,42,262,81,120,100,96,104,77,68,93,96,-80,74,84,88,104,95,35,102,103,103,115,109,109,126,56,-49,25,140,104,78,102,1,181,24,126,90,100,133,246,159,175,123,120,159,231,207,103,182,212,333,36,159,143,42,229,186,179,189,189,172,20,48,48,48,48,48,48,54,114,80,80,80,80,46,46,46,46,79,81,114,114,114,114,114,142,98,122,122,122,122,219,76,44,81,81,81,81,81,81,76,75,104,104,104,104,96,96,96,96,100,104,95,95,95,95,95,103,50,109,109,109,109,-49,35,-49,173,191,182,196,75,103,103",
  "63,169,66,52,97,65,161,144,26,185,98,30,98,75,27,135,164,118,143,173,130,122,182,118,202,80,36,117,99,141,142,89,45,78,110,69,78,78,110,77,45,-45,78,97,35,79,110,79,109,77,130,166,120,189,137,51,216,55,51,165,-50,124,39,258,79,119,98,92,100,76,66,92,93,-83,74,83,87,99,92,29,98,98,99,110,106,106,120,55,-57,25,136,99,75,100,-2,181,24,121,80,96,128,235,154,166,120,120,154,226,202,98,181,209,331,33,154,138,35,230,183,174,178,178,155,15,44,44,44,44,44,44,54,109,77,77,77,77,44,44,44,45,71,78,109,109,109,109,109,142,91,120,120,120,120,216,76,37,78,78,78,78,78,78,73,68,99,99,99,99,92,92,92,92,93,98,91,91,91,91,91,98,50,106,106,106,106,-57,32,-57,167,186,173,184,75,98,98",
  "62,162,62,48,97,60,157,140,21,183,93,28,93,76,24,133,167,116,144,164,132,126,182,113,197,78,31,111,96,135,140,81,43,75,107,59,77,76,107,76,44,-50,76,94,36,78,107,77,106,76,129,165,119,188,134,48,212,48,46,160,-52,120,35,255,77,119,97,88,96,74,63,91,91,-87,74,82,87,94,90,23,94,94,95,105,102,104,114,55,-64,24,133,94,73,99,-6,181,24,116,71,92,123,225,148,157,118,120,148,222,197,93,179,205,330,30,149,133,29,222,180,169,157,157,138,10,40,40,40,40,40,40,54,104,74,74,74,74,41,41,41,44,59,75,104,104,104,104,104,142,85,119,119,119,119,212,75,29,74,74,74,74,74,74,70,62,93,93,93,93,89,89,89,89,87,91,87,87,87,87,87,93,50,102,102,102,102,-64,30,-64,162,180,164,173,75,93,93",
  "60,156,57,45,98,54,153,137,16,180,88,25,88,76,22,130,169,115,144,155,133,131,183,108,191,77,27,105,94,127,138,74,40,72,103,49,75,73,103,74,43,-57,73,89,36,76,103,75,102,74,128,163,117,187,130,46,209,42,41,154,-55,116,32,251,75,118,95,84,92,73,61,90,88,-90,74,81,86,89,87,17,90,89,88,100,99,101,108,54,-72,22,129,89,70,97,-9,181,24,111,61,88,118,214,143,148,115,120,143,217,192,88,178,202,328,27,141,128,22,207,177,164,129,129,121,5,36,36,36,36,36,36,54,99,71,71,71,71,39,39,39,43,47,72,99,99,99,99,99,142,78,117,117,117,117,209,75,22,71,71,71,71,71,71,67,55,88,88,88,88,85,85,85,85,80,85,83,83,83,83,83,88,50,99,99,99,99,-72,27,-72,156,175,155,161,75,88,88",
];
// Courier Prime regular, bold, italic.
const COURIER_ROWS = [
  "239,125,29,87,24,72,237,145,177,93,83,182,83,234,97,92,107,91,93,72,92,98,112,101,94,234,191,61,83,85,124,24,5,39,58,39,39,39,48,39,98,56,39,39,15,34,43,39,43,39,77,60,34,5,-5,24,29,82,161,97,175,113,-14,153,66,18,62,62,71,91,62,38,91,93,33,86,-2,38,64,18,62,72,87,57,35,24,-5,34,24,87,86,263,116,73,239,62,99,54,29,263,87,151,18,118,75,68,64,142,120,83,141,147,204,106,64,234,171,150,115,77,-2,-2,10,128,5,5,5,5,5,5,0,58,39,39,39,39,98,98,98,98,24,34,43,43,43,43,43,114,43,34,34,34,34,29,54,20,66,66,66,66,66,66,37,62,71,71,71,71,91,91,91,91,68,38,64,64,64,64,64,83,41,35,35,35,35,24,18,24,206,213,86,94,53,83,-15",
  "223,86,24,80,24,52,218,125,147,92,83,172,83,219,78,65,91,77,89,59,86,78,92,83,73,219,182,59,83,71,102,16,-5,34,50,29,29,29,36,24,83,48,24,29,5,24,31,29,31,29,73,48,24,-5,-10,15,20,67,142,78,147,94,-19,135,54,13,62,47,64,82,47,23,82,78,28,77,-7,28,54,18,47,62,80,47,24,20,-10,34,20,67,81,239,112,63,223,62,73,50,20,239,78,131,14,112,46,59,61,137,107,83,136,137,199,90,49,219,171,143,109,63,-10,-10,-5,112,-5,-5,-5,-5,-5,-5,-15,50,29,29,29,29,83,83,83,83,20,24,31,31,31,31,31,104,31,24,24,24,24,20,59,11,54,54,54,54,54,54,16,62,64,64,64,64,82,82,82,82,60,28,54,54,54,54,54,83,41,24,24,24,24,20,18,20,185,201,48,64,43,83,-15",
  "209,186,29,68,32,63,298,148,122,135,98,129,98,201,40,103,96,62,77,73,77,104,154,94,91,201,149,76,81,67,174,19,-25,9,68,9,9,9,59,9,73,37,9,9,-15,9,55,9,57,9,45,88,91,66,56,-5,90,57,103,181,117,127,-28,195,69,63,64,64,74,-51,40,83,120,41,97,134,36,76,67,-45,71,42,56,88,74,63,33,4,-7,62,98,203,53,88,179,77,71,48,85,203,68,199,30,151,84,100,98,198,165,63,152,162,259,42,100,239,108,166,155,68,19,19,32,76,-25,-25,-25,-25,-25,-25,-30,68,9,9,9,9,73,73,73,73,9,9,55,55,55,55,55,106,30,91,91,91,91,90,29,84,69,69,69,69,69,69,21,64,74,74,74,74,120,120,120,120,69,76,67,67,67,67,67,98,13,74,74,74,74,-7,-45,-7,244,247,125,127,21,98,0",
];
const rows = (...list) => list.map((row) => row.split(",").map(Number));
const CAVEAT = rows(...CAVEAT_ROWS);
const COURIER = rows(...COURIER_ROWS);
const INDEX = new Map(Array.from(CHARS, (ch, i) => [ch, i]));

/* The first letter's left sidebearing in em, or 0 for a glyph not measured. */
export function inkSidebearing(ch, family = "Caveat", weight = 400, italic = false) {
  const i = INDEX.get(ch);
  if (i === undefined) return 0;
  const w = Number(weight) || 400;
  if (family === "Courier Prime") {
    // CSS matching: 600 and up takes the 700 file, below that the 400; the italic is 400 only.
    return COURIER[italic ? 2 : w >= 600 ? 1 : 0][i] / 1000;
  }
  // Caveat, at 400, 500, 600 and 700, interpolated between.
  const c = Math.min(700, Math.max(400, w));
  const lo = Math.min(2, Math.floor((c - 400) / 100));
  const t = (c - (400 + lo * 100)) / 100;
  return (CAVEAT[lo][i] + (CAVEAT[lo + 1][i] - CAVEAT[lo][i]) * t) / 1000;
}

// Below this the correction is invisible, and skipping it keeps inline styles off most text.
const MIN_PX = 0.4;
// Only the face the element actually asks for first; a fallback stack behind it is not measured.
const FACE = /^"?(Caveat|Courier Prime)"?(,|$)/;
const BLOCKISH = /^(block|flex|grid|list-item|flow-root|table-cell|table-caption)$/;
// Elements that can open a line and are not text: if one comes first, the edge is not the ink.
const NOT_TEXT = /^(svg|img|picture|canvas|video|input|textarea|select|button|br|hr|iframe|object)$/i;

/* The first character the element will paint on its first line, or "" when that line opens on
   something else. Walks down through inline wrappers only: a block child starts its own line,
   so its text is its own business, and the walk reaches it separately. */
function firstInkChar(el) {
  for (let node = el.firstChild; node; ) {
    if (node.nodeType === 3) {
      const text = node.data.trimStart();
      if (text) return text[0];
    } else if (node.nodeType === 1) {
      if (NOT_TEXT.test(node.tagName)) return "";
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.position === "absolute" || cs.position === "fixed") {
        node = nextNode(node, el);
        continue;
      }
      if (!cs.display.startsWith("inline")) return "";
      if (node.firstChild) { node = node.firstChild; continue; }
    }
    node = nextNode(node, el);
  }
  return "";
}
function nextNode(node, root) {
  while (node && node !== root) {
    if (node.nextSibling) return node.nextSibling;
    node = node.parentNode;
  }
  return null;
}
function hasLeadingMarker(el) {
  const before = getComputedStyle(el, "::before");
  if (before.content === "none" || before.content === "normal") return false;
  return before.position !== "absolute" && before.position !== "fixed";
}

function settle(el) {
  // SVG text has no text-indent; its x is the drawing's business.
  if (el.namespaceURI !== "http://www.w3.org/1999/xhtml" || el.isContentEditable) return;
  const cs = getComputedStyle(el);
  let em = 0;
  const family = FACE.exec(cs.fontFamily)?.[1];
  if (family && BLOCKISH.test(cs.display) &&
      !/^(center|right|end)$/.test(cs.textAlign) && !hasLeadingMarker(el)) {
    const ch = firstInkChar(el);
    if (ch) em = inkSidebearing(ch, family, cs.fontWeight, cs.fontStyle !== "normal");
    if (Math.abs(em) * parseFloat(cs.fontSize) < MIN_PX) em = 0;
  }
  if (em) {
    el.style.textIndent = `${(-em).toFixed(3)}em`;
    el.dataset.inkEdge = "";
  } else if ("inkEdge" in el.dataset) {
    el.style.textIndent = "";
    delete el.dataset.inkEdge;
  }
}

/* Watches the document for the life of the page. Mutations are gathered and settled once per
   frame, and only what a mutation touched is measured: an added subtree in full, and for a node
   whose children changed, just the block it belongs to, since only its first letter can have
   moved. Appending a toast to <body> therefore costs the toast, not a sweep of the notebook. */
export function watchInkEdges(root = document.body) {
  const deep = new Set(), shallow = new Set();
  let frame = 0;
  const blockOf = (el) => {
    while (el && el !== root && getComputedStyle(el).display.startsWith("inline")) el = el.parentElement;
    return el;
  };
  const flush = () => {
    frame = 0;
    for (const el of deep) {
      if (!el.isConnected) continue;
      settle(el);
      for (const child of el.getElementsByTagName("*")) settle(child);
    }
    for (const el of shallow) {
      const block = el.isConnected && blockOf(el);
      if (block && !deep.has(block)) settle(block);
    }
    deep.clear(); shallow.clear();
  };
  const queue = (set, el) => {
    if (!el || el.nodeType !== 1) return;
    set.add(el);
    if (!frame) frame = requestAnimationFrame(flush);
  };
  new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === "characterData") { queue(shallow, r.target.parentElement); continue; }
      queue(shallow, r.target);
      for (const n of r.addedNodes) queue(deep, n);
    }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  queue(deep, root);
}
