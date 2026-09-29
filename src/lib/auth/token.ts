import { SignJWT, jwtVerify } from "jose";

/**
 * Session token helpers. Kept free of `next/headers` and `server-only`
 * so the proxy (which runs before routing) can verify tokens too.
 */
export const SESSION_COOKIE = "siteflip_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production.");
  }
  return new TextEncoder().encode(secret ?? "siteflip-dev-secret-change-me");
}

export async function signSession(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
