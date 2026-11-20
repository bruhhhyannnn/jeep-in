import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDriverReports, markDriverReportSeen } from "@/actions";

/** Checks for new reports every 30 seconds while the page is open. */
export function useDriverReports(organizationId: string) {
  return useQuery({
    queryKey: ["driver-reports", organizationId],
    queryFn: () => getDriverReports(organizationId),
    enabled: !!organizationId,
    refetchInterval: 30_000,
  });
}

/** Tells the driver their report was seen (see markDriverReportSeen). */
export function useMarkDriverReportSeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markDriverReportSeen(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["driver-reports"] }),
  });
}
