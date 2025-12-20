// app/api/auth/user/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ user: null });
  }

  // fetch the user data from students registry table
  const { data: profile, error: profileError } = await supabase
    .from("students_registry")
    .select("*")
    .eq("matric_number", user?.user_metadata?.matric_no)
    .single();

  if (profileError) {
    console.warn("Could not fetch profile:", profileError.message);
  }

  // fetch the user data from users table
  const { data: profileII, error: profileErrorII } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (profileErrorII) {
    console.warn("Could not fetch profile:", profileErrorII.message);
  }

  // Combine Auth data and Profile data
  // We nest profile inside the user object to keep it organized
  const combinedUser = {
    ...user,
    profile: profile || null,
    profileII: profileII || null,
  };

  return NextResponse.json({ user: combinedUser });
}
