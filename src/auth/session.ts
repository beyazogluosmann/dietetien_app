import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Session =
  | { role: "dietitian"; id: string }
  | { role: "client"; id: string };

function signature(payload: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is missing");
  }

  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function readSession(value: string): Session | null {
  const [payload, sign] = value.split(".");
  if (!payload || !sign) {
    return null;
  }

  const expected = signature(payload);
  const actualBuffer = Buffer.from(sign);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (
      (parsed.role === "dietitian" || parsed.role === "client") &&
      typeof parsed.id === "string"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export async function setSession(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const jar = await cookies();
  jar.set("session", `${payload}.${signature(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete("session");
}

export async function getSession() {
  const jar = await cookies();
  const value = jar.get("session")?.value;
  if (!value) {
    return null;
  }

  return readSession(value);
}
