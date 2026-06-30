// src/app/(student)/class-rep/attendance/history/[historyId]/HistoryDetails.jsx
"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetSessionsByClassId } from "@/hooks/query/useAtdSessions";
import { utils, writeFile } from "xlsx";
import { useDebounce } from "@/hooks/useDebounce";
import highlightText from "@/app/helper/searchHighlight";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Button from "@/app/components/ui/Button";
import { CiExport } from "react-icons/ci";
import { MdDateRange, MdPeople, MdTrendingUp } from "react-icons/md";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import Link from "next/link";

const SkeletonStats = () => (
  <div className="flex gap-4 animate-pulse">
    <div className="h-8 w-32 bg-white/10 rounded"></div>
    <div className="h-8 w-40 bg-white/10 rounded"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="w-full h-[250px] bg-white/5 rounded-xl animate-pulse border border-white/5 mt-6"></div>
);

const SkeletonTable = () => (
  <div className="animate-pulse flex flex-col gap-2 p-4">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="h-12 w-full bg-white/5 rounded-md"></div>
    ))}
  </div>
);

export default function HistoryDetails({ historyId }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchParams = useSearchParams();
  const courseCode = searchParams.get("courseCode") || "Course History";

  const { data, isHistoricalSessionLoading } =
    useGetSessionsByClassId(historyId);

  // Derive unique dates and total sessions
  const sessionDates = useMemo(() => {
    if (!data?.historicalSession) return [];
    return data.historicalSession.map(
      (sesh) => sesh.window_start.split("T")[0],
    );
  }, [data]);

  const atdAmount = data?.historicalSession?.length || 0;

  // Auto-select the most recent date when data loads
  useEffect(() => {
    if (sessionDates.length > 0 && !selectedDate) {
      setSelectedDate(sessionDates[0]);
    }
  }, [sessionDates, selectedDate]);

  // Chart Data Preparation (Attendance trend)
  const chartData = useMemo(() => {
    if (!data?.historicalSession) return [];
    return data.historicalSession
      .map((sesh) => {
        const date = sesh.window_start.split("T")[0];
        const count = sesh.attendance_records?.reduce((acc, rcd) => {
          if (!rcd.users) return acc;
          return acc + (Array.isArray(rcd.users) ? rcd.users.length : 1);
        }, 0);
        return {
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          attendees: count || 0,
        };
      })
      .reverse(); 
  }, [data]);

  // Extract attendees for the currently selected date
  const selectedSessionAttendees = useMemo(() => {
    const partiRcd = data?.historicalSession?.filter(
      (sesh) => sesh.window_start.split("T")[0] === selectedDate,
    );

    return (
      partiRcd?.flatMap((sesh) => {
        return (
          sesh.attendance_records?.flatMap((rcd) => {
            if (!rcd.users) return [];
            return Array.isArray(rcd.users) ? rcd.users : [rcd.users];
          }) || []
        );
      }) || []
    );
  }, [data, selectedDate]);

  // Filter attendees based on search
  const filteredAttendees = useMemo(() => {
    if (!debouncedSearchTerm) return selectedSessionAttendees;
    const lowerSearch = debouncedSearchTerm.toLowerCase();

    return selectedSessionAttendees.filter((user) => {
      const name = user.full_name?.toLowerCase() || "";
      const matric =
        user.students_registry?.matric_number?.toLowerCase() ||
        user.matric_number?.toLowerCase() ||
        "";
      return name.includes(lowerSearch) || matric.includes(lowerSearch);
    });
  }, [selectedSessionAttendees, debouncedSearchTerm]);

  // Virtualization setup
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredAttendees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // Approximate row height
    overscan: 5, // Render 5 extra rows outside viewport for smooth scrolling
  });

  const totalAttended = selectedSessionAttendees.length;

  function handleExport() {
    if (filteredAttendees.length === 0) {
      alert("No students to export for this selection.");
      return;
    }

    const formattedData = filteredAttendees.map((user) => ({
      Name: user.full_name || "N/A",
      "Matric Number": user.matric_number || "N/A",
    }));

    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const customHeaderString = `Attendance for ${courseCode} on ${formattedDate} | Total Attended: ${formattedData.length}`;

    const ws = utils.aoa_to_sheet([[customHeaderString], []]);
    utils.sheet_add_json(ws, formattedData, { origin: "A3" });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Attendance");
    writeFile(wb, `${courseCode}-Attendance-${selectedDate}.xlsx`);
  }
  return (
    <div className="flex flex-col h-full bg-black/80 text-white pb-10">
      <div className="flex-none bg-[#0f172a] border-b border-white/5 px-6 py-3 z-30">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Link
                href="/class-rep/attendance/reports"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Reports
              </Link>

              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                {courseCode}
              </h1>
              {isHistoricalSessionLoading ? (
                <SkeletonStats />
              ) : (
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <MdDateRange className="text-indigo-400" /> Classes Held:{" "}
                    <strong className="text-white">{atdAmount}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MdTrendingUp className="text-green-400" /> Avg Attendance:{" "}
                    <strong className="text-white">
                      {atdAmount > 0
                        ? Math.round(
                            chartData.reduce(
                              (acc, curr) => acc + curr.attendees,
                              0,
                            ) / atdAmount,
                          )
                        : 0}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {!isHistoricalSessionLoading && atdAmount > 0 && (
              <div className="flex flex-col gap-1 w-full md:w-auto">
                <label className="text-xs text-gray-500 uppercase font-semibold">
                  Select Session Date
                </label>
                <select
                  className="w-full md:w-48 p-2 border border-white/10 rounded-md bg-white/5 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-colors"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="" disabled className="bg-[#0f172a]">
                    -- Choose a session --
                  </option>
                  {sessionDates.map((session, idx) => (
                    <option key={idx} value={session} className="bg-[#0f172a]">
                      {session}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 flex-1 flex flex-col gap-8">
        {isHistoricalSessionLoading ? (
          <SkeletonChart />
        ) : atdAmount > 0 ? (
          <div className="w-full h-[250px] bg-white/5 border border-white/5 rounded-xl p-4 pt-6 shadow-xl backdrop-blur-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="colorAttendees"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff10"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#ffffff10",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#818cf8" }}
                />
                <Area
                  type="monotone"
                  dataKey="attendees"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAttendees)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {atdAmount > 0 ? (
          <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-4 bg-black/40">
              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-2 text-sm text-gray-300">
                  <MdPeople className="text-lg text-indigo-400" />
                  <span>{totalAttended} Students Present</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto shrink-0">
                <div className="relative group w-full sm:flex-1 lg:w-64 lg:flex-none">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiSearch className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search name or matric..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:bg-white/10 focus:outline-none transition-all"
                  />
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  <Button
                    variant="primary"
                    padding="px-4 py-2"
                    onClick={handleExport}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CiExport className="text-lg" />
                      <span>Export CSV</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {isHistoricalSessionLoading ? (
              <SkeletonTable />
            ) : (
              <div
                ref={parentRef}
                className="max-h-[600px] overflow-y-auto scrollbar-none relative rounded-b-xl"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {filteredAttendees.length > 0 ? (
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black/50 backdrop-blur-md text-white sticky top-0 z-20 shadow-sm ring-1 ring-white/5">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 font-semibold sm:pl-6">
                          Name
                        </th>
                        <th className="px-3 py-3.5 font-semibold hidden sm:table-cell">
                          Matric Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#0f172a]/50">
                      {/* Top spacer row to push visible items down */}
                      {rowVirtualizer.getVirtualItems().length > 0 && (
                        <tr
                          style={{
                            height: `${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px`,
                          }}
                        >
                          <td colSpan={2} className="p-0 border-0"></td>
                        </tr>
                      )}

                      {/* Render visible rows in normal document flow */}
                      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const record = filteredAttendees[virtualRow.index];
                        const matricStr =
                          record.students_registry?.matric_number ||
                          record.matric_number ||
                          "N/A";

                        return (
                          <tr
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={rowVirtualizer.measureElement}
                            className="even:bg-white/2 hover:bg-white/5 transition-colors duration-150 h-[56px]"
                          >
                            <td className="py-4 pl-4 pr-3 sm:pl-6 max-w-0 sm:max-w-xs align-middle">
                              <div className="font-medium text-white truncate">
                                {highlightText(
                                  record.full_name || "Unknown",
                                  debouncedSearchTerm,
                                )}
                                <div className="font-normal text-gray-500 sm:hidden mt-0.5 truncate">
                                  {highlightText(
                                    matricStr,
                                    debouncedSearchTerm,
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4 text-gray-400 hidden sm:table-cell align-middle">
                              {highlightText(matricStr, debouncedSearchTerm)}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Bottom spacer row to maintain total scroll height */}
                      {rowVirtualizer.getVirtualItems().length > 0 && (
                        <tr
                          style={{
                            height: `${
                              rowVirtualizer.getTotalSize() -
                              (rowVirtualizer.getVirtualItems()[
                                rowVirtualizer.getVirtualItems().length - 1
                              ]?.end ?? 0)
                            }px`,
                          }}
                        >
                          <td colSpan={2} className="p-0 border-0"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    No students match your search.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          !isHistoricalSessionLoading && (
            <div className="flex items-center justify-center p-12 border border-dashed border-white/10 rounded-md bg-white/5 text-gray-400">
              This class has not been held this semester yet.
            </div>
          )
        )}
      </div>
    </div>
  );
}
