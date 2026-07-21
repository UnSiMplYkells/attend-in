export default function random30MinSlot(startStr, endStr, timeSlot) {
  const DURATION_MS = timeSlot * 60 * 1000; // Default: 30 minutes

  // 1. Helper to parse HH:MM:SS into a Date object for today
  function parseToDate(timeStr) {
    if (!timeStr) return null;
    const [hh, mm, ss] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hh || 0, mm || 0, ss || 0, 0);
    return date;
  }

  const startMs = parseToDate(startStr)?.getTime();
  const endMs = parseToDate(endStr)?.getTime();
  const nowMs = Date.now();

  if (isNaN(startMs) || isNaN(endMs)) {
    throw new Error("Invalid start or end time provided.");
  }

  // 2. Determine the valid start time for the random window
  // It's either the current time or the class start time, whichever is LATER.
  // This prevents creating a window that has already passed.
  const validStartMs = Math.max(nowMs, startMs);

  // 3. Calculate the total available time remaining from the valid start
  const remainingMs = endMs - validStartMs;

  if (remainingMs <= 0) {
    throw new Error("Cannot start session: The class has already ended.");
  }

  let slotStartMs, slotEndMs;

  // 4. Logic Branching: Decide window size based on remaining time
  if (remainingMs >= DURATION_MS) {
    // A. Enough time for a full 30-min slot
    // The latest possible start for a 30-min slot is (endMs - 30 mins)
    const latestPossibleStart = endMs - DURATION_MS;
    
    // Pick a random start time between now (or class start) and the latest possible start
    const randomStartOffset = Math.random() * (latestPossibleStart - validStartMs);
    slotStartMs = validStartMs + randomStartOffset;
    slotEndMs = slotStartMs + DURATION_MS;

  } else {
    // B. Not enough time for a full 30-min slot
    // Use the entire remaining time as the attendance window.
    slotStartMs = validStartMs;
    slotEndMs = endMs;
  }

  // 5. Round to the nearest minute for cleaner state management
  const minute = 60 * 1000;
  const finalSlotStart = Math.floor(slotStartMs / minute) * minute;
  const finalSlotEnd = Math.ceil(slotEndMs / minute) * minute;

  // 6. Return ISO strings
  return {
    startTime: new Date(finalSlotStart).toISOString(),
    endTime: new Date(finalSlotEnd).toISOString(),
  };
}
