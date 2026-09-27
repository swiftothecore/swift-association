// Which season it is, for the two things that keep one: the desk calendar's month marks and
// the Seasons start-button finish. They read this one module so the pad and the button can
// never disagree about whether it is autumn yet.
//
// Seasons turn on the first of the month (meteorological, not the equinoxes): March, June,
// September and December each begin one. The month is the player's own, taken from the
// date key the rest of the app already agrees on (todayKey in app.js, which honours the
// Settings timezone and the dev date override), so this module never reads a clock itself.
import { loadSettings } from "./storage.js";

// Indexed NORTHERN: [0] is January.
export const MONTH_SEASON = ["winter", "winter", "spring", "spring", "spring", "summer",
                             "summer", "summer", "autumn", "autumn", "autumn", "winter"];
export const SEASONS = ["spring", "summer", "autumn", "winter"];

// Which hemisphere's seasons the player lives. A browser will not answer this: the
// timezone is the only signal on offer, and an IANA id names a place, not a
// latitude. So this is a hand-kept list rather than a clever test, and it lists
// COUNTRIES whose seasons are lived as southern rather than every zone that
// happens to sit below the equator. Somewhere tropical has no four seasons to
// be wrong about, so nothing equatorial is here and anything unlisted keeps the
// northern set. The zone comes from the same place the daily reset takes it:
// the Settings override first, the detected zone otherwise.
const SOUTHERN_PREFIX = ["Australia/", "Antarctica/", "America/Argentina/"];
const SOUTHERN_ZONES = new Set([
  // New Zealand and the southern Pacific
  "Pacific/Auckland", "Pacific/Chatham", "Pacific/Norfolk", "Pacific/Fiji", "Pacific/Noumea",
  "Pacific/Port_Moresby", "Pacific/Bougainville", "Pacific/Guadalcanal", "Pacific/Efate",
  "Pacific/Tongatapu", "Pacific/Apia", "Pacific/Niue", "Pacific/Rarotonga", "Pacific/Tahiti",
  "Pacific/Marquesas", "Pacific/Gambier", "Pacific/Pitcairn", "Pacific/Pago_Pago", "Pacific/Easter",
  // South America
  "America/Sao_Paulo", "America/Bahia", "America/Fortaleza", "America/Recife", "America/Maceio",
  "America/Araguaina", "America/Belem", "America/Santarem", "America/Manaus", "America/Boa_Vista",
  "America/Porto_Velho", "America/Rio_Branco", "America/Eirunepe", "America/Campo_Grande",
  "America/Cuiaba", "America/Noronha", "America/Santiago", "America/Punta_Arenas",
  "America/Montevideo", "America/Asuncion", "America/La_Paz", "America/Lima",
  // the pre-2009 Argentine ids, still handed out by older browsers
  "America/Buenos_Aires", "America/Cordoba", "America/Rosario", "America/Mendoza",
  "America/Catamarca", "America/Jujuy",
  // southern Africa and the southern Indian Ocean
  "Africa/Johannesburg", "Africa/Windhoek", "Africa/Gaborone", "Africa/Maseru", "Africa/Mbabane",
  "Africa/Harare", "Africa/Lusaka", "Africa/Blantyre", "Africa/Maputo", "Africa/Luanda",
  "Africa/Lubumbashi", "Indian/Antananarivo", "Indian/Mauritius", "Indian/Reunion",
  "Indian/Kerguelen",
]);

function zoneName() {
  try {
    const tz = loadSettings().timezone;
    if (tz && tz !== "auto") return tz;
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (e) { return ""; }
}
// Session-only override (window.__devHemisphere, set from the dev panel's date section):
// it lives on window and never in storage, so a reload is always honestly where you are.
export function southernSeasons() {
  const dev = typeof window !== "undefined" && window.__devHemisphere;
  if (dev === "south" || dev === "north") return dev === "south";
  const zone = zoneName();
  return !!zone && (SOUTHERN_ZONES.has(zone) || SOUTHERN_PREFIX.some((p) => zone.startsWith(p)));
}
// The month (0-11) whose NORTHERN season the player is living: the real month up north,
// half a year around it down south.
export const seasonMonth = (m) => southernSeasons() ? (m + 6) % 12 : m;

// The season on a "YYYY-MM-DD" date key. A session-only window.__devSeason (dev panel,
// start button section) pins it outright, for looking at one finish out of its months.
export function seasonOn(dateKey) {
  const dev = typeof window !== "undefined" && window.__devSeason;
  if (SEASONS.includes(dev)) return dev;
  const m = Math.min(11, Math.max(0, (parseInt(String(dateKey).slice(5, 7), 10) || 1) - 1));
  return MONTH_SEASON[seasonMonth(m)];
}
