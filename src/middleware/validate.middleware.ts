import { NextResponse } from "next/server";
import { z, ZodSchema, ZodError } from "zod";
import type { ApiResponse } from "@/types";

// ── Standard response helpers ─────────────────────────────────────────────────

export function ok<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, ...(message ? { message } : {}) }, { status: 200 });
}

export function created<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, ...(message ? { message } : {}) }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, details?: unknown): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: "BAD_REQUEST", message, ...(details !== undefined ? { meta: { details } } : {}) },
    { status: 400 }
  );
}

export function unauthorized(message = "Authentication required"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: "UNAUTHORIZED", message }, { status: 401 });
}

export function forbidden(message = "Insufficient permissions"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: "FORBIDDEN", message }, { status: 403 });
}

export function notFound(entity = "Resource"): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: "NOT_FOUND", message: `${entity} not found` },
    { status: 404 }
  );
}

export function tooManyRequests(retryAfter: number): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: "RATE_LIMITED", message: `Too many requests. Retry after ${retryAfter}s` },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  );
}

export function internalError(error?: unknown): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  console.error("[API Error]", error);
  return NextResponse.json({ success: false, error: "INTERNAL_ERROR", message }, { status: 500 });
}

// ── Zod validation helper ─────────────────────────────────────────────────────

export function validateBody<T>(
  schema: ZodSchema<T>,
  data: unknown
): { data: T; error: null } | { data: null; error: NextResponse } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return { data: null, error: badRequest("Validation failed", issues) };
  }
  return { data: result.data, error: null };
}

export function validateQuery<T>(
  schema: ZodSchema<T>,
  searchParams: URLSearchParams
): { data: T; error: null } | { data: null; error: NextResponse } {
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });
  return validateBody(schema, raw);
}

// ── Common query param schemas ────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => Math.min(v ? parseInt(v, 10) : 25, 100)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
});

export const leadQuerySchema = paginationSchema.extend({
  stage: z
    .enum(["NEW", "CONTACTED", "REPLIED", "INTERESTED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON", "LOST"])
    .optional(),
  companyId: z.string().uuid().optional(),
  minScore: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined)),
  maxScore: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined)),
});

export const createLeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  companyId: z.string().uuid().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  stage: z
    .enum(["NEW", "CONTACTED", "REPLIED", "INTERESTED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON", "LOST"])
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
  replyToEmail: z.string().email().optional(),
  dailyLimit: z.number().int().min(1).max(1000).optional(),
  delayMinutes: z.number().int().min(0).optional(),
  timezone: z.string().optional(),
  trackOpens: z.boolean().optional(),
  trackClicks: z.boolean().optional(),
});

export const emailDiscoverySchema = z.object({
  domain: z.string().optional(),
  companyName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
});

export const emailValidationSchema = z.object({
  email: z.string().email(),
});

export const aiChatSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.record(z.string(), z.unknown()).optional(),
  history: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string(),
        timestamp: z.string(),
      })
    )
    .optional(),
});

export const aiGenerateSchema = z.object({
  type: z.enum(["email", "proposal", "followup", "linkedin"]),
  context: z.object({
    leadName: z.string().optional(),
    company: z.string().optional(),
    services: z.string().optional(),
    tone: z.enum(["formal", "casual", "friendly"]).optional(),
    customInstructions: z.string().optional(),
  }),
});

export const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  secret: z.string().optional(),
});
