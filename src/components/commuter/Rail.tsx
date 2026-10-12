import { View } from "react-native";
import { cn } from "@/lib/utils";

type RailProps = {
  /** Dashed when the list is a filtered subset, so the gaps read as skipped stops. */
  dashed?: boolean;
  children: React.ReactNode;
  className?: string;
};

/** Vertical timeline line on the left of a list. Rows place their own markers with RailMarker. */
export function Rail({ dashed = false, children, className }: RailProps) {
  return (
    <View className={cn("relative pl-7", className)}>
      {dashed ? (
        // Single-side dashed borders don't render reliably on Android, so draw the dashes.
        <View className="absolute bottom-6 left-[9px] top-6 w-0.5 gap-1.5 overflow-hidden">
          {Array.from({ length: 160 }, (_, i) => (
            <View key={i} className="h-1.5 w-0.5 bg-faint" />
          ))}
        </View>
      ) : (
        <View className="absolute bottom-6 left-[9px] top-6 w-0.5 bg-line-strong" />
      )}
      <View className="gap-2">{children}</View>
    </View>
  );
}

type RailMarkerProps = {
  /** ring: a stop · boarding: blue ring · alighting: blue square · jeep: yellow square · next: filled dot */
  kind: "ring" | "boarding" | "alighting" | "jeep" | "next";
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
          kind === "boarding" && "h-4 w-4 rounded-full border-[3.5px] border-action bg-card",
          kind === "alighting" && "h-4 w-4 rounded-[4px] border-[3px] border-action bg-card",
          kind === "jeep" && "h-3.5 w-3.5 rounded-[4px] bg-accent",
        )}
      />
    </View>
  );
}
