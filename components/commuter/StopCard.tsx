import { TouchableOpacity, View } from "react-native";
import { ThemedView, ThemedText, Icon } from "@/components/ui";

type StopCardProps = {
  location: string;
  address: string;
  onPress?: () => void;
};

export default function StopCard({ location, address, onPress }: StopCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView variant="bg_light" className="flex-row items-center gap-2 rounded-full px-6 py-3">
        <View className="flex-1 flex-row items-center gap-3">
          {/* Bus Stop Icon */}
          <View>
            {/* TODO: revalidate icon size */}
            <Icon family="MaterialCommunityIcons" name="bus-stop" size={26} />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Location & Address */}
            <ThemedText variant="h500">{location}</ThemedText>
            <ThemedText color="secondary">{address}</ThemedText>
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
