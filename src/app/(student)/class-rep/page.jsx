"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import StatCards from "./components/dashboard/StatCards";
import DashboardCharts from "./components/dashboard/DashboardCharts";
import QuickActions from "./components/dashboard/QuickActions";
import { useClassRepDashboardStats } from "@/hooks/query/useClassRepDashboardStats";
import { useGetActiveAtdSession } from "@/hooks/query/useAtdSessions";
import { useGetUsersClasses } from "@/hooks/query/useClasses";
import FullLoader from "@/app/components/ui/FullLoader";
import { MdDashboard, MdAccessTime, MdArrowForward } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";

export default function ClassRepDashboard() {
  const router = useRouter();
  const { setId } = useStore();
  const { data, isLoading } = useClassRepDashboardStats();

  const { data: userClasses, isClassesLoading } = useGetUsersClasses();
  const userClassIds = userClasses?.map((c) => c.id) || [];

  const { activeAtdSession, isGetAtdSessionLoading } =
    useGetActiveAtdSession(userClassIds);

  const activeClass =
    activeAtdSession &&
    userClasses?.find((cls) => cls.id === activeAtdSession.class_id);

  function handleViewLiveReport() {
    if (!activeAtdSession) return;
    setId(activeAtdSession.id);
    router.push(`/class-rep/attendance/reports/${activeAtdSession.id}`);
  }

  if (isLoading || isClassesLoading || isGetAtdSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FullLoader />
      </div>
    );
  }

  const { stats, charts, recentActivity } = data || {};
  const displaySessions = recentActivity?.slice(0, 5) || [];

  function handleSessionClick(session) {
    setId(session.id);
    router.push(`/class-rep/attendance/reports/${session.id}`);
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full flex flex-col gap-8">
      <div className="relative pb-5 mb-2">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MdDashboard className="text-indigo-400" />
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Overview of your activities and statistics as a Class Rep.
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
        <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-indigo-500 blur-sm" />
      </div>

      {activeClass && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
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
                  {activeClass.course_title || "General Course"}
                </h3>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                  <MdAccessTime /> Ends at{" "}
                  {new Date(activeAtdSession.window_end).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span className="text-sm font-semibold">View Live Report</span>
                <MdArrowForward className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      )}

      <StatCards statsData={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <DashboardCharts
            trendData={charts?.trendData}
            courseData={charts?.courseData}
            ratioData={charts?.ratioData}
          />
        </div>

        <div className="xl:col-span-1 space-y-6">
          <QuickActions />
        </div>
      </div>

      <div className="p-5 rounded-xl border border-white/5 bg-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MdAccessTime className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Recent Attendance Sessions</h3>
          </div>
          {recentActivity?.length > 5 && (
            <button
              onClick={() => router.push("/class-rep/attendance/reports")}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10 text-sm text-gray-400">
                <th className="pb-3 pl-2 font-normal">Course Code</th>
                <th className="pb-3 font-normal">Date</th>
                <th className="pb-3 font-normal text-emerald-400">Present</th>
                <th className="pb-3 font-normal text-red-400">Absent</th>
              </tr>
            </thead>
            <tbody>
              {displaySessions.map((session) => (
                <tr
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <td className="py-4 pl-2 font-bold text-white">{session.course}</td>
                  <td className="py-4 text-sm text-gray-300">{session.date}</td>
                  <td className="py-4 text-emerald-400 font-medium">
                    {session.present}
                  </td>
                  <td className="py-4 text-red-400 font-medium">
                    {session.absent}
                  </td>
                </tr>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <tr>
                  <td colSpan="4" className="text-center py-8 opacity-50">
                    No recent sessions found. Start a class to see data here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
