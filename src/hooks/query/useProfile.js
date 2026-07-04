import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentProfileStats, dropCourse } from "@/lib/server/profile";

export function useStudentProfileStats() {
  return useQuery({
    queryKey: ["studentProfileStats"],
    queryFn: () => getStudentProfileStats(),
  });
}

export function useDropCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId) => dropCourse(classId),
    onSuccess: () => {
      // Instantly updates the UI when a course is dropped
      queryClient.invalidateQueries({ queryKey: ["studentProfileStats"] });
    },
  });
}
