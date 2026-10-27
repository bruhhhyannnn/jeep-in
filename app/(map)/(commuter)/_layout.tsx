import { Outlet } from "react-router";
import { useCommuterWatchers, useLocationWatcher } from "@/hooks";
import { View } from "@/components/ui";

export default function CommuterLayout() {
  useLocationWatcher();
  useCommuterWatchers();

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <Outlet />
    </View>
  );
}
