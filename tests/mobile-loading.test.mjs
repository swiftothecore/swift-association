import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { GUESTS } from "../js/config.js";

const source = readFileSync(new URL("../sw.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const origin = "https://notebook.test/";
function harness() {
  const events = {}, stores = new Map();
  const key = (input) => new URL(typeof input === "string" ? input : input.url, origin).href;
  const cacheFor = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const data = stores.get(name);
    return {
      put: async (req, res) => { data.set(key(req), res.clone()); },
      match: async (req) => data.get(key(req))?.clone(),
      keys: async () => [...data.keys()].map((url) => new Request(url)),
    };
  };
  const caches = {
    open: async (name) => cacheFor(name), keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name),
    match: async (req) => { for (const data of stores.values()) if (data.has(key(req))) return data.get(key(req)).clone(); },
  };
  let network = async () => new Response("fresh");
  const context = vm.createContext({ caches, URL, Response,
    Request: class extends Request { constructor(input, options) { super(key(input), options); } },
    location: new URL(origin), fetch: (...args) => network(...args),
    self: { location: new URL(origin + "sw.js"), registration: { scope: origin }, addEventListener: (name, cb) => { events[name] = cb; },
      skipWaiting: async () => {}, clients: { claim: async () => {} } },
  });
  vm.runInContext(source, context);
  return { caches, context, network: (fn) => { network = fn; },
    async dispatch(name, detail = {}) {
      let response;
      const pending = [];
      events[name]({ ...detail, waitUntil: (promise) => pending.push(promise), respondWith: (promise) => { response = promise; } });
      const result = await response;
      await Promise.all(pending);
      return result;
    },
  };
}

test("shelf metadata matches each guest without downloading catalogues", () => {
  for (const guest of GUESTS) {
    const data = JSON.parse(readFileSync(new URL(`../${guest.file}`, import.meta.url), "utf8"));
    assert.equal(guest.songCount, data.albums.reduce((sum, album) => sum + album.songs.length, 0), guest.id);
  }
  const shelf = app.slice(app.indexOf("function renderGuestShelfPage("), app.indexOf("function guestPassMarkup("));
  assert.doesNotMatch(shelf, /loadGuest\(/);
});

test("a fresh install includes all startup data and reports its complete offline copy", async () => {
  const h = harness();
  await h.dispatch("install");
  const name = vm.runInContext("CACHE", h.context);
  const cache = await h.caches.open(name);
  for (const path of ["data/nashville.json", "js/offline.js", "index.html", "data/songs.json"])
    assert.ok(await cache.match(path), path);
  let result;
  await h.dispatch("message", { data: { type: "offline-status" }, ports: [{ postMessage: (data) => { result = data; } }] });
  assert.equal(result.ready, true);
  assert.equal(result.version, name);
});

test("updates preserve downloaded guests while replacing the old app shell", async () => {
  const h = harness();
  const old = await h.caches.open("stta-old");
  await old.put("data/guests/olivia-rodrigo.json", new Response("saved guest"));
  await old.put("js/app.js", new Response("old app"));
  await h.dispatch("install");
  await h.dispatch("activate");
  assert.equal((await h.caches.keys()).includes("stta-old"), false);
  const guests = await h.caches.open("stta-guests");
  assert.equal(await (await guests.match("data/guests/olivia-rodrigo.json")).text(), "saved guest");
  assert.equal(await guests.match("js/app.js"), undefined);
  h.network(async () => { throw new TypeError("offline"); });
  const hit = await h.dispatch("fetch", { request: new Request(`${origin}data/guests/olivia-rodrigo.json`) });
  assert.equal(await hit.text(), "saved guest");
});

test("a failed guest refresh never overwrites the saved catalogue", async () => {
  const h = harness();
  const request = new Request(`${origin}data/guests/olivia-rodrigo.json`);
  await h.dispatch("fetch", { request });
  h.network(async () => new Response("unavailable", { status: 503 }));
  const result = await h.dispatch("fetch", { request });
  assert.equal(result.status, 200);
  assert.equal(await result.text(), "fresh");
});

test("optional shelf fetch failures do not prevent installing the core corpus", async () => {
  const start = app.indexOf("async function loadData()");
  const end = app.indexOf("/* ---------- The corpus", start);
  const load = app.slice(start, end).replace('import("./cassette.js")', 'Promise.resolve({ install() {} })');
  let installed = false;
  const context = vm.createContext({ console: { warn() {} }, HOME_ARTIST: "Taylor Swift",
    fetch: async (path) => {
      if (!["data/words.json", "data/songs.json"].includes(path)) throw new TypeError("offline");
      return { ok: true, json: async () => [] };
    }, installCorpus: () => { installed = true; return { allSongs: [] }; },
  });
  await vm.runInContext(`${load}\nloadData()`, context);
  assert.equal(installed, true);
});


test("offline search deep links use the search shell and retain the query", async () => {
  const h = harness();
  await h.dispatch("install");
  h.network(async () => { throw new TypeError("offline"); });
  const response = await h.dispatch("fetch", { request: {
    url: `${origin}search/?q=love&mode=exact`, method: "GET", mode: "navigate",
  } });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "fresh");
});
