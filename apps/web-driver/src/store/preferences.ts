import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "@jeep-in/web-ui/storage";
import { colorScheme } from "@/theme";
import type { Appearance } from "@/types";

interface PreferencesState {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
}

/** The Display setting. Index.html reads the same key to avoid a light flash in the cab. */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      appearance: "system",
      setAppearance: (appearance) => {
        colorScheme.set(appearance);
        set({ appearance });
      },
    }),
    {
      name: "jeepin-preferences",
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        colorScheme.set(state?.appearance ?? "system");
      },
    },
  ),
);
