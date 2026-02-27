"use server";
import { createClient } from "@/app/utils/supabase/server";

export async function getDashboardData(userId) {
  if (!userId) return null;

  const supabase = await createClient();

  // 1. Get classes the user is registered for
  const { data: rosters } = await supabase
    .from("rosters")
    .select("class_id, classes(course_code, course_name)")
    .eq("student_id", userId);

  const classIds = rosters?.map((r) => r.class_id) || [];
  const activeCourses = classIds.length;

  if (!classIds.length) {
    return {
      stats: {
        totalStudents: 0,
        activeCourses: 0,
        avgAttendance: "0%",
        flaggedCount: 0,
      },
      charts: {
        ratioData: [],
        courseData: [],
      },
      recentActivity: [],
    };
  }

  // 2. Total students across those classes
  const { count: totalStudents } = await supabase
    .from("rosters")
    .select("*", { count: "exact", head: true })
    .in("class_id", classIds);

  // 3. Fetch recent attendance sessions
  const { data: sessions } = await supabase
    .from("attendance_sessions")
    .select(
      `
      id,
      window_start,
      window_end,
      class_id,
      classes(course_code),
      attendance_records(id, distance_frm_hall, student_id)
    `,
    )
    .in("class_id", classIds)
    .order("window_start", { ascending: false })
    .limit(10);

  let totalPresent = 0;
  let totalExpected = 0;
  let flaggedCount = 0;
  const courseDataMap = {};

  const recentActivity =
    sessions?.map((session) => {
      const presentCount = session.attendance_records.length;

      // ⚠️ Replace with real roster count per class if needed
      const classRosterCount = 45;

      const absentCount = Math.max(0, classRosterCount - presentCount);

      totalPresent += presentCount;
      totalExpected += classRosterCount;

      session.attendance_records.forEach((record) => {
        if (parseInt(record.distance_frm_hall) > 50) flaggedCount++;
      });

      const courseCode = session.classes.course_code;

      if (!courseDataMap[courseCode]) {
        courseDataMap[courseCode] = {
          name: courseCode,
          present: 0,
          total: 0,
        };
      }

      courseDataMap[courseCode].present += presentCount;
      courseDataMap[courseCode].total += classRosterCount;

      return {
        id: session.id,
        course: courseCode,
        date: new Date(session.window_start).toLocaleDateString(),
        present: presentCount,
        absent: absentCount,
      };
    }) || [];

  const avgAttendance =
    totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;

  const absentTotal = Math.max(0, totalExpected - totalPresent);

  const courseData = Object.values(courseDataMap).map((c) => ({
    name: c.name,
    avg: Math.round((c.present / c.total) * 100) || 0,
  }));

  return {
    stats: {
      totalStudents: totalStudents || 0,
      activeCourses,
      avgAttendance: `${avgAttendance}%`,
      flaggedCount,
    },
    charts: {
      ratioData: [
        { name: "Present", value: totalPresent },
        { name: "Absent", value: absentTotal },
      ],
      courseData,
    },
    recentActivity,
  };
}
