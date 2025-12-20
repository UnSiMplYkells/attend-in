"use client";
import { useState } from "react";
import FullLoader from "@/app/components/ui/FullLoader";
import { useUser } from "@/hooks/query/useUser";
import { FiSearch, FiFilter, FiEdit2, FiPlus, FiBell } from "react-icons/fi";
import { useGetStudents } from "@/hooks/query/useStudents";
import highlightText from "@/app/helper/searchHighlight";
import Button from "@/app/components/ui/Button";
import EditDeviceModalModal from "../components/EditDeviceModal";


  //make it so that each device change can only be allowed every 7 days.
  //if it changes today, it can only change that user in the next 7 days again.
  //add changed date in column supabase db, and check it against date.now, if >7, then allow, if not, deny with a toast


  //fully implement filter feature so it can get students based on their class
  //make both full list downloadable, and also list of filtered class downloadable


export default function StudentsPage() {
  const { user, isAuthenticated, isLoading: isUserLoading } = useUser();
  const classRepDept = user?.profile?.department;

  const [open, setOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 20;

  const { students, count, isStudentsLoading, isPlaceholderData } =
    useGetStudents(classRepDept, currentPage, searchTerm);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  function getPageNumbers() {
    const pageNumbers = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    pageNumbers.push(1);

    if (currentPage > 4) {
      pageNumbers.push("...");
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 4) {
      pageNumbers.push("...");
    }

    pageNumbers.push(totalPages);

    return [...new Set(pageNumbers)];
  }

  function handlePrevious() {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }

  function handleNext() {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }

  function handleEdit(student) {
    console.log("Edit student at index:", student.matric_number);
    setSelectedStudent(student);
    setOpen(true);
  }

  if (isUserLoading) return <FullLoader />;

  return (
    <>
      <div className="flex flex-col h-full bg-black/80 text-white">
        <div className="flex-none bg-[#d3ad68]/10 px-4 sm:px-6 lg:px-8 py-3 border-b border-white/5 flex items-center justify-between z-30">
          <div className="flex items-center  justify-between flex-1">
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
                className="block w-full rounded-sm outline-none bg-transparent focus:bg-white/10 py-2 pl-9 pr-3 text-white placeholder:text-gray-400 sm:text-md sm:leading-6"
                placeholder="Search name or matric no..."
              />
            </div>
            <div className="hidden lg:block">
              <Button width="w-fit" padding="px-3 py-2" variant="primary">
                + Add Student
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4"></div>
        </div>

        <div className="flex-1 overflow-auto no-scrollbar">
          <div className="sticky left-0 px-4 sm:px-6 lg:px-8 py-6 border-b border-white/5">
            <div className="flex flex-col [@media(min-width:540px)]:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold leading-6 text-white">
                  Students
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                  A list of all the students in your department with their Name,
                  Matric Number, and Role.
                </p>
              </div>
              <div className="mt-4 sm:ml-5 sm:mt-0 flex [@media(max-width:540px)]:flex-row flex-col items-center gap-3">
                <div className="block lg:hidden">
                  <Button width="w-fit" padding="px-3 py-2" variant="primary">
                    + Add Student
                  </Button>
                </div>

                <div className="relative block">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiFilter
                      className="size-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    name="filter"
                    id="filter"
                    className="block w-full rounded-sm border-0 bg-white/5 py-1.5 pl-10 pr-3 text-white focus:bg-white sm:text-sm sm:leading-6 placeholder:text-gray-500"
                    placeholder="Filter (e.g. COS101)..."
                  />
                </div>
              </div>
            </div>
          </div>

          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className=" bg-black/50 backdrop-blur-md text-white sticky top-0 z-20 shadow-sm ring-1 ring-white/5">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 font-semibold sm:pl-6 lg:pl-8"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 font-semibold hidden sm:table-cell"
                >
                  Matric Number
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 font-semibold hidden lg:table-cell"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 font-semibold hidden md:table-cell"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0f172a]">
              {isStudentsLoading || isPlaceholderData ? (
                <tr>
                  <td colSpan="5">
                    <FullLoader />
                  </td>
                </tr>
              ) : (
                students?.map((student, idx) => (
                  <tr
                    key={student.id || idx}
                    // ADDED: even:bg-white/[0.02] for striped effect
                    className="even:bg-white/2 hover:bg-white/5 transition-colors duration-150"
                  >
                    <td className="py-4 pl-4 pr-3 sm:pl-4 lg:pl-8">
                      <div className="flex items-center gap-x-4">
                        <div className="truncate font-medium text-white">
                          {highlightText(student.full_name, searchTerm)}
                          <div className="font-normal text-gray-500 sm:hidden mt-0.5">
                            {highlightText(student.matric_number, searchTerm)}
                          </div>
                          <div className="font-normal text-gray-500 lg:hidden mt-0.5">
                            {student.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-gray-400 hidden sm:table-cell">
                      {highlightText(student.matric_number, searchTerm)}
                    </td>
                    <td className="px-3 py-4 text-gray-400 hidden lg:table-cell">
                      {student.department}
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          student.role === "Class Rep"
                            ? "bg-purple-400/10 text-purple-400 ring-purple-400/30"
                            : "bg-green-400/10 text-green-400 ring-green-400/30"
                        }`}
                      >
                        student
                      </span>
                    </td>
                    <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                      <button
                        onClick={() => handleEdit(student, idx)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-black/10 backdrop-blur-sm flex-none border-t border-white/20 px-4 py-3 sm:px-6 z-30">
          <div className="flex items-center justify-between sm:hidden">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1 || isStudentsLoading}
              className="relative inline-flex items-center rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages || isStudentsLoading}
              className="relative ml-3 inline-flex items-center rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing page{" "}
                <span className="font-medium text-white">{currentPage}</span> of{" "}
                <span className="font-medium text-white">{totalPages}</span> (
                {count} total students)
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {getPageNumbers().map((pageNum, idx) =>
                  pageNum === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-white/10 focus:outline-offset-0"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-white/10 focus:z-20 ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <EditDeviceModalModal
        open={open}
        setOpen={setOpen}
        student={selectedStudent}
      />
    </>
  );
}
