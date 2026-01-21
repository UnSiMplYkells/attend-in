export function validateAttendance({
  session,
  today,
  now,
  existingRecord,
  distanceFrmHall,
}) {
  if (existingRecord) {
    return "Attendance already marked!";
  }

  if (session.session_date !== today) {
    return "Class not for today";
  }

  if (now > session.timetables.end_time) {
    return "This class is over. Attendance not recorded";
  }

  if (!session.isActivated) {
    return "Attendance window is not active yet or is over.";
  }

  if (distanceFrmHall > 50) {
    return "Not within class vicinity.";
  }

  return null;
}
