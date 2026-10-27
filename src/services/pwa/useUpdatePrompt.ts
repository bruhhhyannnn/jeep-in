import { useEffect } from "react";
import { toast } from "sonner";
import { useRegisterSW } from "virtual:pwa-register/react";
import { STRINGS } from "@/constants";

/** How often an open app checks for a new version (expo-updates checks on launch). */
const CHECK_EVERY_MS = 60 * 60 * 1000;

/**
 * Registers the service worker and, when a new version has downloaded, shows
 * "A new version is ready · Reload". Nothing reloads until the commuter taps it.
 */
export function useUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (registration) setInterval(() => registration.update(), CHECK_EVERY_MS);
    },
    onRegisterError(error) {
      console.warn("Service worker registration failed:", error);
    },
  });

  useEffect(() => {
    if (!needRefresh) return;
    toast(STRINGS.web.update.ready, {
      id: "update",
      duration: Number.POSITIVE_INFINITY,
      action: { label: STRINGS.web.update.reload, onClick: () => updateServiceWorker(true) },
    });
  }, [needRefresh, updateServiceWorker]);
}
