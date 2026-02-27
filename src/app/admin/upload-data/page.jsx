"use client";

import { useState } from "react";
import Papa from "papaparse";
import { createClient } from "@/app/utils/supabase/client";

export default function UploadsPage() {
  const supabase = createClient();

  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  
  //helper to add messages to our "Terminal" window
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
    setLogs([]); //clear previous logs from "terminal"
    addLog(`Reading file: ${file.name}...`);

    //parser library
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: async (results) => {
        addLog(
          `File parsed. Found ${results.data.length} rows. Starting processing...`,
          "success",
        );
        await processRoster(results.data);
        setUploading(false);
      },
      error: (error) => {
        addLog(`Error parsing CSV: ${error.message}`, "error");
        setUploading(false);
      },
    });
  };

  // --- THE CORE LOGIC SCRIPT ---
  const processRoster = async (rows) => {
    let successCount = 0;
    let errorCount = 0;

    for (const row of rows) {
      //sanitizes keys (remove spaces, lowercase) to match CSV headers loosely
      //expecting headers like Matric Number, Course Code exactly
      const matric =
        row["Matric Number"]?.trim() ||
        row["MatricNumber"]?.trim() ||
        row["matric"];
      const courseCode =
        row["Course Code"]?.trim() ||
        row["CourseCode"]?.trim() ||
        row["course"];

      if (!matric || !courseCode) {
        addLog(`Skipping row: Missing Matric or Course Code`, "warning");
        continue;
      }

      try {
        //finds Student UUID
        const { data: studentData, error: studentError } = await supabase
          .from("users")
          .select("id")
          .eq("matric_number", matric) 
          .single();

        if (studentError || !studentData) {
          addLog(`❌ Student not found: ${matric}`, "error");
          errorCount++;
          continue;
        }

        //finds Class UUID
        const { data: classData, error: classError } = await supabase
          .from("classes")
          .select("id")
          .eq("course_code", courseCode)
          .single();

        if (classError || !classData) {
          addLog(`❌ Class not found: ${courseCode}`, "error");
          errorCount++;
          continue;
        }

        //inserts into rosters
        const { error: insertError } = await supabase
          .from("rosters")
          .insert([{ student_id: studentData.id, class_id: classData.id }]);

        if (insertError) {
          //checks for duplicate key error (student already in class)
          if (insertError.code === "23505") {
            addLog(
              `⚠️ Already enrolled: ${matric} -> ${courseCode}`,
              "warning"
            );
          } else {
            addLog(
              `❌ DB Error for ${matric}: ${insertError.message}`,
              "error"
            );
            errorCount++;
          }
        } else {
          addLog(`✅ Enrolled: ${matric} -> ${courseCode}`, "success");
          successCount++;
        }
      } catch (err) {
        addLog(`Critical Error processing ${matric}: ${err.message}`, "error");
        errorCount++;
      }
    }

    addLog("------------------------------------------------", "info");
    addLog(
      `PROCESS COMPLETE. Success: ${successCount}, Failed: ${errorCount}`,
      "info"
    );
  };

  return (
    <div className="min-h-1/2 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Admin Roster Upload
          </h1>
          <p className="text-white mt-2">
            Upload a CSV containing <strong>Matric Number</strong> and{" "}
            <strong>Course Code</strong> to auto-enroll students.
          </p>
        </div>

        <div className="p-8 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-white mb-4">
            Select CSV File
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              disabled={uploading}
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50"
            />
            {uploading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Expected CSV Headers:{" "}
            <code className="bg-gray-100 px-1 rounded">Matric Number</code>,{" "}
            <code className="bg-gray-100 px-1 rounded">Course Code</code>
          </p>
        </div>

        <div className="bg-gray-900 rounded-md shadow-lg overflow-hidden border border-gray-800 font-mono text-sm">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-400 ml-2 text-xs">Process Terminal</span>
          </div>
          <div className="p-4 h-96 overflow-y-auto space-y-1">
            {logs.length === 0 && (
              <div className="text-gray-500 italic">
                Waiting for file upload...
              </div>
            )}
            {logs.map((log) => (
              <div
                key={log.id}
                className={`${
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
    </div>
  );
}
