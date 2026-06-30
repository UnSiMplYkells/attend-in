"use server";
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

export async function addStudentToRoster(courseId, studentId) {
  const supabase = await createClient();

  // First, check if they are already in the class to prevent duplicates
  const { data: existingEntry } = await supabase
    .from("rosters")
    .select("id")
    .eq("class_id", courseId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (existingEntry) {
    throw new Error("Student is already enrolled in this course.");
  }

  // If not, insert them
  const { error } = await supabase
    .from("rosters")
    .insert([{ class_id: courseId, student_id: studentId }]);

  if (error) {
    console.error(error);
    throw new Error("Could not add student to the course.");
  }

  return true;
}

export async function removeStudentFromRoster(courseId, studentId) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("rosters")
    .delete()
    // .match is a shorthand way to chain multiple .eq() filters
    .match({ class_id: courseId, student_id: studentId });

  if (error) {
    console.error(error);
    throw new Error("Could not remove student from the course.");
  }

  return true;
}