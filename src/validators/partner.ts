import { z } from 'zod';
import { PartnerType } from '@prisma/client';

/**
 * Create partner validation schema
 */
export const createPartnerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name too long'),
    type: z.nativeEnum(PartnerType),
    address: z.string().min(5, 'Address must be at least 5 characters').max(500, 'Address too long'),
    verified: z.boolean().optional().default(false),
});

export type CreatePartnerDto = z.infer<typeof createPartnerSchema>;

/**
 * Update partner validation schema
 */
export const updatePartnerSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    type: z.nativeEnum(PartnerType).optional(),
    address: z.string().min(5).max(500).optional(),
    verified: z.boolean().optional(),
});

export type UpdatePartnerDto = z.infer<typeof updatePartnerSchema>;

/**
 * Partner ID param validation
 */
export const partnerIdSchema = z.object({
    id: z.string().min(1, 'Partner ID is required'),
});
