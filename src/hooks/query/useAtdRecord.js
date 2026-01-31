"use client"
import { createClient } from "@/app/utils/supabase/client";
import { useUser } from "./useUser";
import { getAtdRecord, setAtdRecord as setAtdRecordApi } from "@/lib/server/atdRecord";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// sets attendance sesion with data from button click on the parent element where it was called
export function useSetAtdRecord() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { mutate: setAtdRecord, isPending: issetAtdRecordLoading } =
    useMutation({
      mutationFn: async ({ sessionId, latitude, longitude }) => {
        const { data, error } = await supabase.functions.invoke(
          "submit-attendance",
          {
            body: { sessionId, latitude, longitude },
          }
        );

        if (error) throw new Error(error.message); // Supabase system error
        if (data && data.error) {
          throw new Error(data.error);
        }

        return data;
      },
      onSuccess: async (data) => {
        toast.success(`Attendance Marked! (${Math.round(data.distance)}m away)`)

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