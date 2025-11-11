import { TouchableOpacity, View } from "react-native";
import { ThemedText, ThemedView, Icon } from "@/components/ui";
import JeepStatusBadge from "@/components/commuter/JeepStatusBadge";
import { JeepneyStatus } from "@/types";

type JeepCardProps = {
  plateNo: string;
  status: JeepneyStatus;
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
            {/* TODO: revalidate icon size */}
            <Icon family="MaterialCommunityIcons" name="bus" size={26} />
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
                <ThemedText color="secondary" className="flex-1">
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
