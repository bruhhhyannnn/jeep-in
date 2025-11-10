import { TouchableOpacity } from "react-native";
import { ThemedView, ThemedText, Icon } from "@/components/shared";

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
          family="MaterialCommunityIcons"
          name={selected ? "radiobox-marked" : "radiobox-blank"}
          color="#1E90FF"
        />
      </ThemedView>
    </TouchableOpacity>
  );
}
