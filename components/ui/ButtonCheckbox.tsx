import { TouchableOpacity, View } from "react-native";
import ThemedView from "@/components/ui/ThemedView";
import ThemedText from "@/components/ui/ThemedText";
import Icon from "@/components/ui/Icon";

type ButtonCheckboxProps = {
  label: string;
  iconName: string;
  checked: boolean;
  onToggle?: () => void;
};

export default function ButtonCheckbox({
  label,
  iconName,
  checked,
  onToggle,
}: ButtonCheckboxProps) {
  return (
    <TouchableOpacity onPress={onToggle}>
      <ThemedView variant="bg" className="flex-row items-center gap-2 rounded-full px-6 py-3">
        <View className="flex-1 flex-row items-center gap-2">
          {/* Road Icon */}
          <View>
            <Icon family="MaterialCommunityIcons" name={iconName} />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Label Name */}
            <ThemedText variant="h500">{label}</ThemedText>
          </View>
        </View>

        {/* Checkbox Icon */}
        <View>
          <Icon
            name={checked ? "checkbox" : "square-outline"}
            color={checked ? "#1E90FF" : "#737373"}
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
