import { NextRequest } from "next/server";
import {
  ok, unauthorized, badRequest, tooManyRequests, internalError, validateBody, aiChatSchema,
} from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";
import { checkRateLimit, RateLimits } from "@/middleware/ratelimit.middleware";

export const runtime = "nodejs";

// POST /api/v1/ai/chat
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(request, RateLimits.AI);
  if (!rl.allowed) return tooManyRequests(rl.retryAfter!);

  const auth = await requireAuth(request);
  if (!auth) return unauthorized();

  let body: unknown;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  const { data, error } = validateBody(aiChatSchema, body);
  if (error) return error;

  // In production: call Google Gemini API / OpenAI with ProspectOS context
  // const response = await gemini.chat({ message: data.message, systemPrompt });

  const response = generateMockAIResponse(data.message);

  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

  return ok({
    response: response.text,
    action: response.action,
    data: response.data,
    messageId: `msg-${Date.now()}`,
    model: "gemini-2.5-pro",
    timestamp: new Date().toISOString(),
  });
}

function generateMockAIResponse(message: string) {
  const msg = message.toLowerCase();

  if (msg.includes("top lead") || msg.includes("best lead") || msg.includes("highest score")) {
    return {
      text: "Here are your top 3 highest-scoring leads this week:\n\n1. **Sarah Chen** (TechCorp) — Score: 92 | Stage: Interested\n2. **Marcus Rivera** (Agency X) — Score: 78 | Stage: Contacted\n3. **Priya Nair** (Finbloom) — Score: 74 | Stage: Replied\n\nSarah has the highest engagement — I'd recommend sending a personalized follow-up today.",
      action: { type: "filter_leads", payload: { sortBy: "leadScore", sortOrder: "desc", limit: 3 } },
      data: null,
    };
  }

  if (msg.includes("today") && msg.includes("repl")) {
    return {
      text: "You received **4 new replies** today:\n\n• **Daniel Park** (NovaTech) — Interested in a 30-min demo\n• **Lena Fischer** (Crisp AI) — Requested pricing info\n• **Omar Abdulla** (FinHub) — Needs 2 weeks before a decision\n• **Ji-woo Kim** (GridFlow) — Out of office, follow up July 5\n\nShall I draft follow-up emails for Daniel and Lena?",
      action: { type: "show_data", payload: { view: "replies", date: "today" } },
      data: null,
    };
  }

  if (msg.includes("generate proposal") || msg.includes("create proposal") || msg.includes("write proposal")) {
    return {
      text: "I'll open the proposal builder for you. Which client is this for? Please provide:\n1. Client name & company\n2. Services you're offering\n3. Pricing or budget range\n\nOr you can navigate directly to **Billing → Proposals → AI Proposal**.",
      action: { type: "navigate", payload: { href: "/dashboard/billing" } },
      data: null,
    };
  }

  if (msg.includes("launch campaign") || msg.includes("start campaign")) {
    return {
      text: "You have **1 campaign ready to launch**: *SaaS Founders Outreach Q3* (240 leads queued, from name configured).\n\nShall I activate it now? It will send up to **50 emails/day** and begin tracking opens and replies automatically.",
      action: { type: "navigate", payload: { href: "/dashboard/campaigns" } },
      data: null,
    };
  }

  if (msg.includes("create invoice") || msg.includes("generate invoice")) {
    return {
      text: "I can help generate an invoice. Please provide:\n• Client name\n• Amount\n• Due date\n\nOr I'll open the invoice generator for you.",
      action: { type: "navigate", payload: { href: "/dashboard/billing" } },
      data: null,
    };
  }

  if (msg.includes("find") && (msg.includes("restaurant") || msg.includes("company") || msg.includes("lead"))) {
    const location = msg.match(/in\s+([a-z\s]+)(?:\.|,|$)/i)?.[1]?.trim() ?? "your target market";
    return {
      text: `🔍 Starting AI-powered lead search for businesses in **${location}**...\n\nWorkflow:\n1. Scanning Google Maps & LinkedIn for relevant businesses\n2. Extracting contact information and email addresses\n3. Validating emails and scoring each lead\n4. Creating a campaign-ready lead list\n\nThis typically finds **50–200 leads** in 2–5 minutes. Head to **Lead Finder** to configure search parameters.`,
      action: { type: "navigate", payload: { href: "/dashboard/leads" } },
      data: null,
    };
  }

  if (msg.includes("analyze") && msg.includes("website")) {
    return {
      text: "I can analyze any company website and provide:\n• Pain points your service addresses\n• Tech stack they're using\n• Personalized pitch angles\n• Recommended email tone\n\nPaste the website URL and I'll run a full AI analysis.",
      action: { type: "navigate", payload: { href: "/dashboard/agent" } },
      data: null,
    };
  }

  if (msg.includes("follow-up") || msg.includes("followup")) {
    return {
      text: "**5 leads** are due for follow-up today:\n\n• Marcus Rivera — Last contacted 3 days ago\n• Priya Nair — Opened email but no reply\n• Chen Wei — Requested callback this week\n• Anna Kovacs — Proposal sent, no response\n• Jae Park — Demo completed, awaiting decision\n\nWant me to generate personalized follow-up emails for all 5?",
      action: null,
      data: null,
    };
  }

  // Default response
  return {
    text: `I'm your ProspectOS AI Assistant. I can help you:\n\n• 🔍 **Find leads** — "Find 100 SaaS companies in Berlin"\n• 📧 **Generate emails** — "Write a cold email for TechCorp"\n• 📊 **Show analytics** — "Show today's replies"\n• 🚀 **Launch campaigns** — "Launch the Q3 campaign"\n• 📄 **Create proposals** — "Generate a proposal for Sarah"\n• 🔗 **Analyze websites** — "Analyze techcorp.io"\n\nWhat would you like to do?`,
    action: null,
    data: null,
  };
}
