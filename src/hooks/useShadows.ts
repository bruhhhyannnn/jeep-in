import { Platform, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

export function useShadows() {
  const { colorScheme } = useColorScheme();

  return StyleSheet.create({
    card: {
      shadowColor: colorScheme === "dark" ? "#A3A3A3" : "#525252",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: Platform.OS === "ios" ? 0.18 : 0.12,
      shadowRadius: Platform.OS === "ios" ? 10 : 6,
      elevation: Platform.OS === "android" ? 2 : 0,
    },
  });
}
