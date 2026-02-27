"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import { useGetUsersClasses } from "@/hooks/query/useClasses";
import { useGetActiveAtdSession } from "@/hooks/query/useAtdSessions";
import GridSkeleton from "@/app/(student)/class-rep/components/GridSkeleton";
import {
  MdInsights,
  MdClass,
  MdAccessTime,
  MdArrowForward,
} from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";

export default function ReportsPage() {
  const router = useRouter();
  const { setId, setHistoryId } = useStore();

  const { data: userClasses, isClassesLoading } = useGetUsersClasses();
  const userClassIds = userClasses?.map((c) => c.id) || [];

  const { activeAtdSession, isGetAtdSessionLoading } =
    useGetActiveAtdSession(userClassIds);

  // Identify if any of the user's classes are currently active
  const activeClass =
    activeAtdSession &&
    userClasses?.find((cls) => cls.id === activeAtdSession.class_id);

  function handleViewLiveReport() {
    if (!activeAtdSession) return;
    setId(activeAtdSession.id);
    
    router.push(`/class-rep/attendance/reports/${activeAtdSession.id}`);
  }

  function handleViewCourseHistory(cls) {
    setHistoryId(cls.id)
    router.push(
      `/class-rep/attendance/history/${cls.id}?courseCode=${cls.course_code}`,
    );
  }

  // if (isClassesLoading || isGetAtdSessionLoading) return <FullLoader />;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MdInsights className="text-indigo-400" />
          Attendance Reports
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor live attendance and review past records.
        </p>
      </div>

      {isClassesLoading || isGetAtdSessionLoading ? (
        <GridSkeleton count={6} />
      ) : (
        <>
          {activeClass && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Now
              </h2>
              <div
                onClick={handleViewLiveReport}
                className="group cursor-pointer relative overflow-hidden rounded-xl border border-indigo-500/30 bg-linear-to-br from-indigo-900/40 to-black/60 p-6 shadow-xl transition-all hover:border-indigo-400/50 hover:shadow-indigo-500/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20 flex items-center gap-1">
                        <HiOutlineStatusOnline /> LIVE SESSION
                      </span>
                      <span className="text-xs text-indigo-300 font-mono">
                        {activeClass.course_code}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {activeClass.course_name || "General Course"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                      <MdAccessTime /> Ends at{" "}
                      {new Date(activeAtdSession.window_end).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-semibold">
                      View Live Report
                    </span>
                    <MdArrowForward className="text-xl" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
              Your Courses
            </h2>

            {userClasses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {userClasses.map((cls) => (
                  <div
                    key={cls.id}
                    onClick={() => handleViewCourseHistory(cls)}
                    className="group relative flex flex-col justify-between p-5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/10 cursor-pointer"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                          <MdClass className="text-xl" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                        {cls.course_code}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {cls.course_name || "No description available"}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                      <span>View History</span>
                      <MdArrowForward className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                <p className="text-gray-400">No courses assigned to you yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
