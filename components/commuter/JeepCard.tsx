import { TouchableOpacity } from "react-native";
import { ThemedText, ThemedView } from "@/components/shared";

type JeepCardProps = {
  plateNo: string;
  status: string;
  nextStop: string;
  onPress?: () => void;
};

export default function JeepCard({ plateNo, status, nextStop, onPress }: JeepCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView variant="bg_light" className="rounded-full px-6 py-2">
        <ThemedText variant="h500">{plateNo}</ThemedText>
        <ThemedText color="secondary">
          {status} — Next Stop: {nextStop}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}
