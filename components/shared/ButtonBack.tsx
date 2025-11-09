import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import ThemedText from "@/components/shared/ThemedText";
import Icon from "@/components/shared/Icon";

type ButtonBackProps = {
  label?: string;
  showIcon?: boolean;
  color?: "primary";
  onPress?: () => void;
};

export default function ButtonBack({
  label = "Go Back",
  showIcon = false,
  color,
  onPress,
}: ButtonBackProps) {
  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => router.back()}
      className="flex-row items-center gap-2"
    >
      {showIcon && <Icon name="arrow-back" color={color === "primary" ? "#edf9ff" : undefined} />}
      <ThemedText variant="h300" color={color ?? "default"}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
