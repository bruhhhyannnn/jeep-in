import { Stack } from "expo-router";

export default function CommuterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    />
  );
}
