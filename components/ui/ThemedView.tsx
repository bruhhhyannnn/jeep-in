import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface ThemedViewProps extends ViewProps {
  variant?: "bg" | "bg_light";
  className?: string;
  children: React.ReactNode;
}

export default function ThemedView({
  variant = "bg",
  className,
  children,
  ...props
}: ThemedViewProps) {
  const variants = {
    bg: "bg-neutral-bg-light-100 dark:bg-neutral-bg-dark-100",
    bg_light: "bg-neutral-bg-light-200 dark:bg-neutral-bg-dark-200 shadow-lg",
  };

  return (
    <View className={cn(variants[variant], className)} {...props}>
      {children}
    </View>
  );
}
