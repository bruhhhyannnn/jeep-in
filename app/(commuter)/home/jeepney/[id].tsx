import { MapLayout } from "@/components/layout";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText, ButtonText } from "@/components/ui";
import { JeepStatusBadge, StopCard } from "@/components/commuter";

export default function JeepneyInfoScreen() {
  const { id } = useLocalSearchParams();

  return (
    <MapLayout title="Jeepney Info">
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
              Last Stop
            </ThemedText>
            <StopCard
              location="Pik a Bun"
              address="Batac City"
              onPress={() => router.push("/(commuter)/home/stop/Pik a Bun")}
            />
          </View>

          {/* Next Stop */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              Next Stop
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

        {/* Get ETA Button */}
        <ButtonText
          label="Get ETA"
          onPress={() => router.push(`/(commuter)/home/eta/jeepney/${id}`)}
          iconName="timer-outline"
        />
      </View>
    </MapLayout>
  );
}
