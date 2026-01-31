"use server"
import { createClient } from "@/app/utils/supabase/server";

export async function setAtdSession({
  classId,
  TtLink,
  sessionData,
  winStart,
  winEnd,
}) {
  const supabase = await createClient();

  //insert new attendance session
  const { data, error } = await supabase
    .from("attendance_sessions")
    .insert({
      class_id: classId,
      timetable_id: TtLink,
      session_data: sessionData,
      window_start: winStart,
      window_end: winEnd,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create attendance session");
  }

  return data;
}

export async function getActiveAtdSession({ classIds, timeNow, nowNow }) {
  if (!classIds || classIds.length === 0) return null;
  const supabase = await createClient();

  const ids = Array.isArray(classIds) ? classIds : [classIds];

  //gets active attendance session for the particular user's classes according to todays date
  const { data: session, error } = await supabase
    .from("attendance_sessions")
    .select("*, timetables!timetable_id(*)")
    .in("class_id", ids)
    .lte("timetables.start_time", timeNow)
    .gte("timetables.end_time", timeNow)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to get attendance session");
  }

  if (!session) return null;

  //checks if atd taking session is currently active
  const isActivated =
    nowNow >= session?.window_start && nowNow <= session?.window_end;

  return {
    ...session,
    isActivated,
  };
}

export async function getAttendanceSessionByQr(qrData, nowISO, today) {
  const supabase = await createClient();

  const { data: sessionByQr, error } = await supabase
    .from("attendance_sessions")
    .select("*, classes(course_code), timetables!timetable_id(end_time)")
    .eq("session_data", qrData)
    .single();

  if (error) throw error;

  if (!sessionByQr) return null;

  const isActivatedFrmQr =
    nowISO >= sessionByQr?.window_start &&
    nowISO <= sessionByQr?.window_end &&
    sessionByQr?.session_date === today;

  return {
    ...sessionByQr,
    isActivatedFrmQr,
  };
}