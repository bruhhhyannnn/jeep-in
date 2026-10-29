import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "@jeep-in/web-ui/storage";
import type { FareMatrix, Route, StopPoint } from "@/types";

/**
 * Last copy of the route, stops and fares fetched from Firestore, kept on the
 * phone so fares, stops and the matrix keep working without signal.
 */
interface OfflineState {
  routes: Route[] | null;
  stops: StopPoint[] | null;
  fareMatrices: FareMatrix[] | null;
  syncedAt: number | null;
  /** When the commuter last tapped "Save offline copy". */
  savedCopyAt: number | null;

  saveRoutes: (routes: Route[]) => void;
  saveStops: (stops: StopPoint[]) => void;
  saveFareMatrices: (fareMatrices: FareMatrix[]) => void;
  markCopySaved: () => void;
}

export const useOfflineCache = create<OfflineState>()(
  persist(
    (set) => ({
      routes: null,
      stops: null,
      fareMatrices: null,
      syncedAt: null,
      savedCopyAt: null,

      saveRoutes: (routes) => set({ routes, syncedAt: Date.now() }),
      saveStops: (stops) => set({ stops, syncedAt: Date.now() }),
      saveFareMatrices: (fareMatrices) => set({ fareMatrices, syncedAt: Date.now() }),
      markCopySaved: () => set({ savedCopyAt: Date.now() }),
    }),
    {
      name: "jeepin-offline-cache",
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);
