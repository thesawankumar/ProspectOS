import { NextRequest } from "next/server";
import {
  ok, created, noContent, unauthorized, badRequest, notFound,
  tooManyRequests, internalError, validateBody, validateQuery, paginationSchema, webhookSchema,
} from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";
import { checkRateLimit, RateLimits } from "@/middleware/ratelimit.middleware";
import { z } from "zod";

export const runtime = "nodejs";

const deleteSchema = z.object({ id: z.string().uuid() });

// GET /api/v1/webhooks
export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import("@/lib/prisma");
      const webhooks = await prisma.webhook.findMany({
        where: { workspaceId: auth.wid },
        orderBy: { createdAt: "desc" },
      });
      return ok(webhooks);
    }

    return ok(MOCK_WEBHOOKS);
  } catch (err) {
    return internalError(err);
  }
}

// POST /api/v1/webhooks
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  let body: unknown;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON"); }

  const { data, error } = validateBody(webhookSchema, body);
  if (error) return error;

  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import("@/lib/prisma");
      const webhook = await prisma.webhook.create({
        data: { workspaceId: auth.wid, url: data.url, events: data.events, secret: data.secret },
      });
      return created(webhook, "Webhook endpoint created");
    }

    return created({
      id: `wh-${Date.now()}`,
      url: data.url,
      events: data.events,
      isActive: true,
      failureCount: 0,
      createdAt: new Date().toISOString(),
    }, "Webhook endpoint created");
  } catch (err) {
    return internalError(err);
  }
}

// DELETE /api/v1/webhooks?id=<uuid>
export async function DELETE(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  const { data: query, error } = validateQuery(deleteSchema, request.nextUrl.searchParams);
  if (error) return error;

  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import("@/lib/prisma");
      const existing = await prisma.webhook.findFirst({ where: { id: query.id, workspaceId: auth.wid } });
      if (!existing) return notFound("Webhook");
      await prisma.webhook.delete({ where: { id: query.id } });
    }

    return noContent();
  } catch (err) {
    return internalError(err);
  }
}

const MOCK_WEBHOOKS = [
  { id: "wh-001", url: "https://hooks.mycrm.com/v1/events", events: ["lead_created", "email_replied"], isActive: true, failureCount: 0, lastDeliveryAt: "2026-06-27T14:30:00Z", createdAt: "2026-06-01T00:00:00Z" },
  { id: "wh-002", url: "https://zapier.com/hooks/catch/12345", events: ["meeting_booked"], isActive: true, failureCount: 2, lastDeliveryAt: "2026-06-26T09:00:00Z", createdAt: "2026-05-20T00:00:00Z" },
];
