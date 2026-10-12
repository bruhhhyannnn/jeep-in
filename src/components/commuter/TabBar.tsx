import { Pressable, View } from "react-native";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { cn } from "@/lib/utils";
import { layout, useTheme } from "@/theme";
import { useAlerts } from "@/store";
import { Icon, ThemedText } from "@/components/ui";

const TABS = [
  {
    path: "/home",
    href: ROUTES.commuter.home,
    label: STRINGS.commuter.tabs.map,
    icon: "map-outline",
    activeIcon: "map",
  },
  {
    path: "/stops",
    href: ROUTES.commuter.stops,
    label: STRINGS.commuter.tabs.stops,
    icon: "list-outline",
    activeIcon: "list",
  },
  {
    path: "/fare",
    href: ROUTES.commuter.fare,
    label: STRINGS.commuter.tabs.fare,
    icon: "receipt-outline",
    activeIcon: "receipt",
  },
  {
    path: "/alerts",
    href: ROUTES.commuter.alerts,
    label: STRINGS.commuter.tabs.alerts,
    icon: "notifications-outline",
    activeIcon: "notifications",
  },
] as const;

export const TAB_PATHS: string[] = TABS.map((t) => t.path);

/** Height the floating tab bar takes from the bottom of the screen, gap included. */
export function useTabBarInset() {
  const { bottom } = useSafeAreaInsets();
  return layout.tabBarHeight + layout.tabBarGap * 2 + Math.max(bottom, layout.tabBarGap);
}

/** Map · Stops · Fare · Alerts. Floats above the map, outside the sheets. */
export default function TabBar() {
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();
  const { shadows } = useTheme();
  const unread = useAlerts((s) => s.items.filter((a) => !a.read).length);

  return (
    <View
      pointerEvents="box-none"
      style={{ bottom: Math.max(bottom, layout.tabBarGap) + layout.tabBarGap }}
      className="absolute left-0 right-0 items-center px-3"
    >
      <View
        accessibilityRole="tablist"
        style={[{ height: layout.tabBarHeight }, shadows.md]}
        className="w-full max-w-[480px] flex-row rounded-[24px] border border-line bg-card px-1.5"
      >
        {TABS.map((tab) => {
          const active = pathname === tab.path;
          const badge = tab.path === "/alerts" && unread > 0;
          return (
            <Pressable
              key={tab.path}
              onPress={() => !active && router.navigate(tab.href)}
              accessibilityRole="tab"
              accessibilityLabel={badge ? `${tab.label}, ${unread} unread` : tab.label}
              accessibilityState={{ selected: active }}
              className="flex-1 items-center justify-center gap-1"
            >
              <View
                className={cn(
                  "h-8 w-14 items-center justify-center rounded-full",
                  active && "bg-action-tint",
                )}
              >
                <Icon
                  name={active ? tab.activeIcon : tab.icon}
                  size={21}
                  tone={active ? "action" : "muted"}
                />
                {badge && (
                  <View className="absolute right-3 top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-danger" />
                )}
              </View>
              <ThemedText variant="label" tone={active ? "action" : "muted"}>
                {tab.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
