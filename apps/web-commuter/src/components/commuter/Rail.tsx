import { cn } from "@/lib/utils";
import { View } from "@/components/ui";

type RailProps = {
  /** Dashed when the list is a filtered subset, so the gaps read as skipped stops. */
  dashed?: boolean;
  /** Lighter line, for a rail inside a card. */
  subtle?: boolean;
  children: React.ReactNode;
  className?: string;
};

/** Vertical timeline line on the left of a list. Rows place their own markers with RailMarker. */
export function Rail({ dashed = false, subtle = false, children, className }: RailProps) {
  return (
    <View className={cn("relative pl-7", className)}>
      {dashed ? (
        // 6px dashes with 6px gaps, as the native app draws them.
        <View
          className="absolute bottom-6 left-[9px] top-6 w-0.5"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgb(var(--muted)) 0 6px, transparent 6px 12px)",
          }}
        />
      ) : (
        <View
          className={cn(
            "absolute bottom-6 left-[9px] top-6 w-0.5",
            subtle ? "bg-line" : "bg-faint",
          )}
        />
      )}
      <View className="gap-2">{children}</View>
    </View>
  );
}

type RailMarkerProps = {
  /**
   * ring: a stop · boarding: blue ring · alighting: blue square · jeep: yellow square ·
   * next / here: filled dot · result: small blue ring for search results
   */
  kind: "ring" | "boarding" | "alighting" | "jeep" | "next" | "here" | "result";
};

/** Marker sitting on the rail, vertically centred on its row. */
export function RailMarker({ kind }: RailMarkerProps) {
  return (
    <View
      pointerEvents="none"
      className="absolute -left-7 bottom-0 top-0 w-5 items-center justify-center"
    >
      <View
        className={cn(
          "border-page",
          kind === "ring" && "h-3.5 w-3.5 rounded-full border-[2.5px] border-line-strong bg-card",
          kind === "next" && "h-3.5 w-3.5 rounded-full bg-inverse",
          kind === "here" && "h-4 w-4 rounded-full border-[3px] border-action bg-action",
          kind === "result" && "h-3.5 w-3.5 rounded-full border-[2.5px] border-action bg-card",
          kind === "boarding" && "h-4 w-4 rounded-full border-[3.5px] border-action bg-card",
          kind === "alighting" && "h-4 w-4 rounded-[4px] border-[3px] border-action bg-card",
          kind === "jeep" && "h-3.5 w-3.5 rounded-[4px] bg-accent",
        )}
      />
    </View>
  );
}
