import { create } from "zustand";

/** Chrome's install prompt event (not in the DOM typings yet). */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Running as an installed app (from the home screen), not in a browser tab. */
export const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** iPhone or iPad, where installing is "Add to Home Screen" from the Share menu. */
export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);

interface InstallState {
  /** Saved from beforeinstallprompt; null where the browser offers no prompt. */
  promptEvent: BeforeInstallPromptEvent | null;
  installed: boolean;
}

export const useInstallStore = create<InstallState>(() => ({
  promptEvent: null,
  installed: isStandalone(),
}));

/** Called before React mounts, so the browser's one-time event isn't missed. */
export function listenForInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (e) => {
    // The Settings row offers it instead of Chrome's own banner.
    e.preventDefault();
    useInstallStore.setState({ promptEvent: e as BeforeInstallPromptEvent });
  });
  window.addEventListener("appinstalled", () =>
    useInstallStore.setState({ promptEvent: null, installed: true }),
  );
  window.matchMedia("(display-mode: standalone)").addEventListener("change", (e) => {
    if (e.matches) useInstallStore.setState({ installed: true });
  });
}

/** Shows the browser's install dialog. The saved event can only be used once. */
export async function promptInstall() {
  const event = useInstallStore.getState().promptEvent;
  if (!event) return;
  await event.prompt();
  const { outcome } = await event.userChoice;
  useInstallStore.setState({ promptEvent: null, installed: outcome === "accepted" });
}
