import { ROUTES, STRINGS } from "@/constants";
import { router, usePathname } from "@/lib/router";
import { fonts, layout } from "@/theme";
import { useAlerts } from "@/store";
import { useSafeAreaInsets } from "@/hooks/useSafeAreaInsets";
import { Icon, Pressable, ThemedText, View } from "@/components/ui";

const TABS = [
  {
    path: "/home",
    href: ROUTES.commuter.home,
    label: STRINGS.commuter.tabs.map,
    icon: "map-outline",
  },
  {
    path: "/stops",
    href: ROUTES.commuter.stops,
    label: STRINGS.commuter.tabs.stops,
    icon: "list-outline",
  },
  {
    path: "/fare",
    href: ROUTES.commuter.fare,
    label: STRINGS.commuter.tabs.fare,
    icon: "receipt-outline",
  },
  {
    path: "/alerts",
    href: ROUTES.commuter.alerts,
    label: STRINGS.commuter.tabs.alerts,
    icon: "notifications-outline",
  },
] as const;

export const TAB_PATHS: string[] = TABS.map((t) => t.path);

/** Height the docked tab bar takes from the bottom of the screen, safe area included. */
export function useTabBarInset() {
  const { bottom } = useSafeAreaInsets();
  return layout.tabBarHeight + bottom;
}

/** Map · Stops · Fare · Alerts, docked under the sheets. The open tab is blue. */
export default function TabBar() {
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();
  const unread = useAlerts((s) => s.items.filter((a) => !a.read).length);

  return (
    <View
      style={{ paddingBottom: bottom }}
      className="absolute bottom-0 left-0 right-0 items-center border-t-[1.5px] border-line bg-card"
    >
      <View
        accessibilityRole="tablist"
        style={{ height: layout.tabBarHeight, maxWidth: layout.contentMaxWidth }}
        className="w-full flex-row"
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
              <View>
                <Icon name={tab.icon} size={22} tone={active ? "action" : "muted"} />
                {badge && (
                  <View className="absolute -right-1 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-danger" />
                )}
              </View>
              <ThemedText
                variant="label"
                tone={active ? "action" : "muted"}
                style={active ? { fontFamily: fonts.bold } : undefined}
              >
                {tab.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
