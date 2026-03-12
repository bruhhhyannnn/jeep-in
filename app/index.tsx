import { Redirect } from "expo-router";
import { ROUTES } from "@/constants";
import { useRoleStore } from "@/context";
import { useEffect } from "react";

export default function RootScreen() {
  const { role, hydrated, hydrate } = useRoleStore();

  // Hydrate role when app loads
  useEffect(() => {
    hydrate();
  }, []);

  if (!hydrated) return null;

  // Reroute logic
  if (!role) {
    return <Redirect href={ROUTES.onboarding.roleSelection} />;
  }

  if (role === "commuter") {
    return <Redirect href={ROUTES.onboarding.welcome} />;
  }

  if (role === "driver") {
    return <Redirect href={ROUTES.driver.home} />;
  }

  // Fallback (should never happen)
  return <Redirect href={ROUTES.onboarding.welcome} />;
}
