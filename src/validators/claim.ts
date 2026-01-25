import { z } from 'zod';
import { ClaimedBy, ClaimStatus } from '@prisma/client';

/**
 * Create claim validation schema
 */
export const createClaimSchema = z.object({
    listingId: z.string().min(1, 'Listing ID is required'),
    claimedBy: z.nativeEnum(ClaimedBy).optional(),
    claimerName: z.string().min(2, 'Claimer name must be at least 2 characters').max(200, 'Name too long').optional(),
    pickupWindow: z.string().min(1, 'Pickup window is required'),
});

export type CreateClaimDto = z.infer<typeof createClaimSchema>;

/**
 * Update claim status validation schema
 */
export const updateClaimStatusSchema = z.object({
    status: z.nativeEnum(ClaimStatus),
});

export type UpdateClaimStatusDto = z.infer<typeof updateClaimStatusSchema>;

/**
 * Claim ID param validation
 */
export const claimIdSchema = z.object({
    id: z.string().min(1, 'Claim ID is required'),
});
