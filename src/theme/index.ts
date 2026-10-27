import { palette, shadows } from "@/theme/tokens";
import { useColorScheme } from "@/theme/document";

export * from "@/theme/tokens";
export { colorScheme, setTextScale, setThemeColorOverride, useColorScheme } from "@/theme/document";

/** Colours and shadows for the active appearance (Light, Dark or Match phone). */
export function useTheme() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return {
    isDark: scheme === "dark",
    colors: palette[scheme],
    shadows: shadows[scheme],
  };
}
