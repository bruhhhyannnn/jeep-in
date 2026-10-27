import { Redirect } from "expo-router";
import { ROUTES } from "@/constants";
import { useAuthStore, usePreferences } from "@/store";
import { useEffect } from "react";

export default function RootScreen() {
  const { role, roleHydrated, hydrateRole } = useAuthStore();
  const onboarded = usePreferences((s) => s.onboarded);

  useEffect(() => {
    hydrateRole();
  }, [hydrateRole]);

  if (!roleHydrated) return null;

  if (role === "driver") return <Redirect href={ROUTES.driver.home} />;
  if (role === "commuter") {
    return <Redirect href={onboarded ? ROUTES.commuter.home : ROUTES.onboarding.welcome} />;
  }
  return <Redirect href={ROUTES.onboarding.roleSelection} />;
}
