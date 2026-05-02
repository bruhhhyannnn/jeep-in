import { Text, TextProps } from "react-native";
import { cn } from "@/lib/utils";

interface ThemedTextProps extends TextProps {
  variant?:
    | "hero10"
    | "h900"
    | "h800"
    | "h700"
    | "h600"
    | "h500"
    | "h400"
    | "h300"
    | "h200"
    | "h100"
    | "h50";
  color?: "text" | "text_muted" | "default_blue";
  className?: string;
  children: React.ReactNode;
}

export default function ThemedText({
  variant = "h200",
  color = "text",
  className,
  children,
  ...props
}: ThemedTextProps) {
  const variants = {
    hero10: "text-hero10 font-puffin-extrabold-italic",
    h900: "text-h900 font-puffin-bold",
    h800: "text-h800 font-puffin-bold",
    h700: "text-h700 font-puffin-semibold",
    h600: "text-h600 font-puffin-semibold",
    h500: "text-h500 font-puffin-medium",
    h400: "text-h400 font-puffin-medium",
    h300: "text-h300 font-puffin-medium",
    h200: "text-h200 font-puffin",
    h100: "text-h100 font-puffin",
    h50: "text-h50 font-puffin",
  };

  const colors = {
    text: "text-neutral-950 dark:text-neutral-50",
    text_muted: "text-neutral-500",
    default_blue: "text-dodger-blue-50",
  };

  return (
    <Text className={cn(variants[variant], colors[color], className)} {...props}>
      {children}
    </Text>
  );
}
