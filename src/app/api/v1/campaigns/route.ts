import { NextRequest } from "next/server";
import {
  ok, created, unauthorized, badRequest, tooManyRequests, internalError,
  validateBody, validateQuery, createCampaignSchema, paginationSchema,
} from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";
import { checkRateLimit, RateLimits } from "@/middleware/ratelimit.middleware";
import { z } from "zod";

export const runtime = "nodejs";

// GET /api/v1/campaigns
export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  const schema = paginationSchema.extend({
    status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]).optional(),
  });
  const { data: query, error } = validateQuery(schema, request.nextUrl.searchParams);
  if (error) return error;

  try {
    if (process.env.DATABASE_URL) {
      const { campaignsRepository } = await import("@/repositories/campaigns.repository");
      const result = await campaignsRepository.findAll(auth.wid, query);
      return ok(result);
    }

    return ok({
      data: MOCK_CAMPAIGNS,
      total: MOCK_CAMPAIGNS.length,
      page: query.page,
      limit: query.limit,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  } catch (err) {
    return internalError(err);
  }
}

// POST /api/v1/campaigns
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  let body: unknown;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  const { data, error } = validateBody(createCampaignSchema, body);
  if (error) return error;

  try {
    if (process.env.DATABASE_URL) {
      const { campaignsRepository } = await import("@/repositories/campaigns.repository");
      const campaign = await campaignsRepository.create(auth.wid, data);
      return created(campaign, "Campaign created");
    }

    return created({
      id: `camp-${Date.now()}`, name: data.name, status: "DRAFT",
      leadCount: 0, sentCount: 0, openCount: 0, replyCount: 0, bounceCount: 0,
      openRate: 0, replyRate: 0, dailyLimit: data.dailyLimit ?? 50,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }, "Campaign created");
  } catch (err) {
    return internalError(err);
  }
}

const MOCK_CAMPAIGNS = [
  { id: "camp-001", name: "SaaS Founders Outreach", status: "ACTIVE", leadCount: 340, sentCount: 210, openCount: 89, replyCount: 24, bounceCount: 6, openRate: 42, replyRate: 11, dailyLimit: 50, createdAt: "2026-06-01T00:00:00Z", updatedAt: "2026-06-20T00:00:00Z" },
  { id: "camp-002", name: "Agency Cold Outreach Q2", status: "PAUSED", leadCount: 120, sentCount: 80, openCount: 22, replyCount: 8, bounceCount: 2, openRate: 27, replyRate: 10, dailyLimit: 30, createdAt: "2026-05-15T00:00:00Z", updatedAt: "2026-06-10T00:00:00Z" },
];
