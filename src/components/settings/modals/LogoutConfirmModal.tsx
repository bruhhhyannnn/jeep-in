import { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { ThemedText, Button, BottomSheetModalBase } from "@/components/ui";
import { BottomSheetModalBaseRef } from "@/types";
import { logout } from "@/services/firebase/auth";
import { isSharingRunning, stopSharing } from "@/services/location/driverTracking";
import { router } from "expo-router";
import { useAuthStore } from "@/store";
import { ROUTES, STRINGS } from "@/constants";

const LogoutConfirmModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const { clearRole } = useAuthStore();

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  const handleLogout = async () => {
    baseRef.current?.close();
    // Commuters must not keep seeing a jeep whose driver signed out.
    if (await isSharingRunning()) await stopSharing();
    await clearRole();
    await logout();
    router.dismissAll();
    router.replace(ROUTES.onboarding.roleSelection);
  };

  return (
    <BottomSheetModalBase title={STRINGS.settings.logout.confirmTitle} ref={baseRef}>
      <View className="gap-5">
        <ThemedText tone="muted">{STRINGS.settings.logout.body}</ThemedText>

        <View className="flex-row gap-2.5">
          <View className="flex-1">
            <Button
              label={STRINGS.settings.logout.cancel}
              variant="outline"
              onPress={() => baseRef.current?.close()}
            />
          </View>
          <View className="flex-1">
            <Button label={STRINGS.settings.logout.logout} variant="navy" onPress={handleLogout} />
          </View>
        </View>
      </View>
    </BottomSheetModalBase>
  );
});

export default LogoutConfirmModal;
