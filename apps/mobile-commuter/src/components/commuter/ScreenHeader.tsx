import { View } from "react-native";
import { router } from "expo-router";
import { IconButton, ThemedText } from "@/components/ui";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** Shows a back button. */
  back?: boolean;
  right?: React.ReactNode;
};

/** Title row for full-page screens (Fare, Alerts, Settings). */
export default function ScreenHeader({ title, subtitle, back = false, right }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center gap-3">
      {back && (
        <IconButton iconName="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
      )}
      <View className="flex-1">
        <ThemedText variant="title" accessibilityRole="header">
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText variant="small" tone="muted">
            {subtitle}
          </ThemedText>
        )}
      </View>
      {right}
    </View>
  );
}
