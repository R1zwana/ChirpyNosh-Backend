import { z } from 'zod';

/**
 * Notification ID param validation
 */
export const notificationIdSchema = z.object({
    id: z.string().min(1, 'Notification ID is required'),
});

/**
 * Notification query validation
 */
export const notificationQuerySchema = z.object({
    unreadOnly: z.string().transform((val) => val === 'true').optional().default('false'),
});

export type NotificationQueryDto = z.infer<typeof notificationQuerySchema>;
