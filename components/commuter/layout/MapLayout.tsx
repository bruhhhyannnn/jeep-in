import { View } from "react-native";
import {
  BottomSheetContainer,
  SafeAreaContainer,
  ThemedText,
  ThemedView,
  ButtonBack,
  MapContainer,
} from "@/components/shared";

export default function MapLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaContainer showPadding={false}>
      <View className="flex-1 bg-neutral-300 dark:bg-black">
        {/* Map Area */}
        <MapContainer>
          {/* TODO: just a placeholder, remove it once MapboxMap is now available */}
          <View className="flex-1 items-center justify-center">
            <ThemedText variant="h600">Mapbox Map will go here</ThemedText>
          </View>
        </MapContainer>

        {/* Header */}
        <ThemedView className="absolute left-0 right-0 top-0 flex-row items-center gap-3 rounded-b-2xl border-x border-b border-neutral-300 px-5 py-4 dark:border-neutral-700">
          <ButtonBack showIcon label={title} />
        </ThemedView>

        {/* Bottom Content */}
        <BottomSheetContainer>{children}</BottomSheetContainer>
      </View>
    </SafeAreaContainer>
  );
}
