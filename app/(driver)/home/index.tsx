import * as SecureStore from "expo-secure-store";
import { View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MapboxMap } from "@/components/map";
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
import { useMap } from "@/context/map/MapContext";

export default function DriverHomeScreen() {
  //
  const { top } = useSafeAreaInsets();

  //
  const bottomSheetRef = useRef<BottomSheetContainerRef>(null);

  //
  const { recenterToUser } = useRecenterToUser();

  const map = useMap();

  // Zustand Auth
  const { user, loading } = useAuthStore();

  // Local State
  const [tracking, setTracking] = useState(false);
  const [assignedJeepney, setAssignedJeepney] = useState<Jeepney | null>(null);

  // START TRACKING
  const handleStart = async () => {
    if (!assignedJeepney) {
      showWarning("You need to be assigned to a jeepney first.");
      return;
    }
    await startBackgroundTracking();
    setTracking(true);
  };

  // STOP TRACKING
  const handleStop = async () => {
    await stopBackgroundTracking();
    setTracking(false);
  };

  // REAL-TIME JEEPNEY ASSIGNMENT
  useEffect(() => {
    if (loading) return;
    if (!user?.uid) return;

    const unsubscribe = subscribeToAssignedJeepney(user.uid, async (jeep) => {
      setAssignedJeepney(jeep);
      if (jeep?.id) {
        await SecureStore.setItemAsync("assignedJeepneyId", jeep.id);
      } else {
        await SecureStore.deleteItemAsync("assignedJeepneyId");
      }
    });

    return unsubscribe;
  }, [loading, user?.uid]);

  // AUTO-STOP TRACKING IF UNASSIGNED
  useEffect(() => {
    if (!assignedJeepney && tracking) {
      stopBackgroundTracking();
      setTracking(false);
      showWarning("You have been unassigned from a jeepney.");
    }
  }, [assignedJeepney]);

  // FOLLOW DRIVER LOCATION USING MAP CAMERA
  useEffect(() => {
    if (!tracking) return;
    if (!assignedJeepney) return;

    const { latitude, longitude } = assignedJeepney;

    if (typeof latitude !== "number" || typeof longitude !== "number") return;
    if (latitude === 0 || longitude === 0) return;

    map.current?.flyTo([longitude, latitude], 800);
  }, [tracking, assignedJeepney]);

  return (
    <View className="absolute inset-0">
      {/* Map */}
      <MapboxMap />

      {/* Floating buttons */}
      <View className="absolute right-6 gap-4" style={{ top: top + 28 }}>
        <ButtonIcon iconName="settings-outline" onPress={() => router.push(ROUTES.root.settings)} />
        <ButtonIcon iconName="navigate-circle-outline" onPress={recenterToUser} />
      </View>

      {/* Bottom Sheet */}
      <BottomSheetContainer ref={bottomSheetRef} snapPoints={["14%", "30%"]}>
        <View className="gap-4">
          {/* Tracking Status */}
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

          {/* Action Buttons */}
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

          {/* Driver Info */}
          <View className="gap-2">
            <ThemedText variant="h400" className="uppercase">
              Driver info
            </ThemedText>

            {user ? (
              <View className="flex-row flex-wrap gap-1">
                {/* Email */}
                <View className="w-full flex-row gap-1">
                  <ThemedText color="secondary">Signed in as: </ThemedText>
                  <Icon name="person" size={16} />
                  <ThemedText className="text-dodger-blue-600 dark:text-dodger-blue-600">
                    {user.email}
                  </ThemedText>
                </View>

                {/* Assigned Jeepney */}
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
