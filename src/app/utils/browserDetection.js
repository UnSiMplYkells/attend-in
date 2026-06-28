// utils/browserDetection.ts

export function isAndroidEdge(){
  // Prevent Next.js server-side rendering errors
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  const isAndroid = /android/i.test(ua);
  
  // Microsoft Edge on Android uses "EdgA" in its user agent string
  const isEdge = /EdgA/i.test(ua) || /Edg\//i.test(ua);

  return isAndroid && isEdge;
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