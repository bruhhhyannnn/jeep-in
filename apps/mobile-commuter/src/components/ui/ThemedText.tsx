import { Text, TextProps } from "react-native";
import { cn } from "@/lib/utils";
import { textScale, typeRoles, type TypeRole } from "@/theme";
import { usePreferences } from "@/store";

export type TextTone =
  | "ink"
  | "muted"
  | "faint"
  | "action"
  | "actionInk"
  | "onInverse"
  | "onInverseMuted"
  | "onBlueMuted"
  | "accent"
  | "accentInk"
  | "live"
  | "danger"
  | "warn";

const tones: Record<TextTone, string> = {
  ink: "text-ink",
  muted: "text-muted",
  faint: "text-faint",
  action: "text-action",
  actionInk: "text-action-ink",
  onInverse: "text-white",
  onInverseMuted: "text-navy-200",
  onBlueMuted: "text-blue-200",
  accent: "text-accent",
  accentInk: "text-accent-ink",
  live: "text-live-ink",
  danger: "text-danger-ink",
  warn: "text-warn-ink",
};

interface ThemedTextProps extends TextProps {
  variant?: TypeRole;
  tone?: TextTone;
  className?: string;
  children: React.ReactNode;
}

/** Text in one of the hi-fi type roles, scaled by the Text size setting. */
export default function ThemedText({
  variant = "body",
  tone = "ink",
  className,
  style,
  children,
  ...props
}: ThemedTextProps) {
  const scale = textScale[usePreferences((s) => s.textSize)];
  const role = typeRoles[variant];
  const sized =
    scale === 1
      ? role
      : { ...role, fontSize: role.fontSize * scale, lineHeight: role.lineHeight * scale };

  return (
    <Text
      maxFontSizeMultiplier={1.6}
      className={cn(tones[tone], className)}
      style={[sized, style]}
      {...props}
    >
      {children}
    </Text>
  );
}
