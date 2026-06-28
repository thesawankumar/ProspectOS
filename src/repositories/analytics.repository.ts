import { prisma } from "@/lib/prisma";
import type { AnalyticsSummary, TimeSeriesDataPoint } from "@/types";

export const analyticsRepository = {
  async getSummary(workspaceId: string, days = 30): Promise<AnalyticsSummary> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [emailEvents, leadsAdded, meetingsBooked, activeCampaigns] = await Promise.all([
      prisma.emailEvent.findMany({
        where: {
          occurredAt: { gte: since },
          message: {
            campaign: { workspaceId },
          },
        },
        select: { type: true },
      }),
      prisma.lead.count({ where: { workspaceId, createdAt: { gte: since }, deletedAt: null } }),
      prisma.meeting.count({ where: { workspaceId, createdAt: { gte: since } } }),
      prisma.campaign.count({ where: { workspaceId, status: "ACTIVE", deletedAt: null } }),
    ]);

    const countByType = (type: string) => emailEvents.filter((e) => e.type === type).length;

    const sent = countByType("SENT");
    const delivered = countByType("DELIVERED");
    const opened = countByType("OPENED");
    const clicked = countByType("CLICKED");
    const replied = countByType("REPLIED");
    const bounced = countByType("BOUNCED");

    return {
      emailsSent: sent,
      emailsDelivered: delivered,
      emailsOpened: opened,
      emailsClicked: clicked,
      emailsReplied: replied,
      emailsBounced: bounced,
      meetingsBooked,
      leadsAdded,
      campaignsActive: activeCampaigns,
      openRate: sent > 0 ? Math.round((opened / sent) * 100 * 10) / 10 : 0,
      replyRate: sent > 0 ? Math.round((replied / sent) * 100 * 10) / 10 : 0,
      bounceRate: sent > 0 ? Math.round((bounced / sent) * 100 * 10) / 10 : 0,
      deliveryRate: sent > 0 ? Math.round((delivered / sent) * 100 * 10) / 10 : 0,
    };
  },

  async getTimeSeries(workspaceId: string, days = 30): Promise<TimeSeriesDataPoint[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const events = await prisma.emailEvent.findMany({
      where: {
        occurredAt: { gte: since },
        message: { campaign: { workspaceId } },
      },
      select: { type: true, occurredAt: true },
      orderBy: { occurredAt: "asc" },
    });

    // Group by date
    const byDate: Record<string, TimeSeriesDataPoint> = {};
    for (const e of events) {
      const date = e.occurredAt.toISOString().split("T")[0];
      if (!byDate[date]) {
        byDate[date] = { date, sent: 0, opened: 0, replied: 0, bounced: 0 };
      }
      if (e.type === "SENT") byDate[date].sent++;
      if (e.type === "OPENED") byDate[date].opened++;
      if (e.type === "REPLIED") byDate[date].replied++;
      if (e.type === "BOUNCED") byDate[date].bounced++;
    }

    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  },
};
