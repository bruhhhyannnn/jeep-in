import { View } from "react-native";
import {
  BottomSheetContainer,
  SafeAreaContainer,
  ThemedText,
  ThemedView,
} from "@/components/shared";
import ButtonBack from "@/components/shared/ButtonBack";

export default function MapLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaContainer showPadding={false}>
      <View className="flex-1">
        {/* Map Placeholder */}
        <View className="flex-1 items-center justify-center bg-black">
          <ThemedText variant="h600" color="secondary">
            Mapbox Map will go here
          </ThemedText>
        </View>

        {/* Header */}
        <ThemedView className="absolute left-0 right-0 top-0 flex-row items-center gap-3 rounded-b-2xl border-x border-b border-neutral-300 px-5 py-4 dark:border-neutral-700">
          <ButtonBack showIcon label={title} />
        </ThemedView>

        {/* Bottom Content */}
        <BottomSheetContainer snapPoints={["10%", "37%", "91%"]}>{children}</BottomSheetContainer>
      </View>
    </SafeAreaContainer>
  );
}
