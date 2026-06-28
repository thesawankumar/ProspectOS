// Features — Auth
// Centralized types, hooks, and server actions for the auth feature.

export type { AuthUser, JwtPayload, LoginRequest, SignupRequest, AuthResponse } from "@/types";

// ── Server Actions ─────────────────────────────────────────────────────────────

export async function loginAction(email: string, password: string) {
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Login failed");
  return res.json();
}

export async function logoutAction() {
  await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
}

export async function signupAction(name: string, email: string, password: string) {
  const res = await fetch("/api/v1/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Signup failed");
  return res.json();
}
