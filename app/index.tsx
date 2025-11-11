import { Redirect } from "expo-router";
import { ROUTES } from "@/constants";

export default function HomeScreen() {
  // TODO: redirect user if its already logged in or not like that
  return <Redirect href={ROUTES.onboarding.roleSelection} />;
}
