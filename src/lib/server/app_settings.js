"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function getGlobalSession() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("current_academic_session")
    .eq("id", 1)
    .single();

  if (error || !data) {
    console.error("Error fetching global session:", error);
    // Fallback to a default session if not found
    return "2025/2026";
  }

  return data.current_academic_session;
}

export async function updateGlobalSession(sessionString) {
  // Regex to validate the YYYY/YYYY format and consecutive years
  const isValidFormat = /^\d{4}\/\d{4}$/.test(sessionString);
  if (!isValidFormat) {
    throw new Error("The year is not valid. Follow the format yyyy/yyyy.");
  }

  const [startYear, endYear] = sessionString.split("/").map(Number);
  if (endYear !== startYear + 1) {
    throw new Error("The academic session years must be consecutive (e.g., 2025/2026).");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("app_settings")
    .update({ current_academic_session: sessionString })
    .eq("id", 1);

  if (error) {
    console.error("Error updating global session:", error);
    throw new Error("Failed to update the academic session.");
  }

  return true;
}
