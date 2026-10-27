"use client";

import { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  ConfirmDialog,
  DataTable,
  Field,
  Input,
  PageError,
  PanelActionRow,
  Select,
  SidePanel,
} from "@/components/ui";
import { Notice, PageHeader, SearchField } from "@/components/common";
import { useAuthStore } from "@/store";
import {
  useFareGuide,
  useFareMatrix,
  useSaveFareRow,
  useDeleteFareRow,
  useUpdateFareMatrix,
  useAllRoutes,
  useOrganization,
} from "@/hooks";
import {
  fareMatrixSchema,
  fareRowSchema,
  type FareMatrixFormData,
  type FareRowFormData,
} from "@/lib";
import type { FareGuideRow, FareMatrix } from "@/types";

const peso = (n: number) => `₱${Number(n).toFixed(2)}`;
const rowKey = (r: { routeId: string; km: number }) => `${r.routeId}:${r.km}`;

export default function FareGuidePage() {
  const { userProfile } = useAuthStore();
  const isSuperAdmin = userProfile?.role === "super_admin";
  const orgId = userProfile?.organizationId ?? "";
  const { data: org } = useOrganization(isSuperAdmin ? undefined : orgId);

  const [query, setQuery] = useState("");
  const [filterRouteId, setFilterRouteId] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<FareGuideRow | null>(null);

  const { data: routes = [] } = useAllRoutes();
  const routeName = (id: string) => routes.find((r) => r.id === id)?.name ?? "—";

  const effectiveRouteId = isSuperAdmin ? filterRouteId : (org?.routeId ?? "");
  const { data: fares = [], isPending, error } = useFareGuide(effectiveRouteId || undefined);
  const { data: matrix } = useFareMatrix(effectiveRouteId || undefined);
  const deleteFare = useDeleteFareRow();

  const q = query.trim().toLowerCase();
  const filtered = q ? fares.filter((f) => (f.landmark ?? "").toLowerCase().includes(q)) : fares;

  const openPanel = (key: string | null) => {
    setEditKey(key);
    setPanelOpen(true);
  };

  const columns: ColumnDef<FareGuideRow, unknown>[] = [
    {
      id: "landmark",
      header: "Landmark",
      accessorFn: (f) => f.landmark ?? "",
      cell: ({ row: { original: f } }) => (
        <div>
          <p className="font-semibold text-ink">{f.landmark ?? "—"}</p>
          {isSuperAdmin && !filterRouteId && (
            <p className="text-[12px] text-ink-muted">{routeName(f.routeId)}</p>
          )}
        </div>
      ),
    },
    {
      id: "km",
      header: "Distance",
      accessorFn: (f) => f.km,
      cell: ({ row: { original: f } }) => (
        <span className="font-data text-ink-muted">{f.km} km</span>
      ),
    },
    {
      id: "regular",
      header: "Regular",
      accessorFn: (f) => f.regular,
      cell: ({ row: { original: f } }) => (
        <span className="font-data font-bold text-ink">{peso(f.regular)}</span>
      ),
    },
    {
      id: "discounted",
      header: "Discounted",
      accessorFn: (f) => f.discounted,
      cell: ({ row: { original: f } }) => (
        <span className="font-data font-bold text-live-ink">{peso(f.discounted)}</span>
      ),
    },
    {
      id: "edit",
      header: () => <span className="sr-only">Edit</span>,
      enableSorting: false,
      cell: ({ row: { original: f } }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openPanel(rowKey(f));
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  if (error) return <PageError message={error.message} />;

  const scopeName = effectiveRouteId ? routeName(effectiveRouteId) : "all routes";

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Fare guide"
          description={`${fares.length} posted ${fares.length === 1 ? "fare" : "fares"} on ${scopeName} · commuters are charged these by trip length`}
          actions={
            <>
              {isSuperAdmin && (
                <Select
                  appearance="pill"
                  aria-label="Route"
                  options={[
                    { value: "", label: "All routes" },
                    ...routes.map((r) => ({ value: r.id, label: r.name })),
                  ]}
                  value={filterRouteId}
                  onChange={(e) => setFilterRouteId(e.target.value)}
                  className="max-w-[240px]"
                />
              )}
              <SearchField value={query} onChange={setQuery} placeholder="Search landmarks" />
              <Button
                variant="outline"
                startIcon={<FileText size={17} />}
                onClick={() => setMatrixOpen(true)}
                disabled={!effectiveRouteId}
              >
                Order details
              </Button>
              <Button startIcon={<Plus size={17} />} onClick={() => openPanel(null)}>
                Add fare
              </Button>
            </>
          }
        />

        {effectiveRouteId && !matrix?.orderNo && (
          <Notice
            icon={<FileText size={17} />}
            tone="pending"
            title="The order number isn't added yet"
            description="Commuters see “Not posted yet” next to the order and effective date. Add them from the posted LTFRB order."
            action={
              <Button variant="outline" size="sm" onClick={() => setMatrixOpen(true)}>
                Add order details
              </Button>
            }
          />
        )}

        <DataTable
          columns={columns}
          data={filtered}
          loading={isPending}
          emptyMessage={q ? "No fares match" : "No fares yet"}
          emptyHint={
            q ? undefined : "Add each posted fare: the landmark, its distance and both fares."
          }
          onRowClick={(f) => openPanel(rowKey(f))}
          pageSize={30}
        />
      </div>

      <FarePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        fare={fares.find((f) => rowKey(f) === editKey) ?? null}
        routes={routes}
        lockedRouteId={isSuperAdmin ? filterRouteId || undefined : effectiveRouteId}
        allowRouteChoice={isSuperAdmin}
        onDelete={setDeleting}
      />

      <MatrixPanel
        isOpen={matrixOpen}
        onClose={() => setMatrixOpen(false)}
        routeId={effectiveRouteId}
        routeName={routeName(effectiveRouteId)}
        routeVehicleClass={routes.find((r) => r.id === effectiveRouteId)?.vehicleClass}
        matrix={matrix ?? null}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title={`Remove the fare for ${deleting?.km ?? ""} km?`}
        message={`${deleting?.landmark ? `${deleting.landmark} leaves the fare guide. ` : ""}Trips of this length are then charged by the rule in the order details. This can't be undone.`}
        cancelLabel="Keep the fare"
        confirmLabel="Remove fare"
        loadingText="Removing…"
        isLoading={deleteFare.isPending}
        onConfirm={() =>
          deleting &&
          deleteFare.mutate(
            { routeId: deleting.routeId, km: deleting.km },
            {
              onSuccess: () => {
                toast.success("Fare removed");
                setDeleting(null);
                setPanelOpen(false);
              },
              onError: (e) => toast.error(e.message),
            },
          )
        }
      />
    </>
  );
}

/* ─── Add / edit a posted fare ─── */
function FarePanel({
  isOpen,
  onClose,
  fare,
  routes,
  lockedRouteId,
  allowRouteChoice,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  fare: FareGuideRow | null;
  routes: { id: string; name: string }[];
  lockedRouteId?: string;
  allowRouteChoice: boolean;
  onDelete: (fare: FareGuideRow) => void;
}) {
  const isEdit = !!fare;
  const saveFare = useSaveFareRow();
  const formId = "fare-form";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FareRowFormData>({ resolver: zodResolver(fareRowSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      routeId: fare?.routeId ?? lockedRouteId ?? "",
      landmark: fare?.landmark ?? "",
      km: fare?.km ?? 0,
      regular: fare?.regular ?? 0,
      discounted: fare?.discounted ?? 0,
    });
  }, [isOpen, fare, lockedRouteId, reset]);

  const isSaving = isSubmitting || saveFare.isPending;

  const onSubmit = handleSubmit((data) => {
    saveFare.mutate(
      { data, previousKm: fare?.km },
      {
        onSuccess: () => {
          toast.success(isEdit ? "Fare saved" : `Fare for ${data.km} km added`);
          onClose();
        },
        onError: (e: Error) => toast.error(e.message),
      },
    );
  });

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      busy={isSaving}
      title={fare ? `Fare for ${fare.km} km` : "Add a fare"}
      subtitle="As posted: the distance from the start of the route, in whole km."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} isLoading={isSaving} loadingText="Saving…">
            {isEdit ? "Save changes" : "Save this fare"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-5" noValidate>
        {allowRouteChoice && !fare ? (
          <Field label="Route" htmlFor="fare-route" error={errors.routeId?.message}>
            <Select
              id="fare-route"
              options={routes.map((r) => ({ value: r.id, label: r.name }))}
              placeholder="Choose a route"
              error={!!errors.routeId}
              {...register("routeId")}
            />
          </Field>
        ) : (
          <input type="hidden" {...register("routeId")} />
        )}

        <Input
          id="fare-landmark"
          label="Landmark"
          placeholder="Batac Public Market"
          error={!!errors.landmark}
          hint={errors.landmark?.message}
          {...register("landmark")}
        />

        <Input
          id="fare-km"
          type="number"
          step="1"
          min="0"
          inputMode="numeric"
          label="Distance (km)"
          className="font-data"
          error={!!errors.km}
          hint={errors.km?.message ?? "A trip of this length, rounded to the nearest km."}
          {...register("km")}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            id="fare-regular"
            type="number"
            step="0.25"
            min="0"
            inputMode="decimal"
            label="Regular fare (₱)"
            className="font-data"
            error={!!errors.regular}
            hint={errors.regular?.message}
            {...register("regular")}
          />
          <Input
            id="fare-discounted"
            type="number"
            step="0.25"
            min="0"
            inputMode="decimal"
            label="Discounted fare (₱)"
            className="font-data"
            error={!!errors.discounted}
            hint={errors.discounted?.message}
            {...register("discounted")}
          />
        </div>

        {fare && (
          <PanelActionRow
            tone="danger"
            title="Remove this fare"
            description="Takes it out of the commuter fare guide."
            action={
              <Button variant="danger-outline" size="sm" onClick={() => onDelete(fare)}>
                Remove fare
              </Button>
            }
          />
        )}
      </form>
    </SidePanel>
  );
}

/* ─── The order the fares come from, and the rule past the table ─── */
function MatrixPanel({
  isOpen,
  onClose,
  routeId,
  routeName,
  routeVehicleClass,
  matrix,
}: {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  routeName: string;
  routeVehicleClass?: string;
  matrix: FareMatrix | null;
}) {
  const updateMatrix = useUpdateFareMatrix();
  const formId = "fare-matrix-form";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FareMatrixFormData>({ resolver: zodResolver(fareMatrixSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      orderNo: matrix?.orderNo ?? "",
      issuedBy: matrix?.issuedBy ?? "",
      effectiveDate: matrix?.effectiveDate?.slice(0, 10) ?? "",
      vehicleClass: matrix?.vehicleClass ?? routeVehicleClass ?? "Traditional PUJ",
      baseFare: matrix?.baseFare ?? 13,
      baseKm: matrix?.baseKm ?? 4,
      perKm: matrix?.perKm ?? 1.8,
      discountPercent: Math.round((matrix?.discountRate ?? 0.2) * 100),
      roundTo: matrix?.roundTo ?? 0.25,
      discountRoundTo: matrix?.discountRoundTo ?? 0.25,
    });
  }, [isOpen, matrix, routeVehicleClass, reset]);

  const isSaving = isSubmitting || updateMatrix.isPending;
  const lastKm = matrix?.table.at(-1)?.km;

  const onSubmit = handleSubmit((data) => {
    updateMatrix.mutate(
      { routeId, data },
      {
        onSuccess: () => {
          toast.success("Order details saved");
          onClose();
        },
        onError: (e: Error) => toast.error(e.message),
      },
    );
  });

  const number = (id: keyof FareMatrixFormData, label: string, stepValue: string) => (
    <Input
      id={`matrix-${id}`}
      type="number"
      step={stepValue}
      min="0"
      inputMode="decimal"
      label={label}
      className="font-data"
      error={!!errors[id]}
      hint={errors[id]?.message}
      {...register(id)}
    />
  );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      busy={isSaving}
      title="Order details"
      subtitle={`${routeName} · shown on the commuters' fare matrix`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} isLoading={isSaving} loadingText="Saving…">
            Save details
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          id="matrix-orderNo"
          label="Order / case no."
          placeholder="LTFRB MC 2023-…"
          {...register("orderNo")}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            id="matrix-issuedBy"
            label="Issuing office"
            placeholder="LTFRB"
            {...register("issuedBy")}
          />
          <Input
            id="matrix-effectiveDate"
            type="date"
            label="Effective date"
            className="font-data"
            {...register("effectiveDate")}
          />
        </div>
        <Input
          id="matrix-vehicleClass"
          label="Vehicle class"
          error={!!errors.vehicleClass}
          hint={errors.vehicleClass?.message}
          {...register("vehicleClass")}
        />

        <div>
          <p className="text-[14px] font-bold text-ink">
            {lastKm != null ? `Trips longer than ${lastKm} km` : "Fares by rule"}
          </p>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            {lastKm != null
              ? "The posted fares cover the rest. Past them, fares follow this rule."
              : "With no posted fares yet, every trip follows this rule."}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {number("baseFare", "Base fare (₱)", "0.25")}
          {number("baseKm", "Covers first (km)", "1")}
          {number("perKm", "Each km after (₱)", "0.05")}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {number("discountPercent", "Discount (%)", "1")}
          {number("roundTo", "Round regular to (₱)", "0.25")}
          {number("discountRoundTo", "Round discounted to (₱)", "0.25")}
        </div>
      </form>
    </SidePanel>
  );
}
