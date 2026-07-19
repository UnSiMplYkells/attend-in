"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTimetable } from "@/hooks/query/useTimetable";
import Button from "@/app/components/ui/Button";
import { toast } from "react-hot-toast";
import { FaCalendarAlt, FaDownload } from "react-icons/fa";
import AddClassModal from "../components/timetablePgModal/AddClassModal";
import ConfirmRemoveModal from "../components/timetablePgModal/ConfirmRemoveModal";
import ConfirmClearModal from "../components/timetablePgModal/ConfirmClearModal";
import Link from "next/link";

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
];

const TIMES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export default function TimetablePage() {
  const router = useRouter();
  const { data: timetable = [], isLoading } = useTimetable();

  const [activeCell, setActiveCell] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [now, setNow] = useState(new Date());
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    const bannerTimer = setTimeout(() => setShowBanner(false), 5000);
    return () => {
      clearInterval(timer);
      clearTimeout(bannerTimer);
    };
  }, []);

  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const pressTimer = useRef(null);

  function handleTouchStart(type, data){
    pressTimer.current = setTimeout(() => {
      setActiveCell({ type, data });
    }, 600);
  };

  function handleTouchEnd(){clearTimeout(pressTimer.current);}

  function openAddModal(day, hour){
    setSelectedSlot({ day, hour });
    setShowAddModal(true);
    setActiveCell(null);
  };

  function openRemoveModal(classData){
    setSelectedSlot(classData);
    setShowRemoveModal(true);
    setActiveCell(null);
  };

  const formatTime = (h) => `${h.toString().padStart(2, "0")}:00`;

  // --- CSV Export Logic ---
  async function downloadCSV() {
    if (!timetable || timetable.length === 0) {
      toast.error("Timetable is empty. Nothing to download.");
      return;
    }

    const Papa = await import("papaparse");

    // Prepare headers: "DAY", "08:00-09:00", "09:00-10:00", etc.
    const fields = [
      "DAY",
      ...TIMES.map((t) => `${formatTime(t)}-${formatTime(t + 1)}`),
    ];

    // Build the matrix data
    const data = DAYS.map((day) => {
      const row = { DAY: day.name };

      TIMES.forEach((time) => {
        const activeClass = timetable.find((c) => {
          const start = parseInt(c.start_time);
          const end = parseInt(c.end_time);
          return c.day_of_week === day.id && time >= start && time < end;
        });

        const timeHeader = `${formatTime(time)}-${formatTime(time + 1)}`;
        row[timeHeader] = activeClass ? activeClass.classes.course_code : "";
      });

      return row;
    });

    const csv = Papa.unparse({ fields, data });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Class_Timetable.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Timetable downloaded successfully!");
  }

  const renderClassBlock = (classData, isMobile) => {
    const start = parseInt(classData.start_time);
    const end = parseInt(classData.end_time);
    const span = end - start;
    const isCurrentTime =
      currentDay === classData.day_of_week &&
      currentHour >= start &&
      currentHour < end;

    const gridStyle = isMobile
      ? {
          gridColumnStart: classData.day_of_week + 1,
          gridRowStart: start - 6,
          gridRowEnd: `span ${span}`,
        }
      : {
          gridRowStart: classData.day_of_week + 1,
          gridColumnStart: start - 6,
          gridColumnEnd: `span ${span}`,
        };

    return (
      <div
        key={`class-${classData.id}-${isMobile ? "m" : "d"}`}
        onClick={() =>
          router.push(
            `/class-rep/courses/${classData.classes.course_code}/${classData.classes.id}`,
          )
        }
        onMouseEnter={() => setActiveCell({ type: "remove", data: classData })}
        onMouseLeave={() => setActiveCell(null)}
        onTouchStart={() => handleTouchStart("remove", classData)}
        onTouchEnd={handleTouchEnd}
        style={gridStyle}
        // CHANGED: Replaced "border-t border-l" with "border"
        className={`relative z-10 cursor-pointer transition-all bg-blue-900/60 rounded-none border
          hover:border-transparent hover:shadow-[inset_2px_2px_0_#ef4444,inset_30px_30px_50px_-20px_rgba(239,68,68,0.3)] hover:bg-red-900/30
          ${isCurrentTime ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "border-blue-500/30"}
          ${isMobile ? "p-1.5 flex flex-col items-center justify-center text-center" : "p-2"} 
        `}
      >
        {isCurrentTime && (
          <span
            className={`absolute flex items-center font-bold text-red-500 rounded animate-pulse bg-red-950/80
            ${isMobile ? "top-1 right-1 text-[8px] px-1 py-0.5" : "top-1 right-1 text-[10px] px-1.5 py-0.5"}
          `}
          >
            <span className="relative w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>{" "}
            Now
          </span>
        )}
        <h3 className={`font-bold text-blue-100 ${isMobile ? "text-xs" : ""}`}>
          {classData?.classes?.course_code}
        </h3>
        <p
          className={`text-blue-300 ${isMobile ? "text-[10px] mt-0.5" : "text-[11px]"}`}
        >
          {formatTime(start)} - {formatTime(end)}
        </p>

        {activeCell?.data?.id === classData.id &&
          activeCell?.type === "remove" && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openRemoveModal(classData);
                }}
                className={`bg-gray-800 text-red-400 font-bold rounded shadow-xl border border-gray-700 hover:bg-red-900 hover:text-red-300 transition-colors cursor-pointer
                  ${isMobile ? "text-[10px] px-2 py-1" : "text-xs px-3 py-1.5"}
                `}
              >
                Remove
              </button>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative pb-20">
      {showBanner && (
        <div className="md:hidden fixed top-20 left-4 right-4 z-50 bg-amber-100 border-b-4 border-amber-500 text-amber-900 px-4 py-3 shadow-lg flex flex-col transition-opacity duration-500">
          <span className="font-bold text-base mb-1">
            ⚠️ Timetable Controls
          </span>
          <span className="text-sm">
            Long-press empty cells to add a class. Long-press an occupied cell
            to remove it.
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-2 right-2 text-amber-900 font-bold px-2 hover:bg-amber-200 rounded"
          >
            x
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <FaCalendarAlt size={20} />
              <h1 className="text-2xl font-bold text-white">Class Timetable</h1>
            </div>
            <p className="text-sm text-gray-400">
              A complete schedule of courses assigned to your class.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button
              onClick={downloadCSV}
              className="flex items-center rounded-sm bg-gray-600 hover:bg-gray-500 gap-1 -auto px-3 py-2 cursor-pointer"
            >
              <FaDownload className="text-sm" /> .csv
            </button>
            <Button
              variant="primary"
              width="w-auto"
              padding="px-4 py-2"
              onClick={() =>
                openAddModal(
                  currentDay > 0 && currentDay < 6 ? currentDay : 1,
                  8,
                )
              }
            >
              + Add
            </Button>
            <Button
              variant="danger"
              width="w-auto"
              padding="px-4 py-2"
              onClick={() => setShowClearModal(true)}
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md overflow-hidden relative">
          {/* DESKTOP VIEW (Horizontal: Times on X, Days on Y) */}
          <div className="hidden md:block overflow-x-auto no-scrollbar pt-4">
            <div
              className="grid min-w-[1200px] border-l border-t border-gray-800/50"
              style={{
                gridTemplateColumns: "100px repeat(10, 1fr)",
                gridTemplateRows: "50px repeat(5, minmax(80px, auto))",
              }}
            >
              <div className="border-b border-r border-gray-800/50 bg-black/20"></div>

              {/* Header Row (Times as Columns) */}
              {TIMES.map((time, idx) => (
                <div
                  key={`d-time-${time}`}
                  className="text-center flex flex-col items-center justify-center text-xs font-mono text-gray-400 border-b border-r border-gray-800/50 bg-black/20"
                  style={{ gridColumnStart: idx + 2, gridRowStart: 1 }}
                >
                  <span>{formatTime(time)}</span>
                  <span className="text-[10px] text-gray-600">
                    to {formatTime(time + 1)}
                  </span>
                </div>
              ))}

              {/* Left Column (Days as Rows) */}
              {DAYS.map((day, rIdx) => (
                <div
                  key={`d-day-${day.id}`}
                  className="flex items-center justify-center text-sm font-bold text-gray-300 border-b border-r border-gray-800/50 bg-black/20"
                  style={{ gridColumnStart: 1, gridRowStart: rIdx + 2 }}
                >
                  {day.name}
                </div>
              ))}

              {/* Empty Interactive Cells */}
              {DAYS.map((day, rIdx) =>
                TIMES.map((hour, cIdx) => {
                  const isCurrentSlot =
                    currentDay === day.id && currentHour === hour;

                  // Check if a class is actively spanning this slot
                  const isOccupied = timetable.some((c) => {
                    const start = parseInt(c.start_time);
                    const end = parseInt(c.end_time);
                    return (
                      c.day_of_week === day.id && hour >= start && hour < end
                    );
                  });

                  // Skip rendering the empty cell completely if covered
                  if (isOccupied) return null;

                  return (
                    <div
                      key={`d-empty-${day.id}-${hour}`}
                      onMouseEnter={() =>
                        setActiveCell({
                          type: "add",
                          data: { day: day.id, hour },
                        })
                      }
                      onMouseLeave={() => setActiveCell(null)}
                      className={`border-b border-r border-gray-800/30 relative transition-all rounded-none hover:bg-gray-800/10 hover:border-transparent hover:shadow-[inset_2px_2px_0_#ef4444,inset_30px_30px_50px_-20px_rgba(239,68,68,0.3)]
                        ${isCurrentSlot ? "border-transparent shadow-[inset_2px_2px_0_#ef4444,inset_30px_30px_50px_-20px_rgba(239,68,68,0.15)] bg-red-900/10" : ""}
                      `}
                      style={{
                        gridColumnStart: cIdx + 2,
                        gridRowStart: rIdx + 2,
                      }}
                    >
                      {activeCell?.data?.day === day.id &&
                        activeCell?.data?.hour === hour &&
                        activeCell?.type === "add" && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <button
                              onClick={() => openAddModal(day.id, hour)}
                              className="bg-blue-600 text-white text-xs font-bold rounded px-3 py-1 shadow-lg hover:bg-blue-500 cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                        )}
                    </div>
                  );
                }),
              )}

              {/* Render Classes for Desktop */}
              {timetable.map((c) => renderClassBlock(c, false))}
            </div>
          </div>

          {/* MOBILE VIEW (Vertical: Days on X, Times on Y) */}
          <div className="md:hidden overflow-x-auto no-scrollbar pt-4">
            <div
              className="grid min-w-[550px] border-l border-t border-gray-800/50"
              style={{
                gridTemplateColumns: "60px repeat(5, 1fr)", // Shrunk time col to 60px to widen class blocks
                gridTemplateRows: "50px repeat(10, minmax(80px, 1fr))",
              }}
            >
              <div className="border-b border-r border-gray-800/50 bg-black/20"></div>

              {/* Header Row (Days as Columns) */}
              {DAYS.map((day, idx) => (
                <div
                  key={`m-day-${day.id}`}
                  className="text-center flex items-center justify-center text-sm font-bold text-gray-300 border-b border-r border-gray-800/50 bg-black/20"
                  style={{ gridColumnStart: idx + 2, gridRowStart: 1 }}
                >
                  {day.name.slice(0, 3)}
                </div>
              ))}

              {/* Left Column (Times as Rows) */}
              {TIMES.map((time, rIdx) => (
                <div
                  key={`m-time-${time}`}
                  className="flex flex-col items-center justify-center text-[11px] font-mono text-gray-400 border-b border-r border-gray-800/50 bg-black/20"
                  style={{ gridColumnStart: 1, gridRowStart: rIdx + 2 }}
                >
                  <span>{formatTime(time)}</span>
                  <span className="text-[9px] text-gray-600">
                    - {formatTime(time + 1)}
                  </span>
                </div>
              ))}

              {/* Empty Interactive Cells */}
              {TIMES.map((hour, rIdx) =>
                DAYS.map((day, cIdx) => {
                  const isCurrentSlot =
                    currentDay === day.id && currentHour === hour;

                  const isOccupied = timetable.some((c) => {
                    const start = parseInt(c.start_time);
                    const end = parseInt(c.end_time);
                    return (
                      c.day_of_week === day.id && hour >= start && hour < end
                    );
                  });

                  // Skip rendering the empty cell completely if covered
                  if (isOccupied) return null;

                  return (
                    <div
                      key={`m-empty-${day.id}-${hour}`}
                      onTouchStart={() =>
                        handleTouchStart("add", { day: day.id, hour })
                      }
                      onTouchEnd={handleTouchEnd}
                      className={`border-b border-r border-gray-800/30 relative transition-all rounded-none active:bg-gray-800/10 active:border-transparent active:shadow-[inset_2px_2px_0_#ef4444,inset_30px_30px_50px_-20px_rgba(239,68,68,0.3)]
                        ${isCurrentSlot ? "border-transparent shadow-[inset_2px_2px_0_#ef4444,inset_30px_30px_50px_-20px_rgba(239,68,68,0.15)] bg-red-900/10" : ""}
                      `}
                      style={{
                        gridColumnStart: cIdx + 2,
                        gridRowStart: rIdx + 2,
                      }}
                    >
                      {activeCell?.data?.day === day.id &&
                        activeCell?.data?.hour === hour &&
                        activeCell?.type === "add" && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <button
                              onClick={() => openAddModal(day.id, hour)}
                              className="bg-blue-600 text-white text-xs font-bold rounded px-3 py-1 shadow-lg"
                            >
                              + Add
                            </button>
                          </div>
                        )}
                    </div>
                  );
                }),
              )}

              {/* Render Classes for Mobile */}
              {timetable.map((c) => renderClassBlock(c, true))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center gap-3">
        <h2 className="text-base font-semibold leading-7 text-indigo-400">
          want to upload the timetable image instead?
        </h2>
        <Link
          href="/class-rep/uploads"
          className="px-6 py-3 border border-blue-400 text-white rounded-xs 
            transition-all duration-300 ease-out
            hover:bg-blue-600 hover:border-blue-600 hover:scale-105 
            active:scale-95"
        >
          move to uploads
        </Link>
      </div>

      {showAddModal && (
        <AddClassModal
          onClose={() => setShowAddModal(false)}
          initialData={selectedSlot}
        />
      )}
      {showRemoveModal && (
        <ConfirmRemoveModal
          onClose={() => setShowRemoveModal(false)}
          data={selectedSlot}
        />
      )}
      {showClearModal && (
        <ConfirmClearModal
          onClose={() => setShowClearModal(false)}
          timetable={timetable}
        />
      )}
    </div>
  );
}
