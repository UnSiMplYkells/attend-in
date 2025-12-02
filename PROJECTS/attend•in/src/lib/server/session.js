"use server";
import { createClient } from "@/app/utils/supabase/server";

export async function getCurrentUser(){
  const supabase = await createClient();

  const {data: {session} } = await supabase.auth.getSession()
  if(!session) return null

  const { data, error } = await supabase.auth.getUser()

  if (error) throw new Error(error.message)

  return data?.user || null
}