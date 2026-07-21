"use server"
import { createClient } from "@/app/utils/supabase/server";

export async function setAtdRecord({ sessionId, userId, distanceFrmHall }) {
  const supabase = await createClient();

  //insert new attendance session
  const { data, error } = await supabase
    .from("attendance_records")
    .insert({
      session_id: sessionId,
      student_id: userId,
      marked_at: new Date().toISOString(),
      distance_frm_hall: distanceFrmHall,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to record attendance session");
  }

  return data;
}

//fetches attendance record for a given session and user
export async function getAtdRecord({ sessionId, userId }) {
  const supabase = await createClient();

  let query = supabase
    .from("attendance_records")
    .select(
      `
      *, 
      users!student_id (
        full_name, 
        students_registry!matric_number (
          department,
          matric_number
        )
      ), 
      attendance_sessions!session_id (
        window_start,
        window_end,
        classes!class_id (course_code)
      )
    `,
    )
    .eq("session_id", sessionId);

  // If a userId is provided, filter by it and expect a single record or null.
  // Otherwise, fetch all records for the session (for class rep reports).
  if (userId) {
    query = query.eq("student_id", userId).maybeSingle();
  }

  const { data, error } = await query;

  if (error) {
    // PostgREST errors (like row not found) are sometimes expected, return null
    if (error.code && error.code.startsWith("PGRST")) return null;
    throw new Error(error.message || "Failed to retrieve attendance record");
  }

  return data;
}

//fetches attendance record for a based on date and name of course. sort of filter something
export async function getAtdRecordByFilter({ sessionId, userId }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attendance_records")
    .select("*, users!student_id(*, students_registry!matric_number(*))")
    // .eq("student_id", userId)
    .eq("session_id", sessionId)

  if (error) {
    // Ideally return null if no record found, rather than throwing,
    // so the UI knows it's simply "not marked yet"
    if (error.code === "PGRST116") return null;
    throw new Error(error.message || "Failed to record attendance session");
  }

  return data;
}
