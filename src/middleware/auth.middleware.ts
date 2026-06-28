import { NextRequest } from "next/server";
import type { JwtPayload } from "@/types";

/**
 * Lightweight auth middleware for API routes.
 * Reads the Bearer token from Authorization header, then decodes
 * the JWT payload. In production, replace with a real JWT verify.
 *
 * Usage:
 *   const payload = await requireAuth(request);
 *   if (!payload) return unauthorized();
 */
export async function requireAuth(request: NextRequest): Promise<JwtPayload | null> {
  try {
    const authHeader = request.headers.get("Authorization");
    const cookieToken = request.cookies.get("prospect_session")?.value;
    const token = authHeader?.replace("Bearer ", "") || cookieToken;

    if (!token) return null;

    // In production: verify with jose or jsonwebtoken
    // const verified = await jwtVerify(token, secret);
    // For now, decode the base64 payload section (no signature check in dev)
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8")) as JwtPayload;

    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Generate a mock JWT for development/testing.
 * Replace with real signing in production.
 */
export function createDevToken(userId: string, workspaceId: string, role = "USER"): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      wid: workspaceId,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
    })
  ).toString("base64url");
  // In prod: sign with secret. Here we use a placeholder signature.
  const sig = Buffer.from("dev-signature").toString("base64url");
  return `${header}.${payload}.${sig}`;
}
