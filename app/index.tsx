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

  if (!hydrated) return null; // 👈 avoids flashing the wrong screen

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

  // TODO: to be deleted
  // if (role === "admin") {
  //   return <Redirect href={ROUTES.admin.home} />;
  // }

  // if (role === "super_admin") {
  //   return <Redirect href={ROUTES.superAdmin.panel} />; // example
  // }

  // Fallback (should never happen)
  return <Redirect href={ROUTES.onboarding.roleSelection} />;
}
