import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || "coisa-admin-secret";
const ADMIN_SESSION_COOKIE_NAMES = ["admin_session", "coisa_admin_token"];
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function buildCookieOptions(maxAge = 60 * 60 * 8) {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(payload: Record<string, unknown>) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SESSION_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token: string) {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) {
      return null;
    }
    const expectedSignature = createHmac("sha256", SESSION_SECRET).update(`${header}.${body}`).digest("base64url");
    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(signature);
    if (expectedBuffer.length !== actualBuffer.length) {
      return null;
    }
    if (!timingSafeEqual(expectedBuffer, actualBuffer)) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function createNonce() {
  return randomBytes(16).toString("hex");
}

export function getAdminSessionToken(cookieHeader?: string | null, authHeader?: string | null) {
  if (!cookieHeader && !authHeader) {
    return null;
  }

  if (authHeader) {
    const headerValue = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (headerValue) {
      return decodeURIComponent(headerValue.replace(/^"|"$/g, ""));
    }
  }

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((part) => part.trim()).filter(Boolean);
  for (const cookieName of ADMIN_SESSION_COOKIE_NAMES) {
    const cookie = cookies.find((part) => part.startsWith(`${cookieName}=`));
    if (cookie) {
      const value = cookie.slice(cookieName.length + 1).trim();
      return decodeURIComponent(value.replace(/^"|"$/g, ""));
    }
  }

  return null;
}

export function setAdminSessionCookie(response: { cookies: { set: (name: string, value: string, options: Record<string, unknown>) => void } }, token: string) {
  ADMIN_SESSION_COOKIE_NAMES.forEach((cookieName) => {
    response.cookies.set(cookieName, token, buildCookieOptions());
  });
}

export function clearAdminSessionCookie(response: { cookies: { set: (name: string, value: string, options: Record<string, unknown>) => void } }) {
  ADMIN_SESSION_COOKIE_NAMES.forEach((cookieName) => {
    response.cookies.set(cookieName, "", { ...buildCookieOptions(0), maxAge: 0 });
  });
}
