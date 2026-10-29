import type { ButtonHTMLAttributes, CSSProperties, MouseEvent, Ref } from "react";
import { splitA11y, type AccessibilityProps } from "../lib/a11y";
import { cn } from "../lib/utils";

export interface PressableProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "role" | "type">,
    AccessibilityProps {
  onPress?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Extra tap area around the control, in px. */
  hitSlop?: number;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

/** React Native's Pressable as a button: keyboard-reachable, with the View layout defaults. */
export default function Pressable({
  onPress,
  hitSlop,
  disabled,
  className,
  style,
  ...props
}: PressableProps) {
  const { a11y, rest } = splitA11y(props);
  const { role, ...ariaRest } = a11y;

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      role={role === "button" ? undefined : role}
      className={cn("view", hitSlop ? "hit-slop" : null, className)}
      style={hitSlop ? ({ "--hit-slop": `${hitSlop}px`, ...style } as CSSProperties) : style}
      {...ariaRest}
      {...rest}
    />
  );
}
