import { Outlet } from "react-router";
import { usePathname } from "@/lib/router";
import { View } from "@/components/ui";

/** Screens fade up from the bottom, as the native onboarding stack does. */
export default function OnboardingLayout() {
  const pathname = usePathname();

  return (
    <View key={pathname} className="screen-rise flex-1">
      <Outlet />
    </View>
  );
}
