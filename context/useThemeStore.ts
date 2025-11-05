import { create } from "zustand";
import { Appearance } from "react-native";
import { colorScheme } from "nativewind";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (Appearance.getColorScheme() as Theme) || "light",

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      colorScheme.set(newTheme);
      return { theme: newTheme };
    }),

  setTheme: (theme) => {
    const resolvedTheme = theme === "system" ? (Appearance.getColorScheme() as Theme) : theme;
    colorScheme.set(resolvedTheme);
    set({ theme });
  },
}));
