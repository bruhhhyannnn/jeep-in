import React from "react";
import { ViewProps } from "react-native";
import Icon from "@/components/ui/Icon";
import ThemedView from "@/components/ui/ThemedView";
import ThemedTextInput from "@/components/ui/ThemedTextInput";

interface CustomTextInputProps extends ViewProps {
  iconName: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

export default function CustomTextInput({
  placeholder = "Search what?",
  onChangeText,
  value,
  iconName,
  className,
  ...props
}: CustomTextInputProps) {
  return (
    <ThemedView
      variant="bg_light"
      className={`flex-row items-center gap-1 rounded-full px-4 ${className ?? ""}`}
      {...props}
    >
      <Icon name={iconName} color="#737373" size={18} />
      <ThemedTextInput
        placeholder={placeholder}
        returnKeyType="search"
        value={value}
        onChangeText={onChangeText}
        style={{ flex: 1 }}
      />
    </ThemedView>
  );
}
