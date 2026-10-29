import { cn } from "../lib/utils";
import { useTheme } from "../theme";
import View, { type ViewProps } from "./View";

interface CardProps extends ViewProps {
  /** md for the main card on a screen, sm for everything else. */
  elevation?: "none" | "sm" | "md";
  dashed?: boolean;
  /** 2px blue border: the card that needs attention on this screen. */
  selected?: boolean;
  className?: string;
}

/** White card, 22 radius, hairline border, navy-tinted shadow. */
export default function Card({
  elevation = "sm",
  dashed = false,
  selected = false,
  className,
  style,
  children,
  ...props
}: CardProps) {
  const { shadows } = useTheme();

  return (
    <View
      style={{ ...(elevation !== "none" && !dashed ? shadows[elevation] : undefined), ...style }}
      className={cn(
        "rounded-card",
        !selected && "border-[1.5px]",
        dashed
          ? "border-line-strong border-dashed"
          : selected
            ? "border-action bg-card border-2"
            : "border-line bg-card",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
