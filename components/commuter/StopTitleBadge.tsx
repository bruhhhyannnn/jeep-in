import { ThemedText } from "@/components/shared";

type StopTitleBadgeProps = {
  title: string;
};

export default function StopTitleBadge({ title }: StopTitleBadgeProps) {
  return (
    <ThemedText
      variant="h200"
      color="primary"
      className="rounded-full bg-dodger-blue-500 px-2 py-0.5 text-center shadow-md"
    >
      {title}
    </ThemedText>
  );
}
