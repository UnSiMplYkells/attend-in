"use client";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import { createClient } from "@/app/utils/supabase/client";
import UploadsPage from "@/app/admin/upload-data/page";

//later, secionize the timetables table on supabase, so that each level will have thier own section
//in supabase table,  is there a way to sectionize a particular table, asin in my tables, it is a timetable tanles quite alright, but now, the thing is that from100lvl to 400lvl have thier own timetables, and so all of then sends thier timetable to the timetable table, which makes it kinda messy(i dont know). soi dont know if there is a way to sectionize that particular table for different leels, but not split the tables, because they are related data

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

//converts "8am" to "08:00:00", format understandebale for supabase
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
};

function parseHeaderRange (header) {
  if (!header) return null;
  const parts = header.split(/-|to/);
  if (parts.length !== 2) return null;

  const start = convertTo24Hour(parts[0]);
  const end = convertTo24Hour(parts[1]);

  if (!start || !end) return null;
  return { start, end };
};

export default function CrUploadsPage(){
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [classCache, setClassCache] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from("classes").select("id, course_code");
      if (data) setClassCache(data);
    };
    fetchClasses();
  }, []);

  const addLog = (message, type = "info") => {
    setLogs((prev) => [
      ...prev,
      { message, type, id: Date.now() + Math.random() },
    ]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setLogs([]);
    addLog(`Reading matrix file: ${file.name}...`);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        addLog(
          `File parsed. Found ${results.data.length} rows. Processing dynamic headers...`,
          "success"
        );
        await processTimetableMatrix(results.data, results.meta.fields);
        setUploading(false);
      },
      error: (error) => {
        addLog(`CSV Error: ${error.message}`, "error");
        setUploading(false);
      },
    });
  };

  // core timetable logic
const processTimetableMatrix = async (rows, headers) => {
  let successCount = 0;

  // --- 1. Identify Time Columns dynamically ---
  const timeColumns = [];
  headers.forEach((header) => {
    const timeRange = parseHeaderRange(header);
    if (timeRange) {
      timeColumns.push({ header, ...timeRange });
      addLog(
        `Detected Time Column: "${header}" -> ${timeRange.start} to ${timeRange.end}`
      );
    }
  });

  if (timeColumns.length === 0) {
    addLog("❌ No valid time columns found!", "error");
    setUploading(false);
    return;
  }

  // --- 2. Build class map for fast lookup ---
  const classMap = new Map(
    classCache.map((c) => [c.course_code.replace(/\s/g, "").toUpperCase(), c])
  );

  // --- 3. Process Rows ---
  for (const row of rows) {
    const dayName = row["DAY"]?.toString().toUpperCase().trim();
    const dayInt = DAY_MAP[dayName];
    if (!dayInt) continue;

    // --- STEP A: Collect all valid slots for this day ---
    let dailySlots = [];

    for (const col of timeColumns) {
      const cellContent = row[col.header];
      if (!cellContent || cellContent.trim() === "") continue;

      // Clean quotes and extract code
      let rawCode = cellContent.replace(/['"]+/g, "").split("(")[0].trim();
      const matchedClass = classMap.get(
        rawCode.replace(/\s/g, "").toUpperCase()
      );

      if (!matchedClass) {
        addLog(`❌ Class not found: "${rawCode}" (in ${col.header})`, "error");
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

    // --- STEP B: Sort and merge consecutive slots ---
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

    // --- STEP C: Batch Insert into Supabase ---
    const payload = mergedSlots.map((slot) => ({
      day_of_week: dayInt,
      start_time: slot.start,
      end_time: slot.end,
      class_id: slot.class_id,
    }));

    if (payload.length > 0) {
      const { data, error } = await supabase
        .from("timetables")
        .upsert(payload, {
          onConflict: "day_of_week, start_time, class_id", // Make sure this matches your DB constraint
          ignoreDuplicates: true,
        })
        .select(); // explicit select helps ensure we get data back

      if (error) {
        addLog(`Db Error: ${error.message}`, "error");
      } else {
        // With ignoreDuplicates: true, 'error' is null even if slots were skipped.
        // We assume success for the batch.
        mergedSlots.forEach((slot) => {
          addLog(
            `✅ Scheduled (or skipped if duplicate): ${dayName} ${slot.start} - ${slot.end} -> ${slot.rawCode}`,
            "success"
          );
          successCount++;
        });
      }
    }
  }

  addLog("------------------------------------------------", "info");
  addLog(
    `TIMETABLE IMPORT COMPLETE. Added ${successCount} merged slots.`,
    "info"
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
            {/* Same UI as before */}
            <input
              type="file"
              accept=".csv"
              disabled={uploading}
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
    </>
  );
}
