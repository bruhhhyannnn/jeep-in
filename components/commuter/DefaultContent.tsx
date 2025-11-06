import { View } from "react-native";
import { ThemedText, CustomTextInput } from "@/components/shared";
import JeepCard from "@/components/commuter/JeepCard";
import StopCard from "@/components/commuter/StopCard";

export default function DefaultContent() {
  return (
    <View className="gap-6">
      {/* Search Bar */}
      <CustomTextInput placeholder="Where are you going?" />

      {/* Near Jeeps */}
      <View className="gap-2">
        <ThemedText variant="h500">Nearby Jeepneys</ThemedText>
        <View className="gap-2">
          <JeepCard plateNo="IAE 2730" status="On Route" nextStop="MMSU Gate 3" />
          <JeepCard plateNo="IAE 5012" status="Stationed" nextStop="Paoay Terminal" />
        </View>
      </View>

      {/* Near Stops */}
      <View className="gap-2">
        <ThemedText variant="h500">Nearby Stops</ThemedText>
        <View className="gap-2">
          <StopCard name="MMSU Gate 3" location="Batac City" />
          <StopCard name="PhilRice Institute" location="Batac City" />
        </View>
      </View>
    </View>
  );
}
