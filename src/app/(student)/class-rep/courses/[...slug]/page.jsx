"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiSearch,
  FiUsers,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import { useParams } from "next/navigation";
import Button from "@/app/components/ui/Button";
import { useGetClassStudents } from "@/hooks/query/useStudents";
import { useDebounce } from "@/hooks/useDebounce";
import highlightText from "@/app/helper/searchHighlight";
import Papa from "papaparse";
import RemoveStudentModal from "@/app/(student)/class-rep/components/coursesPgModal/RemoveStudentModal";
import AddStudentModal from "@/app/(student)/class-rep/components/coursesPgModal/AddStudentModal";
import { useRemoveStudentFromCourse } from "@/hooks/query/useRoster";
import toast from "react-hot-toast";
import { getAllClassStudents } from "@/lib/server/students";

export default function CourseDetailsPage() {
  const params = useParams();
  const [courseCode, courseId] = params.slug;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const itemsPerPage = 20;

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  const {
    allClassStudents,
    count,
    isAllClassStudentsLoading,
    isPlaceholderData,
  } = useGetClassStudents(
    courseCode,
    courseId,
    currentPage,
    debouncedSearchTerm,
  );

  const removeMutation = useRemoveStudentFromCourse();

  const [isExporting, setIsExporting] = useState(false);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Pagination Logic
  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  function handlePrevious() {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }

  function handleNext() {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }

  function handleAddStudent() {
    setIsAddModalOpen(true);
  }

  function promptRemoveStudent(student) {
    setStudentToRemove(student);
    setIsRemoveModalOpen(true);
  }

  function confirmRemoveStudent() {
    if (!studentToRemove) return;

    removeMutation.mutate(
      {
        courseId: courseId,
        studentId: studentToRemove.student_id,
      },
      {
        onSuccess: () => {
          setIsRemoveModalOpen(false);
          setStudentToRemove(null);
          toast.success("Student removed successfully!")
        },
        onError: (error) => {
          console.error("Failed to remove student:", error);
          toast.error("Failed to remove student");
        },
      },
    );
  }

  async function handleExportCSV() {
    try {
      setIsExporting(true);
      const toastId = toast.loading("Preparing CSV...");

      // 1. Fetch the data directly from the server ONLY when clicked
      const exportData = await getAllClassStudents(courseId);

      // 2. Safety check
      if (!exportData || exportData.length === 0) {
        toast.dismiss(toastId);
        toast.error("No data available to export.");
        return;
      }

      // 3. Format the data safely
      const csvData = [...exportData]
        .sort((a, b) => {
          const nameA = a.users?.full_name || "";
          const nameB = b.users?.full_name || "";
          return nameA.localeCompare(nameB);
        })
        .map((student) => ({
          Name: student.users?.full_name || "Unknown",
          "Matric No": student.users?.matric_number || "Unknown",
        }));

      // 4. Generate and download CSV
      const csvString = Papa.unparse(csvData);
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Class_List_${courseCode}.csv`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success("Download successful!");
    } catch (error) {
      console.error("Export Error:", error);
      toast.dismiss();
      toast.error("Failed to generate CSV file.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <>
      <div className="flex flex-col h-full bg-black/80 text-white">
        <div className="flex-none bg-transparent px-4 sm:px-6 lg:px-8 py-5 border-b border-white/5 z-30">
          <Link
            href="/class-rep/courses"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-center gap-4 mt-2">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                {courseCode}
                <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Roster
                </span>
              </h1>
              {count !== undefined && (
                <span className="text-sm text-gray-400 border-l border-white/20 pl-4">
                  {count} Enrolled
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:max-w-xs xl:max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-sm outline-none bg-black/20 focus:bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white border border-white/10 transition-colors placeholder:text-gray-500"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                <button
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <FiDownload className="size-4" />
                  <span className="sm:hidden inline-block">Export</span>.csv
                </button>
                <div className="w-full">
                  <Button
                    width="w-full"
                    padding="px-3 py-1"
                    variant="primary"
                    onClick={handleAddStudent}
                  >
                    + Add{" "}
                    <span className="sm:hidden inline-block ml-1">student</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto no-scrollbar">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/50 backdrop-blur-md text-white sticky top-0 z-20 shadow-sm ring-1 ring-white/5">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 font-semibold sm:pl-6 lg:pl-8"
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 font-semibold hidden md:table-cell"
                >
                  Matric Number
                </th>
                <th
                  scope="col"
                  className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 bg-transparent">
              {isAllClassStudentsLoading || isPlaceholderData ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="py-4 pl-4 pr-3 sm:pl-6 lg:pl-8">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 bg-white/10 rounded-md w-48 sm:w-64"></div>
                        <div className="h-3 bg-white/5 rounded-md w-32 md:hidden"></div>
                      </div>
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <div className="h-4 bg-white/10 rounded-md w-32"></div>
                    </td>
                    <td className="relative py-4 pl-3 pr-4 text-right sm:pr-6 lg:pr-8">
                      <div className="flex justify-end">
                        <div className="h-8 bg-white/10 rounded-md w-24"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : allClassStudents?.length === 0 ? (
                <tr>
                  <td colSpan="3">
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <FiUsers className="w-12 h-12 text-white/10 mb-4" />
                      <p>
                        {debouncedSearchTerm
                          ? `No students found matching "${debouncedSearchTerm}"`
                          : "No students currently enrolled in this course."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                allClassStudents?.map((student, idx) => (
                  <tr
                    key={student.id || idx}
                    className="even:bg-transparent odd:bg-white/[0.03] hover:bg-white/10 transition-colors duration-150"
                  >
                    <td className="py-4 pl-4 pr-3 sm:pl-6 lg:pl-8">
                      <div className="font-medium text-white">
                        {highlightText(
                          student.users.full_name,
                          debouncedSearchTerm,
                        )}
                        <div className="font-normal text-gray-400 md:hidden mt-0.5 text-xs font-mono">
                          {highlightText(
                            student.users.matric_number,
                            debouncedSearchTerm,
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-gray-400 font-mono text-sm hidden md:table-cell">
                      {highlightText(
                        student.users.matric_number,
                        debouncedSearchTerm,
                      )}
                    </td>
                    <td className="relative py-4 pl-3 pr-4 text-right sm:pr-6 lg:pr-8">
                      <button
                        onClick={() => promptRemoveStudent(student)}
                        className="inline-flex items-center justify-center gap-1.5 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all font-mono text-xs font-medium cursor-pointer"
                        title="Remove student"
                      >
                        <span className="hidden sm:inline-block">- remove</span>
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-black/10 backdrop-blur-sm flex-none border-t border-white/20 px-4 py-3 sm:px-6 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1 || isAllClassStudentsLoading}
              className="relative inline-flex items-center rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages || isAllClassStudentsLoading}
              className="relative inline-flex items-center rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <RemoveStudentModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        studentName={studentToRemove?.users?.full_name}
        courseCode={courseCode}
        onConfirm={confirmRemoveStudent}
      />

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        courseCode={courseCode}
        courseId={courseId}
      />
    </>
  );
}