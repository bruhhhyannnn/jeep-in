import { create } from "zustand";

interface MapInitState {
  hasCentered: boolean;
  setHasCentered: () => void;
  reset: () => void;
}

export const useMapInitStore = create<MapInitState>((set) => ({
  hasCentered: false,
  setHasCentered: () => set({ hasCentered: true }),
  reset: () => set({ hasCentered: false }),
}));
