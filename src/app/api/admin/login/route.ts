import { NextResponse } from "next/server";
import { createSessionToken, setAdminSessionCookie, verifyPassword } from "@/lib/auth";
import { getAdminByEmail } from "@/lib/admin-store";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
  }

  const admin = await getAdminByEmail(email);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Invalid login credentials." }, { status: 401 });
  }

  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) {
    return NextResponse.json({ success: false, message: "Invalid login credentials." }, { status: 401 });
  }

  const token = createSessionToken({ email: admin.email, role: admin.role, name: admin.name });
  const response = NextResponse.json({ success: true, message: "Authenticated." });
  setAdminSessionCookie(response, token);

  response.headers.set("Cache-Control", "no-store");
  return response;
}
