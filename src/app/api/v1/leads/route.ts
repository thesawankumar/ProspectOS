import { NextRequest } from "next/server";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  tooManyRequests,
  internalError,
  validateBody,
  validateQuery,
  createLeadSchema,
  leadQuerySchema,
} from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";
import { checkRateLimit, RateLimits } from "@/middleware/ratelimit.middleware";

export const runtime = "nodejs";

// GET /api/v1/leads — list leads with pagination & filtering
export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  const { data: query, error } = validateQuery(leadQuerySchema, request.nextUrl.searchParams);
  if (error) return error;

  try {
    // Attempt real DB query; fall back to mock if no DATABASE_URL
    if (process.env.DATABASE_URL) {
      const { leadsRepository } = await import("@/repositories/leads.repository");
      const result = await leadsRepository.findAll(auth.wid, query);
      return ok(result);
    }

    // Mock response for development without a database
    return ok({
      data: getMockLeads().slice((query.page - 1) * query.limit, query.page * query.limit),
      total: getMockLeads().length,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(getMockLeads().length / query.limit),
      hasNextPage: query.page * query.limit < getMockLeads().length,
      hasPrevPage: query.page > 1,
    });
  } catch (err) {
    return internalError(err);
  }
}

// POST /api/v1/leads — create a new lead
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.API);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { data, error } = validateBody(createLeadSchema, body);
  if (error) return error;

  try {
    if (process.env.DATABASE_URL) {
      const { leadsRepository } = await import("@/repositories/leads.repository");
      const lead = await leadsRepository.create(auth.wid, data);
      return created(lead, "Lead created successfully");
    }

    // Mock create for dev
    const mockLead = {
      id: `mock-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email ?? null,
      phone: data.phone ?? null,
      jobTitle: data.jobTitle ?? null,
      company: null,
      location: data.location ?? null,
      linkedinUrl: data.linkedinUrl ?? null,
      leadScore: 0,
      stage: data.stage ?? "NEW",
      source: "api",
      isVerified: false,
      tags: data.tags ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return created(mockLead, "Lead created successfully");
  } catch (err) {
    return internalError(err);
  }
}

function getMockLeads() {
  return [
    {
      id: "lead-001",
      firstName: "Sarah",
      lastName: "Chen",
      fullName: "Sarah Chen",
      email: "sarah@techcorp.io",
      phone: "+1-555-0101",
      jobTitle: "VP of Engineering",
      company: { id: "co-001", name: "TechCorp", domain: "techcorp.io", industry: "SaaS", score: 85 },
      location: "San Francisco, CA",
      linkedinUrl: "https://linkedin.com/in/sarahchen",
      leadScore: 92,
      stage: "INTERESTED",
      source: "LinkedIn",
      isVerified: true,
      tags: ["hot-lead", "saas"],
      createdAt: "2026-06-01T10:00:00Z",
      updatedAt: "2026-06-20T14:30:00Z",
    },
    {
      id: "lead-002",
      firstName: "Marcus",
      lastName: "Rivera",
      fullName: "Marcus Rivera",
      email: "m.rivera@agencyX.com",
      phone: "+1-555-0102",
      jobTitle: "Founder",
      company: { id: "co-002", name: "Agency X", domain: "agencyx.com", industry: "Marketing", score: 72 },
      location: "Austin, TX",
      linkedinUrl: null,
      leadScore: 78,
      stage: "CONTACTED",
      source: "Email Campaign",
      isVerified: true,
      tags: ["agency"],
      createdAt: "2026-06-05T09:00:00Z",
      updatedAt: "2026-06-18T11:00:00Z",
    },
  ];
}
