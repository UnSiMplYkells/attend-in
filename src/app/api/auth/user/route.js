// src/app/api/auth/user/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // 1. Get the Auth User first (we need the ID/Matric to fetch the rest)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ user: null });
  }

  const matricNo = user?.user_metadata?.matric_no;
  const userId = user?.id;

  // 2. Fetch BOTH profiles at the exact same time (Parallel)
  const [registryResult, userProfileResult] = await Promise.all([
    supabase
      .from("students_registry")
      .select("*")
      .eq("matric_number", matricNo)
      .single(),
    supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single(),
  ]);

  // 3. Destructure results
  const { data: profile } = registryResult;
  const { data: profileII } = userProfileResult;

  const combinedUser = {
    ...user,
    profile: profile || null,
    profileII: profileII || null,
  };

  return NextResponse.json({ user: combinedUser });
}
