import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CommuterAlert } from "@/types";

const MAX_ALERTS = 50;

/** Minutes before arrival that a followed jeep triggers its alert. Same number on every screen. */
export const ALERT_MINUTES = 3;

export type Following = {
  jeepneyId: string;
  unit: string;
  plate: string;
  stopId: string;
  stopName: string;
  directionId: string;
  since: number;
};

interface AlertsState {
  items: CommuterAlert[];
  /** The one jeep being watched after "Notify me". Cleared once its alert fires. */
  following: Following | null;
  /** Direction to watch for the first live jeep ("Alert me when one goes live"). */
  liveWatch: { directionId: string; since: number } | null;

  push: (alert: Pick<CommuterAlert, "kind" | "title" | "body" | "jeepneyId">) => void;
  markAllRead: () => void;
  follow: (following: Omit<Following, "since">) => void;
  unfollow: () => void;
  watchLive: (directionId: string) => void;
  stopWatchingLive: () => void;
}

export const useAlerts = create<AlertsState>()(
  persist(
    (set) => ({
      items: [],
      following: null,
      liveWatch: null,

      push: (alert) =>
        set((s) => ({
          items: [
            {
              ...alert,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt: Date.now(),
              read: false,
            },
            ...s.items,
          ].slice(0, MAX_ALERTS),
        })),
      markAllRead: () => set((s) => ({ items: s.items.map((a) => ({ ...a, read: true })) })),
      follow: (following) => set({ following: { ...following, since: Date.now() } }),
      unfollow: () => set({ following: null }),
      watchLive: (directionId) => set({ liveWatch: { directionId, since: Date.now() } }),
      stopWatchingLive: () => set({ liveWatch: null }),
    }),
    {
      name: "jeepin-alerts",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
