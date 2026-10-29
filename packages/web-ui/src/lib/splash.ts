import { useLayoutEffect } from "react";

// The splash drawn by index.html (expo-splash-screen natively). It hides once
// the app is ready (fonts and saved settings) and no screen is still loading.

let appReady = false;
let holds = 0;

function hideWhenReady() {
  if (!appReady || holds > 0) return;
  const splash = document.getElementById("splash");
  if (!splash) return;
  splash.classList.add("hidden");
  window.setTimeout(() => splash.remove(), 250);
}

/** Fonts and stores are loaded (SplashScreen.hideAsync natively). */
export function markAppReady() {
  appReady = true;
  hideWhenReady();
}

/** Keeps the splash up while it is mounted, e.g. as a lazily loaded route's fallback. */
export function KeepSplash() {
  useLayoutEffect(() => {
    holds += 1;
    return () => {
      holds -= 1;
      hideWhenReady();
    };
  }, []);
  return null;
}
