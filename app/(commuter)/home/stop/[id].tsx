import { ROUTES } from "@/constants";
import { MapLayout } from "@/components/layout";
import { StopTitleBadge } from "@/components/commuter";
import { ButtonText, Icon, ThemedText, ThemedView } from "@/components/ui";
import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";

export default function StopPointInfoScreen() {
  const { id } = useLocalSearchParams();

  return (
    <MapLayout title="Stop Point Info">
      <View className="gap-3">
        {/* Header Info */}
        <View>
          <ThemedText variant="h600">{id}</ThemedText>
          <View className="flex-row items-start gap-2">
            <StopTitleBadge title="Centro" />
            <ThemedText color="secondary">Going Paoay route</ThemedText>
          </View>
        </View>

        <View className="flex-1 gap-1">
          <ThemedText variant="h300" className="uppercase">
            Address
          </ThemedText>
          <ThemedView variant="bg_light" className="flex-row gap-2 rounded-full px-6 py-4">
            <Icon name="location-outline" />
            <ThemedText variant="h400">Barangay 4, San Nicolas</ThemedText>
          </ThemedView>
        </View>

        {/* Get Directions Button */}
        <View className="self-center">
          <ButtonText
            label="Get Directions"
            onPress={() => router.push(ROUTES.commuter.etaStop(id.toString()))}
            iconName="timer-outline"
          />
        </View>
      </View>
    </MapLayout>
  );
}
