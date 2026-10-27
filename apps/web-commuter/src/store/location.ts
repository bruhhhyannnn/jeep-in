import { create } from "zustand";
import type { LngLat } from "@/types";

export type LocationPermission = "undetermined" | "granted" | "denied";

interface LocationState {
  permission: LocationPermission;
  canAskAgain: boolean;
  coords: LngLat | null;
  accuracyM: number | null;
  /** Direction of travel from GPS (degrees), for the location dot. Null while still. */
  heading: number | null;
}

export const useLocationStore = create<LocationState>(() => ({
  permission: "undetermined",
  canAskAgain: true,
  coords: null,
  accuracyM: null,
  heading: null,
}));

const toPermission = (state: PermissionState): LocationPermission =>
  state === "granted" ? "granted" : state === "denied" ? "denied" : "undetermined";

const supported = () => "geolocation" in navigator;

// The browser can't be asked again after a denial; only the site settings can undo it.
const setPermission = (permission: LocationPermission) =>
  useLocationStore.setState({ permission, canAskAgain: permission !== "denied" });

let watchedStatus: PermissionStatus | null = null;

/** Reads the current permission without prompting. */
export async function refreshLocationPermission() {
  if (!supported()) {
    setPermission("denied");
    return false;
  }
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    setPermission(toPermission(status.state));
    if (watchedStatus !== status) {
      watchedStatus = status;
      status.onchange = () => setPermission(toPermission(status.state));
    }
    return status.state === "granted";
  } catch {
    // No Permissions API: keep what the last prompt told us.
    return useLocationStore.getState().permission === "granted";
  }
}

/** Shows the browser's permission prompt. Resolves true when granted. */
export function requestLocationPermission(): Promise<boolean> {
  if (!supported()) {
    setPermission("denied");
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPermission("granted");
        useLocationStore.setState({
          coords: [pos.coords.longitude, pos.coords.latitude],
          accuracyM: pos.coords.accuracy ?? null,
        });
        resolve(true);
      },
      async (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermission("denied");
          resolve(false);
          return;
        }
        // Allowed, but no fix yet (timeout or no signal).
        resolve(await refreshLocationPermission());
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  });
}
