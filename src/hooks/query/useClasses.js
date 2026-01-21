import { useQuery } from "@tanstack/react-query";
import { getClasses, getCurrentClass, getUsersClasses } from "@/lib/server/classes";
import { useGetCourses } from "./useRoster";

export function useGetUsersClasses() {
  const { data: courses } = useGetCourses();
  const courseId = courses?.map((c) => c.class_id).filter(Boolean) ?? [];

  const { data, isLoading: isUsersClassesLoading } = useQuery({
    queryKey: ["users classes", courseId],
    queryFn: () => getUsersClasses(courseId),
    enabled: Array.isArray(courseId) && courseId.length > 0,
    staleTime: Infinity,
  });

  return {
    data,
    isUsersClassesLoading,
  };
}

export function useGetCurrentClass() {
  const { data: courses } = useGetCourses();
  const courseId = courses?.map((c) => c.class_id).filter(Boolean) ?? []

  const { data, isLoading: isCurrentClassLoading } = useQuery({
    queryKey: ["current-class", courseId],
    queryFn: () => getCurrentClass(courseId),
    enabled: Array.isArray(courseId) && courseId.length > 0,
    staleTime: 0,
    refetchInterval: 45 * 1000,
    refetchIntervalInBackground: true,
  });

  return {
    data,
    isCurrentClassLoading,
  };
}

//for admin use
export function useGetClasses() {
  const { data, isLoading: isClassesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
    staleTime: Infinity,
  });

  return {
    data,
    isClassesLoading
  };
}
