import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export default function SafeAreaContainer({
  className,
  children,
  ...props
}: ViewProps & { children: React.ReactNode }) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className={cn("flex-1 bg-dodger-blue-bg-light-50 p-5 dark:bg-neutral-bg-dark-100", className)}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}
