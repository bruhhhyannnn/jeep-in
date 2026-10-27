"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  ConfirmDialog,
  ConfirmFacts,
  DataTable,
  Input,
  PageError,
  PanelActionRow,
  SidePanel,
  StatusChip,
  Switch,
} from "@/components/ui";
import { PageHeader, SearchField } from "@/components/common";
import { useAllRoutes, useCreateRoute, useUpdateRoute, useDeleteRoute } from "@/hooks";
import { formatClock, routeSchema, splitList, type RouteFormData } from "@/lib";
import type { Route } from "@/types";

const DEFAULT_VEHICLE_CLASS = "Traditional PUJ";
const DEFAULT_SPEED_KPH = 20;

export default function RoutesPage() {
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Route | null>(null);

  const { data: routes = [], isPending, error } = useAllRoutes();
  const deleteRoute = useDeleteRoute();

  const q = query.trim().toLowerCase();
  const filtered = q ? routes.filter((r) => r.name.toLowerCase().includes(q)) : routes;
  const active = routes.filter((r) => r.isActive).length;

  const openPanel = (id: string | null) => {
    setEditId(id);
    setPanelOpen(true);
  };

  const columns: ColumnDef<Route, unknown>[] = [
    {
      id: "name",
      header: "Route",
      accessorFn: (r) => r.name,
      cell: ({ row: { original: r } }) => (
        <div className="min-w-0">
          <p className="font-semibold text-ink">{r.name}</p>
          {r.description && (
            <p className="line-clamp-1 max-w-[320px] text-[12px] text-ink-muted">{r.description}</p>
          )}
        </div>
      ),
    },
    {
      id: "directions",
      header: "Directions",
      enableSorting: false,
      cell: ({ row: { original: r } }) => (
        <div className="flex flex-wrap gap-1.5">
          {r.directions.length ? (
            r.directions.map((d) => (
              <span key={d.id} title={d.via.join(" → ")}>
                <StatusChip tone="info">{d.label}</StatusChip>
              </span>
            ))
          ) : (
            <span className="text-ink-muted">None</span>
          )}
        </div>
      ),
    },
    {
      id: "workingHours",
      header: "Shift hours",
      accessorFn: (r) => r.workingHours.start,
      cell: ({ row: { original: r } }) => (
        <span className="font-data text-[13px] whitespace-nowrap text-ink-muted">
          {formatClock(r.workingHours.start)} – {formatClock(r.workingHours.end)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (r) => r.isActive,
      cell: ({ row: { original: r } }) =>
        r.isActive ? (
          <StatusChip tone="live" dot>
            Active
          </StatusChip>
        ) : (
          <StatusChip tone="neutral">Inactive</StatusChip>
        ),
    },
    {
      id: "edit",
      header: () => <span className="sr-only">Edit</span>,
      enableSorting: false,
      cell: ({ row: { original: r } }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openPanel(r.id);
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
          title="Routes"
          description={`${routes.length} ${routes.length === 1 ? "route" : "routes"} · ${active} active`}
          actions={
            <>
              <SearchField value={query} onChange={setQuery} placeholder="Search routes" />
              <Button startIcon={<Plus size={17} />} onClick={() => openPanel(null)}>
                Add route
              </Button>
            </>
          }
        />

        <DataTable
          columns={columns}
          data={filtered}
          loading={isPending}
          emptyMessage={q ? "No routes match" : "No routes yet"}
          emptyHint={q ? undefined : "Add a route, then its stops and fares."}
          onRowClick={(r) => openPanel(r.id)}
        />
      </div>

      <RoutePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        route={routes.find((r) => r.id === editId) ?? null}
        onDelete={setDeleting}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title={`Delete ${deleting?.name ?? "this route"}?`}
        message="Its stops, fares and drivers are deleted with it. This can't be undone."
        cancelLabel="Keep the route"
        confirmLabel="Delete route"
        loadingText="Deleting…"
        isLoading={deleteRoute.isPending}
        onConfirm={() =>
          deleting &&
          deleteRoute.mutate(deleting.id, {
            onSuccess: () => {
              toast.success(`${deleting.name} deleted`);
              setDeleting(null);
              setPanelOpen(false);
            },
            onError: (e) => toast.error(e.message),
          })
        }
      >
        <ConfirmFacts
          items={[
            {
              label: "Deleted",
              text: "Its stop points, fares, and the drivers on it (including their sign-ins).",
            },
            {
              label: "Kept",
              text: "Organizations that use it — they are left without a route until you assign one.",
            },
          ]}
        />
      </ConfirmDialog>
    </>
  );
}

/* ─── Add / edit a route ─── */
function RoutePanel({
  isOpen,
  onClose,
  route,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  onDelete: (route: Route) => void;
}) {
  const isEdit = !!route;
  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();
  const formId = "route-form";

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      isActive: true,
      vehicleClass: DEFAULT_VEHICLE_CLASS,
      averageSpeedKph: DEFAULT_SPEED_KPH,
      directions: [],
      workingHours: { start: "06:00", end: "20:00" },
    },
  });
  const directions = useFieldArray({ control, name: "directions", keyName: "key" });

  useEffect(() => {
    if (!isOpen) return;
    reset(
      route
        ? {
            name: route.name,
            description: route.description ?? "",
            vehicleClass: route.vehicleClass,
            averageSpeedKph: route.averageSpeedKph,
            directions: route.directions.map((d) => ({
              id: d.id,
              label: d.label,
              via: d.via.join(", "),
            })),
            isActive: route.isActive,
            workingHours: route.workingHours,
          }
        : {
            name: "",
            description: "",
            vehicleClass: DEFAULT_VEHICLE_CLASS,
            averageSpeedKph: DEFAULT_SPEED_KPH,
            directions: [],
            isActive: true,
            workingHours: { start: "06:00", end: "20:00" },
          },
    );
  }, [isOpen, route, reset]);

  /** The second direction starts as the first one's return trip. */
  const addDirection = () => {
    const current = getValues("directions");
    const towns = current.length === 1 ? splitList(current[0].via) : [];
    directions.append(
      towns.length >= 2
        ? { label: `Toward ${towns[0]}`, via: [...towns].reverse().join(", ") }
        : { label: "", via: "" },
    );
  };

  const isSaving = isSubmitting || createRoute.isPending || updateRoute.isPending;

  const onSubmit = handleSubmit((data) => {
    const done = {
      onSuccess: () => {
        toast.success(isEdit ? `${data.name} saved` : `${data.name} added`);
        onClose();
      },
      onError: (e: Error) => toast.error(e.message),
    };
    if (route) updateRoute.mutate({ routeId: route.id, data }, done);
    else createRoute.mutate(data, done);
  });

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      busy={isSaving}
      title={route ? route.name : "Add a route"}
      subtitle={
        route
          ? "Directions, shift hours and status."
          : "A line jeepneys run, in one or both directions."
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} isLoading={isSaving} loadingText="Saving…">
            {isEdit ? "Save changes" : "Save this route"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          id="route-name"
          label="Name"
          placeholder="Laoag – Batac – Paoay"
          error={!!errors.name}
          hint={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="route-description"
          label="Description (optional)"
          placeholder="Main line through Laoag, Batac and Paoay"
          {...register("description")}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
          <Input
            id="route-vehicle-class"
            label="Vehicle class"
            placeholder={DEFAULT_VEHICLE_CLASS}
            error={!!errors.vehicleClass}
            hint={errors.vehicleClass?.message ?? "Shown on the fare matrix."}
            {...register("vehicleClass")}
          />
          <Input
            id="route-speed"
            label="Average km/h"
            type="number"
            inputMode="decimal"
            className="font-data"
            error={!!errors.averageSpeedKph}
            hint={errors.averageSpeedKph?.message ?? "With stops."}
            {...register("averageSpeedKph")}
          />
        </div>

        <div>
          <p className="mb-1.5 text-label text-ink-muted">Directions</p>
          <div className="space-y-3">
            {directions.fields.map((field, i) => (
              <div key={field.key} className="rounded-tile border-[1.5px] border-line p-3">
                <div className="flex items-start gap-2">
                  <div className="grid min-w-0 flex-1 gap-3">
                    <Input
                      id={`route-direction-${i}-label`}
                      label="Name"
                      placeholder="Toward Paoay"
                      error={!!errors.directions?.[i]?.label}
                      hint={errors.directions?.[i]?.label?.message}
                      {...register(`directions.${i}.label`)}
                    />
                    <Input
                      id={`route-direction-${i}-via`}
                      label="Towns in order"
                      placeholder="Laoag, Batac, Paoay"
                      error={!!errors.directions?.[i]?.via}
                      hint={errors.directions?.[i]?.via?.message}
                      {...register(`directions.${i}.via`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => directions.remove(i)}
                    aria-label={`Remove direction ${i + 1}`}
                    className="mt-7 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-sunken"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {errors.directions?.message && (
            <p className="mt-1.5 text-[13px] text-danger-ink">{errors.directions.message}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            startIcon={<Plus size={15} />}
            onClick={addDirection}
          >
            Add a direction
          </Button>
          <p className="mt-1.5 text-[13px] text-ink-muted">
            Commuters pick a direction by its name. A direction with stops can&apos;t be removed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            id="route-start"
            type="time"
            label="Sharing opens"
            className="font-data"
            error={!!errors.workingHours?.start}
            hint={errors.workingHours?.start?.message}
            {...register("workingHours.start")}
          />
          <Input
            id="route-end"
            type="time"
            label="Sharing closes"
            className="font-data"
            error={!!errors.workingHours?.end}
            hint={errors.workingHours?.end?.message}
            {...register("workingHours.end")}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-tile border-[1.5px] border-line p-4">
          <div>
            <p className="text-[14px] font-bold text-ink">Active</p>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              Turn off to mark the route inactive.
            </p>
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
                aria-label="Active"
              />
            )}
          />
        </div>

        {route && (
          <PanelActionRow
            tone="danger"
            title="Delete this route"
            description="Also deletes its stops, fares and the drivers on it."
            action={
              <Button variant="danger-outline" size="sm" onClick={() => onDelete(route)}>
                Delete route
              </Button>
            }
          />
        )}
      </form>
    </SidePanel>
  );
}
