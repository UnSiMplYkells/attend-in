"use client"
import { useEffect, useState } from "react"
import { useGeo } from "@/hooks/useGeo";
import { useGetCurrentClass, useGetUsersClasses } from "@/hooks/query/useClasses";
import Button from "@/app/components/ui/Button";
import QrGenerator from "@/app/components/QrGenerator";
import random30MinSlot from "@/app/helper/getRanTimeSlot";
import { useGetActiveAtdSession, useSetAtdSessions } from "@/hooks/query/useAtdSessions";
import FullLoader from "@/app/components/ui/FullLoader";
import { MdAccessTime, MdLocationOn, MdSensors } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Loader from "@/app/components/ui/Loader";

export default function page() {
  const [activeClass, setActiveClass] = useState(null);
  const [qrData, setQrData] = useState("");
  const [attendanceStarted, setAttendanceStarted] = useState(false);

  const { data: userClasses, isClassesLoading } = useGetUsersClasses();
  const userClassIds = userClasses?.map((c) => c.id) || [];

  const { activeAtdSession } = useGetActiveAtdSession(userClassIds);
  const isAtdActivated = activeAtdSession?.isActivated;

  console.log("Active attendance session:", activeAtdSession);
  console.log("if attendance is started", attendanceStarted)
  
  const { setAtdSession, issetAtdSessionLoading } = useSetAtdSessions();

  const { data: location } = useGeo();
  const { data: currentClass } = useGetCurrentClass();

  useEffect(() => {
    if (!activeAtdSession || !userClasses) {
      setAttendanceStarted(false); // Reset if no session found
      return;
    }

    if (activeAtdSession && userClasses) {
      //finds if any class is active in the current session
      const cls = userClasses.find((c) => c.id === activeAtdSession.class_id);

      if (cls) {
        setActiveClass(cls);
        setQrData(activeAtdSession.session_data);
        setAttendanceStarted(true);
      }
    }

  }, [activeAtdSession, userClasses]);

  function handleStartAttendance(cls) {
    if (attendanceStarted) return;

    const scheduleItem = currentClass?.find(
      (cc) => cc.class_id === cls.id || cc.classes?.id === cls.id
    );

    if (!scheduleItem) {
      console.error("Could not find schedule times for this class");
      return;
    }

    if (!scheduleItem || !scheduleItem.id) {
      alert("Cannot start session: No valid schedule ID found.");
      return;
    }

    const ranTimeSlot = random30MinSlot(
      scheduleItem?.start_time,
      scheduleItem?.end_time,
      30
    );

    const sessionName = cls.course_code;
    const dateDay = new Date().toString().split(" GMT")[0];
    const qrValue = `${sessionName} ${dateDay}`;

    setQrData(qrValue);
    setActiveClass(cls);
    setAttendanceStarted(true);

    //sets the attendance session
    setAtdSession({
      classId: cls.id,
      TtLink: scheduleItem.id,
      sessionData: qrValue,
      winStart: ranTimeSlot.startTime,
      winEnd: ranTimeSlot.endTime,
    });
  }

  if (isClassesLoading) return <FullLoader />;

  //live Session View
  if (attendanceStarted && qrData) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[80vh] p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl max-w-lg w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-400 font-bold uppercase tracking-wider text-xs">
              Live Session
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">
            {activeClass?.course_code}
          </h2>

          <div className="mb-8">
            <QrGenerator value={qrData} />
          </div>

          <p className="text-gray-400 text-sm mb-8">
            Students can scan this code to mark their attendance.
            <br />
            Ensure this screen is visible.
          </p>

          <Button
            variant="secondary"
            onClick={() => setAttendanceStarted(false)}
          >
            Hide QR Code
          </Button>
        </div>
      </div>
    );
  }

  //Dashboard View
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MdSensors className="text-indigo-400" />
            Attendance Control
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage active sessions for your assigned courses.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
          <MdLocationOn className="text-gray-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase">
              GPS Coords
            </span>
            <SkeletonTheme baseColor="#313131" highlightColor="#525252">
              <span className="text-xs text-gray-300 font-mono">
                {location ? (
                  `${location.latitude.toFixed(
                    4
                  )}, ${location.longitude.toFixed(4)}`
                ) : (
                  <Skeleton width={120} />
                )}
              </span>
            </SkeletonTheme>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {userClasses?.map((cls) => {
          let isActive = currentClass?.some(
            (cc) =>
              cc.class_id === cls.id ||
              cc.classes?.id === cls.id ||
              cc.classes?.course_code === cls.course_code
          );
          if (isActive === undefined) isActive = false;

          return (
            <div
              key={cls.id ?? cls.course_code}
              className={` ${
                cls.id === activeAtdSession?.class_id ? " cursor-pointer " : ""
              } 
                relative group flex flex-col justify-between p-6 rounded-xl border transition-all duration-300 
                ${
                  isActive
                    ? "bg-linear-to-br from-indigo-900/30 to-black border-indigo-500/30 shadow-lg shadow-indigo-900/10 hover:border-indigo-500/50"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              onClick={
                cls.id === activeAtdSession?.class_id
                  ? () => setAttendanceStarted(true)
                  : null
              }
            >
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`px-2 py-2 rounded text-[10px] leading-none font-bold uppercase tracking-wider border
                      ${
                        isActive
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}
                  >
                    {isActive ? "Scheduled Now" : "Inactive"}
                    {isAtdActivated && (
                      <span className="flex items-center gap-1 text-red-400 text-xs font-bold animate-pulse">
                        <HiOutlineStatusOnline /> LIVE
                      </span>
                    )}
                  </span>

                  {cls.latitude && cls.longitude && (
                    <div className="flex items-center align gap-px text-[10px] leading-none text-gray-400 font-mono bg-black/20 px-2 py-2 rounded border border-white/5">
                      <MdLocationOn className="text-gray-500 text-xs" />
                      <span>
                        {Number(cls.latitude).toFixed(4)},
                        {Number(cls.longitude).toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {cls.course_code}
                </h3>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <MdAccessTime /> 30 Min Window
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                {isActive && !attendanceStarted ? (
                  <Button
                    variant="primary"
                    onClick={() => handleStartAttendance(cls)}
                    disabled={issetAtdSessionLoading || activeAtdSession}
                  >
                    {issetAtdSessionLoading ? (
                      <Loader />
                    ) : activeAtdSession ? (
                      "View QR Code"
                    ) : (
                      "Start Session"
                    )}
                  </Button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-md text-sm font-semibold bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                  >
                    {isAtdActivated
                      ? "Session running elsewhere"
                      : "No Class Scheduled"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {(!userClasses || userClasses.length === 0) && (
          <div className="col-span-full py-20 text-center text-gray-500">
            No courses assigned to you yet.
          </div>
        )}
      </div>
    </div>
  );
}