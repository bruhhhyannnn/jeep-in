import { Ionicons, Feather } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

type IconProps = {
  name: string;
  family?: "Ionicons" | "Feather";
  size?: number;
  color?: string;
};

export default function Icon({ name, family = "Ionicons", size = 24, color }: IconProps) {
  const scheme = useColorScheme();
  const defaultColor = scheme === "dark" ? "#F5F5F5" : "#171717";

  const IconComponent = family === "Feather" ? Feather : Ionicons;
  return <IconComponent name={name as any} size={size} color={color ?? defaultColor} />;
}
