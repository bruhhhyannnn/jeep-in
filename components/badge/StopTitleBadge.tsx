import { ThemedText } from "@/components/ui";

type StopTitleBadgeProps = {
  title: string;
};

export default function StopTitleBadge({ title }: StopTitleBadgeProps) {
  return (
    <ThemedText
      variant="h200"
      color="default_blue"
      className="rounded-full bg-dodger-blue-500 px-2 py-0.5 text-center"
    >
      {title}
    </ThemedText>
  );
}
