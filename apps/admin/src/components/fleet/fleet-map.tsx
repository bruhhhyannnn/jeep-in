"use client";

import { useEffect } from "react";
import { cn, formatDirection, timeAgo } from "@/lib";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  StatusChip,
  useMap,
} from "@/components/ui";
import type { StopPoint } from "@/types";
import { driverName, type FleetUnit } from "./fleet-state";

const DEFAULT_CENTER: [number, number] = [120.551474, 18.058174];
const DEFAULT_ZOOM = 13.5;

interface FleetMapProps {
  units: FleetUnit[];
  stops: StopPoint[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
  now: number;
  /** Shown over the map when there is nothing moving. */
  emptyState?: { title: string; description: string } | null;
}

export function FleetMap({ units, stops, selectedKey, onSelect, now, emptyState }: FleetMapProps) {
  const placed = units.filter((u) => u.location);

  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-card border-[1.5px] border-line bg-card shadow-sm">
      <Map center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
        <MapControls position="top-right" showZoom showLocate showFullscreen />

        {stops.map((stop) => (
          <MapMarker key={stop.id} longitude={stop.longitude} latitude={stop.latitude}>
            <MarkerContent>
              <span className="block h-3.5 w-3.5 rounded-full border-[3px] border-ink-mark bg-card shadow-sm" />
            </MarkerContent>
            <MarkerTooltip>
              <span className="font-semibold">{stop.name}</span>
              <span className="opacity-70"> · {formatDirection(stop.routeDirection)}</span>
            </MarkerTooltip>
          </MapMarker>
        ))}

        {placed.map((unit) => {
          const loc = unit.location!;
          const selected = unit.key === selectedKey;
          const stale = unit.state === "stale";
          const label = unit.jeepney ? unit.jeepney.jeepneyNumber : "—";
          return (
            <MapMarker key={unit.key} longitude={loc.longitude} latitude={loc.latitude}>
              <MarkerContent>
                <button
                  type="button"
                  onClick={() => onSelect(selected ? null : unit.key)}
                  aria-label={`Unit ${label}${unit.jeepney ? `, ${unit.jeepney.plateNumber}` : ""}`}
                  className="relative flex cursor-pointer items-center justify-center"
                >
                  {!stale && (
                    <span className="absolute h-9 w-9 animate-pulse-ring rounded-[11px] bg-moment/50" />
                  )}
                  <span
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-[11px] font-data text-[11px] font-bold transition-transform duration-200",
                      stale
                        ? "border-2 border-dashed border-stale bg-card text-ink-muted"
                        : "border-[3px] border-white bg-moment text-on-moment shadow-md",
                      selected &&
                        "scale-115 ring-[3px] ring-action ring-offset-2 ring-offset-transparent",
                    )}
                  >
                    J{label}
                  </span>
                </button>
              </MarkerContent>
              <MarkerTooltip>
                {unit.jeepney
                  ? `J${unit.jeepney.jeepneyNumber} · ${unit.jeepney.plateNumber}`
                  : "No unit"}
              </MarkerTooltip>
              <MarkerPopup offset={24} className="w-56 max-w-none rounded-tile border-line">
                <p className="font-data text-[14px] font-bold text-ink">
                  {unit.jeepney ? unit.jeepney.plateNumber : "No unit assigned"}
                </p>
                <p className="mt-0.5 text-[13px] text-ink-muted">
                  {unit.jeepney ? `Unit J${unit.jeepney.jeepneyNumber} · ` : ""}
                  {driverName(unit.driver)}
                </p>
                <div className="mt-2.5">
                  {stale ? (
                    <StatusChip tone="stale">
                      Last seen {timeAgo(unit.lastSeen, now)} ago
                    </StatusChip>
                  ) : (
                    <StatusChip tone="live" dot>
                      Live{unit.lastSeen ? ` · ${timeAgo(unit.lastSeen, now)} ago` : ""}
                    </StatusChip>
                  )}
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}

        <FlyToSelected units={placed} selectedKey={selectedKey} />
      </Map>

      {emptyState && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
          <div className="w-full max-w-[320px] rounded-tile border-[1.5px] border-line bg-card p-4 text-center shadow-md">
            <p className="text-[15px] font-bold text-ink">{emptyState.title}</p>
            <p className="mt-1 text-[13px] leading-snug text-ink-muted">{emptyState.description}</p>
          </div>
        </div>
      )}

      <MapKey />
    </div>
  );
}

/** The key is not a filter: its swatches are the exact marker styles. */
function MapKey() {
  return (
    <div className="absolute bottom-3 left-3 z-10 flex max-w-[calc(100%-24px)] flex-wrap items-center gap-x-4 gap-y-2 rounded-tile border-[1.5px] border-line bg-card/95 px-3.5 py-2.5 shadow-sm">
      <span className="eyebrow">Key</span>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
        <span className="h-4 w-4 rounded-[5px] border-2 border-white bg-moment shadow-sm" />
        Sharing live
      </span>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
        <span className="h-4 w-4 rounded-[5px] border-[1.5px] border-dashed border-stale bg-card" />
        Last known · no signal
      </span>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
        <span className="h-3 w-3 rounded-full border-[3px] border-ink-mark bg-card" />
        Stop
      </span>
    </div>
  );
}

function FlyToSelected({ units, selectedKey }: { units: FleetUnit[]; selectedKey: string | null }) {
  const { map, isLoaded } = useMap();
  const target = units.find((u) => u.key === selectedKey)?.location;
  const lng = target?.longitude;
  const lat = target?.latitude;

  useEffect(() => {
    if (!map || !isLoaded || lng === undefined || lat === undefined) return;
    map.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 15), duration: 800 });
    // Only fly when the selection changes, not on every position update.
  }, [selectedKey, map, isLoaded]);

  return null;
}
