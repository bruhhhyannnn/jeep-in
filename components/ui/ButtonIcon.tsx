import { TouchableOpacity } from "react-native";
import Icon from "@/components/ui/Icon";

type ButtonTextProps = {
  // also add family icon later here
  iconName: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function ButtonIcon({ iconName, onPress, disabled = false }: ButtonTextProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={
        "w-fit rounded-full bg-neutral-bg-light-200 p-2.5 active:opacity-70 dark:bg-neutral-bg-dark-200"
      }
      style={{
        shadowColor: "#0A0A0A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6, // Android
      }}
    >
      <Icon name={iconName} />
    </TouchableOpacity>
  );
}
