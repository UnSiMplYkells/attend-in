import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/lib/server/students";

export function useGetStudents() {
  const { isLoading: isStudentsLoading, data: students } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
    staleTime: Infinity,
  });

  return {
    isStudentsLoading,
    students,
  };
}
