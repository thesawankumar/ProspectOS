import { prisma } from "@/lib/prisma";
import type { CreateCampaignRequest, CampaignDTO, PaginatedResponse, PaginationParams } from "@/types";

function toCampaignDTO(c: any): CampaignDTO {
  const leadCount = c._count?.leads ?? 0;
  const sentCount = c._count?.messages ?? 0;
  const openCount = c.messages?.filter((m: any) => m.events?.some((e: any) => e.type === "OPENED")).length ?? 0;
  const replyCount = c.messages?.filter((m: any) => m.events?.some((e: any) => e.type === "REPLIED")).length ?? 0;
  const bounceCount = c.messages?.filter((m: any) => m.events?.some((e: any) => e.type === "BOUNCED")).length ?? 0;

  return {
    id: c.id,
    name: c.name,
    description: c.description,
    status: c.status,
    fromEmail: c.fromEmail,
    dailyLimit: c.dailyLimit,
    leadCount,
    sentCount,
    openCount,
    replyCount,
    bounceCount,
    openRate: sentCount > 0 ? Math.round((openCount / sentCount) * 100) : 0,
    replyRate: sentCount > 0 ? Math.round((replyCount / sentCount) * 100) : 0,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export const campaignsRepository = {
  async findAll(
    workspaceId: string,
    params: PaginationParams & { status?: string; search?: string }
  ): Promise<PaginatedResponse<CampaignDTO>> {
    const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", status, search } = params;

    const where: any = {
      workspaceId,
      deletedAt: null,
      ...(status && { status }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    };

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          _count: { select: { leads: true, messages: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.campaign.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: campaigns.map(toCampaignDTO),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  },

  async findById(workspaceId: string, id: string): Promise<CampaignDTO | null> {
    const campaign = await prisma.campaign.findFirst({
      where: { id, workspaceId, deletedAt: null },
      include: {
        _count: { select: { leads: true, messages: true } },
        followUps: { include: { steps: { orderBy: { stepNumber: "asc" } } } },
      },
    });
    return campaign ? toCampaignDTO(campaign) : null;
  },

  async create(workspaceId: string, data: CreateCampaignRequest): Promise<CampaignDTO> {
    const campaign = await prisma.campaign.create({
      data: {
        workspaceId,
        name: data.name,
        description: data.description,
        fromName: data.fromName,
        fromEmail: data.fromEmail,
        replyToEmail: data.replyToEmail,
        dailyLimit: data.dailyLimit ?? 50,
        delayMinutes: data.delayMinutes ?? 60,
        timezone: data.timezone ?? "UTC",
        trackOpens: data.trackOpens ?? true,
        trackClicks: data.trackClicks ?? true,
      },
      include: { _count: { select: { leads: true, messages: true } } },
    });
    return toCampaignDTO(campaign);
  },

  async updateStatus(
    workspaceId: string,
    id: string,
    status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED"
  ): Promise<CampaignDTO | null> {
    const existing = await prisma.campaign.findFirst({ where: { id, workspaceId, deletedAt: null } });
    if (!existing) return null;
    const campaign = await prisma.campaign.update({
      where: { id },
      data: { status },
      include: { _count: { select: { leads: true, messages: true } } },
    });
    return toCampaignDTO(campaign);
  },

  async softDelete(workspaceId: string, id: string): Promise<boolean> {
    const existing = await prisma.campaign.findFirst({ where: { id, workspaceId, deletedAt: null } });
    if (!existing) return false;
    await prisma.campaign.update({ where: { id }, data: { deletedAt: new Date() } });
    return true;
  },
};
