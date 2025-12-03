import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/server/session";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

  return { isLoading, user, isAuthenticated: user?.role === "authenticated" };
}
