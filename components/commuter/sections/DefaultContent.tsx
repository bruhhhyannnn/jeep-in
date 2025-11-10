import { View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText, CustomTextInput } from "@/components/shared/";
import { JeepCard, StopCard } from "@/components/commuter";

export default function DefaultContent() {
  const router = useRouter();

  return (
    <View className="gap-6">
      {/* Search Bar */}
      <CustomTextInput placeholder="Where are you going?" />

      {/* Near Jeeps */}
      <View className="gap-2">
        <ThemedText variant="h400">Nearby Jeepneys</ThemedText>
        <View className="gap-2">
          {/* TODO: load actual jeeps here */}
          <JeepCard
            plateNo="IAE 2730"
            status="On route"
            nextStop="MMSU Gate 3"
            onPress={() => router.push("/(commuter)/home/jeepney/IAE 2730")}
          />
          <JeepCard
            plateNo="IAE 5012"
            status="Stationed"
            nextStop="Bingao Elementary & National High School"
            onPress={() => router.push("/(commuter)/home/jeepney/IAE 5012")}
          />
        </View>
      </View>

      {/* Near Stops */}
      <View className="gap-2">
        <ThemedText variant="h400">Nearby Stops</ThemedText>
        <View className="gap-2">
          {/* TODO: load actual jeeps here */}
          <StopCard
            location="MMSU Gate 3"
            address="Batac City"
            onPress={() => router.push("/(commuter)/home/stop/MMSU Gate 3")}
          />
          <StopCard
            location="Bingao Elementary & National High School"
            address="Batac City"
            onPress={() =>
              router.push("/(commuter)/home/stop/Bingao Elementary & National High School")
            }
          />
        </View>
      </View>
    </View>
  );
}
