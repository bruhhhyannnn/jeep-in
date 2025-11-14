import { create } from "zustand";
import { getCollection } from "@/services/firebase/firestore";
import type { PickupPoint } from "@/types";

interface StopsState {
  stops: PickupPoint[];
  ready: boolean;
  loadStops: () => Promise<void>;
}

export const useStopsStore = create<StopsState>((set) => ({
  stops: [],
  ready: false,

  loadStops: async () => {
    const data = await getCollection<PickupPoint>("stops");
    set({ stops: data, ready: true });
  },
}));
