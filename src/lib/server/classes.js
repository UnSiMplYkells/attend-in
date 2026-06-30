"use server"
import getCurrentTime from "@/app/helper/getCurrentTime";
import { createClient } from "@/app/utils/supabase/server";

export async function getUsersClasses(courseId){
  const supabase =  await createClient();

  if (!courseId || courseId.length === 0) return [];

  //uses users registered classes course id to actually get their registered classes
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .in("id", courseId)

  if (error) {
    console.error(error);
    throw new Error("classes could not be loaded");
  }

  return data
}

export async function getCurrentClass(courseId) {
  const supabase = await createClient();
  const timeNow = getCurrentTime();


  //fetches the current class from timetables table where the class_id and current time is between the class start_time and end_time
  const { data, error } = await supabase
    .from("timetables")
    .select("*, classes(course_code, latitude, longitude)")
    .eq("is_active", true)
    .in("class_id", courseId)
    .lte("start_time", timeNow)
    .gte("end_time", timeNow);

  if (error) {
    console.error(error);
    throw new Error("classes could not be loaded");
  }
  if (!data || data.length === 0) {
    return []
  }

  return data;
}


//for admin use. gets all the classes
//basically gets all available classes *for any particular user
export async function getClasses() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("classes").select("*");

  if (error) {
    console.error(error);
    throw new Error("classes could not be loaded");
  }

  return data;
}