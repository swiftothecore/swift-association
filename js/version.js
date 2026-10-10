// The version tag: press ~ (shift + `) to show or hide the deploy this page is running, pinned
// to the bottom-right corner. It exists so a reload can be checked at a glance: the page is
// served cache-first, so "did I get the new one?" is otherwise invisible. A temporary dev aid,
// to come out once the game has real players.
//
// "Running" is asked of the worker that controlled the page when it loaded, because that is the
// cache this page's modules came out of. A newer worker may claim the page later on, so the
// answer is taken once at boot and kept. "Latest" is read straight out of sw.js on the server.
const SHOW_KEY = "swiftSongAssociation.versionTag";

const askWorker = (worker) => new Promise((resolve) => {
  if (!worker) return resolve(null);
  const channel = new MessageChannel();
  const timeout = setTimeout(() => resolve(null), 3000);
  channel.port1.onmessage = (e) => { clearTimeout(timeout); resolve(e.data?.version || null); };
  try { worker.postMessage({ type: "version" }, [channel.port2]); }
  catch (_) { clearTimeout(timeout); resolve(null); }
});

const running = askWorker(navigator.serviceWorker?.controller);

async function latest() {
  try {
    const text = await (await fetch("sw.js", { cache: "no-store" })).text();
    return (text.match(/const CACHE = "([^"]+)"/) || [])[1] || null;
  } catch (_) { return null; }
}

let tag = null;

async function paint() {
  const [mine, served] = await Promise.all([running, latest()]);
  if (!tag) return;
  const short = (v) => v.replace(/^stta-/, "");
  if (!mine) {
    tag.textContent = served ? `${short(served)} · uncached` : "no worker";
    tag.dataset.state = "";
  } else if (!served || served === mine) {
    tag.textContent = short(mine) + (served ? " · latest" : " · offline");
    tag.dataset.state = served ? "latest" : "";
  } else {
    tag.textContent = `${short(mine)} · ${short(served)} out, reload`;
    tag.dataset.state = "stale";
  }
}

function show(on) {
  if (on && !tag) {
    tag = document.createElement("div");
    tag.className = "version-tag";
    tag.setAttribute("aria-hidden", "true");
    tag.textContent = "…";
    document.body.append(tag);
    paint();
  } else if (!on && tag) {
    tag.remove();
    tag = null;
  }
  try { on ? localStorage.setItem(SHOW_KEY, "1") : localStorage.removeItem(SHOW_KEY); } catch (_) { /* ignore */ }
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "~" || e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  e.preventDefault();
  show(!tag);
});

let wasOn = false;
try { wasOn = localStorage.getItem(SHOW_KEY) === "1"; } catch (_) { /* ignore */ }
if (wasOn) show(true);
