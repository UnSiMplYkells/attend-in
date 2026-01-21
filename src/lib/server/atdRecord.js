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

  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", userId)
    .eq("session_id", sessionId)
    .single();

  if (error) {
    // Ideally return null if no record found, rather than throwing,
    // so the UI knows it's simply "not marked yet"
    if (error.code === "PGRST116") return null;
    throw new Error(error.message || "Failed to record attendance session");
  }

  return data;
}