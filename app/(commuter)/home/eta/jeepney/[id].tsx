import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText, Icon } from "@/components/shared";
import { JeepCard, StopCard } from "@/components/commuter";
import { MapLayout } from "@/components/commuter/layout/";

export default function EtaJeepneyInfoScreen() {
  const { id } = useLocalSearchParams();

  return (
    <MapLayout title="ETA Jeepney Info">
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
          {/* Jeepney Card */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              FROM JEEPNEY LOCATION
            </ThemedText>
            <JeepCard
              plateNo={id.toString()}
              status="On route"
              onPress={() => router.push("/(commuter)/home/jeepney/IAE 2730")}
            />
          </View>

          {/* Icon Indicator */}
          <View className="items-center">
            <Icon name="arrow-down-circle-outline" size={26} />
          </View>

          {/* Stop Point Card */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              TO STOP POINT
            </ThemedText>
            <StopCard
              location="Bingao Elementary & National High School"
              address="Batac City"
              onPress={() =>
                router.push("/(commuter)/home/stop/Bingao Elementary & National High School")
              }
            />
          </View>
        </View>

        {/* Footer Text */}
        <ThemedText variant="h200" color="secondary" className="text-center">
          You can now proceed to your nearest stop point and wait for the jeepney to arrive.
        </ThemedText>
      </View>
    </MapLayout>
  );
}
