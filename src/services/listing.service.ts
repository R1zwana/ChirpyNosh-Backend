import prisma from '../lib/prisma';
import { Listing, Prisma } from '@prisma/client';
import { CreateListingDto, UpdateListingDto, ListingQueryDto } from '../validators/listing';
import { NotFoundError } from '../middleware/errorHandler';
import { PaginationParams } from '../types';

/**
 * Predict the best pickup window based on available windows
 */
function predictWindow(pickupWindows: string[]): string | undefined {
    if (pickupWindows.length === 0) return undefined;
    // Simple prediction: return the last window (most flexible)
    return pickupWindows[pickupWindows.length - 1];
}

export interface PaginatedListings {
    listings: Listing[];
    total: number;
}

/**
 * Get all listings with pagination and filtering
 */
export async function getListings(
    query: ListingQueryDto,
    pagination: PaginationParams
): Promise<PaginatedListings> {
    const where: Prisma.ListingWhereInput = {};

    if (query.category) {
        where.category = query.category;
    }

    if (query.listingType) {
        where.listingType = query.listingType;
    }

    if (query.partnerId) {
        where.partnerId = query.partnerId;
    }

    const [listings, total] = await Promise.all([
        prisma.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: pagination.skip,
            take: pagination.limit,
            include: {
                partner: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        address: true,
                        verified: true,
                    },
                },
            },
        }),
        prisma.listing.count({ where }),
    ]);

    return { listings, total };
}

/**
 * Get listing by ID
 */
export async function getListingById(id: string): Promise<Listing> {
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            partner: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                    address: true,
                    verified: true,
                },
            },
            claims: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!listing) {
        throw new NotFoundError('Listing');
    }

    return listing;
}

/**
 * Create a new listing
 */
export async function createListing(data: CreateListingDto & { partnerId: string }): Promise<Listing> {
    return prisma.listing.create({
        data: {
            title: data.title,
            description: data.description,
            category: data.category,
            listingType: data.listingType,
            quantity: data.quantity,
            priceEur: data.priceEur,
            pickupWindows: data.pickupWindows,
            predictedWindow: predictWindow(data.pickupWindows),
            imageUrl: data.imageUrl,
            partnerId: data.partnerId,
        },
        include: {
            partner: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                },
            },
        },
    });
}

/**
 * Update a listing
 */
export async function updateListing(id: string, data: UpdateListingDto): Promise<Listing> {
    // Check if listing exists
    const existing = await prisma.listing.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Listing');
    }

    const updateData: Prisma.ListingUpdateInput = { ...data };

    // Recalculate predicted window if pickup windows are updated
    if (data.pickupWindows) {
        updateData.predictedWindow = predictWindow(data.pickupWindows);
    }

    return prisma.listing.update({
        where: { id },
        data: updateData,
        include: {
            partner: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                },
            },
        },
    });
}

/**
 * Delete a listing
 */
export async function deleteListing(id: string): Promise<void> {
    // Check if listing exists
    const existing = await prisma.listing.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new NotFoundError('Listing');
    }

    await prisma.listing.delete({
        where: { id },
    });
}
