import { View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MapboxMap } from "@/components/ui/map";
import { BottomSheetContainer, ButtonIcon, ThemedText, ButtonText, Icon } from "@/components/ui";
import type { BottomSheetContainerRef, Jeepney } from "@/types";
import { ROUTES } from "@/constants";
import { useRecenterToUser } from "@/hooks";
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from "@/services/location/driverTracking";
import { useAuthStore } from "@/context";
import { showWarning } from "@/services/ui/toasts";
import { subscribeToAssignedJeepney } from "@/services/assignments/subscribeToAssignedJeepney";

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
    if (!assignedJeepney) {
      showWarning("You need to be assigned to a jeepney first.");
      return;
    }

    await startBackgroundTracking();
    setTracking(true);
  };

  // Stop tracking
  const handleStop = async () => {
    await stopBackgroundTracking();
    setTracking(false);
  };

  // Detect assigned Jeepney
  const [assignedJeepney, setAssignedJeepney] = useState<Jeepney | null>(null);
  useEffect(() => {
    const unsubscribe = subscribeToAssignedJeepney((jeep) => {
      setAssignedJeepney(jeep);
    });

    return unsubscribe; // clean up listener
  }, []);

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
      <BottomSheetContainer ref={bottomSheetRef} snapPoints={["14%", "30%"]}>
        <View className="gap-4">
          {/* Tracking section */}
          <View>
            <ThemedText variant="h300" className="uppercase">
              Tracking Status
            </ThemedText>

            {!assignedJeepney ? (
              <ThemedText className="text-warning-600 dark:text-warning-600">
                Waiting for jeepney assignment.
              </ThemedText>
            ) : (
              <ThemedText
                className={
                  tracking
                    ? "text-success-600 dark:text-success-600"
                    : "text-warning-600 dark:text-warning-600"
                }
              >
                {tracking ? "Live tracking is ON" : "Tracking is OFF"}
              </ThemedText>
            )}
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3">
            <ButtonText
              label="Start tracking"
              iconName="play-circle-outline"
              onPress={handleStart}
              disabled={tracking || !assignedJeepney}
            />

            <ButtonText
              label="Stop tracking"
              iconName="stop-circle-outline"
              onPress={handleStop}
              variant="secondary"
              disabled={!tracking}
            />
          </View>

          {/* Information */}
          <View className="gap-2">
            <ThemedText variant="h400" className="uppercase">
              Driver info
            </ThemedText>

            {user ? (
              <View className="flex-row flex-wrap gap-1">
                <View className="w-full flex-row gap-1">
                  {/* User email */}
                  <ThemedText color="secondary">Signed in as: </ThemedText>
                  <Icon name="person" size={16} />
                  <ThemedText className="text-dodger-blue-600 dark:text-dodger-blue-600">
                    {user.email}
                  </ThemedText>
                </View>

                {assignedJeepney && (
                  <View className="w-full flex-row gap-1">
                    <ThemedText color="secondary">Jeepney assigned: </ThemedText>
                    <Icon family="MaterialCommunityIcons" name="bus" size={18} />
                    <ThemedText className="text-dodger-blue-600 dark:text-dodger-blue-600">
                      {assignedJeepney?.plate_number}
                    </ThemedText>
                  </View>
                )}
              </View>
            ) : (
              <ThemedText color="secondary">Loading user...</ThemedText>
            )}
          </View>
        </View>
      </BottomSheetContainer>
    </View>
  );
}
