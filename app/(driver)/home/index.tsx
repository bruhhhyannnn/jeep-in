import { View } from "react-native";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MapboxMap } from "@/components/ui/map";
import { BottomSheetContainer, ButtonIcon, ThemedText, ButtonText } from "@/components/ui";
import type { BottomSheetContainerRef } from "@/types";
import { ROUTES } from "@/constants";
import { useRecenterToUser } from "@/hooks";
import { startDriverTracking, stopDriverTracking } from "@/services/location/driverTracking";
import { useAuthStore } from "@/context";

export default function DriverHomeScreen() {
  // Gets device top safe area for spacing floating buttons
  const { top } = useSafeAreaInsets();

  // Ref for commuter bottom sheet container
  const bottomSheetRef = useRef<BottomSheetContainerRef>(null);

  // Camera control
  const { recenterToUser } = useRecenterToUser();

  // Get user account from zustand
  const { user } = useAuthStore();

  // Start tracking
  const [tracking, setTracking] = useState(false);
  const handleStart = async () => {
    await startDriverTracking();
    setTracking(true);
  };

  // Stop tracking
  const handleStop = async () => {
    await stopDriverTracking();
    setTracking(false);
  };

  return (
    <View className="absolute inset-0">
      {/* Map */}
      <MapboxMap />

      {/* Floating buttons (top right) */}
      <View className="absolute right-6 gap-4" style={{ top: top + 28 }}>
        <ButtonIcon iconName="settings-outline" onPress={() => router.push(ROUTES.root.settings)} />
        <ButtonIcon iconName="navigate-circle-outline" onPress={recenterToUser} />
      </View>

      {/* Bottom Sheet: Driver Control Panel */}
      <BottomSheetContainer ref={bottomSheetRef}>
        <View className="gap-4">
          <View>
            <ThemedText variant="h400" className="uppercase">
              Control Panel
            </ThemedText>

            <View className="flex-row flex-wrap">
              {user?.email ? (
                <>
                  <ThemedText color="secondary">Signed in as: </ThemedText>

                  <ThemedText className="text-dodger-blue-600 dark:text-dodger-blue-600">
                    {user.email}
                  </ThemedText>
                </>
              ) : (
                <ThemedText color="secondary">Sign in as a driver to start tracking.</ThemedText>
              )}
            </View>
          </View>

          <View>
            <ThemedText variant="h300" className="uppercase">
              Tracking status
            </ThemedText>
            <ThemedText
              className={
                tracking
                  ? "text-success-600 dark:text-success-600"
                  : "text-warning-600 dark:text-warning-600"
              }
            >
              {tracking ? "Live tracking is ON" : "Tracking is OFF"}
            </ThemedText>
          </View>

          <View className="flex-row gap-3">
            <ButtonText
              label="Start tracking"
              iconName="play-circle-outline"
              onPress={handleStart}
              disabled={tracking}
            />
            <ButtonText
              label="Stop tracking"
              iconName="stop-circle-outline"
              onPress={handleStop}
              variant="secondary"
              disabled={!tracking}
            />
          </View>
        </View>
      </BottomSheetContainer>
    </View>
  );
}
