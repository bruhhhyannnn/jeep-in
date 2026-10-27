import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFareGuide,
  getFareMatrix,
  saveFareRow,
  deleteFareRow,
  updateFareMatrix,
} from "@/actions";
import type { FareMatrixFormData, FareRowFormData } from "@/lib";

export function useFareGuide(routeId?: string) {
  return useQuery({
    queryKey: ["fare-guide", routeId ?? "all"],
    queryFn: () => getFareGuide(routeId),
  });
}

export function useFareMatrix(routeId?: string) {
  return useQuery({
    queryKey: ["fare-guide", "matrix", routeId],
    queryFn: () => getFareMatrix(routeId!),
    enabled: !!routeId,
  });
}

export function useSaveFareRow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, previousKm }: { data: FareRowFormData; previousKm?: number }) =>
      saveFareRow(data, previousKm),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fare-guide"] }),
  });
}

export function useDeleteFareRow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, km }: { routeId: string; km: number }) => deleteFareRow(routeId, km),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fare-guide"] }),
  });
}

export function useUpdateFareMatrix() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, data }: { routeId: string; data: FareMatrixFormData }) =>
      updateFareMatrix(routeId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fare-guide"] }),
  });
}
