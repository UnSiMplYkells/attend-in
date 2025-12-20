"use server"
import { createClient } from "@/app/utils/supabase/server";

export async function getStudents(department, page = 1, searchTerm = "") {
  const supabase = await createClient();

  const ITEMS_PER_PAGE = 20;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  
  // const { data, error } = await supabase
  //   .from("users")
  //   .select(
  //     `
  //     *,
  //     students_registry!inner(
  //       department
  //     )
  //   `
  // {
  //   count: "exact";
  // }
  //   )
  //   .eq("students_registry.department", department) // filter by department
  //   .range(from, to) //20 per api call

  // if (error) {
  //   console.error(error);
  //   throw new Error("students could not be loaded");
  // }

  // if (searchTerm) {
  //   query = query.or(
  //     `full_name.ilike.%${searchTerm}%,matric_number.ilike.%${searchTerm}%`
  //   );
  // }

  // 1. Start building the query (Do NOT await yet)
  let query = supabase
    .from("students_registry")
    .select("*", { count: "exact" })
    .order("full_name", { ascending: true })
    .range(from, to);

  // 3. Apply search filter if needed
  if (searchTerm) {
    query = query.or(
      `full_name.ilike.%${searchTerm}%,matric_number.ilike.%${searchTerm}%`
    );
  }

  // 4. Await execution here
  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("students could not be loaded");
  }

  // 5. Return both data and count
  return { data, count };
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


// for admin usage
export async function getStudentsII(){
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")

  if (error) {
    console.error(error);
    throw new Error("students could not be loaded");
  }

  return data;
}