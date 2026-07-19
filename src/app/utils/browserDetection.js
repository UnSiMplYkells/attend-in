export function isAndroidEdge(){
  // Prevent Next.js server-side rendering errors
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  const isAndroid = /android/i.test(ua);
  
  // Microsoft Edge on Android uses "EdgA" in its user agent string
  const isEdge = /EdgA/i.test(ua) || /Edg\//i.test(ua);

  return isAndroid && isEdge;
};

export function getDeviceInfo() {
  if (typeof window === "undefined") return "Checking Device...";

  const ua = navigator.userAgent;

  let os = "Unknown OS";
  let browser = "Unknown Browser";

  // OS detection
  if (/android/i.test(ua)) os = "Android";
  else if (/iPad|iPhone|iPod/.test(ua)) os = "iOS";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser detection (order matters!)
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios|crmo/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";

  return `${os} - ${browser}`;
};


// export const isNotGoogleChromeOnAndroid = (): boolean => {
//   if (typeof window === "undefined") return false;

//   const ua = navigator.userAgent;
//   const isAndroid = /android/i.test(ua);

//   // If it's not Android (e.g., Desktop or iOS), we don't trigger the warning
//   if (!isAndroid) return false;

//   // Firefox doesn't use the word "Chrome" in its UA, so this will cleanly filter Firefox out.
//   const isChromeLike = /chrome/i.test(ua);

//   // Filter out Chromium-based browsers that break Firebase
//   const isEdge = /edga?/i.test(ua);
//   const isSamsung = /samsungbrowser/i.test(ua);
//   const isOpera = /opr\/|opt\//i.test(ua);
//   const isVivaldi = /vivaldi/i.test(ua);
//   const isKiwi = /kiwi/i.test(ua);
//   const isWebView = /; wv\)/i.test(ua); // Blocks in-app browsers like Instagram/Twitter wrappers

//   const isBrave = (typeof navigator.brave !== "undefined");

//   const isGenuineChrome = 
//     isChromeLike && 
//     !isEdge && 
//     !isSamsung && 
//     !isOpera && 
//     !isVivaldi && 
//     !isKiwi && 
//     !isWebView && 
//     !isBrave;

//   // We return TRUE if they are on Android, but are NOT using the real Chrome
//   return !isGenuineChrome;
// };