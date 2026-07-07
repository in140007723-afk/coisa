import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionToken, setAdminSessionCookie } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "coisacomputers@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = createSessionToken({ email, role: "admin", name: "Admin" });
      const nextResponse = NextResponse.json({
        success: true,
        token,
        user: { email, id: 1 },
      });

      setAdminSessionCookie(nextResponse, token);
      nextResponse.headers.set("Cache-Control", "no-store");

      return nextResponse;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
