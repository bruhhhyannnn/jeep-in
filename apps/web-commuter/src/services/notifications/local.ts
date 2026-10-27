export type NotificationPermission = "granted" | "denied" | "undetermined" | "unavailable";

// iOS only offers notifications once the app is on the Home Screen (16.4+);
// in a Safari tab `Notification` doesn't exist and alerts stay inside the app.
const supported = () => typeof window !== "undefined" && "Notification" in window;

const toPermission = (value: globalThis.NotificationPermission): NotificationPermission =>
  value === "default" ? "undetermined" : value;

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!supported()) return "unavailable";
  return toPermission(Notification.permission);
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!supported()) return "unavailable";
  try {
    return toPermission(await Notification.requestPermission());
  } catch (err) {
    console.warn("Notifications unavailable:", err);
    return "unavailable";
  }
}

/** Shows a notification right away. Does nothing without permission. */
export async function notifyNow(title: string, body: string) {
  if (!supported() || Notification.permission !== "granted") return;
  const options: NotificationOptions = {
    body,
    icon: "/pwa-192x192.png",
    badge: "/pwa-badge-96x96.png",
  };
  // Android Chrome only shows notifications through the service worker.
  const registration =
    "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
  if (registration) await registration.showNotification(title, options);
  else new Notification(title, options);
}
