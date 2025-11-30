import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

type IconProps = {
  name: string;
  family?: "Ionicons" | "MaterialCommunityIcons";
  size?: number;
  color?: string;
};

// TODO: revalidate icon size
export default function Icon({ name, family = "Ionicons", size = 20, color }: IconProps) {
  const scheme = useColorScheme();
  const defaultColor = scheme === "dark" ? "#F5F5F5" : "#171717";

  const IconComponent = family === "Ionicons" ? Ionicons : MaterialCommunityIcons;
  return <IconComponent name={name as any} size={size} color={color ?? defaultColor} />;
}
