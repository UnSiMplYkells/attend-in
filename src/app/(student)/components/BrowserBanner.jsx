// components/BrowserWarningBanner.tsx
"use client";

import { isAndroidEdge } from "@/app/utils/browserDetection";
import { useEffect, useState } from "react";

export default function BrowserWarningBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Check if they have already dismissed this warning in the past
    const hasDismissed = localStorage.getItem("hideEdgeWarning") === "true";

    // 2. If they haven't dismissed it, and they are on Android Edge, show it
    if (!hasDismissed && isAndroidEdge()) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    // 3. Save the dismissal state to the device so it never shows again
    localStorage.setItem("hideEdgeWarning", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-100 border-b-4 border-amber-500 text-amber-900 px-4 py-3 shadow-md relative z-50 flex items-start justify-between">
      <div className="flex flex-col">
        <span className="font-bold text-base mb-1">
          ⚠️ Edge Browser Detected
        </span>
        <span className="text-sm">
          Your current browser strictly blocks live attendance notifications on
          Android. For instant class alerts, we highly recommend opening and
          installing this app via <b>Google Chrome</b>.
        </span>
      </div>

      <button
        onClick={handleDismiss}
        className="ml-4 p-2 text-amber-900 hover:bg-amber-200 rounded-md font-bold transition-colors"
        aria-label="Dismiss warning"
      >
        ✕
      </button>
    </div>
  );
}
