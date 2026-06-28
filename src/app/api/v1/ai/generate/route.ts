import { NextRequest } from "next/server";
import {
  ok, unauthorized, badRequest, tooManyRequests, internalError, validateBody, aiGenerateSchema,
} from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";
import { checkRateLimit, RateLimits } from "@/middleware/ratelimit.middleware";

export const runtime = "nodejs";

const templates: Record<string, (ctx: Record<string, string | undefined>) => string> = {
  email: (ctx) =>
    `Subject: Quick question for ${ctx.company ?? "your team"}\n\nHi ${ctx.leadName ?? "there"},\n\nI came across ${ctx.company ?? "your company"} and was genuinely impressed by what you're building. I help businesses like yours ${ctx.services ?? "streamline their outreach and grow revenue"}.\n\nI'd love to share a quick idea that might be relevant. Would you be open to a 15-minute call this week?\n\nBest,\n[Your Name]`,

  proposal: (ctx) =>
    `# Service Proposal\n\n**For:** ${ctx.leadName ?? "Client"} · ${ctx.company ?? "Company"}\n\n## Executive Summary\nThis proposal outlines how we'll help ${ctx.company ?? "your organization"} achieve its goals through ${ctx.services ?? "our comprehensive service offerings"}.\n\n## Scope of Work\n1. **Discovery & Audit** — Deep-dive into current processes\n2. **Strategy Development** — Custom roadmap tailored to your goals\n3. **Implementation** — Full hands-on execution with weekly check-ins\n4. **Reporting** — Monthly performance reviews and KPI dashboards\n\n## Investment\nStarting from **$2,500/month** — custom pricing available for annual plans.\n\n## Next Steps\nLet's schedule a 30-minute strategy call to finalize scope.\n\n---\n*Prepared by ProspectOS · ${new Date().toLocaleDateString()}*`,

  followup: (ctx) =>
    `Hi ${ctx.leadName ?? "there"},\n\nJust following up on my previous message — I know inboxes get busy!\n\nI wanted to make sure you had a chance to consider how we could help ${ctx.company ?? "your company"} with ${ctx.services ?? "your goals"}.\n\nHappy to keep it brief — would a 10-minute call work this week?\n\nBest,\n[Your Name]`,

  linkedin: (ctx) =>
    `Hi ${ctx.leadName ?? "there"},\n\nI noticed your work at ${ctx.company ?? "your company"} and was impressed by what you're building.\n\nI work with ${ctx.services ? `companies on ${ctx.services}` : "similar teams"} — would love to connect and share a quick idea that might be relevant.\n\nOpen to connecting?`,
};

// POST /api/v1/ai/generate
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.AI);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  let body: unknown;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  const { data, error } = validateBody(aiGenerateSchema, body);
  if (error) return error;

  await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

  const ctx = {
    leadName: data.context.leadName,
    company: data.context.company,
    services: data.context.services,
  };

  const generated = templates[data.type]?.(ctx) ?? "Unable to generate content for this type.";

  return ok({
    type: data.type,
    content: generated,
    model: "gemini-2.5-pro",
    tokensUsed: Math.floor(Math.random() * 300 + 100),
    generatedAt: new Date().toISOString(),
  });
}
