import React from "react";
import { TextInputProps } from "react-native";
import Icon from "@/components/ui/Icon";
import ThemedView from "@/components/ui/ThemedView";
import ThemedTextInput from "@/components/ui/ThemedTextInput";

interface CustomTextInputProps extends TextInputProps {
  iconName: string;
  containerClassName?: string;
}

export default function CustomTextInput({
  iconName,
  placeholder = "Search what?",
  containerClassName,
  style,
  ...rest
}: CustomTextInputProps) {
  return (
    <ThemedView
      variant="bg_light"
      className={`flex-row items-center gap-1 rounded-full px-4 ${containerClassName ?? ""}`}
    >
      <Icon name={iconName} color="#737373" size={18} />

      <ThemedTextInput placeholder={placeholder} style={[{ flex: 1 }, style]} {...rest} />
    </ThemedView>
  );
}
