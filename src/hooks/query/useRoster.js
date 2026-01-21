import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/server/roster";
import { useUser } from "./useUser";

export function useGetCourses() {
  const { user } = useUser();

  const { data, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["courses", user?.id],
    queryFn: () => getCourses(user.id),
    enabled: !!user?.id,
    staleTime: Infinity,
  });

  return {
    data,
    isCoursesLoading,
  };
}
  