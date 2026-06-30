import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTimetable,
  clearAllTimetable,
  removeClassSlot,
  addClassSlot,
} from "@/lib/server/timetable";

export function useTimetable() {
  return useQuery({
    queryKey: ["timetable"],
    queryFn: () => getTimetable(),
  });
}

export function useClearTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => clearAllTimetable(ids), // We are adding IDs here for Step 2
    onSuccess: () => {
      // FIXED: Must be an object with 'queryKey'
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
    },
  });
}

export function useRemoveClassSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => removeClassSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["timetable"]);
    },
  });
}

export function useAddClassSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payloads) => addClassSlot(payloads),
    onSuccess: () => {
      queryClient.invalidateQueries(["timetable"]);
    },
  });
}
