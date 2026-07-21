import React from "react";
import {
  FiUsers,
  FiBookOpen,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

export default function StatCards({ statsData }) {
  const stats = [
    {
      title: "Total Students",
      value: statsData?.totalStudents || 0,
      icon: FiUsers,
      color: "text-blue-500",
    },
    {
      title: "Active Courses",
      value: statsData?.activeCourses || 0,
      icon: FiBookOpen,
      color: "text-indigo-500",
    },
    {
      title: "Avg. Attendance",
      value: statsData?.avgAttendance || "0%",
      icon: FiCheckCircle,
      color: "text-emerald-500",
    },
    {
      title: "Avg. Attendance",
      value: statsData?.avgAttendance || "0%",
      icon: FiCheckCircle,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        if (stat.title === "Flagged Students") return null;
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="p-4 rounded-xl border border-[var(--fg)]/10 bg-[var(--fg)]/5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-80">{stat.title}</h3>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
