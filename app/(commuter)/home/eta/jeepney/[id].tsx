import { ROUTES, STRINGS } from "@/constants";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText, Icon } from "@/components/ui";
import { JeepCard, StopCard } from "@/components/commuter";
import { MapLayout } from "@/components/layout";

export default function EtaJeepneyInfoScreen() {
  const { id } = useLocalSearchParams();

  return (
    <MapLayout title={STRINGS.commuter.etaJeepneyScreen.title}>
      <View className="gap-3">
        {/* Header Info */}
        <View className="flex-row items-center gap-2">
          <ThemedText variant="h600">{STRINGS.commuter.etaJeepneyScreen.arrivingIn}</ThemedText>
          <ThemedText variant="h600" className="text-dodger-blue-600 dark:text-dodger-blue-600">
            3 mins.
          </ThemedText>
        </View>

        {/* Cards */}
        <View className="gap-3">
          {/* Jeepney Card */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.etaJeepneyScreen.fromJeepneyLocation}
            </ThemedText>
            <JeepCard
              plateNo={id.toString()}
              status="On route"
              onPress={() => router.push(ROUTES.commuter.jeepney("IAE 2730"))}
            />
          </View>

          {/* Icon Indicator */}
          <View className="items-center">
            <Icon name="arrow-down-circle-outline" size={26} />
          </View>

          {/* Stop Point Card */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.etaJeepneyScreen.toStopPoint}
            </ThemedText>
            <StopCard
              location="Bingao Elementary & National High School"
              address="Batac City"
              onPress={() =>
                router.push(ROUTES.commuter.stop("Bingao Elementary & National High School"))
              }
            />
          </View>
        </View>

        {/* Footer Text */}
        <ThemedText variant="h200" color="secondary" className="text-center">
          {STRINGS.commuter.etaJeepneyScreen.footer}
        </ThemedText>
      </View>
    </MapLayout>
  );
}
