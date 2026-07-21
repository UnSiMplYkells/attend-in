"use client";

import useFcmToken from "@/hooks/useFCMToken"; // Adjust path if needed
import { useState, useEffect } from "react";
import {
  MdNotificationsActive,
  MdLocationOn,
  MdLockOutline,
} from "react-icons/md";

export default function PermissionsManager() {
  const { requestPermission } = useFcmToken();
  const [perms, setPerms] = useState({
    notifications: "granted", // default to granted so it doesn't flash on load
    location: "granted",
  });
  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async () => {
    let notifStatus = "default";
    let locStatus = "default";

    // Check Notifications
    if ("Notification" in window) {
      notifStatus = Notification.permission;
    }

    // Check Location
    if ("permissions" in navigator) {
      try {
        const geoPerm = await navigator.permissions.query({
          name: "geolocation",
        });
        locStatus = geoPerm.state; // 'granted', 'prompt', or 'denied'
      } catch (err) {
        locStatus = "prompt";
      }
    }

    setPerms({
      notifications: notifStatus,
      location: locStatus === "prompt" ? "default" : locStatus,
    });
    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const handleEnableClicks = async () => {
    // 1. Ask for Notifications First
    if (perms.notifications === "default") {
      const permission = await window.Notification.requestPermission();
      if (permission === "granted") {
        await requestPermission(); // Fire your FCM hook
      }
    }

    // 2. Ask for Location Second
    if (perms.location === "default") {
      navigator.geolocation.getCurrentPosition(
        () => checkPermissions(), // Success
        () => checkPermissions(), // Denied
        { enableHighAccuracy: true },
      );
    } else {
      checkPermissions(); // Re-evaluate state
    }
  };

  if (isChecking) return null;

  // If both are granted, render nothing! We are good to go.
  if (perms.notifications === "granted" && perms.location === "granted") {
    return null;
  }

  const isDenied =
    perms.notifications === "denied" || perms.location === "denied";

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] p-4 rounded-xl shadow-2xl z-[9999] flex flex-col gap-3 animate-in slide-in-from-bottom-5 ${
        isDenied ? "bg-red-600 text-white" : "bg-indigo-600 text-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {isDenied ? (
          <MdLockOutline className="text-4xl text-red-200 mt-1 shrink-0" />
        ) : (
          <div className="flex -space-x-2 mt-1 shrink-0">
            <MdLocationOn className="text-3xl text-indigo-200 bg-indigo-600 rounded-full ring-2 ring-indigo-600 relative z-10" />
            <MdNotificationsActive className="text-3xl text-indigo-300 bg-indigo-600 rounded-full ring-2 ring-indigo-600 relative" />
          </div>
        )}

        <div className="text-sm">
          <p className="font-bold text-base">
            {isDenied ? "Permissions Blocked" : "Enable App Features"}
          </p>
          <p
            className={`mt-1 leading-snug ${isDenied ? "text-red-100" : "text-indigo-100"}`}
          >
            {isDenied
              ? "You have blocked location or notifications. Tap the lock icon (🔒) in your browser's URL bar, click 'Site Settings', and allow them. Refresh browser afterwards"
              : "Attend•in requires your location to verify you are in class, and notifications for live session alerts."}
          </p>
        </div>
      </div>

      {!isDenied && (
        <button
          onClick={handleEnableClicks}
          className="bg-white text-indigo-600 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors cursor-pointer w-full mt-1"
        >
          Enable Permissions
        </button>
      )}
    </div>
  );
}
