import { Redirect } from "expo-router";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store";
import { useEffect } from "react";

export default function RootScreen() {
  const { role, roleHydrated, hydrateRole } = useAuthStore();

  useEffect(() => {
    hydrateRole();
  }, []);

  if (!roleHydrated) return null;

  if (!role) {
    return <Redirect href={ROUTES.onboarding.roleSelection} />;
  }

  if (role === "commuter") {
    return <Redirect href={ROUTES.onboarding.welcome} />;
  }

  if (role === "driver") {
    return <Redirect href={ROUTES.driver.home} />;
  }

  return <Redirect href={ROUTES.onboarding.welcome} />;
}
