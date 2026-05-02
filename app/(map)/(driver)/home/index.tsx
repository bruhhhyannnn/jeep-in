import * as SecureStore from "expo-secure-store";
import { View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { BottomSheetContainer, ThemedText, ButtonText, Icon } from "@/components/ui";
import { useAuthStore } from "@/store";
import { showWarning } from "@/services/ui/toasts";
import { subscribeToAssignedJeepney } from "@/services/assignments/subscribeToAssignedJeepney";
import { useMap } from "@/store";
import { STRINGS } from "@/constants";
import type { BottomSheetContainerRef, Jeepney } from "@/types";
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from "@/services/location/driverTracking";

export default function DriverHomeScreen() {
  // Ref for bottom sheet container
  const bottomSheetRef = useRef<BottomSheetContainerRef>(null);

  //
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
      {/* Bottom Sheet */}
      <BottomSheetContainer ref={bottomSheetRef} snapPoints={["8%", "24%"]}>
        <View className="gap-4">
          {/* Tracking Status */}
          <View>
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.driver.home.trackingStatus}
            </ThemedText>

            {!assignedJeepney ? (
              <ThemedText className="text-warning-600 dark:text-warning-600">
                {STRINGS.driver.home.waitingForJeepneyAssignment}
              </ThemedText>
            ) : (
              <ThemedText
                className={
                  tracking
                    ? "text-success-600 dark:text-success-600"
                    : "text-warning-600 dark:text-warning-600"
                }
              >
                {tracking ? STRINGS.driver.home.trackingIsOn : STRINGS.driver.home.trackingIsOff}
              </ThemedText>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <ButtonText
              label={STRINGS.driver.home.startTracking}
              iconName="play-circle-outline"
              onPress={handleStart}
              disabled={tracking || !assignedJeepney}
            />

            <ButtonText
              label={STRINGS.driver.home.stopTracking}
              iconName="stop-circle-outline"
              onPress={handleStop}
              variant="secondary"
              disabled={!tracking}
            />
          </View>

          {/* Driver Info */}
          <View className="gap-2">
            <ThemedText variant="h400" className="uppercase">
              {STRINGS.driver.home.drivingInfo}
            </ThemedText>

            {user ? (
              <View className="flex-row flex-wrap items-center gap-1">
                {/* Email */}
                <View className="w-full flex-row gap-1">
                  <ThemedText color="text_muted">{STRINGS.driver.home.signedInAs}</ThemedText>
                  <Icon name="person" size={16} />
                  <ThemedText className="text-dodger-blue-600 dark:text-dodger-blue-600">
                    {user.email}
                  </ThemedText>
                </View>

                {/* Assigned Jeepney */}
                {assignedJeepney && (
                  <View className="w-full flex-row items-center gap-1">
                    <ThemedText color="text_muted">
                      {STRINGS.driver.home.jeepneyAssigned}
                    </ThemedText>
                    <Icon family="MaterialCommunityIcons" name="bus" size={18} />
                    <ThemedText className="text-dodger-blue-600 dark:text-dodger-blue-600">
                      {assignedJeepney?.plate_number}
                    </ThemedText>
                  </View>
                )}
              </View>
            ) : (
              <ThemedText color="text_muted">{STRINGS.driver.home.loadingUser}</ThemedText>
            )}
          </View>
        </View>
      </BottomSheetContainer>
    </View>
  );
}
