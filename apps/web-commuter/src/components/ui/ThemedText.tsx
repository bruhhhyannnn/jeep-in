import type { CSSProperties, HTMLAttributes } from "react";
import { splitA11y, type AccessibilityProps } from "@/lib/a11y";
import { cn } from "@/lib/utils";
import { typeRoles, type TypeRole } from "@/theme";

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

const clamps: Record<number, string> = {
  1: "truncate",
  2: "line-clamp-2",
  3: "line-clamp-3",
};

interface ThemedTextProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "role">, AccessibilityProps {
  variant?: TypeRole;
  tone?: TextTone;
  /** Cuts the text off with an ellipsis after this many lines. */
  numberOfLines?: 1 | 2 | 3;
  className?: string;
  children: React.ReactNode;
}

/** Size in px times the Text size setting (--text-scale on <html>). */
const scaled = (px: number) => `calc(${px}px * var(--text-scale))`;

/** Text in one of the hi-fi type roles, scaled by the Text size setting. */
export default function ThemedText({
  variant = "body",
  tone = "ink",
  numberOfLines,
  className,
  style,
  children,
  ...props
}: ThemedTextProps) {
  const role = typeRoles[variant];
  const sized: CSSProperties = {
    fontFamily: role.fontFamily,
    fontSize: scaled(role.fontSize),
    lineHeight: scaled(role.lineHeight),
    letterSpacing: "letterSpacing" in role ? role.letterSpacing : undefined,
    textTransform: "textTransform" in role ? role.textTransform : undefined,
  };

  // Screen titles are real headings rather than a role on a span.
  const header = props.accessibilityRole === "header";
  const { a11y, rest } = splitA11y(header ? { ...props, accessibilityRole: undefined } : props);
  const Tag = header ? "h1" : "span";

  return (
    <Tag
      className={cn("text", tones[tone], numberOfLines && clamps[numberOfLines], className)}
      style={{ ...sized, ...style }}
      {...a11y}
      {...rest}
    >
      {children}
    </Tag>
  );
}
