"use client";

import { cn, timeAgo } from "@/lib";
import { Spinner } from "@/components/ui";
import { UnitTile } from "@/components/common";
import { driverName, type FleetUnit } from "./fleet-state";

interface UnitRailProps {
  units: FleetUnit[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
  now: number;
  /** Outside shift hours the list shows roster status instead of live state. */
  inShift: boolean;
  statusLine: React.ReactNode;
  loading?: boolean;
}

/** Answers who-drives-what without clicking a marker. */
export function UnitRail({
  units,
  selectedKey,
  onSelect,
  now,
  inShift,
  statusLine,
  loading,
}: UnitRailProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3 px-1">
        <h2 className="text-[15px] font-bold text-ink">Active units</h2>
        {statusLine}
      </div>

      <div className="custom-scrollbar -mx-1 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 pb-1">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : units.length === 0 ? (
          <div className="rounded-card border-[1.5px] border-dashed border-line-strong p-5 text-center">
            <p className="text-[14px] font-bold text-ink">No units match</p>
            <p className="mt-1 text-[13px] text-ink-muted">
              Add jeepney units, then assign drivers to see them here.
            </p>
          </div>
        ) : (
          units.map((unit) => (
            <UnitRow
              key={unit.key}
              unit={unit}
              now={now}
              inShift={inShift}
              selected={unit.key === selectedKey}
              onClick={() => onSelect(unit.key === selectedKey ? null : unit.key)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function UnitRow({
  unit,
  now,
  inShift,
  selected,
  onClick,
}: {
  unit: FleetUnit;
  now: number;
  inShift: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const { state } = unit;
  const tileState = !inShift
    ? "idle"
    : state === "live"
      ? "live"
      : state === "stale"
        ? "stale"
        : state === "no-driver"
          ? "empty"
          : "idle";

  const stateText = !inShift
    ? unit.driver
      ? "On roster"
      : "No driver"
    : state === "live"
      ? `Live · ${timeAgo(unit.lastSeen, now)}`
      : state === "stale"
        ? `Seen ${timeAgo(unit.lastSeen, now)} ago`
        : state === "off"
          ? "GPS off"
          : "No driver";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-full bg-card p-1.5 pr-4 text-left transition-[border-color,box-shadow] duration-150",
        selected
          ? "border-2 border-action shadow-md"
          : "border-[1.5px] border-line shadow-sm hover:border-line-strong",
      )}
    >
      <UnitTile number={unit.jeepney?.jeepneyNumber} state={tileState} className="rounded-full" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-data text-[13px] font-bold text-ink">
          {unit.jeepney?.plateNumber ?? "No unit"}
        </span>
        <span className="block truncate text-[12px] text-ink-muted">
          {unit.driver ? driverName(unit.driver) : "No driver assigned"}
        </span>
      </span>
      <span
        className={cn(
          "shrink-0 font-data text-[11px] font-semibold",
          inShift && state === "live" ? "text-live-ink" : "text-ink-muted",
        )}
      >
        {stateText}
      </span>
    </button>
  );
}
