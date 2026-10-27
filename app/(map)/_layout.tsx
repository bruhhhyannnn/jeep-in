import { Outlet } from "react-router";
import { ROUTES } from "@/constants";
import { usePathname } from "@/lib/router";
import { MapProvider } from "@/store";
import { MapboxMap } from "@/components/map";
import { useFleetSubscription } from "@/hooks";
import { View } from "@/components/ui";

/** Full-page screens that hide the map completely. */
const COVERING: string[] = [ROUTES.commuter.fare, ROUTES.commuter.alerts, ROUTES.settings.home];

/** One map stays mounted under every commuter screen; screens draw on top of it. */
export default function MapGroupLayout() {
  useFleetSubscription();
  // Keyboard and screen reader users skip the map while a full page covers it.
  const covered = COVERING.includes(usePathname());

  return (
    <MapProvider>
      <View className="flex-1 overflow-hidden bg-page">
        <View inert={covered} className="absolute inset-0">
          <MapboxMap />
        </View>
        <View className="absolute inset-0" pointerEvents="box-none">
          <Outlet />
        </View>
      </View>
    </MapProvider>
  );
}
