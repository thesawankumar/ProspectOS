import { NextRequest } from "next/server";
import {
  ok,
  notFound,
  badRequest,
  noContent,
  unauthorized,
  tooManyRequests,
  internalError,
  validateBody,
} from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";
import { checkRateLimit, RateLimits } from "@/middleware/ratelimit.middleware";
import { z } from "zod";

export const runtime = "nodejs";

const updateLeadSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  stage: z
    .enum(["NEW", "CONTACTED", "REPLIED", "INTERESTED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON", "LOST"])
    .optional(),
  leadScore: z.number().int().min(0).max(100).optional(),
});

// GET /api/v1/leads/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  const { id } = await params;

  try {
    if (process.env.DATABASE_URL) {
      const { leadsRepository } = await import("@/repositories/leads.repository");
      const lead = await leadsRepository.findById(auth.wid, id);
      if (!lead) return notFound("Lead");
      return ok(lead);
    }

    return ok({ id, firstName: "Sarah", lastName: "Chen", fullName: "Sarah Chen", leadScore: 92, stage: "INTERESTED" });
  } catch (err) {
    return internalError(err);
  }
}

// PATCH /api/v1/leads/[id]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { data, error } = validateBody(updateLeadSchema, body);
  if (error) return error;

  try {
    if (process.env.DATABASE_URL) {
      const { leadsRepository } = await import("@/repositories/leads.repository");
      const lead = await leadsRepository.update(auth.wid, id, data);
      if (!lead) return notFound("Lead");
      return ok(lead, "Lead updated");
    }

    return ok({ id, ...data, updatedAt: new Date().toISOString() }, "Lead updated");
  } catch (err) {
    return internalError(err);
  }
}

// DELETE /api/v1/leads/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  const { id } = await params;

  try {
    if (process.env.DATABASE_URL) {
      const { leadsRepository } = await import("@/repositories/leads.repository");
      const deleted = await leadsRepository.softDelete(auth.wid, id);
      if (!deleted) return notFound("Lead");
    }

    return noContent();
  } catch (err) {
    return internalError(err);
  }
}
