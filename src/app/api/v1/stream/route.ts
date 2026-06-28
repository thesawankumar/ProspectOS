import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/v1/stream — Server-Sent Events for real-time dashboard updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Simulate SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Helper to send SSE events
      const send = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        try {
          controller.enqueue(encoder.encode(payload));
        } catch {
          // Client disconnected
        }
      };

      // Send heartbeat every 25s to keep connection alive
      const heartbeat = setInterval(() => {
        send("heartbeat", { timestamp: new Date().toISOString() });
      }, 25_000);

      // Simulate real-time events with realistic delays
      const events = [
        { delay: 3000, event: "notification", data: { id: `n-${Date.now()}`, type: "REPLY", title: "New Reply Received", message: "Sarah Chen replied to your outreach: 'Interested in a quick call!'", actionUrl: "/dashboard/campaigns", isRead: false, createdAt: new Date().toISOString() } },
        { delay: 9000, event: "campaign_progress", data: { campaignId: "camp-001", name: "SaaS Founders Outreach", sent: 47, total: 50, openRate: 41, replyRate: 12, timestamp: new Date().toISOString() } },
        { delay: 15000, event: "notification", data: { id: `n-${Date.now() + 1}`, type: "MEETING", title: "Meeting Booked", message: "Marcus Rivera scheduled a 30-min call for tomorrow at 3 PM", actionUrl: "/dashboard/calendar", isRead: false, createdAt: new Date().toISOString() } },
        { delay: 22000, event: "lead_score_change", data: { leadId: "lead-003", name: "Priya Nair", oldScore: 65, newScore: 82, reason: "Opened email 3 times", timestamp: new Date().toISOString() } },
      ];

      // Schedule events
      const timers: ReturnType<typeof setTimeout>[] = [];
      for (const { delay, event, data } of events) {
        const t = setTimeout(() => send(event, data), delay);
        timers.push(t);
      }

      // Cleanup on client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        timers.forEach(clearTimeout);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}
