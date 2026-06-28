import { NextRequest } from "next/server";
import {
  ok, unauthorized, badRequest, tooManyRequests, internalError, validateBody,
} from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";
import { checkRateLimit, RateLimits } from "@/middleware/ratelimit.middleware";
import { z } from "zod";

export const runtime = "nodejs";

const emailDiscoverySchema = z.object({
  domain: z.string().optional(),
  companyName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  instagramUsername: z.string().optional(),
});

// POST /api/v1/email/discover
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.EMAIL);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  let body: unknown;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  const { data, error } = validateBody(emailDiscoverySchema, body);
  if (error) return error;

  if (!data.domain && !data.companyName && !data.firstName) {
    return badRequest("At least one of: domain, companyName, or firstName is required");
  }

  // In production: call Hunter.io / Snov.io / Apollo / custom scraper
  // Here we return realistic mock results
  await new Promise((r) => setTimeout(r, 800)); // simulate API latency

  const domain = data.domain ?? `${(data.companyName ?? "company").toLowerCase().replace(/\s+/g, "")}.com`;
  const firstName = (data.firstName ?? "founder").toLowerCase();
  const lastName = (data.lastName ?? "").toLowerCase();

  const discovered = [
    {
      address: `${firstName}@${domain}`,
      type: "PERSONAL",
      confidence: 87,
      source: "MX + SMTP verification",
      riskLevel: "LOW",
      isVerified: true,
    },
    {
      address: `${firstName}.${lastName || "contact"}@${domain}`,
      type: "PERSONAL",
      confidence: 71,
      source: "Pattern inference",
      riskLevel: "LOW",
      isVerified: false,
    },
    {
      address: `hello@${domain}`,
      type: "GENERIC",
      confidence: 95,
      source: "DNS TXT record",
      riskLevel: "LOW",
      isVerified: true,
    },
    {
      address: `info@${domain}`,
      type: "GENERIC",
      confidence: 88,
      source: "Website scrape",
      riskLevel: "LOW",
      isVerified: true,
    },
    {
      address: `support@${domain}`,
      type: "ROLE_BASED",
      confidence: 78,
      source: "Website scrape",
      riskLevel: "MEDIUM",
      isVerified: false,
    },
  ];

  return ok({
    domain,
    discovered,
    total: discovered.length,
    verifiedCount: discovered.filter((e) => e.isVerified).length,
    searchedAt: new Date().toISOString(),
  });
}
