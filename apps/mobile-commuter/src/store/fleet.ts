import { create } from "zustand";
import type { DriverLocation, Jeepney } from "@/types";

/** Raw jeepney and driver-location documents, fed by one shared Firestore subscription. */
interface FleetState {
  jeepneys: Jeepney[];
  locations: DriverLocation[];
  /** True once the location feed has been served from cache for a few seconds. */
  offline: boolean;
  /** Last time the location feed came from the server. */
  lastServerAt: number | null;
  /** Ticks so staleness updates even when no new positions arrive. */
  now: number;
}

export const useFleetStore = create<FleetState>(() => ({
  jeepneys: [],
  locations: [],
  offline: false,
  lastServerAt: null,
  now: Date.now(),
}));
