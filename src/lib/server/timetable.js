"use server";
import { createClient } from "@/app/utils/supabase/server";
import { getCurrentUser } from "./session";

export async function getTimetable() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  //Fetch the class IDs this specific user is enrolled in/managing
  const { data: rosterData, error: rosterError } = await supabase
    .from("rosters")
    .select("class_id")
    .eq("student_id", user.id);

  if (rosterError) throw new Error(rosterError.message);

  const classIds = rosterData?.map((r) => r.class_id) || [];

  if (classIds.length === 0) return [];

  // Fetch ONLY the timetables that match those class IDs
  const { data, error } = await supabase
    .from("timetables")
    .select("*, classes(course_code, id)")
    .eq("is_active", true)
    .eq("created_by", user.id)
    .in("class_id", classIds)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

export async function clearAllTimetable(activeIds) {
  if (!activeIds || activeIds.length === 0) return true;

  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("timetables")
    .update({ is_active: false })
    .in("id", activeIds)
    .eq("created_by", user.id);

  if (error) {
    console.error("Clear All Error:", error);
    throw new Error(error.message);
  }
  return true;
}

export async function removeClassSlot(timetableId) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("timetables")
    .update({ is_active: false })
    .eq("id", timetableId)
    .eq("created_by", user.id)

  if (error) throw new Error(error.message);
  return true;
}

export async function addClassSlot(payloads) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  // 1. Get all the class IDs that belong to this Class Rep's roster
  const { data: myRoster } = await supabase
    .from("rosters")
    .select("class_id")
    .eq("student_id", user.id);

  const myClassIds = myRoster?.map((r) => r.class_id) || [];

  for (const slot of payloads) {
    // 2. Conflict check: Only check if the time overlaps with classes ON MY ROSTER
    const { data: conflict } = await supabase
      .from("timetables")
      .select("id")
      .eq("day_of_week", slot.day_of_week)
      .lt("start_time", slot.end_time)
      .gt("end_time", slot.start_time)
      .eq("is_active", true)
      .eq("created_by", user.id)
      .in("class_id", myClassIds);

    if (conflict && conflict.length > 0) {
      throw new Error(
        `Period ${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)} is already occupied on your schedule.`,
      );
    }
  }

  // Insert all if no conflicts using UPSERT
  const inserts = payloads.map((p) => ({ 
    ...p, 
    is_active: true, 
    created_by: user.id
  }));

  const { error } = await supabase
    .from("timetables")
    .upsert(inserts, {
      onConflict: "day_of_week, start_time, class_id, created_by",
    });

  if (error) throw new Error(error.message);

  return true;
}
