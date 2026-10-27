import { create } from "zustand";
import * as Location from "expo-location";
import type { LngLat } from "@/types";

export type LocationPermission = "undetermined" | "granted" | "denied";

interface LocationState {
  permission: LocationPermission;
  canAskAgain: boolean;
  coords: LngLat | null;
  accuracyM: number | null;
}

export const useLocationStore = create<LocationState>(() => ({
  permission: "undetermined",
  canAskAgain: true,
  coords: null,
  accuracyM: null,
}));

const toPermission = (status: Location.PermissionStatus): LocationPermission =>
  status === "granted" ? "granted" : status === "denied" ? "denied" : "undetermined";

/** Reads the current permission without prompting. */
export async function refreshLocationPermission() {
  const res = await Location.getForegroundPermissionsAsync();
  useLocationStore.setState({ permission: toPermission(res.status), canAskAgain: res.canAskAgain });
  return res.status === "granted";
}

/** Shows the phone's permission prompt. Resolves true when granted. */
export async function requestLocationPermission() {
  const res = await Location.requestForegroundPermissionsAsync();
  useLocationStore.setState({ permission: toPermission(res.status), canAskAgain: res.canAskAgain });
  return res.status === "granted";
}
