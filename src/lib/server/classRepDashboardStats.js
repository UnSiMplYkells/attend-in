"use server"

import { createClient } from "@/app/utils/supabase/server";
import { getCurrentUser } from "./session";

export async function getClassRepDashboardStats() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user || !user.profileII) {
    throw new Error("User is not authenticated or is missing profile data.");
  }

  const { department, admission_session_year } = user.profileII;

  if (!department || !admission_session_year) {
    throw new Error("Class Rep is missing Department or Admission Year.");
  }

  // Parallelize all database calls for maximum performance
  const [
    { count: totalStudents, error: studentsError },
    { data: userRosters, error: rostersError },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("students_registry.department", department)
      .eq("admission_session_year", admission_session_year),
    supabase.from("rosters").select("class_id").eq("student_id", user.id),
  ]);

  if (studentsError) throw new Error("Failed to count total students.");
  if (rostersError) throw new Error("Failed to fetch user's classes.");

  const classIds = userRosters?.map((r) => r.class_id) || [];
  const activeCourses = [...new Set(classIds)].length;

  if (activeCourses === 0) {
    return {
      stats: { totalStudents, activeCourses, avgAttendance: "0%" },
      charts: { ratioData: [], courseData: [], trendData: [] },
      recentActivity: [],
    };
  }

  // Fetch rosters and sessions for the user's classes in parallel
  const [rostersResponse, sessionsResponse] = await Promise.all([
    supabase.from("rosters").select("class_id").in("class_id", classIds),
    supabase
      .from("attendance_sessions")
      .select("id, window_start, class_id, classes(course_code), attendance_records(id)")
      .in("class_id", classIds)
      .order("window_start", { ascending: false })
      .limit(10),
  ]);

  const allRosters = rostersResponse.data || [];
  const sessions = sessionsResponse.data || [];

  const rosterCounts = {};
  allRosters.forEach((r) => {
    rosterCounts[r.class_id] = (rosterCounts[r.class_id] || 0) + 1;
  });

  let totalPresent = 0;
  let totalExpected = 0;
  const courseDataMap = {};

  const recentActivity = sessions.map((session) => {
    const presentCount = session.attendance_records?.length || 0;
    const classExpected = rosterCounts[session.class_id] || 0;
    const absentCount = Math.max(0, classExpected - presentCount);

    totalPresent += presentCount;
    totalExpected += classExpected;

    const courseCode = session.classes?.course_code || "Unknown";
    if (!courseDataMap[courseCode]) {
      courseDataMap[courseCode] = { name: courseCode, present: 0, total: 0 };
    }
    courseDataMap[courseCode].present += presentCount;
    courseDataMap[courseCode].total += classExpected;

    return {
      id: session.id,
      course: courseCode,
      date: new Date(session.window_start).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      present: presentCount,
      absent: absentCount,
      expected: classExpected,
    };
  });

  const avgAttendance = totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;
  const absentTotal = Math.max(0, totalExpected - totalPresent);

  return {
    stats: {
      totalStudents,
      activeCourses,
      avgAttendance: `${avgAttendance}%`,
    },
    charts: {
      ratioData: [
        { name: "Present", value: totalPresent },
        { name: "Absent", value: absentTotal },
      ],
      courseData: Object.values(courseDataMap).map((c) => ({
        name: c.name,
        avg: c.total > 0 ? Math.round((c.present / c.total) * 100) : 0,
      })),
      trendData: recentActivity
        .slice(0, 5)
        .reverse()
        .map((s) => ({
          week: s.date,
          attendance: s.expected > 0 ? Math.round((s.present / s.expected) * 100) : 0,
        })),
    },
    recentActivity,
  };
}