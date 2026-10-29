import { useSyncExternalStore } from "react";

let size = { width: window.innerWidth, height: window.innerHeight };

function read() {
  if (size.width !== window.innerWidth || size.height !== window.innerHeight) {
    size = { width: window.innerWidth, height: window.innerHeight };
  }
  return size;
}

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

/** Same as React Native's hook: the window size in px, updated on resize and rotation. */
export function useWindowDimensions() {
  return useSyncExternalStore(subscribe, read);
}
