"use server"
import { createClient } from "@/app/utils/supabase/server";

export async function getCourses(userId) {
  const supabase = await createClient();

  //fetches users registered classes from the roster table
  const { data, error } = await supabase
    .from("rosters")
    .select("*, classes(course_code)")
    .eq("student_id", userId);

  if (error) {
    console.error(error);
    throw new Error("courses could not be loaded");
  }

  return data;
}
