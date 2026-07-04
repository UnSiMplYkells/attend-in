"use client";

import React from "react";
import StatCards from "./components/dashboard/StatCards";
import DashboardCharts from "./components/dashboard/DashboardCharts";
import QuickActions from "./components/dashboard/QuickActions";
import { useDashboardData } from "@/hooks/query/useDashboard";
import { FiClock } from "react-icons/fi";

export default function ClassRepDashboard() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-pulse text-lg opacity-70">
        Loading dashboard data...
      </div>
    );
  }

  const { stats, charts, recentActivity } = data || {};

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10 px-4 sm:px-6 lg:px-8 pt-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm opacity-80 mt-1">
            Welcome back. You are currently managing{" "}
            <span className="font-semibold">
              {stats?.activeCourses || 0} active courses
            </span>
            .
          </p>
        </div>
      </div>

      <StatCards statsData={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Charts (Takes up 2/3 of the screen) */}
        <div className="xl:col-span-2 space-y-6">
          <DashboardCharts
            trendData={charts?.trendData}
            courseData={charts?.courseData}
            ratioData={charts?.ratioData}
          />
        </div>

        {/* Right Sidebar: Actions & Extra Info (Takes up 1/3) */}
        <div className="xl:col-span-1 space-y-6">
          <QuickActions />

          {/* A mini-card to fill the sidebar space */}
          <div className="p-5 rounded-xl border border-[var(--fg)]/10 bg-[var(--fg)]/5">
            <h3 className="text-sm font-semibold mb-3 opacity-70 uppercase tracking-wider">
              System Status
            </h3>
            <div className="flex items-center justify-between p-3 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
              <span className="text-sm font-medium">Location Services</span>
              <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 rounded-full">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Table at the bottom */}
      <div className="p-5 rounded-xl border border-[var(--fg)]/10 bg-[var(--fg)]/5">
        <div className="flex items-center gap-2 mb-6">
          <FiClock className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Recent Attendance Sessions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--fg)]/10 text-sm opacity-70">
                <th className="pb-3 pl-2">Course Code</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-emerald-500">Present</th>
                <th className="pb-3 text-red-500">Absent</th>
                <th className="pb-3">Total Expected</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity?.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-[var(--fg)]/5 hover:bg-[var(--fg)]/5 transition-colors"
                >
                  <td className="py-4 pl-2 font-bold">{session.course}</td>
                  <td className="py-4 text-sm opacity-80">{session.date}</td>
                  <td className="py-4 text-emerald-500 font-medium">
                    {session.present}
                  </td>
                  <td className="py-4 text-red-500 font-medium">
                    {session.absent}
                  </td>
                  <td className="py-4 opacity-70">{session.expected}</td>
                </tr>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <tr>
                  <td colSpan="5" className="text-center py-8 opacity-50">
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
