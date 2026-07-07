import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  clearAdminSessionCookie(response);
  return response;
}
