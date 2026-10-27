import type { ComponentProps } from "react";
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
  const iconColor = color ?? colors[tone];
  return family === "Ionicons" ? (
    <Ionicons name={name as IoniconName} size={size} color={iconColor} />
  ) : (
    <MaterialCommunityIcons name={name as MaterialIconName} size={size} color={iconColor} />
  );
}

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];
