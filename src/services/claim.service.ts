import prisma from '../lib/prisma';
import { Claim, NotificationType } from '@prisma/client';
import { CreateClaimDto, UpdateClaimStatusDto } from '../validators/claim';
import { NotFoundError, BadRequestError } from '../middleware/errorHandler';

/**
 * Get all claims for a user
 */
export async function getClaimsByUserId(userId: string): Promise<Claim[]> {
    return prisma.claim.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                    category: true,
                    listingType: true,
                    partner: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
}

/**
 * Get all claims for a listing
 */
export async function getClaimsByListingId(listingId: string): Promise<Claim[]> {
    return prisma.claim.findMany({
        where: { listingId },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Create a new claim
 */
export async function createClaim(data: CreateClaimDto & { claimedBy: ClaimedBy; claimerName: string }, userId?: string): Promise<Claim> {
    // Check if listing exists
    const listing = await prisma.listing.findUnique({
        where: { id: data.listingId },
    });

    if (!listing) {
        throw new NotFoundError('Listing');
    }

    // Create claim and notification in a transaction
    const result = await prisma.$transaction(async (tx) => {
        const claim = await tx.claim.create({
            data: {
                listingId: data.listingId,
                claimedBy: data.claimedBy,
                claimerName: data.claimerName,
                pickupWindow: data.pickupWindow,
                userId: userId || null,
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        // Create notification
        await tx.notification.create({
            data: {
                type: NotificationType.claim_created,
                title: 'Food claimed',
                message: `${data.claimerName} claimed a listing for ${data.pickupWindow}`,
            },
        });

        return claim;
    });

    return result;
}

/**
 * Update claim status
 */
export async function updateClaimStatus(
    id: string,
    data: UpdateClaimStatusDto
): Promise<Claim> {
    // Check if claim exists
    const existing = await prisma.claim.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Claim');
    }

    // Validate status transition
    if (existing.status === 'cancelled') {
        throw new BadRequestError('Cannot update a cancelled claim');
    }

    if (existing.status === 'picked_up' && data.status !== 'picked_up') {
        throw new BadRequestError('Cannot change status of a completed pickup');
    }

    // Update claim and create notification in a transaction
    const result = await prisma.$transaction(async (tx) => {
        const claim = await tx.claim.update({
            where: { id },
            data: { status: data.status },
        });

        // Create notification based on status
        let notificationType: NotificationType | null = null;
        let title = '';
        let message = '';

        if (data.status === 'picked_up') {
            notificationType = NotificationType.pickup_confirmed;
            title = 'Pickup completed';
            message = `Pickup confirmed for window ${claim.pickupWindow}. Great job reducing waste!`;
        } else if (data.status === 'cancelled') {
            notificationType = NotificationType.claim_cancelled;
            title = 'Claim cancelled';
            message = `A claim was cancelled for window ${claim.pickupWindow}.`;
        }

        if (notificationType) {
            await tx.notification.create({
                data: {
                    type: notificationType,
                    title,
                    message,
                },
            });
        }

        return claim;
    });

    return result;
}

/**
 * Get claim by ID
 */
export async function getClaimById(id: string): Promise<Claim> {
    const claim = await prisma.claim.findUnique({
        where: { id },
        include: {
            listing: true,
        },
    });

    if (!claim) {
        throw new NotFoundError('Claim');
    }

    return claim;
}
