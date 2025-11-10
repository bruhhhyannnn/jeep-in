// TODO: this is unused, might delete or not
import { create } from "zustand";
import { Appearance } from "react-native";
import { colorScheme } from "nativewind";
import type { ThemeMode } from "@/types";

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (Appearance.getColorScheme() as ThemeMode) || "light",

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      colorScheme.set(newTheme);
      return { theme: newTheme };
    }),

  setTheme: (theme) => {
    const resolvedTheme = theme === "system" ? (Appearance.getColorScheme() as ThemeMode) : theme;
    colorScheme.set(resolvedTheme);
    set({ theme });
  },
}));
