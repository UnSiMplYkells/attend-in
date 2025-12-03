"use server"
import { createClient } from "@/app/utils/supabase/server";

export async function getStudents(){
  const supabase = await createClient();

  const { data, error  } = await supabase
    .from("users")
    .select("*");

  if (error) {
    console.error(error);
    throw new Error("students could not be loaded");
  }

  return data;
}

export async function checkUserExists(matricNo) {
  const supabase = await createClient();

  const { data: existingUsers, error } = await supabase
    .from("users")
    .select("matric_number")
    .eq("matric_number", matricNo)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return existingUsers;
}
