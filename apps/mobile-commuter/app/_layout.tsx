import "@/services/location/driverTracking";
import "./global.css";
import "@/services/mapbox/config";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { useFonts } from "expo-font";
import {
  SplineSansMono_500Medium,
  SplineSansMono_600SemiBold,
} from "@expo-google-fonts/spline-sans-mono";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  useAlerts,
  useAuthStore,
  useDriverSession,
  useOfflineCache,
  usePreferences,
} from "@/store";
import { useTheme } from "@/theme";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const persistedStores = [usePreferences, useAlerts, useOfflineCache, useDriverSession];
const allHydrated = () => persistedStores.every((s) => s.persist.hasHydrated());

/** Saved preferences, alerts and the offline copy load before the first screen. */
function useStoresHydrated() {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    const check = () => setHydrated(allHydrated());
    const unsubscribes = persistedStores.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubscribes.forEach((u) => u());
  }, []);

  return hydrated;
}

export default function RootLayout() {
  const initAuth = useAuthStore((s) => s.init);
  const hydrated = useStoresHydrated();
  const { isDark, colors } = useTheme();

  const [fontsLoaded] = useFonts({
    "Puffin-Regular": require("../src/assets/fonts/Puffin-Regular.otf"),
    "Puffin-Medium": require("../src/assets/fonts/Puffin-Medium.otf"),
    "Puffin-SemiBold": require("../src/assets/fonts/Puffin-SemiBold.otf"),
    "Puffin-Bold": require("../src/assets/fonts/Puffin-Bold.otf"),
    "Puffin-ExtraBold-Italic": require("../src/assets/fonts/Puffin-ExtraBold-Italic.otf"),
    SplineSansMono_500Medium,
    SplineSansMono_600SemiBold,
  });
  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                animation: "fade",
                contentStyle: { backgroundColor: colors.page },
              }}
            >
              <Stack.Screen name="(auth)/login" options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="(settings)/index" options={{ animation: "slide_from_right" }} />
            </Stack>
            <Toast />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
