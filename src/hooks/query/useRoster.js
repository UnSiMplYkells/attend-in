import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addStudentToRoster, getCourses, removeStudentFromRoster } from "@/lib/server/roster";
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

export function useAddStudentToCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, studentId }) =>
      addStudentToRoster(courseId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classList"] });
    },
  });
}

export function useRemoveStudentFromCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, studentId }) =>
      removeStudentFromRoster(courseId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classList"] });
    },
  });
}