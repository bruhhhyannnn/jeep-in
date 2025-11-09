import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native";
import { cn } from "@/lib/utils";
import ThemedView from "@/components/shared/ThemedView";

interface SafeAreaContainerProps extends ViewProps {
  showPadding?: boolean;
  children: React.ReactNode;
}

export default function SafeAreaContainer({
  className,
  children,
  showPadding = true,
  ...props
}: SafeAreaContainerProps) {
  const paddingClass = showPadding ? "px-5" : "";

  return (
    <ThemedView className="flex-1">
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ paddingTop: 20 }}
        className={cn("flex-1", paddingClass, className)}
        {...props}
      >
        {children}
      </SafeAreaView>
    </ThemedView>
  );
}
