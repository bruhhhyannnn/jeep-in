import { ThemedText } from "@/components/ui";
import { cn } from "@/lib/utils";
import { JeepneyStatus } from "@/types";

type JeepStatusBadgeProps = {
  variant?: JeepneyStatus;
};

export default function JeepStatusBadge({ variant = "On route" }: JeepStatusBadgeProps) {
  const text = variant;
  const variantStyles = {
    "On route": "bg-dodger-blue-600",
    Stationed: "bg-warning-600",
    "Out of service": "bg-danger-600",
  };

  return (
    <ThemedText
      variant="h200"
      color="default_blue"
      className={cn("rounded-full px-2 py-0.5 text-center", variantStyles[variant])}
    >
      {text}
    </ThemedText>
  );
}
