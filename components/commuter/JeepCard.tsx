import { TouchableOpacity, View } from "react-native";
import { ThemedText, ThemedView, Icon } from "@/components/shared";
import { JeepStatusBadge } from "@/components/commuter";
// TODO: make a type for this one someday
import { JeepStatus } from "./JeepStatusBadge";

type JeepCardProps = {
  plateNo: string;
  status: JeepStatus; // change this to react to status badge
  nextStop?: string;
  onPress?: () => void;
};

export default function JeepCard({ plateNo, status, nextStop, onPress }: JeepCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView variant="bg_light" className="flex-row items-center gap-2 rounded-full px-6 py-3">
        {/* Content Container */}
        <View className="flex-1 flex-row items-center gap-3">
          {/* Bus Icon */}
          <View>
            <Icon family="MaterialCommunityIcons" name="bus" size={28} />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Plate Number & Status Badge */}
            <View className="flex-row items-start gap-2">
              <ThemedText variant="h600">{plateNo}</ThemedText>
              {/* TODO: change someday to make a file for types.ts */}
              <JeepStatusBadge variant={status} />
            </View>

            {/* Next Stop */}
            {nextStop && (
              <View className="flex-row gap-2">
                <Icon
                  family="MaterialCommunityIcons"
                  name="map-marker-right-outline"
                  size={16}
                  color={"#737373"}
                />
                <ThemedText color="secondary">{nextStop}</ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Chevron right */}
        <View>
          <Icon family="MaterialCommunityIcons" name="chevron-right" />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
