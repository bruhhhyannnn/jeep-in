import { TouchableOpacity, View } from "react-native";
import { ThemedView, ThemedText, Icon } from "@/components/shared";

type RouteCardProps = {
  route: string;
  checked: boolean;
  onToggle?: () => void;
};

export default function RouteCard({ route, checked, onToggle }: RouteCardProps) {
  return (
    <TouchableOpacity onPress={onToggle}>
      <ThemedView variant="bg_light" className="flex-row items-center gap-2 rounded-full px-6 py-3">
        <View className="flex-1 flex-row items-center gap-3">
          {/* Road Icon */}
          <View>
            <Icon family="MaterialCommunityIcons" name="road-variant" size={28} />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Route Name */}
            <ThemedText variant="h500">{route}</ThemedText>
          </View>
        </View>

        {/* Checkbox Icon */}
        <View>
          <Icon
            family="MaterialCommunityIcons"
            name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
            color={checked ? "#1E90FF" : "#737373"}
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
