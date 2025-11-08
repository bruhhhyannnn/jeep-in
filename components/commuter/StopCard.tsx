import { TouchableOpacity, View } from "react-native";
import { ThemedView, ThemedText, Icon } from "@/components/shared";

type StopCardProps = {
  location: string;
  address: string;
  onPress?: () => void;
};

export default function StopCard({ location, address, onPress }: StopCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView variant="bg_light" className="flex-row items-center gap-2 rounded-full px-6 py-2">
        <View className="flex-1 flex-row items-center gap-3">
          <View>
            <Icon family="MaterialCommunityIcons" name="bus-stop" size={28} />
          </View>
          <View className="flex-1">
            <ThemedText variant="h500">{location}</ThemedText>
            <ThemedText color="secondary">{address}</ThemedText>
          </View>
        </View>
        <View>
          <Icon family="MaterialCommunityIcons" name="chevron-right" />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
