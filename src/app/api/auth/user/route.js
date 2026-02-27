import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  //gets the Auth User first (we need the matric to fetch the rest)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ user: null });
  }

  const matricNo = user?.user_metadata?.matric_no;
  const userId = user?.id;

  //fetches BOTH profiles at the exact same time in Parallel
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

  //destructure results
  const { data: profile } = registryResult;
  const { data: profileII } = userProfileResult;

  //using rest operator, adds the profiles to the user object
  const combinedUser = {
    ...user,
    profile: profile || null,
    profileII: profileII || null,
  };

  return NextResponse.json({ user: combinedUser });
}
