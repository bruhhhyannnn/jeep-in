import { View } from "react-native";
import {
  BottomSheetContainer,
  SafeAreaContainer,
  ThemedText,
  ThemedView,
  ButtonBack,
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
      <View className="flex-1">
        {/* TODO: add and validate for the map placeholder here */}
        <View className="flex-1 items-center justify-center bg-red-500">
          <ThemedText variant="h600" color="primary">
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
