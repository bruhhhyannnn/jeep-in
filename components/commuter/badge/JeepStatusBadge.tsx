import { ThemedText } from "@/components/ui";
import { cn } from "@/lib/utils";
import { JeepneyStatus } from "@/types";

type JeepCardProps = {
  status?: JeepneyStatus;
};

export default function JeepStatusBadge({ status = "On route" }: JeepCardProps) {
  const text = status;
  const variantStyles = {
    "On route": "bg-dodger-blue-500",
    Stationed: "bg-warning-500",
    "Out of service": "bg-danger-500",
  };

  return (
    <ThemedText
      variant="h200"
      color="primary"
      className={cn("rounded-full px-2 py-0.5 text-center shadow-md", variantStyles[status])}
    >
      {text}
    </ThemedText>
  );
}
