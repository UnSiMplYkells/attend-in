"use server";
import { createClient } from "@/app/utils/supabase/server";
import { getGlobalSession } from "./app_settings";

export async function signUpNewUser({
  email,
  password,
  matricNo,
  fullName,
  userType = "student",
  deviceFingerprint,
}) {
  const supabase = await createClient();

  //actual signup code
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://atttendin.netlify.app/login",
      // Conditionally add matric_no to metadata only for students
      data: userType === "student" ? { matric_no: matricNo } : {},
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }
  if (!authData.user) {
    throw new Error("User was not created. Please try again later.");
  }

  const authUserId = authData.user.id;
  let finalFullName = fullName || "";
  let department = null; // Default department to null

  //pulling data form the students registry ONLY if user is a student
  if (userType === "student") {
    const { data: registryResult, error: registryError } = await supabase
      .from("students_registry")
      .select("full_name, department")
      .eq("matric_number", matricNo)
      .single();

    if (registryError) {
      throw new Error(registryError.message);
    }
    if (!registryResult) {
      throw new Error("Student record not found");
    }

    finalFullName = registryResult.full_name;
    department = registryResult.department; // Assign department from registry
  }

  //fills users table with correct data both directly form the signup form and from the registry table
  const { error: newStudentError } = await supabase
    .from("users")
    .insert([
      {
        id: authUserId,
        matric_number: userType === "student" ? matricNo : null,
        full_name: finalFullName,
        bound_device_id: deviceFingerprint || null,
        email,
        role: userType === "student" ? "student" : "general_user",
        user_type: userType === "student" ? "student" : "general_user",
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

  return { success: true };
}

// for admin
export async function signInWithEmail({ email, password }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createClassRepInvite(matricNo) {
  const supabase = await createClient();

  const { data: student, error: studentError } = await supabase
    .from("students_registry")
    .select("department")
    .eq("matric_number", matricNo)
    .single();

  if (studentError || !student) {
    throw new Error("Matric number not found in the university registry.");
  }

  const otp = Math.floor(10000000 + Math.random() * 90000000).toString();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  const { data, error } = await supabase.from("class_rep_invites").upsert(
    {
      matric_number: matricNo,
      otp_code: otp,
      expires_at: expiresAt.toISOString(),
      used: false, // Explicitly set used to false on new invite/re-invite
    },
    { onConflict: "matric_number" },
  );

  if (error) {
    console.error("Error creating class rep invite:", error);
    throw new Error("Failed to create invitation.");
  }

  return { otp, expiresAt: expiresAt.toISOString() };
}

export async function getActiveInvites() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("class_rep_invites")
    .select("*")
    .order("expires_at", { ascending: false });

  if (error) {
    throw new Error("Could not fetch active invites.");
  }
  return data;
}

export async function signUpClassRep(formData) {
  const supabase = await createClient();
  const { matricNo, otp, contact, level, ...rest } = formData;

  // 1. Check Invite
  const { data: invite, error: inviteError } = await supabase
    .from("class_rep_invites")
    .select("*")
    .eq("matric_number", matricNo)
    .single();

  if (inviteError || !invite) {
    throw new Error("No class rep invite found for this matric number.");
  }
  if (invite.otp_code !== otp) throw new Error("Invalid OTP provided.");
  if (invite.used) throw new Error("OTP already used. Request a new one.");

  // 2. Check Expiry
  const currentTime = new Date();
  const expiresAt = new Date(invite.expires_at);
  if (currentTime > expiresAt) {
    throw new Error("OTP has expired. Request a new one.");
  }

  // 3. Mark Invite as Used
  const { error: updateError } = await supabase
    .from("class_rep_invites")
    .update({ used: true })
    .eq("matric_number", matricNo);

  if (updateError) {
    throw new Error("Failed to update OTP usage. Please try again.");
  }

  // 4. Create the User (as a student first)
  const { userId, deviceFingerprint } = await signUpNewUser({
    ...rest,
    matricNo,
    userType: "student",
  });

  // 5. Get Department from Registry
  const { data: registry, error: registryError } = await supabase
    .from("students_registry")
    .select("department")
    .eq("matric_number", matricNo)
    .single();

  if (registryError || !registry) {
    throw new Error("Could not verify department for this matric number.");
  }

  // 6. Calculate Admission Year
  const globalSession = await getGlobalSession();
  const currentBaseYear = parseInt(globalSession.substring(0, 4), 10);
  const admissionYearToSave = currentBaseYear - (level - 100) / 100;

  // 7. Create the Class Rep Entry
  try {
    const { error: repError } = await supabase.from("class_reps").insert({
      student_id: userId,
      contact,
      department: registry.department,
      admission_session_year: admissionYearToSave,
    });

    if (repError) throw repError;
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error(
        "A Class Representative already exists for your department at this level."
      );
    }
    console.error("Failed to create class_rep entry for user:", userId, error);
    throw new Error("Unable to save class rep details after user creation.");
  }

  // 8. Update the user role and admission year
  const { error: updateRoleError } = await supabase
    .from("users")
    .update({ role: "class rep", admission_session_year: admissionYearToSave })
    .eq("id", userId);

  if (updateRoleError) {
    console.error("Failed to update user role for user:", userId);
    throw new Error("Unable to update user role to class rep.");
  }

  return { success: true, deviceFingerprint };
}

export async function verifyStudentForInvite(matricNo) {
  const supabase = await createClient();

  // A. Fetch student's details from the registry
  const { data: student, error: studentError } = await supabase
    .from("students_registry")
    .select("full_name, department, matric_number")
    .eq("matric_number", matricNo)
    .single();

  if (studentError || !student) {
    throw new Error("Matric number not found in the university registry.");
  }

  // B. Extract admission year from matric number
  const admissionYear = parseInt(matricNo.substring(0, 4), 10);

  // C. Query existing reps for the same department
  const { data: reps, error: repsError } = await supabase
    .from("class_reps")
    .select("admission_session_year, users!inner(full_name)")
    .eq("department", student.department);

  if (repsError) {
    console.error("Error fetching existing class reps:", repsError);
    throw new Error("Could not verify existing class representatives.");
  }

  // D. Fetch global session and calculate levels
  const globalSession = await getGlobalSession();
  const currentBaseYear = parseInt(globalSession.substring(0, 4), 10);

  const existingReps = reps.map((rep) => ({
    ...rep,
    level: (currentBaseYear - rep.admission_session_year) * 100 + 100,
    full_name: rep.users.full_name, // Flatten the nested user name
  }));

  // E. Check for conflict
  const hasConflict = existingReps.some(
    (rep) => rep.admission_session_year === admissionYear
  );

  // F. Return the complete payload
  return { student, existingReps, hasConflict };
}
