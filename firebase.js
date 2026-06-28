import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Your specific web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB0gQHtDe4z0b3g80knI_J5t68mqVNanQ",
  authDomain: "fcm-for-attendin.firebaseapp.com",
  projectId: "fcm-for-attendin",
  storageBucket: "fcm-for-attendin.firebasestorage.app",
  messagingSenderId: "71690818372",
  appId: "1:71690818372:web:cb63bba9336f0b897fbd11",
  measurementId: "G-P4BGS4YJMB",
};

// Initialize Firebase safely for Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Messaging safely
const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

// The function to generate the token using your VAPID key
export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY, // Make sure you have this in your .env.local file!
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };