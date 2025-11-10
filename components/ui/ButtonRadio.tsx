import { TouchableOpacity } from "react-native";
import ThemedView from "@/components/ui/ThemedView";
import ThemedText from "@/components/ui/ThemedText";
import Icon from "@/components/ui/Icon";

type ButtonRadioProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function ButtonRadio({ label, selected, onPress }: ButtonRadioProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        variant="bg_light"
        className="flex-row items-center justify-between rounded-full px-6 py-4 shadow-lg"
      >
        <ThemedText>{label}</ThemedText>

        <Icon
          name={selected ? "radio-button-on-outline" : "radio-button-off-outline"}
          color="#1E90FF"
        />
      </ThemedView>
    </TouchableOpacity>
  );
}
