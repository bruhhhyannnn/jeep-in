import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { ThemedText, ButtonText, BottomSheetModalBase } from "@/components/ui/";
import { BottomSheetModalBaseRef } from "@/types";
import { logout } from "@/services/firebase/auth";
import { router } from "expo-router";
import { useRoleStore } from "@/context";
import { ROUTES, STRINGS } from "@/constants";

const LogoutConfirmModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const { clearRole } = useRoleStore();

  // Expose open/close only (simple!)
  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  const handleLogout = async () => {
    baseRef.current?.close();

    // Clear user role
    await clearRole();

    // Logout user from firebase auth
    await logout();

    // Remove all stacked screens
    router.dismissAll();

    // Redirect to role selection screen
    router.replace(ROUTES.onboarding.roleSelection);
  };

  return (
    <BottomSheetModalBase title="Confirm Logout" ref={baseRef}>
      <View className="gap-5">
        <ThemedText color="text_muted">{STRINGS.settings.logout.title}</ThemedText>

        <View className="flex-row items-center gap-2">
          <ButtonText
            label={STRINGS.settings.logout.cancel}
            variant="secondary"
            onPress={() => baseRef.current?.close()}
          />

          <View className="flex-1">
            <ButtonText label={STRINGS.settings.logout.logout} fullWidth onPress={handleLogout} />
          </View>
        </View>
      </View>
    </BottomSheetModalBase>
  );
});

export default LogoutConfirmModal;
