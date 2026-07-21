import { useQuery } from "@tanstack/react-query";
import { getClassRepDashboardStats } from "@/lib/server/classRepDashboardStats";

export function useClassRepDashboardStats() {
  return useQuery({
    queryKey: ["class-rep-dashboard-stats"],
    queryFn: getClassRepDashboardStats,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });
}
