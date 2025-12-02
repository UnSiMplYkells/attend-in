"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/query/useUser";
import Loader from "./ui/Loader";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();

  console.log(isAuthenticated)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return <Loader />;

  return <>{children}</>;
}
