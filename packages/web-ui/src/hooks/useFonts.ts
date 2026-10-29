import { useEffect, useState } from "react";

/** Gives up waiting after this long, so a font that fails to load never holds the splash. */
const TIMEOUT_MS = 3000;

/**
 * expo-font's useFonts for faces declared with @font-face in app/global.css:
 * true once every family has loaded (or the wait timed out).
 */
export function useFonts(families: string[]): [boolean] {
  const [loaded, setLoaded] = useState(false);
  const key = families.join("|");

  useEffect(() => {
    let cancelled = false;
    const done = () => !cancelled && setLoaded(true);
    const timer = window.setTimeout(done, TIMEOUT_MS);
    Promise.all(key.split("|").map((family) => document.fonts.load(`16px "${family}"`)))
      .catch((err) => console.warn("Font load failed:", err))
      .finally(() => {
        window.clearTimeout(timer);
        done();
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [key]);

  return [loaded];
}
