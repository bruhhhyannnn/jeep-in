import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import { useThemeStore } from "@/context/useThemeStore";
import { colorScheme } from "nativewind";

export default function RootLayout() {
  const { theme } = useThemeStore();

  const [fontsLoaded] = useFonts({
    "Puffin-Regular": require("../assets/fonts/Puffin-Regular.otf"),
    "Puffin-Medium": require("../assets/fonts/Puffin-Medium.otf"),
    "Puffin-SemiBold": require("../assets/fonts/Puffin-SemiBold.otf"),
    "Puffin-Bold": require("../assets/fonts/Puffin-Bold.otf"),
    "Puffin-ExtraBold-Italic": require("../assets/fonts/Puffin-ExtraBold-Italic.otf"),
  });

  useEffect(() => {
    colorScheme.set(theme);
  }, [theme]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
