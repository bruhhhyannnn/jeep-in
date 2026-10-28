import { useQuery } from "@tanstack/react-query";
import { getDriverReports } from "@/actions";

/** Checks for new reports every 30 seconds while the page is open. */
export function useDriverReports(organizationId: string) {
  return useQuery({
    queryKey: ["driver-reports", organizationId],
    queryFn: () => getDriverReports(organizationId),
    enabled: !!organizationId,
    refetchInterval: 30_000,
  });
}
