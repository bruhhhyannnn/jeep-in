import { TouchableOpacity, View } from "react-native";
import { ThemedText, ThemedView, Icon } from "@/components/ui";
import { JeepStatusBadge } from "@/components/badge";
import { JeepneyStatus } from "@/types";
import { useShadows } from "@/style/shadow";

type JeepCardProps = {
  plateNo: string;
  status: JeepneyStatus;
  nextStop?: string;
  distanceKm?: number | null;
  onPress?: () => void;
};

export default function JeepCard({
  plateNo,
  status,
  nextStop,
  distanceKm,
  onPress,
}: JeepCardProps) {
  const shadows = useShadows();

  return (
    <TouchableOpacity onPress={onPress} style={shadows.card} className="rounded-full">
      <ThemedView variant="bg" className="flex-row items-center gap-2 rounded-full px-6 py-3">
        {/* Content Container */}
        <View className="flex-1 flex-row items-center gap-3">
          {/* Bus Icon */}
          <View className="items-center">
            <Icon family="MaterialCommunityIcons" name="bus" size={26} />
            {distanceKm != null && (
              <ThemedText color="text_muted">{distanceKm.toFixed(1)} km</ThemedText>
            )}
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Plate Number & Status Badge */}
            <View className="flex-row items-start gap-2">
              <ThemedText variant="h600">{plateNo}</ThemedText>
              <JeepStatusBadge variant={status} />
            </View>

            {/* Next Stop */}
            {nextStop && (
              <View className="flex-row gap-2">
                <Icon name="return-down-forward-outline" size={18} color={"#737373"} />
                <ThemedText color="text_muted" className="flex-1">
                  {nextStop}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Chevron right */}
        <View>
          <Icon name="chevron-forward" />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
