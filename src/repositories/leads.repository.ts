import { prisma } from "@/lib/prisma";
import type { CreateLeadRequest, LeadFilterParams, PaginatedResponse, LeadDTO } from "@/types";

function toLeadDTO(lead: any): LeadDTO {
  return {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    fullName: `${lead.firstName} ${lead.lastName}`,
    email: lead.email,
    phone: lead.phone,
    jobTitle: lead.jobTitle,
    company: lead.company
      ? {
          id: lead.company.id,
          name: lead.company.name,
          domain: lead.company.domain,
          website: lead.company.website,
          industry: lead.company.industry,
          size: lead.company.size,
          location: lead.company.location,
          logoUrl: lead.company.logoUrl,
          score: lead.company.score,
          createdAt: lead.company.createdAt.toISOString(),
        }
      : null,
    location: lead.location,
    linkedinUrl: lead.linkedinUrl,
    leadScore: lead.leadScore,
    stage: lead.stage,
    source: lead.source,
    isVerified: lead.isVerified,
    tags: lead.tags?.map((lt: any) => lt.tag.name) ?? [],
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export const leadsRepository = {
  async findAll(
    workspaceId: string,
    params: LeadFilterParams
  ): Promise<PaginatedResponse<LeadDTO>> {
    const {
      page = 1,
      limit = 25,
      sortBy = "createdAt",
      sortOrder = "desc",
      stage,
      search,
      companyId,
      minScore,
      maxScore,
      tags,
    } = params;

    const where: any = {
      workspaceId,
      deletedAt: null,
      ...(stage && { stage }),
      ...(companyId && { companyId }),
      ...(minScore !== undefined && { leadScore: { gte: minScore } }),
      ...(maxScore !== undefined && { leadScore: { lte: maxScore } }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { jobTitle: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(tags?.length && {
        tags: { some: { tag: { name: { in: tags } } } },
      }),
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          company: true,
          tags: { include: { tag: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: leads.map(toLeadDTO),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  },

  async findById(workspaceId: string, id: string): Promise<LeadDTO | null> {
    const lead = await prisma.lead.findFirst({
      where: { id, workspaceId, deletedAt: null },
      include: {
        company: true,
        tags: { include: { tag: true } },
        emailAddresses: true,
        notes: { orderBy: { createdAt: "desc" }, take: 10 },
        tasks: { where: { status: { not: "DONE" } } },
        meetings: { orderBy: { startTime: "desc" }, take: 5 },
        activities: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
    return lead ? toLeadDTO(lead) : null;
  },

  async create(workspaceId: string, data: CreateLeadRequest): Promise<LeadDTO> {
    const lead = await prisma.lead.create({
      data: {
        workspaceId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        jobTitle: data.jobTitle,
        companyId: data.companyId,
        location: data.location,
        linkedinUrl: data.linkedinUrl,
        stage: (data.stage as any) ?? "NEW",
      },
      include: { company: true, tags: { include: { tag: true } } },
    });
    return toLeadDTO(lead);
  },

  async update(
    workspaceId: string,
    id: string,
    data: Partial<CreateLeadRequest> & { leadScore?: number; stage?: string }
  ): Promise<LeadDTO | null> {
    const existing = await prisma.lead.findFirst({ where: { id, workspaceId, deletedAt: null } });
    if (!existing) return null;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle }),
        ...(data.stage && { stage: data.stage as any }),
        ...(data.leadScore !== undefined && { leadScore: data.leadScore }),
      },
      include: { company: true, tags: { include: { tag: true } } },
    });
    return toLeadDTO(lead);
  },

  async softDelete(workspaceId: string, id: string): Promise<boolean> {
    const existing = await prisma.lead.findFirst({ where: { id, workspaceId, deletedAt: null } });
    if (!existing) return false;
    await prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } });
    return true;
  },

  async getStats(workspaceId: string) {
    const [byStage, total, newThisWeek] = await Promise.all([
      prisma.lead.groupBy({
        by: ["stage"],
        where: { workspaceId, deletedAt: null },
        _count: true,
      }),
      prisma.lead.count({ where: { workspaceId, deletedAt: null } }),
      prisma.lead.count({
        where: {
          workspaceId,
          deletedAt: null,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return { byStage, total, newThisWeek };
  },
};
