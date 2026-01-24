import { Router } from 'express';
import { notificationController } from '../controllers';
import { validateParams } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { notificationIdSchema } from '../validators/notification';

const router = Router();

/**
 * GET /api/notifications
 * Get all notifications
 */
router.get('/', authenticate, notificationController.getAll);

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
router.patch('/read-all', authenticate, notificationController.markAllAsRead);

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
router.patch('/:id/read', authenticate, validateParams(notificationIdSchema), notificationController.markAsRead);

export default router;
