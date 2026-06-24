"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

function AuthToastContent() {
  const params = useSearchParams();
  const error = params.get("error");

  useEffect(() => {
    if (!error) return;

    switch (error) {
      case "auth_required":
        toast.error("Please log in to continue");
        break;
      case "unauthorized":
        toast.error("You don't have access to that page");
        break;
      default:
        break;
    }
  }, [error]);

  return null;
}

export default function AuthToast() {
  return (
    <Suspense fallback={null}>
      <AuthToastContent />
    </Suspense>
  );
}
