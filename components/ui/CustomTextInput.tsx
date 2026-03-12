import { TextInputProps } from "react-native";
import Icon from "@/components/ui/Icon";
import ThemedView from "@/components/ui/ThemedView";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { useShadows } from "@/style/shadow";

interface CustomTextInputProps extends TextInputProps {
  iconName: string;
  variant?: "bg" | "bg_light";
}

export default function CustomTextInput({
  iconName,
  variant = "bg_light",
  placeholder = "Search what?",
  style,
  ...rest
}: CustomTextInputProps) {
  const shadows = useShadows();

  return (
    <ThemedView
      variant={variant}
      className="flex-row items-center gap-1 rounded-full px-4"
      style={shadows.card}
    >
      <Icon name={iconName} color="#737373" size={18} />

      <ThemedTextInput placeholder={placeholder} style={[{ flex: 1 }, style]} {...rest} />
    </ThemedView>
  );
}
