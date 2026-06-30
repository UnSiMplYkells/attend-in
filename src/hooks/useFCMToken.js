"use client";

import { useEffect, useRef, useState } from "react";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/app/utils/supabase/client";
import { fetchToken, messaging } from "../../firebase";

async function getNotificationPermissionAndToken() {
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notification");
    return null;
  }

  // ONLY fetch the token if permission is ALREADY granted.
  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  return null;
}

const useFcmToken = () => {
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState(null);
  const [token, setToken] = useState(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  const loadToken = async () => {
    if (isLoading.current) return;

    isLoading.current = true;
    const fetchedToken = await getNotificationPermissionAndToken();

    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      console.info(
        "%cPush Notifications issue - permission denied",
        "color: green; background: #c7c7c7; padding: 8px; font-size: 20px",
      );
      isLoading.current = false;
      return;
    }

    if (!fetchedToken) {
      if (retryLoadToken.current >= 3) {
        // alert("Unable to load token, refresh the browser");
        console.info(
          "%cPush Notifications issue - unable to load token after 3 retries",
          "color: green; background: #c7c7c7; padding: 8px; font-size: 20px",
        );
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error("An error occurred while retrieving token. Retrying...");
      isLoading.current = false;
      await loadToken();
      return;
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(fetchedToken);

    // alert(
    //   "MOBILE TOKEN:\n\n" +
    //     fetchedToken.substring(0, 10) +
    //     "..." +
    //     fetchedToken.substring(fetchedToken.length - 10),
    // );

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("users")
          .update({ fcm_token: fetchedToken })
          .eq("id", user.id);

        if (error)
          console.error("Error saving FCM token to DB:", error.message);
      }
    } catch (err) {
      console.error("Failed to update user FCM token:", err);
    }

    isLoading.current = false;
  };

  useEffect(() => {
    if ("Notification" in window) {
      loadToken();
    }
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return;

      const m = await messaging();
      if (!m) return;

      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== "granted") return;
        
        const title = payload.data?.title;
        const body = payload.data?.body;
        const link = payload.data?.link;

        if (link) {
          toast(
            (t) => (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span>
                  <b>{title}</b>: {body}
                </span>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push(link);
                  }}
                  style={{
                    padding: "6px 12px",
                    background: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    fontSize: "14px",
                  }}
                >
                  Visit
                </button>
              </div>
            ),
            { duration: 5000 },
          );
        } else {
          toast(`${title}: ${body}`);
        }
      });

      return unsubscribe;
    };

    let unsubscribe = null;

    setupListener().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub;
      }
    });

    return () => unsubscribe?.();
  }, [token, router]);

  return { token, notificationPermissionStatus, requestPermission: loadToken };
};

export default useFcmToken;