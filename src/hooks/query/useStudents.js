import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStudents } from "@/lib/server/students";

export function useGetStudents(department, page = 1, searchTerm = "") {
  const {
    data,
    isLoading: isStudentsLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["students", department, page, searchTerm],
    queryFn: () => getStudents(department, page, searchTerm),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    enabled: !!department,
  });

  return {
    isStudentsLoading,
    students: data?.data ?? [],
    count: data?.count ?? 0,
    isPlaceholderData,
  };
}


// for admin usage
export function useGetStudentsII() {
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
