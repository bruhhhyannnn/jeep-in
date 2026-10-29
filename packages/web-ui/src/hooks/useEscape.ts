import { useEffect, useRef } from "react";

/** Escape closes a sheet screen, as the back button does on Android. */
export function useEscape(onEscape: () => void) {
  const handler = useRef(onEscape);
  useEffect(() => {
    handler.current = onEscape;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // A modal sheet (vaul) open on top handles its own Escape.
      if (e.key !== "Escape" || e.defaultPrevented || document.querySelector("[data-vaul-drawer]"))
        return;
      handler.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
