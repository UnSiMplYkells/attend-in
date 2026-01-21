export default function random30MinSlot(startStr, endStr, timeSlot) {
  //time duration you want calculated to ms
  const DURATION_MS = timeSlot * 60 * 1000; // 30 minutes

  function parseToMs(s) {
    if (!s) return NaN;

    const [hh = 0, mm = 0, ss = 0] = s.split(":").map(Number);
    const d = new Date();
    d.setHours(hh, mm || 0, ss || 0, 0);
    return d.getTime();
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatToISO(ms) {
    return new Date(ms).toISOString();
  }

  const startMs = parseToMs(startStr);
  const endMs = parseToMs(endStr);

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    throw new Error("Invalid start or end time");
  }
  if (endMs - startMs < DURATION_MS) {
    throw new Error("Range is smaller than 30 minutes");
  }

  // latest possible start so that start + duration <= end
  const latestStart = endMs - DURATION_MS;

  // choose a random millisecond between startMs and latestStart
  const randomMs = (() => {
    const raw = startMs + Math.floor(Math.random() * (latestStart - startMs + 1));

    //rounds to nearest minute
    const minute = 60_000;
    return Math.floor(raw / minute) * minute;
    return raw;
  })();

  const slotStart = randomMs;
  const slotEnd = slotStart + DURATION_MS;

  return {
    startTime: formatToISO(slotStart),
    endTime: formatToISO(slotEnd)
  };
}