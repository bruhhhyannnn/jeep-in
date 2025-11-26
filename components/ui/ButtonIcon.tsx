import { TouchableOpacity } from "react-native";
import Icon from "@/components/ui/Icon";
import { useShadows } from "@/style/shadow";

type ButtonTextProps = {
  // also add family icon later here
  iconName: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function ButtonIcon({ iconName, onPress, disabled = false }: ButtonTextProps) {
  const shadows = useShadows();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={"w-fit rounded-full bg-neutral-bg-light-100 p-2.5 dark:bg-neutral-bg-dark-100"}
      style={shadows.card}
    >
      <Icon name={iconName} />
    </TouchableOpacity>
  );
}
