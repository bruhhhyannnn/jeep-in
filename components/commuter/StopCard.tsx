import { TouchableOpacity } from "react-native";
import { ThemedView, ThemedText } from "@/components/shared";

type StopCardProps = {
  name: string;
  location: string;
  onPress?: () => void;
};

export default function StopCard({ name, location, onPress }: StopCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView variant="bg_light" className="rounded-full px-6 py-2">
        <ThemedText variant="h400">{name}</ThemedText>
        <ThemedText color="secondary">{location}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}
