import "@/services/location/driverTracking";
import "./global.css";
import "@/services/mapbox/config";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useAuthStore } from "@/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const initAuth = useAuthStore((s) => s.init);

  const [fontsLoaded] = useFonts({
    "Puffin-Regular": require("../src/assets/fonts/Puffin-Regular.otf"),
    "Puffin-Medium": require("../src/assets/fonts/Puffin-Medium.otf"),
    "Puffin-SemiBold": require("../src/assets/fonts/Puffin-SemiBold.otf"),
    "Puffin-Bold": require("../src/assets/fonts/Puffin-Bold.otf"),
    "Puffin-ExtraBold-Italic": require("../src/assets/fonts/Puffin-ExtraBold-Italic.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    initAuth();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                animation: "fade_from_bottom",
              }}
            >
              <Stack.Screen
                name="(auth)/login"
                options={{
                  animation: "fade_from_bottom",
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="(settings)/index"
                options={{
                  animation: "slide_from_right",
                  gestureEnabled: true,
                }}
              />
            </Stack>
            <Toast />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
