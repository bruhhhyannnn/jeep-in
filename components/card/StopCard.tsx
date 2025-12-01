import { TouchableOpacity, View } from "react-native";
import { ThemedView, ThemedText, Icon } from "@/components/ui";
import { useShadows } from "@/style/shadow";

type StopCardProps = {
  location: string;
  address: string;
  distanceKm?: number | null;
  onPress?: () => void;
};

export default function StopCard({ location, address, distanceKm, onPress }: StopCardProps) {
  const shadows = useShadows();

  return (
    <TouchableOpacity onPress={onPress} style={shadows.card} className="rounded-full">
      <ThemedView variant="bg" className="flex-row items-center gap-2 rounded-full px-6 py-3">
        <View className="flex-1 flex-row items-center gap-3">
          {/* Bus Stop Icon */}
          <View className="items-center">
            <Icon family="MaterialCommunityIcons" name="bus-stop" size={26} />
            {distanceKm != null && (
              <ThemedText color="text_muted" variant="h100">
                {distanceKm.toFixed(1)} km
              </ThemedText>
            )}
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Location & Address */}
            <ThemedText variant="h500">{location}</ThemedText>
            <ThemedText color="text_muted" className="flex-1">
              {address}
            </ThemedText>
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
