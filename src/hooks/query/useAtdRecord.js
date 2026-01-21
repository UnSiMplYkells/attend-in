"use client"
import { useUser } from "./useUser";
import { getAtdRecord, setAtdRecord as setAtdRecordApi } from "@/lib/server/atdRecord";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// sets attendance sesion with data from button click on the parent element where it was called
export function useSetAtdRecord() {
  const queryClient = useQueryClient();

  const { mutate: setAtdRecord, isPending: issetAtdRecordLoading } =
    useMutation({
      mutationFn: async (variables) => {
        return await setAtdRecordApi(variables);
      },
      onSuccess: async (data) => {
        toast.success("Attendance taken successfully!")

        await queryClient.invalidateQueries({ queryKey: ["get-atd-record"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { setAtdRecord, issetAtdRecordLoading };
}

// fetches attendance record for a given session and user
export function useGetAtdRecord(sessionId, userId) {

  const { data, isLoading: isGetAtdRecordLoading, isFetched } = useQuery({
    queryKey: ["get-atd-record", sessionId, userId],
    queryFn: () => getAtdRecord({ sessionId, userId }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!sessionId && !!userId,
  });

  return {
    data,
    isGetAtdRecordLoading,
    isFetched,
  };
}