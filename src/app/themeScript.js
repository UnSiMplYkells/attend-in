"use client";

import { useEffect } from "react";

export default function ThemeScript() {
  useEffect(() => {
    const stored = localStorage.getItem("theme");

    if (stored === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      return;
    }

    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      return;
    }

    //default's to dark
    document.documentElement.classList.add("dark");

    // Override with system preference if available
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    if (prefersLight) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null;
}
