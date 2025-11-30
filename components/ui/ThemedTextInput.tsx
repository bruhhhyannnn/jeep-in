import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

export default function ThemedTextInput(props: TextInputProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        {
          color: isDark ? "#FAFAFA" : "#171717",
        },
        props.style,
      ]}
      placeholderTextColor="#737373"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: "Puffin-Medium",
    width: "92%",
  },
});
