export default function getCurrentTime() {
  const now = new Date();

  // Extract hours, minutes, and seconds
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Pad with leading zeros if needed
  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
