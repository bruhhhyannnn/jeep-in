import { Redirect } from "expo-router";
import { ROUTES } from "@/constants";
import { useRoleStore } from "@/context";
import { useEffect, useState } from "react";

export default function RootScreen() {
  const { role, hydrated, hydrate } = useRoleStore();
  const [ready, setReady] = useState(false);

  // Hydrate role when app loads
  useEffect(() => {
    hydrate();
  }, []);

  // Wait for hydration to finish before redirecting
  useEffect(() => {
    if (hydrated) setReady(true);
  }, [hydrated]);

  if (!ready) return null; // 👈 avoids flashing the wrong screen

  // Reroute logic
  if (!role) {
    return <Redirect href={ROUTES.onboarding.roleSelection} />;
  }

  if (role === "commuter") {
    return <Redirect href={ROUTES.commuter.home} />;
  }

  if (role === "driver") {
    return <Redirect href={ROUTES.driver.home} />;
  }

  // if (role === "admin") {
  //   return <Redirect href={ROUTES.admin.dashboard} />; // example
  // }

  // if (role === "super_admin") {
  //   return <Redirect href={ROUTES.superAdmin.panel} />; // example
  // }

  // Fallback (should never happen)
  return <Redirect href={ROUTES.onboarding.roleSelection} />;
}
