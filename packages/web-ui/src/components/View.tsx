import type { HTMLAttributes, Ref } from "react";
import { splitA11y, type AccessibilityProps } from "../lib/a11y";
import { cn } from "../lib/utils";

export interface ViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role">, AccessibilityProps {
  className?: string;
  /** box-none: taps pass through the view but not its children · none: nothing inside is tappable. */
  pointerEvents?: "auto" | "box-none" | "none";
  ref?: Ref<HTMLDivElement>;
}

/** A div with React Native's View defaults: flex column, no shrink, relative. */
export default function View({ className, pointerEvents = "auto", ...props }: ViewProps) {
  const { a11y, rest } = splitA11y(props);
  return (
    <div
      className={cn(
        "view",
        pointerEvents === "box-none" && "pe-box-none",
        pointerEvents === "none" && "pointer-events-none",
        className,
      )}
      {...a11y}
      {...rest}
    />
  );
}
