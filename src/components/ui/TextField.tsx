import { useState, type InputHTMLAttributes, type Ref } from "react";
import { cn } from "@/lib/utils";
import { fonts, useTheme } from "@/theme";
import Icon, { type IconName } from "@/components/ui/Icon";
import Pressable from "@/components/ui/Pressable";
import View from "@/components/ui/View";

interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "autoCorrect"
> {
  value: string;
  onChangeText: (text: string) => void;
  iconName?: IconName;
  /** Shows a clear button while there is text. */
  onClear?: () => void;
  /** pill: search fields · box: form inputs */
  shape?: "pill" | "box";
  /** Turns off autocorrect, autocapitalise and spellcheck, e.g. for stop names. */
  autoCorrect?: boolean;
  accessibilityLabel?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

/** Rounded input; the border turns blue while focused. */
export default function TextField({
  value,
  onChangeText,
  iconName,
  onClear,
  shape = "pill",
  autoCorrect = true,
  accessibilityLabel,
  className,
  style,
  onFocus,
  onBlur,
  ref,
  ...rest
}: TextFieldProps) {
  const { colors, shadows } = useTheme();
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
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        aria-label={accessibilityLabel}
        autoCorrect={autoCorrect ? undefined : "off"}
        autoCapitalize={autoCorrect ? undefined : "off"}
        spellCheck={autoCorrect ? undefined : false}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className="h-full min-w-0 flex-1 bg-transparent text-ink outline-none"
        style={{
          fontFamily: fonts.medium,
          fontSize: "calc(15px * var(--text-scale))",
          caretColor: colors.action,
          ...style,
        }}
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
}
