"use client";
import { useState } from "react";
import { useGetAtdRecord } from "@/hooks/query/useAtdRecord";
import FullLoader from "@/app/components/ui/FullLoader";
import Button from "@/app/components/ui/Button";
import {
  MdDateRange,
  MdAccessTime,
  MdPeople,
  MdCheckCircle,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import highlightText from "@/app/helper/searchHighlight";
import { CiExport } from "react-icons/ci";


export default function ReportDetails({ reportsId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: atdRecord, isGetAtdRecordLoading } = useGetAtdRecord(reportsId);

  const sessionInfo = atdRecord?.[0]?.attendance_sessions;
  const courseCode = sessionInfo?.classes?.course_code || "Unknown Course";
  const sessionDate = sessionInfo?.window_start
    ? new Date(sessionInfo.window_start).toLocaleDateString()
    : "-";
  const classStart = sessionInfo?.window_start;
  const classEnd = sessionInfo?.window_end;

  const nowISO = new Date().toISOString();
  const isSessionEnded = classEnd ? nowISO > classEnd : false;

  const filteredRecords = atdRecord?.filter((record) => {
    const term = searchTerm.toLowerCase();
    return (
      record.users?.full_name?.toLowerCase().includes(term) ||
      record.users?.students_registry?.matric_number
        ?.toLowerCase()
        .includes(term)
    );
  });

  // Download Logic
  function handleDownload() {
    if (!atdRecord || atdRecord.length === 0) return;

    const headers = [
      "Full Name",
      "Matric Number",
      "Department",
      "Time Marked",
      "Distance (m)",
      "Status",
    ];

    const rows = atdRecord.map((record) => {
      const user = record.users;
      const reg = user?.students_registry;
      const timeMarked = new Date(record.marked_at).toLocaleTimeString();
      const distance = Math.round(record.distance_frm_hall);

      return [
        `"${user?.full_name || ""}"`, // Quote strings to handle commas
        `"${reg?.matric_number || ""}"`,
        `"${reg?.department || ""}"`,
        timeMarked,
        distance,
        "Present",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${courseCode}_Attendance_${sessionDate}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isGetAtdRecordLoading) return <FullLoader />;
  if (!atdRecord)
    return (
      <div className="text-center p-10 text-gray-400">
        No records found for this session.
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-black/80 text-white">
      <div className="flex-none bg-[#0f172a] border-b border-white/5 px-6 py-6 z-30">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {courseCode}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    !isSessionEnded
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  }`}
                >
                  {!isSessionEnded ? "Active Session" : "Completed"}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MdDateRange /> {sessionDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <MdPeople /> {atdRecord.length} Present
                </span>
                {classStart && classEnd && (
                  <span className="flex items-center gap-1.5">
                    <MdAccessTime />{" "}
                    {new Date(classStart).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(classEnd).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full sm:w-64 rounded-md border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:bg-white/10 focus:outline-none transition-all"
                />
              </div>

              <div className="w-full sm:w-auto">
                {isSessionEnded ? (
                  <Button
                    variant="primary"
                    padding="px-4 py-2"
                    onClick={handleDownload}
                  >
                    <div className="flex items-center gap-2">
                      <CiExport className="text-lg" />
                      <span>Export CSV</span>
                    </div>
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    padding="px-4 py-2"
                    disabled={true}
                  >
                    <div className="flex items-center gap-2">
                      <MdAccessTime className="text-lg" />
                      <span>Session Active</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto bg-white/5 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/50 backdrop-blur-md text-white sticky top-0 z-20 shadow-sm ring-1 ring-white/5">
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
                  className="px-3 py-3.5 font-semibold hidden xl:table-cell"
                >
                  Distance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0f172a]/50">
              {filteredRecords?.length > 0 ? (
                filteredRecords.map((record, idx) => (
                  <tr
                    key={record.id || idx}
                    className="even:bg-white/2 hover:bg-white/5 transition-colors duration-150"
                  >
                    <td className="py-4 pl-4 pr-3 sm:pl-6 lg:pl-8 max-w-0 sm:max-w-xs">
                      <div className="font-medium text-white min-w-0">
                        <div className="truncate">
                          {highlightText(record.users?.full_name, searchTerm)}
                        </div>

                        <div className="font-normal text-gray-500 sm:hidden mt-0.5 truncate">
                          {highlightText(
                            record.users?.students_registry?.matric_number,
                            searchTerm,
                          )}
                        </div>

                        <div className="font-normal text-gray-500 lg:hidden mt-0.5 truncate">
                          {record.users?.students_registry?.department}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-gray-400 hidden sm:table-cell">
                      {highlightText(
                        record.users?.students_registry?.matric_number,
                        searchTerm,
                      )}
                    </td>

                    <td className="px-3 py-4 text-gray-400 hidden lg:table-cell">
                      {record.users?.students_registry?.department}
                    </td>

                    <td className="px-3 py-4 text-gray-400 hidden xl:table-cell">
                      {Math.round(record.distance_frm_hall)}m
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No students match your search.
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
