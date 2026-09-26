// Installation and offline storage are independent of live game state.
let installPrompt = null;
let refreshSettings = () => {};
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  refreshSettings();
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  refreshSettings();
});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => refreshSettings());
  navigator.serviceWorker.ready.then(() => refreshSettings());
}

export function readOfflineStatus() {
  const worker = navigator.serviceWorker?.controller;
  if (!worker) return Promise.resolve(null);
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const finish = (value) => {
      clearTimeout(timeout);
      channel.port1.close();
      resolve(value);
    };
    const timeout = setTimeout(() => finish(null), 3000);
    channel.port1.onmessage = (event) => finish(event.data);
    try { worker.postMessage({ type: "offline-status" }, [channel.port2]); }
    catch (_) { finish(null); }
  });
}

export function offlineSettingsHTML() {
  return `<p class="set-note" id="offlineStatus" role="status">Checking the offline copy…</p>` +
    `<p class="set-note" id="offlineGuests"></p>` +
    `<div class="set-actions"><button type="button" class="date-stamp" id="offlineCheck">check again<small id="offlineChecked">checking…</small></button>` +
    `<button type="button" class="date-stamp" id="installNotebook" hidden>keep it close<small>add to home screen</small></button></div>` +
    `<p class="set-note">Keep the notebook close: on iPhone or iPad, open it in Safari and choose Share, then Add to Home Screen. In other browsers, look for Install or Add to Home Screen in the browser menu.</p>` +
    `<p class="set-note">Offline files and your progress belong to this browser. Keep a backup of your notebook before changing browsers or clearing storage.</p>`;
}

// The check-again stamp's date, in the three-letter months a rubber date stamp carries.
const STAMP_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function mountOfflineSettings(body, guests) {
  const status = body.querySelector("#offlineStatus");
  const savedGuests = body.querySelector("#offlineGuests");
  const install = body.querySelector("#installNotebook");
  if (!status || !install) return;
  let request = 0;
  const refresh = async () => {
    if (!status.isConnected) return;
    const current = ++request;
    install.hidden = !installPrompt || matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    const result = await readOfflineStatus();
    if (!status.isConnected || current !== request) return;
    const checked = body.querySelector("#offlineChecked");
    if (checked) {
      const now = new Date();
      checked.textContent = `last · ${now.getDate()} ${STAMP_MONTHS[now.getMonth()]}`;
    }
    status.textContent = result?.ready
      ? "Ready for offline play. The main notebook and lyric search are saved on this device."
      : "The offline copy is not ready yet. Stay online while the notebook downloads, then check again.";
    const files = new Set(result?.guests || []);
    const saved = guests.filter((guest) => files.has(new URL(guest.file, document.baseURI).href));
    savedGuests.textContent = saved.length
      ? `Guest catalogues saved: ${saved.map((guest) => guest.name).join(", ")}. Open another guest while online to save it too.`
      : "Guest catalogues download when you open them while online. None are confirmed saved yet.";
  };
  refreshSettings = refresh;
  body.querySelector("#offlineCheck").addEventListener("click", refresh);
  install.addEventListener("click", async () => {
    if (!installPrompt) return;
    const prompt = installPrompt;
    installPrompt = null;
    install.hidden = true;
    try { await prompt.prompt(); await prompt.userChoice; }
    catch (_) { /* The browser menu remains available if the native prompt is unavailable. */ }
    refresh();
  });
  refresh();
}
