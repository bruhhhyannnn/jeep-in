import { useSyncExternalStore } from "react";

export type EdgeInsets = { top: number; right: number; bottom: number; left: number };

// The browser only exposes env(safe-area-inset-*) to CSS, so a hidden element
// padded by it is measured. Needs viewport-fit=cover (index.html).
let probe: HTMLDivElement | null = null;
let insets: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

function measure(): EdgeInsets {
  if (!probe) {
    probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;" +
      "padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)";
    document.body.appendChild(probe);
  }
  const s = getComputedStyle(probe);
  const next = {
    top: parseFloat(s.paddingTop) || 0,
    right: parseFloat(s.paddingRight) || 0,
    bottom: parseFloat(s.paddingBottom) || 0,
    left: parseFloat(s.paddingLeft) || 0,
  };
  if (
    next.top !== insets.top ||
    next.right !== insets.right ||
    next.bottom !== insets.bottom ||
    next.left !== insets.left
  ) {
    insets = next;
  }
  return insets;
}

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  window.addEventListener("orientationchange", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    window.removeEventListener("orientationchange", onChange);
  };
}

/** Same as react-native-safe-area-context's hook: the notch and home-indicator insets in px. */
export function useSafeAreaInsets(): EdgeInsets {
  return useSyncExternalStore(subscribe, measure);
}
