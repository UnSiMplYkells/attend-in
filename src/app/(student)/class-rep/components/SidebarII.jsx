"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";
import { RiContactsBook3Fill } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdControlPointDuplicate } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { useState } from "react";


export default function SidebarII() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const links = [
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
      href: "/class-rep/courses",
      icon: AiOutlineSchedule,
      label: "courses",
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

  const getLinkClasses = (path) => {
    const isActive = pathname === path;
    return `flex items-center gap-1 p-3 transition-all duration-200 group ${
      isActive
        ? " text-white bg-black/60"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;
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
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setIsExpanded(false)}
            className={`${getLinkClasses(link.href)} ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
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
        ))}
      </nav>

    </div>
  );
}
