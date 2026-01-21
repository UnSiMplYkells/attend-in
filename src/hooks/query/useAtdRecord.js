"use client"
import { useUser } from "./useUser";
import { getAtdRecord, setAtdRecord as setAtdRecordApi } from "@/lib/server/atdRecord";
import { useMutation, useQuery } from "@tanstack/react-query";

// sets attendance sesion with data from button click on the parent element where it was called
export function useSetAtdRecord() {
  const { mutate: setAtdRecord, isPending: issetAtdRecordLoading } =
    useMutation({
      mutationFn: async (variables) => {
        return await setAtdRecordApi(variables);
      },
      onSuccess: (data) => {
        toast.success("Attendance taken successfully!")
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { setAtdRecord, issetAtdRecordLoading };
}

// fetches attendance record for a given session and user
export function useGetAtdRecord(sessionId) {
  const { user } = useUser();

  const { data, isLoading: isGetAtdRecordLoading } = useQuery({
    queryKey: ["get-attendance-record", sessionId, user?.id],
    queryFn: () => getAtdRecord({ sessionId, userId: user?.id }),
    staleTime: 3 * 60 * 1000,
    enabled: !!sessionId && !!user?.id,
  });

  return {
    data,
    isGetAtdRecordLoading,
  };
}