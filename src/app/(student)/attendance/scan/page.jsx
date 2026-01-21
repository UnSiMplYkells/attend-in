"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import QrScanner from "@/app/components/QrScanner";
import { useUser } from "@/hooks/query/useUser";
import { useGeo } from "@/hooks/useGeo";
import { useGetCurrentClass } from "@/hooks/query/useClasses";
import { useAttendanceSessionByQr } from "@/hooks/query/useAtdSessions";
import { validateAttendance } from "@/app/helper/validateAttendance";
import { useGetAtdRecord, useSetAtdRecord } from "@/hooks/query/useAtdRecord";
import getDistanceInMeters from "@/app/helper/findDistance";
import FullLoader from "@/app/components/ui/FullLoader";
import { MdCheckCircle, MdLocationOn, MdQrCodeScanner } from "react-icons/md";
import Button from "@/app/components/ui/Button";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const { user, isUserLoading } = useUser();
  const { data: location, loading: isGeoLoading } = useGeo();
  const { data: currentClass } = useGetCurrentClass();
  const { sessionByQr, isSessionByQrLoading } = useAttendanceSessionByQr(scanResult);

  console.log("Session by QR:", sessionByQr);

  //fetches existing records only if we have a valid session from the QR
  const {
    data: existingRecord,
    isGetAtdRecordLoading,
    isFetched: isRecordFetched,
  } = useGetAtdRecord(user && sessionByQr ? sessionByQr?.id : null, user?.id);
  console.log("Existing Record:", existingRecord);

  const { setAtdRecord, issetAtdRecordLoading } = useSetAtdRecord();

  const distanceFrmHall = getDistanceInMeters(
    location?.latitude,
    location?.longitude,
    currentClass?.latitude ?? null,
    currentClass?.longitude ?? null
  );

  const nowNow = new Date().toISOString();
  const todaysDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    //strictly checks if existingRecord is undefined, to know if it hasnt been fetched yet/loading
    if (sessionByQr && !isRecordFetched) {
      return;
    }

    //guard clauses to prevent premature execution
    if (
      !sessionByQr ||
      !user ||
      isGetAtdRecordLoading ||
      hasAttempted ||
      issetAtdRecordLoading
    ) {
      return;
    }

    //validation Logic
    const errorMsg = validateAttendance({
      session: sessionByQr,
      today: todaysDate,
      now: nowNow,
      existingRecord,
      distanceFrmHall,
    });

    if (errorMsg) {
      toast.error(errorMsg);
      setHasAttempted(true);
      return;
    }

    setAtdRecord({
      sessionId: sessionByQr.id,
      userId: user.id,
      distanceFrmHall,
    });

    toast.success("Attendance Marked Successfully!");
    setHasAttempted(true);
  }, [
    sessionByQr,
    user,
    existingRecord,
    isRecordFetched,
    isGetAtdRecordLoading,
    distanceFrmHall,
    setAtdRecord,
    hasAttempted,
    todaysDate,
    nowNow,
  ]);

  function handleScan(result) {
    console.log("QR Scanned in Page:", result);
    setScanResult(result);
  };

  function handleReset() {
    setScanResult(null);
    setHasAttempted(false);
  };

  if (isUserLoading || isGeoLoading) return <FullLoader />;

  return (
    <div className="min-h-[70vh] sm:min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="text-center mb-8 max-w-md">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-4 ring-1 ring-indigo-500/30">
          <MdQrCodeScanner className="text-3xl text-indigo-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Scan Attendance
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Align the class QR code within the frame to mark your attendance.
        </p>
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-full border border-white/5 backdrop-blur-sm">
          <MdLocationOn
            className={`text-xs ${
              location ? "text-green-400" : "text-red-400"
            }`}
          />
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">
            {location ? "Loc Active" : "No Loc"}
          </span>
        </div>

        <div className="p-1">
          {scanResult ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
              {isSessionByQrLoading || isGetAtdRecordLoading ? (
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-16 w-16 bg-white/10 rounded-full mb-4"></div>
                  <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                  <p className="text-sm text-gray-500">Verifying session...</p>
                  <p className="text-sm text-gray-500">Do not close or refresh this page</p>
                </div>
              ) : hasAttempted ? (
                <>
                  <MdCheckCircle className="text-6xl text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Scan Complete
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 break-all px-4">
                      {scanResult}
                    </p>
                  </div>
                  <div className="w-full pt-4">
                    <Button onClick={handleReset} variant="secondary">
                      Scan Again
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-gray-400">Processing...</div>
              )}
            </div>
          ) : (
            <div className="relative aspect-square w-full bg-black/50 overflow-hidden rounded-xl">
              <QrScanner onScan={handleScan} />
              <div className="absolute inset-0 pointer-events-none border-30 border-black/50"></div>
              <div className="absolute z-[-1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-indigo-500 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Ensure you are within the class vicinity before scanning.
        </p>
      </div>
    </div>
  );
}
