import { ThemedText } from "@/components/ui";

type StopTitleBadgeProps = {
  title: string;
};

export default function StopTitleBadge({ title }: StopTitleBadgeProps) {
  return (
    <ThemedText
      variant="h200"
      color="default_blue"
      className="rounded-full bg-dodger-blue-500 px-1.5 text-center"
    >
      {title}
    </ThemedText>
  );
}
