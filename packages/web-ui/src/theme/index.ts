import type { CSSProperties } from "react";
import { palette, shadows, typeRoles, type TypeRole } from "@jeep-in/tokens";
import { useColorScheme } from "./document";

export * from "@jeep-in/tokens";
export { colorScheme, setTextScale, setThemeColorOverride, useColorScheme } from "./document";

/**
 * A type role as inline CSS at its fixed size, for text the Text size setting
 * doesn't scale. Line height in px: React reads a bare number as a multiplier.
 */
export function fixedRole(role: TypeRole): CSSProperties {
  const r: (typeof typeRoles)[TypeRole] = typeRoles[role];
  return {
    fontFamily: r.fontFamily,
    fontSize: r.fontSize,
    lineHeight: `${r.lineHeight}px`,
    letterSpacing: "letterSpacing" in r ? r.letterSpacing : undefined,
    textTransform: "textTransform" in r ? r.textTransform : undefined,
  };
}

/** Colours and shadows for the active appearance (Light, Dark or Match phone). */
export function useTheme() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return {
    isDark: scheme === "dark",
    colors: palette[scheme],
    shadows: shadows[scheme],
  };
}
