"use client";
import { useState, useMemo } from "react";
import { FiSearch, FiBook } from "react-icons/fi";
import { useGetUsersClasses } from "@/hooks/query/useClasses";
import Button from "@/app/components/ui/Button";
import FullLoader from "@/app/components/ui/FullLoader";
import highlightText from "@/app/helper/searchHighlight";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch courses using your existing hook
  const { data: courses, isUsersClassesLoading } = useGetUsersClasses();

  // Local search logic: Filters courses by code or title
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (!searchTerm) return courses;

    const lowerSearch = searchTerm.toLowerCase();
    return courses.filter(
      (course) =>
        course.course_code?.toLowerCase().includes(lowerSearch) ||
        course.course_title?.toLowerCase().includes(lowerSearch), // Adjust 'course_title' to match your DB schema
    );
  }, [courses, searchTerm]);

  if (isUsersClassesLoading) return <FullLoader />;

  return (
    <div className="flex flex-col h-full bg-black/80 text-white">
      {/* Top Action Bar */}
      <div className="flex-none bg-[#d3ad68]/10 px-4 sm:px-6 lg:px-8 py-3 border-b border-white/5 flex items-center justify-between z-30">
        <div className="flex items-center justify-between flex-1">
          <div className="relative w-full max-w-[480px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
              <FiSearch className="size-5 text-gray-300" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-sm outline-none bg-transparent focus:bg-white/10 py-2 pl-9 pr-3 text-white placeholder:text-gray-400 sm:text-md sm:leading-6 transition-colors duration-200"
              placeholder="Search course code or title..."
            />
          </div>
          {/* <div className="hidden lg:block">
            <Button width="w-fit" padding="px-3 py-2" variant="primary">
              + Add Course
            </Button>
          </div> */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto no-scrollbar">
        {/* Page Header */}
        <div className="sticky left-0 px-4 sm:px-6 lg:px-8 py-6 border-b border-white/5">
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
            {/* Mobile Add Button */}
            <div className="mt-4 sm:ml-5 sm:mt-0 flex [@media(max-width:540px)]:flex-row flex-col items-center gap-3">
              {/* <div className="block lg:hidden w-full">
                <Button width="w-full" padding="px-3 py-2" variant="primary">
                  + Add Course
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black/50 backdrop-blur-md text-white sticky top-0 z-20 shadow-sm ring-1 ring-white/5">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 font-semibold sm:pl-6 lg:pl-8"
              >
                Course Code
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 font-semibold hidden sm:table-cell"
              >
                Course Title
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 font-semibold hidden md:table-cell"
              >
                Location (Lat, Long)
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 font-semibold hidden lg:table-cell"
              >
                Lecturer
              </th>
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
              >
                <span className="sr-only">Manage</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#0f172a]">
            {filteredCourses?.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-400">
                  No courses found matching your search.
                </td>
              </tr>
            ) : (
              filteredCourses?.map((course, idx) => (
                <tr
                  key={course.id || idx}
                  className="even:bg-white/2 hover:bg-white/5 transition-colors duration-150 group"
                >
                  <td className="py-4 pl-4 pr-3 sm:pl-4 lg:pl-8">
                    <div className="flex items-center gap-x-4">
                      <div className="truncate font-medium text-white">
                        {highlightText(course.course_code || "N/A", searchTerm)}
                        {/* Mobile fallbacks */}
                        <div className="font-normal text-gray-500 sm:hidden mt-0.5 truncate max-w-[200px]">
                          {highlightText(
                            course.course_title || "No Title",
                            searchTerm,
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-gray-300 hidden sm:table-cell whitespace-normal max-w-[250px]">
                    {highlightText(course.course_title || "N/A", searchTerm)}
                  </td>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                      {course.latitude && course.longitude
                        ? `${Number(course.latitude).toFixed(4)}, ${Number(course.longitude).toFixed(4)}`
                        : "Not Set"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-gray-400 hidden lg:table-cell">
                    {course.lecturer || "Unassigned"}
                  </td>
                  <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                    <button className="text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Status Bar (Since pagination isn't strictly needed for a small list) */}
      <div className="bg-black/10 backdrop-blur-sm flex-none border-t border-white/20 px-4 py-3 sm:px-6 z-30">
        <p className="text-sm text-gray-400">
          Showing{" "}
          <span className="font-medium text-white">
            {filteredCourses?.length || 0}
          </span>{" "}
          courses
        </p>
      </div>
    </div>
  );
}
