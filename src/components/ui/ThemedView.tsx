import { cn } from "@/lib/utils";
import View, { type ViewProps } from "@/components/ui/View";

interface ThemedViewProps extends ViewProps {
  /** page: every screen background · card: cards and sheets · sunken: inputs and tracks */
  variant?: "page" | "card" | "sunken" | "inverse";
  className?: string;
  children?: React.ReactNode;
}

const variants = {
  page: "bg-page",
  card: "bg-card",
  sunken: "bg-sunken",
  inverse: "bg-inverse",
};

export default function ThemedView({
  variant = "page",
  className,
  children,
  ...props
}: ThemedViewProps) {
  return (
    <View className={cn(variants[variant], className)} {...props}>
      {children}
    </View>
  );
}
