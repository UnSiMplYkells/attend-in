import React from "react";
import Link from "next/link";
import { FiFileText, FiUsers, FiMonitor, FiPlusCircle } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";

export default function QuickActions() {
  const actions = [
    {
      title: "Start Session",
      desc: "Generate Class QR",
      href: "/class-rep/attendance/control",
      icon: BsQrCode,
      bg: "bg-blue-500/10 text-blue-500",
      border: "border-blue-500/20",
    },
    {
      title: "View Reports",
      desc: "Export past records",
      href: "/class-rep/attendance/reports",
      icon: FiFileText,
      bg: "bg-emerald-500/10 text-emerald-500",
      border: "border-emerald-500/20",
    },
    {
      title: "Class Roster",
      desc: "Manage all students",
      href: "/class-rep/all-students",
      icon: FiUsers,
      bg: "bg-indigo-500/10 text-indigo-500",
      border: "border-indigo-500/20",
    },
  ];

  return (
    <div className="p-5 rounded-xl border border-[var(--fg)]/10 bg-[var(--fg)]/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link href={action.href} key={index} className="block group">
              <div
                className={`p-4 rounded-lg border ${action.border} ${action.bg.replace("bg-", "bg-opacity-10 ")} transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex items-center text-left`}
              >
                <Icon className="w-6 h-6 mr-4" />
                <div>
                  <span className="font-semibold text-sm text-[var(--fg)]">
                    {action.title}
                  </span>
                  <span className="text-xs opacity-70 text-[var(--fg)] block">
                    {action.desc}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
