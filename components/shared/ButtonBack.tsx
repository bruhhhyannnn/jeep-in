import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import ThemedText from "@/components/shared/ThemedText";
import Icon from "@/components/shared/Icon";

type ButtonBackProps = {
  label?: string;
  showBackIcon?: boolean;
  onPress?: () => void;
};

export default function ButtonBack({
  label = "Go Back",
  showBackIcon = false,
  onPress,
}: ButtonBackProps) {
  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => router.back()}
      className="flex-row items-center gap-2"
    >
      {showBackIcon && <Icon family="Ionicons" name="arrow-back" size={20} />}
      <ThemedText variant="h300">{label}</ThemedText>
    </TouchableOpacity>
  );
}
