import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import ThemedText from "@/components/shared/ThemedText";
import Icon from "@/components/shared/Icon";

type ButtonBackProps = {
  label?: string;
  showIcon?: boolean;
  onPress?: () => void;
};

export default function ButtonBack({
  label = "Go Back",
  showIcon = false,
  onPress,
}: ButtonBackProps) {
  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => router.back()}
      className="flex-row items-center gap-2"
    >
      {showIcon && <Icon name="arrow-back" />}
      <ThemedText variant="h300">{label}</ThemedText>
    </TouchableOpacity>
  );
}
