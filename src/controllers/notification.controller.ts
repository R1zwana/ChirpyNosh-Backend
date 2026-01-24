import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services';
import { sendSuccess } from '../utils/apiResponse';

/**
 * Get all notifications
 * GET /api/notifications
 */
export async function getAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const unreadOnly = req.query.unreadOnly === 'true';
        const notifications = await notificationService.getAllNotifications(unreadOnly);
        sendSuccess(res, notifications);
    } catch (error) {
        next(error);
    }
}

/**
 * Get unread count
 * GET /api/notifications/unread-count
 */
export async function getUnreadCount(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const count = await notificationService.getUnreadCount();
        sendSuccess(res, { count });
    } catch (error) {
        next(error);
    }
}

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
export async function markAsRead(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const notification = await notificationService.markAsRead(req.params.id);
        sendSuccess(res, notification, 200, 'Notification marked as read');
    } catch (error) {
        next(error);
    }
}

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
export async function markAllAsRead(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const count = await notificationService.markAllAsRead();
        sendSuccess(res, { markedCount: count }, 200, 'All notifications marked as read');
    } catch (error) {
        next(error);
    }
}
