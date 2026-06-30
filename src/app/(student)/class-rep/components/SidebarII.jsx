"use client";
import { useState, useEffect } from "react";
import useStore from "@/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { RiContactsBook3Fill, RiCalendarScheduleLine } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdControlPointDuplicate } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { HiHomeModern } from "react-icons/hi2";
import { GrHistory } from "react-icons/gr";
import { useGetUsersClasses } from "@/hooks/query/useClasses";
import { useGetActiveAtdSession } from "@/hooks/query/useAtdSessions";

const links = [
  {
    href: "/class-rep",
    icon: HiHomeModern,
    label: "Home",
  },
  {
    href: "/class-rep/attendance/control",
    icon: MdControlPointDuplicate,
    label: "Attendance Control",
  },
  {
    href: "/class-rep/attendance/reports",
    icon: BiSolidReport,
    label: "Attendance reports",
  },
  {
    href: "/class-rep/attendance/history",
    icon: GrHistory,
    label: "Attendance history",
  },
  {
    href: "/class-rep/courses",
    icon: AiOutlineSchedule,
    label: "courses",
  },
  {
    href: "/class-rep/timetable",
    icon: RiCalendarScheduleLine,
    label: "timetable",
  },
  {
    href: "/class-rep/all-students",
    icon: RiContactsBook3Fill,
    label: "All Students",
  },
  {
    href: "/class-rep/uploads",
    icon: IoMdCloudUpload,
    label: "uploads",
  },
];

export default function SidebarII() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: userClasses, isClassesLoading } = useGetUsersClasses();
  const userClassIds = userClasses?.map((c) => c.id) || [];

  const { activeAtdSession } = useGetActiveAtdSession(userClassIds);


  function getLinkClasses(path) {
    const isActive = pathname.startsWith(path);
    const isHistory = path.endsWith("/history"); //

    if (isActive)
      return "flex items-center gap-1 p-3 transition-all duration-200 group text-white bg-black/60";

    // Apply text-gray-600 to history if not active, otherwise use default gray
    const textColor = isHistory ? "text-gray-500/80" : "text-gray-300/90";

    return `flex items-center gap-1 pt-3 pb-3 pr-3 pl-0 transition-all duration-200 group ${textColor} hover:bg-white/10 hover:text-white`;
  };

  const collapsedWidth = "w-[50px]";
  const expandedWidth = "w-[190px]"; 

  return (
    <div
      className={`flex flex-col h-full transition-all duration-300 ease-in-out border-r border-white/5 ${
        isExpanded ? expandedWidth : collapsedWidth
      }`}
    >
      <div className="flex justify-center mb-2 border-b border-white/5 shrink-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className=" p-3 text-gray-400 hover:text-white hover:bg-black/60 transition-colors"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <GoSidebarExpand className="text-2xl" />
          ) : (
            <GoSidebarCollapse className="text-2xl" />
          )}
        </button>
      </div>

      <nav className="flex flex-col flex-1 overflow-y-auto scrollbar-hide">
        {/* {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setIsExpanded(false)}
            className={`${getLinkClasses(link.href)} 
                ${isExpanded ? "justify-start" : "justify-center"}
                ${link.href === "/class-rep/attendance/history" && "pointer-events-none"}
              `}
            title={!isExpanded ? link.label : ""}
          >
            <link.icon className="text-2xl min-w-6 shrink-0" />

            <span
              className={`font-medium text-sm transition-opacity duration-200 delay-100 ${
                isExpanded ? "opacity-100 ml-2" : "opacity-0 w-0 hidden"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))} */}
        {links.map((link) => {
          const isHistory = link.href === "/class-rep/attendance/history";

          return (
            <div
              key={link.label}
              // Use the native title attribute on this wrapper to show the tooltip
              title={
                isHistory
                  ? "Go through the reports page"
                  : !isExpanded
                    ? link.label
                    : ""
              }
              className="w-full"
            >
              <Link
                href={link.href}
                onClick={() => setIsExpanded(false)}
                className={`${getLinkClasses(link.href)} 
            ${isExpanded ? "justify-start" : "justify-center"}
            ${isHistory && "pointer-events-none"} 
          `}
              >
                <link.icon className="text-2xl min-w-6 shrink-0" />
                <span
                  className={`font-medium text-sm transition-opacity duration-200 delay-100 ${
                    isExpanded ? "opacity-100 ml-2" : "opacity-0 w-0 hidden"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
