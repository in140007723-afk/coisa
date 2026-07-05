export const maxDuration = 60; // Allows up to 60 seconds for cold starts

import { NextResponse } from "next/server";
import { getAdminSessionToken, verifySessionToken } from "@/lib/auth";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const authHeader = request.headers.get("authorization") || "";
  const token = getAdminSessionToken(cookieHeader, authHeader);

  if (!token) {
    return NextResponse.json({ success: false, error: "No auth token" }, { status: 401 });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
  }

  return NextResponse.json({ success: true, user: payload });
}
