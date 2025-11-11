import { Platform, StyleSheet } from "react-native";

export const SHADOWS = StyleSheet.create({
  style: {
    shadowColor: "#0A0A0A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === "ios" ? 0.18 : 0.12,
    shadowRadius: Platform.OS === "ios" ? 10 : 6,
    elevation: Platform.OS === "android" ? 2 : 0,
  },
});
