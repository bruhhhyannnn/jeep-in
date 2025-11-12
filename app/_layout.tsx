import "./global.css";
import "@/services/mapbox/config";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Puffin-Regular": require("../assets/fonts/Puffin-Regular.otf"),
    "Puffin-Medium": require("../assets/fonts/Puffin-Medium.otf"),
    "Puffin-SemiBold": require("../assets/fonts/Puffin-SemiBold.otf"),
    "Puffin-Bold": require("../assets/fonts/Puffin-Bold.otf"),
    "Puffin-ExtraBold-Italic": require("../assets/fonts/Puffin-ExtraBold-Italic.otf"),
  });

  // Load fonts
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animation: "fade_from_bottom",
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
