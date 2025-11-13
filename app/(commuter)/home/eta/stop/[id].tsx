import { ROUTES, STRINGS } from "@/constants";
import { MapLayout } from "@/components/layout";
import { StopCard, UserCard } from "@/components/commuter";
import { Icon, ThemedText } from "@/components/ui";
import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";
import { useRecenterToUser } from "@/hooks";

export default function EtaStopPointInfoScreen() {
  const { id } = useLocalSearchParams();
  const { recenterToUser } = useRecenterToUser();

  return (
    <MapLayout title={STRINGS.commuter.etaStopPointScreen.title}>
      <View className="gap-3">
        {/* Header Info */}
        <View className="flex-row items-center gap-2">
          <ThemedText variant="h600">{STRINGS.commuter.etaStopPointScreen.arrivingIn}</ThemedText>
          <ThemedText variant="h600" className="text-dodger-blue-600 dark:text-dodger-blue-600">
            3 mins.
          </ThemedText>
        </View>

        {/* Cards */}
        <View className="gap-3">
          {/* User Card */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.etaStopPointScreen.from}
            </ThemedText>
            <UserCard onPress={recenterToUser} />
          </View>

          {/* Icon Indicator */}
          <View className="items-center">
            <Icon name="arrow-down-circle-outline" size={26} />
          </View>

          {/* Stop Point Card */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.etaStopPointScreen.to}
            </ThemedText>
            <StopCard
              location={id.toString()}
              address="Batac City"
              onPress={() => router.push(ROUTES.commuter.stop(id.toString()))}
            />
          </View>
        </View>

        {/* Footer Text */}
        <ThemedText variant="h200" color="secondary" className="text-center">
          {STRINGS.commuter.etaStopPointScreen.footer}
        </ThemedText>
      </View>
    </MapLayout>
  );
}
