import { NextResponse } from "next/server";
import { getAdminByEmail } from "@/lib/admin-store";
import { getAdminSessionToken, hashPassword, verifySessionToken, verifyPassword } from "@/lib/auth";
import { queryDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword.trim() : "";

    if (!currentPassword) {
      return NextResponse.json({ success: false, message: "Please enter your current password." }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ success: false, message: "Password must be at least 4 characters." }, { status: 400 });
    }

    const token = getAdminSessionToken(request.headers.get("cookie") || "", request.headers.get("authorization") || "");
    if (!token) {
      return NextResponse.json({ success: false, message: "You need to be logged in to change the password." }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    const adminEmail = typeof payload?.email === "string" ? payload.email : "";
    if (!adminEmail) {
      return NextResponse.json({ success: false, message: "Your session is invalid. Please sign in again." }, { status: 401 });
    }

    const admin = await getAdminByEmail(adminEmail);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin account was not found." }, { status: 404 });
    }

    const isCurrentPasswordValid = await verifyPassword(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ success: false, message: "The current password is incorrect." }, { status: 401 });
    }

    const hashedPassword = await hashPassword(newPassword);
    await queryDb("UPDATE admins SET password = ? WHERE email = ?", [hashedPassword, admin.email]);

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Password update failed", error);
    return NextResponse.json({ success: false, message: "Password update failed." }, { status: 500 });
  }
}
