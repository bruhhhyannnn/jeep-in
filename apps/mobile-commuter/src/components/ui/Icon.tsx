import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme, type Palette } from "@/theme";

type IconProps = {
  name: string;
  family?: "Ionicons" | "MaterialCommunityIcons";
  size?: number;
  /** Explicit colour; otherwise taken from `tone`. */
  color?: string;
  tone?: keyof Palette;
};

export default function Icon({
  name,
  family = "Ionicons",
  size = 20,
  color,
  tone = "ink",
}: IconProps) {
  const { colors } = useTheme();
  const IconComponent = family === "Ionicons" ? Ionicons : MaterialCommunityIcons;
  return <IconComponent name={name as any} size={size} color={color ?? colors[tone]} />;
}
