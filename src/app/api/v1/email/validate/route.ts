import { NextRequest } from "next/server";
import {
  ok, unauthorized, badRequest, tooManyRequests, internalError, validateBody,
  emailValidationSchema,
} from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";
import { checkRateLimit, RateLimits } from "@/middleware/ratelimit.middleware";

export const runtime = "nodejs";

// POST /api/v1/email/validate
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.EMAIL);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  let body: unknown;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  const { data, error } = validateBody(emailValidationSchema, body);
  if (error) return error;

  // In production: integrate with ZeroBounce / NeverBounce / MillionVerifier
  await new Promise((r) => setTimeout(r, 600));

  const domain = data.email.split("@")[1] ?? "";
  const isDisposable = ["mailinator.com", "tempmail.com", "guerrillamail.com", "10minutemail.com"].includes(domain);
  const isValid = !isDisposable && domain.includes(".");
  const riskScore = isDisposable ? 90 : isValid ? Math.floor(Math.random() * 25) + 5 : 75;

  const result = {
    email: data.email,
    isValid,
    isDisposable,
    isCatchAll: domain.endsWith(".io") || domain.endsWith(".co"),
    mxRecordFound: isValid,
    smtpCheck: isValid && riskScore < 50,
    riskScore,
    confidence: Math.max(0, 100 - riskScore),
    validatedAt: new Date().toISOString(),
  };

  return ok(result);
}
