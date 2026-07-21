"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";

export async function requireUser() {
  const user = await getCurrentUser();

  // If no user, redirect immediately back home
  if (!user) {
    redirect("/login?error=auth_required");
  }

  return user;
}

// If role not class rep, redirect to student dashboard
export async function requireRole() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=auth_required");
  }

  const { data: dbUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (dbUser?.role !== "class rep") {
    redirect("/dashboard?error=unauthorized");
  }

  return dbUser?.role;
}
