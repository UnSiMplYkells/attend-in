"use client";
import { useState, useMemo } from "react";
import { FiBook, FiSearch } from "react-icons/fi";
import { useGetUsersClasses } from "@/hooks/query/useClasses";
import highlightText from "@/app/helper/searchHighlight";
import Link from "next/link";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: courses, isUsersClassesLoading } = useGetUsersClasses();

  // Local search logic: Filters courses by code or title
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (!searchTerm) return courses;

    const lowerSearch = searchTerm.toLowerCase();
    return courses.filter(
      (course) =>
        course.course_code?.toLowerCase().includes(lowerSearch) ||
        course.course_title?.toLowerCase().includes(lowerSearch),
    );
  }, [courses, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-black/80 text-white">
      <div className="flex-none bg-[#d3ad68]/5 px-4 sm:px-6 lg:px-8 py-4 border-b border-white/5 flex items-center justify-between z-30">
        <div className="flex items-center justify-between flex-1">
          <div className="relative w-full max-w-[500px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border-0 bg-white/5 py-2 pl-10 pr-3 text-white shadow-sm ring-1 ring-inset ring-white/10  sm:text-sm sm:leading-6 transition-all"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 pt-2 sm:p-8 sm:pt-2">
        <div className="sticky top-0 left-0 px-4 sm:px-6 lg:px-8 pb-6 border-b border-white/5 z-20 bg-black/40 backdrop-blur-md -mx-6 sm:-mx-8 px-6 sm:px-8 mb-6 pt-4">
          <div className="flex flex-col [@media(min-width:540px)]:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold leading-6 text-white flex items-center gap-2">
                <FiBook className="text-[#d3ad68]" />
                Registered Courses
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                A complete list of courses assigned to your class, including
                geolocation constraints and lecturers.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses?.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden flex flex-col justify-between bg-black/20 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-lg animate-pulse min-h-[220px]"
                >
                  {/* Header Skeleton */}
                  <div className="mb-5">
                    <div className="h-6 w-24 bg-white/10 rounded-md"></div>
                  </div>

                  {/* Body Skeleton */}
                  <div className="space-y-5 mb-8 flex-grow">
                    <div>
                      <div className="h-2.5 w-20 bg-white/5 rounded mb-3"></div>
                      <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
                      <div className="h-4 w-2/3 bg-white/10 rounded"></div>
                    </div>
                  </div>

                  {/* Footer Skeleton */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="h-4 w-32 bg-white/5 rounded"></div>
                    <div className="h-7 w-7 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              ))
            : filteredCourses?.map((course, idx) => (
                <Link
                  href={`/class-rep/courses/${course.course_code}/${course.id}`}
                  key={course.id || idx}
                  className="relative overflow-hidden group flex flex-col justify-between bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 shadow-lg"
                >
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-blue-400/30 group-hover:scale-110"></div>
                  <div className="relative z-10 flex items-start justify-between mb-5 gap-4">
                    <h3 className="font-bold text-xl text-white tracking-tight truncate">
                      {highlightText(course.course_code || "N/A", searchTerm)}
                    </h3>
                  </div>

                  <div className="relative z-10 space-y-5 mb-8 flex-grow">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                        Course Title
                      </p>
                      <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed">
                        {highlightText(
                          course.course_title || "N/A",
                          searchTerm,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400 group-hover:text-blue-300 transition-colors duration-300">
                      View Enrolled Students
                    </span>
                    <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors duration-300">
                      <svg
                        className="w-4 h-4 text-blue-400 md:opacity-0 md:group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-md flex-none border-t border-white/10 px-4 py-3 sm:px-6 z-30">
        <p className="text-sm text-gray-400">
          Showing{" "}
          <span className="font-semibold text-white">
            {isUsersClassesLoading ? "..." : filteredCourses?.length || 0}
          </span>{" "}
          courses
        </p>
      </div>
    </div>
  );
}
