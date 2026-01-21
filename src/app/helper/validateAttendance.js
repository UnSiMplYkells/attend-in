export function validateAttendance({ session, today, now, existingRecord }) {
  if (existingRecord) {
    return "Attendance already marked!";
  }

  if (session.session_date !== today) {
    return "Class not for today";
  }

  if (session.window_end <= now) {
    return "This class is over. Attendance not recorded";
  }

  if (!session.isActivated) {
    return "Attendance window is not active yet or is over.";
  }

  return null;
}
