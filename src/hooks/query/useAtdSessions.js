import {
  setAtdSession as setAtdSessionApi,
  getActiveAtdSession,
  getAttendanceSessionByQr
} from "@/lib/server/atdSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCurrentTime from "@/app/helper/getCurrentTime";
import toast from "react-hot-toast";

//sets attendance session with data from button click on the parent element where it was called
export function useSetAtdSessions() {
  const queryClient = useQueryClient();

  const { mutate: setAtdSession, isPending: issetAtdSessionLoading } =
    useMutation({
      mutationFn: async (variables) => {
        return await setAtdSessionApi(variables);
      },
      onSuccess: (data) => {
        toast.success("Attendance session started!")
        queryClient.invalidateQueries({
          queryKey: ["active-attendance-session"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { setAtdSession, issetAtdSessionLoading };
}

// fetches active attendance session for a given class bassed on compared class id
export function useGetActiveAtdSession(classIds) {
  const timeNow = getCurrentTime();
  const nowNow = new Date().toISOString();

  const { data: activeAtdSession, isLoading: isGetAtdSessionLoading } = useQuery({
      queryKey: ["active-attendance-session", classIds],
      queryFn: () => getActiveAtdSession({classIds, timeNow, nowNow}),
      enabled: !!classIds?.length,
      refetchInterval: 30 * 1000,
      refetchIntervalInBackground: true,
    });

  return {
    activeAtdSession,
    isGetAtdSessionLoading,
  };
}

//fetches attendance session by when a qr code is scanned
export function useAttendanceSessionByQr(qrData) {
  const nowISO = new Date().toISOString();
  const today = new Date().toISOString().split("T")[0];

  const { data: sessionByQr, isLoading: isSessionByQrLoading } = useQuery({
    queryKey: ["attendance-session-by-Qr", qrData],
    queryFn: () =>
      getAttendanceSessionByQr(qrData, nowISO, today),
    enabled: !!qrData,
    staleTime: 1000 * 30, // 30 seconds (attendance window is time-based)
  });

  return { sessionByQr, isSessionByQrLoading };
}
