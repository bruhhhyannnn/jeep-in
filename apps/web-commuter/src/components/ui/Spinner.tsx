import { cn } from "@/lib/utils";

type SpinnerProps = {
  color: string;
  /** small: 20px, as React Native's ActivityIndicator · large: 36px */
  size?: "small" | "large";
  className?: string;
};

/** React Native's ActivityIndicator: a spinning ring in the given colour. */
export default function Spinner({ color, size = "small", className }: SpinnerProps) {
  const px = size === "small" ? 20 : 36;
  return (
    <span
      role="progressbar"
      aria-busy
      aria-label="Loading"
      className={cn("inline-block self-center rounded-full", className)}
      style={{
        width: px,
        height: px,
        border: `${size === "small" ? 2.5 : 3.5}px solid ${color}`,
        borderTopColor: "transparent",
        animation: "spin 800ms linear infinite",
      }}
    />
  );
}
