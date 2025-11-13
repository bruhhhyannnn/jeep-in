import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainer, ThemedView, ButtonBack } from "@/components/ui";

export default function MapLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { top } = useSafeAreaInsets();

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      {/* Header */}
      <ThemedView
        style={{ paddingTop: top + 20 }}
        variant="bg_light"
        className="absolute left-0 right-0 flex-row items-center gap-3 rounded-b-2xl border-x border-b px-6 py-4"
      >
        <ButtonBack showIcon label={title} />
      </ThemedView>
      
      {/* Bottom Content */}
      <BottomSheetContainer>{children}</BottomSheetContainer>
    </View>
  );
}
