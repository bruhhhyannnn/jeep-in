import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { distanceKm } from "@jeep-in/core/geo";
import { db, getAuthInstance } from "@/services/firebase/config";
import { markStep, recordMotion, resetHandshake, useSharingStore } from "@/store/sharing";

// Location sharing in a browser. The native app hands this to a background task; a
// web page only gets positions while it is on screen, so sharing keeps the screen
// on, and a reload picks sharing back up where the native task would have kept going.

const SHIFT_END_KEY = "jeepin-shift-ends-at";
/** "on" while sharing, so a reload or a reopened app resumes it. */
const SHARING_KEY = "jeepin-sharing";

/** The native app's update interval: every 5 s once the jeep has moved 10 m. */
const MIN_INTERVAL_MS = 5000;
const MIN_DISTANCE_KM = 0.01;
/**
 * A parked jeep still sends this often, so neither commuters nor the driver's own
 * dial (which says "waiting for signal" after a minute) take it for lost signal.
 */
const HEARTBEAT_MS = 30 * 1000;

let watchId: number | null = null;
let shiftEndsAt: number | null = null;
let gotFix = false;
let lastSent: { at: number; lat: number; long: number } | null = null;
let wakeLock: WakeLockSentinel | null = null;

const getDriverId = (): string | null => getAuthInstance().currentUser?.uid ?? null;

// localStorage that never throws (private mode, blocked site data).
const saved = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string | null) => {
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      // Nothing to do: sharing just won't resume after a reload.
    }
  },
};

/** GPS reports NaN or null when it has no heading or speed. */
const finite = (value: number | null) => (value != null && Number.isFinite(value) ? value : null);

/** Sharing stops by itself at the end of the shift unless the driver chose extra time. */
function pastShiftEnd() {
  const { overtimeUntil } = useSharingStore.getState();
  const limit = Math.max(shiftEndsAt ?? Number.POSITIVE_INFINITY, overtimeUntil ?? 0);
  return Date.now() > limit;
}

/** Whether a fix goes to the server, on the native app's interval plus a heartbeat. */
function due(lat: number, long: number) {
  if (!lastSent) return true;
  const elapsed = Date.now() - lastSent.at;
  if (elapsed >= HEARTBEAT_MS) return true;
  return (
    elapsed >= MIN_INTERVAL_MS &&
    distanceKm(lastSent.lat, lastSent.long, lat, long) >= MIN_DISTANCE_KM
  );
}

async function pushLocation({ latitude, longitude, heading, speed }: GeolocationCoordinates) {
  const driverId = getDriverId();
  if (!driverId) return;

  recordMotion([longitude, latitude], finite(speed));
  markStep("fix");

  if (pastShiftEnd()) {
    await stopSharing({ byShiftEnd: true });
    return;
  }
  if (!due(latitude, longitude)) return;
  lastSent = { at: Date.now(), lat: latitude, long: longitude };

  // Resolves once the server has the write; offline it waits and sends by itself.
  await Promise.all([
    setDoc(
      doc(db, "driver_locations", driverId),
      {
        driverId,
        lat: latitude,
        long: longitude,
        heading: finite(heading),
        speed: finite(speed),
        isSharing: true,
        // Lets commuters tell a live position from one that stopped updating.
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
    updateDoc(doc(db, "drivers", driverId), {
      lastLocationUpdate: new Date().toISOString(),
    }).catch(() => {}),
  ]);
  useSharingStore.setState({ lastAckAt: Date.now(), lastAckPosition: [longitude, latitude] });
  markStep("write");
}

/** Keeps the screen on while sharing: the browser stops location when the screen sleeps. */
async function holdScreen() {
  if (wakeLock || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      wakeLock = null;
    });
  } catch {
    // Battery saver or an older browser: sharing still works while the screen is on.
  }
}

function releaseScreen() {
  void wakeLock?.release();
  wakeLock = null;
}

// The browser lets go of the wake lock whenever the page is hidden; take it back on return.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && watchId != null) void holdScreen();
});

function stopWatching() {
  if (watchId != null) navigator.geolocation.clearWatch(watchId);
  watchId = null;
}

/** Commuters see the jeep as off duty. */
const markOffDuty = (driverId: string) =>
  setDoc(doc(db, "driver_locations", driverId), { isSharing: false }, { merge: true });

/** "granted", "denied" or "prompt"; null where the browser can't tell (older Safari). */
export async function locationPermission(): Promise<PermissionState | null> {
  try {
    return (await navigator.permissions.query({ name: "geolocation" })).state;
  } catch {
    return null;
  }
}

/**
 * Starts sharing and runs the handshake. Returns false when the browser or the
 * phone blocks location; the store then says why.
 */
export async function startSharing(options: { shiftEndsAt: number | null }) {
  resetHandshake();
  shiftEndsAt = options.shiftEndsAt;
  saved.set(SHIFT_END_KEY, shiftEndsAt != null ? String(shiftEndsAt) : null);
  useSharingStore.setState({ stoppedByShiftEndAt: null, foregroundOnly: true });

  if (!("geolocation" in navigator)) {
    useSharingStore.setState({ phase: "blocked", blockedReason: "services" });
    return false;
  }

  const permission = await locationPermission();
  if (permission === "denied") {
    useSharingStore.setState({ phase: "blocked", blockedReason: "permission" });
    return false;
  }
  if (permission === "granted") markStep("permission");

  stopWatching();
  gotFix = false;
  lastSent = null;
  // The browser asks for permission here the first time.
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      // A position means location is allowed, even where the browser couldn't say before.
      markStep("permission");
      gotFix = true;
      pushLocation(position.coords).catch((err) => console.warn("Location send failed:", err));
    },
    (error) => {
      // Still looking for a fix, or a gap in signal mid-trip: the watch carries on.
      if (error.code === error.TIMEOUT) return;
      if (error.code === error.POSITION_UNAVAILABLE && gotFix) return;

      stopWatching();
      releaseScreen();
      useSharingStore.setState({
        phase: "blocked",
        blockedReason: error.code === error.PERMISSION_DENIED ? "permission" : "services",
      });
      const driverId = getDriverId();
      if (driverId) markOffDuty(driverId).catch(() => {});
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 30 * 1000 },
  );
  saved.set(SHARING_KEY, "on");
  void holdScreen();
  return true;
}

export async function stopSharing({ byShiftEnd = false }: { byShiftEnd?: boolean } = {}) {
  stopWatching();
  releaseScreen();
  saved.set(SHARING_KEY, null);

  useSharingStore.setState({
    phase: "off",
    confirmedAt: null,
    stoppedByShiftEndAt: byShiftEnd ? Date.now() : null,
    overtimeUntil: byShiftEnd ? null : useSharingStore.getState().overtimeUntil,
  });

  const driverId = getDriverId();
  if (driverId) await markOffDuty(driverId);
}

/** Whether this page is sending positions. */
export const isSharingRunning = async () => watchId != null;

/** Sharing was on when the page was last open, and the shift end it was started with. */
export function sharingBeforeReload(): { shiftEndsAt: number | null } | null {
  if (saved.get(SHARING_KEY) !== "on") return null;
  const end = Number(saved.get(SHIFT_END_KEY));
  return { shiftEndsAt: Number.isFinite(end) && end > 0 ? end : null };
}
