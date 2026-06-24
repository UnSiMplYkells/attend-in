import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/server/dashboard";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });
}
