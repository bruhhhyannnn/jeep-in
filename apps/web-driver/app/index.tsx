import { Navigate } from "react-router";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store";

/** Drivers only: a signed-in driver goes straight to the GPS tab, anyone else signs in. */
export default function RootScreen() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) return null;
  return <Navigate replace to={user?.role === "driver" ? ROUTES.driver.home : ROUTES.auth.login} />;
}
