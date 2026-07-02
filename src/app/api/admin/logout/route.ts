import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function GET() {
  const response = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  clearAdminSessionCookie(response);
  return response;
}
