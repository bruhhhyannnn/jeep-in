import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainer, ThemedView, ButtonBack, ButtonIcon } from "@/components/ui";
import { useMap } from "@/context/map/MapContext";

export default function MapLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  // Gets device top safe area for spacing floating buttons
  const { top } = useSafeAreaInsets();

  // Use Map functionalities
  const map = useMap();

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <View className="absolute right-6 top-40 gap-4">
        <ButtonIcon
          iconName="navigate-circle-outline"
          onPress={() => map.current.flyTo([120.55, 18.06], 1200)}
        />
      </View>

      {/* Header */}
      <ThemedView
        style={{ paddingTop: top + 14 }}
        className="absolute left-0 right-0 flex-row items-center gap-3 rounded-b-2xl border-x border-b px-6 py-4"
      >
        <ButtonBack showIcon label={title} />
      </ThemedView>

      {/* Bottom Content */}
      <BottomSheetContainer>{children}</BottomSheetContainer>
    </View>
  );
}
