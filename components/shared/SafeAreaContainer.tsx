import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native";
import { cn } from "@/lib/utils";
import { ThemedView } from "@/components/shared";

export default function SafeAreaContainer({
  className,
  children,
  ...props
}: ViewProps & { children: React.ReactNode }) {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView
        edges={["top", "left", "right"]}
        className={cn("flex-1 p-5", className)}
        {...props}
      >
        {children}
      </SafeAreaView>
    </ThemedView>
  );
}
