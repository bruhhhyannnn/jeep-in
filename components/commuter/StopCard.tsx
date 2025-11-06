import { TouchableOpacity } from "react-native";
import { ThemedView, ThemedText } from "@/components/shared";

type StopCardProps = {
  location: string;
  address: string;
  onPress?: () => void;
};

export default function StopCard({ location, address, onPress }: StopCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView variant="bg_light" className="rounded-full px-6 py-2">
        <ThemedText variant="h500">{location}</ThemedText>
        <ThemedText color="secondary">{address}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}
