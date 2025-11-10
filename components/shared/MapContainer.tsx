import { View } from "react-native";

export default function MapContainer({
  fullScreen = false,
  children,
}: {
  fullScreen?: boolean;
  children: React.ReactNode;
}) {
  return <View className={fullScreen ? "absolute inset-0" : "relative flex-1"}>{children}</View>;
}
