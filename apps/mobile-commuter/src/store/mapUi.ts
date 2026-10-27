import { create } from "zustand";

/** What the map highlights for the screen on top of it. */
interface MapUiState {
  /** Jeep shown with a ring and its way to your stop in yellow. */
  selectedJeepId: string | null;
  /** Short text pinned next to the selected jeep, e.g. "1.2 km · 4 min". */
  selectedJeepBadge: string | null;
  /** Stop shown with its name, e.g. on the stop detail sheet. */
  focusedStopId: string | null;

  selectJeep: (jeepId: string | null, badge?: string | null) => void;
  focusStop: (stopId: string | null) => void;
}

export const useMapUi = create<MapUiState>((set) => ({
  selectedJeepId: null,
  selectedJeepBadge: null,
  focusedStopId: null,

  selectJeep: (selectedJeepId, selectedJeepBadge = null) =>
    set({ selectedJeepId, selectedJeepBadge }),
  focusStop: (focusedStopId) => set({ focusedStopId }),
}));
