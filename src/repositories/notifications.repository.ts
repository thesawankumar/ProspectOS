import { prisma } from "@/lib/prisma";
import type { NotificationDTO } from "@/types";

function toDTO(n: any): NotificationDTO {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    actionUrl: n.actionUrl,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  };
}

export const notificationsRepository = {
  async findForUser(
    userId: string,
    workspaceId: string,
    { limit = 30, onlyUnread = false }: { limit?: number; onlyUnread?: boolean }
  ): Promise<NotificationDTO[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        workspaceId,
        ...(onlyUnread && { isRead: false }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return notifications.map(toDTO);
  },

  async countUnread(userId: string, workspaceId: string): Promise<number> {
    return prisma.notification.count({ where: { userId, workspaceId, isRead: false } });
  },

  async markRead(userId: string, id: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async markAllRead(userId: string, workspaceId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, workspaceId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async create(data: {
    userId: string;
    workspaceId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
  }): Promise<NotificationDTO> {
    const n = await prisma.notification.create({ data: data as any });
    return toDTO(n);
  },
};
