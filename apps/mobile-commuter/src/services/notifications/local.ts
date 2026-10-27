import { Platform } from "react-native";
import type * as NotificationsModule from "expo-notifications";

export type NotificationPermission = "granted" | "denied" | "undetermined" | "unavailable";

const CHANNEL_ID = "arrivals";

let notifications: typeof NotificationsModule | null | undefined;

// Loaded lazily so a build without the native module still runs; alerts then
// stay inside the app.
function load(): typeof NotificationsModule | null {
  if (notifications !== undefined) return notifications;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- must stay lazy, see above
    notifications = require("expo-notifications") as typeof NotificationsModule;
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    if (Platform.OS === "android") {
      notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Arrival alerts",
        importance: notifications.AndroidImportance.HIGH,
      });
    }
  } catch (err) {
    console.warn("Notifications unavailable:", err);
    notifications = null;
  }
  return notifications;
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  const n = load();
  if (!n) return "unavailable";
  const { status } = await n.getPermissionsAsync();
  return status as NotificationPermission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  const n = load();
  if (!n) return "unavailable";
  const { status } = await n.requestPermissionsAsync();
  return status as NotificationPermission;
}

/** Shows a notification right away. Does nothing without permission. */
export async function notifyNow(title: string, body: string) {
  const n = load();
  if (!n) return;
  const { status } = await n.getPermissionsAsync();
  if (status !== "granted") return;
  await n.scheduleNotificationAsync({
    content: { title, body },
    trigger: Platform.OS === "android" ? { channelId: CHANNEL_ID } : null,
  });
}
