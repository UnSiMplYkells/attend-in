import { useQuery } from "@tanstack/react-query";

async function fetchUser() {
  const res = await fetch("/api/auth/user");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  return data.user;
}

export function useUser() {
  const { isLoading, data: user, isError } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity,
    retry: false,
  });

  if (isError) {
    console.error("Critical Auth Error: Server is unreachable")
    return
  }

  return {
    isLoading,
    user,
    isAuthenticated: !!user && user.role === "authenticated"
  };
}
