import { TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";
import ThemedText from "@/components/ui/ThemedText";
import Icon from "@/components/ui/Icon";

type ButtonTextProps = {
  label: string;
  onPress: () => void;
  // * primary: default blue;
  // * secondary: go back or cancel;
  // ! tertiary: settings buttons;  remove this ASAP and just use secondary!
  variant?: "primary" | "secondary" | "tertiary";
  // TODO: will be adding family icons here
  iconName?: string;
  disabled?: boolean;
  showChevron?: boolean;
  fullWidth?: boolean;
};

export default function ButtonText({
  label,
  onPress,
  variant = "primary",
  iconName,
  disabled = false,
  showChevron = false,
  fullWidth = false,
}: ButtonTextProps) {
  const baseStyle =
    "flex-row items-center justify-center gap-2 rounded-full px-4 py-2 active:opacity-70";

  const styles = cn(
    baseStyle,
    getBackgroundColor(variant),
    disabled && "opacity-50",
    showChevron ? "justify-between" : "justify-center",
    fullWidth ? "w-full" : "",
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={styles}
      style={[
        {
          shadowColor: "#0A0A0A",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          // only primary and secondary has shadow
          elevation: variant === "primary" || variant === "tertiary" ? 4 : 0,
        },
        !fullWidth && { alignSelf: "flex-start" },
      ]}
    >
      <View className="flex-row items-center justify-center gap-2">
        {iconName && <Icon name={iconName} color={getIconColor(variant)} />}
        <ThemedText variant="h400" color={getTextColor(variant)}>
          {label}
        </ThemedText>
      </View>
      {showChevron && <Icon name="chevron-forward" color={getIconColor(variant)} />}
    </TouchableOpacity>
  );
}

// TODO: will change the type here someday to be a global type of the button types someday
function getBackgroundColor(variant: string) {
  switch (variant) {
    case "primary":
      return "bg-dodger-blue-600";
    case "secondary":
      return "bg-neutral-300 dark:bg-neutral-800";
    case "tertiary":
      return "bg-neutral-bg-light-200 dark:bg-neutral-bg-dark-200 px-6 py-4";
    default:
      return "bg-dodger-blue-600";
  }
}

function getTextColor(variant: string) {
  switch (variant) {
    case "primary":
      return "primary";
    case "secondary":
      return "secondary";
    case "tertiary":
      return "default";
    default:
      return "primary";
  }
}

function getIconColor(variant: string) {
  switch (variant) {
    case "primary":
      return "#edf9ff";
    case "secondary":
      return "#737373";
    case "tertiary":
      return;
    default:
      return "#737373";
  }
}
