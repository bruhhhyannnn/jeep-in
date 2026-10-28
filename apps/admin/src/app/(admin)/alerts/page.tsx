"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPinOff, Phone, UserRoundPlus } from "lucide-react";
import { format, isSameDay } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { distanceKm } from "@jeep-in/core/geo";
import { formatDistance } from "@jeep-in/core/format";
import type { DriverReport, ReportReason, StopPoint } from "@jeep-in/core/model";
import { reportReasons } from "@jeep-in/core/strings";
import {
  Button,
  DataTable,
  Map as MapView,
  MapControls,
  MapMarker,
  MarkerContent,
  PageError,
  PanelActionRow,
  PanelValue,
  SidePanel,
  StatusChip,
  type ChipTone,
} from "@/components/ui";
import {
  Avatar,
  FilterChips,
  Notice,
  OrgPicker,
  PageHeader,
  SearchField,
  UnitTile,
} from "@/components/common";
import {
  useDriverReports,
  useDrivers,
  useJeepneys,
  useNow,
  useOrgScope,
  useOrganization,
  useRoute,
  useStopPoints,
} from "@/hooks";
import { directionLabel, timeAgo } from "@/lib";
import type { DriverProfile, Jeepney, RouteDirection } from "@/types";

type ReasonFilter = "all" | ReportReason;

const REASONS = Object.keys(reportReasons) as ReportReason[];

/** Reports that stop the trip are red; ones that slow it are amber. */
const REASON_TONE: Record<ReportReason, ChipTone> = {
  breakdown: "error",
  accident: "error",
  road_blocked: "pending",
  heavy_traffic: "pending",
  other: "neutral",
};

const fullName = (d: DriverProfile) => `${d.firstName} ${d.lastName}`;

/** "9:36 AM" today, "Oct 27, 9:36 AM" before that. */
const sentAt = (ms: number | null, now: number) =>
  ms == null ? "—" : format(ms, isSameDay(ms, now) ? "h:mm a" : "MMM d, h:mm a");

/** The stop closest to where the driver was when they sent the report. */
function nearestStop(report: DriverReport, stops: StopPoint[]) {
  if (report.lat == null || report.long == null) return null;
  let best: { stop: StopPoint; km: number } | null = null;
  for (const stop of stops) {
    const km = distanceKm(report.lat, report.long, stop.lat, stop.long);
    if (!best || km < best.km) best = { stop, km };
  }
  return best;
}

function nearLabel(report: DriverReport, stops: StopPoint[]) {
  if (report.lat == null || report.long == null) return "No position sent";
  const near = nearestStop(report, stops);
  if (!near) return `${report.lat.toFixed(4)}, ${report.long.toFixed(4)}`;
  return near.km < 0.15
    ? `At ${near.stop.name}`
    : `${formatDistance(near.km)} from ${near.stop.name}`;
}

export default function AlertsPage() {
  const { orgId } = useOrgScope();
  const { data: org } = useOrganization(orgId || undefined);
  const routeId = org?.routeId ?? "";
  const { data: route } = useRoute(routeId || undefined);
  const { data: stops = [] } = useStopPoints(routeId || undefined);

  const { data: reports = [], isPending, error } = useDriverReports(orgId);
  const { data: jeepneys = [] } = useJeepneys(orgId);
  const { data: drivers = [] } = useDrivers(orgId);
  const jeepneyById = new Map(jeepneys.map((j) => [j.id, j]));
  const driverById = new Map(drivers.map((d) => [d.uid, d]));
  const now = useNow(60_000);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ReasonFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const directions = route?.directions ?? [];
  const activeStops = stops.filter((s) => s.isActive);
  const today = reports.filter((r) => r.createdAt != null && isSameDay(r.createdAt, now)).length;
  const counts = Object.fromEntries(
    REASONS.map((reason) => [reason, reports.filter((r) => r.reason === reason).length]),
  ) as Record<ReportReason, number>;

  const unitOf = (r: DriverReport) => jeepneyById.get(r.jeepneyId);
  const driverOf = (r: DriverReport) => driverById.get(r.driverId);

  const q = query.trim().toLowerCase();
  const filtered = reports
    .filter((r) => filter === "all" || r.reason === filter)
    .filter((r) => {
      if (!q) return true;
      const unit = unitOf(r);
      const driver = driverOf(r);
      return `${r.unit} ${unit?.plateNumber ?? ""} ${driver ? fullName(driver) : ""} ${r.note ?? ""}`
        .toLowerCase()
        .includes(q);
    });

  const columns: ColumnDef<DriverReport, unknown>[] = [
    {
      id: "reason",
      header: "Reason",
      accessorFn: (r) => reportReasons[r.reason].title,
      cell: ({ row: { original: r } }) => (
        <StatusChip tone={REASON_TONE[r.reason]}>{reportReasons[r.reason].title}</StatusChip>
      ),
    },
    {
      id: "note",
      header: "Driver's note",
      accessorFn: (r) => r.note ?? "",
      enableSorting: false,
      cell: ({ row: { original: r } }) =>
        r.note ? (
          <p className="line-clamp-2 max-w-[280px] text-[13px] text-ink">“{r.note}”</p>
        ) : (
          <span className="text-[13px] text-ink-muted italic">No note</span>
        ),
    },
    {
      id: "unit",
      header: "Unit",
      accessorFn: (r) => unitOf(r)?.plateNumber ?? r.unit,
      cell: ({ row: { original: r } }) => {
        const unit = unitOf(r);
        return (
          <div className="flex items-center gap-2.5">
            <UnitTile number={unit?.jeepneyNumber ?? r.unit} size="sm" />
            <span className="font-data text-[13px] font-semibold text-ink">
              {unit?.plateNumber ?? "Unit removed"}
            </span>
          </div>
        );
      },
    },
    {
      id: "driver",
      header: "Driver",
      accessorFn: (r) => {
        const d = driverOf(r);
        return d ? fullName(d) : "";
      },
      cell: ({ row: { original: r } }) => {
        const d = driverOf(r);
        return d ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={fullName(d)} />
            <span className="font-semibold text-ink">{fullName(d)}</span>
          </div>
        ) : (
          <span className="text-ink-muted italic">Not on record</span>
        );
      },
    },
    {
      id: "near",
      header: "Near",
      accessorFn: (r) => nearLabel(r, activeStops),
      enableSorting: false,
      cell: ({ row: { original: r } }) => (
        <span className="text-[13px] text-ink-muted">{nearLabel(r, activeStops)}</span>
      ),
    },
    {
      id: "sent",
      header: "Sent",
      accessorFn: (r) => r.createdAt ?? 0,
      cell: ({ row: { original: r } }) => (
        <span className="font-data text-[13px] text-ink-muted">{sentAt(r.createdAt, now)}</span>
      ),
    },
    {
      id: "open",
      header: () => <span className="sr-only">Open</span>,
      enableSorting: false,
      cell: ({ row: { original: r } }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setOpenId(r.id);
            }}
          >
            Open
          </Button>
        </div>
      ),
    },
  ];

  if (error) return <PageError message={error.message} />;

  const open = reports.find((r) => r.id === openId) ?? null;

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Alerts"
          description={
            reports.length
              ? `Driver reports · ${today} today, ${reports.length} in all`
              : "Problems drivers send from the Report tab of the driver app."
          }
          actions={
            <>
              <OrgPicker />
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder="Search unit, driver or note"
              />
            </>
          }
        />

        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: reports.length },
            ...REASONS.map((reason) => ({
              value: reason,
              label: reportReasons[reason].title,
              count: counts[reason],
            })),
          ]}
        />

        <DataTable
          columns={columns}
          data={filtered}
          loading={!!orgId && isPending}
          emptyMessage={q || filter !== "all" ? "No reports match" : "No driver reports"}
          emptyHint={
            q || filter !== "all"
              ? "Try another search or reason."
              : "When a driver taps Send to manager, the report shows here within 30 seconds."
          }
          onRowClick={(r) => setOpenId(r.id)}
          pageSize={20}
        />
      </div>

      <ReportPanel
        report={open}
        unit={open ? unitOf(open) : undefined}
        driver={open ? driverOf(open) : undefined}
        directions={directions}
        stops={activeStops}
        now={now}
        onClose={() => setOpenId(null)}
      />
    </>
  );
}

/* ─── One report ─── */
function ReportPanel({
  report,
  unit,
  driver,
  directions,
  stops,
  now,
  onClose,
}: {
  report: DriverReport | null;
  unit?: Jeepney;
  driver?: DriverProfile;
  directions: RouteDirection[];
  stops: StopPoint[];
  now: number;
  onClose: () => void;
}) {
  const router = useRouter();

  // Keep the last report on screen while the panel slides closed.
  const [shown, setShown] = useState(report);
  if (report && report !== shown) setShown(report);
  const r = report ?? shown;
  if (!r) return null;

  const reason = reportReasons[r.reason];
  const plate = unit?.plateNumber ?? `Unit ${r.unit}`;
  const name = driver ? fullName(driver) : null;
  const hasPosition = r.lat != null && r.long != null;
  const near = nearestStop(r, stops);

  return (
    <SidePanel
      isOpen={!!report}
      onClose={onClose}
      width="lg"
      title={`${reason.title} · ${plate}`}
      subtitle={[
        name ?? "Driver not on record",
        `Unit J${unit?.jeepneyNumber ?? r.unit}`,
        sentAt(r.createdAt, now),
      ].join(" · ")}
    >
      <div className="space-y-5">
        <div>
          <p className="mb-1.5 text-label text-ink-muted">What the driver sent</p>
          <div className="rounded-tile bg-sunken p-4">
            <StatusChip tone={REASON_TONE[r.reason]}>{reason.title}</StatusChip>
            <p className="mt-2.5 text-[15px] leading-snug text-ink">
              {r.note ? `“${r.note}”` : <span className="text-ink-muted italic">No note</span>}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PanelValue label="Sent">
            {r.createdAt
              ? `${sentAt(r.createdAt, now)} · ${timeAgo(new Date(r.createdAt), now)} ago`
              : "—"}
          </PanelValue>
          <PanelValue label="Direction">
            {r.directionId ? directionLabel(directions, r.directionId) : "Not set"}
          </PanelValue>
        </div>

        <div>
          <p className="mb-1.5 text-label text-ink-muted">Where they were</p>
          {hasPosition ? (
            <>
              <div className="h-56 overflow-hidden rounded-tile border-[1.5px] border-line-strong">
                <MapView center={[r.long!, r.lat!]} zoom={14}>
                  <MapControls showZoom position="top-right" />
                  <MapMarker longitude={r.long!} latitude={r.lat!}>
                    <MarkerContent>
                      <span className="block h-5 w-5 rounded-full border-4 border-danger bg-card shadow-md" />
                    </MarkerContent>
                  </MapMarker>
                </MapView>
              </div>
              <p className="mt-1.5 text-[13px] text-ink-muted">
                {near ? `${nearLabel(r, stops)} · ` : ""}
                <span className="font-data">
                  {r.lat!.toFixed(5)}, {r.long!.toFixed(5)}
                </span>
              </p>
            </>
          ) : (
            <Notice
              icon={<MapPinOff size={16} />}
              tone="info"
              title="No position came with this report"
              description="The driver's phone had no GPS fix when they sent it."
            />
          )}
        </div>

        <div className="space-y-3">
          <p className="text-label text-ink-muted">What you can do</p>
          {unit && (
            <PanelActionRow
              title="Send a reliever to this unit"
              description={`Pick who drives ${unit.plateNumber} next on Assignments.`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  startIcon={<UserRoundPlus size={15} />}
                  onClick={() => router.push(`/assignments?unit=${encodeURIComponent(unit.id)}`)}
                >
                  Choose a driver
                </Button>
              }
            />
          )}
          <PanelActionRow
            title={name ? `Call ${name}` : "Call the driver"}
            description={
              driver?.phone
                ? driver.phone
                : `No phone on file.${name ? ` Add it to ${name}'s record on Drivers.` : ""}`
            }
            action={
              <Button
                variant="outline"
                size="sm"
                startIcon={<Phone size={15} />}
                disabled={!driver?.phone}
                onClick={() => {
                  if (driver?.phone)
                    window.location.href = `tel:${driver.phone.replace(/\s/g, "")}`;
                }}
              >
                Call
              </Button>
            }
          />
        </div>
      </div>
    </SidePanel>
  );
}
