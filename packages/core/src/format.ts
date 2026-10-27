import dayjs from "dayjs";

export const formatPeso = (amount: number) => `₱${amount.toFixed(2)}`;

export const formatKm = (km: number) => `${km.toFixed(1)} km`;

/** Metres under 1 km ("240 m"), kilometres above ("1.2 km"). */
export const formatDistance = (km: number) =>
  km < 1 ? `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m` : formatKm(km);

export function formatAgo(ms: number, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - ms) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.round(minutes / 60)} h ago`;
}

export const formatClock = (ms: number) => dayjs(ms).format("h:mm A");

/** "05:00" → "5:00 AM" */
export function formatHourMinute(value: string) {
  const [h, m] = value.split(":").map(Number);
  if (!Number.isFinite(h)) return value;
  return dayjs()
    .hour(h)
    .minute(Number.isFinite(m) ? m : 0)
    .format("h:mm A");
}

/** Minutes since midnight for an "HH:mm" string. */
export function minutesOfDay(value: string) {
  const [h, m] = value.split(":").map(Number);
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
}

/** ISO date string or epoch ms → "Apr 21, 2025". */
export const formatDate = (value: string | number) => {
  const d = dayjs(value);
  return d.isValid() ? d.format("MMM D, YYYY") : String(value);
};

export const formatAlertTime = (ms: number, now = Date.now()) =>
  dayjs(ms).isSame(now, "day") ? formatClock(ms) : dayjs(ms).format("MMM D");

/**
 * A label used mid-sentence: only its first letter drops to lower case, so place
 * names and acronyms stay ("Toward Paoay" → "toward Paoay", "Traditional PUJ" →
 * "traditional PUJ"). A label that starts with an acronym is left as is.
 */
export const inSentence = (label: string) =>
  /^\p{Lu}\p{Ll}/u.test(label) ? label.charAt(0).toLowerCase() + label.slice(1) : label;
