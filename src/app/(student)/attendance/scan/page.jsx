"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

import { useUser } from "@/hooks/query/useUser";
import { useGeo } from "@/hooks/useGeo";
import { useAttendanceSessionByQr } from "@/hooks/query/useAtdSessions";
import { useGetAtdRecord, useSetAtdRecord } from "@/hooks/query/useAtdRecord";
import { useRegisterGeneralAttendee } from "@/hooks/query/useGeneralAttendance";
import FullLoader from "@/app/components/ui/FullLoader";
import {
  MdCheckCircle,
  MdLocationOn,
  MdQrCodeScanner,
  MdError,
} from "react-icons/md";
import Button from "@/app/components/ui/Button";

const QrScanner = dynamic(() => import("@/app/components/QrScanner"), {
  ssr: false,
  loading: () => <p>Loading scanner...</p>,
});

const SCAN_TYPE = {
  UNIVERSITY: "university",
  GENERAL: "general",
};

export default function ScanPage() {
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { user, isUserLoading } = useUser();

  console.log(user)
  const { data: location, loading: isGeoLoading } = useGeo();
  const { mutate: registerGeneral, isPending: isRegisteringGeneral } =
    useRegisterGeneralAttendee();

  const { sessionByQr, isSessionByQrLoading } = useAttendanceSessionByQr(
    scanResult && !scanResult.includes("/scan/") ? scanResult : null,
  );
  const {
    data: existingRecord,
    isGetAtdRecordLoading,
    isFetched: isRecordFetched,
  } = useGetAtdRecord(user && sessionByQr ? sessionByQr?.id : null, user?.id);
  const { setAtdRecord, issetAtdRecordLoading } = useSetAtdRecord();

  // University flow effect
  useEffect(() => {
    if (!scanResult || scanResult.includes("/scan/")) return;
    if (!sessionByQr || !isRecordFetched || scanStatus !== "idle") return;

    if (existingRecord) {
      setScanStatus("error");
      setErrorMessage("Attendance already marked!");
      return;
    }

    if (!location) {
      setScanStatus("error");
      setErrorMessage(
        "Location permissions are required to mark university attendance.",
      );
      toast.error("Waiting for GPS location...");
      return;
    }

    setScanStatus("loading");
    setAtdRecord(
      {
        sessionId: sessionByQr.id,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      {
        onSuccess: () => setScanStatus("success"),
        onError: (error) => {
          setScanStatus("error");
          setErrorMessage(error.message || "Failed to mark attendance");
        },
      },
    );
  }, [
    scanResult,
    sessionByQr,
    isRecordFetched,
    existingRecord,
    location,
    setAtdRecord,
    scanStatus,
  ]);

  function handleScan(result) {
    if (scanStatus !== "idle") return;

    setScanResult(result);

    let isGeneralEvent = false;
    let eventId = null;

    try {
      const url = new URL(result);
      const pathParts = url.pathname.split("/");
      if (pathParts[1] === "scan" && pathParts[2]) {
        isGeneralEvent = true;
        eventId = pathParts[2];
      }
    } catch (error) {
    }

    if (isGeneralEvent) {
      setScanStatus("loading");

      try {
        let deviceId =
          localStorage.getItem("device_id") ||
          localStorage.getItem("device_uuid");

        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem("device_id", deviceId);
        }

        if (!user?.profileII?.full_name)
          throw new Error("Incomplete user profile. Name missing.");

        registerGeneral(
          { eventId, name: user.profileII.full_name, deviceId },
          {
            onSuccess: () => {
              setScanStatus("success");
              toast.success("Attendance marked for general event!");
            },
            onError: (error) => {
              setScanStatus("error");
              setErrorMessage(
                error.message || "Already checked in or error occurred.",
              );
              toast.error(
                error.message || "Already checked in or error occurred.",
              );
            },
          },
        );
      } catch (error) {
        setScanStatus("error");
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    }
  }

  function handleReset() {
    setScanResult(null);
    setScanStatus("idle");
    setErrorMessage("");
  }

  if (isUserLoading) return <FullLoader />;

  const isGeneralScan = scanResult?.includes("/scan/");

  const isLoading = isGeneralScan
    ? scanStatus === "loading" || isRegisteringGeneral
    : scanStatus === "loading" ||
      isSessionByQrLoading ||
      isGetAtdRecordLoading ||
      issetAtdRecordLoading;

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

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden relative">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-full border border-white/5 backdrop-blur-sm">
          <MdLocationOn
            className={`text-xs ${location ? "text-green-400" : "text-red-400"}`}
          />
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">
            {location ? "Loc Active" : "No Loc"}
          </span>
        </div>

        <div className="p-1">
          {scanResult ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
              {isLoading && (
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-16 w-16 bg-white/10 rounded-full mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    Verifying...
                  </h3>
                  <p className="text-sm text-gray-500">Please wait</p>
                </div>
              )}

              {scanStatus === "success" && (
                <div className="animate-in zoom-in duration-300">
                  <MdCheckCircle className="text-6xl text-green-500 mx-auto" />
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-white">Success!</h3>
                    <p className="text-gray-400 text-sm mt-1 px-4">
                      Attendance has been marked securely.
                    </p>
                  </div>
                  <div className="w-full pt-6">
                    <Button onClick={handleReset} variant="secondary">
                      Scan Another
                    </Button>
                  </div>
                </div>
              )}

              {scanStatus === "error" && (
                <div className="animate-in zoom-in duration-300">
                  <MdError className="text-6xl text-red-500 mx-auto" />
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-white">
                      Verification Failed
                    </h3>
                    <p className="text-red-300/80 text-sm mt-2 px-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                      {errorMessage}
                    </p>
                  </div>
                  <div className="w-full pt-6">
                    <Button onClick={handleReset} variant="secondary">
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-square w-full bg-black/50 overflow-hidden rounded-xl">
              <QrScanner onScan={handleScan} />
              <div className="absolute inset-0 pointer-events-none border-30 border-black/50"></div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="text-xs text-gray-500">
          Ensure you are within the class vicinity for university attendance.
        </p>
      </div>
    </div>
  );
}
