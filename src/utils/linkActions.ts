import * as Linking from "expo-linking";
import { Alert, Platform } from "react-native";

// Safely opens a URL with error handling.
export async function openURLSafe(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unsupported link", "Cannot open this link on your device.");
    }
  } catch (error) {
    console.error("Error opening link:", error);
    Alert.alert("Error", "Something went wrong while trying to open this link.");
  }
}

// Opens phone dialer.
export function callNumber(phone: string) {
  openURLSafe(`tel:${phone}`);
}

// Opens default email client.
export function sendEmail(email: string, subject?: string) {
  const encodedSubject = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  openURLSafe(`mailto:${email}${encodedSubject}`);
}

// Opens an external website or social media page.
export function openWebsite(url: string) {
  openURLSafe(url.startsWith("http") ? url : `https://${url}`);
}

// Opens a map direction using Google Maps or Apple Maps.
export function openMap(lat: number, lng: number, label?: string) {
  const query = encodeURIComponent(label ?? "Location");
  const scheme = Platform.select({
    ios: `maps:0,0?q=${query}@${lat},${lng}`,
    android: `geo:0,0?q=${lat},${lng}(${query})`,
  });
  openURLSafe(scheme ?? "");
}
