import { View } from "react-native";
import { Slot, usePathname } from "expo-router";
import { useCommuterWatchers, useLocationWatcher } from "@/hooks";
import { FollowingCard, TabBar, TAB_PATHS } from "@/components/commuter";

export default function CommuterLayout() {
  useLocationWatcher();
  useCommuterWatchers();

  // Detail sheets cover the tab bar; the four tabs show it.
  const onTab = TAB_PATHS.includes(usePathname());

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <Slot />
      {onTab && <FollowingCard />}
      {onTab && <TabBar />}
    </View>
  );
}
