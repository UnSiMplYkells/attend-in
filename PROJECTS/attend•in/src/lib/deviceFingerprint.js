"use client"
export async function createDeviceFingerprint(userId) {
  const uuid = crypto.randomUUID();
  const userAgent = navigator.userAgent;
  let platform = "unknown";
  if (navigator.userAgentData) {
    platform = navigator.userAgentData.platform;
  }
  const screenRes = `${window.screen.width}x${window.screen.height}`;

  const raw = uuid + userAgent + platform + screenRes;
  const deviceId = await sha256(raw);

  return { uuid, deviceId };
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}