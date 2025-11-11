import { ROUTES, STRINGS } from "@/constants";
import { MapLayout } from "@/components/layout";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText, ButtonText } from "@/components/ui";
import { JeepStatusBadge, StopCard } from "@/components/commuter";

export default function JeepneyInfoScreen() {
  const { id } = useLocalSearchParams();

  return (
    <MapLayout title={STRINGS.commuter.jeepneyScreen.title}>
      <View className="gap-3">
        {/* Header Info */}
        <View>
          <View className="flex-row items-start gap-2">
            <ThemedText variant="h600">{id}</ThemedText>
            <JeepStatusBadge />
          </View>
          <ThemedText color="secondary">Going Paoay route</ThemedText>
        </View>

        {/* Stop Cards */}
        <View className="gap-3">
          {/* Last Stop */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.jeepneyScreen.lastStop}
            </ThemedText>
            <StopCard
              location="Pik a Bun"
              address="Batac City"
              onPress={() => router.push(ROUTES.commuter.stop("Pik a Bun"))}
            />
          </View>

          {/* Next Stop */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.jeepneyScreen.nextStop}
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

        {/* Get ETA Button */}
        <View className="self-center">
          <ButtonText
            label={STRINGS.commuter.jeepneyScreen.getEta}
            iconName="timer-outline"
            onPress={() => router.push(ROUTES.commuter.etaJeepney(id.toString()))}
          />
        </View>
      </View>
    </MapLayout>
  );
}
