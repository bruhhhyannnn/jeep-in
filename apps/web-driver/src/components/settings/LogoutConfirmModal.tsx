import { useImperativeHandle, useRef, type Ref } from "react";
import { ROUTES, STRINGS } from "@/constants";
import { router } from "@/lib/router";
import { logout } from "@/services/firebase/auth";
import { isSharingRunning, stopSharing } from "@/services/location/driverTracking";
import type { BottomSheetModalBaseRef } from "@/types";
import { BottomSheetModalBase, Button, ThemedText, View } from "@/components/ui";

/** How long sign-out waits for "off duty" to reach the server before going ahead. */
const OFF_DUTY_WAIT_MS = 5000;

export default function LogoutConfirmModal({ ref }: { ref?: Ref<BottomSheetModalBaseRef> }) {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  const handleLogout = async () => {
    baseRef.current?.close();
    // Commuters must not keep seeing a jeep whose driver signed out. With no signal the
    // write can't finish before the sign-in is gone, so don't wait on it forever.
    if (await isSharingRunning()) {
      await Promise.race([
        stopSharing().catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, OFF_DUTY_WAIT_MS)),
      ]);
    }
    await logout();
    router.replace(ROUTES.auth.login);
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
}
