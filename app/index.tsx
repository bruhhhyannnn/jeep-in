import { Redirect } from "expo-router";

export default function HomeScreen() {
  // TODO: redirect user if its already logged in or not like that
  return <Redirect href={"/(commuter)/home"} />;
}
