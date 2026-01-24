import prisma from '../lib/prisma';
import { Notification } from '@prisma/client';
import { NotFoundError } from '../middleware/errorHandler';

/**
 * Get all notifications
 */
export async function getAllNotifications(unreadOnly: boolean = false): Promise<Notification[]> {
    const where = unreadOnly ? { read: false } : {};

    return prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit to last 50 notifications
    });
}

/**
 * Get notification by ID
 */
export async function getNotificationById(id: string): Promise<Notification> {
    const notification = await prisma.notification.findUnique({
        where: { id },
    });

    if (!notification) {
        throw new NotFoundError('Notification');
    }

    return notification;
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string): Promise<Notification> {
    // Check if notification exists
    const existing = await prisma.notification.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Notification');
    }

    return prisma.notification.update({
        where: { id },
        data: { read: true },
    });
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<number> {
    const result = await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
    });

    return result.count;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
    return prisma.notification.count({
        where: { read: false },
    });
}

/**
 * Delete old notifications (older than days)
 */
export async function deleteOldNotifications(days: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.notification.deleteMany({
        where: {
            createdAt: { lt: cutoffDate },
            read: true,
        },
    });

    return result.count;
}
