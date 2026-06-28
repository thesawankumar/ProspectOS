import { NextRequest } from "next/server";

interface RateLimitStore {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis in production: ioredis + sliding window)
const store = new Map<string, RateLimitStore>();

const CLEANUP_INTERVAL_MS = 60_000;

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, CLEANUP_INTERVAL_MS);

export interface RateLimitConfig {
  /** Maximum requests allowed per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Key prefix to namespace different rate limits */
  prefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Sliding-window rate limiter.
 * Key is derived from IP + optional user ID.
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const userId = request.headers.get("x-user-id") ?? "";
  const prefix = config.prefix ?? "default";
  const key = `rl:${prefix}:${ip}:${userId}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // Start new window
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.limit - 1, resetAt: now + config.windowMs };
  }

  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/** Preset configs for common rate-limit tiers */
export const RateLimits = {
  /** Strict: 20 req / 1 min — for auth endpoints */
  AUTH: { limit: 20, windowMs: 60_000, prefix: "auth" } satisfies RateLimitConfig,
  /** Standard: 300 req / 1 min — for general API */
  API: { limit: 300, windowMs: 60_000, prefix: "api" } satisfies RateLimitConfig,
  /** AI: 30 req / 1 min — for generative endpoints */
  AI: { limit: 30, windowMs: 60_000, prefix: "ai" } satisfies RateLimitConfig,
  /** Email discovery: 50 req / 1 min */
  EMAIL: { limit: 50, windowMs: 60_000, prefix: "email" } satisfies RateLimitConfig,
} as const;
