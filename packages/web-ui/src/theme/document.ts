import { useSyncExternalStore } from "react";
import type { Appearance, TextSize } from "../types";
import { palette, textScale } from "@jeep-in/tokens";

// Applies the Appearance and Text size settings to the page: the `dark` class on
// <html> (which switches the CSS variables in app/global.css), the browser's
// theme colour and the --text-scale variable every type role is multiplied by.

const media = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set<() => void>();

let appearance: Appearance = "system";
/** A screen's own status bar colour, e.g. the onboarding slides. Null → the page colour. */
let themeColorOverride: string | null = null;

const resolve = (): "light" | "dark" =>
  appearance === "dark" || (appearance === "system" && media.matches) ? "dark" : "light";

function applyThemeColor() {
  const color = themeColorOverride ?? palette[resolve()].page;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

function apply() {
  document.documentElement.classList.toggle("dark", resolve() === "dark");
  applyThemeColor();
  listeners.forEach((listener) => listener());
}

media.addEventListener("change", () => {
  if (appearance === "system") apply();
});

/** Same shape as NativeWind's `colorScheme`, so the preferences store reads as it does natively. */
export const colorScheme = {
  set(value: Appearance) {
    appearance = value;
    apply();
  },
  get: resolve,
};

/** "light" or "dark" after resolving "Match phone" against the device setting. */
export function useColorScheme() {
  return useSyncExternalStore((listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, resolve);
}

export function setTextScale(size: TextSize) {
  document.documentElement.style.setProperty("--text-scale", String(textScale[size]));
}

/** Overrides the browser's status bar colour while a screen with its own background is open. */
export function setThemeColorOverride(color: string | null) {
  themeColorOverride = color;
  applyThemeColor();
}
