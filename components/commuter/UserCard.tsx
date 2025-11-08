import { TouchableOpacity, View } from "react-native";
import { ThemedText, ThemedView, Icon } from "@/components/shared";

type JeepCardProps = {
  onPress?: () => void;
};

export default function UserCard({ onPress }: JeepCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView variant="bg_light" className="flex-row items-center gap-2 rounded-full px-6 py-3">
        {/* Content Container */}
        <View className="flex-1 flex-row items-center gap-3">
          {/* Bus Icon */}
          <View>
            <Icon family="MaterialCommunityIcons" name="account" size={28} />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Plate Number and Status Badge */}
            <ThemedText variant="h500">Your Location</ThemedText>
          </View>
        </View>

        {/* Chevron Right Icon */}
        <View>
          <Icon family="MaterialCommunityIcons" name="chevron-right" />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
