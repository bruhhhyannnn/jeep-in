import { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { ThemedText, ButtonText, BottomSheetModalBase } from "@/components/ui";
import { BottomSheetModalBaseRef } from "@/types";
import { logout } from "@/services/firebase/auth";
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
    await clearRole();
    await logout();
    router.dismissAll();
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
