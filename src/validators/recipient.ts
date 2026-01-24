import { z } from 'zod';

/**
 * Create recipient validation schema
 */
export const createRecipientSchema = z.object({
    orgName: z.string().min(2, 'Organization name must be at least 2 characters').max(200, 'Name too long'),
    address: z.string().min(5, 'Address must be at least 5 characters').max(500, 'Address too long'),
    capacity: z.number().int().positive('Capacity must be a positive integer'),
    verified: z.boolean().optional().default(false),
});

export type CreateRecipientDto = z.infer<typeof createRecipientSchema>;

/**
 * Update recipient validation schema
 */
export const updateRecipientSchema = z.object({
    orgName: z.string().min(2).max(200).optional(),
    address: z.string().min(5).max(500).optional(),
    capacity: z.number().int().positive().optional(),
    verified: z.boolean().optional(),
});

export type UpdateRecipientDto = z.infer<typeof updateRecipientSchema>;

/**
 * Recipient ID param validation
 */
export const recipientIdSchema = z.object({
    id: z.string().min(1, 'Recipient ID is required'),
});
