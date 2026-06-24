import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/server/dashboard";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "No user" }, { status: 400 });

  const data = await getDashboardData(userId);
  return NextResponse.json(data);
}
