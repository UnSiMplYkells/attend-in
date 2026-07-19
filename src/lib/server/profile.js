"use server";
import { createClient } from "@/app/utils/supabase/server";
import { getCurrentUser } from "./session";
import { getGlobalSession } from "./app_settings";

export async function getStudentProfileStats() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const [
    { data: profile },
    { data: rosters },
    { data: records },
    globalSession,
  ] = await Promise.all([
    supabase
      .from("users")
      .select("*, students_registry!matric_number(department)")
      .eq("id", user.id)
      .single(),
    supabase
      .from("rosters")
      .select("class_id, classes(course_code, course_title)")
      .eq("student_id", user.id),
    supabase
      .from("attendance_records")
      .select("session_id")
      .eq("student_id", user.id),
    getGlobalSession(),
  ]);

  // Calculate dynamic level
  let level = null;
  if (profile?.admission_session_year && globalSession) {
    const currentBaseYear = parseInt(globalSession.substring(0, 4), 10);
    level = (currentBaseYear - profile.admission_session_year) * 100 + 100;
  }

  // Attach level to profile object
  if (profile) {
    profile.level = level;
  }

  const enrolledClasses =
    rosters?.map((r) => ({
      class_id: r.class_id,
      course_code: r.classes.course_code,
      course_title: r.classes.course_title,
    })) || [];

  const classIds = enrolledClasses.map((c) => c.class_id);

  let sessions = [];
  if (classIds.length > 0) {
    const { data } = await supabase
      .from("attendance_sessions")
      .select("id, class_id, timetables(start_time, end_time)")
      .in("class_id", classIds);

    sessions = data || [];
  }

  const attendedSessionIds = new Set(records?.map((r) => r.session_id) || []);

  let totalHeld = 0;
  let totalAttended = 0;
  let totalHours = 0;

  const courseStatsMap = {};
  enrolledClasses.forEach((c) => {
    courseStatsMap[c.class_id] = { ...c, held: 0, attended: 0 };
  });

  sessions?.forEach((session) => {
    const cId = session.class_id;
    if (courseStatsMap[cId]) {
      courseStatsMap[cId].held += 1;
      totalHeld += 1;

      if (attendedSessionIds.has(session.id)) {
        courseStatsMap[cId].attended += 1;
        totalAttended += 1;

        if (session.timetables?.start_time && session.timetables?.end_time) {
          const start = new Date(
            `1970-01-01T${session.timetables.start_time}Z`,
          );
          const end = new Date(`1970-01-01T${session.timetables.end_time}Z`);
          const diffHrs = (end - start) / (1000 * 60 * 60);
          if (diffHrs > 0) totalHours += diffHrs;
        }
      }
    }
  });

  const courses = Object.values(courseStatsMap).map((c) => ({
    ...c,
    percentage: c.held === 0 ? 0 : Math.round((c.attended / c.held) * 100),
  }));

  const sortedCourses = [...courses]
    .filter((c) => c.held > 0)
    .sort((a, b) => b.percentage - a.percentage);

  const mostAttended = sortedCourses.length > 0 ? sortedCourses[0] : null;

  let mostMissed =
    sortedCourses.length > 1 ? sortedCourses[sortedCourses.length - 1] : null;

  if (mostMissed && mostMissed.percentage === 100) {
    mostMissed = null;
  }

  const globalPercentage =
    totalHeld === 0 ? 0 : Math.round((totalAttended / totalHeld) * 100);

  return {
    profile,
    globalPercentage,
    totalHours: Math.round(totalHours * 10) / 10,
    mostAttended,
    mostMissed,
    courses,
  };
}

export async function updateStudentAdmissionYear(admissionYear) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("users")
    .update({ admission_session_year: admissionYear })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating admission year:", error);
    throw new Error("Failed to update admission year.");
  }

  return true;
}

export async function dropCourse(classId) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("rosters")
    .delete()
    .match({ student_id: user.id, class_id: classId });

  if (error) throw new Error("Failed to drop course");
  return true;
}

export async function upgradeUserToStudent(matricNumber, deviceFingerprint) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  // 1. Verify in registry and get the official name
  const { data: registryResult, error: registryError } = await supabase
    .from("students_registry")
    .select("matric_number, full_name") // Removed department, added full_name
    .eq("matric_number", matricNumber)
    .single();

  if (registryError || !registryResult) {
    throw new Error("Matric number not found in official university registry.");
  }

  // 2. Ensure no other user has already claimed this matric number
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("matric_number", matricNumber)
    .maybeSingle();

  if (existingUser) {
    throw new Error("This matric number is already linked to another account.");
  }

  // 3. Perform the upgrade
  const { error } = await supabase
    .from("users")
    .update({
      matric_number: matricNumber,
      full_name: registryResult.full_name, // Overwrite name with official registry name
      bound_device_id: deviceFingerprint, // Bind their device for attendance
      user_type: "student",
      role: "student",
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  return true;
}