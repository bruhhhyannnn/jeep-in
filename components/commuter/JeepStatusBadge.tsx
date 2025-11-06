import { ThemedText } from "@/components/shared";
import { cn } from "@/lib/utils";

export type JeepStatus = "On route" | "Stationed" | "Out of service";

type JeepCardProps = {
  variant?: JeepStatus;
};

export default function JeepStatusBadge({ variant = "On route" }: JeepCardProps) {
  const text = variant;
  const variantStyles = {
    "On route": "bg-dodger-blue-500",
    Stationed: "bg-warning-500",
    "Out of service": "bg-danger-500",
  };

  return (
    <ThemedText
      variant="h100"
      color="primary"
      className={cn("rounded-full px-2 py-0.5 text-center shadow-md", variantStyles[variant])}
    >
      {text}
    </ThemedText>
  );
}
