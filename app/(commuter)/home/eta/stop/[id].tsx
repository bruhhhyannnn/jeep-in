import { MapLayout } from "@/components/commuter/layout/";
import { StopCard, UserCard } from "@/components/commuter";
import { Icon, ThemedText } from "@/components/shared";
import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";

export default function EtaStopPointInfoScreen() {
  const { id } = useLocalSearchParams();

  return (
    <MapLayout title="ETA Stop Point Info">
      <View className="gap-3">
        {/* Header Info */}
        <View className="flex-row items-center gap-2">
          <ThemedText variant="h600">Arriving in</ThemedText>
          <ThemedText variant="h600" className="text-dodger-blue-600 dark:text-dodger-blue-600">
            3 mins.
          </ThemedText>
        </View>

        {/* Cards */}
        <View className="gap-3">
          {/* User Card */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              You
            </ThemedText>
            <UserCard
              onPress={() => {
                console.log("Location press functionality");
              }}
            />
          </View>

          {/* Icon Indicator */}
          <View className="items-center">
            <Icon family="MaterialCommunityIcons" name="arrow-down-right" size={28} />
          </View>

          {/* Stop Point Card */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              Stop point
            </ThemedText>
            <StopCard
              location={id.toString()}
              address="Batac City"
              onPress={() => router.push(`/(commuter)/home/stop/${id}`)}
            />
          </View>
        </View>

        {/* Footer Text */}
        <ThemedText variant="h200" color="secondary" className="text-center">
          You can use the directions to walk to the stop point.
        </ThemedText>
      </View>
    </MapLayout>
  );
}
