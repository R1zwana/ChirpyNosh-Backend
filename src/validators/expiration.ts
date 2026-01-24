import { z } from 'zod';

/**
 * Create expiration item validation schema
 */
export const createExpirationSchema = z.object({
    item: z.string().min(2, 'Item name must be at least 2 characters').max(200, 'Item name too long'),
    expiresOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    notes: z.string().max(500, 'Notes too long').optional(),
});

export type CreateExpirationDto = z.infer<typeof createExpirationSchema>;

/**
 * Update expiration item validation schema
 */
export const updateExpirationSchema = z.object({
    item: z.string().min(2).max(200).optional(),
    expiresOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    notes: z.string().max(500).optional().nullable(),
});

export type UpdateExpirationDto = z.infer<typeof updateExpirationSchema>;

/**
 * Expiration ID param validation
 */
export const expirationIdSchema = z.object({
    id: z.string().min(1, 'Expiration item ID is required'),
});
