"use server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";

export async function requireUser() {
  const user = await getCurrentUser();

  //If no user, redirect immediately (SSR)
  if (!user) {
    redirect("/login");
  }

  return user;
}
