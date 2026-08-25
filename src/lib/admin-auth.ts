import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 12; // 12h

export function isAdminAuthenticatedFromCookie(cookieValue: string | undefined) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  // we store a simple signed value: base64(secret) - not cryptographically secure but ok for single-password gate
  // In production use NextAuth or JWT.
  return cookieValue === createAdminToken(secret);
}

export function createAdminToken(secret: string) {
  // deterministic token so we can compare
  return Buffer.from(`admin:${secret}`).toString("base64");
}

export async function setAdminCookie() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD not set");
  const token = createAdminToken(secret);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!isAdminAuthenticatedFromCookie(token)) {
    return false;
  }
  return true;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
