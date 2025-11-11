import { create } from "zustand";
import { Appearance } from "react-native";
import { colorScheme } from "nativewind";
import type { ThemeMode } from "@/types";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",

  setTheme: (theme) => {
    if (theme === "system") {
      const sysTheme = Appearance.getColorScheme() as ThemeMode;
      colorScheme.set(sysTheme);
    } else {
      colorScheme.set(theme);
    }
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      colorScheme.set(next);
      return { theme: next };
    }),
}));
