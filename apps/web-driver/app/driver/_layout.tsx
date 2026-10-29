import { Navigate, Outlet } from "react-router";
import { ROUTES } from "@/constants";
import { useDriverSessionSync, useEndOfRoute, useShiftAutomation } from "@/hooks";
import { usePathname } from "@/lib/router";
import { useAuthStore } from "@/store";
import { layout } from "@/theme";
import { ThemedView, View } from "@/components/ui";
import { DRIVER_TAB_PATHS, DriverTabBar, EndOfRouteOverlay } from "@/components/driver";

/** Phone in a mount: four tabs, big targets, sharing state always visible. */
export default function DriverLayout() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  useDriverSessionSync();
  useShiftAutomation();
  const endOfRoute = useEndOfRoute();
  const onTab = DRIVER_TAB_PATHS.includes(usePathname());

  if (!loading && user?.role !== "driver") return <Navigate replace to={ROUTES.auth.login} />;

  // On a wide screen the driver's column is capped at the content width, as on a tablet.
  return (
    <ThemedView className="flex-1 items-center">
      <View style={{ maxWidth: layout.contentMaxWidth }} className="w-full flex-1">
        <View className="min-h-0 flex-1">
          <Outlet />
        </View>
        {onTab && <DriverTabBar />}
        {endOfRoute && <EndOfRouteOverlay endOfRoute={endOfRoute} />}
      </View>
    </ThemedView>
  );
}
