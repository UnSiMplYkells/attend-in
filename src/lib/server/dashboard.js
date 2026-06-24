// "use server";
// import { createClient } from "@/app/utils/supabase/server";
// import { getCurrentUser } from "./session";

// export async function getDashboardData() {
//   const supabase = await createClient();
//   const user = await getCurrentUser();
//   if (!user) throw new Error("Not authenticated");

//   // 1. Get classes where the user is a student/rep
//   const { data: userRosters } = await supabase
//     .from("rosters")
//     .select("class_id")
//     .eq("student_id", user.id);

//   const classIds = userRosters?.map((r) => r.class_id) || [];
//   const activeCourses = [...new Set(classIds)].length;

//   if (activeCourses === 0) return null;

//   // 2. Count TOTAL registered students per class to calculate absentees
//   const { data: allRosters } = await supabase
//     .from("rosters")
//     .select("class_id")
//     .in("class_id", classIds);

//   const rosterCounts = {};
//   let totalStudentsAcrossClasses = 0;
//   allRosters?.forEach((r) => {
//     rosterCounts[r.class_id] = (rosterCounts[r.class_id] || 0) + 1;
//     totalStudentsAcrossClasses++;
//   });

//   // 3. Fetch recent attendance sessions
//   const { data: sessions } = await supabase
//     .from("attendance_sessions")
//     .select(
//       `
//       id, window_start, class_id,
//       classes(course_code),
//       attendance_records(distance_frm_hall)
//     `,
//     )
//     .in("class_id", classIds)
//     .order("window_start", { ascending: false })
//     .limit(10);

//   // 4. Calculate Stats based on the Roster vs. Records rule
//   let totalPresent = 0;
//   let totalExpected = 0;
//   let flaggedCount = 0;
//   const courseDataMap = {};

//   const recentActivity =
//     sessions?.map((session) => {
//       const presentCount = session.attendance_records?.length || 0;
//       const classExpected = rosterCounts[session.class_id] || 0; // Total registered for THIS class
//       const absentCount = Math.max(0, classExpected - presentCount); // The math you requested

//       totalPresent += presentCount;
//       totalExpected += classExpected;

//       // Check for flagged distances (> 50m)
//       session.attendance_records?.forEach((record) => {
//         if (parseInt(record.distance_frm_hall) > 50) flaggedCount++;
//       });

//       // Aggregate for Bar Chart
//       const courseCode = session.classes?.course_code || "Unknown";
//       if (!courseDataMap[courseCode]) {
//         courseDataMap[courseCode] = { name: courseCode, present: 0, total: 0 };
//       }
//       courseDataMap[courseCode].present += presentCount;
//       courseDataMap[courseCode].total += classExpected;

//       return {
//         id: session.id,
//         course: courseCode,
//         date: new Date(session.window_start).toLocaleDateString(undefined, {
//           month: "short",
//           day: "numeric",
//         }),
//         present: presentCount,
//         absent: absentCount,
//         expected: classExpected,
//       };
//     }) || [];

//   const avgAttendance =
//     totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;
//   const absentTotal = Math.max(0, totalExpected - totalPresent);

//   return {
//     stats: {
//       totalStudents: totalStudentsAcrossClasses,
//       activeCourses,
//       avgAttendance: `${avgAttendance}%`,
//       flaggedCount,
//     },
//     charts: {
//       ratioData: [
//         { name: "Present", value: totalPresent },
//         { name: "Absent", value: absentTotal },
//       ],
//       courseData: Object.values(courseDataMap).map((c) => ({
//         name: c.name,
//         avg: c.total > 0 ? Math.round((c.present / c.total) * 100) : 0,
//       })),
//       trendData: recentActivity
//         .slice(0, 5)
//         .reverse()
//         .map((s) => ({
//           week: s.date,
//           attendance:
//             s.expected > 0 ? Math.round((s.present / s.expected) * 100) : 0,
//         })),
//     },
//     recentActivity,
//   };
// }

"use server";
import { createClient } from "@/app/utils/supabase/server";
import { getCurrentUser } from "./session";

// export async function getDashboardData() {
//   const supabase = await createClient();
//   const user = await getCurrentUser();
//   if (!user) throw new Error("Not authenticated");

//   // 1. Get classes where the user is a student/rep
//   const { data: userRosters } = await supabase
//     .from("rosters")
//     .select("class_id")
//     .eq("student_id", user.id);

//   const classIds = userRosters?.map((r) => r.class_id) || [];
//   const activeCourses = [...new Set(classIds)].length;

//   if (activeCourses === 0) return null;

//   // 2 & 3. PARALLEL FETCH: Get total rosters AND recent sessions simultaneously
//   // This cuts the waiting time completely in half.
//   const [rostersResponse, sessionsResponse] = await Promise.all([
//     supabase.from("rosters").select("class_id").in("class_id", classIds),

//     supabase
//       .from("attendance_sessions")
//       .select(
//         `
//         id, window_start, class_id,
//         classes(course_code),
//         attendance_records(distance_frm_hall)
//       `,
//       )
//       .in("class_id", classIds)
//       .order("window_start", { ascending: false })
//       .limit(10),
//   ]);

//   const allRosters = rostersResponse.data || [];
//   const sessions = sessionsResponse.data || [];

//   // 4. Calculate Stats (Execution remains identical, but data is already here)
//   const rosterCounts = {};
//   let totalStudentsAcrossClasses = 0;

//   allRosters.forEach((r) => {
//     rosterCounts[r.class_id] = (rosterCounts[r.class_id] || 0) + 1;
//     totalStudentsAcrossClasses++;
//   });

//   let totalPresent = 0;
//   let totalExpected = 0;
//   let flaggedCount = 0;
//   const courseDataMap = {};

//   const recentActivity = sessions.map((session) => {
//     const presentCount = session.attendance_records?.length || 0;
//     const classExpected = rosterCounts[session.class_id] || 0;
//     const absentCount = Math.max(0, classExpected - presentCount);

//     totalPresent += presentCount;
//     totalExpected += classExpected;

//     session.attendance_records?.forEach((record) => {
//       if (parseInt(record.distance_frm_hall) > 50) flaggedCount++;
//     });

//     const courseCode = session.classes?.course_code || "Unknown";
//     if (!courseDataMap[courseCode]) {
//       courseDataMap[courseCode] = { name: courseCode, present: 0, total: 0 };
//     }
//     courseDataMap[courseCode].present += presentCount;
//     courseDataMap[courseCode].total += classExpected;

//     return {
//       id: session.id,
//       course: courseCode,
//       date: new Date(session.window_start).toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//       }),
//       present: presentCount,
//       absent: absentCount,
//       expected: classExpected,
//     };
//   });

//   const avgAttendance =
//     totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;
//   const absentTotal = Math.max(0, totalExpected - totalPresent);

//   return {
//     stats: {
//       totalStudents: totalStudentsAcrossClasses,
//       activeCourses,
//       avgAttendance: `${avgAttendance}%`,
//       flaggedCount,
//     },
//     charts: {
//       ratioData: [
//         { name: "Present", value: totalPresent },
//         { name: "Absent", value: absentTotal },
//       ],
//       courseData: Object.values(courseDataMap).map((c) => ({
//         name: c.name,
//         avg: c.total > 0 ? Math.round((c.present / c.total) * 100) : 0,
//       })),
//       trendData: recentActivity
//         .slice(0, 5)
//         .reverse()
//         .map((s) => ({
//           week: s.date,
//           attendance:
//             s.expected > 0 ? Math.round((s.present / s.expected) * 100) : 0,
//         })),
//     },
//     recentActivity,
//   };
// }

export async function getDashboardData() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  // 1. Get classes where the user is a student/rep
  const { data: userRosters } = await supabase
    .from("rosters")
    .select("class_id")
    .eq("student_id", user.id);

  const classIds = userRosters?.map((r) => r.class_id) || [];
  const activeCourses = [...new Set(classIds)].length;

  if (activeCourses === 0) return null;

  // 2 & 3. PARALLEL FETCH: Get total rosters AND recent sessions simultaneously
  // This cuts the waiting time completely in half.
  const [rostersResponse, sessionsResponse] = await Promise.all([
    supabase.from("rosters").select("class_id").in("class_id", classIds),

    supabase
      .from("attendance_sessions")
      .select(
        `
        id, window_start, class_id,
        classes(course_code),
        attendance_records(distance_frm_hall)
      `,
      )
      .in("class_id", classIds)
      .order("window_start", { ascending: false })
      .limit(10),
  ]);

  const allRosters = rostersResponse.data || [];
  const sessions = sessionsResponse.data || [];

  // 4. Calculate Stats (Execution remains identical, but data is already here)
  const rosterCounts = {};
  let totalStudentsAcrossClasses = 0;

  allRosters.forEach((r) => {
    rosterCounts[r.class_id] = (rosterCounts[r.class_id] || 0) + 1;
    totalStudentsAcrossClasses++;
  });

  let totalPresent = 0;
  let totalExpected = 0;
  let flaggedCount = 0;
  const courseDataMap = {};

  const recentActivity = sessions.map((session) => {
    const presentCount = session.attendance_records?.length || 0;
    const classExpected = rosterCounts[session.class_id] || 0;
    const absentCount = Math.max(0, classExpected - presentCount);

    totalPresent += presentCount;
    totalExpected += classExpected;

    session.attendance_records?.forEach((record) => {
      if (parseInt(record.distance_frm_hall) > 50) flaggedCount++;
    });

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

  const avgAttendance =
    totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;
  const absentTotal = Math.max(0, totalExpected - totalPresent);

  return {
    stats: {
      totalStudents: totalStudentsAcrossClasses,
      activeCourses,
      avgAttendance: `${avgAttendance}%`,
      flaggedCount,
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
          attendance:
            s.expected > 0 ? Math.round((s.present / s.expected) * 100) : 0,
        })),
    },
    recentActivity,
  };
}