"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/app/utils/supabase/client";
import UploadsPage from "@/app/admin/upload-data/page";

//later, sectionize the timetables table on supabase, so that each level will have thier own section

// maps day of the week to figures
const DAY_MAP = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

//converts "8am" to "08:00:00", format understandable for supabase
function convertTo24Hour(timeStr) {
  if (!timeStr) return null;

  const str = timeStr.toLowerCase().trim();

  const match = str.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;

  let [_, hours, minutes, modifier] = match;
  hours = parseInt(hours, 10);
  minutes = minutes || "00";

  if (modifier === "pm" && hours < 12) hours += 12;
  if (modifier === "am" && hours === 12) hours = 0;

  const pad = (num) => num.toString().padStart(2, "0");
  return `${pad(hours)}:${minutes}:00`;
}

function parseHeaderRange(header) {
  if (!header) return null;
  const parts = header.split(/-|to/);
  if (parts.length !== 2) return null;

  const start = convertTo24Hour(parts[0]);
  const end = convertTo24Hour(parts[1]);

  if (!start || !end) return null;
  return { start, end };
}

export default function CrUploadsPage() {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [classCache, setClassCache] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from("classes").select("id, course_code");
      if (data) setClassCache(data);
    };
    fetchClasses();
  }, []);

  function addLog(message, type = "info"){
    setLogs((prev) => [
      ...prev,
      { message, type, id: Date.now() + Math.random() },
    ]);
  };

  function handleUploadClick() {
    setShowPopup(true);
  };

  function handlePopupClose() {
    setShowPopup(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setLogs([]);
    addLog(`Reading matrix file: ${file.name}...`);

    const Papa = await import("papaparse");

    // 1. Get the current user securely before processing
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      addLog("❌ Authentication error: Please log in again.", "error");
      setUploading(false);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: async (results) => {
        addLog(
          `File parsed. Found ${results.data.length} rows. Processing dynamic headers...`,
          "success",
        );
        // Pass the user.id into the processing function
        await processTimetableMatrix(
          results.data,
          results.meta.fields,
          user.id,
        );
        setUploading(false);
      },
      error: (error) => {
        addLog(`CSV Error: ${error.message}`, "error");
        setUploading(false);
      },
    });
  };

  // core timetable logic
  // CHANGED: Added userId as a parameter
  const processTimetableMatrix = async (rows, headers, userId) => {
    let successCount = 0;

    // 1. Identify Time Columns dynamically
    const timeColumns = [];
    headers.forEach((header) => {
      const timeRange = parseHeaderRange(header);
      if (timeRange) {
        timeColumns.push({ header, ...timeRange });
        addLog(
          `Detected Time Column: "${header}" -> ${timeRange.start} to ${timeRange.end}`,
        );
      }
    });

    if (timeColumns.length === 0) {
      addLog("❌ No valid time columns found!", "error");
      setUploading(false);
      return;
    }

    // 2. Build class map for fast lookup
    const classMap = new Map(
      classCache.map((c) => [
        c.course_code.replace(/\s/g, "").toUpperCase(),
        c,
      ]),
    );

    // 3. Process Rows
    for (const row of rows) {
      const dayName = row["DAY"]?.toString().toUpperCase().trim();
      const dayInt = DAY_MAP[dayName];
      if (!dayInt) continue;

      // STEP A: Collect all valid slots for this day
      let dailySlots = [];

      for (const col of timeColumns) {
        const cellContent = row[col.header];
        if (!cellContent || cellContent.trim() === "") continue;

        // Clean quotes and extract code
        let rawCode = cellContent.replace(/['"]+/g, "").split("(")[0].trim();
        const matchedClass = classMap.get(
          rawCode.replace(/\s/g, "").toUpperCase(),
        );

        if (!matchedClass) {
          addLog(
            `❌ Class not found: "${rawCode}" (in ${col.header})`,
            "error",
          );
          continue;
        }

        dailySlots.push({
          start: col.start,
          end: col.end,
          class_id: matchedClass.id,
          rawCode: rawCode, // for success log
        });
      }

      if (dailySlots.length === 0) continue;

      // STEP B: Sort and merge consecutive slots
      dailySlots.sort((a, b) => a.start.localeCompare(b.start));
      const mergedSlots = [];
      let currentSlot = dailySlots[0];

      for (let i = 1; i < dailySlots.length; i++) {
        const nextSlot = dailySlots[i];
        if (
          currentSlot.class_id === nextSlot.class_id &&
          currentSlot.end === nextSlot.start
        ) {
          currentSlot.end = nextSlot.end; // extend
        } else {
          mergedSlots.push(currentSlot);
          currentSlot = nextSlot;
        }
      }
      mergedSlots.push(currentSlot);

      // STEP C: Batch Insert into Supabase
      const payload = mergedSlots.map((slot) => ({
        day_of_week: dayInt,
        start_time: slot.start,
        end_time: slot.end,
        class_id: slot.class_id,
        is_active: true,
        created_by: userId, // 2. Inject the creator's ID here!
      }));

      if (payload.length > 0) {
        const { data, error } = await supabase
          .from("timetables")
          .upsert(payload, {
            // 3. Update the conflict constraint to include created_by
            onConflict: "day_of_week, start_time, class_id, created_by",
          })
          .select(); // explicit select helps ensure we get data back

        if (error) {
          addLog(`Db Error: ${error.message}`, "error");
        } else {
          mergedSlots.forEach((slot) => {
            addLog(
              `✅ Scheduled: ${dayName} ${slot.start.slice(0, 5)} - ${slot.end.slice(0, 5)} -> ${slot.rawCode}`,
              "success",
            );
            successCount++;
          });
        }
      }
    }

    addLog("------------------------------------------------", "info");
    addLog(
      `TIMETABLE IMPORT COMPLETE. Added ${successCount} merged slots.`,
      "info",
    );
  };

  return (
    <>
      <UploadsPage />

      <div className=" min-h-screen p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-gray-200">
            Dynamic Timetable Upload
          </h1>

          <div className="p-8 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="w-full py-3 px-6 text-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/10 hover:bg-blue-50/20 transition text-blue-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "📂 Upload Timetable CSV"}
            </button>

            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 font-mono text-sm p-4 h-96 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`mb-1 ${
                  log.type === "error"
                    ? "text-red-400"
                    : log.type === "success"
                      ? "text-green-400"
                      : log.type === "warning"
                        ? "text-yellow-400"
                        : "text-gray-300"
                }`}
              >
                <span className="opacity-50 mr-2">
                  [{new Date(log.id).toLocaleTimeString()}]
                </span>
                {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handlePopupClose}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-gray-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handlePopupClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition text-2xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-3 text-blue-400">
              📋 How to Prepare Your Timetable CSV
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Take a clear image</strong> of your timetable (photo or
                screenshot).
              </li>
              <li>
                <strong>Ask an AI (ChatGPT, Claude, etc.)</strong> to convert
                the image into a CSV file with this exact structure:
                <div className="bg-gray-800 p-3 mt-2 rounded-lg text-xs font-mono overflow-x-auto">
                  DAY,8am-10am,10am-12pm,12pm-2pm,2pm-4pm
                  <br />
                  MONDAY,MATH101,CSCI201,,PHYS301
                  <br />
                  TUESDAY,,MATH101 (Tutorial),CSCI201,
                  <br />
                  WEDNESDAY,MATH101,CSCI201,PHYS301,
                </div>
                <p className="mt-1 text-gray-400">
                  (Time column headers can be adjusted to match your actual
                  timetable slots – e.g., <code>9am-11am</code>,{" "}
                  <code>2pm-4pm</code>)
                </p>
              </li>
              <li>
                <strong>
                  Save the AI’s output as a <code>.csv</code> file
                </strong>{" "}
                on your device.
              </li>
              <li>
                <strong>Come back here and click “Upload”</strong> again – the
                file picker will open after you close this guide.
              </li>
            </ol>
            <p className="mt-4 text-xs text-gray-500 italic">
              💡 If you already have a properly formatted CSV, just dismiss this
              popup and select your file.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
