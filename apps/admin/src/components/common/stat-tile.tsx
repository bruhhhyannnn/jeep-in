import { cn } from "@/lib";

interface StatTileProps {
  value: React.ReactNode;
  label: string;
  /** Small marker that ties the counter to the map key. */
  swatch?: React.ReactNode;
  className?: string;
}

export function StatTile({ value, label, swatch, className }: StatTileProps) {
  return (
    <div className={cn("rounded-card border-[1.5px] border-line bg-card p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[26px] leading-none font-extrabold text-ink tabular-nums">{value}</p>
        {swatch}
      </div>
      <p className="mt-2 text-[13px] font-medium text-ink-muted">{label}</p>
    </div>
  );
}
