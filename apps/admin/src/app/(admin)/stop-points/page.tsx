"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Route as RouteIcon,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  ConfirmDialog,
  DataTable,
  Field,
  Input,
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  PageError,
  PanelActionRow,
  Select,
  SidePanel,
  StatusChip,
  Switch,
  Textarea,
  useMap,
} from "@/components/ui";
import { Notice, PageHeader, SearchField } from "@/components/common";
import { useAuthStore } from "@/store";
import {
  useStopPoints,
  useCreateStopPoint,
  useUpdateStopPoint,
  useDeleteStopPoint,
  useReorderStopPoints,
  useAllRoutes,
  useOrganization,
} from "@/hooks";
import { inSentence } from "@jeep-in/core/format";
import { cn, directionLabel, stopPointSchema, type StopPointFormData } from "@/lib";
import type { RouteDirection, StopPoint } from "@/types";

const DEFAULT_CENTER: [number, number] = [120.551474, 18.058174];
const DEFAULT_ZOOM = 12;

export default function StopPointsPage() {
  const { userProfile } = useAuthStore();
  const isSuperAdmin = userProfile?.role === "super_admin";
  const orgId = userProfile?.organizationId ?? "";

  const { data: org } = useOrganization(isSuperAdmin ? undefined : orgId);
  const adminRouteId = org?.routeId ?? "";

  const { data: allRoutes = [] } = useAllRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState("");

  useEffect(() => {
    if (isSuperAdmin && !selectedRouteId && allRoutes.length > 0) {
      setSelectedRouteId(allRoutes[0].id);
    }
  }, [isSuperAdmin, allRoutes, selectedRouteId]);

  const routeId = isSuperAdmin ? selectedRouteId : adminRouteId;
  const currentRoute = allRoutes.find((r) => r.id === routeId);
  const directions = currentRoute?.directions ?? [];

  const [query, setQuery] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<StopPoint | null>(null);
  const [reorderOpen, setReorderOpen] = useState(false);
  /** Bumped on each open so the reorder panel starts from the saved order. */
  const [reorderKey, setReorderKey] = useState(0);

  const { data: stopPoints = [], isPending, error } = useStopPoints(routeId || undefined);
  const deleteStopPoint = useDeleteStopPoint();

  const q = query.trim().toLowerCase();
  const filtered = stopPoints
    .filter((s) => !q || `${s.name} ${s.address ?? ""}`.toLowerCase().includes(q))
    .filter((s) => !selectedDirection || s.directionId === selectedDirection);

  const openPanel = (id: string | null) => {
    setEditId(id);
    setPanelOpen(true);
  };

  const columns: ColumnDef<StopPoint, unknown>[] = [
    {
      id: "order",
      header: "#",
      // Direction first, so sorting by # keeps each direction's stops together.
      accessorFn: (s) => `${s.directionId}:${String(s.order).padStart(3, "0")}`,
      cell: ({ row: { original: s } }) => (
        <span className="font-data text-[13px] text-ink-muted">{s.order || "—"}</span>
      ),
    },
    {
      id: "name",
      header: "Stop",
      accessorFn: (s) => s.name,
      cell: ({ row: { original: s } }) => (
        <div className="flex items-center gap-3">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-ink-mark bg-card" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{s.name}</p>
            {(s.landmark || s.address) && (
              <p className="truncate text-[12px] text-ink-muted">{s.landmark ?? s.address}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "direction",
      header: "Direction",
      accessorFn: (s) => directionLabel(directions, s.directionId),
      cell: ({ row: { original: s } }) => (
        <StatusChip tone="info">{directionLabel(directions, s.directionId)}</StatusChip>
      ),
    },
    {
      id: "latLng",
      header: "Coordinates",
      accessorFn: (s) => `${s.lat}, ${s.long}`,
      cell: ({ row: { original: s } }) => (
        <span className="font-data text-[12px] text-ink-muted">
          {s.lat.toFixed(5)}, {s.long.toFixed(5)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (s) => s.isActive,
      cell: ({ row: { original: s } }) =>
        s.isActive ? (
          <StatusChip tone="live" dot>
            In use
          </StatusChip>
        ) : (
          <StatusChip tone="neutral">Hidden</StatusChip>
        ),
    },
    {
      id: "edit",
      header: () => <span className="sr-only">Edit</span>,
      enableSorting: false,
      cell: ({ row: { original: s } }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openPanel(s.id);
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  if (error) return <PageError message={error.message} />;

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Stop points"
          description={
            currentRoute
              ? `${stopPoints.length} ${stopPoints.length === 1 ? "stop" : "stops"} on ${currentRoute.name}`
              : "Where commuters wait for a jeepney."
          }
          actions={
            <>
              {isSuperAdmin && (
                <Select
                  appearance="pill"
                  aria-label="Route"
                  options={allRoutes.map((r) => ({ value: r.id, label: r.name }))}
                  value={selectedRouteId}
                  onChange={(e) => {
                    setSelectedRouteId(e.target.value);
                    setSelectedDirection("");
                  }}
                  placeholder="Choose a route"
                  className="max-w-[240px]"
                />
              )}
              {directions.length > 0 && (
                <Select
                  appearance="pill"
                  aria-label="Direction"
                  options={[
                    { value: "", label: "Both directions" },
                    ...directions.map((d) => ({ value: d.id, label: d.label })),
                  ]}
                  value={selectedDirection}
                  onChange={(e) => setSelectedDirection(e.target.value)}
                />
              )}
              <SearchField value={query} onChange={setQuery} placeholder="Search stops" />
              <Button
                variant="outline"
                startIcon={<ArrowUpDown size={16} />}
                onClick={() => {
                  setReorderKey((k) => k + 1);
                  setReorderOpen(true);
                }}
                disabled={!routeId || stopPoints.length < 2 || directions.length === 0}
              >
                Reorder
              </Button>
              <Button
                startIcon={<Plus size={17} />}
                onClick={() => openPanel(null)}
                disabled={!routeId}
              >
                Add stop
              </Button>
            </>
          }
        />

        {!routeId && !isPending ? (
          <Notice
            icon={<RouteIcon size={17} />}
            tone="info"
            title={isSuperAdmin ? "No routes yet" : "Your organization has no route yet"}
            description="Stops belong to a route. Once there is one, add its stops here."
          />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            loading={!!routeId && isPending}
            emptyMessage={q || selectedDirection ? "No stops match" : "No stops on this route yet"}
            emptyHint={
              q || selectedDirection ? undefined : "Add the first stop and place it on the map."
            }
            onRowClick={(s) => openPanel(s.id)}
            pageSize={15}
          />
        )}
      </div>

      <StopPointPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        routeId={routeId}
        routeName={currentRoute?.name}
        directions={directions}
        stops={stopPoints}
        stop={stopPoints.find((s) => s.id === editId) ?? null}
        onDelete={setDeleting}
      />

      <ReorderPanel
        key={reorderKey}
        isOpen={reorderOpen}
        onClose={() => setReorderOpen(false)}
        routeId={routeId}
        directions={directions}
        stops={stopPoints}
        initialDirection={selectedDirection || directions[0]?.id || ""}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title={`Remove ${deleting?.name ?? "this stop"}?`}
        message="It disappears from the route and from commuters' maps. This can't be undone."
        cancelLabel="Keep the stop"
        confirmLabel="Remove stop"
        loadingText="Removing…"
        isLoading={deleteStopPoint.isPending}
        onConfirm={() =>
          deleting &&
          deleteStopPoint.mutate(deleting.id, {
            onSuccess: () => {
              toast.success(`${deleting.name} removed`);
              setDeleting(null);
              setPanelOpen(false);
            },
            onError: (e) => toast.error(e.message),
          })
        }
      />
    </>
  );
}

/* ─── Put a direction's stops in travel order ─── */
function ReorderPanel({
  isOpen,
  onClose,
  routeId,
  directions,
  stops,
  initialDirection,
}: {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  directions: RouteDirection[];
  stops: StopPoint[];
  initialDirection: string;
}) {
  const reorder = useReorderStopPoints();
  const savedOrder = (directionId: string) =>
    stops
      .filter((s) => s.directionId === directionId)
      .sort((a, b) => a.order - b.order)
      .map((s) => s.id);

  const [directionId, setDirectionId] = useState(initialDirection);
  const [ids, setIds] = useState(() => savedOrder(initialDirection));
  const [dragId, setDragId] = useState<string | null>(null);

  // `Map` here is the map component, so look stops up in a plain object.
  const byId: Record<string, StopPoint> = Object.fromEntries(stops.map((s) => [s.id, s]));
  const dirty = ids.join("|") !== savedOrder(directionId).join("|");

  const move = (id: string, to: number) => {
    const from = ids.indexOf(id);
    if (from < 0 || to < 0 || to >= ids.length || from === to) return;
    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, id);
    setIds(next);
  };

  const save = () =>
    reorder.mutate(
      { routeId, directionId, ids },
      {
        onSuccess: () => {
          toast.success("Stop order saved");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      },
    );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      busy={reorder.isPending}
      title="Reorder stops"
      subtitle="Drag stops into the order a jeep passes them. Stop 1 is where the trip starts."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={reorder.isPending}>
            Cancel
          </Button>
          <Button
            onClick={save}
            disabled={!dirty}
            isLoading={reorder.isPending}
            loadingText="Saving…"
          >
            Save order
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {directions.length > 1 && (
          <Field
            label="Direction"
            htmlFor="reorder-direction"
            hint={dirty ? "Switching direction drops the changes you haven't saved." : undefined}
          >
            <Select
              id="reorder-direction"
              options={directions.map((d) => ({ value: d.id, label: d.label }))}
              value={directionId}
              onChange={(e) => {
                setDirectionId(e.target.value);
                setIds(savedOrder(e.target.value));
              }}
            />
          </Field>
        )}

        {ids.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-ink-muted">
            No stops {inSentence(directionLabel(directions, directionId))} yet.
          </p>
        ) : (
          <ol className="space-y-1.5">
            {ids.map((id, index) => {
              const stop = byId[id];
              if (!stop) return null;
              return (
                <li
                  key={id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", id);
                    setDragId(id);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragId && dragId !== id) move(dragId, index);
                  }}
                  onDrop={(e) => e.preventDefault()}
                  onDragEnd={() => setDragId(null)}
                  className={cn(
                    "flex cursor-grab items-center gap-2 rounded-tile border-[1.5px] bg-card py-2 pr-2 pl-1.5 active:cursor-grabbing",
                    dragId === id ? "border-action bg-action-soft" : "border-line",
                  )}
                >
                  <GripVertical size={16} className="shrink-0 text-ink-meta" aria-hidden />
                  <span className="w-6 shrink-0 text-center font-data text-[13px] font-semibold text-ink-muted">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-ink">{stop.name}</p>
                    {(stop.landmark || stop.address || !stop.isActive) && (
                      <p className="truncate text-[12px] text-ink-muted">
                        {!stop.isActive && "Hidden · "}
                        {stop.landmark ?? stop.address}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => move(id, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move ${stop.name} up`}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-sunken hover:text-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(id, index + 1)}
                    disabled={index === ids.length - 1}
                    aria-label={`Move ${stop.name} down`}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-sunken hover:text-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronDown size={16} />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </SidePanel>
  );
}

/* ─── Map click handler — captures click coordinates ─── */
function MapClickHandler({ onPick }: { onPick: (lng: number, lat: number) => void }) {
  const { map, isLoaded } = useMap();
  const cbRef = useRef(onPick);
  cbRef.current = onPick;

  useEffect(() => {
    if (!map || !isLoaded) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => cbRef.current(e.lngLat.lng, e.lngLat.lat);
    map.on("click", handler);
    map.getCanvas().style.cursor = "crosshair";
    return () => {
      map.off("click", handler);
      map.getCanvas().style.cursor = "";
    };
  }, [map, isLoaded]);

  return null;
}

/* ─── Add / edit a stop ─── */
function StopPointPanel({
  isOpen,
  onClose,
  routeId,
  routeName,
  directions,
  stops,
  stop,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  routeName?: string;
  directions: RouteDirection[];
  /** The route's stops, to number a new one after the last in its direction. */
  stops: StopPoint[];
  stop: StopPoint | null;
  onDelete: (stop: StopPoint) => void;
}) {
  const isEdit = !!stop;
  const createStopPoint = useCreateStopPoint();
  const updateStopPoint = useUpdateStopPoint();
  const formId = "stop-point-form";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StopPointFormData>({
    resolver: zodResolver(stopPointSchema),
    defaultValues: { isActive: true },
  });

  /** After the last stop of the direction. */
  const nextOrder = (directionId: string) =>
    stops.filter((s) => s.directionId === directionId).length + 1;

  useEffect(() => {
    if (!isOpen) return;
    const onlyDirection = directions.length === 1 ? directions[0].id : "";
    reset(
      stop
        ? {
            name: stop.name,
            address: stop.address,
            landmark: stop.landmark ?? "",
            description: stop.description ?? "",
            amenities: stop.amenities.join(", "),
            directionId: stop.directionId,
            order: stop.order || nextOrder(stop.directionId),
            lat: stop.lat,
            long: stop.long,
            isActive: stop.isActive,
          }
        : {
            name: "",
            address: "",
            landmark: "",
            description: "",
            amenities: "",
            directionId: onlyDirection,
            order: nextOrder(onlyDirection),
            isActive: true,
          },
    );
    // Directions are compared by id; the array itself is rebuilt on every render.
  }, [isOpen, stop, directions.map((d) => d.id).join("|"), reset]);

  const lat = watch("lat");
  const lng = watch("long");
  const directionId = watch("directionId");
  const hasPin = typeof lat === "number" && !isNaN(lat) && typeof lng === "number" && !isNaN(lng);

  const handlePick = (pickedLng: number, pickedLat: number) => {
    setValue("long", pickedLng, { shouldValidate: true, shouldDirty: true });
    setValue("lat", pickedLat, { shouldValidate: true, shouldDirty: true });
  };

  const mapCenter: [number, number] = stop ? [stop.long, stop.lat] : DEFAULT_CENTER;
  const mapZoom = stop ? 15 : DEFAULT_ZOOM;
  const isSaving = isSubmitting || createStopPoint.isPending || updateStopPoint.isPending;

  const onSubmit = handleSubmit((data) => {
    const done = {
      onSuccess: () => {
        toast.success(isEdit ? `${data.name} saved` : `${data.name} added`);
        onClose();
      },
      onError: (e: Error) => toast.error(e.message),
    };
    if (stop) updateStopPoint.mutate({ id: stop.id, data }, done);
    else createStopPoint.mutate({ data, routeId }, done);
  });

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      busy={isSaving}
      width="lg"
      title={stop ? stop.name : "Add a stop"}
      subtitle={
        stop
          ? `${directionLabel(directions, stop.directionId)}${routeName ? ` · ${routeName}` : ""}`
          : routeName
            ? `A new stop on ${routeName}.`
            : "A new stop on this route."
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} isLoading={isSaving} loadingText="Saving…">
            {isEdit ? "Save changes" : "Save this stop"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          id="stop-name"
          label="Name"
          placeholder="Batac Public Market"
          error={!!errors.name}
          hint={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="stop-address"
          label="Address (optional)"
          placeholder="National Highway, Batac City"
          {...register("address")}
        />
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
          <Field label="Direction" htmlFor="stop-direction" error={errors.directionId?.message}>
            <Select
              id="stop-direction"
              options={directions.map((d) => ({ value: d.id, label: d.label }))}
              placeholder={
                directions.length === 0 ? "This route has no directions yet" : "Choose a direction"
              }
              disabled={directions.length === 0}
              error={!!errors.directionId}
              {...register("directionId", {
                // A new stop goes after the last one of the direction it's added to.
                onChange: (e) => {
                  if (!stop) setValue("order", nextOrder(e.target.value));
                },
              })}
            />
          </Field>
          <Input
            id="stop-order"
            label="Stop no."
            type="number"
            inputMode="numeric"
            min={1}
            error={!!errors.order}
            {...register("order")}
          />
        </div>
        <p className="-mt-3 text-[13px] text-ink-muted">
          {errors.order?.message ??
            `1 is the first stop${directionId ? ` ${inSentence(directionLabel(directions, directionId))}` : ""}. The other stops move to make room.`}
        </p>

        <Input
          id="stop-landmark"
          label="Landmark (optional)"
          placeholder="Across Jollibee"
          hint="Commuters can search for it."
          {...register("landmark")}
        />
        <Field label="About this stop (optional)" htmlFor="stop-description">
          <Textarea
            id="stop-description"
            rows={3}
            placeholder="Jeeps wait here for up to five minutes."
            {...register("description")}
          />
        </Field>
        <Input
          id="stop-amenities"
          label="Amenities (optional)"
          placeholder="Covered shed, Lights"
          hint="Separate them with commas. Shown as chips under About this stop."
          {...register("amenities")}
        />

        {/* Hidden inputs so RHF registers lat/long for validation */}
        <input type="hidden" {...register("lat")} />
        <input type="hidden" {...register("long")} />

        <div>
          <p className="mb-1.5 text-label text-ink-muted">
            Location — click the map to place the stop
          </p>
          <div
            className={
              errors.lat || errors.long
                ? "h-64 overflow-hidden rounded-tile border-[1.5px] border-danger"
                : "h-64 overflow-hidden rounded-tile border-[1.5px] border-line-strong"
            }
          >
            {isOpen && (
              <Map center={mapCenter} zoom={mapZoom}>
                <MapControls showZoom position="top-right" />
                <MapClickHandler onPick={handlePick} />
                {hasPin && (
                  <MapMarker
                    longitude={lng}
                    latitude={lat}
                    draggable
                    onDragEnd={({ lng: dLng, lat: dLat }) => handlePick(dLng, dLat)}
                  >
                    <MarkerContent>
                      <span className="block h-5 w-5 rounded-full border-4 border-ink-mark bg-card shadow-md" />
                    </MarkerContent>
                  </MapMarker>
                )}
              </Map>
            )}
          </div>
          {hasPin ? (
            <p className="mt-1.5 text-[13px] text-ink-muted">
              <span className="font-data text-ink">
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </span>{" "}
              · drag the pin to fine-tune
            </p>
          ) : (
            <p
              className={
                errors.lat || errors.long
                  ? "mt-1.5 text-[13px] text-danger-ink"
                  : "mt-1.5 text-[13px] text-ink-muted"
              }
            >
              Click anywhere on the map to place the stop.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 rounded-tile border-[1.5px] border-line p-4">
          <div>
            <p className="text-[14px] font-bold text-ink">Show to commuters</p>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              Hidden stops stay saved but off the map.
            </p>
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
                aria-label="Show to commuters"
              />
            )}
          />
        </div>

        {stop && (
          <PanelActionRow
            tone="danger"
            title="Remove this stop"
            description="Takes it off the route for good."
            action={
              <Button variant="danger-outline" size="sm" onClick={() => onDelete(stop)}>
                Remove stop
              </Button>
            }
          />
        )}
      </form>
    </SidePanel>
  );
}
