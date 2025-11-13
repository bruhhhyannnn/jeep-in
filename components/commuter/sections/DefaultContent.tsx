import { ROUTES, STRINGS } from "@/constants";
import { View } from "react-native";
import { router } from "expo-router";
import { ThemedText, CustomTextInput } from "@/components/ui/";
import { JeepCard, StopCard } from "@/components/commuter/card";

export default function DefaultContent() {
  return (
    <View className="gap-4">
      {/* Search Bar */}
      <CustomTextInput placeholder={STRINGS.commuter.home.searchInput} iconName="search" />

      {/* Near Jeeps */}
      <View className="gap-2">
        <ThemedText variant="h400">{STRINGS.commuter.home.nearJeeps}</ThemedText>
        <View className="gap-2">
          {/* TODO: load actual jeeps here */}
          <JeepCard
            plateNo="IAE 2730"
            status="On route"
            nextStop="MMSU Gate 3"
            onPress={() => router.push(ROUTES.commuter.jeepney("IAE 2730"))}
          />
          <JeepCard
            plateNo="IAE 5012"
            status="Stationed"
            nextStop="Bingao Elementary & National High School"
            onPress={() => router.push(ROUTES.commuter.jeepney("IAE 5012"))}
          />
        </View>
      </View>

      {/* Near Stops */}
      <View className="gap-2">
        <ThemedText variant="h400">{STRINGS.commuter.home.nearStops}</ThemedText>
        <View className="gap-2">
          {/* TODO: load actual jeeps here */}
          <StopCard
            location="MMSU Gate 3"
            address="Batac City"
            onPress={() => router.push(ROUTES.commuter.stop("MMSU Gate 3"))}
          />
          <StopCard
            location="Bingao Elementary & National High School"
            address="Batac City"
            onPress={() =>
              router.push(ROUTES.commuter.stop("Bingao Elementary & National High School"))
            }
          />
        </View>
      </View>
    </View>
  );
}
