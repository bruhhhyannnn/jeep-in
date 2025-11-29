import { TouchableOpacity, View } from "react-native";
import { ThemedText, ThemedView, Icon } from "@/components/ui";
import { useShadows } from "@/style/shadow";
import { STRINGS } from "@/constants";

type UserCardProps = {
  onPress?: () => void;
};

export default function UserCard({ onPress }: UserCardProps) {
  const shadows = useShadows();

  return (
    <TouchableOpacity onPress={onPress} style={shadows.card} className="rounded-full">
      <ThemedView variant="bg" className="flex-row items-center gap-2 rounded-full px-6 py-3">
        {/* Content Container */}
        <View className="flex-1 flex-row items-center gap-3">
          {/* Bus Icon */}
          <View>
            <Icon name="person" />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Plate Number and Status Badge */}
            <ThemedText variant="h500">{STRINGS.components.card.yourLocation}</ThemedText>
          </View>
        </View>

        {/* Chevron Right Icon */}
        <View>
          <Icon name="chevron-forward" />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
