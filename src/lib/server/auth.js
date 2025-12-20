"use server";
import { createClient } from "@/app/utils/supabase/server";

export async function signUpNewUser({ email, password, matricNo, deviceFingerprint }) {
  const supabase = await createClient();

  //actual signup code
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000/login",
      data: { matric_no: matricNo },
    },
  });

  if (authError){throw new Error(authError.message)}
  if (!authData.user){throw new Error("User was not created. Please try again later.")}

  const authUserId = authData.user.id;

  //pulling data form the students registry
  const { data: registryResult, error: registryError } = await supabase
    .from("students_registry")
    .select("full_name, department")
    .eq("matric_number", matricNo)
    .single();

  if (registryError){throw new Error(registryError.message)}
  if (!registryResult){throw new Error("Student record not found")}

  //fills users table with correct data both directly form the signup form and from the registry table
  const { error: newStudentError } = await supabase
    .from("users")
    .insert([
      {
        id: authUserId,
        matric_number: matricNo,
        full_name: registryResult.full_name,
        bound_device_id: deviceFingerprint,
        email,
      },
    ])
    .select();

  if (newStudentError) {
    throw new Error(newStudentError.message);
  }

  return { userId: authUserId, deviceFingerprint }; // returned devicefingerprint too so i can store it to localStorage on client, for clarity
}

export async function signInWithMatric({ matricNo, password }) {
  const supabase = await createClient();

  //looks up email by inputed matric number
  const { data: userRecord, error: lookupError } = await supabase
    .from("users")
    .select("email")
    .eq("matric_number", matricNo)
    .single();

  if (lookupError || !userRecord) throw new Error("Matric number not found.");

  //authenticate using email found from corresponding matric no.
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: userRecord.email,
    password,
  });

  if (authError) throw new Error(authError.message);

  return data;
}

// for admin
export async function signInWithEmail({email, password}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message);

  return data;
}