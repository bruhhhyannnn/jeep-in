import { Outlet } from "react-router";
import { useCommuterWatchers, useLocationWatcher } from "@/hooks";
import { usePathname } from "@/lib/router";
import { View } from "@/components/ui";
import { TabBar, TAB_PATHS } from "@/components/commuter";

export default function CommuterLayout() {
  useLocationWatcher();
  useCommuterWatchers();

  // Detail sheets cover the tab bar; the four tabs show it.
  const onTab = TAB_PATHS.includes(usePathname());

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <Outlet />
      {onTab && <TabBar />}
    </View>
  );
}
