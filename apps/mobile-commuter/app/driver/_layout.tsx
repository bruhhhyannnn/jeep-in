import { View } from "react-native";
import { Redirect, Slot, usePathname } from "expo-router";
import { ROUTES } from "@/constants";
import { useDriverSessionSync, useEndOfRoute, useShiftAutomation } from "@/hooks";
import { useAuthStore } from "@/store";
import { ThemedView } from "@/components/ui";
import { DRIVER_TAB_PATHS, DriverTabBar, EndOfRouteOverlay } from "@/components/driver";

/** Phone in a mount: four tabs, big targets, sharing state always visible. */
export default function DriverLayout() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  useDriverSessionSync();
  useShiftAutomation();
  const endOfRoute = useEndOfRoute();
  const onTab = DRIVER_TAB_PATHS.includes(usePathname());

  if (!loading && !user) return <Redirect href={ROUTES.auth.login} />;

  return (
    <ThemedView className="flex-1">
      <View className="flex-1">
        <Slot />
      </View>
      {onTab && <DriverTabBar />}
      {endOfRoute && <EndOfRouteOverlay endOfRoute={endOfRoute} />}
    </ThemedView>
  );
}
