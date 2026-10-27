import { useColorScheme } from "react-native";
import { palette, shadows } from "@/theme/tokens";

export * from "@/theme/tokens";

/** Colours and shadows for the active appearance (Light, Dark or Match phone). */
export function useTheme() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return {
    isDark: scheme === "dark",
    colors: palette[scheme],
    shadows: shadows[scheme],
  };
}
