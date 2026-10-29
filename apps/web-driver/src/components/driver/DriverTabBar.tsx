import { router, usePathname } from "@/lib/router";
import { useSafeAreaInsets } from "@jeep-in/web-ui/hooks";
import { ROUTES, STRINGS } from "@/constants";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme";
import { Pressable, ThemedText, View } from "@/components/ui";

const TABS = [
  { path: "/driver/gps", href: ROUTES.driver.home, label: STRINGS.driver.tabs.gps },
  {
    path: "/driver/direction",
    href: ROUTES.driver.direction,
    label: STRINGS.driver.tabs.direction,
  },
  { path: "/driver/report", href: ROUTES.driver.report, label: STRINGS.driver.tabs.report },
  { path: "/driver/profile", href: ROUTES.driver.profile, label: STRINGS.driver.tabs.profile },
] as const;

export const DRIVER_TAB_PATHS: string[] = TABS.map((t) => t.path);

/** GPS · Direction · Report · Profile, with the screen used all shift first. 48px targets. */
export default function DriverTabBar() {
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();
  const { shadows } = useTheme();

  return (
    <View style={{ paddingBottom: Math.max(bottom, 12) }} className="px-4 pt-2">
      <View
        accessibilityRole="tablist"
        style={shadows.sm}
        className="flex-row gap-1 rounded-full border-[1.5px] border-line bg-card p-1"
      >
        {TABS.map((tab) => {
          const active = pathname === tab.path;
          return (
            <Pressable
              key={tab.path}
              onPress={() => !active && router.navigate(tab.href)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              className={cn(
                "h-12 flex-1 items-center justify-center rounded-full",
                active && "bg-action",
              )}
            >
              <ThemedText variant="strong" tone={active ? "actionInk" : "muted"}>
                {tab.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
