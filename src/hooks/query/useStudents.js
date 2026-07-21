import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getClassStudents, getStudents, getStudentsByDept } from "@/lib/server/students";

export function useGetStudents(
  department,
  page = 1,
  searchTerm = "",
  admissionSessionYear,
) {
  const { data, isLoading: isStudentsLoading, isPlaceholderData } = useQuery({
    queryKey: ["students", department, page, searchTerm, admissionSessionYear],
    queryFn: () => getStudents(department, page, searchTerm, admissionSessionYear),
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000,
    enabled: !!department && !!admissionSessionYear,
  });

  return {
    isStudentsLoading,
    students: data?.data ?? [],
    count: data?.count ?? 0,
    isPlaceholderData,
  };
}

export function useGetClassStudents(
  courseCode,
  courseId,
  page = 1,
  searchTerm = "",
) {
  const {
    data,
    isLoading: isAllClassStudentsLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["classList", courseCode, courseId, page, searchTerm],
    queryFn: () => getClassStudents(courseId, page, searchTerm),
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!courseId,
  });

  return {
    isAllClassStudentsLoading,
    allClassStudents: data?.data ?? [],
    count: data?.count ?? 0,
    isPlaceholderData,
  };
}

//bypassed pagination so as to download csv
// export function useGetAllClassStudents(courseId) {
//   const { isLoading: isExportLoading, data: exportData } = useQuery({
//     queryKey: ["classListExport", courseId],
//     queryFn: () => getAllClassStudents(courseId),
//     enabled: !!courseId,
//     staleTime: Infinity,
//   });

//   return {
//     isExportLoading,
//     exportData,
//   };
// }

// for admin usage
export function useGetStudentsByDept(department, admissionSessionYear) {
  const { isLoading: isAllDeptStudentsLoading, data: allDeptStudents } =
    useQuery({
      queryKey: ["studentsByDept", department, admissionSessionYear],
      queryFn: () => getStudentsByDept(department, admissionSessionYear),
      enabled: !!department && !!admissionSessionYear,
      staleTime: Infinity,
    });

  return {
    isAllDeptStudentsLoading,
    allDeptStudents,
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
