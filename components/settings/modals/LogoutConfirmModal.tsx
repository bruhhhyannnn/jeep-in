import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { ThemedText, ButtonText, BottomSheetModalBase } from "@/components/ui/";
import { BottomSheetModalBaseRef } from "@/types";
import { logout } from "@/services/firebase/auth";
import { router } from "expo-router";
import { useRoleStore } from "@/context";
import { ROUTES } from "@/constants";

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
        <ThemedText color="secondary">Are you sure you want to logout?</ThemedText>

        <View className="flex-row items-center gap-2">
          <ButtonText label="Cancel" variant="secondary" onPress={() => baseRef.current?.close()} />

          <View className="flex-1">
            <ButtonText label="Logout" fullWidth onPress={handleLogout} />
          </View>
        </View>
      </View>
    </BottomSheetModalBase>
  );
});

export default LogoutConfirmModal;
