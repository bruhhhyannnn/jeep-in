import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainer, ThemedView, ButtonBack } from "@/components/ui";

export default function ContentLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  // Gets device top safe area for spacing floating buttons
  const { top } = useSafeAreaInsets();

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      {/* Header */}
      <ThemedView
        style={{ paddingTop: top + 14 }}
        className="absolute left-0 right-0 flex-row items-center gap-3 rounded-b-2xl border-x border-b border-neutral-300 px-6 py-4 dark:border-neutral-700"
      >
        <ButtonBack showIcon label={title} />
      </ThemedView>

      {/* Bottom Content */}
      <BottomSheetContainer>{children}</BottomSheetContainer>
    </View>
  );
}
