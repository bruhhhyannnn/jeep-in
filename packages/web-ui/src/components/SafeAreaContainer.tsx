import { cn } from "../lib/utils";
import { layout } from "../theme";
import ThemedView from "./ThemedView";
import View, { type ViewProps } from "./View";

interface SafeAreaContainerProps extends ViewProps {
  showPadding?: boolean;
  children: React.ReactNode;
}

/**
 * Full-page screen inside the notch and home-indicator insets. On wide screens
 * the column is capped at the 480px content width, as on a tablet.
 */
export default function SafeAreaContainer({
  className,
  children,
  showPadding = true,
  style,
  ...props
}: SafeAreaContainerProps) {
  const paddingClass = showPadding ? "px-5 pb-5 pt-3" : "";

  return (
    <ThemedView className="flex-1 items-center pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)]">
      <View
        style={{ maxWidth: layout.contentMaxWidth, ...style }}
        className={cn("w-full flex-1", paddingClass, className)}
        {...props}
      >
        {children}
      </View>
    </ThemedView>
  );
}
