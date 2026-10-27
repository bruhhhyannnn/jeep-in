import { Navigate } from "react-router";
import { ROUTES } from "@/constants";
import { usePreferences } from "@/store";

/** Commuter-only: first launch goes to the welcome slides, after that straight to the map. */
export default function RootScreen() {
  const onboarded = usePreferences((s) => s.onboarded);
  return <Navigate replace to={onboarded ? ROUTES.commuter.home : ROUTES.onboarding.welcome} />;
}
