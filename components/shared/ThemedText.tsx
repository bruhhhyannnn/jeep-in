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
  color?: "default" | "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}

export default function ThemedText({
  variant = "h200",
  color = "default",
  className,
  children,
  ...props
}: ThemedTextProps) {
  const variants = {
    hero10: "text-[55px] leading-[1.3] font-puffin-extrabold-italic",
    h900: "text-[50px] leading-[1.3] font-puffin-bold",
    h800: "text-[42px] leading-[1.3] font-puffin-bold",
    h700: "text-[34px] leading-[1.35] font-puffin-semibold",
    h600: "text-[27px] leading-[1.4] font-puffin-semibold",
    h500: "text-[22px] leading-[1.45] font-puffin-medium",
    h400: "text-[20px] leading-[1.45] font-puffin-medium",
    h300: "text-[17px] leading-[1.45] font-puffin-medium",
    h200: "text-[15px] leading-[1.4] font-puffin",
    h100: "text-[13px] leading-[1.3] font-puffin",
    h50: "text-[12px] leading-[1.2] font-puffin",
  };

  const colors = {
    default: "text-neutral-900 dark:text-neutral-50",
    primary: "text-dodger-blue-600 dark:text-dodger-blue-600",
    secondary: "text-neutral-600 dark:text-neutral-600",
  };

  return (
    <Text className={cn(variants[variant], colors[color], className)} {...props}>
      {children}
    </Text>
  );
}
