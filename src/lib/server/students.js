"use server"
import { createClient } from "@/app/utils/supabase/server";

export async function getStudents(department, page = 1, searchTerm = "") {
  const supabase = await createClient();

  const ITEMS_PER_PAGE = 35;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  //start building the query
  let query = supabase
    .from("users")
    .select("*, students_registry!inner(department)", { count: "exact" })
    // .eq("students_registry.department", department) //filters by department
    .order("full_name", { ascending: true })
    .range(from, to);

  //applys the search filter if needed
  if (searchTerm) {
    query = query.or(
      `full_name.ilike.%${searchTerm}%,matric_number.ilike.%${searchTerm}%`,
      // { foreignTable: "users" },
    );
  }

  //awaits execution here
  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("students could not be loaded");
  }

  return { data, count };
}

export async function checkUserExists(matricNo) {
  const supabase = await createClient();

  const { data: existingUsers, error } = await supabase
    .from("users")
    .select("id, full_name, matric_number")
    .eq("matric_number", matricNo)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return existingUsers;
}

//for the downlaod funciton of class list bypassing pagination
export async function getStudentsByDept(department) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*, students_registry!inner(department)");
    // .eq("students_registry.department", department) //filters by department

  if (error) {
    console.error(error);
    throw new Error("students could not be loaded");
  }

  return data;
}

export async function getClassStudents(courseId, page = 1, searchTerm = "") {
  const supabase = await createClient();

  const ITEMS_PER_PAGE = 35;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("rosters")
    .select("*, users!inner(full_name, matric_number)", { count: "exact" })
    .eq("class_id", courseId)
    .range(from, to);

  // Applies the search filter on the joined 'users' table
  if (searchTerm) {
    query = query.or(
      `full_name.ilike.%${searchTerm}%,matric_number.ilike.%${searchTerm}%`,
      { referencedTable: "users" } 
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("students could not be loaded");
  }

  return { data, count };
}

// Bypasses pagination strictly for the CSV Download feature

export async function getAllClassStudents(courseId) {
  const supabase = await createClient();

  // Force courseId to be a number just in case Supabase is rejecting a string
  const safeCourseId = Number(courseId);

  const { data, error } = await supabase
    .from("rosters")
    .select("*, users!inner(full_name, matric_number)")
    .eq("class_id", safeCourseId);

  if (error) {
    // This will print the EXACT reason it's failing in your VS Code terminal
    console.error("SUPABASE EXPORT ERROR:", error); 
    throw new Error("Students could not be loaded for export");
  }

  return data;
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