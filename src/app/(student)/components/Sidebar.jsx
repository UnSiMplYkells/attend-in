"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NameComp from "./NameComp";
import { TbZoomScan } from "react-icons/tb";
import { GrHistory } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { RiAdminFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { GoSidebarCollapse } from "react-icons/go";
import { IoClose } from "react-icons/io5";

export default function Sidebar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const links = [
    { 
      href: "/dashboard", 
      icon: MdDashboard, 
      label: "Dashboard" 
    },
    { 
      href: "/attendance/scan", 
      icon: TbZoomScan, 
      label: "Scan" 
    },
    { 
      href: "/attendance/history", 
      icon: GrHistory, 
      label: "History" 
    },
    { 
      href: "/profile", 
      icon: ImProfile, 
      label: "Profile" 
    },
    { 
      href: "/class-rep", 
      icon: RiAdminFill, 
      label: "Admin" 
    },
  ];

  const getLinkClasses = (path) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 p-3 rounded-sm transition-all duration-200 group ${
      isActive
        ? " text-white bg-white/20 shadow-md shadow-white/20"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-center sm:hidden py-4 border-b border-white/5">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <GoSidebarCollapse className="text-2xl" />
          </button>
        </div>

        <nav className="flex flex-col pt-3 md:ml-3 gap-2 flex-1 mt-4 sm:mt-0">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={getLinkClasses(link.href)}
              title={link.label}
            >
              <link.icon className="text-2xl shrink-0" />
              <span className="hidden sm:block font-medium text-sm">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="pb-4 sm:pl-4 border-t border-white/5">
          <NameComp isDrawerOpen={isDrawerOpen} collapsedOnMobile={true} />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div
        className={`fixed left-0 top-0 bottom-0 z-50 bg-[#161e32] border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out sm:hidden
          w-[95%] 
          [@media(min-width:410px)_and_(max-width:539px)]:w-[75%] 
          [@media(min-width:540px)_and_(max-width:639px)]:w-[55%]
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <span className="text-lg font-bold text-white">Menu</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-md"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>

          <nav className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)}
                className={getLinkClasses(link.href)}
              >
                <link.icon className="text-2xl" />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/20 bg-[#0f172a]/50">
            <NameComp isDrawerOpen={isDrawerOpen} collapsedOnMobile={false} />
          </div>
        </div>
      </div>
    </>
  );
}