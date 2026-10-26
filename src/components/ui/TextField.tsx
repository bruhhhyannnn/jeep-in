import { forwardRef, useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import { cn } from "@/lib/utils";
import { fonts, textScale, useTheme } from "@/theme";
import { usePreferences } from "@/store";
import Icon from "@/components/ui/Icon";

interface TextFieldProps extends TextInputProps {
  iconName?: string;
  /** Shows a clear button while there is text. */
  onClear?: () => void;
  /** pill: search fields · box: form inputs */
  shape?: "pill" | "box";
  className?: string;
}

/** Rounded input; the border turns blue while focused. */
const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    { iconName, onClear, shape = "pill", className, style, onFocus, onBlur, value, ...rest },
    ref,
  ) => {
    const { colors, shadows } = useTheme();
    const scale = textScale[usePreferences((s) => s.textSize)];
    const [focused, setFocused] = useState(false);

    return (
      <View
        style={shadows.sm}
        className={cn(
          "h-[52px] flex-row items-center gap-2.5 bg-card px-4",
          shape === "pill" ? "rounded-full" : "rounded-tile",
          focused ? "border-2 border-action" : "border-[1.5px] border-line-strong",
          className,
        )}
      >
        {iconName && <Icon name={iconName} size={18} tone={focused ? "action" : "muted"} />}
        <TextInput
          ref={ref}
          value={value}
          placeholderTextColor={colors.muted}
          selectionColor={colors.action}
          maxFontSizeMultiplier={1.6}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            { flex: 1, fontFamily: fonts.medium, fontSize: 15 * scale, color: colors.ink },
            style,
          ]}
          {...rest}
        />
        {onClear && !!value && (
          <Pressable
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Clear"
            hitSlop={12}
            className="h-6 w-6 items-center justify-center rounded-full bg-sunken"
          >
            <Icon name="close" size={14} tone="muted" />
          </Pressable>
        )}
      </View>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
